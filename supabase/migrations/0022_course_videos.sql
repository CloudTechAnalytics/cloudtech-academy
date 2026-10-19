-- Course overview videos.
--
-- Each course can have one overview video, shown on its public course page. The video is either a file uploaded to private
-- storage or a link (YouTube, Vimeo or a direct .mp4/.webm/.mov address). Admins manage it; learners and visitors see it
-- only while its status is "published" and the course itself is published. Drafts and unpublished videos are never
-- readable by anyone but admins, in the table or in storage.

-- The largest file an admin may upload, in megabytes. Admins can change it; the bucket below sets the hard ceiling.
alter table public.site_settings add column if not exists course_video_max_mb int not null default 100 check (course_video_max_mb between 1 and 500);

create table public.course_videos (
  course_id      text primary key references public.courses (id) on delete cascade,
  title          text not null check (char_length(title) between 3 and 140),
  description    text not null default '' check (char_length(description) <= 2000),
  source         text not null check (source in ('upload', 'url')),
  video_url      text check (video_url is null or video_url ~ '^https://[^\s]+$'),
  storage_path   text check (storage_path is null or storage_path ~ '^[A-Za-z0-9._-]+/[A-Za-z0-9._-]+$'),
  thumbnail_path text check (thumbnail_path is null or thumbnail_path ~ '^[A-Za-z0-9._-]+/[A-Za-z0-9._-]+$'),
  mime_type      text,
  size_bytes     bigint check (size_bytes is null or size_bytes > 0),
  status         text not null default 'draft' check (status in ('draft', 'published', 'unpublished')),
  published_at   timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  updated_by     uuid references auth.users (id) on delete set null,
  -- A video needs something to play: a link for a link, a stored file for an upload. Drafts may be incomplete.
  constraint course_video_has_media check (status <> 'published' or (source = 'url' and video_url is not null) or (source = 'upload' and storage_path is not null))
);

create or replace function public.touch_course_video()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  if new.status = 'published' and (tg_op = 'INSERT' or old.status is distinct from 'published') then
    new.published_at := now();
  end if;
  return new;
end;
$$;
create trigger course_video_touch before insert or update on public.course_videos for each row execute function public.touch_course_video();

alter table public.course_videos enable row level security;
create policy "admins manage course videos" on public.course_videos for all using (public.is_admin()) with check (public.is_admin());
create policy "read published course videos" on public.course_videos for select to anon, authenticated
  using (status = 'published' and exists (select 1 from public.courses c where c.id = course_id and c.published));

-- Private storage. Files are served only through short-lived signed links, and storage's own row-level security decides
-- who may ask for one: an admin for any file, anyone for the files of a published video.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('course-videos', 'course-videos', false, 524288000, array['video/mp4', 'video/webm', 'video/quicktime', 'image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "admin upload course videos" on storage.objects for insert to authenticated with check (bucket_id = 'course-videos' and public.is_admin());
create policy "admin update course videos" on storage.objects for update to authenticated using (bucket_id = 'course-videos' and public.is_admin());
create policy "admin delete course videos" on storage.objects for delete to authenticated using (bucket_id = 'course-videos' and public.is_admin());
create policy "read published course video files" on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'course-videos'
    and (
      public.is_admin()
      or exists (
        select 1 from public.course_videos v join public.courses c on c.id = v.course_id
        where v.status = 'published' and c.published and (v.storage_path = name or v.thumbnail_path = name)
      )
    )
  );
