-- Free and Professional courses.
--
-- * A course has a type (free or professional) and an access (free or paid). A professional course must be paid.
-- * Paid courses have a price, a currency, an optional discount, a delivery type (self-paced, instructor-led or
--   hybrid), an enrolment status and window, and the details their sales page shows.
-- * A learner reaches a paid course's lessons only through an enrolment that a successful payment, or an admin,
--   created. This is enforced here, in the database, not in the browser:
--     - lessons.body_md can no longer be read directly; get_course_bodies() returns it only to people with access;
--     - assessment questions and project briefs follow the same rule;
--     - progress, attempts and submissions are refused without access;
--     - a learner can enrol themselves only in free courses.
-- * Payments reuse the certificate payment functions: course_orders mirrors certificate_orders.
-- * Nothing changes for the courses that exist today: all are free, and everyone enrolled keeps access.

/* ============================================================ course columns */

alter table public.courses
  add column course_type          text not null default 'free' check (course_type in ('free', 'professional')),
  add column access_type          text not null default 'free' check (access_type in ('free', 'paid')),
  add column price                numeric(12, 2) check (price is null or price >= 0),
  add column currency             text not null default 'NGN' check (currency ~ '^[A-Z]{3}$'),
  add column discount_price       numeric(12, 2) check (discount_price is null or discount_price >= 0),
  add column discount_active      boolean not null default false,
  add column payment_status       text not null default 'active' check (payment_status in ('active', 'paused')),
  add column delivery_type        text not null default 'self_paced' check (delivery_type in ('self_paced', 'instructor_led', 'hybrid')),
  add column enrollment_status    text not null default 'open' check (enrollment_status in ('open', 'closed')),
  add column enrollment_start     timestamptz,
  add column enrollment_end       timestamptz,
  add column community_access     boolean not null default false,
  add column instructor_support   boolean not null default false,
  add column duration_label       text,
  add column published_at         timestamptz,
  add column overview             text,
  add column audience             text[] not null default '{}',
  add column outcomes             text[] not null default '{}',
  add column included             text[] not null default '{}',
  add column project_previews     jsonb not null default '[]'::jsonb,
  add column instructor_name      text,
  add column instructor_title     text,
  add column instructor_bio       text,
  add column professional_outcome text;

alter table public.courses add constraint courses_professional_is_paid check (course_type <> 'professional' or access_type = 'paid');
alter table public.courses add constraint courses_paid_has_price check (access_type = 'free' or (price is not null and price > 0));
alter table public.courses add constraint courses_discount_below_price check (discount_price is null or price is null or discount_price < price);

-- Existing code reads is_free; keep it true to access_type.
create or replace function public.courses_sync()
returns trigger language plpgsql as $$
begin
  new.is_free := (new.access_type = 'free');
  if new.published and (tg_op = 'INSERT' or not old.published) and new.published_at is null then
    new.published_at := now();
  end if;
  return new;
end;
$$;
create trigger courses_sync before insert or update on public.courses for each row execute function public.courses_sync();
update public.courses set published_at = coalesce(published_at, created_at) where published;

/* ============================================================ enrolments and orders */

alter table public.enrollments
  add column source   text not null default 'free' check (source in ('free', 'purchase', 'granted')),
  add column order_id uuid;

create table public.course_orders (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  course_id    text not null references public.courses (id),
  currency     text not null,
  -- The price when the order was made, and what was charged after any discount.
  list_amount  numeric(12, 2) not null,
  amount       numeric(12, 2) not null check (amount >= 0),
  status       text not null default 'pending' check (status in ('pending', 'paid', 'granted', 'failed', 'cancelled')),
  provider     text,
  provider_ref text unique,
  note         text,
  created_at   timestamptz not null default now(),
  paid_at      timestamptz
);
create index course_orders_user_idx on public.course_orders (user_id);
create index course_orders_course_idx on public.course_orders (course_id);
create unique index course_orders_one_pending on public.course_orders (user_id, course_id) where status = 'pending';
alter table public.enrollments add constraint enrollments_order_fk foreign key (order_id) references public.course_orders (id) on delete set null;

alter table public.course_orders enable row level security;
create policy "read own course orders" on public.course_orders for select using (user_id = auth.uid() or public.is_admin());
create policy "admin update course orders" on public.course_orders for update using (public.is_admin()) with check (public.is_admin());

/* ============================================================ access */

create or replace function public.has_course_access(p_course text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.courses c where c.id = p_course and c.access_type = 'free')
      or public.is_admin()
      or exists (select 1 from public.enrollments e where e.user_id = auth.uid() and e.course_id = p_course);
$$;
grant execute on function public.has_course_access(text) to anon, authenticated;

