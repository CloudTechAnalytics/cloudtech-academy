-- Admins can permanently delete a certificate or a badge.
--
-- Revoking withdraws a credential but keeps it verifiable as "revoked". Deleting removes it: its public
-- page then says "not found". Certificate numbers are never reused (they come from one sequence).
-- Every deletion is written to admin_deletions, which only admins can read, so there is still a record of
-- what was deleted, by whom, when and why, with a snapshot of what was removed.

create table public.admin_deletions (
  id              bigint generated always as identity primary key,
  kind            text not null check (kind in ('certificate', 'badge')),
  public_id       text not null,
  recipient_name  text not null default '',
  title           text not null default '',
  reason          text,
  deleted_by      uuid references auth.users (id) on delete set null,
  deleted_by_name text not null default '',
  deleted_at      timestamptz not null default now(),
  snapshot        jsonb not null default '{}'::jsonb
);
create index admin_deletions_idx on public.admin_deletions (deleted_at desc);

alter table public.admin_deletions enable row level security;
revoke all on public.admin_deletions from anon;
create policy "admin read deletions" on public.admin_deletions for select using (public.is_admin());

-- A certificate's activity log goes with it (the deletion log keeps the summary), and a certificate that
-- replaced a deleted one simply stops pointing at it.
alter table public.certificate_events drop constraint certificate_events_certificate_id_fkey;
alter table public.certificate_events add constraint certificate_events_certificate_id_fkey
  foreign key (certificate_id) references public.certificates (certificate_id) on delete cascade;
alter table public.certificates drop constraint certificates_replaced_certificate_id_fkey;
alter table public.certificates add constraint certificates_replaced_certificate_id_fkey
  foreign key (replaced_certificate_id) references public.certificates (certificate_id) on delete set null;

create or replace function public.admin_actor_name()
returns text language sql stable security definer set search_path = public as $$
  select coalesce(nullif(trim(full_name), ''), email, '') from public.profiles where id = auth.uid();
$$;

create or replace function public.admin_delete_certificate(p_certificate_id text, p_reason text)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_cert    public.certificates;
  v_reason  text := nullif(trim(coalesce(p_reason, '')), '');
  v_replaced_by text;
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  select * into v_cert from public.certificates where certificate_id = upper(trim(p_certificate_id)) for update;
  if not found then raise exception 'Certificate not found.'; end if;
  select certificate_id into v_replaced_by from public.certificates where replaced_certificate_id = v_cert.certificate_id limit 1;

  insert into public.admin_deletions (kind, public_id, recipient_name, title, reason, deleted_by, deleted_by_name, snapshot)
  values ('certificate', v_cert.certificate_id, v_cert.recipient_name, coalesce(v_cert.certificate_title, v_cert.course_title), v_reason,
          auth.uid(), coalesce(public.admin_actor_name(), ''),
          to_jsonb(v_cert) || jsonb_build_object('replaced_by', v_replaced_by,
            'events', coalesce((select jsonb_agg(jsonb_build_object('action', e.action, 'actor', e.actor_name, 'at', e.created_at) order by e.id)
                                from public.certificate_events e where e.certificate_id = v_cert.certificate_id), '[]'::jsonb)));
  delete from public.certificates where id = v_cert.id;
end;
$$;

-- A badge can be deleted unless an official certificate was issued from it. Unpaid certificate orders for it
-- are removed with it; a paid or granted order is kept as the payment record, so that blocks deletion.
create or replace function public.admin_delete_credential(p_credential_id text, p_reason text)
returns void
language plpgsql security definer set search_path = public as $$
declare
  v_cred   public.credentials;
  v_reason text := nullif(trim(coalesce(p_reason, '')), '');
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  select * into v_cred from public.credentials where credential_id = upper(trim(p_credential_id)) for update;
  if not found then raise exception 'Badge not found.'; end if;
  if exists (select 1 from public.certificates where credential_id = v_cred.credential_id) then
    raise exception 'An official certificate was issued from this credential. Delete that certificate first.';
  end if;
  if exists (select 1 from public.certificate_orders where credential_id = v_cred.credential_id and status in ('paid', 'granted')) then
    raise exception 'This credential has a paid or granted certificate order, which is kept as a payment record.';
  end if;

  insert into public.admin_deletions (kind, public_id, recipient_name, title, reason, deleted_by, deleted_by_name, snapshot)
  values ('badge', v_cred.credential_id, v_cred.recipient_name, v_cred.badge_name, v_reason, auth.uid(), coalesce(public.admin_actor_name(), ''), to_jsonb(v_cred));
  delete from public.certificate_orders where credential_id = v_cred.credential_id;
  delete from public.credentials where id = v_cred.id;
end;
$$;

revoke execute on function public.admin_actor_name() from public, anon, authenticated;
revoke execute on function public.admin_delete_certificate(text, text) from public, anon;
revoke execute on function public.admin_delete_credential(text, text) from public, anon;
grant execute on function public.admin_delete_certificate(text, text) to authenticated;
grant execute on function public.admin_delete_credential(text, text) to authenticated;

notify pgrst, 'reload schema';
