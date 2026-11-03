-- Admins can delete entries from the email log.
create policy "admins delete the email log" on public.email_outbox for delete using (public.is_admin());

-- Every few minutes, send anything still queued (for example if the mail account was connected after the emails were queued).
-- Skipped quietly where scheduled jobs aren't available.
do $$
begin
  create extension if not exists pg_cron;
  perform cron.unschedule(jobid) from cron.job where jobname = 'send-queued-emails';
  perform cron.schedule('send-queued-emails', '*/5 * * * *', 'select public.kick_email_worker()');
exception when others then
  raise notice 'pg_cron not available: %', sqlerrm;
end;
$$;