-- Lesson text is not readable through the table API any more. The outline (titles, summaries, minutes) still is,
-- so sales pages can show the curriculum.
revoke select on public.lessons from anon, authenticated;
grant select (id, course_id, module_id, slug, title, summary, minutes, required, published, position, required_exercises, updated_at)
  on public.lessons to anon, authenticated;

create or replace function public.get_course_bodies(p_course_id text)
returns table (lesson_id text, body_md text)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.has_course_access(p_course_id) then
    return;
  end if;
  return query
    select l.id, l.body_md
    from public.lessons l
    join public.courses c on c.id = l.course_id
    where l.course_id = p_course_id
      and (public.is_admin() or (l.published and c.published));
end;
$$;
grant execute on function public.get_course_bodies(text) to anon, authenticated;

-- Questions, briefs and progress follow the same rule.
drop policy "signed-in learners read questions" on public.assessment_questions;
create policy "learners with access read questions" on public.assessment_questions for select to authenticated
  using (public.is_admin() or exists (select 1 from public.assessments a where a.id = assessment_id and a.published and public.has_course_access(a.course_id)));

drop policy "read projects" on public.projects;
create policy "read projects" on public.projects for select
  using (public.is_admin() or exists (select 1 from public.courses c where c.id = course_id and c.published and public.has_course_access(c.id)));

drop policy "record own progress" on public.lesson_progress;
create policy "record own progress" on public.lesson_progress for insert to authenticated
  with check (user_id = auth.uid() and public.has_course_access(course_id)
              and exists (select 1 from public.lessons l where l.id = lesson_id and l.course_id = course_id and l.published));

drop policy "record own exercises" on public.exercise_completions;
create policy "record own exercises" on public.exercise_completions for insert to authenticated
  with check (user_id = auth.uid() and public.has_course_access(course_id)
              and exists (select 1 from public.lessons l where l.id = lesson_id and l.course_id = course_id and l.published));

drop policy "enrol self" on public.enrollments;
create policy "enrol self in free courses" on public.enrollments for insert to authenticated
  with check (user_id = auth.uid() and source = 'free'
              and exists (select 1 from public.courses c where c.id = course_id and c.published and c.access_type = 'free'));

-- Attempts and submissions are written by security-definer functions; refuse them without access.
create or replace function public.require_course_access()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_course text;
begin
  if tg_table_name = 'assessment_attempts' then
    select course_id into v_course from public.assessments where id = new.assessment_id;
  else
    select course_id into v_course from public.projects where id = new.project_id;
  end if;
  if v_course is not null and not public.has_course_access(v_course) then
    raise exception 'This course is for enrolled learners. Enrol to continue.';
  end if;
  return new;
end;
$$;
create trigger assessment_attempts_access before insert on public.assessment_attempts for each row execute function public.require_course_access();
create trigger project_submissions_access before insert on public.project_submissions for each row execute function public.require_course_access();

-- Purchased and granted courses stay in My Learning and are never reset for inactivity.
create or replace function public.remove_course(p_course_id text)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
begin
  if v_user is null then raise exception 'Please sign in first.'; end if;
  if exists (select 1 from public.enrollments where user_id = v_user and course_id = p_course_id and source <> 'free') then
    raise exception 'A course you enrolled in with payment stays in My Learning. Contact support if you need it removed.';
  end if;
  if not public.course_completed(v_user, p_course_id) then
    perform public.clear_course_progress(v_user, p_course_id);
  end if;
  delete from public.enrollments where user_id = v_user and course_id = p_course_id;
end;
$$;

create or replace function public.apply_inactivity_resets()
returns setof text language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  r record;
begin
  if v_user is null then return; end if;
  for r in
    select e.course_id from public.enrollments e
     where e.user_id = v_user and e.source = 'free' and e.last_active_at < now() - interval '14 days'
       and not public.course_completed(v_user, e.course_id)
  loop
    if exists (select 1 from public.lesson_progress where user_id = v_user and course_id = r.course_id)
       or exists (select 1 from public.exercise_completions where user_id = v_user and course_id = r.course_id)
       or exists (select 1 from public.assessment_attempts t join public.assessments a on a.id = t.assessment_id
                   where t.user_id = v_user and a.course_id = r.course_id) then
      perform public.clear_course_progress(v_user, r.course_id);
      return next r.course_id;
    else
      update public.enrollments set last_lesson_id = null, last_active_at = now() where user_id = v_user and course_id = r.course_id;
    end if;
  end loop;
end;
$$;

/* ============================================================ buying a course */

create or replace function public.course_charge(p_course public.courses)
returns numeric language sql immutable as $$
  select case when p_course.discount_active and p_course.discount_price is not null and p_course.discount_price < p_course.price
              then p_course.discount_price else p_course.price end;
$$;

-- Starts (or refreshes) the learner's pending order for a paid course, at the price on the course today.
create or replace function public.start_course_order(p_course_id text)
returns public.course_orders
language plpgsql security definer set search_path = public as $$
declare
  v_user   uuid := auth.uid();
  v_course public.courses;
  v_order  public.course_orders;
  v_charge numeric;
