-- SEO architecture Step 1: project-level attribution and future case-study
-- metadata. This is additive only; existing project rows remain unchanged.
ALTER TABLE IF EXISTS public.projects
  ADD COLUMN IF NOT EXISTS project_relationship text,
  ADD COLUMN IF NOT EXISTS my_role text,
  ADD COLUMN IF NOT EXISTS contribution_summary text,
  ADD COLUMN IF NOT EXISTS index_project_case_study boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text,
  ADD COLUMN IF NOT EXISTS seo_og_image_url text;

-- Existing rows must remain opt-in. This also protects databases where an
-- earlier manual version of the boolean column was nullable.
UPDATE public.projects
SET index_project_case_study = false
WHERE index_project_case_study IS NULL;

ALTER TABLE IF EXISTS public.projects
  ALTER COLUMN index_project_case_study SET DEFAULT false,
  ALTER COLUMN index_project_case_study SET NOT NULL;

-- Keep relationship structured without deriving it from classification,
-- project_context, or organization. NULL intentionally represents no manual
-- attribution selection yet.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'projects_project_relationship_check'
      AND conrelid = 'public.projects'::regclass
  ) THEN
    ALTER TABLE public.projects
      ADD CONSTRAINT projects_project_relationship_check
      CHECK (
        project_relationship IS NULL
        OR project_relationship IN (
          'personal',
          'team_company',
          'client',
          'owned_product',
          'co_owned_product'
        )
      );
  END IF;
END $$;

COMMENT ON COLUMN public.projects.project_relationship IS
  'Explicit attribution relationship: personal, team_company, client, owned_product, or co_owned_product.';
COMMENT ON COLUMN public.projects.my_role IS
  'Optional free-text description of Mahdi Hasan''s role on the project.';
COMMENT ON COLUMN public.projects.contribution_summary IS
  'Optional factual summary of Mahdi Hasan''s personal contribution, not the product feature list.';
COMMENT ON COLUMN public.projects.index_project_case_study IS
  'Explicit opt-in for future project case-study indexing and sitemap inclusion; no SEO output is changed by this field alone.';
COMMENT ON COLUMN public.projects.seo_title IS
  'Optional future project case-study title override.';
COMMENT ON COLUMN public.projects.seo_description IS
  'Optional future project case-study description override.';
COMMENT ON COLUMN public.projects.seo_og_image_url IS
  'Optional future project case-study social sharing image override.';
