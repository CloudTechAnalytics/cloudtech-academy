-- Emails and removing students.
--
-- * A welcome email goes out when someone signs up, and an enrolment email when they enrol in a course or programme.
--   Admins edit both templates, can switch them off, can send their own message to one student or everyone, and see
--   a log of every email.
-- * Emails are written to a queue (email_outbox) by database triggers, and a small Edge Function (process-emails)
--   sends them through the mail provider. Queuing never fails a sign-up or an enrolment: if anything goes wrong
--   the email is simply not queued.
-- * Admins can remove a student. A student who holds certificates can't be removed (their certificates must stay
--   verifiable); delete or revoke those first.

create extension if not exists pg_net with schema extensions;

/* ============================================================ settings, templates, queue */

create table public.email_settings (
  id           int primary key default 1 check (id = 1),
  enabled      boolean not null default true,
  from_name    text not null default 'CloudTech Academy',
  reply_to     text,
  function_url text not null default 'https://dwrulmgzgkfzrtayomvy.supabase.co/functions/v1/process-emails',
  -- Shared with the Edge Function so only the database (and admins) can ask it to send.
  secret       text not null default replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '')
);
insert into public.email_settings default values;
alter table public.email_settings enable row level security;
create policy "admins manage email settings" on public.email_settings for all using (public.is_admin()) with check (public.is_admin());

create table public.email_templates (
  key        text primary key check (key in ('welcome', 'enrolment')),
  label      text not null,
  subject    text not null,
  body       text not null,
  enabled    boolean not null default true,
  updated_at timestamptz not null default now()
);
alter table public.email_templates enable row level security;
create policy "admins manage email templates" on public.email_templates for all using (public.is_admin()) with check (public.is_admin());

insert into public.email_templates (key, label, subject, body) values
('welcome', 'Welcome email (when someone signs up)', 'Welcome to CloudTech Academy, {{name}}',
 E'Hi {{name}},\n\nWelcome to CloudTech Academy. We are glad you are here.\n\nYour account is ready. Pick a free course and start with your first lesson today:\n{{link}}\n\nEvery module ends with a check, and a badge for what you pass. If you get stuck, reply to this email.\n\nHappy learning,\nCloudTech Academy'),
('enrolment', 'Enrolment email (when someone enrols)', 'You are enrolled in {{course}}',
 E'Hi {{name}},\n\nYou are now enrolled in {{course}}.\n\nContinue learning here:\n{{link}}\n\nYou will find it in My Learning on your dashboard, and your progress is saved as you go.\n\nCloudTech Academy');

create table public.email_outbox (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid,
  to_email   text not null,
  to_name    text,
  template   text,
  subject    text not null,
  body       text not null,
  status     text not null default 'queued' check (status in ('queued', 'sent', 'failed', 'skipped')),
  error      text,
  created_at timestamptz not null default now(),
  sent_at    timestamptz,
  created_by uuid
);
create index email_outbox_status_idx on public.email_outbox (status, created_at);
alter table public.email_outbox enable row level security;
create policy "admins read the email log" on public.email_outbox for select using (public.is_admin());

/* ============================================================ queuing */

create or replace function public.render_email(p_text text, p_vars jsonb)
returns text language plpgsql immutable as $$
declare
  k text;
  v text := p_text;
begin
  for k in select jsonb_object_keys(p_vars) loop
    v := replace(v, '{{' || k || '}}', coalesce(p_vars ->> k, ''));
  end loop;
  return v;
end;
$$;

-- Asks the Edge Function to send what is queued. Never raises: a failure just leaves the email queued for a retry.
create or replace function public.kick_email_worker()
returns void
language plpgsql security definer set search_path = public as $$
declare
  s public.email_settings;
begin
  select * into s from public.email_settings where id = 1;
  if not found or not s.enabled then return; end if;
  perform net.http_post(url := s.function_url,
                        headers := jsonb_build_object('Content-Type', 'application/json', 'x-email-secret', s.secret),
                        body := '{}'::jsonb, timeout_milliseconds := 3000);
exception when others then
  null;
end;
$$;
revoke execute on function public.kick_email_worker() from public, anon, authenticated;

create or replace function public.queue_email(p_user uuid, p_template text, p_vars jsonb)
returns void
language plpgsql security definer set search_path = public as $$
declare
  s  public.email_settings;
  t  public.email_templates;
  pr public.profiles;
  v  jsonb;
begin
  select * into s from public.email_settings where id = 1;
  if not found or not s.enabled then return; end if;
  select * into t from public.email_templates where key = p_template and enabled;
  if not found then return; end if;
  select * into pr from public.profiles where id = p_user;
  if not found or coalesce(pr.email, '') = '' then return; end if;
  v := jsonb_build_object('name', coalesce(nullif(split_part(trim(pr.full_name), ' ', 1), ''), 'there'), 'full_name', coalesce(pr.full_name, ''),
                          'site', 'https://academy.cloudtechanalytics.com') || coalesce(p_vars, '{}'::jsonb);
  insert into public.email_outbox (user_id, to_email, to_name, template, subject, body)
  values (p_user, pr.email, pr.full_name, p_template, public.render_email(t.subject, v), public.render_email(t.body, v));
  perform public.kick_email_worker();
