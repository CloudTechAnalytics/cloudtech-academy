-- Keep a registration-required event's meeting link for the people who registered.
--
-- The public list used to include every event's meeting_url. For an event that needs registration that
-- would let anyone skip registering, so it now returns the link only for events open to everyone. People
-- who registered get it from reveal_event_link(): signed in, by their account; or straight after
-- registering, by the email they used. (The link to a free session isn't a secret worth guarding
-- further, but it shouldn't sit on the public page.)

create or replace function public.list_public_events()
returns table (id uuid, slug text, title text, event_type text, short_description text, description text, learn_points text[],
               cover_image text, start_datetime timestamptz, end_datetime timestamptz, timezone text, venue text, format text,
               meeting_url text, registration_url text, whatsapp_url text, speaker_name text, speaker_title text, speaker_image text,
               max_participants int, registration_required boolean, status text, is_featured boolean, series text,
               created_at timestamptz, updated_at timestamptz, registered_count bigint)
language sql stable security definer set search_path = public as $$
  select e.id, e.slug, e.title, e.event_type, e.short_description, e.description, e.learn_points, e.cover_image,
         e.start_datetime, e.end_datetime, e.timezone, e.venue, e.format,
         case when e.registration_required then null else e.meeting_url end,
         e.registration_url, e.whatsapp_url,
         e.speaker_name, e.speaker_title, e.speaker_image, e.max_participants, e.registration_required, e.status,
         e.is_featured, e.series, e.created_at, e.updated_at,
         (select count(*) from public.academy_event_registrations r where r.event_id = e.id and r.registration_status = 'registered')
  from public.academy_events e
  where e.status <> 'draft'
  order by e.start_datetime;
$$;

create or replace function public.reveal_event_link(p_event_id uuid, p_email text default null)
returns text
language sql stable security definer set search_path = public as $$
  select e.meeting_url
  from public.academy_events e
  where e.id = p_event_id and e.status not in ('draft', 'cancelled')
    and (
      not e.registration_required
      or exists (
        select 1 from public.academy_event_registrations r
        where r.event_id = e.id and r.registration_status = 'registered'
          and ((auth.uid() is not null and r.user_id = auth.uid())
               or (p_email is not null and lower(r.email) = lower(trim(p_email))))
      )
    );
$$;

revoke execute on function public.reveal_event_link(uuid, text) from public;
grant execute on function public.reveal_event_link(uuid, text) to anon, authenticated;

notify pgrst, 'reload schema';
