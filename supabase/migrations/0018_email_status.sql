-- Lets the Emails page show whether a Gmail account is connected without asking the Edge Function (and without ever
-- returning the password).
create or replace function public.admin_email_status()
returns table (smtp_user text, has_password boolean)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  return query select s.smtp_user, s.smtp_pass is not null from public.email_settings s where s.id = 1;
end;
$$;
revoke execute on function public.admin_email_status() from public, anon;
grant execute on function public.admin_email_status() to authenticated;
notify pgrst, 'reload schema';
