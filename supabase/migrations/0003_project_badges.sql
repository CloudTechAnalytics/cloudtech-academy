-- Practice project badges: a learner submits a link to their work, a short summary of what they
-- found, and answers to a few questions with one right answer. The answers are checked here, on the
-- server; when every one is right the learner gets a project badge straight away. An admin can later
-- mark the work "Reviewed by CloudTech".

/* ============================================================ projects and submissions */

-- Loaded by seed.sql from src/content/projects.ts and project-answers.ts. `checks` holds the answers,
-- so learners can't read this table: only the grading function and admins can.
create table if not exists public.practice_projects (
  id         text primary key,
  title      text not null,
  badge_name text not null,
  badge_code text not null check (badge_code ~ '^[A-Z0-9]{2,8}$'),
  skills     text[] not null default '{}',
  -- [{ id, kind: 'number' | 'text', answer, tol, percent, accept: [normalised text] }]
  checks     jsonb not null default '[]',
  published  boolean not null default true
);

create table if not exists public.practice_submissions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  project_id    text not null references public.practice_projects (id) on delete cascade,
  work_url      text not null check (length(work_url) <= 500),
  summary       text not null check (char_length(summary) <= 3000),
  answers       jsonb not null default '{}',
  correct       int not null default 0,
  total         int not null default 0,
  -- Stays true once reached, even if a later resubmission gets an answer wrong.
  passed        boolean not null default false,
  attempts      int not null default 1,
  submitted_at  timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  reviewed_at   timestamptz,
  reviewed_by   uuid references auth.users (id) on delete set null,
  review_note   text,
  unique (user_id, project_id)
);
create index if not exists practice_submissions_project_idx on public.practice_submissions (project_id);

alter table public.practice_projects enable row level security;
alter table public.practice_submissions enable row level security;
drop policy if exists "admins read practice projects" on public.practice_projects;
create policy "admins read practice projects" on public.practice_projects for select using (public.is_admin());
drop policy if exists "read own practice submissions" on public.practice_submissions;
create policy "read own practice submissions" on public.practice_submissions for select using (user_id = auth.uid() or public.is_admin());

/* ============================================================ project badges */

alter table public.credentials drop constraint if exists credentials_kind_check;
alter table public.credentials add constraint credentials_kind_check check (kind in ('module_badge', 'course_completion', 'project_badge'));
alter table public.credentials alter column course_id drop not null;
alter table public.credentials add column if not exists project_id text references public.practice_projects (id) on delete set null;
alter table public.credentials drop constraint if exists credentials_project_kind;
alter table public.credentials add constraint credentials_project_kind check ((kind = 'project_badge') = (project_id is not null) and (kind = 'project_badge' or course_id is not null));
create unique index if not exists credentials_one_project_badge on public.credentials (user_id, project_id) where status = 'valid' and kind = 'project_badge';

/* ============================================================ grading */

-- One check against one answer. Numbers arrive already read by the site (so "₦1.4bn" and "18.5%" work)
-- and are compared within the tolerance worked out at seed time; text arrives normalised and must be
-- one of the accepted answers.
create or replace function public.grade_practice_check(p_check jsonb, p_given jsonb)
returns boolean language plpgsql immutable set search_path = public as $$
declare
  v   numeric;
  a   numeric;
  tol numeric;
