import { cache } from 'react'
import { clientEnv } from '@/config/env.client'
import {
  isProjectRelationship,
  normalizeProjectGalleryItems,
  normalizeTechnicalHighlights,
  type Project,
} from '@/types/project'
import { isIndexableProjectCaseStudy } from '@/lib/project-indexing'

export interface ProjectSitemapEntry {
  slug: string
  updatedAt?: Date
}

const getOptionalUrl = (value: unknown): string | undefined => {
  if (typeof value !== 'string' || !value.trim()) return undefined

  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : undefined
  } catch {
    return undefined
  }
}

const getOptionalText = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value.trim() : null

const mapProjectRow = (row: Record<string, unknown>): Project | null => {
  const id = row.id
  const title = getOptionalText(row.title)
  const slug = getOptionalText(row.slug)
  const image = getOptionalText(row.image_url)

  if ((typeof id !== 'string' && typeof id !== 'number') || !title || !slug || !image) return null

  const sourceUrl = getOptionalUrl(row.github_url)
  const classification = row.classification === 'production' || row.classification === 'personal'
    ? row.classification
    : 'personal'

  return {
    id,
    title,
    slug,
    description: getOptionalText(row.full_description) ?? '',
    tech: Array.isArray(row.tech_stack) ? row.tech_stack.filter((item): item is string => typeof item === 'string') : [],
    image,
    liveUrl: getOptionalUrl(row.live_url) ?? '',
    sourceUrl,
    showViewProject: typeof row.show_view_project === 'boolean' ? row.show_view_project : true,
    showSource: typeof row.show_source === 'boolean' ? row.show_source : Boolean(sourceUrl),
    classification,
    sortOrder: typeof row.sort_order === 'number' ? row.sort_order : undefined,
    projectSubtitle: getOptionalText(row.project_subtitle),
    organization: getOptionalText(row.organization),
    year: typeof row.project_year === 'number' ? row.project_year : null,
    projectContext: getOptionalText(row.project_context),
    projectRelationship: isProjectRelationship(row.project_relationship) ? row.project_relationship : null,
    myRole: getOptionalText(row.my_role),
    contributionSummary: getOptionalText(row.contribution_summary),
    indexProjectCaseStudy: row.index_project_case_study === true,
    seoTitle: getOptionalText(row.seo_title),
    seoDescription: getOptionalText(row.seo_description),
    seoOgImageUrl: getOptionalText(row.seo_og_image_url),
    keyFeatures: Array.isArray(row.key_features) ? row.key_features.filter((item): item is string => typeof item === 'string') : [],
    galleryImages: normalizeProjectGalleryItems(row.gallery_items, row.gallery_images),
    showTechnicalHighlights: row.show_technical_highlights === true,
    technicalHighlights: normalizeTechnicalHighlights(row.technical_highlights),
    bullets: Array.isArray(row.bullets) ? row.bullets.filter((item): item is string => typeof item === 'string') : undefined,
    status: row.status === 'published' ? 'published' : 'draft',
  }
}

// React request memoization ensures generateMetadata and the page body share a
// single project lookup for a route render. The underlying fetch remains ISR
// cached for five minutes, matching the current homepage project fetch.
export const getPublishedProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  const normalizedSlug = slug.trim()
  if (!normalizedSlug) return null

  try {
    const url = new URL('/rest/v1/projects', clientEnv.supabaseUrl)
    url.searchParams.set('select', '*')
    url.searchParams.set('slug', `eq.${normalizedSlug}`)
    url.searchParams.set('status', 'eq.published')
    url.searchParams.set('limit', '1')

    const response = await fetch(url, {
      headers: {
        apikey: clientEnv.supabaseAnonKey,
        Authorization: `Bearer ${clientEnv.supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 },
    })

    if (!response.ok) return null
    const rows: unknown = await response.json()
    const row = Array.isArray(rows) && rows.length > 0 && rows[0] && typeof rows[0] === 'object'
      ? rows[0] as Record<string, unknown>
      : null

    return row ? mapProjectRow(row) : null
  } catch {
    return null
  }
})

const toValidDate = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

// Keep the sitemap query intentionally small: a published case-study URL only
// needs its slug and a database-managed modification timestamp.
export async function getIndexableProjectSitemapEntries(): Promise<ProjectSitemapEntry[]> {
  try {
    const url = new URL('/rest/v1/projects', clientEnv.supabaseUrl)
    url.searchParams.set('select', 'slug,updated_at,status,index_project_case_study')
    url.searchParams.set('status', 'eq.published')
    url.searchParams.set('index_project_case_study', 'eq.true')

    const response = await fetch(url, {
      headers: {
        apikey: clientEnv.supabaseAnonKey,
        Authorization: `Bearer ${clientEnv.supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 },
    })

    if (!response.ok) return []
    const rows: unknown = await response.json()
    if (!Array.isArray(rows)) return []

    return rows.flatMap((row): ProjectSitemapEntry[] => {
      if (!row || typeof row !== 'object') return []
      const candidate = row as Record<string, unknown>
      const slug = typeof candidate.slug === 'string' ? candidate.slug.trim() : ''
      if (!isIndexableProjectCaseStudy({
        slug,
        status: typeof candidate.status === 'string' ? candidate.status : null,
        indexProjectCaseStudy: candidate.index_project_case_study === true,
      })) return []

      const updatedAt = toValidDate(candidate.updated_at)
      return [{ slug, ...(updatedAt ? { updatedAt } : {}) }]
    })
  } catch {
    return []
  }
}
