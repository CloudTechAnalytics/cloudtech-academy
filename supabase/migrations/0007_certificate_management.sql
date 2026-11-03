-- Certificate management: certificates issued by admins for training outside the Academy
-- (one-on-one, corporate, bootcamps, workshops, private and past programmes), alongside the
-- existing paid course certificates.
--
-- * One certificates table for both: source = 'course' (issued from a paid or granted order) or
--   'manual' (issued by an admin, with or without an Academy account).
-- * New certificate numbers are CTA-<year>-<6 digits>, from the existing sequence, generated only on
--   the server and never reused. Older CTA-CERT-<year>-<6 digits> numbers stay valid.
-- * Records are never deleted. Revoking keeps the record; reissuing marks the original 'replaced' and
--   links the new certificate to it.
-- * Every issue, edit, reissue, revoke and admin download is written to certificate_events, which only
--   admins can read. Who issued a certificate lives there, not on the certificate, so learners reading
--   their own certificates never see admin details.
-- * Certificates are written only through the functions below. verify_certificate() returns what is
--   printed on the certificate and nothing else.

/* ============================================================ templates */

create table public.certificate_templates (
  id          text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name        text not null,
  description text not null default '',
  active      boolean not null default true,
  position    int not null default 0
);
insert into public.certificate_templates (id, name, description, position) values
  ('signature', 'CloudTech Signature', 'Dark brand panel, gold seal and QR code. For professional training, bootcamps and workshops.', 1),
  ('classic', 'CloudTech Classic', 'The original Academy course certificate: cream and gold, centred.', 2);

alter table public.certificate_templates enable row level security;
create policy "read templates" on public.certificate_templates for select to authenticated using (true);
create policy "admin templates" on public.certificate_templates for all using (public.is_admin()) with check (public.is_admin());

/* ============================================================ certificates */

alter table public.certificates
  alter column credential_id drop not null,
  alter column user_id drop not null,
  alter column course_id drop not null,
  add column source           text not null default 'course' check (source in ('course', 'manual')),
  add column recipient_email  text check (recipient_email is null or recipient_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  add column certificate_title text,
  add column training_type    text not null default 'academy_course'
    check (training_type in ('academy_course', 'one_on_one', 'corporate', 'bootcamp', 'workshop', 'private', 'other')),
  add column certificate_type text not null default 'completion'
    check (certificate_type in ('completion', 'participation', 'professional_training', 'achievement', 'workshop')),
  add column instructor_name  text,
  add column description      text,
  add column start_date       date,
  add column completion_date  date,
  add column grade            text,
  add column duration         text,
  add column template_id      text not null default 'classic' references public.certificate_templates (id),
  add column replaced_certificate_id text references public.certificates (certificate_id),
  add column updated_at       timestamptz not null default now();

-- course_title holds the course or programme name for both kinds.
comment on column public.certificates.course_title is 'Course or programme name.';
comment on column public.certificates.replaced_certificate_id is 'The certificate this one replaced, when it was reissued.';

-- A course certificate always belongs to a learner, a course and its completion credential.
alter table public.certificates add constraint certificates_course_links
  check (source = 'manual' or (credential_id is not null and user_id is not null and course_id is not null));

alter table public.certificates drop constraint certificates_status_check;
alter table public.certificates add constraint certificates_status_check check (status in ('valid', 'revoked', 'replaced'));

-- Deleting an account must not delete certificates: they stay verifiable.
alter table public.certificates drop constraint certificates_user_id_fkey;
alter table public.certificates add constraint certificates_user_id_fkey foreign key (user_id) references auth.users (id) on delete set null;

drop index public.certificates_one_valid_per_course;
create unique index certificates_one_valid_per_course on public.certificates (user_id, course_id) where status = 'valid' and source = 'course';
create index certificates_replaced_idx on public.certificates (replaced_certificate_id);

create trigger certificates_touch before update on public.certificates for each row execute function public.touch_updated_at();

-- Every change now goes through the audited functions below.
drop policy "admin revoke certificates" on public.certificates;

/* ============================================================ audit log */

create table public.certificate_events (
  id             bigint generated always as identity primary key,
  certificate_id text not null references public.certificates (certificate_id),
  action         text not null check (action in ('created', 'edited', 'issued', 'downloaded', 'revoked', 'reissued')),
  actor_id       uuid references auth.users (id) on delete set null,
  actor_name     text not null default '',
  details        jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now()
);
create index certificate_events_cert_idx on public.certificate_events (certificate_id, created_at);

alter table public.certificate_events enable row level security;
create policy "admin read certificate events" on public.certificate_events for select using (public.is_admin());
revoke all on public.certificate_events from anon;

/* ============================================================ helpers */

-- CTA-2026-000001. Numbers come from one sequence, so they are never reused, even after a revocation.
create or replace function public.next_certificate_id()
returns text language sql volatile security definer set search_path = public as $$
  select 'CTA-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.certificate_number_seq')::text, 6, '0');
