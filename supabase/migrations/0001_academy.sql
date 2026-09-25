-- CloudTech Academy database schema.
-- Run this in the Supabase SQL editor (or with the Supabase CLI), then run supabase/seed.sql.
--
-- Security model
-- * Content (courses, modules, lessons) is public to read when published; only admins write it.
-- * Learners read and write only their own progress.
-- * Assessment answer keys are readable by admins only. Grading happens in submit_assessment().
-- * Certificates are only created by issue_certificate(), which checks every requirement.
-- * verify_certificate() lets anyone check a credential ID and returns no private data.

create extension if not exists pgcrypto;

/* ============================================================ profiles */

create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  full_name    text not null default '',
  email        text not null default '',
  role         text not null default 'student' check (role in ('student', 'admin')),
  country      text,
  career_stage text,
  created_at   timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), coalesce(new.email, ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Roles can only be changed by an admin, or from the SQL editor (where auth.uid() is null).
create or replace function public.protect_profile_role()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.role is distinct from old.role and auth.uid() is not null and not public.is_admin() then
    raise exception 'Only an admin can change roles';
  end if;
  return new;
end;
$$;

create trigger protect_profile_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

/* ============================================================ content */

create table public.course_categories (
  id          text primary key,
  name        text not null,
  description text not null default '',
  is_future   boolean not null default false,
  position    int not null default 0
);

create table public.courses (
  id                  text primary key,
  slug                text not null unique,
  code                text not null check (code ~ '^[A-Z]{2,6}$'),
  title               text not null,
  summary             text not null default '',
  description         text not null default '',
  category_id         text not null references public.course_categories (id),
  difficulty          text not null default 'beginner' check (difficulty in ('beginner', 'intermediate', 'advanced')),
  level_label         text not null default 'Beginner',
  estimated_hours     int check (estimated_hours is null or estimated_hours > 0),
  -- Pricing is ready for later; V1 courses are all free.
  is_free             boolean not null default true,
  price_ngn           int check (price_ngn is null or price_ngn >= 0),
  status              text not null default 'coming_soon' check (status in ('available', 'coming_soon')),
  published           boolean not null default false,
  skills              text[] not null default '{}',
  prerequisites       text[] not null default '{}',
  project_title       text,
  certificate_enabled boolean not null default true,
  require_all_lessons boolean not null default true,
  require_exercises   boolean not null default true,
  require_project     boolean not null default false,
  passing_score       int not null default 70 check (passing_score between 1 and 100),
  position            int not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table public.course_modules (
  id        text primary key,
  course_id text not null references public.courses (id) on delete cascade,
  title     text not null,
  position  int not null default 0
);
create index course_modules_course_idx on public.course_modules (course_id, position);

create table public.lessons (
  id                 text primary key,
  course_id          text not null references public.courses (id) on delete cascade,
  module_id          text not null references public.course_modules (id) on delete cascade,
  slug               text not null check (slug ~ '^[a-z0-9-]+$'),
  title              text not null,
  summary            text not null default '',
  minutes            int not null default 15 check (minutes > 0),
  body_md            text not null default '',
  required           boolean not null default true,
  published          boolean not null default false,
  position           int not null default 0,
  -- IDs of required exercises in body_md, saved by the admin editor.
  required_exercises text[] not null default '{}',
  updated_at         timestamptz not null default now(),
  unique (course_id, slug)
);
create index lessons_module_idx on public.lessons (module_id, position);

create table public.assessments (
  id            text primary key,
  course_id     text not null unique references public.courses (id) on delete cascade,
  title         text not null,
  passing_score int not null default 70 check (passing_score between 1 and 100),
  published     boolean not null default true
);

create table public.assessment_questions (
  id            text primary key,
  assessment_id text not null references public.assessments (id) on delete cascade,
  position      int not null default 0,
  prompt        text not null,
  options       jsonb not null check (jsonb_typeof(options) = 'array')
);
create index assessment_questions_assessment_idx on public.assessment_questions (assessment_id, position);

-- Kept apart from the questions so learners can never read them.
create table public.assessment_answer_keys (
  question_id   text primary key references public.assessment_questions (id) on delete cascade,
  correct_index int not null check (correct_index >= 0),
  explanation   text
);

create table public.projects (
  id        text primary key,
  course_id text not null references public.courses (id) on delete cascade,
  title     text not null,
  summary   text not null default '',
  brief_md  text not null default '',
  tasks     text[] not null default '{}',
  datasets  text[] not null default '{}',
  required  boolean not null default true
);
create index projects_course_idx on public.projects (course_id);

/* ============================================================ learning records */

create table public.enrollments (
  user_id        uuid not null references auth.users (id) on delete cascade,
  course_id      text not null references public.courses (id) on delete cascade,
  enrolled_at    timestamptz not null default now(),
  completed_at   timestamptz,
  last_lesson_id text references public.lessons (id) on delete set null,
  primary key (user_id, course_id)
);
create index enrollments_course_idx on public.enrollments (course_id);

create table public.lesson_progress (
  user_id      uuid not null references auth.users (id) on delete cascade,
  lesson_id    text not null references public.lessons (id) on delete cascade,
  course_id    text not null references public.courses (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);
create index lesson_progress_user_course_idx on public.lesson_progress (user_id, course_id);

create table public.exercise_completions (
  user_id      uuid not null references auth.users (id) on delete cascade,
  exercise_id  text not null,
  lesson_id    text not null references public.lessons (id) on delete cascade,
  course_id    text not null references public.courses (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, exercise_id)
);
create index exercise_completions_user_course_idx on public.exercise_completions (user_id, course_id);

create table public.assessment_attempts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  assessment_id text not null references public.assessments (id) on delete cascade,
  answers       jsonb not null,
  correct       int not null,
  total         int not null,
  score         int not null,
  passed        boolean not null,
  submitted_at  timestamptz not null default now()
);
create index assessment_attempts_user_idx on public.assessment_attempts (user_id, assessment_id);

create table public.project_submissions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  project_id   text not null references public.projects (id) on delete cascade,
  content      text not null check (length(content) between 1 and 50000),
  url          text not null default '' check (length(url) <= 500),
  status       text not null default 'submitted' check (status in ('submitted', 'accepted', 'needs_changes')),
  feedback     text,
  submitted_at timestamptz not null default now(),
  reviewed_at  timestamptz,
  unique (user_id, project_id)
);

create table public.certificates (
  id             uuid primary key default gen_random_uuid(),
  credential_id  text not null unique,
  user_id        uuid not null references auth.users (id) on delete cascade,
  course_id      text not null references public.courses (id),
  recipient_name text not null,
  course_title   text not null,
  issued_at      timestamptz not null default now(),
  status         text not null default 'valid' check (status in ('valid', 'revoked')),
  revoked_at     timestamptz,
  revoked_reason text
);
create unique index certificates_one_valid_per_course on public.certificates (user_id, course_id) where status = 'valid';
create index certificates_user_idx on public.certificates (user_id);

/* ============================================================ updated_at */

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger courses_touch before update on public.courses for each row execute function public.touch_updated_at();
create trigger lessons_touch before update on public.lessons for each row execute function public.touch_updated_at();

/* ============================================================ row-level security */

alter table public.profiles               enable row level security;
alter table public.course_categories      enable row level security;
alter table public.courses                enable row level security;
alter table public.course_modules         enable row level security;
alter table public.lessons                enable row level security;
alter table public.assessments            enable row level security;
alter table public.assessment_questions   enable row level security;
alter table public.assessment_answer_keys enable row level security;
alter table public.projects               enable row level security;
alter table public.enrollments            enable row level security;
alter table public.lesson_progress        enable row level security;
alter table public.exercise_completions   enable row level security;
alter table public.assessment_attempts    enable row level security;
alter table public.project_submissions    enable row level security;
alter table public.certificates           enable row level security;

-- profiles
create policy "read own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
revoke update on public.profiles from anon, authenticated;
grant update (full_name, country, career_stage) on public.profiles to authenticated;

-- content: public when published, admins manage everything
create policy "read categories" on public.course_categories for select using (true);
create policy "admin categories" on public.course_categories for all using (public.is_admin()) with check (public.is_admin());

create policy "read published courses" on public.courses for select using (published or public.is_admin());
create policy "admin courses" on public.courses for all using (public.is_admin()) with check (public.is_admin());

create policy "read modules of published courses" on public.course_modules for select
  using (public.is_admin() or exists (select 1 from public.courses c where c.id = course_id and c.published));
create policy "admin modules" on public.course_modules for all using (public.is_admin()) with check (public.is_admin());

create policy "read published lessons" on public.lessons for select
  using (public.is_admin() or (published and exists (select 1 from public.courses c where c.id = course_id and c.published)));
create policy "admin lessons" on public.lessons for all using (public.is_admin()) with check (public.is_admin());

create policy "read published assessments" on public.assessments for select
  using (public.is_admin() or (published and exists (select 1 from public.courses c where c.id = course_id and c.published)));
create policy "admin assessments" on public.assessments for all using (public.is_admin()) with check (public.is_admin());

create policy "signed-in learners read questions" on public.assessment_questions for select to authenticated
  using (public.is_admin() or exists (select 1 from public.assessments a where a.id = assessment_id and a.published));
create policy "admin questions" on public.assessment_questions for all using (public.is_admin()) with check (public.is_admin());

create policy "admin answer keys" on public.assessment_answer_keys for all using (public.is_admin()) with check (public.is_admin());

create policy "read projects" on public.projects for select
  using (public.is_admin() or exists (select 1 from public.courses c where c.id = course_id and c.published));
create policy "admin projects" on public.projects for all using (public.is_admin()) with check (public.is_admin());

-- enrollments: learners enrol themselves and move their bookmark; completion is set by issue_certificate()
create policy "read own enrollments" on public.enrollments for select using (user_id = auth.uid() or public.is_admin());
create policy "enrol self" on public.enrollments for insert to authenticated
  with check (user_id = auth.uid() and exists (select 1 from public.courses c where c.id = course_id and c.published));
create policy "update own bookmark" on public.enrollments for update using (user_id = auth.uid()) with check (user_id = auth.uid());
revoke update on public.enrollments from anon, authenticated;
grant update (last_lesson_id) on public.enrollments to authenticated;

-- lesson progress
create policy "read own progress" on public.lesson_progress for select using (user_id = auth.uid() or public.is_admin());
create policy "record own progress" on public.lesson_progress for insert to authenticated
  with check (user_id = auth.uid() and exists (select 1 from public.lessons l where l.id = lesson_id and l.course_id = course_id and l.published));
create policy "undo own progress" on public.lesson_progress for delete using (user_id = auth.uid());

create policy "read own exercises" on public.exercise_completions for select using (user_id = auth.uid() or public.is_admin());
create policy "record own exercises" on public.exercise_completions for insert to authenticated
  with check (user_id = auth.uid() and exists (select 1 from public.lessons l where l.id = lesson_id and l.course_id = course_id and l.published));

-- attempts, submissions and certificates are written only through the functions below
create policy "read own attempts" on public.assessment_attempts for select using (user_id = auth.uid() or public.is_admin());
create policy "read own submissions" on public.project_submissions for select using (user_id = auth.uid() or public.is_admin());
create policy "admin review submissions" on public.project_submissions for update using (public.is_admin()) with check (public.is_admin());
create policy "read own certificates" on public.certificates for select using (user_id = auth.uid() or public.is_admin());
create policy "admin revoke certificates" on public.certificates for update using (public.is_admin()) with check (public.is_admin());

/* ============================================================ functions */

-- Grades an assessment attempt against the answer keys. Returns the score, never the answers.
create or replace function public.submit_assessment(p_assessment_id text, p_answers jsonb)
returns public.assessment_attempts
language plpgsql security definer set search_path = public as $$
declare
  v_user    uuid := auth.uid();
  v_pass    int;
  v_total   int;
  v_correct int;
  v_score   int;
  v_row     public.assessment_attempts;
begin
  if v_user is null then raise exception 'Please sign in first.'; end if;
  if jsonb_typeof(p_answers) <> 'object' then raise exception 'Answers must be an object.'; end if;

  select a.passing_score into v_pass
  from public.assessments a join public.courses c on c.id = a.course_id
  where a.id = p_assessment_id and a.published and c.published;
  if v_pass is null then raise exception 'Assessment not found.'; end if;

  if (select count(*) from public.assessment_attempts
      where user_id = v_user and assessment_id = p_assessment_id and submitted_at > now() - interval '1 hour') >= 10 then
    raise exception 'That''s a lot of attempts in one hour. Review the lessons and try again later.';
  end if;

  select count(*),
         count(*) filter (
           where jsonb_typeof(p_answers -> q.id) = 'number'
             and (p_answers ->> q.id)::numeric = k.correct_index
         )
  into v_total, v_correct
  from public.assessment_questions q
  join public.assessment_answer_keys k on k.question_id = q.id
  where q.assessment_id = p_assessment_id;

  if v_total = 0 then raise exception 'This assessment has no questions yet.'; end if;
  v_score := round(100.0 * v_correct / v_total);

  insert into public.assessment_attempts (user_id, assessment_id, answers, correct, total, score, passed)
  values (v_user, p_assessment_id, p_answers, v_correct, v_total, v_score, v_score >= v_pass)
  returning * into v_row;
  return v_row;
end;
$$;

-- Creates or updates the learner's project submission and resets it to "submitted".
create or replace function public.submit_project(p_project_id text, p_content text, p_url text)
returns public.project_submissions
language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  v_row  public.project_submissions;
begin
  if v_user is null then raise exception 'Please sign in first.'; end if;
  if not exists (select 1 from public.projects p join public.courses c on c.id = p.course_id where p.id = p_project_id and c.published) then
    raise exception 'Project not found.';
  end if;
  insert into public.project_submissions (user_id, project_id, content, url)
  values (v_user, p_project_id, p_content, coalesce(p_url, ''))
  on conflict (user_id, project_id) do update
    set content = excluded.content, url = excluded.url, status = 'submitted', submitted_at = now(), reviewed_at = null
  returning * into v_row;
  return v_row;
end;
$$;

-- Issues a certificate once every requirement for the course is met (or returns the existing one).
create or replace function public.issue_certificate(p_course_id text)
returns public.certificates
language plpgsql security definer set search_path = public as $$
declare
  v_user    uuid := auth.uid();
  v_course  public.courses;
  v_cert    public.certificates;
  v_name    text;
  v_missing int;
  v_cred    text;
begin
  if v_user is null then raise exception 'Please sign in first.'; end if;

  select * into v_course from public.courses where id = p_course_id and published;
  if not found then raise exception 'Course not found.'; end if;
  if not v_course.certificate_enabled then raise exception 'This course doesn''t award a certificate.'; end if;

  select * into v_cert from public.certificates where user_id = v_user and course_id = p_course_id and status = 'valid';
  if found then return v_cert; end if;

  if v_course.require_all_lessons then
    select count(*) into v_missing
    from public.lessons l
    where l.course_id = p_course_id and l.published and l.required
      and not exists (select 1 from public.lesson_progress p where p.user_id = v_user and p.lesson_id = l.id);
    if v_missing > 0 then raise exception 'Complete every lesson first (% left).', v_missing; end if;
  end if;

  if v_course.require_exercises then
    select count(*) into v_missing
    from (select unnest(required_exercises) as exercise_id from public.lessons where course_id = p_course_id and published) e
    where not exists (select 1 from public.exercise_completions x where x.user_id = v_user and x.exercise_id = e.exercise_id);
    if v_missing > 0 then raise exception 'Complete the practice exercises first (% left).', v_missing; end if;
  end if;

  if not exists (
    select 1 from public.assessment_attempts t join public.assessments a on a.id = t.assessment_id
    where a.course_id = p_course_id and t.user_id = v_user and t.passed
  ) then
    raise exception 'Pass the final assessment first.';
  end if;

  if v_course.require_project
     and exists (select 1 from public.projects where course_id = p_course_id and required)
     and not exists (
       select 1 from public.project_submissions s join public.projects p on p.id = s.project_id
       where p.course_id = p_course_id and s.user_id = v_user and s.status <> 'needs_changes'
     ) then
    raise exception 'Submit the final project first.';
  end if;

  select full_name into v_name from public.profiles where id = v_user;
  if coalesce(trim(v_name), '') = '' then
    raise exception 'Add your full name to your profile first. It appears on the certificate.';
  end if;

  loop
    v_cred := 'CTA-' || v_course.code || '-' || to_char(now(), 'YYYY') || '-' || lpad(floor(random() * 1000000)::int::text, 6, '0');
    exit when not exists (select 1 from public.certificates where credential_id = v_cred);
  end loop;

  insert into public.certificates (credential_id, user_id, course_id, recipient_name, course_title)
  values (v_cred, v_user, p_course_id, trim(v_name), v_course.title)
  returning * into v_cert;

  update public.enrollments set completed_at = coalesce(completed_at, now())
  where user_id = v_user and course_id = p_course_id;

  return v_cert;
end;
$$;

-- Public certificate check. Returns only what is printed on the certificate.
create or replace function public.verify_certificate(p_credential_id text)
returns table (credential_id text, recipient_name text, course_title text, issued_at timestamptz, status text)
language sql stable security definer set search_path = public as $$
  select c.credential_id, c.recipient_name, c.course_title, c.issued_at, c.status
  from public.certificates c
  where c.credential_id = upper(trim(p_credential_id));
$$;

-- Admin overview of learners.
create or replace function public.admin_list_students()
returns table (user_id uuid, full_name text, email text, joined_at timestamptz, enrollments bigint, completed_courses bigint, certificates bigint)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  return query
  select p.id, p.full_name, p.email, p.created_at,
         (select count(*) from public.enrollments e where e.user_id = p.id),
         (select count(*) from public.enrollments e where e.user_id = p.id and e.completed_at is not null),
         (select count(*) from public.certificates c where c.user_id = p.id and c.status = 'valid')
  from public.profiles p
  order by p.created_at desc;
end;
$$;

-- Functions are executable by PUBLIC by default; limit the learner functions to signed-in users.
revoke execute on function public.submit_assessment(text, jsonb) from public, anon;
revoke execute on function public.submit_project(text, text, text) from public, anon;
revoke execute on function public.issue_certificate(text) from public, anon;
revoke execute on function public.admin_list_students() from public, anon;
grant execute on function public.submit_assessment(text, jsonb) to authenticated;
grant execute on function public.submit_project(text, text, text) to authenticated;
grant execute on function public.issue_certificate(text) to authenticated;
grant execute on function public.admin_list_students() to authenticated;
grant execute on function public.verify_certificate(text) to anon, authenticated;

/* ============================================================ making someone an admin
   After signing up through the site, run in the SQL editor:
     update public.profiles set role = 'admin' where email = 'you@example.com';
*/
