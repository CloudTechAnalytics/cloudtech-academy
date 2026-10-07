-- Site-wide settings an admin can change without a deploy. For now: the ids used to measure visits and ads.
-- The ids are public by nature (they sit in the page source of any site that uses them), so anyone can read them.
create table public.site_settings (
  id             int primary key default 1 check (id = 1),
  ga4_id         text check (ga4_id is null or ga4_id ~ '^G-[A-Z0-9]{6,14}$'),
  google_ads_id  text check (google_ads_id is null or google_ads_id ~ '^AW-[0-9]{6,14}$'),
  meta_pixel_id  text check (meta_pixel_id is null or meta_pixel_id ~ '^[0-9]{8,20}$'),
  updated_at     timestamptz not null default now()
);
insert into public.site_settings default values;
alter table public.site_settings enable row level security;
create policy "anyone reads site settings" on public.site_settings for select using (true);
create policy "admins update site settings" on public.site_settings for update using (public.is_admin()) with check (public.is_admin());