$$;

create or replace function public.log_certificate_event(p_certificate_id text, p_action text, p_details jsonb default '{}'::jsonb)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_actor uuid := auth.uid();
  v_name  text := '';
begin
  if v_actor is not null then
    select coalesce(nullif(trim(full_name), ''), email, '') into v_name from public.profiles where id = v_actor;
  end if;
  insert into public.certificate_events (certificate_id, action, actor_id, actor_name, details)
  values (p_certificate_id, p_action, v_actor, coalesce(v_name, case when v_actor is null then 'System' else '' end), coalesce(p_details, '{}'::jsonb));
end;
$$;

-- Trims a text field from the JSON input; empty becomes null.
create or replace function public.cert_text(p jsonb, p_key text, p_max int)
returns text language plpgsql immutable as $$
declare v text := nullif(trim(coalesce(p ->> p_key, '')), '');
begin
  if v is not null and length(v) > p_max then
    raise exception '% is too long (% characters at most).', initcap(replace(p_key, '_', ' ')), p_max;
  end if;
  return v;
end;
$$;

-- Validates an admin's certificate details and inserts the certificate. Internal.
-- p_old: when reissuing, the certificate being replaced (its links to a learner, course and order carry over).
create or replace function public.insert_certificate(p jsonb, p_old public.certificates default null)
returns public.certificates
language plpgsql security definer set search_path = public as $$
declare
  v_name       text := public.cert_text(p, 'recipientName', 120);
  v_email      text := lower(public.cert_text(p, 'recipientEmail', 200));
  v_title      text := public.cert_text(p, 'certificateTitle', 150);
  v_programme  text := public.cert_text(p, 'programmeName', 200);
  v_training   text := coalesce(public.cert_text(p, 'trainingType', 40), 'other');
  v_type       text := coalesce(public.cert_text(p, 'certificateType', 40), 'completion');
  v_template   text := coalesce(public.cert_text(p, 'templateId', 60), 'signature');
  v_user       uuid := nullif(p ->> 'userId', '')::uuid;
  v_course     text := public.cert_text(p, 'courseId', 120);
  v_start      date := nullif(p ->> 'startDate', '')::date;
  v_completion date := nullif(p ->> 'completionDate', '')::date;
  v_issue      date := coalesce(nullif(p ->> 'issueDate', '')::date, current_date);
  v_cert       public.certificates;
