import type { EffectiveProjectSeo } from '@/lib/project-seo'
import { siteConfig } from '@/lib/seo'
import type { Project } from '@/types/project'

type JsonLdReference = {
  '@id': string
}

export interface ProjectCaseStudyWebPageNode {
  '@type': 'WebPage'
  '@id': string
  url: string
  name: string
  description: string
  image: string
  isPartOf: JsonLdReference
  mainEntity: JsonLdReference
}

export interface ProjectCaseStudyCreativeWorkNode {
  '@type': 'CreativeWork'
  '@id': string
  name: string
  description: string
  image: string
  mainEntityOfPage: JsonLdReference
  author: JsonLdReference
  publisher: JsonLdReference
}

export interface ProjectCaseStudyStructuredData {
  '@context': 'https://schema.org'
  '@graph': [ProjectCaseStudyWebPageNode, ProjectCaseStudyCreativeWorkNode]
}

// This graph describes Mahdi Hasan's portfolio case study, not the underlying
// product. Relationship, organization, role, and live URL fields deliberately
// remain visible-page attribution until more specific facts are stored.
export const buildProjectCaseStudyStructuredData = (
  project: Project,
  seo: EffectiveProjectSeo,
): ProjectCaseStudyStructuredData => {
  const webPageId = `${seo.canonicalUrl}#webpage`
  const caseStudyId = `${seo.canonicalUrl}#case-study`
  const personId = `${siteConfig.url}/#person`
  const websiteId = `${siteConfig.url}/#website`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': webPageId,
        url: seo.canonicalUrl,
        name: seo.effectiveTitle,
        description: seo.effectiveDescription,
        image: seo.effectiveImage,
        isPartOf: { '@id': websiteId },
        mainEntity: { '@id': caseStudyId },
      },
      {
        '@type': 'CreativeWork',
        '@id': caseStudyId,
        name: `${project.title} — Portfolio Case Study`,
        description: seo.effectiveDescription,
        image: seo.effectiveImage,
        mainEntityOfPage: { '@id': webPageId },
        author: { '@id': personId },
        publisher: { '@id': personId },
      },
    ],
  }
}
