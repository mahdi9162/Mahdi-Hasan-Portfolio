-- Security hardening for a single-admin portfolio.
--
-- Before applying this migration, set the trusted user's immutable
-- app_metadata claim with the Supabase service role, then have that user sign
-- out and back in so their JWT is refreshed:
--   { "portfolio_role": "admin" }
--
-- Database RLS cannot securely read PORTFOLIO_ADMIN_EMAIL from the deployment
-- environment. The server uses that env var for dashboard/API authorization;
-- this JWT app_metadata claim is the database-side equivalent and must be set
-- only through Supabase Admin APIs or the Supabase dashboard.

CREATE OR REPLACE FUNCTION public.is_portfolio_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(auth.jwt() -> 'app_metadata' ->> 'portfolio_role' = 'admin', false);
$$;

REVOKE ALL ON FUNCTION public.is_portfolio_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_portfolio_admin() TO authenticated;

-- Replace every write policy on dashboard-managed tables, then establish an
-- explicit public read policy. This preserves portfolio reads even if a prior
-- broad FOR ALL policy had been carrying both read and write access.
DO $$
DECLARE
  target_table text;
  target_policy text;
BEGIN
  FOREACH target_table IN ARRAY ARRAY[
    'projects',
    'skill_categories',
    'skills',
    'hero_content',
    'about_content',
    'seo_settings'
  ]
  LOOP
    IF to_regclass(format('public.%I', target_table)) IS NULL THEN
      CONTINUE;
    END IF;

    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', target_table);

    FOR target_policy IN
      SELECT policyname
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = target_table
        AND cmd IN ('ALL', 'INSERT', 'UPDATE', 'DELETE')
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', target_policy, target_table);
    END LOOP;

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'Portfolio admin can manage ' || target_table, target_table);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (public.is_portfolio_admin()) WITH CHECK (public.is_portfolio_admin())',
      'Portfolio admin can manage ' || target_table,
      target_table
    );
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'Portfolio public can read ' || target_table, target_table);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT TO anon, authenticated USING (true)',
      'Portfolio public can read ' || target_table,
      target_table
    );
  END LOOP;
END $$;

-- Contact submissions remain available to anonymous visitors. Every other
-- contact policy is replaced with the admin-only one.
DO $$
DECLARE
  target_policy text;
BEGIN
  IF to_regclass('public.contact_messages') IS NULL THEN
    RETURN;
  END IF;

  ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

  FOR target_policy IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'contact_messages'
      AND policyname <> 'anon_insert_contact_messages'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.contact_messages', target_policy);
  END LOOP;

  DROP POLICY IF EXISTS "Portfolio admin can manage contact messages" ON public.contact_messages;
  CREATE POLICY "Portfolio admin can manage contact messages"
    ON public.contact_messages FOR ALL TO authenticated
    USING (public.is_portfolio_admin())
    WITH CHECK (public.is_portfolio_admin());
END $$;

-- Preserve public reads while limiting dashboard storage writes to the admin.
DO $$
DECLARE
  bucket text;
  target_policy text;
BEGIN
  FOREACH bucket IN ARRAY ARRAY['hero-images', 'seo-images', 'project-images']
  LOOP
    FOR target_policy IN
      SELECT policyname
      FROM pg_policies
      WHERE schemaname = 'storage'
        AND tablename = 'objects'
        AND cmd IN ('ALL', 'INSERT', 'UPDATE', 'DELETE')
        AND (COALESCE(qual, '') LIKE '%' || bucket || '%'
          OR COALESCE(with_check, '') LIKE '%' || bucket || '%')
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', target_policy);
    END LOOP;

    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', 'Portfolio admin can manage ' || bucket);
    EXECUTE format(
      'CREATE POLICY %I ON storage.objects FOR ALL TO authenticated USING (bucket_id = %L AND public.is_portfolio_admin()) WITH CHECK (bucket_id = %L AND public.is_portfolio_admin())',
      'Portfolio admin can manage ' || bucket,
      bucket,
      bucket
    );
  END LOOP;
END $$;