exception when others then
  null;
end;
$$;
revoke execute on function public.queue_email(uuid, text, jsonb) from public, anon, authenticated;

create or replace function public.email_on_signup()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform public.queue_email(new.id, 'welcome', jsonb_build_object('link', 'https://academy.cloudtechanalytics.com/courses'));
  return new;
end;
$$;
create trigger profiles_welcome_email after insert on public.profiles for each row execute function public.email_on_signup();

-- One email per course. A programme sends a single email for the programme, not one for each course it opens.
create or replace function public.email_on_enrolment()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  c public.courses;
begin
  if new.source <> 'free' and exists (select 1 from public.course_orders o where o.id = new.order_id and o.track_id is not null) then
    return new;
  end if;
  select * into c from public.courses where id = new.course_id;
  if found then
    perform public.queue_email(new.user_id, 'enrolment', jsonb_build_object('course', c.title, 'link', 'https://academy.cloudtechanalytics.com/courses/' || c.slug));
  end if;
  return new;
end;
$$;
create trigger enrollments_email after insert on public.enrollments for each row execute function public.email_on_enrolment();

create or replace function public.email_on_programme()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  t public.tracks;
begin
  select * into t from public.tracks where id = new.track_id;
  if found then
    perform public.queue_email(new.user_id, 'enrolment',
      jsonb_build_object('course', 'the Professional Programme in ' || coalesce(t.programme_title, t.title), 'link', 'https://academy.cloudtechanalytics.com/programmes/' || t.slug));
  end if;
  return new;
end;
$$;
create trigger programme_enrollments_email after insert on public.programme_enrollments for each row execute function public.email_on_programme();

/* ============================================================ admin: send, retry, remove */

-- Sends the admin's own message to the chosen students (at most 500). {{name}} becomes each student's first name.
create or replace function public.admin_send_message(p_user_ids uuid[], p_subject text, p_body text)
returns int
language plpgsql security definer set search_path = public as $$
declare
  n int;
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  if length(trim(coalesce(p_subject, ''))) < 2 then raise exception 'Write a subject.'; end if;
  if length(trim(coalesce(p_body, ''))) < 2 then raise exception 'Write a message.'; end if;
  if coalesce(array_length(p_user_ids, 1), 0) = 0 then raise exception 'Choose who to send it to.'; end if;
  if array_length(p_user_ids, 1) > 500 then raise exception 'You can send to at most 500 students at once.'; end if;
  insert into public.email_outbox (user_id, to_email, to_name, template, subject, body, created_by)
  select p.id, p.email, p.full_name, 'message',
         public.render_email(p_subject, jsonb_build_object('name', coalesce(nullif(split_part(trim(p.full_name), ' ', 1), ''), 'there'))),
         public.render_email(p_body, jsonb_build_object('name', coalesce(nullif(split_part(trim(p.full_name), ' ', 1), ''), 'there'))), auth.uid()
    from public.profiles p where p.id = any (p_user_ids) and coalesce(p.email, '') <> '';
  get diagnostics n = row_count;
  perform public.kick_email_worker();
  return n;
end;
$$;
revoke execute on function public.admin_send_message(uuid[], text, text) from public, anon;
grant execute on function public.admin_send_message(uuid[], text, text) to authenticated;

create or replace function public.admin_retry_emails()
returns int
language plpgsql security definer set search_path = public as $$
declare
  n int;
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  update public.email_outbox set status = 'queued', error = null where status = 'failed';
  get diagnostics n = row_count;
  perform public.kick_email_worker();
  return n;
end;
$$;
revoke execute on function public.admin_retry_emails() from public, anon;
grant execute on function public.admin_retry_emails() to authenticated;

create or replace function public.admin_delete_student(p_user uuid)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_role  text;
  v_certs int;
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  if p_user = auth.uid() then raise exception 'You cannot remove your own account.'; end if;
  select role into v_role from public.profiles where id = p_user;
  if not found then raise exception 'Student not found.'; end if;
  if v_role = 'admin' then raise exception 'Admins cannot be removed here.'; end if;
  select count(*) into v_certs from public.certificates where user_id = p_user;
  if v_certs > 0 then
    raise exception 'This student holds % certificate(s), which must stay verifiable. Delete or revoke them first, then remove the student.', v_certs;
  end if;
  -- Their progress, enrolments, orders, payments and credentials go with the account.
  delete from auth.users where id = p_user;
end;
$$;
revoke execute on function public.admin_delete_student(uuid) from public, anon;
grant execute on function public.admin_delete_student(uuid) to authenticated;

notify pgrst, 'reload schema';
