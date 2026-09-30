-- Public skills profiles: a learner can switch on a public page at /learners/<slug>
-- that lists their valid badges and certificates. Off by default; email is never shown.

alter table public.profiles
  add column if not exists public_slug    text,
  add column if not exists profile_public boolean not null default false,
  add column if not exists headline       text not null default '';

alter table public.profiles drop constraint if exists profiles_public_slug_format;
alter table public.profiles add constraint profiles_public_slug_format
  check (public_slug is null or public_slug ~ '^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$');
alter table public.profiles drop constraint if exists profiles_headline_length;
alter table public.profiles add constraint profiles_headline_length check (char_length(headline) <= 120);

create unique index if not exists profiles_public_slug_key on public.profiles (public_slug) where public_slug is not null;

-- Learners change these settings only through this function, so the checks and messages live in one place.
create or replace function public.set_public_profile(p_public boolean, p_slug text, p_headline text)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_slug text := nullif(lower(trim(coalesce(p_slug, ''))), '');
begin
  if auth.uid() is null then raise exception 'Sign in first.'; end if;
  if v_slug is not null and v_slug !~ '^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$' then
    raise exception 'Your profile address needs 3 to 40 lowercase letters, numbers or hyphens, starting and ending with a letter or number.';
  end if;
  if coalesce(p_public, false) and v_slug is null then
    raise exception 'Choose a profile address first.';
  end if;
  if coalesce(p_public, false) and coalesce((select trim(full_name) from public.profiles where id = auth.uid()), '') = '' then
    raise exception 'Add your full name first. It appears on your public profile.';
  end if;
  if v_slug is not null and exists (select 1 from public.profiles where public_slug = v_slug and id <> auth.uid()) then
    raise exception 'That profile address is taken. Try another.';
  end if;
  update public.profiles
     set profile_public = coalesce(p_public, false),
         public_slug = v_slug,
         headline = left(trim(coalesce(p_headline, '')), 120)
   where id = auth.uid();
end;
$$;

-- The public page. Returns null unless the learner has switched their profile on.
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

revoke execute on function public.set_public_profile(boolean, text, text) from public, anon;
grant execute on function public.set_public_profile(boolean, text, text) to authenticated;
grant execute on function public.public_profile(text) to anon, authenticated;
