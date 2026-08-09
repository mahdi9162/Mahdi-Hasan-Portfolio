import type { ProjectRelationship } from '@/types/project'
import { isIndexableProjectCaseStudy } from '@/lib/project-indexing'

const PORTFOLIO_URL = 'https://thisismahdihasan.com'
const PORTFOLIO_OWNER = 'Mahdi Hasan'
const META_DESCRIPTION_LIMIT = 165

export type SeoValueSource = 'auto' | 'custom'
export type SeoImageSource = 'custom' | 'project' | 'global'

export interface ProjectSeoInput {
  title: string
  slug: string
  status?: 'published' | 'draft'
  description?: string | null
  imageUrl?: string | null
  projectSubtitle?: string | null
  organization?: string | null
  projectRelationship?: ProjectRelationship | null
  myRole?: string | null
  contributionSummary?: string | null
  indexProjectCaseStudy?: boolean
  seoTitle?: string | null
  seoDescription?: string | null
  seoOgImageUrl?: string | null
}

export interface EffectiveProjectSeo {
  effectiveTitle: string
  effectiveDescription: string
  effectiveImage: string
  canonicalUrl: string
  isIndexable: boolean
  titleSource: SeoValueSource
  descriptionSource: SeoValueSource
  imageSource: SeoImageSource
  relationshipLabel: string | null
  attributionIncomplete: boolean
}

const text = (value: string | null | undefined) => value?.trim() || ''

const sentence = (value: string) => {
  const normalized = value.trim().replace(/\s+/g, ' ')
  if (!normalized) return ''
  return /[.?!]$/.test(normalized) ? normalized : `${normalized}.`
}

const truncateMetaDescription = (value: string) => {
  if (value.length <= META_DESCRIPTION_LIMIT) return value

  const clipped = value.slice(0, META_DESCRIPTION_LIMIT - 1)
  const wordBoundary = clipped.lastIndexOf(' ')
  return `${(wordBoundary > 80 ? clipped.slice(0, wordBoundary) : clipped).trimEnd()}…`
}

const withRole = (role: string) => role ? ` as a ${role}` : ''

const ROLE_TO_WORK_TYPE: Record<string, string> = {
  'full-stack developer': 'Full-Stack Development',
  'backend developer': 'Backend Development',
  'frontend developer': 'Frontend Development',
  'mern stack developer': 'MERN Stack Development',
  'software developer': 'Software Development',
}

const getWorkType = (role: string) => ROLE_TO_WORK_TYPE[role.toLowerCase()] ?? null

const lowerCaseFirst = (value: string) => value ? `${value.charAt(0).toLowerCase()}${value.slice(1)}` : value

// Contribution summaries are written for the dashboard, so a small set of
// leading-verb normalizations keeps their reuse in a meta sentence natural
// without inventing or expanding on the stored work.
const getContributionClause = (value: string) => {
  const contribution = value.trim().replace(/[.?!]+$/, '')
  if (!contribution) return ''

  if (/^worked across (?:the )?platform on\s+/i.test(contribution)) {
    const details = contribution
      .replace(/^worked across (?:the )?platform on\s+/i, '')
      .replace(/managed domain workflows/gi, 'managed domains')
      .replace(/real-time vendor[–-]admin support chat/gi, 'real-time support chat')
    return `including ${details}`
  }
  if (/^worked on\s+/i.test(contribution)) {
    return `including ${contribution.replace(/^worked on\s+/i, '')}`
  }
  if (/^worked mainly on\s+/i.test(contribution)) {
    return `focused on ${contribution.replace(/^worked mainly on\s+/i, '')}`
  }
  if (/^(built|implemented|developed|integrated|added)\s+/i.test(contribution)) {
    const details = contribution
      .replace(/^(built|implemented|developed|integrated|added)\s+/i, '')
      .replace(/\band contributed to other\b/gi, 'and other')
      .replace(/\band contributed to\b/gi, 'and')
    return `focused on ${lowerCaseFirst(details)}`
  }
  if (/^(including|focused on|covering)\s+/i.test(contribution)) return contribution

  return `including ${lowerCaseFirst(contribution)}`
}