begin
  if v_name is null or length(v_name) < 2 then raise exception 'Enter the recipient''s full name.'; end if;
  if v_title is null then raise exception 'Enter the certificate title.'; end if;
  if v_programme is null then raise exception 'Enter the course or programme name.'; end if;
  if v_email is not null and v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'That email address doesn''t look right.'; end if;
  if v_training not in ('academy_course', 'one_on_one', 'corporate', 'bootcamp', 'workshop', 'private', 'other') then raise exception 'Choose a training type.'; end if;
  if v_type not in ('completion', 'participation', 'professional_training', 'achievement', 'workshop') then raise exception 'Choose a certificate type.'; end if;
  if not exists (select 1 from public.certificate_templates where id = v_template and active) then raise exception 'Choose a certificate template.'; end if;
  if v_completion is null then raise exception 'Enter the training completion date.'; end if;
  if v_start is not null and v_start > v_completion then raise exception 'The start date must be on or before the completion date.'; end if;
  if v_issue < v_completion then raise exception 'The issue date can''t be before the completion date.'; end if;
  if v_issue > current_date + 1 then raise exception 'The issue date can''t be in the future.'; end if;
  if v_user is not null and not exists (select 1 from public.profiles where id = v_user) then raise exception 'That Academy account wasn''t found.'; end if;
  if v_course is not null and not exists (select 1 from public.courses where id = v_course) then raise exception 'That course wasn''t found.'; end if;

  insert into public.certificates (
    certificate_id, source, credential_id, order_id, user_id, course_id, recipient_name, recipient_email,
    certificate_title, course_title, training_type, certificate_type, instructor_name, description,
    start_date, completion_date, issued_at, grade, duration, template_id, replaced_certificate_id)
  values (
    public.next_certificate_id(),
    coalesce(p_old.source, 'manual'),
    p_old.credential_id,
    p_old.order_id,
    -- A course certificate keeps its learner and course; a manual one keeps its links unless the input changes them.
    case when p_old.source = 'course' or (p_old.certificate_id is not null and not p ? 'userId') then p_old.user_id else v_user end,
    case when p_old.source = 'course' or (p_old.certificate_id is not null and not p ? 'courseId') then p_old.course_id else v_course end,
    v_name, v_email, v_title, v_programme, v_training, v_type,
    public.cert_text(p, 'instructorName', 120),
    public.cert_text(p, 'description', 600),
    v_start, v_completion,
    (v_issue + time '12:00') at time zone 'UTC',
    public.cert_text(p, 'grade', 40),
    public.cert_text(p, 'duration', 60),
    v_template,
    p_old.certificate_id)
  returning * into v_cert;
  return v_cert;
end;
$$;

/* ============================================================ admin functions */

create or replace function public.admin_issue_certificate(p jsonb)
returns public.certificates
language plpgsql security definer set search_path = public as $$
declare v_cert public.certificates;
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  v_cert := public.insert_certificate(p);
  perform public.log_certificate_event(v_cert.certificate_id, 'issued',
    jsonb_build_object('recipient', v_cert.recipient_name, 'title', v_cert.certificate_title, 'training_type', v_cert.training_type));
  return v_cert;
end;
$$;

-- Edits what isn't printed on the certificate: the recipient's email, the linked account and course,
-- and the template. Printed details (name, titles, dates, instructor...) change only by reissuing,
-- so the original stays on record.
create or replace function public.admin_update_certificate(p_certificate_id text, p jsonb)
returns public.certificates
language plpgsql security definer set search_path = public as $$
declare
  v_old   public.certificates;
  v_new   public.certificates;
  v_email text := lower(public.cert_text(p, 'recipientEmail', 200));
  v_user  uuid := nullif(p ->> 'userId', '')::uuid;
  v_course text := public.cert_text(p, 'courseId', 120);
  v_template text := coalesce(public.cert_text(p, 'templateId', 60), 'signature');
  v_changes jsonb := '{}'::jsonb;
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  select * into v_old from public.certificates where certificate_id = upper(trim(p_certificate_id)) for update;
  if not found then raise exception 'Certificate not found.'; end if;
  if v_old.status = 'replaced' then raise exception 'This certificate was replaced. Edit the replacement instead.'; end if;
  if v_email is not null and v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'That email address doesn''t look right.'; end if;
  if not exists (select 1 from public.certificate_templates where id = v_template and active) then raise exception 'Choose a certificate template.'; end if;
  if v_old.source = 'course' then
    -- A course certificate stays linked to its learner and course.
    v_user := v_old.user_id;
    v_course := v_old.course_id;
  end if;
  if v_user is not null and not exists (select 1 from public.profiles where id = v_user) then raise exception 'That Academy account wasn''t found.'; end if;
  if v_course is not null and not exists (select 1 from public.courses where id = v_course) then raise exception 'That course wasn''t found.'; end if;

  if v_email is distinct from v_old.recipient_email then v_changes := v_changes || jsonb_build_object('recipient_email', jsonb_build_array(v_old.recipient_email, v_email)); end if;
  if v_user is distinct from v_old.user_id then v_changes := v_changes || jsonb_build_object('linked_account', jsonb_build_array(v_old.user_id is not null, v_user is not null)); end if;
  if v_course is distinct from v_old.course_id then v_changes := v_changes || jsonb_build_object('course', jsonb_build_array(v_old.course_id, v_course)); end if;
  if v_template is distinct from v_old.template_id then v_changes := v_changes || jsonb_build_object('template', jsonb_build_array(v_old.template_id, v_template)); end if;
  if v_changes = '{}'::jsonb then return v_old; end if;

  update public.certificates
  set recipient_email = v_email, user_id = v_user, course_id = v_course, template_id = v_template
  where id = v_old.id
  returning * into v_new;
  perform public.log_certificate_event(v_new.certificate_id, 'edited', v_changes);
  return v_new;
