-- Add explicit per-project action controls without altering existing project data.
ALTER TABLE IF EXISTS public.projects
  ADD COLUMN IF NOT EXISTS show_view_project boolean;

ALTER TABLE IF EXISTS public.projects
  ADD COLUMN IF NOT EXISTS show_source boolean;

UPDATE public.projects
SET show_view_project = true
WHERE show_view_project IS NULL;

UPDATE public.projects
SET show_source = CASE
  WHEN trim(COALESCE(github_url, '')) ~* '^https?://[^[:space:]]+$' THEN true
  ELSE false
END
WHERE show_source IS NULL;

ALTER TABLE IF EXISTS public.projects
  ALTER COLUMN show_view_project SET DEFAULT true;

ALTER TABLE IF EXISTS public.projects
  ALTER COLUMN show_view_project SET NOT NULL;

ALTER TABLE IF EXISTS public.projects
  ALTER COLUMN show_source SET DEFAULT false;

ALTER TABLE IF EXISTS public.projects
  ALTER COLUMN show_source SET NOT NULL;