begin
  if v_user is null then raise exception 'Please sign in first.'; end if;
  select * into v_course from public.courses where id = p_course_id and published;
  if not found then raise exception 'Course not found.'; end if;
  if v_course.access_type <> 'paid' then raise exception 'This course is free: you can start it without paying.'; end if;
  if v_course.enrollment_status <> 'open' or (v_course.enrollment_start is not null and v_course.enrollment_start > now())
     or (v_course.enrollment_end is not null and v_course.enrollment_end < now()) then
    raise exception 'Enrolment for this course is not open right now.';
  end if;
  if v_course.payment_status <> 'active' then raise exception 'Payments for this course are paused. Please try again soon.'; end if;
  if exists (select 1 from public.enrollments where user_id = v_user and course_id = p_course_id) then
    raise exception 'You are already enrolled in this course.';
  end if;
  v_charge := public.course_charge(v_course);

  select * into v_order from public.course_orders where user_id = v_user and course_id = p_course_id and status = 'pending';
  if found then
    update public.course_orders set currency = v_course.currency, list_amount = v_course.price, amount = v_charge
      where id = v_order.id returning * into v_order;
    return v_order;
  end if;
  insert into public.course_orders (user_id, course_id, currency, list_amount, amount)
  values (v_user, p_course_id, v_course.currency, v_course.price, v_charge)
  returning * into v_order;
  return v_order;
end;
$$;
revoke execute on function public.start_course_order(text) from public, anon;
grant execute on function public.start_course_order(text) to authenticated;

-- Called by the payment functions (service role) once a payment is confirmed. Enrols the learner. Safe to repeat.
create or replace function public.complete_course_order(p_order_id uuid, p_provider text, p_reference text)
returns public.enrollments
language plpgsql security definer set search_path = public as $$
declare
  v_order public.course_orders;
  v_enr   public.enrollments;
begin
  update public.course_orders
     set status = 'paid', provider = p_provider, provider_ref = p_reference, paid_at = coalesce(paid_at, now())
   where id = p_order_id and status in ('pending', 'paid', 'failed', 'cancelled')
  returning * into v_order;
  if not found then raise exception 'Order not found.'; end if;
  insert into public.enrollments (user_id, course_id, source, order_id)
  values (v_order.user_id, v_order.course_id, 'purchase', v_order.id)
  on conflict (user_id, course_id) do update set source = case when public.enrollments.source = 'free' then 'purchase' else public.enrollments.source end,
                                                  order_id = coalesce(public.enrollments.order_id, excluded.order_id)
  returning * into v_enr;
  return v_enr;
end;
$$;
revoke execute on function public.complete_course_order(uuid, text, text) from public, anon, authenticated;
grant execute on function public.complete_course_order(uuid, text, text) to service_role;

-- Admins can give someone access, e.g. after a bank transfer or as a scholarship.
create or replace function public.admin_grant_course_access(p_user uuid, p_course_id text, p_note text)
returns public.enrollments
language plpgsql security definer set search_path = public as $$
declare
  v_course public.courses;
  v_order  uuid;
  v_enr    public.enrollments;
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  select * into v_course from public.courses where id = p_course_id;
  if not found then raise exception 'Course not found.'; end if;
  if not exists (select 1 from auth.users where id = p_user) then raise exception 'Student not found.'; end if;
  select id into v_order from public.course_orders where user_id = p_user and course_id = p_course_id and status = 'pending';
  if v_order is not null then
    update public.course_orders set status = 'granted', note = nullif(trim(coalesce(p_note, '')), ''), paid_at = now() where id = v_order;
  else
    insert into public.course_orders (user_id, course_id, currency, list_amount, amount, status, note, paid_at)
    values (p_user, p_course_id, v_course.currency, coalesce(v_course.price, 0), 0, 'granted', nullif(trim(coalesce(p_note, '')), ''), now())
    returning id into v_order;
  end if;
  insert into public.enrollments (user_id, course_id, source, order_id)
  values (p_user, p_course_id, case when v_course.access_type = 'free' then 'free' else 'granted' end, v_order)
  on conflict (user_id, course_id) do update set source = case when v_course.access_type = 'free' then public.enrollments.source else 'granted' end,
                                                  order_id = coalesce(public.enrollments.order_id, excluded.order_id)
  returning * into v_enr;
  return v_enr;
end;
$$;
revoke execute on function public.admin_grant_course_access(uuid, text, text) from public, anon;
grant execute on function public.admin_grant_course_access(uuid, text, text) to authenticated;

