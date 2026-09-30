-- CloudTech Academy database schema.
-- Run this in the Supabase SQL editor (or with the Supabase CLI), then run supabase/seed.sql.
--
-- Security model
-- * Content (courses, modules, lessons) is public to read when published; only admins write it.
-- * Learners read and write only their own progress.
-- * Assessment answer keys are readable by admins only. Grading happens in submit_assessment().
-- * Credentials (module badges and course completions) are free and are only created by
--   claim_module_badge() and issue_course_credential(), which check every requirement.
-- * The official certificate is optional and paid: an order is created, and the certificate is
--   issued only when the order is paid (by the payment provider's server) or granted by an admin.
-- * verify_credential() and verify_certificate() let anyone check an ID and return no private data.

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
  format              text not null default 'full' check (format in ('full', 'short')),
  completion_badge    text,
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
  require_module_badges boolean not null default false,
  passing_score       int not null default 60 check (passing_score between 1 and 100),
  position            int not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table public.course_modules (
  id         text primary key,
  course_id  text not null references public.courses (id) on delete cascade,
  title      text not null,
  position   int not null default 0,
  -- A module with a badge awards it when its module assessment is passed.
  badge_name text,
  badge_code text check (badge_code is null or badge_code ~ '^[A-Z0-9]{2,8}$'),
  skills     text[] not null default '{}'
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
  course_id     text not null references public.courses (id) on delete cascade,
  kind          text not null default 'final' check (kind in ('module', 'final')),
  module_id     text references public.course_modules (id) on delete cascade,
  title         text not null,
  passing_score int not null default 60 check (passing_score between 1 and 100),
  published     boolean not null default true,
  check ((kind = 'module') = (module_id is not null))
);
create unique index assessments_one_final on public.assessments (course_id) where kind = 'final';
create unique index assessments_one_per_module on public.assessments (module_id) where kind = 'module';

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

/* ============================================================ credentials and certificates */

-- Free credentials: a badge for each module passed, and one for completing the course.
create table public.credentials (
  id             uuid primary key default gen_random_uuid(),
  credential_id  text not null unique,
  user_id        uuid not null references auth.users (id) on delete cascade,
  kind           text not null check (kind in ('module_badge', 'course_completion')),
  course_id      text not null references public.courses (id),
  module_id      text references public.course_modules (id) on delete set null,
  badge_name     text not null,
  course_title   text not null,
  module_title   text,
  recipient_name text not null,
  skills         text[] not null default '{}',
  issued_at      timestamptz not null default now(),
  status         text not null default 'valid' check (status in ('valid', 'revoked')),
  revoked_at     timestamptz,
  revoked_reason text
);
create unique index credentials_one_valid on public.credentials (user_id, course_id, kind, coalesce(module_id, '')) where status = 'valid';
create index credentials_user_idx on public.credentials (user_id);

-- Price of the optional official certificate, per currency. Add rows to support more currencies.
create table public.certificate_prices (
  currency text primary key check (currency ~ '^[A-Z]{3}$'),
  amount   numeric(12, 2) not null check (amount > 0),
  active   boolean not null default true,
  position int not null default 0
);
insert into public.certificate_prices (currency, amount, position) values ('NGN', 3000, 1), ('USD', 7, 2);

create table public.certificate_orders (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  course_id     text not null references public.courses (id),
  credential_id text not null references public.credentials (credential_id),
  currency      text not null,
  amount        numeric(12, 2) not null,
  status        text not null default 'pending' check (status in ('pending', 'paid', 'granted', 'failed', 'cancelled')),
  provider      text,
  provider_ref  text unique,
  note          text,
  created_at    timestamptz not null default now(),
  paid_at       timestamptz
);
create index certificate_orders_user_idx on public.certificate_orders (user_id);

create sequence public.certificate_number_seq;

-- The official certificate, issued once its order is paid or granted.
create table public.certificates (
  id             uuid primary key default gen_random_uuid(),
  certificate_id text not null unique,
  credential_id  text not null references public.credentials (credential_id),
  order_id       uuid references public.certificate_orders (id),
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
alter table public.credentials            enable row level security;
alter table public.certificate_prices     enable row level security;
alter table public.certificate_orders     enable row level security;
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

-- enrollments: learners enrol themselves and move their bookmark; completion is set by issue_course_credential()
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

-- attempts, submissions, credentials, orders and certificates are written only through the functions below
create policy "read own attempts" on public.assessment_attempts for select using (user_id = auth.uid() or public.is_admin());
create policy "read own submissions" on public.project_submissions for select using (user_id = auth.uid() or public.is_admin());
create policy "admin review submissions" on public.project_submissions for update using (public.is_admin()) with check (public.is_admin());
create policy "read own credentials" on public.credentials for select using (user_id = auth.uid() or public.is_admin());
create policy "admin revoke credentials" on public.credentials for update using (public.is_admin()) with check (public.is_admin());
create policy "read prices" on public.certificate_prices for select using (true);
create policy "admin prices" on public.certificate_prices for all using (public.is_admin()) with check (public.is_admin());
create policy "read own orders" on public.certificate_orders for select using (user_id = auth.uid() or public.is_admin());
create policy "admin update orders" on public.certificate_orders for update using (public.is_admin()) with check (public.is_admin());
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

-- The learner's name as it appears on credentials. Everything they earn carries it.
create or replace function public.recipient_name(p_user uuid)
returns text language plpgsql stable security definer set search_path = public as $$
declare v_name text;
begin
  select trim(full_name) into v_name from public.profiles where id = p_user;
  if coalesce(v_name, '') = '' then
    raise exception 'Add your full name to your profile first. It appears on your badges and certificate.';
  end if;
  return v_name;
end;
$$;

-- Credential IDs like CTA-PROMPT-8F72K: easy to read aloud, with no 0/O or 1/I to confuse.
create or replace function public.new_credential_id(p_code text)
returns text language plpgsql volatile security definer set search_path = public as $$
declare
  v_alpha constant text := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  v_id    text;
begin
  loop
    v_id := 'CTA-' || upper(p_code) || '-';
    for i in 1..5 loop
      v_id := v_id || substr(v_alpha, 1 + floor(random() * length(v_alpha))::int, 1);
    end loop;
    exit when not exists (select 1 from public.credentials where credential_id = v_id);
  end loop;
  return v_id;
end;
$$;

-- Awards a module's badge once its module assessment is passed (or returns the existing badge).
create or replace function public.claim_module_badge(p_module_id text)
returns public.credentials
language plpgsql security definer set search_path = public as $$
declare
  v_user   uuid := auth.uid();
  v_module public.course_modules;
  v_course public.courses;
  v_cred   public.credentials;
begin
  if v_user is null then raise exception 'Please sign in first.'; end if;
  select * into v_module from public.course_modules where id = p_module_id;
  if not found or v_module.badge_name is null then raise exception 'This module has no badge.'; end if;
  select * into v_course from public.courses where id = v_module.course_id and published;
  if not found then raise exception 'Course not found.'; end if;

  select * into v_cred from public.credentials
  where user_id = v_user and kind = 'module_badge' and module_id = p_module_id and status = 'valid';
  if found then return v_cred; end if;

  if not exists (
    select 1 from public.assessment_attempts t join public.assessments a on a.id = t.assessment_id
    where a.kind = 'module' and a.module_id = p_module_id and t.user_id = v_user and t.passed
  ) then
    raise exception 'Pass the module check first.';
  end if;

  insert into public.credentials (credential_id, user_id, kind, course_id, module_id, badge_name, course_title, module_title, recipient_name, skills)
  values (public.new_credential_id(coalesce(v_module.badge_code, v_course.code)), v_user, 'module_badge', v_course.id, v_module.id,
          v_module.badge_name, v_course.title, v_module.title, public.recipient_name(v_user), v_module.skills)
  returning * into v_cred;
  return v_cred;
end;
$$;

-- Issues the free course completion credential once every requirement is met (or returns it).
create or replace function public.issue_course_credential(p_course_id text)
returns public.credentials
language plpgsql security definer set search_path = public as $$
declare
  v_user    uuid := auth.uid();
  v_course  public.courses;
  v_cred    public.credentials;
  v_missing int;
begin
  if v_user is null then raise exception 'Please sign in first.'; end if;

  select * into v_course from public.courses where id = p_course_id and published;
  if not found then raise exception 'Course not found.'; end if;
  if not v_course.certificate_enabled then raise exception 'This course doesn''t award a credential.'; end if;

  select * into v_cred from public.credentials
  where user_id = v_user and course_id = p_course_id and kind = 'course_completion' and status = 'valid';
  if found then return v_cred; end if;

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

  if v_course.require_module_badges then
    select count(*) into v_missing
    from public.course_modules m
    where m.course_id = p_course_id and m.badge_name is not null
      and exists (select 1 from public.assessments a where a.module_id = m.id and a.kind = 'module' and a.published)
      and not exists (select 1 from public.credentials c where c.user_id = v_user and c.module_id = m.id and c.kind = 'module_badge' and c.status = 'valid');
    if v_missing > 0 then raise exception 'Earn every module badge first (% left).', v_missing; end if;
  end if;

  if not exists (
    select 1 from public.assessment_attempts t join public.assessments a on a.id = t.assessment_id
    where a.course_id = p_course_id and a.kind = 'final' and t.user_id = v_user and t.passed
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

  insert into public.credentials (credential_id, user_id, kind, course_id, badge_name, course_title, recipient_name, skills)
  values (public.new_credential_id(v_course.code), v_user, 'course_completion', v_course.id,
          coalesce(v_course.completion_badge, v_course.title), v_course.title, public.recipient_name(v_user), v_course.skills)
  returning * into v_cred;

  update public.enrollments set completed_at = coalesce(completed_at, now())
  where user_id = v_user and course_id = p_course_id;

  return v_cred;
end;
$$;

-- Starts (or reuses) an order for the optional official certificate. The course must be complete.
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
  if exists (select 1 from public.certificates where user_id = v_user and course_id = p_course_id and status = 'valid') then
    raise exception 'You already have the official certificate for this course.';
  end if;
  select * into v_price from public.certificate_prices where currency = upper(p_currency) and active;
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

-- Issues the certificate for a paid or granted order. Internal: called by the two functions below.
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
  select * into v_cert from public.certificates where user_id = v_order.user_id and course_id = v_order.course_id and status = 'valid';
  if found then return v_cert; end if;
  select * into v_cred from public.credentials where credential_id = v_order.credential_id;
  insert into public.certificates (certificate_id, credential_id, order_id, user_id, course_id, recipient_name, course_title)
  values ('CTA-CERT-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.certificate_number_seq')::text, 6, '0'),
          v_cred.credential_id, v_order.id, v_order.user_id, v_order.course_id, v_cred.recipient_name, v_cred.course_title)
  returning * into v_cert;
  return v_cert;
end;
$$;

-- Called by the payment provider's server code (with the service role key) once a payment is confirmed.
create or replace function public.complete_certificate_order(p_order_id uuid, p_provider text, p_reference text)
returns public.certificates
language plpgsql security definer set search_path = public as $$
begin
  update public.certificate_orders
  set status = 'paid', provider = p_provider, provider_ref = p_reference, paid_at = coalesce(paid_at, now())
  where id = p_order_id and status in ('pending', 'paid');
  if not found then raise exception 'Order not found.'; end if;
  return public.issue_certificate_for_order(p_order_id);
end;
$$;

-- Admins can grant a certificate, e.g. after a bank transfer or as a scholarship.
create or replace function public.admin_grant_certificate(p_order_id uuid, p_note text)
returns public.certificates
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  update public.certificate_orders
  set status = 'granted', note = nullif(trim(coalesce(p_note, '')), ''), paid_at = coalesce(paid_at, now())
  where id = p_order_id and status in ('pending', 'failed', 'cancelled', 'granted', 'paid');
  if not found then raise exception 'Order not found.'; end if;
  return public.issue_certificate_for_order(p_order_id);
end;
$$;

-- Public checks. They return only what is printed on the badge or certificate.
create or replace function public.verify_credential(p_credential_id text)
returns table (credential_id text, kind text, badge_name text, course_id text, course_title text, module_title text,
               recipient_name text, skills text[], issued_at timestamptz, status text)
language sql stable security definer set search_path = public as $$
  select c.credential_id, c.kind, c.badge_name, c.course_id, c.course_title, c.module_title, c.recipient_name, c.skills, c.issued_at, c.status
  from public.credentials c
  where c.credential_id = upper(trim(p_credential_id));
$$;

create or replace function public.verify_certificate(p_certificate_id text)
returns table (certificate_id text, credential_id text, recipient_name text, course_title text, issued_at timestamptz, status text)
language sql stable security definer set search_path = public as $$
  select c.certificate_id, c.credential_id, c.recipient_name, c.course_title, c.issued_at, c.status
  from public.certificates c
  where c.certificate_id = upper(trim(p_certificate_id));
$$;

-- Admin overview of learners.
create or replace function public.admin_list_students()
returns table (user_id uuid, full_name text, email text, joined_at timestamptz, enrollments bigint, completed_courses bigint,
               certificates bigint, lessons_completed bigint, badges bigint, last_active_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  return query
  select p.id, p.full_name, p.email, p.created_at,
         (select count(*) from public.enrollments e where e.user_id = p.id),
         (select count(*) from public.enrollments e where e.user_id = p.id and e.completed_at is not null),
         (select count(*) from public.certificates c where c.user_id = p.id and c.status = 'valid'),
         (select count(*) from public.lesson_progress lp where lp.user_id = p.id),
         (select count(*) from public.credentials c where c.user_id = p.id and c.status = 'valid'),
         -- The latest thing the learner did: enrolled, finished a lesson or exercise, took an assessment or earned a credential.
         greatest(
           (select max(e.enrolled_at) from public.enrollments e where e.user_id = p.id),
           (select max(lp.completed_at) from public.lesson_progress lp where lp.user_id = p.id),
           (select max(x.completed_at) from public.exercise_completions x where x.user_id = p.id),
           (select max(a.submitted_at) from public.assessment_attempts a where a.user_id = p.id),
           (select max(c.issued_at) from public.credentials c where c.user_id = p.id)
         )
  from public.profiles p
  where p.role <> 'admin'
  order by p.created_at desc;
end;
$$;

-- Functions are executable by PUBLIC by default; limit the learner functions to signed-in users.
revoke execute on function public.submit_assessment(text, jsonb) from public, anon;
revoke execute on function public.submit_project(text, text, text) from public, anon;
revoke execute on function public.claim_module_badge(text) from public, anon;
revoke execute on function public.issue_course_credential(text) from public, anon;
revoke execute on function public.start_certificate_order(text, text) from public, anon;
revoke execute on function public.admin_grant_certificate(uuid, text) from public, anon;
revoke execute on function public.admin_list_students() from public, anon;
-- Internal helpers, and the payment completion that only the payment server (service role) may call.
revoke execute on function public.recipient_name(uuid) from public, anon, authenticated;
revoke execute on function public.new_credential_id(text) from public, anon, authenticated;
revoke execute on function public.issue_certificate_for_order(uuid) from public, anon, authenticated;
revoke execute on function public.complete_certificate_order(uuid, text, text) from public, anon, authenticated;
grant execute on function public.submit_assessment(text, jsonb) to authenticated;
grant execute on function public.submit_project(text, text, text) to authenticated;
grant execute on function public.claim_module_badge(text) to authenticated;
grant execute on function public.issue_course_credential(text) to authenticated;
grant execute on function public.start_certificate_order(text, text) to authenticated;
grant execute on function public.admin_grant_certificate(uuid, text) to authenticated;
grant execute on function public.admin_list_students() to authenticated;
grant execute on function public.verify_credential(text) to anon, authenticated;
grant execute on function public.verify_certificate(text) to anon, authenticated;

-- Supabase's server-side role, used by the payment integration.
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    grant execute on function public.complete_certificate_order(uuid, text, text) to service_role;
  end if;
end $$;

/* ============================================================ making someone an admin
   After signing up through the site, run in the SQL editor:
     update public.profiles set role = 'admin' where email = 'you@example.com';
*/
