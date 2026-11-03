-- Professional Programmes.
--
-- A programme is a career track sold as one product. Buying it (or being granted it by an admin) opens every paid
-- course the track contains. Free courses stay free and open to everyone, including inside a programme.
--
-- * tracks gain the same commercial fields courses have (access, price, discount, delivery, enrolment window and the
--   sales-page content), all editable by admins.
-- * programme_enrollments records who holds a programme. Buying also enrols the learner in each paid course of the
--   track, so My Learning, progress and certificates work exactly as they do for any course.
-- * has_course_access() also answers yes for a course that belongs to a programme the learner holds, so access can
--   never lag behind the programme.
-- * course_orders can now be an order for a programme (track_id) instead of a course.
-- * A paid course that is only sold inside programmes has enrolment closed and no price of its own.
-- * Learners who already started a course that becomes paid keep their access.
-- * The programme certificate is included for programme holders who earn the programme badge.
--
-- This migration only adds structure and functions. Which courses and tracks are paid, and at what price, is data
-- the seed writes once (commerce_seeded) and admins edit afterwards.

/* ============================================================ columns */

-- A course sold only inside a programme has no price of its own and is closed to individual enrolment.
alter table public.courses drop constraint courses_paid_has_price;
alter table public.courses add constraint courses_paid_has_price check (access_type = 'free' or enrollment_status = 'closed' or (price is not null and price > 0));
alter table public.courses add column commerce_seeded boolean not null default false;

alter table public.tracks
  add column access_type          text not null default 'free' check (access_type in ('free', 'paid')),
  add column price                numeric(12, 2) check (price is null or price >= 0),
  add column currency             text not null default 'NGN' check (currency ~ '^[A-Z]{3}$'),
  add column discount_price       numeric(12, 2) check (discount_price is null or discount_price >= 0),
  add column discount_active      boolean not null default false,
  add column payment_status       text not null default 'active' check (payment_status in ('active', 'paused')),
  add column delivery_type        text not null default 'self_paced' check (delivery_type in ('self_paced', 'instructor_led', 'hybrid')),
  add column enrollment_status    text not null default 'open' check (enrollment_status in ('open', 'closed')),
  add column enrollment_start     timestamptz,
  add column enrollment_end       timestamptz,
  add column community_access     boolean not null default false,
  add column instructor_support   boolean not null default false,
  add column duration_label       text,
  add column overview             text,
  add column audience             text[] not null default '{}',
  add column outcomes             text[] not null default '{}',
  add column included             text[] not null default '{}',
  add column project_previews     jsonb not null default '[]'::jsonb,
  add column instructor_name      text,
  add column instructor_title     text,
  add column instructor_bio       text,
  add column professional_outcome text,
  add column commerce_seeded      boolean not null default false;

alter table public.tracks add constraint tracks_paid_has_price check (access_type = 'free' or enrollment_status = 'closed' or (price is not null and price > 0));
alter table public.tracks add constraint tracks_discount_below_price check (discount_price is null or price is null or discount_price < price);

/* ============================================================ programme enrolments and orders */

create table public.programme_enrollments (
  user_id     uuid not null references auth.users (id) on delete cascade,
  track_id    text not null references public.tracks (id),
  source      text not null default 'purchase' check (source in ('purchase', 'granted')),
  order_id    uuid,
  enrolled_at timestamptz not null default now(),
  primary key (user_id, track_id)
);
alter table public.programme_enrollments enable row level security;
create policy "read own programme enrolments" on public.programme_enrollments for select using (user_id = auth.uid() or public.is_admin());

alter table public.course_orders add column track_id text references public.tracks (id);
alter table public.course_orders alter column course_id drop not null;
alter table public.course_orders add constraint course_orders_target check ((course_id is not null) <> (track_id is not null));
create unique index course_orders_one_pending_programme on public.course_orders (user_id, track_id) where status = 'pending' and track_id is not null;
alter table public.programme_enrollments add constraint programme_enrollments_order_fk foreign key (order_id) references public.course_orders (id) on delete set null;

/* ============================================================ access */

create or replace function public.has_programme_course_access(p_course text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.programme_enrollments pe
    join public.track_courses tc on tc.track_id = pe.track_id
    where pe.user_id = auth.uid() and tc.course_id = p_course);
$$;
grant execute on function public.has_programme_course_access(text) to anon, authenticated;

create or replace function public.has_course_access(p_course text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.courses c where c.id = p_course and c.access_type = 'free')
      or public.is_admin()
      or exists (select 1 from public.enrollments e where e.user_id = auth.uid() and e.course_id = p_course)
      or public.has_programme_course_access(p_course);
$$;

/* ============================================================ buying a programme */

create or replace function public.programme_charge(p_track public.tracks)
returns numeric language sql immutable as $$
  select case when p_track.discount_active and p_track.discount_price is not null and p_track.discount_price < p_track.price
              then p_track.discount_price else p_track.price end;
$$;

create or replace function public.start_programme_purchase(p_track_id text)
returns public.course_orders
language plpgsql security definer set search_path = public as $$
declare
  v_user   uuid := auth.uid();
  v_track  public.tracks;
  v_order  public.course_orders;
  v_charge numeric;
