-- ═══════════════════════════════════════════════════════════════════════════════
-- EPK Agent — Complete Database Schema
-- ═══════════════════════════════════════════════════════════════════════════════
-- Run the entire file in Supabase SQL Editor to set up all tables.
-- Or use:  supabase migration up
-- ============================================================

-- ── 1. Extensions ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 2. Profiles Table ─────────────────────────────────────────────────────────
-- Stores artist intake/wizard data (ArtistProfile type)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE USING (auth.uid() = user_id);

-- ── 3. EPKs Table ──────────────────────────────────────────────────────────────
-- Stores the actual Electronic Press Kit with all data as JSONB
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

CREATE INDEX IF NOT EXISTS epks_user_id_idx ON epks(user_id);
CREATE INDEX IF NOT EXISTS epks_slug_idx ON epks(slug);
CREATE INDEX IF NOT EXISTS epks_created_at_idx ON epks(created_at DESC);
CREATE INDEX IF NOT EXISTS epks_data_gin_idx ON epks USING GIN (data);

ALTER TABLE epks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own EPKs"
  ON epks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public EPK pages are readable"
  ON epks FOR SELECT USING (true);

CREATE POLICY "Users can create EPKs"
  ON epks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own EPKs"
  ON epks FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own EPKs"
  ON epks FOR DELETE USING (auth.uid() = user_id);

-- ── 4. Domains Table ───────────────────────────────────────────────────────────
-- Custom domain mapping for EPK URLs
CREATE TABLE IF NOT EXISTS domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  domain TEXT NOT NULL UNIQUE,
  epk_slug TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_domains_user_id ON domains(user_id);
CREATE INDEX IF NOT EXISTS idx_domains_domain ON domains(domain);

ALTER TABLE domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own domains"
  ON domains FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own domains"
  ON domains FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own domains"
  ON domains FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own domains"
  ON domains FOR DELETE USING (auth.uid() = user_id);

-- ── 5. Updated-at Trigger Function ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
DROP TRIGGER IF EXISTS set_profiles_updated_at ON profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS epks_updated_at ON epks;
CREATE TRIGGER epks_updated_at
  BEFORE UPDATE ON epks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_domains_updated_at ON domains;
CREATE TRIGGER set_domains_updated_at
  BEFORE UPDATE ON domains
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── 6. RPC Functions ───────────────────────────────────────────────────────────
-- Counter increments (bypass RLS via security definer)

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