end;
$$;

-- Corrects a certificate by replacing it: the original is kept (status 'replaced'), and a new
-- certificate with a new number is issued and linked to it.
create or replace function public.admin_reissue_certificate(p_certificate_id text, p jsonb, p_reason text)
returns public.certificates
language plpgsql security definer set search_path = public as $$
declare
  v_old    public.certificates;
  v_new    public.certificates;
  v_reason text := nullif(trim(coalesce(p_reason, '')), '');
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  if v_reason is null then raise exception 'Say why the certificate is being reissued.'; end if;
  select * into v_old from public.certificates where certificate_id = upper(trim(p_certificate_id)) for update;
  if not found then raise exception 'Certificate not found.'; end if;
  if v_old.status = 'replaced' then raise exception 'This certificate was already replaced.'; end if;

  update public.certificates set status = 'replaced' where id = v_old.id;
  v_new := public.insert_certificate(p, v_old);
  perform public.log_certificate_event(v_old.certificate_id, 'reissued', jsonb_build_object('replaced_by', v_new.certificate_id, 'reason', v_reason));
  perform public.log_certificate_event(v_new.certificate_id, 'issued', jsonb_build_object('replaces', v_old.certificate_id, 'reason', v_reason));
  return v_new;
end;
$$;

create or replace function public.admin_revoke_certificate(p_certificate_id text, p_reason text)
returns public.certificates
language plpgsql security definer set search_path = public as $$
declare v_cert public.certificates;
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  update public.certificates
  set status = 'revoked', revoked_at = now(), revoked_reason = nullif(trim(coalesce(p_reason, '')), '')
  where certificate_id = upper(trim(p_certificate_id)) and status = 'valid'
  returning * into v_cert;
  if not found then raise exception 'Only an active certificate can be revoked.'; end if;
  perform public.log_certificate_event(v_cert.certificate_id, 'revoked', jsonb_build_object('reason', v_cert.revoked_reason));
  return v_cert;
end;
$$;

-- Records a download by an admin or by the certificate's owner.
create or replace function public.record_certificate_download(p_certificate_id text)
returns void
language plpgsql security definer set search_path = public as $$
declare v_id text;
begin
  select certificate_id into v_id from public.certificates
  where certificate_id = upper(trim(p_certificate_id)) and (public.is_admin() or user_id = auth.uid());
  if v_id is null then raise exception 'Certificate not found.'; end if;
  perform public.log_certificate_event(v_id, 'downloaded', jsonb_build_object('by', case when public.is_admin() then 'admin' else 'recipient' end));
end;
$$;

-- Every certificate with who issued it (from the audit log) and the certificate that replaced it.
create or replace function public.admin_list_certificates()
returns table (certificate public.certificates, issued_by text, replaced_by text)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  return query
  select c,
         (select e.actor_name from public.certificate_events e where e.certificate_id = c.certificate_id and e.action = 'issued' order by e.created_at limit 1),
         (select n.certificate_id from public.certificates n where n.replaced_certificate_id = c.certificate_id order by n.issued_at desc limit 1)
  from public.certificates c
  order by c.issued_at desc, c.certificate_id desc
  limit 5000;
