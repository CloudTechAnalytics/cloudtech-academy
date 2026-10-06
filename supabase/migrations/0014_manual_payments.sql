-- Manual payments: pay into the Academy's own account instead of through a card processor.
--
-- * Admins configure payment accounts (bank transfer details, other methods) and the payment mode.
-- * A learner picks an account (the "method"), pays the Academy directly, and tells us: their name, the date and a
--   receipt or screenshot. An admin checks the money arrived and confirms it. Nothing opens before that.
-- * A programme can be paid in full or in two parts. The first part, once confirmed, opens the programme. The second part
--   falls due a number of days later. An overdue second part is flagged to admins; access is not removed automatically.
-- * Admins can register a payment themselves (cash, a transfer made outside the site), and edit or delete payments.
--   An order is "partial" once some of it is confirmed and "paid" once all of it is. Taking back every confirmed payment
--   closes the access that payment opened.
-- * The card flow (Paystack) is untouched and can be switched back on with payment_settings.mode.

/* ============================================================ settings, accounts, instalment rules */

create table public.payment_accounts (
  id             uuid primary key default gen_random_uuid(),
  label          text not null,
  bank_name      text,
  account_name   text,
  account_number text,
  instructions   text,
  currency       text not null default 'NGN' check (currency ~ '^[A-Z]{3}$'),
  active         boolean not null default true,
  position       int not null default 0,
  created_at     timestamptz not null default now()
);
alter table public.payment_accounts enable row level security;
create policy "learners read active accounts" on public.payment_accounts for select to authenticated using (active or public.is_admin());
create policy "admins manage accounts" on public.payment_accounts for all using (public.is_admin()) with check (public.is_admin());

create table public.payment_settings (
  id             int primary key default 1 check (id = 1),
  mode           text not null default 'manual' check (mode in ('manual', 'paystack')),
  proof_required boolean not null default true,
  instructions   text
);
insert into public.payment_settings default values;
alter table public.payment_settings enable row level security;
create policy "anyone reads payment settings" on public.payment_settings for select using (true);
create policy "admins update payment settings" on public.payment_settings for update using (public.is_admin()) with check (public.is_admin());

alter table public.tracks
  add column instalments_enabled boolean not null default false,
  add column first_percent       int not null default 50 check (first_percent between 10 and 90),
  add column second_due_days     int not null default 30 check (second_due_days between 1 and 365);
update public.tracks set instalments_enabled = true where access_type = 'paid';

alter table public.course_orders drop constraint course_orders_status_check;
alter table public.course_orders add constraint course_orders_status_check check (status in ('pending', 'partial', 'paid', 'granted', 'failed', 'cancelled'));

/* ============================================================ payments */

create table public.order_payments (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid not null references public.course_orders (id) on delete cascade,
  user_id         uuid not null references auth.users (id) on delete cascade,
  part            int not null default 1 check (part between 1 and 2),
  amount          numeric(12, 2) not null check (amount >= 0),
  currency        text not null,
  due_at          timestamptz,
  status          text not null default 'pending' check (status in ('pending', 'submitted', 'confirmed', 'rejected')),
  account_id      uuid references public.payment_accounts (id) on delete set null,
  account_label   text,
  reference       text not null unique,
  payer_name      text,
  paid_on         date,
  proof_path      text,
  note            text,
  rejected_reason text,
  source          text not null default 'student' check (source in ('student', 'admin')),
  confirmed_at    timestamptz,
  confirmed_by    uuid references auth.users (id) on delete set null,
  created_at      timestamptz not null default now()
);
create index order_payments_order_idx on public.order_payments (order_id);
create index order_payments_user_idx on public.order_payments (user_id);
alter table public.order_payments enable row level security;
create policy "read own payments" on public.order_payments for select using (user_id = auth.uid() or public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('payment-proofs', 'payment-proofs', false, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'application/pdf'])
on conflict (id) do nothing;
create policy "upload own payment proof" on storage.objects for insert to authenticated
  with check (bucket_id = 'payment-proofs' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "read own or admin payment proof" on storage.objects for select to authenticated
  using (bucket_id = 'payment-proofs' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));
create policy "admins delete payment proof" on storage.objects for delete to authenticated
  using (bucket_id = 'payment-proofs' and public.is_admin());

create or replace function public.new_payment_reference()
returns text language plpgsql as $$
declare
  v text;