create or replace function public.admin_revoke_course_access(p_user uuid, p_course_id text, p_reason text)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  delete from public.enrollments where user_id = p_user and course_id = p_course_id;
  update public.course_orders set status = 'cancelled', note = coalesce(nullif(trim(coalesce(p_reason, '')), ''), note)
   where user_id = p_user and course_id = p_course_id and status in ('pending', 'granted');
end;
$$;
revoke execute on function public.admin_revoke_course_access(uuid, text, text) from public, anon;
grant execute on function public.admin_revoke_course_access(uuid, text, text) to authenticated;

/* ============================================================ admin: enrolments and analytics */

create or replace function public.admin_list_enrollments(p_course_id text default null)
returns table (user_id uuid, full_name text, email text, course_id text, course_title text, source text, enrolled_at timestamptz,
               completed_at timestamptz, amount numeric, currency text, order_status text)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  return query
    select e.user_id, p.full_name, p.email, e.course_id, c.title, e.source, e.enrolled_at,
           coalesce(e.completed_at, (select min(k.issued_at) from public.credentials k where k.user_id = e.user_id and k.course_id = e.course_id and k.kind = 'course_completion' and k.status = 'valid')),
           o.amount, o.currency, o.status
    from public.enrollments e
    join public.courses c on c.id = e.course_id
    left join public.profiles p on p.id = e.user_id
    left join public.course_orders o on o.id = e.order_id
    where p_course_id is null or e.course_id = p_course_id
    order by e.enrolled_at desc
    limit 1000;
end;
$$;
revoke execute on function public.admin_list_enrollments(text) from public, anon;
grant execute on function public.admin_list_enrollments(text) to authenticated;

-- One row per course. For a paid course, "converted" is buyers who had taken a free course first. For a free course,
-- it is learners who later bought a paid course.
create or replace function public.admin_course_stats()
returns table (course_id text, title text, course_type text, access_type text, published boolean, price numeric, currency text,
               enrollments int, free_enrollments int, paid_enrollments int, granted_enrollments int, completions int,
               revenue jsonb, converted int)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  return query
    select c.id, c.title, c.course_type, c.access_type, c.published, c.price, c.currency,
           (select count(*)::int from public.enrollments e where e.course_id = c.id),
           (select count(*)::int from public.enrollments e where e.course_id = c.id and e.source = 'free'),
           (select count(*)::int from public.enrollments e where e.course_id = c.id and e.source = 'purchase'),
           (select count(*)::int from public.enrollments e where e.course_id = c.id and e.source = 'granted'),
           (select count(*)::int from public.enrollments e where e.course_id = c.id
              and (e.completed_at is not null or exists (select 1 from public.credentials k where k.user_id = e.user_id and k.course_id = c.id and k.kind = 'course_completion' and k.status = 'valid'))),
           coalesce((select jsonb_object_agg(x.currency, x.total) from
                       (select o.currency, sum(o.amount) as total from public.course_orders o where o.course_id = c.id and o.status = 'paid' group by o.currency) x), '{}'::jsonb),
           case when c.access_type = 'paid' then
             (select count(*)::int from public.enrollments e where e.course_id = c.id and e.source = 'purchase'
                and exists (select 1 from public.enrollments f join public.courses fc on fc.id = f.course_id
                             where f.user_id = e.user_id and fc.access_type = 'free' and f.enrolled_at < e.enrolled_at))
           else
             (select count(distinct e.user_id)::int from public.enrollments e
               where e.course_id = c.id
                 and exists (select 1 from public.enrollments f join public.courses fc on fc.id = f.course_id
                              where f.user_id = e.user_id and fc.access_type = 'paid' and f.source = 'purchase' and f.enrolled_at > e.enrolled_at))
           end
    from public.courses c
    order by c.position;
end;
$$;
revoke execute on function public.admin_course_stats() from public, anon;
grant execute on function public.admin_course_stats() to authenticated;

-- Saving a lesson is an upsert, which needs table-wide read access that learners no longer have, so admins save through this.
create or replace function public.admin_save_lesson(p_lesson jsonb)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
  values (p_lesson ->> 'id', p_lesson ->> 'course_id', p_lesson ->> 'module_id', p_lesson ->> 'slug', p_lesson ->> 'title',
          coalesce(p_lesson ->> 'summary', ''), coalesce((p_lesson ->> 'minutes')::int, 15), coalesce(p_lesson ->> 'body_md', ''),
          coalesce((p_lesson ->> 'required')::boolean, true), coalesce((p_lesson ->> 'published')::boolean, false),
          coalesce((p_lesson ->> 'position')::int, 0),
          coalesce(array(select jsonb_array_elements_text(p_lesson -> 'required_exercises')), '{}'::text[]))
  on conflict (id) do update set
    course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title,
    summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required,
    published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;
end;
$$;
revoke execute on function public.admin_save_lesson(jsonb) from public, anon;
grant execute on function public.admin_save_lesson(jsonb) to authenticated;

notify pgrst, 'reload schema';