begin
  if v_user is null then raise exception 'Please sign in first.'; end if;
  select * into v_track from public.tracks where id = p_track_id and published;
  if not found then raise exception 'Programme not found.'; end if;
  if v_track.access_type <> 'paid' then raise exception 'This programme is free.'; end if;
  if v_track.price is null or v_track.price <= 0 or v_track.enrollment_status <> 'open'
     or (v_track.enrollment_start is not null and v_track.enrollment_start > now())
     or (v_track.enrollment_end is not null and v_track.enrollment_end < now()) then
    raise exception 'Enrolment for this programme is not open right now.';
  end if;
  if v_track.payment_status <> 'active' then raise exception 'Payments for this programme are paused. Please try again soon.'; end if;
  if exists (select 1 from public.programme_enrollments where user_id = v_user and track_id = p_track_id) then
    raise exception 'You are already enrolled in this programme.';
  end if;
  v_charge := public.programme_charge(v_track);

  select * into v_order from public.course_orders where user_id = v_user and track_id = p_track_id and status = 'pending';
  if found then
    update public.course_orders set currency = v_track.currency, list_amount = v_track.price, amount = v_charge
      where id = v_order.id returning * into v_order;
    return v_order;
  end if;
  insert into public.course_orders (user_id, track_id, currency, list_amount, amount)
  values (v_user, p_track_id, v_track.currency, v_track.price, v_charge)
  returning * into v_order;
  return v_order;
end;
$$;
revoke execute on function public.start_programme_purchase(text) from public, anon;
grant execute on function public.start_programme_purchase(text) to authenticated;

-- Opens a programme for a learner: the programme enrolment, and an enrolment in every paid course it contains.
create or replace function public.open_programme(p_user uuid, p_track_id text, p_source text, p_order uuid)
returns void
language plpgsql security definer set search_path = public as $$
begin
  insert into public.programme_enrollments (user_id, track_id, source, order_id)
  values (p_user, p_track_id, p_source, p_order)
  on conflict (user_id, track_id) do nothing;
  insert into public.enrollments (user_id, course_id, source, order_id)
  select p_user, tc.course_id, p_source, p_order
    from public.track_courses tc join public.courses c on c.id = tc.course_id
   where tc.track_id = p_track_id and c.access_type = 'paid'
  on conflict (user_id, course_id) do update
    set source = case when public.enrollments.source = 'free' then excluded.source else public.enrollments.source end;
end;
$$;
revoke execute on function public.open_programme(uuid, text, text, uuid) from public, anon, authenticated;

-- The payment functions call this once a payment is confirmed. Safe to repeat.
drop function public.complete_course_order(uuid, text, text);
create function public.complete_course_order(p_order_id uuid, p_provider text, p_reference text)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_order public.course_orders;
begin
  update public.course_orders
     set status = 'paid', provider = p_provider, provider_ref = p_reference, paid_at = coalesce(paid_at, now())
   where id = p_order_id and status in ('pending', 'paid', 'failed', 'cancelled')
  returning * into v_order;
  if not found then raise exception 'Order not found.'; end if;
  if v_order.track_id is not null then
    perform public.open_programme(v_order.user_id, v_order.track_id, 'purchase', v_order.id);
  else
    insert into public.enrollments (user_id, course_id, source, order_id)
    values (v_order.user_id, v_order.course_id, 'purchase', v_order.id)
    on conflict (user_id, course_id) do update set source = case when public.enrollments.source = 'free' then 'purchase' else public.enrollments.source end,
                                                    order_id = coalesce(public.enrollments.order_id, excluded.order_id);
  end if;
end;
$$;
revoke execute on function public.complete_course_order(uuid, text, text) from public, anon, authenticated;
grant execute on function public.complete_course_order(uuid, text, text) to service_role;

/* ============================================================ admin: grant, revoke, lists, stats */

create or replace function public.admin_grant_programme_access(p_user uuid, p_track_id text, p_note text)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_track public.tracks;
  v_order uuid;
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  select * into v_track from public.tracks where id = p_track_id;
  if not found then raise exception 'Programme not found.'; end if;
  if not exists (select 1 from auth.users where id = p_user) then raise exception 'Student not found.'; end if;
  select id into v_order from public.course_orders where user_id = p_user and track_id = p_track_id and status = 'pending';
  if v_order is not null then
    update public.course_orders set status = 'granted', note = nullif(trim(coalesce(p_note, '')), ''), paid_at = now() where id = v_order;
  else
    insert into public.course_orders (user_id, track_id, currency, list_amount, amount, status, note, paid_at)
    values (p_user, p_track_id, v_track.currency, coalesce(v_track.price, 0), 0, 'granted', nullif(trim(coalesce(p_note, '')), ''), now())
    returning id into v_order;
  end if;
  perform public.open_programme(p_user, p_track_id, 'granted', v_order);
end;
$$;
revoke execute on function public.admin_grant_programme_access(uuid, text, text) from public, anon;
grant execute on function public.admin_grant_programme_access(uuid, text, text) to authenticated;

