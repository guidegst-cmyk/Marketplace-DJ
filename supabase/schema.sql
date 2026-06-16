-- XYZ Marketplace — Supabase schema
-- Run this once in the Supabase SQL Editor for your project.
-- Safe to re-run on a fresh project (uses IF NOT EXISTS / ON CONFLICT where useful).

-- ============================================================
-- Tables
-- ============================================================

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  active boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  area text,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text,
  specs text,
  description text,
  active boolean not null default true,
  vendor_id uuid not null references vendors(id) on delete cascade,
  category_id uuid not null references categories(id) on delete restrict,
  created_at timestamptz not null default now()
);

create index if not exists products_vendor_id_idx on products(vendor_id);
create index if not exists products_category_id_idx on products(category_id);
create index if not exists products_active_idx on products(active);

-- Single-row table for site-wide settings (central WhatsApp number, etc.)
create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  site_name text not null default 'XYZ',
  whatsapp_number text not null default '',
  enquiry_message_template text not null default
    'Hi, I am interested in {product} ({brand}) listed by {vendor} under {category}. Please share price and availability.'
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table categories enable row level security;
alter table vendors enable row level security;
alter table products enable row level security;
alter table settings enable row level security;

-- Categories: anyone can read active categories; logged-in admin can read/write all.
drop policy if exists "categories_public_read_active" on categories;
create policy "categories_public_read_active" on categories
  for select to anon
  using (active = true);

drop policy if exists "categories_admin_read_all" on categories;
create policy "categories_admin_read_all" on categories
  for select to authenticated
  using (true);

drop policy if exists "categories_admin_write" on categories;
create policy "categories_admin_write" on categories
  for all to authenticated
  using (true)
  with check (true);

-- Vendors: same pattern as categories.
drop policy if exists "vendors_public_read_active" on vendors;
create policy "vendors_public_read_active" on vendors
  for select to anon
  using (active = true);

drop policy if exists "vendors_admin_read_all" on vendors;
create policy "vendors_admin_read_all" on vendors
  for select to authenticated
  using (true);

drop policy if exists "vendors_admin_write" on vendors;
create policy "vendors_admin_write" on vendors
  for all to authenticated
  using (true)
  with check (true);

-- Products: same pattern as categories/vendors.
drop policy if exists "products_public_read_active" on products;
create policy "products_public_read_active" on products
  for select to anon
  using (active = true);

drop policy if exists "products_admin_read_all" on products;
create policy "products_admin_read_all" on products
  for select to authenticated
  using (true);

drop policy if exists "products_admin_write" on products;
create policy "products_admin_write" on products
  for all to authenticated
  using (true)
  with check (true);

-- Settings: readable by everyone (needed to build WhatsApp links + branding),
-- writable only by the logged-in admin.
drop policy if exists "settings_public_read" on settings;
create policy "settings_public_read" on settings
  for select to anon, authenticated
  using (true);

drop policy if exists "settings_admin_write" on settings;
create policy "settings_admin_write" on settings
  for update to authenticated
  using (true)
  with check (true);

-- ============================================================
-- Seed data
-- ============================================================

insert into categories (name, slug, sort_order, active) values
  ('Amplifiers', 'amplifiers', 0, true),
  ('Speakers', 'speakers', 1, true),
  ('Microphones & Wireless Mic Systems', 'microphones-wireless-mic-systems', 2, true),
  ('Mixers & Sound Consoles', 'mixers-sound-consoles', 3, true),
  ('Home Theatre Systems', 'home-theatre-systems', 4, true),
  ('Car Audio & Accessories', 'car-audio-accessories', 5, true),
  ('PA / DJ / Stage Equipment', 'pa-dj-stage-equipment', 6, true),
  ('Cables, Connectors & Wiring', 'cables-connectors-wiring', 7, true),
  ('Power Supplies / SMPS', 'power-supplies-smps', 8, true),
  ('Spares & Accessories', 'spares-accessories', 9, true)
on conflict (slug) do nothing;

-- Seed a single settings row only if one doesn't already exist.
insert into settings (site_name, whatsapp_number, enquiry_message_template)
select 'XYZ', '910000000000',
  'Hi, I am interested in {product} ({brand}) listed by {vendor} under {category}. Please share price and availability.'
where not exists (select 1 from settings);
