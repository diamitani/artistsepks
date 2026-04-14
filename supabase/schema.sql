-- EPK Agent Database Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- EPKs table
create table if not exists epks (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  template text not null check (template in ('main', 'booking', 'brand')),
  data jsonb not null default '{}',
  views integer not null default 0,
  downloads integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for fast user lookups
create index if not exists epks_user_id_idx on epks(user_id);
-- Index for slug lookups
create index if not exists epks_slug_idx on epks(slug);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger epks_updated_at
  before update on epks
  for each row execute function update_updated_at();

-- RLS policies
alter table epks enable row level security;

-- Users can read their own EPKs
create policy "Users can view own EPKs"
  on epks for select
  using (auth.uid() = user_id);

-- Anyone can view a published EPK by slug (public EPK pages)
create policy "Public EPK pages are readable"
  on epks for select
  using (true);

-- Users can insert their own EPKs
create policy "Users can create EPKs"
  on epks for insert
  with check (auth.uid() = user_id);

-- Users can update their own EPKs
create policy "Users can update own EPKs"
  on epks for update
  using (auth.uid() = user_id);

-- Users can delete their own EPKs
create policy "Users can delete own EPKs"
  on epks for delete
  using (auth.uid() = user_id);

-- View increment function (called via rpc, bypasses RLS for the counter)
create or replace function increment_epk_views(epk_slug text)
returns void as $$
begin
  update epks set views = views + 1 where slug = epk_slug;
end;
$$ language plpgsql security definer;

-- Download increment function
create or replace function increment_epk_downloads(epk_slug text)
returns void as $$
begin
  update epks set downloads = downloads + 1 where slug = epk_slug;
end;
$$ language plpgsql security definer;
