-- sort_order remains the single ordering field, but is now normalized within
-- each project classification. Matching values in Production and Personal are
-- intentional and allow independent ordering in the dashboard.
WITH ranked_projects AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY classification
      ORDER BY
        CASE
          -- Preserve the explicitly intended current production sequence.
          WHEN classification = 'production' AND lower(slug) = 'biponiq' THEN 0
          WHEN classification = 'production' AND lower(slug) = 'feletrip' THEN 1
          ELSE 2
        END,
        sort_order ASC NULLS LAST,
        created_at ASC,
        id ASC
    ) - 1 AS next_sort_order
  FROM public.projects
  WHERE classification IN ('production', 'personal')
)
UPDATE public.projects AS projects
SET sort_order = ranked_projects.next_sort_order
FROM ranked_projects
WHERE projects.id = ranked_projects.id;
