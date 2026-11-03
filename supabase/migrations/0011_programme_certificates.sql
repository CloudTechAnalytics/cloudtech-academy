-- Professional Programme certificates.
--
-- A career track is a programme: its required courses, ending in a capstone project. Finishing it already
-- earns the free track badge. This adds an official certificate for the whole programme, issued the same
-- way as a course certificate (paid by card, or granted by an admin), verified on the same public page,
-- and recorded in the same table with source = 'programme'.
--
-- * The learner must hold the valid track badge first, which the server only issues once every required
--   course (including the capstone) is complete. The programme certificate then builds on that.
-- * Programme prices are separate from course prices (certificate_prices gains a kind).
-- * Course certificates are untouched and stay optional.

alter table public.tracks
  add column if not exists programme_title      text,
  add column if not exists certificate_enabled  boolean not null default false;

/* ============================================================ certificates */

alter table public.certificates add column track_id text references public.tracks (id);

alter table public.certificates drop constraint certificates_source_check;
alter table public.certificates add constraint certificates_source_check check (source in ('course', 'manual', 'programme'));
alter table public.certificates drop constraint certificates_training_type_check;
alter table public.certificates add constraint certificates_training_type_check
  check (training_type in ('academy_course', 'academy_programme', 'one_on_one', 'corporate', 'bootcamp', 'workshop', 'private', 'other'));
alter table public.certificates drop constraint certificates_certificate_type_check;
alter table public.certificates add constraint certificates_certificate_type_check
  check (certificate_type in ('completion', 'participation', 'professional_training', 'achievement', 'workshop', 'professional_programme'));

alter table public.certificates drop constraint certificates_course_links;
alter table public.certificates add constraint certificates_course_links check (
  source = 'manual'
  or (source = 'course'    and credential_id is not null and user_id is not null and course_id is not null)
  or (source = 'programme' and credential_id is not null and user_id is not null and track_id  is not null));

create unique index certificates_one_valid_per_programme on public.certificates (user_id, track_id) where status = 'valid' and source = 'programme';

/* ============================================================ orders and prices */

alter table public.certificate_orders add column track_id text references public.tracks (id);
alter table public.certificate_orders alter column course_id drop not null;
alter table public.certificate_orders add constraint certificate_orders_target check ((course_id is not null) <> (track_id is not null));

alter table public.certificate_prices add column kind text not null default 'course' check (kind in ('course', 'programme'));
alter table public.certificate_prices drop constraint certificate_prices_pkey;
alter table public.certificate_prices add primary key (kind, currency);
insert into public.certificate_prices (kind, currency, amount, position) values ('programme', 'NGN', 15000, 1), ('programme', 'USD', 30, 2);

-- Course certificate orders now look only at course prices.
create or replace function public.start_certificate_order(p_course_id text, p_currency text)
returns public.certificate_orders
language plpgsql security definer set search_path = public as $$
declare
  v_user  uuid := auth.uid();
  v_cred  public.credentials;
  v_price public.certificate_prices;
  v_order public.certificate_orders;
begin
  if v_user is null then raise exception 'Please sign in first.'; end if;
  select * into v_cred from public.credentials
  where user_id = v_user and course_id = p_course_id and kind = 'course_completion' and status = 'valid';
  if not found then raise exception 'Complete the course first. Your free completion badge comes first.'; end if;
  if exists (select 1 from public.certificates where user_id = v_user and course_id = p_course_id and status = 'valid' and source = 'course') then
    raise exception 'You already have the official certificate for this course.';
  end if;
  select * into v_price from public.certificate_prices where kind = 'course' and currency = upper(p_currency) and active;
  if not found then raise exception 'That currency isn''t available.'; end if;

  select * into v_order from public.certificate_orders
  where user_id = v_user and course_id = p_course_id and status = 'pending' and currency = v_price.currency;
  if found then return v_order; end if;

  insert into public.certificate_orders (user_id, course_id, credential_id, currency, amount)
  values (v_user, p_course_id, v_cred.credential_id, v_price.currency, v_price.amount)
  returning * into v_order;
  return v_order;
end;
$$;

-- Starts (or reuses) an order for a programme's official certificate. The track badge must be held first.
create or replace function public.start_programme_order(p_track_id text, p_currency text)
returns public.certificate_orders
language plpgsql security definer set search_path = public as $$
declare
  v_user  uuid := auth.uid();
  v_track public.tracks;
  v_cred  public.credentials;
  v_price public.certificate_prices;
  v_order public.certificate_orders;
