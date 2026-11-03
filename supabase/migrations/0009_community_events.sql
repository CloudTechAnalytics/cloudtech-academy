-- Community & Events.
--
-- * The community itself lives on WhatsApp. academy_community_settings holds one row: the invite link and
--   the wording around it, controlled by admins. Nothing in the app hardcodes the link. While the community
--   is inactive, get_community() returns nothing, so the link isn't exposed.
-- * Events are a separate, flexible system: any admin can create events of any type, at any time.
-- * Registrations are only written through register_for_event(), which checks the event is open, not full
--   and not over. Visitors don't need an Academy account; if they're signed in, the registration is linked.
-- * Tables are read directly only by admins (and learners for their own registrations). Everyone else
--   goes through narrow functions, so internal columns such as created_by are never exposed.
--
-- Built to extend later without reshaping these tables: events.series groups recurring events and
-- events.metadata holds anything new (tickets, prices, recordings); registrations.metadata likewise;
-- academy_event_notifications records what should be sent to whom, so email or WhatsApp delivery can be
-- added later without touching the events system.

/* ============================================================ community */

create table public.academy_community_settings (
  id                  int primary key default 1 check (id = 1),
  name                text not null default 'CloudTech Academy Community',
  description         text not null default 'Connect with other learners, share your progress, ask questions, discover opportunities and participate in Academy activities.',
  whatsapp_invite_url text check (whatsapp_invite_url is null or whatsapp_invite_url ~* '^https://(chat\.whatsapp\.com|wa\.me|whatsapp\.com|www\.whatsapp\.com)/\S+$'),
  welcome_message     text not null default 'Connect with other learners, ask questions, share what you''re building and hear about Academy sessions and opportunities.',
  button_text         text not null default 'Join Community',
  is_active           boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  -- A community can only be switched on once it has somewhere to send people.
  constraint community_needs_link check (not is_active or whatsapp_invite_url is not null)
);
insert into public.academy_community_settings (id) values (1);
create trigger community_touch before update on public.academy_community_settings for each row execute function public.touch_updated_at();

create table public.community_clicks (
  id         bigint generated always as identity primary key,
  source     text not null,
  user_id    uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index community_clicks_idx on public.community_clicks (created_at desc);

alter table public.academy_community_settings enable row level security;
alter table public.community_clicks enable row level security;
revoke all on public.academy_community_settings, public.community_clicks from anon;
create policy "admin community settings" on public.academy_community_settings for all using (public.is_admin()) with check (public.is_admin());
create policy "admin read community clicks" on public.community_clicks for select using (public.is_admin());

-- What visitors and learners see. Returns nothing while the community is switched off.
create or replace function public.get_community()
returns table (name text, description text, whatsapp_invite_url text, welcome_message text, button_text text)
language sql stable security definer set search_path = public as $$
  select s.name, s.description, s.whatsapp_invite_url, s.welcome_message, s.button_text
  from public.academy_community_settings s
  where s.id = 1 and s.is_active and s.whatsapp_invite_url is not null;
$$;

-- A lightweight count of how often a Community button is used, and where. Anyone can record a click.
create or replace function public.track_community_click(p_source text)
returns void
language plpgsql security definer set search_path = public as $$
declare v_source text := lower(trim(coalesce(p_source, '')));
begin
  if v_source not in ('homepage', 'welcome', 'dashboard', 'community_page', 'navbar', 'events', 'event_page', 'sign_up') then v_source := 'other'; end if;
  if not exists (select 1 from public.academy_community_settings where id = 1 and is_active) then return; end if;
  insert into public.community_clicks (source, user_id) values (v_source, auth.uid());
end;
$$;

/* ============================================================ events */

create table public.academy_events (
  id                    uuid primary key default gen_random_uuid(),
  title                 text not null check (length(trim(title)) between 3 and 150),
  slug                  text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 100),
  event_type            text not null default 'workshop' check (event_type in (
    'workshop', 'webinar', 'seminar', 'community_day', 'practical_session', 'bootcamp', 'masterclass',
    'career_session', 'guest_session', 'networking', 'competition', 'conference', 'training', 'other')),
  short_description     text check (length(short_description) <= 300),
  description           text check (length(description) <= 8000),
  learn_points          text[] not null default '{}',
  cover_image           text,
  start_datetime        timestamptz not null,
  end_datetime          timestamptz,
  timezone              text not null default 'Africa/Lagos',
  venue                 text check (length(venue) <= 300),
  format                text not null default 'online' check (format in ('online', 'physical', 'hybrid')),
  meeting_url           text check (meeting_url is null or meeting_url ~* '^https?://\S+$'),
  registration_url      text check (registration_url is null or registration_url ~* '^https?://\S+$'),
  whatsapp_url          text check (whatsapp_url is null or whatsapp_url ~* '^https://(chat\.whatsapp\.com|wa\.me|whatsapp\.com|www\.whatsapp\.com)/\S+$'),
  speaker_name          text check (length(speaker_name) <= 120),
  speaker_title         text check (length(speaker_title) <= 160),
  speaker_image         text,
  max_participants      int check (max_participants is null or max_participants > 0),
  registration_required boolean not null default false,
  status                text not null default 'draft' check (status in ('draft', 'published', 'registration_open', 'registration_closed', 'completed', 'cancelled')),
  is_featured           boolean not null default false,
  series                text,
  metadata              jsonb not null default '{}'::jsonb,
  created_by            uuid default auth.uid() references auth.users (id) on delete set null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  constraint event_ends_after_start check (end_datetime is null or end_datetime > start_datetime)
);
create index academy_events_start_idx on public.academy_events (start_datetime);
create index academy_events_status_idx on public.academy_events (status);
create trigger academy_events_touch before update on public.academy_events for each row execute function public.touch_updated_at();

