-- Optional project metadata used by the public project browser and details modal.
-- Both fields remain nullable so existing project rows load without backfill.
ALTER TABLE IF EXISTS public.projects
  ADD COLUMN IF NOT EXISTS project_subtitle text,
  ADD COLUMN IF NOT EXISTS organization text;

COMMENT ON COLUMN public.projects.project_subtitle IS
  'Concise product-focused subtitle shown beneath the project title.';
COMMENT ON COLUMN public.projects.organization IS
  'Optional organization or company shown only in the View Project modal metadata.';
