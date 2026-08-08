-- Make project type an explicit, validated field and remove the retired SwashPeak project.
ALTER TABLE IF EXISTS public.projects
  ADD COLUMN IF NOT EXISTS classification text;

UPDATE public.projects
SET classification = CASE
  WHEN category = 'client' THEN 'production'
  ELSE 'personal'
END
WHERE classification IS NULL
   OR classification NOT IN ('production', 'personal');

ALTER TABLE IF EXISTS public.projects
  ALTER COLUMN classification SET DEFAULT 'personal';

ALTER TABLE IF EXISTS public.projects
  ALTER COLUMN classification SET NOT NULL;

-- Keep the legacy column for a non-destructive rollout, but do not require or
-- populate it for new projects after classification has been backfilled.
ALTER TABLE IF EXISTS public.projects
  ALTER COLUMN category DROP NOT NULL;

ALTER TABLE IF EXISTS public.projects
  ALTER COLUMN category DROP DEFAULT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'projects_classification_check'
      AND conrelid = 'public.projects'::regclass
  ) THEN
    ALTER TABLE public.projects
      ADD CONSTRAINT projects_classification_check
      CHECK (classification IN ('production', 'personal'));
  END IF;
END $$;

DELETE FROM public.projects
WHERE slug = 'swashpeak-storefront-refresh';