begin
  loop
    v := 'PAY-' || to_char(now(), 'YYMM') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
    exit when not exists (select 1 from public.order_payments where reference = v);
  end loop;
  return v;
end;
$$;

/* ============================================================ access follows confirmed money */

create or replace function public.grant_for_order(p_order uuid)
returns void
language plpgsql security definer set search_path = public as $$
declare
  o public.course_orders;
begin
  select * into o from public.course_orders where id = p_order;
  if not found then return; end if;
  if o.track_id is not null then
    perform public.open_programme(o.user_id, o.track_id, 'purchase', o.id);
  else
    insert into public.enrollments (user_id, course_id, source, order_id)
    values (o.user_id, o.course_id, 'purchase', o.id)
    on conflict (user_id, course_id) do update set source = case when public.enrollments.source = 'free' then 'purchase' else public.enrollments.source end,
                                                    order_id = coalesce(public.enrollments.order_id, excluded.order_id);
  end if;
end;
$$;
revoke execute on function public.grant_for_order(uuid) from public, anon, authenticated;

create or replace function public.revoke_for_order(p_order uuid)
returns void
language plpgsql security definer set search_path = public as $$
declare
  o public.course_orders;
begin
  select * into o from public.course_orders where id = p_order;
  if not found then return; end if;
  if o.track_id is not null then
    delete from public.programme_enrollments where user_id = o.user_id and track_id = o.track_id and order_id = p_order;
    delete from public.enrollments e
     using public.track_courses tc, public.courses c
     where e.user_id = o.user_id and tc.track_id = o.track_id and e.course_id = tc.course_id and c.id = e.course_id
       and c.access_type = 'paid' and e.source = 'purchase' and e.order_id = p_order
       and not exists (select 1 from public.programme_enrollments pe join public.track_courses t2 on t2.track_id = pe.track_id
                        where pe.user_id = o.user_id and t2.course_id = e.course_id);
  else
    delete from public.enrollments where user_id = o.user_id and course_id = o.course_id and source = 'purchase' and order_id = p_order;
  end if;
end;
$$;
revoke execute on function public.revoke_for_order(uuid) from public, anon, authenticated;

-- Recomputes an order from its confirmed payments: partial or paid, opening access when money is confirmed and
-- closing it again when none is left.
create or replace function public.recompute_order(p_order uuid)
returns void
language plpgsql security definer set search_path = public as $$
declare
  o     public.course_orders;
  v_sum numeric;
  v_n   int;
begin
  select * into o from public.course_orders where id = p_order;
  if not found then return; end if;
  select coalesce(sum(amount), 0), count(*) into v_sum, v_n from public.order_payments where order_id = p_order and status = 'confirmed';
  if v_n > 0 then
    update public.course_orders
       set status = case when v_sum >= amount then 'paid' else 'partial' end,
           provider = coalesce(provider, 'manual'),
           paid_at = case when v_sum >= amount then coalesce(paid_at, now()) else null end
     where id = p_order;
    perform public.grant_for_order(p_order);
  elsif o.status in ('paid', 'partial') then
    update public.course_orders set status = 'pending', paid_at = null where id = p_order;
    perform public.revoke_for_order(p_order);
  end if;
end;
$$;
revoke execute on function public.recompute_order(uuid) from public, anon, authenticated;

/* ============================================================ learner: start, pay, report */

-- Starts the learner's order for a course or programme and its payment parts. plan is 'full' or 'two_part'.
-- Returns the order id; the learner reads the order and its payments through row-level security.
create or replace function public.start_manual_order(p_kind text, p_id text, p_plan text)
returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_user    uuid := auth.uid();
  v_order   public.course_orders;
  v_price   numeric;
  v_charge  numeric;
  v_cur     text;
  v_track   public.tracks;
  v_course  public.courses;
  v_first   numeric;