export const getProjectRelationshipLabel = (relationship: ProjectRelationship | null | undefined) => {
  switch (relationship) {
    case 'personal': return 'Personal / Self-built'
    case 'team_company': return 'Team / Company Project'
    case 'client': return 'Client Project'
    case 'owned_product': return 'Owned Product'
    case 'co_owned_product': return 'Co-owned Product'
    default: return null
  }
}

const getGeneratedTitle = (project: ProjectSeoInput, title: string) => {
  const role = text(project.myRole)
  const workType = getWorkType(role)

  switch (project.projectRelationship) {
    case 'team_company':
    case 'client':
      return workType
        ? `${title} – ${workType} Case Study | ${PORTFOLIO_OWNER}`
        : `${title} – Project Case Study | ${PORTFOLIO_OWNER}`
    case 'owned_product':
    case 'co_owned_product':
      return `${title} – Product Case Study | ${PORTFOLIO_OWNER}`
    default:
      return `${title} – Project Case Study | ${PORTFOLIO_OWNER}`
  }
}

const getGeneratedDescription = (project: ProjectSeoInput, title: string) => {
  const relationship = project.projectRelationship
  const role = text(project.myRole)
  const workType = getWorkType(role)
  const contribution = text(project.contributionSummary)
  const supportingProjectText = text(project.projectSubtitle) || text(project.description)
  const contributionClause = getContributionClause(contribution)
  const workPhrase = workType ? `${workType.toLowerCase()} work` : role ? 'project work' : 'work'

  let generated: string

  if (relationship === 'team_company' || relationship === 'client') {
    if (contributionClause) {
      generated = `A case study of ${PORTFOLIO_OWNER}'s ${workPhrase} on ${title}, ${contributionClause}.`
    } else {
      generated = `A case study of ${PORTFOLIO_OWNER}'s ${workPhrase} on ${title}${workType ? '' : withRole(role)}.`
    }
  } else if (relationship === 'owned_product') {
    generated = `A product case study covering ${PORTFOLIO_OWNER}'s work on ${title}${withRole(role)}. ${sentence(contribution || supportingProjectText)}`
  } else if (relationship === 'co_owned_product') {
    generated = `A co-owned product case study covering ${PORTFOLIO_OWNER}'s work on ${title}${withRole(role)}. ${sentence(contribution || supportingProjectText)}`
  } else {
    generated = `A personal project case study by ${PORTFOLIO_OWNER} covering ${title}${withRole(role)}. ${sentence(contribution || supportingProjectText)}`
  }

  return truncateMetaDescription(generated.replace(/\s+/g, ' ').trim())
}

const toAbsoluteUrl = (value: string) => {
  try {
    return new URL(value, PORTFOLIO_URL).toString()
  } catch {
    return `${PORTFOLIO_URL}/api/og-image`
  }
}

export const getEffectiveProjectSeo = (project: ProjectSeoInput): EffectiveProjectSeo => {
  const title = text(project.title) || 'Project'
  const slug = text(project.slug) || 'project'
  const customTitle = text(project.seoTitle)
  const customDescription = text(project.seoDescription)
  const customImage = text(project.seoOgImageUrl)
  const mainImage = text(project.imageUrl)
  const isContributorProject = project.projectRelationship === 'team_company' || project.projectRelationship === 'client'

  return {
    effectiveTitle: customTitle || getGeneratedTitle(project, title),
    effectiveDescription: customDescription || getGeneratedDescription(project, title),
    effectiveImage: toAbsoluteUrl(customImage || mainImage || '/api/og-image'),
    canonicalUrl: `${PORTFOLIO_URL}/projects/${encodeURIComponent(slug)}`,
    isIndexable: isIndexableProjectCaseStudy({
      slug: project.slug,
      status: project.status ?? 'draft',
      indexProjectCaseStudy: project.indexProjectCaseStudy,
    }),
    titleSource: customTitle ? 'custom' : 'auto',
    descriptionSource: customDescription ? 'custom' : 'auto',
    imageSource: customImage ? 'custom' : mainImage ? 'project' : 'global',
    relationshipLabel: getProjectRelationshipLabel(project.projectRelationship),
    attributionIncomplete: Boolean(
      project.indexProjectCaseStudy
      && isContributorProject
      && (!text(project.myRole) || !text(project.contributionSummary))
    ),
  }
}
