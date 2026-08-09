-- Keep the established URL-only gallery column intact for compatibility.
-- Structured items add optional per-image captions without changing existing
-- galleries or requiring an unsafe conversion of gallery_images.
ALTER TABLE IF EXISTS public.projects
  ADD COLUMN IF NOT EXISTS gallery_items jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Backfill only empty new values. Existing URL ordering is preserved and every
-- migrated item starts caption-free, leaving the public gallery unchanged.
UPDATE public.projects
SET gallery_items = COALESCE(
  (
    SELECT jsonb_agg(jsonb_build_object('imageUrl', gallery.url) ORDER BY gallery.ordinality)
    FROM unnest(gallery_images) WITH ORDINALITY AS gallery(url, ordinality)
    WHERE COALESCE(trim(gallery.url), '') <> ''
  ),
  '[]'::jsonb
)
WHERE gallery_items = '[]'::jsonb
  AND COALESCE(array_length(gallery_images, 1), 0) > 0;

COMMENT ON COLUMN public.projects.gallery_items IS
  'Canonical ordered project gallery items: imageUrl plus optional captionTitle and captionDescription.';
