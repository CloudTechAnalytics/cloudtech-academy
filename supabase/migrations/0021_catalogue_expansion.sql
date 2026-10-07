-- Catalogue expansion: business, trade and professional skills.
--
-- * Courses can show a level range ("Beginner to Intermediate"), a length in weeks for filtering, a thumbnail, FAQs,
--   and an archived state (hidden from the catalogue, still open to people already enrolled).
-- * A promotion gets a label ("Early Bird") and optional start and end dates. The price a learner is charged follows the same
--   rule the site displays: the promotional price counts only while the promotion is on and today is inside its dates.
-- * A module can list the topics it covers, so the curriculum of a course that is still being written can be shown in full.
-- Which courses exist, and their prices, are data the seed writes once and admins edit afterwards.

alter table public.courses
  add column difficulty_max  text check (difficulty_max is null or difficulty_max in ('beginner', 'intermediate', 'advanced')),
  add column duration_weeks  int check (duration_weeks is null or duration_weeks between 1 and 104),
  add column discount_label  text,
  add column discount_start  timestamptz,
  add column discount_end    timestamptz,
  add column thumbnail       text,
  add column faqs            jsonb not null default '[]'::jsonb,
  add column archived        boolean not null default false;

alter table public.course_modules add column topics text[] not null default '{}';

-- The price actually charged: the promotional price only while the promotion is active and today is inside its dates.
create or replace function public.course_charge(p_course public.courses)
returns numeric language sql stable as $$
  select case when p_course.discount_active
                and p_course.discount_price is not null and p_course.discount_price < p_course.price
                and (p_course.discount_start is null or p_course.discount_start <= now())
                and (p_course.discount_end is null or p_course.discount_end >= now())
              then p_course.discount_price else p_course.price end;
$$;
