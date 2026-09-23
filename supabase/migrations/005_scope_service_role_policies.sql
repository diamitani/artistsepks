-- ── Migration 005: lock "service role" policies to the service role ─────────
-- The "Service role can manage all ..." policies were created without a
-- `TO service_role` clause, so they applied to EVERY role — including the
-- public anon key shipped to the browser. That let any visitor read, edit or
-- delete every EPK, domain and purchase record, and grant themselves a paid
-- plan by inserting into `subscriptions`.
--
-- The service role bypasses RLS anyway, so scoping these policies to it keeps
-- server-side code (webhooks, admin client) working exactly as before.

DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON subscriptions;
CREATE POLICY "Service role can manage all subscriptions" ON subscriptions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can manage all EPKs" ON epks;
CREATE POLICY "Service role can manage all EPKs" ON epks
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can manage all domains" ON domains;
CREATE POLICY "Service role can manage all domains" ON domains
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DO $$
BEGIN
  IF to_regclass('public.profiles') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Service role can manage all profiles" ON profiles;
    CREATE POLICY "Service role can manage all profiles" ON profiles
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;
