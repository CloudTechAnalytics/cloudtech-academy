-- The programme classroom: a separate learning space for Professional Programme students.
--
-- * Opening a programme now enrols the student in every course it contains, including courses that are also free in
--   the public catalogue. Those enrolments have the source 'programme', so they're part of the paid programme: they
--   never reset for inactivity, can't be removed from My Learning, and don't send one email per course. Progress a
--   student made in the free course before paying carries over (it's the same course).
-- * Each programme student can belong to a batch. It's set from their application when they enrol, and admins can
--   change it.
-- * Live classes (with join links, recordings and attendance), announcements, and graded assignments belong to a
--   programme and optionally one batch. Students see the ones for the whole programme and for their own batch.
-- * The programme badge now also needs every required assignment graded as passed.

/* ============================================================ enrolments */

alter table public.enrollments drop constraint if exists enrollments_source_check;
alter table public.enrollments add constraint enrollments_source_check check (source in ('free', 'purchase', 'granted', 'programme'));

alter table public.programme_enrollments add column if not exists batch_id uuid references public.programme_batches (id) on delete set null;

-- Opens a programme for a learner: the programme enrolment, the paid courses it contains, and its free courses too,
-- so the whole programme sits in their classroom.
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
    set source = case when public.enrollments.source in ('free', 'programme') then excluded.source else public.enrollments.source end;
  insert into public.enrollments (user_id, course_id, source, order_id)
  select p_user, tc.course_id, 'programme', p_order
    from public.track_courses tc join public.courses c on c.id = tc.course_id
   where tc.track_id = p_track_id and c.access_type = 'free'
  on conflict (user_id, course_id) do update
    set source = case when public.enrollments.source = 'free' then 'programme' else public.enrollments.source end,
        order_id = coalesce(public.enrollments.order_id, excluded.order_id);
end;
$$;
revoke execute on function public.open_programme(uuid, text, text, uuid) from public, anon, authenticated;

-- When a programme closes again, its free courses go back to being ordinary free enrolments (progress kept), unless
-- another programme the learner holds still includes them.
create or replace function public.release_programme_free_courses(p_user uuid, p_track_id text)
returns void
language sql security definer set search_path = public as $$
  update public.enrollments e set source = 'free', order_id = null
    from public.track_courses tc
   where e.user_id = p_user and e.source = 'programme' and tc.track_id = p_track_id and tc.course_id = e.course_id
     and not exists (select 1 from public.programme_enrollments pe join public.track_courses t2 on t2.track_id = pe.track_id
                      where pe.user_id = p_user and t2.course_id = e.course_id);
$$;
revoke execute on function public.release_programme_free_courses(uuid, text) from public, anon, authenticated;

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
    perform public.release_programme_free_courses(o.user_id, o.track_id);
  else
    delete from public.enrollments where user_id = o.user_id and course_id = o.course_id and source = 'purchase' and order_id = p_order;
  end if;
end;
$$;
revoke execute on function public.revoke_for_order(uuid) from public, anon, authenticated;

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
  perform public.release_programme_free_courses(p_user, p_track_id);
  update public.course_orders set status = 'cancelled', note = coalesce(nullif(trim(coalesce(p_reason, '')), ''), note)
   where user_id = p_user and track_id = p_track_id and status in ('pending', 'granted');
end;
$$;
revoke execute on function public.admin_revoke_programme_access(uuid, text, text) from public, anon;
grant execute on function public.admin_revoke_programme_access(uuid, text, text) to authenticated;

-- One welcome email for the programme, pointing at the classroom, instead of one per course.
create or replace function public.email_on_enrolment()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  c public.courses;
begin
  if new.source = 'programme' then return new; end if;
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

create or replace function public.email_on_programme()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  t public.tracks;
begin
  select * into t from public.tracks where id = new.track_id;
  if found then
    perform public.queue_email(new.user_id, 'enrolment',
      jsonb_build_object('course', public.programme_display_name(t), 'link', 'https://academy.cloudtechanalytics.com/classroom/' || t.slug));
  end if;
  return new;
end;
$$;

-- A new programme student joins the batch they applied for.
create or replace function public.programme_enrolment_batch()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.batch_id is null then
    new.batch_id := (select a.batch_id from public.programme_applications a
                      where a.user_id = new.user_id and a.track_id = new.track_id and a.batch_id is not null
                      order by a.updated_at desc limit 1);
  end if;
  return new;
exception when others then
  return new;
end;
$$;
create trigger programme_enrollments_batch before insert on public.programme_enrollments for each row execute function public.programme_enrolment_batch();

-- Existing programme students: their batch from their application, and the programme's free courses in their classroom.
update public.programme_enrollments pe set batch_id = a.batch_id
  from public.programme_applications a
 where pe.batch_id is null and a.user_id = pe.user_id and a.track_id = pe.track_id and a.batch_id is not null;
insert into public.enrollments (user_id, course_id, source, order_id)
select pe.user_id, tc.course_id, 'programme', pe.order_id
  from public.programme_enrollments pe
  join public.track_courses tc on tc.track_id = pe.track_id
  join public.courses c on c.id = tc.course_id and c.access_type = 'free'
on conflict (user_id, course_id) do update set source = 'programme' where public.enrollments.source = 'free';

/* ============================================================ who's in the classroom */

-- Whether the signed-in user can see a programme item: admins, and programme students for whole-programme items or
-- items for their batch (students not yet placed in a batch see every batch's items).
create or replace function public.in_classroom(p_track text, p_batch uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_admin() or exists (
    select 1 from public.programme_enrollments pe
     where pe.user_id = auth.uid() and pe.track_id = p_track
       and (p_batch is null or pe.batch_id is null or pe.batch_id = p_batch));
$$;
grant execute on function public.in_classroom(text, uuid) to authenticated;

-- Students can always read their own batch, even after it closes to new applicants.
create policy "students read their batch" on public.programme_batches for select to authenticated
  using (exists (select 1 from public.programme_enrollments pe where pe.user_id = auth.uid() and pe.batch_id = programme_batches.id));

/* ============================================================ live classes and attendance */

create table public.programme_sessions (
  id            uuid primary key default gen_random_uuid(),
  track_id      text not null references public.tracks (id) on delete cascade,
  batch_id      uuid references public.programme_batches (id) on delete cascade,
  title         text not null check (length(trim(title)) between 2 and 140),
  description   text,
  starts_at     timestamptz not null,
  ends_at       timestamptz,
  join_url      text check (join_url is null or join_url ~* '^https?://'),
  recording_url text check (recording_url is null or recording_url ~* '^https?://'),
  created_at    timestamptz not null default now()
);
create index programme_sessions_track_idx on public.programme_sessions (track_id, starts_at);
alter table public.programme_sessions enable row level security;
create policy "classroom reads sessions" on public.programme_sessions for select to authenticated using (public.in_classroom(track_id, batch_id));
create policy "admins manage sessions" on public.programme_sessions for all using (public.is_admin()) with check (public.is_admin());

create table public.session_attendance (
  session_id uuid not null references public.programme_sessions (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  status     text not null check (status in ('present', 'late', 'absent', 'excused')),
  marked_by  uuid references auth.users (id) on delete set null,
  marked_at  timestamptz not null default now(),
  primary key (session_id, user_id)
);
alter table public.session_attendance enable row level security;
create policy "read own attendance" on public.session_attendance for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "admins manage attendance" on public.session_attendance for all using (public.is_admin()) with check (public.is_admin());

/* ============================================================ announcements */

create table public.programme_announcements (
  id         uuid primary key default gen_random_uuid(),
  track_id   text not null references public.tracks (id) on delete cascade,
  batch_id   uuid references public.programme_batches (id) on delete cascade,
  title      text not null check (length(trim(title)) between 2 and 140),
  body       text not null check (length(trim(body)) >= 2),
  emailed    boolean not null default false,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index programme_announcements_track_idx on public.programme_announcements (track_id, created_at desc);
alter table public.programme_announcements enable row level security;
create policy "classroom reads announcements" on public.programme_announcements for select to authenticated using (public.in_classroom(track_id, batch_id));
create policy "admins manage announcements" on public.programme_announcements for all using (public.is_admin()) with check (public.is_admin());

-- Admin: posts an announcement, and emails it to the students who can see it when asked. Returns how many were emailed.
create or replace function public.admin_post_announcement(p_track text, p_batch uuid, p_title text, p_body text, p_email boolean)
returns int
language plpgsql security definer set search_path = public as $$
declare
  t   public.tracks;
  ids uuid[];
  n   int := 0;
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  select * into t from public.tracks where id = p_track;
  if not found then raise exception 'Programme not found.'; end if;
  insert into public.programme_announcements (track_id, batch_id, title, body, emailed, created_by)
  values (p_track, p_batch, trim(p_title), trim(p_body), coalesce(p_email, false), auth.uid());
  if coalesce(p_email, false) then
    select array_agg(pe.user_id) into ids from public.programme_enrollments pe
     where pe.track_id = p_track and (p_batch is null or pe.batch_id is null or pe.batch_id = p_batch);
    if coalesce(array_length(ids, 1), 0) > 0 then
      n := public.admin_send_message(ids[1:500], public.programme_display_name(t) || ': ' || trim(p_title),
             'Hi {{name}},' || E'\n\n' || trim(p_body) || E'\n\n' || 'Open your classroom: https://academy.cloudtechanalytics.com/classroom/' || t.slug);
    end if;
  end if;
  return n;
end;
$$;
revoke execute on function public.admin_post_announcement(text, uuid, text, text, boolean) from public, anon;
grant execute on function public.admin_post_announcement(text, uuid, text, text, boolean) to authenticated;

/* ============================================================ assignments */

create table public.programme_assignments (
  id         uuid primary key default gen_random_uuid(),
  track_id   text not null references public.tracks (id) on delete cascade,
  batch_id   uuid references public.programme_batches (id) on delete cascade,
  -- The course it goes with, to place it in the programme. Optional.
  course_id  text references public.courses (id) on delete set null,
  title      text not null check (length(trim(title)) between 2 and 140),
  brief      text not null default '',
  due_at     timestamptz,
  max_score  int not null default 100 check (max_score between 1 and 1000),
  pass_score int check (pass_score is null or pass_score >= 0),
  -- Required assignments must be graded as passed before the programme badge.
  required   boolean not null default true,
  published  boolean not null default true,
  created_at timestamptz not null default now()
);
create index programme_assignments_track_idx on public.programme_assignments (track_id, due_at);
alter table public.programme_assignments enable row level security;
create policy "classroom reads assignments" on public.programme_assignments for select to authenticated using (published and public.in_classroom(track_id, batch_id) or public.is_admin());
create policy "admins manage assignments" on public.programme_assignments for all using (public.is_admin()) with check (public.is_admin());

create table public.assignment_submissions (
  id            uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.programme_assignments (id) on delete cascade,
  user_id       uuid not null references auth.users (id) on delete cascade,
  content       text not null default '',
  url           text,
  status        text not null default 'submitted' check (status in ('submitted', 'graded', 'returned')),
  score         int,
  feedback      text,
  submitted_at  timestamptz not null default now(),
  graded_by     uuid references auth.users (id) on delete set null,
  graded_at     timestamptz,
  unique (assignment_id, user_id)
);
alter table public.assignment_submissions enable row level security;
create policy "read own submissions" on public.assignment_submissions for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "admins manage submissions" on public.assignment_submissions for all using (public.is_admin()) with check (public.is_admin());

-- A student hands in (or hands in again) an assignment. Graded work is final; returned work can be resubmitted.
create or replace function public.submit_assignment(p_assignment uuid, p_content text, p_url text)
returns public.assignment_submissions
language plpgsql security definer set search_path = public as $$
declare
  a public.programme_assignments;
  s public.assignment_submissions;
  v_url text := nullif(trim(coalesce(p_url, '')), '');
begin
  if auth.uid() is null then raise exception 'Please sign in first.'; end if;
  select * into a from public.programme_assignments where id = p_assignment and published;
  if not found then raise exception 'Assignment not found.'; end if;
  if not exists (select 1 from public.programme_enrollments pe where pe.user_id = auth.uid() and pe.track_id = a.track_id
                   and (a.batch_id is null or pe.batch_id is null or pe.batch_id = a.batch_id)) then
    raise exception 'This assignment is for students in the programme.';
  end if;
  if length(trim(coalesce(p_content, ''))) < 2 and v_url is null then raise exception 'Write your answer or add a link to your work.'; end if;
  if v_url is not null and v_url !~* '^https?://' then raise exception 'The link must start with http:// or https://.'; end if;
  select * into s from public.assignment_submissions where assignment_id = p_assignment and user_id = auth.uid();
  if found and s.status = 'graded' then raise exception 'This assignment has been graded. Ask your instructor if you need to resubmit.'; end if;
  insert into public.assignment_submissions (assignment_id, user_id, content, url)
  values (p_assignment, auth.uid(), trim(coalesce(p_content, '')), v_url)
  on conflict (assignment_id, user_id) do update
    set content = excluded.content, url = excluded.url, status = 'submitted', submitted_at = now()
  returning * into s;
  return s;
end;
$$;
revoke execute on function public.submit_assignment(uuid, text, text) from public, anon;
grant execute on function public.submit_assignment(uuid, text, text) to authenticated;

-- Admin: marks a submission. 'graded' is final; 'returned' asks the student to improve it and resubmit.
create or replace function public.admin_grade_submission(p_submission uuid, p_status text, p_score int, p_feedback text)
returns void
language plpgsql security definer set search_path = public as $$
declare
  s public.assignment_submissions;
  a public.programme_assignments;
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  if p_status not in ('graded', 'returned') then raise exception 'Choose Graded or Returned.'; end if;
  select * into s from public.assignment_submissions where id = p_submission;
  if not found then raise exception 'Submission not found.'; end if;
  select * into a from public.programme_assignments where id = s.assignment_id;
  if p_status = 'graded' and (p_score is null or p_score < 0 or p_score > a.max_score) then
    raise exception 'Enter a score from 0 to %.', a.max_score;
  end if;
  update public.assignment_submissions
     set status = p_status, score = p_score, feedback = nullif(trim(coalesce(p_feedback, '')), ''), graded_by = auth.uid(), graded_at = now()
   where id = p_submission;
end;
$$;
revoke execute on function public.admin_grade_submission(uuid, text, int, text) from public, anon;
grant execute on function public.admin_grade_submission(uuid, text, int, text) to authenticated;

-- Whether a learner has passed every required assignment of a programme that applies to them.
create or replace function public.assignments_passed(p_user uuid, p_track text)
returns boolean language sql stable security definer set search_path = public as $$
  select not exists (
    select 1 from public.programme_assignments a
     where a.track_id = p_track and a.published and a.required
       and (a.batch_id is null or a.batch_id = (select pe.batch_id from public.programme_enrollments pe where pe.user_id = p_user and pe.track_id = p_track))
       and not exists (select 1 from public.assignment_submissions s
                        where s.assignment_id = a.id and s.user_id = p_user and s.status = 'graded'
                          and (a.pass_score is null or s.score >= a.pass_score)));
$$;

-- The programme badge: every required course, and for programme students every required assignment passed.
create or replace function public.issue_track_credential(p_track_id text)
returns public.credentials
language plpgsql security definer set search_path = public as $$
declare
  v_user    uuid := auth.uid();
  v_track   public.tracks;
  v_cred    public.credentials;
  v_missing int;
begin
  if v_user is null then raise exception 'Please sign in first.'; end if;
  select * into v_track from public.tracks where id = p_track_id and published;
  if not found then raise exception 'Track not found.'; end if;

  select * into v_cred from public.credentials
   where user_id = v_user and track_id = p_track_id and kind = 'track_completion' and status = 'valid';
  if found then return v_cred; end if;

  select count(*) into v_missing
    from public.track_courses tc join public.courses c on c.id = tc.course_id and c.published
   where tc.track_id = p_track_id and tc.required
     and not exists (select 1 from public.credentials x where x.user_id = v_user and x.course_id = tc.course_id
                      and x.kind = 'course_completion' and x.status = 'valid');
  if v_missing > 0 then raise exception 'Complete every required course in the track first (% left).', v_missing; end if;
  if exists (select 1 from public.programme_enrollments where user_id = v_user and track_id = p_track_id)
     and not public.assignments_passed(v_user, p_track_id) then
    raise exception 'Pass every required assignment in your classroom first.';
  end if;

  insert into public.credentials (credential_id, user_id, kind, track_id, badge_name, course_title, recipient_name, skills)
  values (public.new_credential_id(v_track.badge_code), v_user, 'track_completion', v_track.id, v_track.badge_name,
          v_track.title, public.recipient_name(v_user), v_track.skills)
  returning * into v_cred;
  return v_cred;
end;
$$;
revoke execute on function public.issue_track_credential(text) from public, anon;
grant execute on function public.issue_track_credential(text) to authenticated;

/* ============================================================ admin: roster and batches */

create or replace function public.admin_classroom_roster(p_track text)
returns table (user_id uuid, full_name text, email text, batch_id uuid, enrolled_at timestamptz, source text)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  return query
    select pe.user_id, p.full_name, p.email, pe.batch_id, pe.enrolled_at, pe.source
      from public.programme_enrollments pe left join public.profiles p on p.id = pe.user_id
     where pe.track_id = p_track
     order by p.full_name;
end;
$$;
revoke execute on function public.admin_classroom_roster(text) from public, anon;
grant execute on function public.admin_classroom_roster(text) to authenticated;

create or replace function public.admin_set_student_batch(p_user uuid, p_track text, p_batch uuid)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  if p_batch is not null and not exists (select 1 from public.programme_batches where id = p_batch and track_id = p_track) then
    raise exception 'That batch belongs to another programme.';
  end if;
  update public.programme_enrollments set batch_id = p_batch where user_id = p_user and track_id = p_track;
  if not found then raise exception 'That student isn''t in this programme.'; end if;
end;
$$;
revoke execute on function public.admin_set_student_batch(uuid, text, uuid) from public, anon;
grant execute on function public.admin_set_student_batch(uuid, text, uuid) to authenticated;

notify pgrst, 'reload schema';