end;
$$;

-- Course certificates (paid or granted orders) now use the same numbering and are logged.
create or replace function public.issue_certificate_for_order(p_order_id uuid)
returns public.certificates
language plpgsql security definer set search_path = public as $$
declare
  v_order public.certificate_orders;
  v_cred  public.credentials;
  v_cert  public.certificates;
begin
  select * into v_order from public.certificate_orders where id = p_order_id;
  if not found or v_order.status not in ('paid', 'granted') then raise exception 'The order isn''t paid.'; end if;
  select * into v_cert from public.certificates
  where user_id = v_order.user_id and course_id = v_order.course_id and status = 'valid' and source = 'course';
  if found then return v_cert; end if;
  select * into v_cred from public.credentials where credential_id = v_order.credential_id;
  insert into public.certificates (certificate_id, source, credential_id, order_id, user_id, course_id, recipient_name, course_title,
                                   certificate_title, training_type, certificate_type, completion_date, template_id)
  values (public.next_certificate_id(), 'course', v_cred.credential_id, v_order.id, v_order.user_id, v_order.course_id,
          v_cred.recipient_name, v_cred.course_title, 'Certificate of Completion', 'academy_course', 'completion',
          v_cred.issued_at::date, 'classic')
  returning * into v_cert;
  perform public.log_certificate_event(v_cert.certificate_id, 'issued',
    jsonb_build_object('order', v_order.id, 'payment', v_order.status));
  return v_cert;
end;
$$;

/* ============================================================ public verification */

-- Returns only what is printed on the certificate, plus its status. Never an email, account,
-- internal id, revocation reason or the admin who issued it.
drop function public.verify_certificate(text);
create function public.verify_certificate(p_certificate_id text)
returns table (certificate_id text, credential_id text, recipient_name text, certificate_title text, course_title text,
               training_type text, certificate_type text, instructor_name text, description text, start_date date,
               completion_date date, issued_at timestamptz, grade text, duration text, template_id text, status text,
               revoked_at timestamptz, replaced_by text)
language sql stable security definer set search_path = public as $$
  select c.certificate_id, c.credential_id, c.recipient_name, c.certificate_title, c.course_title, c.training_type,
         c.certificate_type, c.instructor_name, c.description, c.start_date, c.completion_date, c.issued_at, c.grade,
         c.duration, c.template_id, c.status, c.revoked_at,
         (select n.certificate_id from public.certificates n where n.replaced_certificate_id = c.certificate_id order by n.issued_at desc limit 1)
  from public.certificates c
  where c.certificate_id = upper(trim(p_certificate_id));
$$;

/* ============================================================ permissions */

revoke execute on function public.next_certificate_id() from public, anon, authenticated;
revoke execute on function public.log_certificate_event(text, text, jsonb) from public, anon, authenticated;
revoke execute on function public.cert_text(jsonb, text, int) from public, anon, authenticated;
revoke execute on function public.insert_certificate(jsonb, public.certificates) from public, anon, authenticated;
revoke execute on function public.issue_certificate_for_order(uuid) from public, anon, authenticated;
revoke execute on function public.admin_issue_certificate(jsonb) from public, anon;
revoke execute on function public.admin_update_certificate(text, jsonb) from public, anon;
revoke execute on function public.admin_reissue_certificate(text, jsonb, text) from public, anon;
revoke execute on function public.admin_revoke_certificate(text, text) from public, anon;
revoke execute on function public.record_certificate_download(text) from public, anon;
revoke execute on function public.admin_list_certificates() from public, anon;
grant execute on function public.admin_issue_certificate(jsonb) to authenticated;
grant execute on function public.admin_update_certificate(text, jsonb) to authenticated;
grant execute on function public.admin_reissue_certificate(text, jsonb, text) to authenticated;
grant execute on function public.admin_revoke_certificate(text, text) to authenticated;
grant execute on function public.record_certificate_download(text) to authenticated;
grant execute on function public.admin_list_certificates() to authenticated;
grant execute on function public.verify_certificate(text) to anon, authenticated;

notify pgrst, 'reload schema';
