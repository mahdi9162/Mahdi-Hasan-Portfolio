-- Seed file: existing portfolio projects
-- Safe to run multiple times — conflicts on slug are handled with upsert.

INSERT INTO projects (
  slug,
  title,
  classification,
  short_description,
  full_description,
  image_url,
  live_url,
  github_url,
  tech_stack,
  bullets,
  status,
  sort_order
) VALUES
(
  'voyago',
  'Voyago',
  'personal',
  'Vehicle booking platform',
  'A modern vehicle booking platform that makes renting and managing cars simple—users can explore, book, and track rides, while hosts control listings and availability through a clean dashboard.',
  '/voyago.webp',
  'https://voyago-2805d.web.app',
  'https://github.com/mahdi9162/Voyago-Client-Side.git',
  ARRAY['React', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'Firebase'],
  NULL,
  'published',
  1
),
(
  'edubridge',
  'EduBridge',
  'personal',
  'Tuition management system',
  'A trust-focused tuition management system designed to keep tutors and students aligned—handling learning flow, tracking progress, and daily class coordination without unnecessary complexity.',
  '/edubridge.webp',
  'https://edubridge-production.web.app',
  'https://github.com/mahdi9162/EduBridge-Client-Side.git',
  ARRAY['React', 'Tailwind CSS', 'Firebase', 'Node.js', 'MongoDB'],
  NULL,
  'published',
  2
),
(
  'appverse',
  'AppVerse',
  'personal',
  'Productivity app explorer',
  'A sleek productivity app explorer where users can discover tools, view detailed insights, and manage installs instantly—built for smooth interaction, clarity, and speed.',
  '/appverse.webp',
  'https://appversee.netlify.app',
  'https://github.com/mahdi9162/AppVerse.git',
  ARRAY['React', 'Tailwind', 'JavaScript'],
  NULL,
  'published',
  3
),
(
  'skillora',
  'Skillora',
  'personal',
  'Skill-sharing platform',
  'A local 1-on-1 skill-sharing platform that connects learners with nearby mentors—making it easy to discover skills, schedule sessions, and learn in a more personal, real-world way.',
  '/skillora.webp',
  'https://skillora-505c9.web.app',
  'https://github.com/mahdi9162/Skillora.git',
  ARRAY['React', 'Tailwind CSS', 'Firebase', 'MongoDB', 'Express'],
  NULL,
  'published',
  4
)
ON CONFLICT (slug) DO UPDATE SET
  title            = EXCLUDED.title,
  classification   = EXCLUDED.classification,
  short_description = EXCLUDED.short_description,
  full_description = EXCLUDED.full_description,
  image_url        = EXCLUDED.image_url,
  live_url         = EXCLUDED.live_url,
  github_url       = EXCLUDED.github_url,
  tech_stack       = EXCLUDED.tech_stack,
  bullets          = EXCLUDED.bullets,
  status           = EXCLUDED.status,
  sort_order       = EXCLUDED.sort_order;