create table public.academy_event_registrations (
  id                  uuid primary key default gen_random_uuid(),
  event_id            uuid not null references public.academy_events (id) on delete cascade,
  user_id             uuid references auth.users (id) on delete set null,
  full_name           text not null check (length(trim(full_name)) between 2 and 120),
  email               text not null check (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' and length(email) <= 200),
  phone               text check (phone is null or phone ~ '^[0-9+()\-\s]{7,20}$'),
  registration_status text not null default 'registered' check (registration_status in ('registered', 'cancelled')),
  attendance_status   text not null default 'registered' check (attendance_status in ('registered', 'attended', 'did_not_attend')),
  registered_at       timestamptz not null default now(),
  attended_at         timestamptz,
  metadata            jsonb not null default '{}'::jsonb
);
create unique index event_registrations_one_per_email on public.academy_event_registrations (event_id, lower(email));
create index event_registrations_user_idx on public.academy_event_registrations (user_id);

-- What should be sent to whom, and what was. Nothing sends yet; this is the foundation for email or
-- WhatsApp delivery later. In-app reminders are worked out from the events themselves.
create table public.academy_event_notifications (
  id              bigint generated always as identity primary key,
  event_id        uuid not null references public.academy_events (id) on delete cascade,
  registration_id uuid references public.academy_event_registrations (id) on delete cascade,
  user_id         uuid references auth.users (id) on delete set null,
  kind            text not null check (kind in ('registration_confirmation', 'reminder', 'starting_soon', 'event_update', 'event_cancelled')),
  channel         text not null default 'in_app' check (channel in ('in_app', 'email', 'whatsapp')),
  status          text not null default 'pending' check (status in ('pending', 'sent', 'failed', 'skipped')),
  scheduled_for   timestamptz not null default now(),
  sent_at         timestamptz
);
create index event_notifications_idx on public.academy_event_notifications (status, scheduled_for);

alter table public.academy_events enable row level security;
alter table public.academy_event_registrations enable row level security;
alter table public.academy_event_notifications enable row level security;
revoke all on public.academy_events, public.academy_event_registrations, public.academy_event_notifications from anon;
create policy "admin events" on public.academy_events for all using (public.is_admin()) with check (public.is_admin());
create policy "read own registrations" on public.academy_event_registrations for select using (user_id = auth.uid() or public.is_admin());
create policy "admin update registrations" on public.academy_event_registrations for update using (public.is_admin()) with check (public.is_admin());
create policy "admin delete registrations" on public.academy_event_registrations for delete using (public.is_admin());
create policy "admin read notifications" on public.academy_event_notifications for select using (public.is_admin());

/* ---------- public reads: every event that isn't a draft, with how many have registered ---------- */

create or replace function public.list_public_events()
returns table (id uuid, slug text, title text, event_type text, short_description text, description text, learn_points text[],
               cover_image text, start_datetime timestamptz, end_datetime timestamptz, timezone text, venue text, format text,
               meeting_url text, registration_url text, whatsapp_url text, speaker_name text, speaker_title text, speaker_image text,
               max_participants int, registration_required boolean, status text, is_featured boolean, series text,
               created_at timestamptz, updated_at timestamptz, registered_count bigint)
language sql stable security definer set search_path = public as $$
  select e.id, e.slug, e.title, e.event_type, e.short_description, e.description, e.learn_points, e.cover_image,
         e.start_datetime, e.end_datetime, e.timezone, e.venue, e.format, e.meeting_url, e.registration_url, e.whatsapp_url,
         e.speaker_name, e.speaker_title, e.speaker_image, e.max_participants, e.registration_required, e.status,
         e.is_featured, e.series, e.created_at, e.updated_at,
         (select count(*) from public.academy_event_registrations r where r.event_id = e.id and r.registration_status = 'registered')
  from public.academy_events e
  where e.status <> 'draft'
  order by e.start_datetime;
$$;

/* ---------- registration ---------- */

create or replace function public.register_for_event(p_event_id uuid, p_full_name text, p_email text, p_phone text)
returns public.academy_event_registrations
language plpgsql security definer set search_path = public as $$
declare
  v_event public.academy_events;
  v_name  text := trim(coalesce(p_full_name, ''));
  v_email text := lower(trim(coalesce(p_email, '')));
  v_phone text := nullif(trim(coalesce(p_phone, '')), '');
  v_count bigint;
  v_reg   public.academy_event_registrations;
  v_known boolean;
begin
  select * into v_event from public.academy_events where id = p_event_id and status <> 'draft';
  if not found then raise exception 'Event not found.'; end if;
  if v_name is null or length(v_name) < 2 then raise exception 'Enter your full name.'; end if;
  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'Enter a valid email address.'; end if;
  if v_phone is not null and v_phone !~ '^[0-9+()\-\s]{7,20}$' then raise exception 'Enter a valid phone number.'; end if;
  if not v_event.registration_required then raise exception 'This event doesn''t need registration.'; end if;
  if v_event.status = 'cancelled' then raise exception 'This event was cancelled.'; end if;
  if v_event.status = 'completed' or coalesce(v_event.end_datetime, v_event.start_datetime + interval '3 hours') < now() then raise exception 'This event has ended.'; end if;
  if v_event.status = 'registration_closed' then raise exception 'Registration for this event has closed.'; end if;

  select * into v_reg from public.academy_event_registrations where event_id = p_event_id and lower(email) = v_email for update;
  v_known := found;   -- FOUND is overwritten by the next query, so keep this answer
  if v_known and v_reg.registration_status = 'registered' then return v_reg; end if;   -- already registered: same result

  select count(*) into v_count from public.academy_event_registrations where event_id = p_event_id and registration_status = 'registered';
  if v_event.max_participants is not null and v_count >= v_event.max_participants then raise exception 'This event is full.'; end if;

  if v_known then
    update public.academy_event_registrations
    set registration_status = 'registered', attendance_status = 'registered', full_name = v_name, phone = v_phone,
        user_id = coalesce(auth.uid(), user_id), registered_at = now(), attended_at = null
    where id = v_reg.id returning * into v_reg;
  else
    insert into public.academy_event_registrations (event_id, user_id, full_name, email, phone)
    values (p_event_id, auth.uid(), v_name, v_email, v_phone) returning * into v_reg;
  end if;
  insert into public.academy_event_notifications (event_id, registration_id, user_id, kind, channel, status, sent_at)
  values (p_event_id, v_reg.id, auth.uid(), 'registration_confirmation', 'in_app', 'sent', now());
  return v_reg;
end;
$$;

create or replace function public.cancel_my_registration(p_event_id uuid)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Please sign in first.'; end if;
  update public.academy_event_registrations set registration_status = 'cancelled'
  where event_id = p_event_id and user_id = auth.uid() and registration_status = 'registered';
end;
$$;

create or replace function public.admin_set_attendance(p_registration_id uuid, p_status text)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  if p_status not in ('registered', 'attended', 'did_not_attend') then raise exception 'Choose an attendance status.'; end if;
  update public.academy_event_registrations
  set attendance_status = p_status, attended_at = case when p_status = 'attended' then now() else null end
  where id = p_registration_id;
  if not found then raise exception 'Registration not found.'; end if;
end;
$$;

-- Lightweight numbers for the admin Community page.
create or replace function public.admin_community_stats()
returns table (clicks_total bigint, clicks_30d bigint, upcoming_events bigint, registrations_total bigint, registrations_upcoming bigint)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  return query select
    (select count(*) from public.community_clicks),
    (select count(*) from public.community_clicks where created_at > now() - interval '30 days'),
    (select count(*) from public.academy_events where status in ('published', 'registration_open', 'registration_closed') and coalesce(end_datetime, start_datetime + interval '3 hours') >= now()),
    (select count(*) from public.academy_event_registrations where registration_status = 'registered'),
    (select count(*) from public.academy_event_registrations r join public.academy_events e on e.id = r.event_id
       where r.registration_status = 'registered' and coalesce(e.end_datetime, e.start_datetime + interval '3 hours') >= now());
end;
$$;

create or replace function public.admin_community_click_sources()
returns table (source text, clicks bigint)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  return query select c.source, count(*) from public.community_clicks c where c.created_at > now() - interval '30 days' group by c.source order by count(*) desc;
end;
$$;

/* ============================================================ event images */

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('event-images', 'event-images', true, 2097152, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;
-- The bucket is public, so images load for everyone; only admins can add, replace or remove them.
create policy "admin upload event images" on storage.objects for insert to authenticated with check (bucket_id = 'event-images' and public.is_admin());
create policy "admin update event images" on storage.objects for update to authenticated using (bucket_id = 'event-images' and public.is_admin());
create policy "admin delete event images" on storage.objects for delete to authenticated using (bucket_id = 'event-images' and public.is_admin());

/* ============================================================ permissions */

revoke execute on function public.get_community() from public;
revoke execute on function public.track_community_click(text) from public;
revoke execute on function public.list_public_events() from public;
revoke execute on function public.register_for_event(uuid, text, text, text) from public;
revoke execute on function public.cancel_my_registration(uuid) from public, anon;
revoke execute on function public.admin_set_attendance(uuid, text) from public, anon;
revoke execute on function public.admin_community_stats() from public, anon;
revoke execute on function public.admin_community_click_sources() from public, anon;
grant execute on function public.get_community() to anon, authenticated;
grant execute on function public.track_community_click(text) to anon, authenticated;
grant execute on function public.list_public_events() to anon, authenticated;
grant execute on function public.register_for_event(uuid, text, text, text) to anon, authenticated;
grant execute on function public.cancel_my_registration(uuid) to authenticated;
grant execute on function public.admin_set_attendance(uuid, text) to authenticated;
grant execute on function public.admin_community_stats() to authenticated;
grant execute on function public.admin_community_click_sources() to authenticated;

notify pgrst, 'reload schema';
