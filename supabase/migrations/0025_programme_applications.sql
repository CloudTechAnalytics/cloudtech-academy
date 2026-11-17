-- Programme applications: a shareable enrolment form for the Professional Programmes.
--
-- * Admins set up batches for each programme: when it starts, the class schedule, how it runs, the last day to apply
--   and how many seats it has. Anyone can read the open batches.
-- * Anyone can apply from the link, with no account, through submit_programme_application(). It checks the programme
--   and batch are open, saves the application with a reference, and returns the fee, the instalment split and the
--   accounts to pay into. Applying twice for the same programme updates the open application instead of adding one.
-- * The applicant gets a confirmation email with the payment details, and the Academy gets a notice at its reply-to address.
-- * An admin records each payment against the application. If the applicant already has an account (same email), the
--   payment becomes a confirmed payment on a normal programme order straight away, which opens the programme. If not,
--   they're emailed a link to create their account, and the programme opens as soon as they do.

/* ============================================================ batches */

create table public.programme_batches (
  id         uuid primary key default gen_random_uuid(),
  track_id   text not null references public.tracks (id) on delete cascade,
  name       text not null check (length(trim(name)) between 2 and 80),
  starts_on  date,
  schedule   text,
  mode       text not null default 'online' check (mode in ('online', 'physical', 'hybrid')),
  location   text,
  apply_by   date,
  seats      int check (seats is null or seats > 0),
  status     text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now()
);
create index programme_batches_track_idx on public.programme_batches (track_id, starts_on);
alter table public.programme_batches enable row level security;
create policy "anyone reads open batches" on public.programme_batches for select using (status = 'open' or public.is_admin());
create policy "admins manage batches" on public.programme_batches for all using (public.is_admin()) with check (public.is_admin());

/* ============================================================ applications */

create table public.programme_applications (
  id           uuid primary key default gen_random_uuid(),
  reference    text not null unique,
  track_id     text not null references public.tracks (id) on delete cascade,
  batch_id     uuid references public.programme_batches (id) on delete set null,
  -- The batch as it was described when they applied, so the record still reads well if the batch changes.
  batch_label  text,
  full_name    text not null,
  email        text not null,
  whatsapp     text not null,
  occupation   text not null check (occupation in ('student', 'professional', 'business_owner', 'job_seeker', 'other')),
  experience   text not null check (experience in ('none', 'some', 'experienced')),
  payment_plan text not null default 'full' check (payment_plan in ('full', 'two_part')),
  heard_from   text,
  message      text,
  status       text not null default 'new' check (status in ('new', 'contacted', 'paid', 'enrolled', 'declined')),
  admin_note   text,
  -- Set once the applicant has an account with the same email.
  user_id      uuid references auth.users (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index programme_applications_email_idx on public.programme_applications (lower(email));
create index programme_applications_track_idx on public.programme_applications (track_id, created_at desc);
alter table public.programme_applications enable row level security;
create policy "admins manage applications" on public.programme_applications for all using (public.is_admin()) with check (public.is_admin());

-- Money received for an application. Copied onto the learner's programme order once they have an account.
create table public.application_payments (
  id               uuid primary key default gen_random_uuid(),
  application_id   uuid not null references public.programme_applications (id) on delete cascade,
  amount           numeric(12, 2) not null check (amount > 0),
  method           text,
  reference        text,
  paid_on          date not null default current_date,
  note             text,
  order_payment_id uuid references public.order_payments (id) on delete set null,
  created_by       uuid references auth.users (id) on delete set null,
  created_at       timestamptz not null default now()
);
create index application_payments_app_idx on public.application_payments (application_id);
alter table public.application_payments enable row level security;
create policy "admins manage application payments" on public.application_payments for all using (public.is_admin()) with check (public.is_admin());

/* ============================================================ programme names */

-- The name the site shows for each programme ("Professional Data Analytics"), so emails match the page.
-- programme_title stays the shorter name printed on certificates.
alter table public.tracks add column if not exists programme_name text;
update public.tracks set programme_name = v.name
  from (values ('data-analyst', 'Professional Data Analytics'), ('business-analyst', 'Professional Business Analysis'),
               ('data-scientist', 'Professional Data Science'), ('ai-engineer', 'Professional AI Engineering'),
               ('cloud-devops-engineer', 'Professional Cloud & DevOps Engineering'), ('software-developer', 'Professional Software Development')) as v(id, name)
 where public.tracks.id = v.id and public.tracks.programme_name is null;

create or replace function public.programme_display_name(t public.tracks)
returns text language sql stable as $$
  select coalesce(nullif(trim(t.programme_name), ''), t.programme_title, t.title);
$$;

/* ============================================================ emails */

alter table public.email_templates drop constraint if exists email_templates_key_check;
alter table public.email_templates add constraint email_templates_key_check check (key in ('welcome', 'enrolment', 'application', 'application_paid'));

insert into public.email_templates (key, label, subject, body) values
('application', 'Application received (programme enrolment form)', 'Your application for {{programme}} ({{reference}})',
 E'Hi {{name}},\n\nThank you for applying for {{programme}}. Your application reference is {{reference}}.\n\nBatch: {{batch}}\nFee: {{fee}}\n{{plan}}\n\nHow to pay\n{{payment_details}}\n\nOnce you have paid, send your proof of payment and your reference ({{reference}}) to us on WhatsApp:\n{{whatsapp}}\n\nWe will confirm your place and send you everything you need to start.\n\nCloudTech Academy'),
('application_paid', 'Payment received for an application (applicant has no account yet)', 'Your place in {{programme}} is confirmed',
 E'Hi {{name}},\n\nWe have received your payment of {{amount}} for {{programme}} ({{batch}}). Thank you.\n\nTo open your courses, create your free CloudTech Academy account with this email address ({{email}}):\n{{link}}\n\nYour programme opens automatically as soon as your account is created.\n\nCloudTech Academy')
on conflict (key) do nothing;

-- Like queue_email(), for someone who may not have an account yet. Never raises.
create or replace function public.queue_email_to(p_email text, p_name text, p_template text, p_vars jsonb)
returns void
language plpgsql security definer set search_path = public as $$
declare
  s public.email_settings;
  t public.email_templates;
  v jsonb;
begin
  select * into s from public.email_settings where id = 1;
  if not found or not s.enabled then return; end if;
  select * into t from public.email_templates where key = p_template and enabled;
  if not found or coalesce(trim(p_email), '') = '' then return; end if;
  v := jsonb_build_object('name', coalesce(nullif(split_part(trim(coalesce(p_name, '')), ' ', 1), ''), 'there'), 'full_name', coalesce(p_name, ''),
                          'site', 'https://academy.cloudtechanalytics.com') || coalesce(p_vars, '{}'::jsonb);
  insert into public.email_outbox (to_email, to_name, template, subject, body)
  values (trim(p_email), p_name, p_template, public.render_email(t.subject, v), public.render_email(t.body, v));
  perform public.kick_email_worker();
exception when others then
  null;
end;
$$;
revoke execute on function public.queue_email_to(text, text, text, jsonb) from public, anon, authenticated;

/* ============================================================ applying */

create or replace function public.new_application_reference()
returns text language plpgsql as $$
declare
  v text;
begin
  loop
    v := 'APP-' || to_char(now(), 'YYMM') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 5));
    exit when not exists (select 1 from public.programme_applications where reference = v);
  end loop;
  return v;