begin
  if v_user is null then raise exception 'Please sign in first.'; end if;
  if p_plan not in ('full', 'two_part') then raise exception 'Choose how you want to pay.'; end if;

  if p_kind = 'programme' then
    select * into v_track from public.tracks where id = p_id and published;
    if not found then raise exception 'Programme not found.'; end if;
    if v_track.access_type <> 'paid' then raise exception 'This programme is free.'; end if;
    if v_track.price is null or v_track.price <= 0 or v_track.enrollment_status <> 'open'
       or (v_track.enrollment_start is not null and v_track.enrollment_start > now())
       or (v_track.enrollment_end is not null and v_track.enrollment_end < now()) then
      raise exception 'Enrolment for this programme is not open right now.';
    end if;
    if v_track.payment_status <> 'active' then raise exception 'Payments for this programme are paused. Please try again soon.'; end if;
    if exists (select 1 from public.programme_enrollments where user_id = v_user and track_id = p_id) then
      raise exception 'You are already enrolled in this programme.';
    end if;
    if p_plan = 'two_part' and not v_track.instalments_enabled then raise exception 'This programme is paid in one payment.'; end if;
    v_price := v_track.price; v_charge := public.programme_charge(v_track); v_cur := v_track.currency;
  elsif p_kind = 'course' then
    select * into v_course from public.courses where id = p_id and published;
    if not found then raise exception 'Course not found.'; end if;
    if v_course.access_type <> 'paid' then raise exception 'This course is free: you can start it without paying.'; end if;
    if v_course.price is null or v_course.price <= 0 or v_course.enrollment_status <> 'open'
       or (v_course.enrollment_start is not null and v_course.enrollment_start > now())
       or (v_course.enrollment_end is not null and v_course.enrollment_end < now()) then
      raise exception 'Enrolment for this course is not open right now.';
    end if;
    if v_course.payment_status <> 'active' then raise exception 'Payments for this course are paused. Please try again soon.'; end if;
    if exists (select 1 from public.enrollments where user_id = v_user and course_id = p_id) then raise exception 'You are already enrolled in this course.'; end if;
    if p_plan = 'two_part' then raise exception 'Courses are paid in one payment.'; end if;
    v_price := v_course.price; v_charge := public.course_charge(v_course); v_cur := v_course.currency;
  else
    raise exception 'Unknown purchase.';
  end if;

  select * into v_order from public.course_orders
   where user_id = v_user and status in ('pending', 'partial')
     and ((p_kind = 'programme' and track_id = p_id) or (p_kind = 'course' and course_id = p_id));
  if found then
    -- A started order that has no money in it yet can change its plan; one with payments in progress is returned as it is.
    if v_order.status = 'partial' or exists (select 1 from public.order_payments where order_id = v_order.id and status in ('submitted', 'confirmed')) then
      return v_order.id;
    end if;
    delete from public.order_payments where order_id = v_order.id;
    update public.course_orders set currency = v_cur, list_amount = v_price, amount = v_charge where id = v_order.id returning * into v_order;
  else
    insert into public.course_orders (user_id, course_id, track_id, currency, list_amount, amount, provider)
    values (v_user, case when p_kind = 'course' then p_id end, case when p_kind = 'programme' then p_id end, v_cur, v_price, v_charge, 'manual')
    returning * into v_order;
  end if;

  if p_plan = 'full' then
    insert into public.order_payments (order_id, user_id, part, amount, currency, reference) values (v_order.id, v_user, 1, v_charge, v_cur, public.new_payment_reference());
  else
    v_first := round(v_charge * v_track.first_percent / 100.0, 2);
    insert into public.order_payments (order_id, user_id, part, amount, currency, reference) values (v_order.id, v_user, 1, v_first, v_cur, public.new_payment_reference());
    insert into public.order_payments (order_id, user_id, part, amount, currency, reference) values (v_order.id, v_user, 2, v_charge - v_first, v_cur, public.new_payment_reference());
  end if;
  return v_order.id;
end;
$$;
revoke execute on function public.start_manual_order(text, text, text) from public, anon;
grant execute on function public.start_manual_order(text, text, text) to authenticated;

-- The learner says they have paid a part: which account, their name, the date, and a receipt in the payment-proofs bucket.
create or replace function public.submit_payment(p_payment_id uuid, p_account_id uuid, p_payer_name text, p_paid_on date, p_proof_path text, p_note text)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  p      public.order_payments;
  a      public.payment_accounts;
  s      public.payment_settings;
