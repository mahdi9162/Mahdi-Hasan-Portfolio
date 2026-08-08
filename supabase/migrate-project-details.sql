-- Keep full_description as the single active canonical description column.
-- short_description is retained only for historical compatibility and is no
-- longer written by the application.
ALTER TABLE IF EXISTS public.projects
  ALTER COLUMN short_description DROP NOT NULL;

-- Protect older rows that may only have a legacy short description before the
-- application begins reading the canonical field exclusively.
UPDATE public.projects
SET full_description = short_description
WHERE COALESCE(trim(full_description), '') = ''
  AND COALESCE(trim(short_description), '') <> '';

ALTER TABLE IF EXISTS public.projects
  ADD COLUMN IF NOT EXISTS project_year integer,
  ADD COLUMN IF NOT EXISTS project_context text,
  ADD COLUMN IF NOT EXISTS key_features text[] DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS gallery_images text[] DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS show_technical_highlights boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS technical_highlights text[] DEFAULT ARRAY[]::text[];

UPDATE public.projects
SET
  key_features = COALESCE(key_features, ARRAY[]::text[]),
  gallery_images = COALESCE(gallery_images, ARRAY[]::text[]),
  show_technical_highlights = COALESCE(show_technical_highlights, false),
  technical_highlights = COALESCE(technical_highlights, ARRAY[]::text[]);

ALTER TABLE IF EXISTS public.projects
  ALTER COLUMN key_features SET DEFAULT ARRAY[]::text[],
  ALTER COLUMN key_features SET NOT NULL,
  ALTER COLUMN gallery_images SET DEFAULT ARRAY[]::text[],
  ALTER COLUMN gallery_images SET NOT NULL,
  ALTER COLUMN show_technical_highlights SET DEFAULT false,
  ALTER COLUMN show_technical_highlights SET NOT NULL,
  ALTER COLUMN technical_highlights SET DEFAULT ARRAY[]::text[],
  ALTER COLUMN technical_highlights SET NOT NULL;

COMMENT ON COLUMN public.projects.full_description IS
  'Canonical project description used by the public browser and future View Project modal.';
COMMENT ON COLUMN public.projects.short_description IS
  'Deprecated legacy field retained for historical compatibility; no longer written by the application.';