end;
$$;

-- A batch in words, e.g. "November 2026 batch · starts 30 Nov 2026 · Tue & Thu, 7–9pm WAT · Online".
create or replace function public.batch_label(b public.programme_batches)
returns text language sql stable as $$
  select concat_ws(' · ', b.name,
                   case when b.starts_on is not null then 'starts ' || to_char(b.starts_on, 'FMDD Mon YYYY') end,
                   nullif(trim(coalesce(b.schedule, '')), ''),
                   case b.mode when 'online' then 'Online' when 'physical' then coalesce('In person, ' || nullif(trim(coalesce(b.location, '')), ''), 'In person')
                               else coalesce('Hybrid, ' || nullif(trim(coalesce(b.location, '')), ''), 'Hybrid') end);
$$;

-- Seats already taken in a batch: applicants who have paid or enrolled.
create or replace function public.batch_seats_taken(p_batch uuid)
returns int language sql stable security definer set search_path = public as $$
  select count(*)::int from public.programme_applications where batch_id = p_batch and status in ('paid', 'enrolled');
$$;
grant execute on function public.batch_seats_taken(uuid) to anon, authenticated;

create or replace function public.submit_programme_application(
  p_track_id text, p_batch_id uuid, p_full_name text, p_email text, p_whatsapp text,
  p_occupation text, p_experience text, p_plan text, p_heard_from text, p_message text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_track  public.tracks;
  v_batch  public.programme_batches;
  v_app    public.programme_applications;
  v_name   text := trim(regexp_replace(coalesce(p_full_name, ''), '\s+', ' ', 'g'));
  v_email  text := lower(trim(coalesce(p_email, '')));
  v_phone  text := regexp_replace(coalesce(p_whatsapp, ''), '[^0-9+]', '', 'g');
  v_charge numeric;
  v_first  numeric;
  v_label  text;
  v_title  text;
  v_accounts jsonb;
  v_instr  text;
  v_details text;
  v_fee    text;
  v_plan_text text;
begin
  select * into v_track from public.tracks where id = p_track_id and published;
  if not found or v_track.access_type <> 'paid' then raise exception 'Programme not found.'; end if;
  if v_track.price is null or v_track.price <= 0 or v_track.enrollment_status <> 'open'
     or (v_track.enrollment_start is not null and v_track.enrollment_start > now())
     or (v_track.enrollment_end is not null and v_track.enrollment_end < now()) then
    raise exception 'Applications for this programme are not open right now.';
  end if;

  if length(v_name) < 3 or length(v_name) > 120 then raise exception 'Enter your full name.'; end if;
  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' or length(v_email) > 200 then raise exception 'Enter a valid email address.'; end if;
  if length(regexp_replace(v_phone, '[^0-9]', '', 'g')) not between 7 and 15 then raise exception 'Enter your WhatsApp number, with the country code if you are outside Nigeria.'; end if;
  if p_occupation not in ('student', 'professional', 'business_owner', 'job_seeker', 'other') then raise exception 'Tell us what you do now.'; end if;
  if p_experience not in ('none', 'some', 'experienced') then raise exception 'Tell us your experience level.'; end if;
  if p_plan not in ('full', 'two_part') then raise exception 'Choose how you want to pay.'; end if;
  if p_plan = 'two_part' and not v_track.instalments_enabled then raise exception 'This programme is paid in one payment.'; end if;
  -- A light brake on abuse: the same email can't send more than ten applications a day.
  if (select count(*) from public.programme_applications where lower(email) = v_email and created_at > now() - interval '1 day') >= 10 then
    raise exception 'Too many applications from this email today. Message us on WhatsApp instead.';
  end if;

  if p_batch_id is not null then
    select * into v_batch from public.programme_batches where id = p_batch_id and track_id = p_track_id and status = 'open';
    if not found then raise exception 'That batch is no longer taking applications. Choose another.'; end if;
    if v_batch.apply_by is not null and v_batch.apply_by < current_date then raise exception 'Applications for that batch have closed. Choose another.'; end if;
    if v_batch.seats is not null and public.batch_seats_taken(v_batch.id) >= v_batch.seats then raise exception 'That batch is full. Choose another.'; end if;
    v_label := public.batch_label(v_batch);
  elsif exists (select 1 from public.programme_batches where track_id = p_track_id and status = 'open'
                  and (apply_by is null or apply_by >= current_date)) then
    raise exception 'Choose the batch you want to join.';
  end if;

  -- One open application per person and programme: applying again updates it.
  select * into v_app from public.programme_applications
   where lower(email) = v_email and track_id = p_track_id and status in ('new', 'contacted')
   order by created_at desc limit 1;
  if found then
    update public.programme_applications
       set batch_id = p_batch_id, batch_label = v_label, full_name = v_name, email = v_email, whatsapp = v_phone,
           occupation = p_occupation, experience = p_experience, payment_plan = p_plan,
           heard_from = nullif(left(trim(coalesce(p_heard_from, '')), 120), ''), message = nullif(left(trim(coalesce(p_message, '')), 1000), ''),
           updated_at = now()
     where id = v_app.id returning * into v_app;
  else
    insert into public.programme_applications (reference, track_id, batch_id, batch_label, full_name, email, whatsapp, occupation, experience,
                                               payment_plan, heard_from, message, user_id)
    values (public.new_application_reference(), p_track_id, p_batch_id, v_label, v_name, v_email, v_phone, p_occupation, p_experience, p_plan,
            nullif(left(trim(coalesce(p_heard_from, '')), 120), ''), nullif(left(trim(coalesce(p_message, '')), 1000), ''),
            (select id from public.profiles where lower(email) = v_email limit 1))
    returning * into v_app;
  end if;

  v_title := public.programme_display_name(v_track);
  v_charge := public.programme_charge(v_track);
  v_first := case when p_plan = 'two_part' then round(v_charge * v_track.first_percent / 100.0, 2) end;
  select coalesce(jsonb_agg(jsonb_build_object('label', label, 'bankName', bank_name, 'accountName', account_name, 'accountNumber', account_number,
                                               'instructions', instructions, 'currency', currency) order by position), '[]'::jsonb)
    into v_accounts from public.payment_accounts where active;
  select instructions into v_instr from public.payment_settings where id = 1;

  v_fee := v_track.currency || ' ' || to_char(v_charge, 'FM999,999,999,990.##');
  v_plan_text := case when p_plan = 'two_part'
    then 'Payment plan: two parts. First payment ' || v_track.currency || ' ' || to_char(v_first, 'FM999,999,999,990.##') || ' now, then ' ||
         v_track.currency || ' ' || to_char(v_charge - v_first, 'FM999,999,999,990.##') || ' within ' || v_track.second_due_days || ' days.'
    else 'Payment plan: one payment.' end;
  select string_agg(concat_ws(E'\n', a->>'label', nullif(concat_ws(' · ', a->>'bankName', a->>'accountName', a->>'accountNumber'), ''), a->>'instructions'), E'\n\n')
    into v_details from jsonb_array_elements(v_accounts) a;
  v_details := concat_ws(E'\n\n', nullif(v_details, ''), nullif(trim(coalesce(v_instr, '')), ''));

  perform public.queue_email_to(v_app.email, v_app.full_name, 'application', jsonb_build_object(
    'reference', v_app.reference, 'programme', v_title, 'batch', coalesce(v_label, 'Next batch (dates to be confirmed)'), 'fee', v_fee,
    'plan', v_plan_text, 'payment_details', coalesce(nullif(v_details, ''), 'We will send the account details on WhatsApp.'),
    'whatsapp', 'https://wa.me/2349115591877'));

  -- A notice to the Academy, when a reply-to address is set.
  begin
    insert into public.email_outbox (to_email, to_name, template, subject, body)
    select s.reply_to, 'CloudTech Academy', 'application_notice', 'New application: ' || v_title || ' · ' || v_app.full_name,
           concat_ws(E'\n', 'Reference: ' || v_app.reference, 'Name: ' || v_app.full_name, 'Email: ' || v_app.email, 'WhatsApp: ' || v_app.whatsapp,
                     'Batch: ' || coalesce(v_label, 'not chosen'), v_plan_text, '', 'Open the applications: https://academy.cloudtechanalytics.com/admin/applications')
      from public.email_settings s where s.id = 1 and s.enabled and coalesce(trim(s.reply_to), '') <> '';
    if found then perform public.kick_email_worker(); end if;
  exception when others then null;
  end;

  return jsonb_build_object(
    'reference', v_app.reference, 'trackId', v_track.id, 'programme', v_title, 'batch', v_label,
    'fullName', v_app.full_name, 'email', v_app.email, 'plan', p_plan,
    'currency', v_track.currency, 'amount', v_charge, 'listAmount', v_track.price,
    'firstAmount', v_first, 'secondAmount', case when v_first is not null then v_charge - v_first end, 'secondDueDays', v_track.second_due_days,
    'accounts', v_accounts, 'instructions', v_instr);
end;
$$;
revoke execute on function public.submit_programme_application(text, uuid, text, text, text, text, text, text, text, text) from public;
grant execute on function public.submit_programme_application(text, uuid, text, text, text, text, text, text, text, text) to anon, authenticated;

/* ============================================================ payments become enrolment */

-- Copies an application's recorded payments onto the learner's programme order, once they have an account, and
-- marks the application enrolled when the programme is open. Safe to repeat.
create or replace function public.sync_application(p_app uuid)
returns void
language plpgsql security definer set search_path = public as $$
declare
  a       public.programme_applications;
  t       public.tracks;
  o       public.course_orders;
  p       public.application_payments;
  v_n     int;
  v_id    uuid;
begin
  select * into a from public.programme_applications where id = p_app;
  if not found then return; end if;
  if a.user_id is null then
    update public.programme_applications set user_id = (select id from public.profiles where lower(email) = lower(a.email) limit 1)
     where id = p_app returning * into a;
  end if;
  if a.user_id is null or not exists (select 1 from public.application_payments where application_id = p_app and order_payment_id is null) then
    if a.user_id is not null and a.status = 'paid'
       and exists (select 1 from public.programme_enrollments where user_id = a.user_id and track_id = a.track_id) then
      update public.programme_applications set status = 'enrolled', updated_at = now() where id = p_app;
    end if;
    return;
  end if;

  select * into t from public.tracks where id = a.track_id;
  select * into o from public.course_orders where user_id = a.user_id and track_id = a.track_id and status in ('pending', 'partial') order by created_at desc limit 1;
  if not found then
    insert into public.course_orders (user_id, track_id, currency, list_amount, amount, provider)
    values (a.user_id, a.track_id, t.currency, coalesce(t.price, 0), coalesce(public.programme_charge(t), 0), 'manual')
    returning * into o;
  end if;
  for p in select * from public.application_payments where application_id = p_app and order_payment_id is null order by created_at loop
    select count(*) into v_n from public.order_payments where order_id = o.id;
    insert into public.order_payments (order_id, user_id, part, amount, currency, status, account_label, reference, paid_on, note, source, confirmed_at, confirmed_by)
    values (o.id, a.user_id, least(v_n + 1, 2), p.amount, o.currency, 'confirmed', p.method,
            case when p.reference is not null and not exists (select 1 from public.order_payments where reference = p.reference) then p.reference else public.new_payment_reference() end,
            p.paid_on, concat_ws(' · ', 'Application ' || a.reference, p.note), 'admin', now(), p.created_by)
    returning id into v_id;
    update public.application_payments set order_payment_id = v_id where id = p.id;
  end loop;
  perform public.recompute_order(o.id);
  if exists (select 1 from public.programme_enrollments where user_id = a.user_id and track_id = a.track_id) then
    update public.programme_applications set status = 'enrolled', updated_at = now() where id = p_app;
  end if;
end;
$$;
revoke execute on function public.sync_application(uuid) from public, anon, authenticated;

-- Admin: money received for an application. Returns the application's new status.
create or replace function public.admin_record_application_payment(p_app uuid, p_amount numeric, p_method text, p_reference text, p_paid_on date, p_note text)
returns text
language plpgsql security definer set search_path = public as $$
declare
  a public.programme_applications;
  t public.tracks;
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  if p_amount is null or p_amount <= 0 then raise exception 'Enter the amount received.'; end if;
  select * into a from public.programme_applications where id = p_app;
  if not found then raise exception 'Application not found.'; end if;
  if a.status = 'declined' then raise exception 'This application was declined. Set it back to New first.'; end if;
  insert into public.application_payments (application_id, amount, method, reference, paid_on, note, created_by)
  values (p_app, p_amount, nullif(trim(coalesce(p_method, '')), ''), nullif(trim(coalesce(p_reference, '')), ''), coalesce(p_paid_on, current_date),
          nullif(trim(coalesce(p_note, '')), ''), auth.uid());
  update public.programme_applications set status = case when status = 'enrolled' then 'enrolled' else 'paid' end, updated_at = now() where id = p_app;
  perform public.sync_application(p_app);
  select * into a from public.programme_applications where id = p_app;
  if a.user_id is null then
    select * into t from public.tracks where id = a.track_id;
    perform public.queue_email_to(a.email, a.full_name, 'application_paid', jsonb_build_object(
      'programme', public.programme_display_name(t), 'batch', coalesce(a.batch_label, 'the next batch'), 'email', a.email,
      'amount', t.currency || ' ' || to_char(p_amount, 'FM999,999,999,990.##'),
      'link', 'https://academy.cloudtechanalytics.com/sign-up?email=' || replace(replace(a.email, '+', '%2B'), '@', '%40') || '&next=/programmes/' || t.slug));
  end if;
  return a.status;
end;
$$;
revoke execute on function public.admin_record_application_payment(uuid, numeric, text, text, date, text) from public, anon;
grant execute on function public.admin_record_application_payment(uuid, numeric, text, text, date, text) to authenticated;

-- Admin: follow-up status and a private note. Paid and enrolled come from recorded payments, not from here.
create or replace function public.admin_update_application(p_app uuid, p_status text, p_note text)
returns void
language plpgsql security definer set search_path = public as $$
declare
  a public.programme_applications;
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  select * into a from public.programme_applications where id = p_app;
  if not found then raise exception 'Application not found.'; end if;
  if p_status not in ('new', 'contacted', 'declined') and p_status <> a.status then
    raise exception 'Paid and Enrolled are set by recording a payment.';
  end if;
  if a.status in ('paid', 'enrolled') and p_status <> a.status then
    raise exception 'This applicant has paid. Remove the payment on the Payments page instead.';
  end if;
  update public.programme_applications set status = p_status, admin_note = nullif(trim(coalesce(p_note, '')), ''), updated_at = now() where id = p_app;
end;
$$;
revoke execute on function public.admin_update_application(uuid, text, text) from public, anon;
grant execute on function public.admin_update_application(uuid, text, text) to authenticated;

-- A paid applicant who creates their account gets their programme straight away. Never blocks a sign-up.
create or replace function public.link_applications_on_signup()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  r record;
begin
  for r in select id from public.programme_applications where lower(email) = lower(new.email) and user_id is null loop
    begin
      update public.programme_applications set user_id = new.id where id = r.id;
      perform public.sync_application(r.id);
    exception when others then null;
    end;
  end loop;
  return new;
exception when others then
  return new;
end;
$$;
create trigger profiles_link_applications after insert on public.profiles for each row execute function public.link_applications_on_signup();

notify pgrst, 'reload schema';