begin
  if v_user is null then raise exception 'Please sign in first.'; end if;
  select * into p from public.order_payments where id = p_payment_id and user_id = v_user;
  if not found then raise exception 'Payment not found.'; end if;
  if p.status not in ('pending', 'rejected') then raise exception 'This payment has already been sent for confirmation.'; end if;
  if p.part = 2 and not exists (select 1 from public.order_payments where order_id = p.order_id and part = 1 and status = 'confirmed') then
    raise exception 'The first payment must be confirmed before the second.';
  end if;
  select * into a from public.payment_accounts where id = p_account_id and active;
  if not found then raise exception 'Choose a payment method.'; end if;
  select * into s from public.payment_settings where id = 1;
  if s.proof_required and coalesce(p_proof_path, '') = '' then raise exception 'Upload your receipt or a screenshot of the payment.'; end if;
  if coalesce(p_proof_path, '') <> '' and split_part(p_proof_path, '/', 1) <> v_user::text then raise exception 'Invalid receipt.'; end if;
  if length(trim(coalesce(p_payer_name, ''))) < 2 then raise exception 'Enter the name on the account you paid from.'; end if;
  update public.order_payments
     set status = 'submitted', account_id = a.id, account_label = a.label, payer_name = trim(p_payer_name), paid_on = coalesce(p_paid_on, current_date),
         proof_path = nullif(p_proof_path, ''), note = nullif(trim(coalesce(p_note, '')), ''), rejected_reason = null
   where id = p.id;
end;
$$;
revoke execute on function public.submit_payment(uuid, uuid, text, date, text, text) from public, anon;
grant execute on function public.submit_payment(uuid, uuid, text, date, text, text) to authenticated;

/* ============================================================ admin: confirm, reject, register, edit, delete */

create or replace function public.admin_confirm_payment(p_payment_id uuid, p_note text)
returns void
language plpgsql security definer set search_path = public as $$
declare
  p      public.order_payments;
  o      public.course_orders;
  v_days int;
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  select * into p from public.order_payments where id = p_payment_id;
  if not found then raise exception 'Payment not found.'; end if;
  update public.order_payments
     set status = 'confirmed', confirmed_at = now(), confirmed_by = auth.uid(), rejected_reason = null,
         note = coalesce(nullif(trim(coalesce(p_note, '')), ''), note)
   where id = p.id;
  select * into o from public.course_orders where id = p.order_id;
  -- The second part falls due a set number of days after the first is confirmed.
  if p.part = 1 then
    select coalesce(t.second_due_days, 30) into v_days from public.tracks t where t.id = o.track_id;
    update public.order_payments set due_at = now() + make_interval(days => coalesce(v_days, 30)) where order_id = p.order_id and part = 2 and due_at is null;
  end if;
  perform public.recompute_order(p.order_id);
end;
$$;
revoke execute on function public.admin_confirm_payment(uuid, text) from public, anon;
grant execute on function public.admin_confirm_payment(uuid, text) to authenticated;

create or replace function public.admin_reject_payment(p_payment_id uuid, p_reason text)
returns void
language plpgsql security definer set search_path = public as $$
declare
  p public.order_payments;
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  select * into p from public.order_payments where id = p_payment_id;
  if not found then raise exception 'Payment not found.'; end if;
  update public.order_payments set status = 'rejected', rejected_reason = nullif(trim(coalesce(p_reason, '')), '') where id = p.id;
  perform public.recompute_order(p.order_id);
end;
$$;
revoke execute on function public.admin_reject_payment(uuid, text) from public, anon;
grant execute on function public.admin_reject_payment(uuid, text) to authenticated;

-- Records money received outside the site (cash, a transfer): confirmed straight away, on the learner's open order or a new one.
create or replace function public.admin_register_payment(p_user uuid, p_kind text, p_id text, p_amount numeric, p_method text, p_reference text, p_note text, p_paid_on date)
returns uuid
language plpgsql security definer set search_path = public as $$
declare
  o       public.course_orders;
  v_track public.tracks;
  v_course public.courses;
  v_price numeric;
  v_charge numeric;
  v_cur   text;
  v_n     int;
  v_id    uuid;
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  if not exists (select 1 from auth.users where id = p_user) then raise exception 'Student not found.'; end if;
  if p_amount is null or p_amount <= 0 then raise exception 'Enter the amount received.'; end if;
  select * into o from public.course_orders
   where user_id = p_user and status in ('pending', 'partial') and ((p_kind = 'programme' and track_id = p_id) or (p_kind = 'course' and course_id = p_id));
  if not found then
    if p_kind = 'programme' then
      select * into v_track from public.tracks where id = p_id;
      if not found then raise exception 'Programme not found.'; end if;
      v_price := coalesce(v_track.price, p_amount); v_charge := case when v_track.price is null then p_amount else public.programme_charge(v_track) end; v_cur := v_track.currency;
    else
      select * into v_course from public.courses where id = p_id;
      if not found then raise exception 'Course not found.'; end if;
      v_price := coalesce(v_course.price, p_amount); v_charge := case when v_course.price is null then p_amount else public.course_charge(v_course) end; v_cur := v_course.currency;
    end if;
    insert into public.course_orders (user_id, course_id, track_id, currency, list_amount, amount, provider)
    values (p_user, case when p_kind = 'course' then p_id end, case when p_kind = 'programme' then p_id end, v_cur, v_price, v_charge, 'manual')
    returning * into o;
  end if;
  select count(*) into v_n from public.order_payments where order_id = o.id;
  insert into public.order_payments (order_id, user_id, part, amount, currency, status, account_label, reference, paid_on, note, source, confirmed_at, confirmed_by)
  values (o.id, p_user, least(v_n + 1, 2), p_amount, o.currency, 'confirmed', nullif(trim(coalesce(p_method, '')), ''),
          coalesce(nullif(trim(coalesce(p_reference, '')), ''), public.new_payment_reference()), coalesce(p_paid_on, current_date),
          nullif(trim(coalesce(p_note, '')), ''), 'admin', now(), auth.uid())
  returning id into v_id;
  perform public.recompute_order(o.id);
  return v_id;