begin
  if v_user is null then raise exception 'Please sign in first.'; end if;
  select * into v_track from public.tracks where id = p_track_id and published;
  if not found then raise exception 'Programme not found.'; end if;
  if not v_track.certificate_enabled then raise exception 'The certificate for this programme isn''t available yet.'; end if;
  select * into v_cred from public.credentials
  where user_id = v_user and track_id = p_track_id and kind = 'track_completion' and status = 'valid';
  if not found then raise exception 'Complete every required course and the capstone first, then claim your programme badge.'; end if;
  if exists (select 1 from public.certificates where user_id = v_user and track_id = p_track_id and status = 'valid' and source = 'programme') then
    raise exception 'You already have the official certificate for this programme.';
  end if;
  select * into v_price from public.certificate_prices where kind = 'programme' and currency = upper(p_currency) and active;
  if not found then raise exception 'That currency isn''t available.'; end if;

  select * into v_order from public.certificate_orders
  where user_id = v_user and track_id = p_track_id and status = 'pending' and currency = v_price.currency;
  if found then return v_order; end if;

  insert into public.certificate_orders (user_id, track_id, credential_id, currency, amount)
  values (v_user, p_track_id, v_cred.credential_id, v_price.currency, v_price.amount)
  returning * into v_order;
  return v_order;
end;
$$;

-- Issues the certificate for a paid or granted order: a course certificate or a programme certificate.
create or replace function public.issue_certificate_for_order(p_order_id uuid)
returns public.certificates
language plpgsql security definer set search_path = public as $$
declare
  v_order public.certificate_orders;
  v_cred  public.credentials;
  v_track public.tracks;
  v_cert  public.certificates;
begin
  select * into v_order from public.certificate_orders where id = p_order_id;
  if not found or v_order.status not in ('paid', 'granted') then raise exception 'The order isn''t paid.'; end if;
  select * into v_cred from public.credentials where credential_id = v_order.credential_id;

  if v_order.track_id is not null then
    select * into v_cert from public.certificates where user_id = v_order.user_id and track_id = v_order.track_id and status = 'valid' and source = 'programme';
    if found then return v_cert; end if;
    select * into v_track from public.tracks where id = v_order.track_id;
    insert into public.certificates (certificate_id, source, credential_id, order_id, user_id, track_id, recipient_name, course_title,
                                     certificate_title, training_type, certificate_type, description, completion_date, template_id)
    values (public.next_certificate_id(), 'programme', v_cred.credential_id, v_order.id, v_order.user_id, v_order.track_id, v_cred.recipient_name,
            v_track.title, coalesce(v_track.programme_title, v_track.title), 'academy_programme', 'professional_programme',
            left(array_to_string(v_track.skills, ', '), 600), v_cred.issued_at::date, 'signature')
    returning * into v_cert;
    perform public.log_certificate_event(v_cert.certificate_id, 'issued', jsonb_build_object('order', v_order.id, 'payment', v_order.status, 'programme', v_order.track_id));
    return v_cert;
  end if;

  select * into v_cert from public.certificates
  where user_id = v_order.user_id and course_id = v_order.course_id and status = 'valid' and source = 'course';
  if found then return v_cert; end if;
  insert into public.certificates (certificate_id, source, credential_id, order_id, user_id, course_id, recipient_name, course_title,
                                   certificate_title, training_type, certificate_type, completion_date, template_id)
  values (public.next_certificate_id(), 'course', v_cred.credential_id, v_order.id, v_order.user_id, v_order.course_id,
          v_cred.recipient_name, v_cred.course_title, 'Certificate of Completion', 'academy_course', 'completion',
          v_cred.issued_at::date, 'classic')
  returning * into v_cert;
  perform public.log_certificate_event(v_cert.certificate_id, 'issued', jsonb_build_object('order', v_order.id, 'payment', v_order.status));
  return v_cert;
end;
$$;

revoke execute on function public.start_programme_order(text, text) from public, anon;
grant execute on function public.start_programme_order(text, text) to authenticated;
revoke execute on function public.issue_certificate_for_order(uuid) from public, anon, authenticated;

notify pgrst, 'reload schema';
