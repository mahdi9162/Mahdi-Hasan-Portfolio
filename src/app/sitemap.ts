import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/seo'
import { getIndexableProjectSitemapEntries } from '@/lib/projects.server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getIndexableProjectSitemapEntries()

  return [
    {
      url:             `${siteConfig.url}/`,
      changeFrequency: 'monthly',
      priority:        1.0,
    },
    ...projects.map((project) => ({
      url: `${siteConfig.url}/projects/${encodeURIComponent(project.slug)}`,
      ...(project.updatedAt ? { lastModified: project.updatedAt } : {}),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