end;
$$;
revoke execute on function public.admin_register_payment(uuid, text, text, numeric, text, text, text, date) from public, anon;
grant execute on function public.admin_register_payment(uuid, text, text, numeric, text, text, text, date) to authenticated;

create or replace function public.admin_update_payment(p_payment_id uuid, p_amount numeric, p_status text, p_method text, p_note text, p_paid_on date)
returns void
language plpgsql security definer set search_path = public as $$
declare
  p public.order_payments;
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  if p_status not in ('pending', 'submitted', 'confirmed', 'rejected') then raise exception 'Unknown status.'; end if;
  if p_amount is null or p_amount < 0 then raise exception 'Enter a valid amount.'; end if;
  select * into p from public.order_payments where id = p_payment_id;
  if not found then raise exception 'Payment not found.'; end if;
  update public.order_payments
     set amount = p_amount, status = p_status, account_label = nullif(trim(coalesce(p_method, '')), ''), note = nullif(trim(coalesce(p_note, '')), ''),
         paid_on = p_paid_on,
         confirmed_at = case when p_status = 'confirmed' then coalesce(confirmed_at, now()) else null end,
         confirmed_by = case when p_status = 'confirmed' then coalesce(confirmed_by, auth.uid()) else null end
   where id = p.id;
  perform public.recompute_order(p.order_id);
end;
$$;
revoke execute on function public.admin_update_payment(uuid, numeric, text, text, text, date) from public, anon;
grant execute on function public.admin_update_payment(uuid, numeric, text, text, text, date) to authenticated;

-- Deleting a payment removes it from the books (the receipt file is removed by the app through the storage API). If no confirmed money is left on the order, the access it opened closes.
create or replace function public.admin_delete_payment(p_payment_id uuid)
returns void
language plpgsql security definer set search_path = public as $$
declare
  p public.order_payments;
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  select * into p from public.order_payments where id = p_payment_id;
  if not found then raise exception 'Payment not found.'; end if;
  delete from public.order_payments where id = p.id;
  perform public.recompute_order(p.order_id);
end;
$$;
revoke execute on function public.admin_delete_payment(uuid) from public, anon;
grant execute on function public.admin_delete_payment(uuid) to authenticated;

create or replace function public.admin_list_payments()
returns table (id uuid, order_id uuid, user_id uuid, full_name text, email text, course_id text, track_id text, target_title text, part int, amount numeric,
               currency text, due_at timestamptz, status text, account_label text, reference text, payer_name text, paid_on date, proof_path text, note text,
               rejected_reason text, source text, confirmed_at timestamptz, created_at timestamptz, order_status text, order_amount numeric)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  return query
    select p.id, p.order_id, p.user_id, pr.full_name, pr.email, o.course_id, o.track_id, coalesce(t.programme_title, t.title, c.title), p.part, p.amount,
           p.currency, p.due_at, p.status, p.account_label, p.reference, p.payer_name, p.paid_on, p.proof_path, p.note, p.rejected_reason, p.source,
           p.confirmed_at, p.created_at, o.status, o.amount
    from public.order_payments p
    join public.course_orders o on o.id = p.order_id
    left join public.profiles pr on pr.id = p.user_id
    left join public.tracks t on t.id = o.track_id
    left join public.courses c on c.id = o.course_id
    order by p.created_at desc
    limit 1000;
