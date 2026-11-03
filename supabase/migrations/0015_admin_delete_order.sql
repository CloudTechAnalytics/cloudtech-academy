-- Admins can delete an order from the card payments list. Any access the order opened is closed first, and its payment
-- parts (and their receipts' records) go with it. Enrolments the learner got another way are left alone.
create or replace function public.admin_delete_order(p_order_id uuid)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only.'; end if;
  if not exists (select 1 from public.course_orders where id = p_order_id) then raise exception 'Order not found.'; end if;
  perform public.revoke_for_order(p_order_id);
  delete from public.course_orders where id = p_order_id;
end;
$$;
revoke execute on function public.admin_delete_order(uuid) from public, anon;
grant execute on function public.admin_delete_order(uuid) to authenticated;

notify pgrst, 'reload schema';
