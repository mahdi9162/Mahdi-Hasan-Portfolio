-- Convert the existing string-array highlights to structured JSON objects while
-- preserving every non-empty legacy highlight as { text, icon: null }.
ALTER TABLE IF EXISTS public.projects
  ALTER COLUMN technical_highlights DROP DEFAULT;

ALTER TABLE IF EXISTS public.projects
  ALTER COLUMN technical_highlights TYPE jsonb
  USING COALESCE(to_jsonb(technical_highlights), '[]'::jsonb);

UPDATE public.projects
SET technical_highlights = COALESCE(
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'text', btrim(item),
        'icon', NULL
      )
    )
    FROM jsonb_array_elements_text(technical_highlights) AS highlights(item)
    WHERE btrim(item) <> ''
  ),
  '[]'::jsonb
);

ALTER TABLE IF EXISTS public.projects
  ALTER COLUMN technical_highlights SET DEFAULT '[]'::jsonb,
  ALTER COLUMN technical_highlights SET NOT NULL;

COMMENT ON COLUMN public.projects.technical_highlights IS
  'Ordered technical-highlight objects: [{"text": string, "icon": curated_icon_key|null}].';