end;
$$;
revoke execute on function public.admin_list_payments() from public, anon;
grant execute on function public.admin_list_payments() to authenticated;

/* ============================================================ revenue counts confirmed money */

create or replace function public.order_revenue(p_order public.course_orders)
returns numeric language sql stable as $$
  select case when exists (select 1 from public.order_payments p where p.order_id = p_order.id)
              then (select coalesce(sum(p.amount), 0) from public.order_payments p where p.order_id = p_order.id and p.status = 'confirmed')
              when p_order.status = 'paid' then p_order.amount else 0 end;
$$;

create or replace function public.admin_programme_stats()
returns table (track_id text, title text, access_type text, published boolean, price numeric, currency text,
               enrollments int, paid_enrollments int, granted_enrollments int, completions int, revenue jsonb, converted int)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  return query
    select t.id, coalesce(t.programme_title, t.title), t.access_type, t.published, t.price, t.currency,
           (select count(*)::int from public.programme_enrollments pe where pe.track_id = t.id),
           (select count(*)::int from public.programme_enrollments pe where pe.track_id = t.id and pe.source = 'purchase'),
           (select count(*)::int from public.programme_enrollments pe where pe.track_id = t.id and pe.source = 'granted'),
           (select count(distinct k.user_id)::int from public.credentials k where k.track_id = t.id and k.kind = 'track_completion' and k.status = 'valid'
              and exists (select 1 from public.programme_enrollments pe where pe.track_id = t.id and pe.user_id = k.user_id)),
           coalesce((select jsonb_object_agg(x.currency, x.total) from
                       (select o.currency, sum(public.order_revenue(o)) as total from public.course_orders o where o.track_id = t.id group by o.currency having sum(public.order_revenue(o)) > 0) x), '{}'::jsonb),
           (select count(*)::int from public.programme_enrollments pe where pe.track_id = t.id and pe.source = 'purchase'
              and exists (select 1 from public.enrollments f join public.courses fc on fc.id = f.course_id
                           where f.user_id = pe.user_id and fc.access_type = 'free' and f.enrolled_at < pe.enrolled_at))
    from public.tracks t
    where t.access_type = 'paid'
    order by t.position;
end;
$$;

create or replace function public.admin_course_stats()
returns table (course_id text, title text, course_type text, access_type text, published boolean, price numeric, currency text,
               enrollments int, free_enrollments int, paid_enrollments int, granted_enrollments int, completions int,
               revenue jsonb, converted int)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  return query
    select c.id, c.title, c.course_type, c.access_type, c.published, c.price, c.currency,
           (select count(*)::int from public.enrollments e where e.course_id = c.id),
           (select count(*)::int from public.enrollments e where e.course_id = c.id and e.source = 'free'),
           (select count(*)::int from public.enrollments e where e.course_id = c.id and e.source = 'purchase'),
           (select count(*)::int from public.enrollments e where e.course_id = c.id and e.source = 'granted'),
           (select count(*)::int from public.enrollments e where e.course_id = c.id
              and (e.completed_at is not null or exists (select 1 from public.credentials k where k.user_id = e.user_id and k.course_id = c.id and k.kind = 'course_completion' and k.status = 'valid'))),
           coalesce((select jsonb_object_agg(x.currency, x.total) from
                       (select o.currency, sum(public.order_revenue(o)) as total from public.course_orders o where o.course_id = c.id group by o.currency having sum(public.order_revenue(o)) > 0) x), '{}'::jsonb),
           case when c.access_type = 'paid' then
             (select count(*)::int from public.enrollments e where e.course_id = c.id and e.source = 'purchase'
                and exists (select 1 from public.enrollments f join public.courses fc on fc.id = f.course_id
                             where f.user_id = e.user_id and fc.access_type = 'free' and f.enrolled_at < e.enrolled_at))
           else
             (select count(distinct e.user_id)::int from public.enrollments e
               where e.course_id = c.id
                 and exists (select 1 from public.enrollments f join public.courses fc on fc.id = f.course_id
                              where f.user_id = e.user_id and fc.access_type = 'paid' and f.source = 'purchase' and f.enrolled_at > e.enrolled_at))
           end
    from public.courses c
    order by c.position;
end;
$$;

notify pgrst, 'reload schema';
