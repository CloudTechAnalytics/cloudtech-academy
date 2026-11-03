-- Connect email with a Gmail address and an app password, entered by an admin in the dashboard, instead of server secrets.
-- The password is write-only: it can be saved but never read back through the API (only the Edge Function reads it).

alter table public.email_settings add column smtp_user text, add column smtp_pass text;

revoke select on public.email_settings from anon, authenticated;
grant select (id, enabled, from_name, reply_to, function_url, smtp_user) on public.email_settings to authenticated;

-- The secret and password were never meant for the browser: the secret was readable by admins before; now it is not.
create or replace function public.admin_save_email_credentials(p_user text, p_pass text)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  if p_user is null or p_user !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'Enter the Gmail address you send from.'; end if;
  if coalesce(trim(p_pass), '') = '' and not exists (select 1 from public.email_settings where id = 1 and smtp_pass is not null) then
    raise exception 'Enter the app password.';
  end if;
  update public.email_settings
     set smtp_user = lower(trim(p_user)),
         smtp_pass = case when coalesce(trim(p_pass), '') = '' then smtp_pass else replace(trim(p_pass), ' ', '') end
   where id = 1;
end;
$$;
revoke execute on function public.admin_save_email_credentials(text, text) from public, anon;
grant execute on function public.admin_save_email_credentials(text, text) to authenticated;

create or replace function public.admin_clear_email_credentials()
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  update public.email_settings set smtp_user = null, smtp_pass = null where id = 1;
end;
$$;
revoke execute on function public.admin_clear_email_credentials() from public, anon;
grant execute on function public.admin_clear_email_credentials() to authenticated;

notify pgrst, 'reload schema';
