import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Container from '@/components/shared/Container'
import ProjectCaseStudyGallery from '@/components/ProjectCaseStudyGallery'
import ProjectCaseStudyJsonLd from '@/components/ProjectCaseStudyJsonLd'
import { getEffectiveProjectSeo, getProjectRelationshipLabel } from '@/lib/project-seo'
import { buildProjectCaseStudyStructuredData } from '@/lib/project-structured-data'
import { getPublishedProjectBySlug } from '@/lib/projects.server'
import { siteConfig } from '@/lib/seo'

export const revalidate = 300

type RouteProps = {
  params: Promise<{ slug: string }>
}

const getProjectSeoInput = (project: Awaited<ReturnType<typeof getPublishedProjectBySlug>>) => {
  if (!project) return null

  return {
    title: project.title,
    slug: project.slug,
    status: project.status,
    description: project.description,
    imageUrl: project.image,
    projectSubtitle: project.projectSubtitle,
    organization: project.organization,
    projectRelationship: project.projectRelationship,
    myRole: project.myRole,
    contributionSummary: project.contributionSummary,
    indexProjectCaseStudy: project.indexProjectCaseStudy,
    seoTitle: project.seoTitle,
    seoDescription: project.seoDescription,
    seoOgImageUrl: project.seoOgImageUrl,
  }
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getPublishedProjectBySlug(slug)
  const seoInput = getProjectSeoInput(project)

  if (!project || !seoInput) {
    return {
      title: 'Project not found',
      robots: { index: false, follow: false },
    }
  }

  const seo = getEffectiveProjectSeo(seoInput)

  return {
    title: { absolute: seo.effectiveTitle },
    description: seo.effectiveDescription,
    alternates: { canonical: seo.canonicalUrl },
    robots: {
      index: seo.isIndexable,
      follow: true,
      googleBot: {
        index: seo.isIndexable,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    openGraph: {
      type: 'article',
      locale: siteConfig.locale,
      url: seo.canonicalUrl,
      siteName: siteConfig.applicationName,
      title: seo.effectiveTitle,
      description: seo.effectiveDescription,
      images: [
        {
          url: seo.effectiveImage,
          width: 1200,
          height: 630,
          alt: `${project.title} case study — ${siteConfig.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.effectiveTitle,
      description: seo.effectiveDescription,
      images: [seo.effectiveImage],
      creator: '@thisismahdix',
    },
  }
}

const relationshipIsContributionBased = (relationship: string | null | undefined) =>
  relationship === 'team_company' || relationship === 'client'

export default async function ProjectCaseStudyPage({ params }: RouteProps) {
  const { slug } = await params
  const project = await getPublishedProjectBySlug(slug)
  if (!project) notFound()

  const seo = getEffectiveProjectSeo(getProjectSeoInput(project)!)
  const relationshipLabel = getProjectRelationshipLabel(project.projectRelationship)
  const classificationLabel = project.classification === 'production' ? 'Production' : 'Personal'
  const hasKeyFeatures = project.keyFeatures.length > 0
  const hasTechnicalHighlights = project.showTechnicalHighlights && project.technicalHighlights.length > 0
  const structuredData = seo.isIndexable
    ? buildProjectCaseStudyStructuredData(project, seo)
    : null
  const attributionVisible = Boolean(
    project.projectRelationship
    || project.myRole
    || project.contributionSummary
    || project.organization
  )

  return (
    <>
      {structuredData && <ProjectCaseStudyJsonLd structuredData={structuredData} />}
      <main id="main-content" className="min-h-screen bg-[#060606] py-10 text-white sm:py-14 lg:py-20">
      <Container className="max-w-6xl">
        <Link
          href="/#projects"
          className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.14em] text-white/50 transition-colors hover:text-brand-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold"
        >
          ← Back to projects
        </Link>

        <header className="mt-8 border-b border-white/[0.1] pb-8 sm:mt-10 sm:pb-10">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] sm:text-xs">
            <span className="text-brand-gold">{classificationLabel}</span>
            {project.projectContext && <span className="text-white/40">/ {project.projectContext}</span>}
            {project.year && <span className="text-white/40">/ {project.year}</span>}
          </div>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            {project.title}
          </h1>
          {project.projectSubtitle && (
            <p className="mt-3 max-w-3xl text-lg leading-7 text-white/60 sm:text-xl">
              {project.projectSubtitle}
            </p>
          )}
          <p className="mt-5 max-w-3xl text-base leading-7 text-white/75 sm:text-lg">
            {project.description}
          </p>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex items-center rounded-md border border-brand-gold bg-brand-gold px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-black transition-colors hover:bg-brand-gold-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
            >
              Visit live site ↗
            </a>
          )}
        </header>

        <section className="mt-8 overflow-hidden rounded-xl border border-white/[0.12] bg-white/[0.025] sm:mt-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.image} alt={`${project.title} project screenshot`} className="h-auto w-full bg-black/30 object-contain" />
        </section>

        <div className="mt-8 grid items-stretch gap-5 xl:mt-10 xl:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.75fr)] xl:gap-8">
          <div className="flex h-full flex-col gap-5">
            {hasKeyFeatures && (
              <section className="rounded-xl border border-white/[0.1] bg-white/[0.025] p-5 sm:p-6 xl:flex-auto">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gold">Key features</p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {project.keyFeatures.map((feature) => (
                    <li key={feature} className="border-l border-brand-gold/55 pl-3 text-sm leading-6 text-white/70">
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {hasTechnicalHighlights && (
              <section className="rounded-xl border border-white/[0.1] bg-white/[0.025] p-5 sm:p-6 xl:flex-auto">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gold">Technical highlights</p>
                <ul className="mt-4 space-y-3">
                  {project.technicalHighlights.map((highlight, index) => (
                    <li key={`${highlight.text}-${index}`} className="flex gap-3 text-sm leading-6 text-white/70">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" aria-hidden="true" />
                      <span>{highlight.text}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

          </div>

          <aside className="rounded-xl border border-white/[0.1] bg-white/[0.025] p-5 sm:p-6 xl:h-full">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gold">Technology</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tech.map((technology) => (
                <span key={technology} className="rounded-md border border-white/[0.16] bg-black/20 px-2.5 py-1.5 font-mono text-xs uppercase tracking-wide text-white/70">
                  {technology}
                </span>
              ))}
            </div>

            {attributionVisible && (
              <section className="mt-7 border-t border-white/[0.1] pt-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gold">Project attribution</p>
                <dl className="mt-4 space-y-4">
                  {project.myRole && (
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">Role</dt>
                      <dd className="mt-1 text-sm text-white/80">{project.myRole}</dd>
                    </div>
                  )}
                  {relationshipLabel && (
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">Context</dt>
                      <dd className="mt-1 text-sm text-white/80">{relationshipLabel}</dd>
                    </div>
                  )}
                  {project.organization && (
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">Organization</dt>
                      <dd className="mt-1 text-sm text-white/80">{project.organization}</dd>
                    </div>
                  )}
                  {project.contributionSummary && (
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">Contribution</dt>
                      <dd className="mt-1 text-sm leading-6 text-white/70">{project.contributionSummary}</dd>
                    </div>
                  )}
                </dl>
                {relationshipIsContributionBased(project.projectRelationship) && !project.contributionSummary && (
                  <p className="mt-4 text-xs leading-5 text-white/45">This case study describes Mahdi Hasan&apos;s contribution to the project.</p>
                )}
              </section>
            )}
          </aside>
        </div>

        {project.galleryImages.length > 0 && (
          <div className="mt-10 xl:mt-12">
            <ProjectCaseStudyGallery projectTitle={project.title} items={project.galleryImages} />
          </div>
        )}

        {!seo.isIndexable && (
          <p className="sr-only">This published case-study page is intentionally marked noindex for search engines.</p>
        )}
      </Container>
      </main>
    </>
  )
}
