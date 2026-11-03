-- Section-level (lesson) videos.
--
-- Each lesson can have one instructional video, shown above its written lesson. It is separate from the course
-- overview video (course_videos) and uses the same private storage bucket. Admins manage it; a learner sees it only
-- while it is published AND they may read the lesson: free courses are open to everyone, paid courses only to enrolled
-- learners and admins (public.has_course_access, the same rule that protects the lesson text). Drafts and unpublished
-- videos are never readable by anyone but admins, in the table or in storage.

create table public.lesson_videos (
  lesson_id        text primary key references public.lessons (id) on delete cascade,
  course_id        text not null references public.courses (id) on delete cascade,
  title            text not null check (char_length(title) between 3 and 140),
  description      text not null default '' check (char_length(description) <= 2000),
  source           text not null check (source in ('upload', 'url')),
  video_url        text check (video_url is null or video_url ~ '^https://[^\s]+$'),
  storage_path     text check (storage_path is null or storage_path ~ '^[A-Za-z0-9._-]+/[A-Za-z0-9._-]+$'),
  thumbnail_path   text check (thumbnail_path is null or thumbnail_path ~ '^[A-Za-z0-9._-]+/[A-Za-z0-9._-]+$'),
  mime_type        text,
  size_bytes       bigint check (size_bytes is null or size_bytes > 0),
  duration_seconds int check (duration_seconds is null or duration_seconds > 0),
  status           text not null default 'draft' check (status in ('draft', 'published', 'unpublished')),
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  updated_by       uuid references auth.users (id) on delete set null,
  constraint lesson_video_has_media check (status <> 'published' or (source = 'url' and video_url is not null) or (source = 'upload' and storage_path is not null))
);
create index lesson_videos_course_idx on public.lesson_videos (course_id);

-- The course a video is filed under must be the lesson's own course.
create or replace function public.lesson_video_check()
returns trigger language plpgsql as $$
begin
  if not exists (select 1 from public.lessons l where l.id = new.lesson_id and l.course_id = new.course_id) then
    raise exception 'The lesson does not belong to that course.';
  end if;
  new.updated_at := now();
  if new.status = 'published' and (tg_op = 'INSERT' or old.status is distinct from 'published') then
    new.published_at := now();
  end if;
  return new;
end;
$$;
create trigger lesson_video_check before insert or update on public.lesson_videos for each row execute function public.lesson_video_check();

alter table public.lesson_videos enable row level security;
create policy "admins manage lesson videos" on public.lesson_videos for all using (public.is_admin()) with check (public.is_admin());
create policy "read published lesson videos" on public.lesson_videos for select to anon, authenticated
  using (
    status = 'published'
    and exists (select 1 from public.lessons l join public.courses c on c.id = l.course_id where l.id = lesson_id and l.published and c.published)
    and public.has_course_access(course_id)
  );

-- Storage: the files of a published lesson video are readable under the same rule, next to the course overview videos.
drop policy "read published course video files" on storage.objects;
create policy "read published course video files" on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'course-videos'
    and (
      public.is_admin()
      or exists (
        select 1 from public.course_videos v join public.courses c on c.id = v.course_id
        where v.status = 'published' and c.published and (v.storage_path = name or v.thumbnail_path = name)
      )
      or exists (
        select 1 from public.lesson_videos v
        join public.lessons l on l.id = v.lesson_id
        join public.courses c on c.id = v.course_id
        where v.status = 'published' and l.published and c.published and public.has_course_access(v.course_id)
          and (v.storage_path = name or v.thumbnail_path = name)
      )
    )
  );
