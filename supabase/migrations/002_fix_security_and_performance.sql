-- ============================================================
-- 1. Fix update_updated_at: add fixed search_path
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
  RETURNS trigger
  LANGUAGE plpgsql
  SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- 2. Remove rls_auto_enable + event trigger ensure_rls
-- ============================================================
DROP EVENT TRIGGER IF EXISTS ensure_rls;
DROP FUNCTION IF EXISTS public.rls_auto_enable() CASCADE;

-- ============================================================
-- 3. profiles: restrict INSERT/UPDATE a authenticated + fix auth.uid()
-- ============================================================
DROP POLICY IF EXISTS profiles_insert ON public.profiles;
CREATE POLICY profiles_insert ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS profiles_update ON public.profiles;
CREATE POLICY profiles_update ON public.profiles
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- ============================================================
-- 4. guides: restrict INSERT/UPDATE a authenticated + fix auth.uid()
-- ============================================================
DROP POLICY IF EXISTS guides_insert ON public.guides;
CREATE POLICY guides_insert ON public.guides
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS guides_update ON public.guides;
CREATE POLICY guides_update ON public.guides
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- ============================================================
-- 5. bookings: restrict todas as policies a authenticated + fix auth.uid()
-- ============================================================
DROP POLICY IF EXISTS bookings_insert ON public.bookings;
CREATE POLICY bookings_insert ON public.bookings
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = runner_id);

DROP POLICY IF EXISTS bookings_select ON public.bookings;
CREATE POLICY bookings_select ON public.bookings
  FOR SELECT TO authenticated
  USING ((select auth.uid()) = runner_id OR (select auth.uid()) = guide_id);

DROP POLICY IF EXISTS bookings_update ON public.bookings;
CREATE POLICY bookings_update ON public.bookings
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = runner_id OR (select auth.uid()) = guide_id)
  WITH CHECK ((select auth.uid()) = runner_id OR (select auth.uid()) = guide_id);

-- ============================================================
-- 6. reviews: restrict INSERT a authenticated + fix auth.uid()
-- ============================================================
DROP POLICY IF EXISTS reviews_insert ON public.reviews;
CREATE POLICY reviews_insert ON public.reviews
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = reviewer_id);

-- ============================================================
-- 7. Indexes nas FKs sem cobertura
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_bookings_guide_id   ON public.bookings(guide_id);
CREATE INDEX IF NOT EXISTS idx_bookings_runner_id  ON public.bookings(runner_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewed_id ON public.reviews(reviewed_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON public.reviews(reviewer_id);
