-- Learners can remove a course from My Learning, and a course that hasn't been touched for
-- 14 days starts over. Both clear that course's lessons, tasks and assessment attempts.
-- Earned badges and credentials are never touched, and completed courses are never reset.

alter table public.enrollments add column if not exists last_active_at timestamptz not null default now();
-- Everyone already enrolled gets a full 14 days from today, rather than being reset on arrival.
update public.enrollments set last_active_at = now();

-- Opening a lesson updates the enrollment's bookmark; count that as activity.
create or replace function public.enrollment_touched()
returns trigger language plpgsql as $$
begin
  new.last_active_at := now();
  return new;
end;
$$;
drop trigger if exists enrollments_touch on public.enrollments;
create trigger enrollments_touch before update of last_lesson_id on public.enrollments
  for each row execute function public.enrollment_touched();

-- Completing a lesson or task, or taking an assessment, also counts.
create or replace function public.touch_enrollment()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_course text;
begin
  if tg_table_name = 'assessment_attempts' then
    select course_id into v_course from public.assessments where id = new.assessment_id;
  else
    v_course := new.course_id;
  end if;
  update public.enrollments set last_active_at = now() where user_id = new.user_id and course_id = v_course;
  return new;
end;
$$;
drop trigger if exists lesson_progress_touch on public.lesson_progress;
create trigger lesson_progress_touch after insert on public.lesson_progress for each row execute function public.touch_enrollment();
drop trigger if exists exercise_completions_touch on public.exercise_completions;
create trigger exercise_completions_touch after insert on public.exercise_completions for each row execute function public.touch_enrollment();
drop trigger if exists assessment_attempts_touch on public.assessment_attempts;
create trigger assessment_attempts_touch after insert on public.assessment_attempts for each row execute function public.touch_enrollment();

-- A course is complete once its completion credential has been issued.
create or replace function public.course_completed(p_user uuid, p_course_id text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.enrollments where user_id = p_user and course_id = p_course_id and completed_at is not null)
      or exists (select 1 from public.credentials where user_id = p_user and course_id = p_course_id and kind = 'course_completion' and status = 'valid');
$$;

-- Clears one learner's progress in one course. Internal: called by the two functions below.
create or replace function public.clear_course_progress(p_user uuid, p_course_id text)
returns void language plpgsql security definer set search_path = public as $$
begin
  delete from public.lesson_progress where user_id = p_user and course_id = p_course_id;
  delete from public.exercise_completions where user_id = p_user and course_id = p_course_id;
  delete from public.assessment_attempts t using public.assessments a
   where a.id = t.assessment_id and a.course_id = p_course_id and t.user_id = p_user;
  update public.enrollments set last_lesson_id = null, last_active_at = now()
   where user_id = p_user and course_id = p_course_id;
end;
$$;

-- Removes a course from the learner's My Learning. Progress is cleared unless the course is complete.
create or replace function public.remove_course(p_course_id text)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
begin
  if v_user is null then raise exception 'Please sign in first.'; end if;
  if not public.course_completed(v_user, p_course_id) then
    perform public.clear_course_progress(v_user, p_course_id);
  end if;
  delete from public.enrollments where user_id = v_user and course_id = p_course_id;
end;
$$;

-- Starts over every unfinished course the learner hasn't touched for 14 days, and returns
-- the ones that had progress to lose, so the site can tell them.
create or replace function public.apply_inactivity_resets()
returns setof text language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  r record;
begin
  if v_user is null then return; end if;
  for r in
    select e.course_id from public.enrollments e
     where e.user_id = v_user and e.last_active_at < now() - interval '14 days'
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

revoke execute on function public.clear_course_progress(uuid, text) from public, anon, authenticated;
revoke execute on function public.course_completed(uuid, text) from public, anon, authenticated;
revoke execute on function public.remove_course(text) from public, anon;
revoke execute on function public.apply_inactivity_resets() from public, anon;
grant execute on function public.remove_course(text) to authenticated;
grant execute on function public.apply_inactivity_resets() to authenticated;