create or replace function public.admin_revoke_programme_access(p_user uuid, p_track_id text, p_reason text)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  delete from public.programme_enrollments where user_id = p_user and track_id = p_track_id;
  -- Paid courses opened by this programme close again unless another programme the learner holds still includes them.
  delete from public.enrollments e
   using public.track_courses tc, public.courses c
   where e.user_id = p_user and tc.track_id = p_track_id and e.course_id = tc.course_id and c.id = e.course_id
     and c.access_type = 'paid' and e.source in ('purchase', 'granted')
     and not exists (select 1 from public.programme_enrollments pe join public.track_courses t2 on t2.track_id = pe.track_id
                      where pe.user_id = p_user and t2.course_id = e.course_id);
  update public.course_orders set status = 'cancelled', note = coalesce(nullif(trim(coalesce(p_reason, '')), ''), note)
   where user_id = p_user and track_id = p_track_id and status in ('pending', 'granted');
end;
$$;
revoke execute on function public.admin_revoke_programme_access(uuid, text, text) from public, anon;
grant execute on function public.admin_revoke_programme_access(uuid, text, text) to authenticated;

create or replace function public.admin_list_programme_enrollments(p_track_id text default null)
returns table (user_id uuid, full_name text, email text, track_id text, track_title text, source text, enrolled_at timestamptz,
               completed_at timestamptz, amount numeric, currency text, order_status text)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  return query
    select pe.user_id, p.full_name, p.email, pe.track_id, coalesce(t.programme_title, t.title), pe.source, pe.enrolled_at,
           (select min(k.issued_at) from public.credentials k where k.user_id = pe.user_id and k.track_id = pe.track_id and k.kind = 'track_completion' and k.status = 'valid'),
           o.amount, o.currency, o.status
    from public.programme_enrollments pe
    join public.tracks t on t.id = pe.track_id
    left join public.profiles p on p.id = pe.user_id
    left join public.course_orders o on o.id = pe.order_id
    where p_track_id is null or pe.track_id = p_track_id
    order by pe.enrolled_at desc
    limit 1000;
end;
$$;
revoke execute on function public.admin_list_programme_enrollments(text) from public, anon;
grant execute on function public.admin_list_programme_enrollments(text) to authenticated;

-- One row per programme: holders, completions (programme badge), revenue, and holders who had taken a free course first.
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
                       (select o.currency, sum(o.amount) as total from public.course_orders o where o.track_id = t.id and o.status = 'paid' group by o.currency) x), '{}'::jsonb),
           (select count(*)::int from public.programme_enrollments pe where pe.track_id = t.id and pe.source = 'purchase'
              and exists (select 1 from public.enrollments f join public.courses fc on fc.id = f.course_id
                           where f.user_id = pe.user_id and fc.access_type = 'free' and f.enrolled_at < pe.enrolled_at))
    from public.tracks t
    where t.access_type = 'paid'
    order by t.position;
end;
$$;
revoke execute on function public.admin_programme_stats() from public, anon;
grant execute on function public.admin_programme_stats() to authenticated;

/* ============================================================ the programme certificate is included */

-- Programme holders who have earned the programme badge get the official certificate with their enrolment: no second charge.
create or replace function public.claim_programme_certificate(p_track_id text)
returns public.certificates
language plpgsql security definer set search_path = public as $$
declare
  v_user  uuid := auth.uid();
  v_track public.tracks;
  v_cred  public.credentials;
  v_order uuid;
  v_cert  public.certificates;
begin
  if v_user is null then raise exception 'Please sign in first.'; end if;
  select * into v_track from public.tracks where id = p_track_id and published;
  if not found then raise exception 'Programme not found.'; end if;
  if not v_track.certificate_enabled then raise exception 'The certificate for this programme isn''t available yet.'; end if;
  if not exists (select 1 from public.programme_enrollments where user_id = v_user and track_id = p_track_id) then
    raise exception 'The certificate is included for learners enrolled in this programme.';
  end if;
  select * into v_cred from public.credentials where user_id = v_user and track_id = p_track_id and kind = 'track_completion' and status = 'valid';
  if not found then raise exception 'Complete every required course and the capstone first, then claim your programme badge.'; end if;
  select * into v_cert from public.certificates where user_id = v_user and track_id = p_track_id and status = 'valid' and source = 'programme';
  if found then return v_cert; end if;

  select id into v_order from public.certificate_orders where user_id = v_user and track_id = p_track_id and status = 'pending';
  if v_order is not null then
    update public.certificate_orders set status = 'granted', note = 'Included with programme enrolment', paid_at = now() where id = v_order;
  else
    insert into public.certificate_orders (user_id, track_id, credential_id, currency, amount, status, note, paid_at)
    values (v_user, p_track_id, v_cred.credential_id, v_track.currency, 0, 'granted', 'Included with programme enrolment', now())
    returning id into v_order;
  end if;
  return public.issue_certificate_for_order(v_order);
end;
$$;
revoke execute on function public.claim_programme_certificate(text) from public, anon;
grant execute on function public.claim_programme_certificate(text) to authenticated;

notify pgrst, 'reload schema';
