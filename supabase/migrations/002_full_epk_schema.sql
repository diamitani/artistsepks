-- ── EPK Schema Migration 002 ───────────────────────────────────────────────────
-- Run this after 001_profiles.sql has been applied.
-- Creates the epks table, indexes, triggers, RLS policies, and RPC functions.

-- 1. Enable UUID extension (safe to re-run)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. EPKs table
CREATE TABLE IF NOT EXISTS epks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template TEXT NOT NULL CHECK (template IN ('main', 'booking', 'brand')),
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  views INTEGER NOT NULL DEFAULT 0,
  downloads INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Indexes for performance
CREATE INDEX IF NOT EXISTS epks_user_id_idx ON epks(user_id);
CREATE INDEX IF NOT EXISTS epks_slug_idx ON epks(slug);
CREATE INDEX IF NOT EXISTS epks_created_at_idx ON epks(created_at DESC);
-- GIN index for querying inside the jsonb data field
CREATE INDEX IF NOT EXISTS epks_data_gin_idx ON epks USING GIN (data);

-- 4. Updated-at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger first to make migration idempotent
DROP TRIGGER IF EXISTS epks_updated_at ON epks;
CREATE TRIGGER epks_updated_at
  BEFORE UPDATE ON epks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 5. Row Level Security
ALTER TABLE epks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to make migration idempotent
DROP POLICY IF EXISTS "Users can view own EPKs" ON epks;
DROP POLICY IF EXISTS "Public EPK pages are readable" ON epks;
DROP POLICY IF EXISTS "Users can create EPKs" ON epks;
DROP POLICY IF EXISTS "Users can update own EPKs" ON epks;
DROP POLICY IF EXISTS "Users can delete own EPKs" ON epks;

-- Re-create policies
CREATE POLICY "Users can view own EPKs"
  ON epks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Public EPK pages are readable"
  ON epks FOR SELECT
  USING (true);

CREATE POLICY "Users can create EPKs"
  ON epks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own EPKs"
  ON epks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own EPKs"
  ON epks FOR DELETE
  USING (auth.uid() = user_id);

-- 6. RPC functions for counter increments (bypass RLS via security definer)

CREATE OR REPLACE FUNCTION increment_epk_views(epk_slug TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE epks SET views = views + 1 WHERE slug = epk_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_epk_downloads(epk_slug TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE epks SET downloads = downloads + 1 WHERE slug = epk_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
