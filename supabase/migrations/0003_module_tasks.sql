-- A module badge now needs the work, not just the quiz: every required task in the
-- module's lessons (SQL exercises, answer tasks and written tasks) must be complete
-- before claim_module_badge() issues the badge. Badges already issued stay valid.

create or replace function public.claim_module_badge(p_module_id text)
returns public.credentials
language plpgsql security definer set search_path = public as $$
declare
  v_user    uuid := auth.uid();
  v_module  public.course_modules;
  v_course  public.courses;
  v_cred    public.credentials;
  v_missing int;
begin
  if v_user is null then raise exception 'Please sign in first.'; end if;
  select * into v_module from public.course_modules where id = p_module_id;
  if not found or v_module.badge_name is null then raise exception 'This module has no badge.'; end if;
  select * into v_course from public.courses where id = v_module.course_id and published;
  if not found then raise exception 'Course not found.'; end if;

  select * into v_cred from public.credentials
  where user_id = v_user and kind = 'module_badge' and module_id = p_module_id and status = 'valid';
  if found then return v_cred; end if;

  select count(*) into v_missing
  from (select unnest(required_exercises) as exercise_id from public.lessons where module_id = p_module_id and published) e
  where not exists (select 1 from public.exercise_completions x where x.user_id = v_user and x.exercise_id = e.exercise_id);
  if v_missing > 0 then raise exception 'Complete the tasks in this module first (% left).', v_missing; end if;

  if not exists (
    select 1 from public.assessment_attempts t join public.assessments a on a.id = t.assessment_id
    where a.kind = 'module' and a.module_id = p_module_id and t.user_id = v_user and t.passed
  ) then
    raise exception 'Pass the module check first.';
  end if;

  insert into public.credentials (credential_id, user_id, kind, course_id, module_id, badge_name, course_title, module_title, recipient_name, skills)
  values (public.new_credential_id(coalesce(v_module.badge_code, v_course.code)), v_user, 'module_badge', v_course.id, v_module.id,
          v_module.badge_name, v_course.title, v_module.title, public.recipient_name(v_user), v_module.skills)
  returning * into v_cred;
  return v_cred;
end;
$$;

revoke execute on function public.claim_module_badge(text) from public, anon;
grant execute on function public.claim_module_badge(text) to authenticated;