begin
  if p_given is null or jsonb_typeof(p_given) = 'null' then return false; end if;
  if p_check ->> 'kind' = 'number' then
    if jsonb_typeof(p_given) <> 'number' then return false; end if;
    v := (p_given #>> '{}')::numeric;
    a := (p_check ->> 'answer')::numeric;
    tol := (p_check ->> 'tol')::numeric;
    return abs(v - a) <= tol
        -- "0.185" typed for an answer of 18.5%
        or (coalesce((p_check ->> 'percent')::boolean, false) and abs(v) <= 1 and abs(a) > 1 and abs(v * 100 - a) <= tol);
  end if;
  return jsonb_typeof(p_given) = 'string' and (p_check -> 'accept') ? (p_given #>> '{}');
end;
$$;

-- Saves (or updates) the learner's submission, grades it, and issues the project badge when every
-- answer is right. Returns which answers were right, never the answers themselves.
create or replace function public.submit_practice_project(p_project_id text, p_work_url text, p_summary text, p_answers jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_user    uuid := auth.uid();
  v_project public.practice_projects;
  v_check   jsonb;
  v_results jsonb := '{}';
  v_correct int := 0;
  v_total   int := 0;
  v_ok      boolean;
  v_url     text := trim(coalesce(p_work_url, ''));
  v_summary text := trim(coalesce(p_summary, ''));
  v_sub     public.practice_submissions;
  v_cred    public.credentials;
begin
  if v_user is null then raise exception 'Please sign in first.'; end if;
  select * into v_project from public.practice_projects where id = p_project_id and published;
  if not found then raise exception 'Project not found.'; end if;
  if v_url !~* '^https?://[^[:space:]/]+\.[^[:space:]]+$' or length(v_url) > 500 then
    raise exception 'Add a link to your work that starts with https://';
  end if;
  if char_length(v_summary) < 50 then raise exception 'Write a few sentences (at least 50 characters) about what you found.'; end if;
  if char_length(v_summary) > 3000 then raise exception 'Keep your summary under 3,000 characters.'; end if;

  for v_check in select * from jsonb_array_elements(v_project.checks) loop
    v_total := v_total + 1;
    v_ok := public.grade_practice_check(v_check, coalesce(p_answers, '{}') -> (v_check ->> 'id'));
    if v_ok then v_correct := v_correct + 1; end if;
    v_results := v_results || jsonb_build_object(v_check ->> 'id', v_ok);
  end loop;

  insert into public.practice_submissions as s (user_id, project_id, work_url, summary, answers, correct, total, passed)
  values (v_user, v_project.id, v_url, v_summary, coalesce(p_answers, '{}'), v_correct, v_total, v_total > 0 and v_correct = v_total)
  on conflict (user_id, project_id) do update set
    work_url = excluded.work_url,
    summary = excluded.summary,
    answers = excluded.answers,
    correct = excluded.correct,
    total = excluded.total,
    passed = s.passed or excluded.passed,
    attempts = s.attempts + 1,
    updated_at = now(),
    -- A review applies to the work that was reviewed: a new link needs a new review.
    reviewed_at = case when s.work_url = excluded.work_url then s.reviewed_at end,
    reviewed_by = case when s.work_url = excluded.work_url then s.reviewed_by end,
    review_note = case when s.work_url = excluded.work_url then s.review_note end
  returning * into v_sub;

  if v_sub.passed then
    select * into v_cred from public.credentials
    where user_id = v_user and kind = 'project_badge' and project_id = v_project.id and status = 'valid';
    if not found then
      insert into public.credentials (credential_id, user_id, kind, course_id, project_id, badge_name, course_title, recipient_name, skills)
      values (public.new_credential_id(v_project.badge_code), v_user, 'project_badge', null, v_project.id,
              v_project.badge_name, v_project.title, public.recipient_name(v_user), v_project.skills)
      returning * into v_cred;
    end if;
  end if;

  return jsonb_build_object(
    'passed', v_sub.passed,
    'correct', v_correct,
    'total', v_total,
    'results', v_results,
    'credentialId', v_cred.credential_id
  );
end;
$$;

create or replace function public.admin_review_practice_submission(p_id uuid, p_reviewed boolean, p_note text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  update public.practice_submissions
     set reviewed_at = case when p_reviewed then now() end,
         reviewed_by = case when p_reviewed then auth.uid() end,
         review_note = nullif(trim(coalesce(p_note, '')), '')
   where id = p_id;
  if not found then raise exception 'Submission not found.'; end if;
end;
$$;

/* ============================================================ public pages */

-- The credential page also shows, for a project badge, the learner's work and whether it was reviewed.
drop function if exists public.verify_credential(text);
create function public.verify_credential(p_credential_id text)
returns table (credential_id text, kind text, badge_name text, course_id text, course_title text, module_title text,
               recipient_name text, skills text[], issued_at timestamptz, status text,
               project_id text, work_url text, reviewed boolean)
language sql stable security definer set search_path = public as $$
  select c.credential_id, c.kind, c.badge_name, c.course_id, c.course_title, c.module_title, c.recipient_name, c.skills, c.issued_at, c.status,
         c.project_id, s.work_url, s.reviewed_at is not null
  from public.credentials c
  left join public.practice_submissions s on c.kind = 'project_badge' and s.user_id = c.user_id and s.project_id = c.project_id
  where c.credential_id = upper(trim(p_credential_id));
$$;

create or replace function public.public_profile(p_slug text)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'slug', p.public_slug,
    'name', trim(p.full_name),
    'headline', p.headline,
    'memberSince', p.created_at,
    'credentials', coalesce((
      select jsonb_agg(jsonb_build_object(
        'credentialId', c.credential_id, 'kind', c.kind, 'badgeName', c.badge_name, 'courseId', c.course_id,
        'courseTitle', c.course_title, 'moduleTitle', c.module_title, 'recipientName', c.recipient_name,
        'skills', to_jsonb(c.skills), 'issuedAt', c.issued_at, 'status', c.status,
        'projectId', c.project_id, 'workUrl', s.work_url, 'reviewed', s.reviewed_at is not null
      ) order by c.issued_at desc)
      from public.credentials c
      left join public.practice_submissions s on c.kind = 'project_badge' and s.user_id = c.user_id and s.project_id = c.project_id
      where c.user_id = p.id and c.status = 'valid'), '[]'::jsonb),
    'certificates', coalesce((
      select jsonb_agg(jsonb_build_object(
        'certificateId', x.certificate_id, 'credentialId', x.credential_id, 'recipientName', x.recipient_name,
        'courseTitle', x.course_title, 'issuedAt', x.issued_at, 'status', x.status
      ) order by x.issued_at desc)
      from public.certificates x where x.user_id = p.id and x.status = 'valid'), '[]'::jsonb)
  )
  from public.profiles p
  where p.public_slug = lower(trim(p_slug)) and p.profile_public;
$$;

revoke execute on function public.grade_practice_check(jsonb, jsonb) from public, anon, authenticated;
revoke execute on function public.submit_practice_project(text, text, text, jsonb) from public, anon;
revoke execute on function public.admin_review_practice_submission(uuid, boolean, text) from public, anon;
grant execute on function public.submit_practice_project(text, text, text, jsonb) to authenticated;
grant execute on function public.admin_review_practice_submission(uuid, boolean, text) to authenticated;
grant execute on function public.verify_credential(text) to anon, authenticated;
grant execute on function public.public_profile(text) to anon, authenticated;
