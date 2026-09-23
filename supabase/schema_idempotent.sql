-- ── Extensions ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Profiles Table ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'active',
  stripe_customer_id TEXT,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  profile_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;
CREATE POLICY "Users can delete own profile" ON profiles FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage all profiles" ON profiles;
CREATE POLICY "Service role can manage all profiles" ON profiles FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ── EPKs Table ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS epks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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

DROP POLICY IF EXISTS "Users can view own EPKs" ON epks;
CREATE POLICY "Users can view own EPKs" ON epks FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public EPK pages are readable" ON epks;
CREATE POLICY "Public EPK pages are readable" ON epks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create EPKs" ON epks;
CREATE POLICY "Users can create EPKs" ON epks FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own EPKs" ON epks;
CREATE POLICY "Users can update own EPKs" ON epks FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own EPKs" ON epks;
CREATE POLICY "Users can delete own EPKs" ON epks FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage all EPKs" ON epks;
CREATE POLICY "Service role can manage all EPKs" ON epks FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ── Domains Table ───────────────────────────────────────────────────────────
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

DROP POLICY IF EXISTS "Users can view own domains" ON domains;
CREATE POLICY "Users can view own domains" ON domains FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own domains" ON domains;
CREATE POLICY "Users can insert own domains" ON domains FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own domains" ON domains;
CREATE POLICY "Users can update own domains" ON domains FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own domains" ON domains;
CREATE POLICY "Users can delete own domains" ON domains FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage all domains" ON domains;
CREATE POLICY "Service role can manage all domains" ON domains FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ── Subscriptions Table ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_customer_id TEXT,
  customer_email TEXT NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'epk_edit', 'epk_style_pro', 'epk_premium')),
  status TEXT NOT NULL DEFAULT 'incomplete' CHECK (status IN ('incomplete', 'active', 'past_due', 'canceled', 'complete')),
  current_period_end TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON subscriptions(customer_email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON subscriptions;
CREATE POLICY "Service role can manage all subscriptions" ON subscriptions FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ── Triggers ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

DROP TRIGGER IF EXISTS subscriptions_updated_at ON subscriptions;
CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── RPC Functions ───────────────────────────────────────────────────────────
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
