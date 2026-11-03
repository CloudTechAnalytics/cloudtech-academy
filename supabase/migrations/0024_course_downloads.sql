-- Course downloads: an admin can let enrolled learners download a course as a PDF. Off by default.
-- seed.sql doesn't set this column, so re-seeding keeps each course's setting.

alter table public.courses add column if not exists downloads_enabled boolean not null default false;
