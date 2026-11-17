-- Deleting a free course.
--
-- A learner can delete any free course from My Learning, finished or not. Deleting it removes everything they did in
-- it: progress, practice, assessment attempts, the course project submission, and the course's badges (module badges
-- and the completion badge). Each deleted badge is recorded in admin_deletions, like an admin deletion, so a shared
-- badge link can still be explained.
--
-- Not allowed: paid and programme courses (they stay with the purchase), and a course whose completion badge has an
-- official certificate or a paid certificate order (certificates must stay verifiable).

create or replace function public.remove_course(p_course_id text)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  v_name text;
  c      public.credentials;
begin
  if v_user is null then raise exception 'Please sign in first.'; end if;
  if exists (select 1 from public.enrollments where user_id = v_user and course_id = p_course_id and source <> 'free') then
    raise exception 'A course that''s part of a payment or programme stays in your account. Contact support if you need it removed.';
  end if;
  if exists (select 1 from public.certificates x join public.credentials k on k.credential_id = x.credential_id
              where k.user_id = v_user and k.course_id = p_course_id)
     or exists (select 1 from public.certificate_orders o join public.credentials k on k.credential_id = o.credential_id
                 where k.user_id = v_user and k.course_id = p_course_id and o.status in ('paid', 'granted')) then
    raise exception 'You hold an official certificate for this course. It must stay verifiable, so the course can''t be deleted. Contact support if you need help.';
  end if;

  select coalesce(nullif(trim(full_name), ''), email) into v_name from public.profiles where id = v_user;
  for c in select * from public.credentials where user_id = v_user and course_id = p_course_id and kind in ('module_badge', 'course_completion') loop
    insert into public.admin_deletions (kind, public_id, recipient_name, title, reason, deleted_by, deleted_by_name, snapshot)
    values ('badge', c.credential_id, c.recipient_name, c.badge_name, 'Deleted by the learner with the course', v_user, coalesce(v_name, ''), to_jsonb(c));
    delete from public.certificate_orders where credential_id = c.credential_id;
    delete from public.credentials where id = c.id;
  end loop;

  perform public.clear_course_progress(v_user, p_course_id);
  delete from public.project_submissions s using public.projects p where p.id = s.project_id and p.course_id = p_course_id and s.user_id = v_user;
  delete from public.enrollments where user_id = v_user and course_id = p_course_id;
end;
$$;
revoke execute on function public.remove_course(text) from public, anon;
grant execute on function public.remove_course(text) to authenticated;

notify pgrst, 'reload schema';
