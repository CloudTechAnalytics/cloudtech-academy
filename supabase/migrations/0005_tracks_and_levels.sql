-- Career tracks and course levels.
--   * Every course has a level: 1 Foundations, 2 Practical Skills, 3 Professional, 4 Career Projects.
--   * A track is an ordered route through courses. Completing every required course earns the
--     track badge, a credential of kind 'track_completion' issued by issue_track_credential().
--   * Projects get a rubric: the criteria reviewers assess a submission against.

alter table public.courses add column if not exists level int not null default 1 check (level between 1 and 4);
alter table public.projects add column if not exists rubric text[] not null default '{}';

create table if not exists public.tracks (
  id         text primary key check (id ~ '^[a-z0-9-]+$'),
  slug       text not null unique,
  title      text not null,
  summary    text not null default '',
  badge_name text not null,
  badge_code text not null,
  skills     text[] not null default '{}',
  position   int not null default 0,
  published  boolean not null default true
);

create table if not exists public.track_courses (
  track_id  text not null references public.tracks (id) on delete cascade,
  course_id text not null references public.courses (id) on delete cascade,
  stage     text not null default '',
  required  boolean not null default true,
  position  int not null default 0,
  primary key (track_id, course_id)
);

alter table public.tracks enable row level security;
alter table public.track_courses enable row level security;
drop policy if exists "tracks are public" on public.tracks;
create policy "tracks are public" on public.tracks for select using (published or public.is_admin());
drop policy if exists "track courses are public" on public.track_courses;
create policy "track courses are public" on public.track_courses for select using (true);
drop policy if exists "admins manage tracks" on public.tracks;
create policy "admins manage tracks" on public.tracks for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admins manage track courses" on public.track_courses;
create policy "admins manage track courses" on public.track_courses for all using (public.is_admin()) with check (public.is_admin());

-- Track credentials belong to a track, not a course.
alter table public.credentials add column if not exists track_id text references public.tracks (id);
alter table public.credentials alter column course_id drop not null;
alter table public.credentials drop constraint if exists credentials_kind_check;
alter table public.credentials add constraint credentials_kind_check check (kind in ('module_badge', 'course_completion', 'track_completion'));
alter table public.credentials drop constraint if exists credentials_owner_check;
alter table public.credentials add constraint credentials_owner_check
  check ((kind = 'track_completion' and track_id is not null and course_id is null) or (kind <> 'track_completion' and course_id is not null));
drop index if exists public.credentials_one_valid;
create unique index credentials_one_valid on public.credentials
  (user_id, coalesce(course_id, ''), coalesce(track_id, ''), kind, coalesce(module_id, '')) where status = 'valid';

-- Issues (or returns) the track badge once every required course in the track is complete.
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

  insert into public.credentials (credential_id, user_id, kind, track_id, badge_name, course_title, recipient_name, skills)
  values (public.new_credential_id(v_track.badge_code), v_user, 'track_completion', v_track.id, v_track.badge_name,
          v_track.title, public.recipient_name(v_user), v_track.skills)
  returning * into v_cred;
  return v_cred;
end;
$$;
revoke execute on function public.issue_track_credential(text) from public, anon;
grant execute on function public.issue_track_credential(text) to authenticated;

-- The public credential page also needs the track, for track badges.
drop function if exists public.verify_credential(text);
create function public.verify_credential(p_credential_id text)
returns table (credential_id text, kind text, badge_name text, course_id text, track_id text, course_title text, module_title text,
               recipient_name text, skills text[], issued_at timestamptz, status text)
language sql stable security definer set search_path = public as $$
  select c.credential_id, c.kind, c.badge_name, c.course_id, c.track_id, c.course_title, c.module_title, c.recipient_name, c.skills, c.issued_at, c.status
  from public.credentials c
  where c.credential_id = upper(trim(p_credential_id));
$$;
grant execute on function public.verify_credential(text) to anon, authenticated;

-- Public skills profiles list track badges too.
create or replace function public.public_profile(p_slug text)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'slug', p.public_slug,
    'name', trim(p.full_name),
    'headline', p.headline,
    'memberSince', p.created_at,
    'credentials', coalesce((
      select jsonb_agg(jsonb_build_object(
        'credentialId', c.credential_id, 'kind', c.kind, 'badgeName', c.badge_name, 'courseId', coalesce(c.course_id, ''),
        'trackId', c.track_id, 'courseTitle', c.course_title, 'moduleTitle', c.module_title, 'recipientName', c.recipient_name,
        'skills', to_jsonb(c.skills), 'issuedAt', c.issued_at, 'status', c.status
      ) order by c.issued_at desc)
      from public.credentials c where c.user_id = p.id and c.status = 'valid'), '[]'::jsonb),
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
grant execute on function public.public_profile(text) to anon, authenticated;
