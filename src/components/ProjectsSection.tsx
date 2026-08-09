'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Container from '@/components/shared/Container'
import SectionHeader from '@/components/shared/SectionHeader'
import { EASE_OUT_QUART } from '@/lib/animations'
import { projects as fallbackProjects } from '@/data/projects'
import { normalizeTechnicalHighlights, type Project } from '@/types/project'
import { supabase } from '@/lib/supabase'

const ProjectDetailsModal = dynamic(() => import('@/components/ProjectDetailsModal'), {
  ssr: false,
})

type ProjectFilter = 'production' | 'personal'

const getClassification = (project: Project): ProjectFilter => project.classification

const getOptionalUrl = (value: unknown): string | undefined => {
  if (typeof value !== 'string' || !value.trim()) return undefined

  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : undefined
  } catch {
    return undefined
  }
}

const getDefaultFilter = (projectList: Project[]): ProjectFilter =>
  projectList.some((project) => getClassification(project) === 'production')
    ? 'production'
    : projectList.some((project) => getClassification(project) === 'personal')
      ? 'personal'
      : 'production'

const getInitialProjectId = (projectList: Project[]) => {
  const filter = getDefaultFilter(projectList)
  return projectList.find((project) => getClassification(project) === filter)?.id ?? null
}

function MobileTechnologyPreview({ technologies }: { technologies: string[] }) {
  const measureRef = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState(0)
  const safeVisibleCount = Math.min(visibleCount, technologies.length)
  const remainingCount = technologies.length - safeVisibleCount

  useEffect(() => {
    const container = measureRef.current
    if (!container || technologies.length === 0) return

    const measure = () => {
      const availableWidth = container.clientWidth
      const techChips = Array.from(container.querySelectorAll<HTMLElement>('[data-mobile-tech-measure]'))
      const overflowChip = container.querySelector<HTMLElement>('[data-mobile-tech-overflow]')

      if (!availableWidth || techChips.length !== technologies.length || !overflowChip) return

      const gap = Number.parseFloat(window.getComputedStyle(container).columnGap) || 10
      const techWidths = techChips.map(chip => chip.offsetWidth)
      const overflowWidth = overflowChip.offsetWidth
      const fitsInTwoRows = (count: number) => {
        const widths = count === technologies.length
          ? techWidths.slice(0, count)
          : [...techWidths.slice(0, count), overflowWidth]
        let rows = 1
        let rowWidth = 0

        for (const width of widths) {
          if (rowWidth > 0 && rowWidth + gap + width > availableWidth) {
            rows += 1
            rowWidth = width
          } else {
            rowWidth += rowWidth > 0 ? gap + width : width
          }
        }

        return rows <= 2
      }

      let nextVisibleCount = 0
      for (let count = technologies.length; count >= 0; count -= 1) {
        if (fitsInTwoRows(count)) {
          nextVisibleCount = count
          break
        }
      }

      setVisibleCount(current => current === nextVisibleCount ? current : nextVisibleCount)
    }

    const frame = requestAnimationFrame(measure)
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(container)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
    }
  }, [technologies])

  if (technologies.length === 0) return null

  return (
    <div className="relative mt-5 sm:hidden" aria-label="Technology preview">
      <div className="flex max-h-[4.375rem] flex-wrap gap-2.5 overflow-hidden">
        {technologies.slice(0, safeVisibleCount).map(technology => (
          <span
            key={technology}
            className="rounded-md border border-white/[0.18] bg-black/20 px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-white/75"
          >
            {technology}
          </span>
        ))}
        {remainingCount > 0 && (
          <span
            className="rounded-md border border-brand-gold/40 bg-brand-gold/10 px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-brand-gold"
            aria-label={`${remainingCount} more technologies`}
          >
            +{remainingCount}
          </span>
        )}
      </div>

      <div ref={measureRef} aria-hidden="true" className="pointer-events-none invisible absolute inset-x-0 top-0 -z-10 flex flex-wrap gap-2.5">
        {technologies.map(technology => (
          <span
            key={technology}
            data-mobile-tech-measure
            className="rounded-md border border-white/[0.18] bg-black/20 px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-white/75"
          >
            {technology}
          </span>
        ))}
        <span
          data-mobile-tech-overflow
          className="rounded-md border border-brand-gold/40 bg-brand-gold/10 px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-brand-gold"
        >
          +{technologies.length}
        </span>
      </div>
    </div>
  )
}

export default function ProjectsSection({
  initialProjects,
  projectsFromSupabase = true,
}: {
  initialProjects?: Project[]
  projectsFromSupabase?: boolean
}) {
  const [projects, setProjects] = useState<Project[]>(() =>
    initialProjects?.length ? initialProjects : fallbackProjects.filter((project) => project.status === 'published')
  )
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>(() =>
    getDefaultFilter(initialProjects?.length ? initialProjects : fallbackProjects)
  )
  const [activeId, setActiveId] = useState<string | number | null>(() =>
    getInitialProjectId(initialProjects?.length ? initialProjects : fallbackProjects)
  )
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const viewProjectTriggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (initialProjects?.length || !projectsFromSupabase) return

    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('status', 'published')
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false })

        if (error || !data?.length) return

        const mapped = data
          .map((row): Project | null => {
            const image = row.image_url ?? row.image ?? ''
            if (!row.id || !row.title || !image) return null

            const sourceUrl = getOptionalUrl(row.github_url)
            return {
              id: row.id,
              title: row.title,
              description: row.full_description ?? '',
              tech: Array.isArray(row.tech_stack) ? row.tech_stack : [],
              image,
              liveUrl: getOptionalUrl(row.live_url) ?? '',
              sourceUrl,
              showViewProject: row.show_view_project ?? true,
              showSource: row.show_source ?? Boolean(sourceUrl),
              classification: row.classification === 'production' || row.classification === 'personal'
                ? row.classification
                : 'personal',
              projectSubtitle: typeof row.project_subtitle === 'string' && row.project_subtitle.trim()
                ? row.project_subtitle
                : null,
              organization: typeof row.organization === 'string' && row.organization.trim()
                ? row.organization
                : null,
              year: typeof row.project_year === 'number' ? row.project_year : null,
              projectContext: typeof row.project_context === 'string' && row.project_context.trim()
                ? row.project_context
                : null,
              keyFeatures: Array.isArray(row.key_features) ? row.key_features : [],
              galleryImages: Array.isArray(row.gallery_images) ? row.gallery_images : [],
              showTechnicalHighlights: row.show_technical_highlights ?? false,
              technicalHighlights: normalizeTechnicalHighlights(row.technical_highlights),
              bullets: Array.isArray(row.bullets) ? row.bullets : undefined,
              status: row.status ?? 'published',
            }
          })
          .filter((project): project is Project => project !== null)

        if (mapped.length) setProjects(mapped)
      } catch {
        // Keep the static project data when the remote project list is unavailable.
      }
    }

    fetchProjects()
  }, [initialProjects, projectsFromSupabase])

  const productionProjects = useMemo(
    () => projects.filter((project) => getClassification(project) === 'production'),
    [projects]
  )
  const personalProjects = useMemo(
    () => projects.filter((project) => getClassification(project) === 'personal'),
    [projects]
  )

  useEffect(() => {
    const nextFilter = productionProjects.length > 0
      ? 'production'
      : personalProjects.length > 0
        ? 'personal'
        : 'production'
    const nextProjects = nextFilter === 'production' ? productionProjects : personalProjects

    setActiveFilter(nextFilter)
    setActiveId(nextProjects[0]?.id ?? null)
  }, [projects, productionProjects, personalProjects])

  const displayedFilter = activeFilter === 'production' && productionProjects.length === 0 && personalProjects.length > 0
    ? 'personal'
    : activeFilter === 'personal' && personalProjects.length === 0 && productionProjects.length > 0
      ? 'production'
      : activeFilter

  const filteredProjects = useMemo(
    () => displayedFilter === 'production' ? productionProjects : personalProjects,
    [displayedFilter, productionProjects, personalProjects]
  )

  const activeProject = useMemo(
    () => filteredProjects.find((project) => project.id === activeId) ?? filteredProjects[0] ?? null,
    [activeId, filteredProjects]
  )

  useEffect(() => {
    if (activeProject && activeProject.id !== activeId) setActiveId(activeProject.id)
  }, [activeId, activeProject])

  const selectFilter = (filter: ProjectFilter) => {
    const nextProjects = filter === 'production' ? productionProjects : personalProjects
    if (nextProjects.length === 0) return

    setActiveFilter(filter)
    setActiveId((currentId) =>
      nextProjects.some((project) => project.id === currentId) ? currentId : nextProjects[0].id
    )
  }

  const techPreview = activeProject?.tech.slice(0, 5) ?? []
  const remainingTechCount = Math.max(0, (activeProject?.tech.length ?? 0) - techPreview.length)
  const closeProjectModal = useCallback(() => {
    setIsProjectModalOpen(false)
    requestAnimationFrame(() => viewProjectTriggerRef.current?.focus())
  }, [])

  return (
    <section
      id="projects"
      className="projects-section content-visibility-auto w-full bg-black/20 my-12 sm:my-16 md:my-0 md:pt-8 lg:pt-12 xl:pt-16 md:pb-20 lg:pb-28 xl:pb-32"
    >
      <Container>
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0.7, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.12, once: true }}
          transition={{ duration: 0.5, ease: EASE_OUT_QUART }}
        >
          <SectionHeader
            title="Projects"
            subtitle="Selected work across production systems and personal builds."
          />

          {activeProject ? (
            <div className="grid gap-5 lg:h-[clamp(38rem,73vh,44rem)] lg:grid-cols-[minmax(0,2fr)_minmax(19rem,1fr)] lg:items-stretch lg:gap-6">
              <motion.article
                key={activeProject.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: EASE_OUT_QUART }}
                className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-white/[0.12] bg-white/[0.035] lg:h-full"
              >
                <div className="relative aspect-[16/10] shrink-0 overflow-hidden rounded-t-xl bg-black/35 sm:h-72 sm:aspect-auto lg:aspect-[16/6] lg:h-auto xl:aspect-[16/7]">
                  <Image
                    src={activeProject.image}
                    alt={`${activeProject.title} project screenshot`}
                    fill
                    priority
                    sizes="(max-width: 1023px) 100vw, (max-width: 1280px) 62vw, 760px"
                    className="object-contain object-center sm:object-cover sm:object-top"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
                </div>

                <div className="p-5 sm:p-6 lg:p-7">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-gold sm:text-xs">
                    {displayedFilter === 'production' ? 'Production / team project' : 'Personal / demo project'}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold leading-tight text-white sm:text-3xl">
                    {activeProject.title}
                  </h3>
                  {activeProject.projectSubtitle?.trim() && (
                    <p className="mt-1.5 line-clamp-2 max-w-3xl text-sm font-medium leading-5 text-white/60 sm:truncate sm:text-[15px]">
                      {activeProject.projectSubtitle}
                    </p>
                  )}
                  <p className={`${activeProject.projectSubtitle?.trim() ? 'mt-3' : 'mt-4'} line-clamp-3 max-w-3xl text-sm leading-6 text-white/75 sm:text-[15px]`}>
                    {activeProject.description}
                  </p>

                  <MobileTechnologyPreview technologies={activeProject.tech} />

                  <div className="mt-5 hidden flex-wrap gap-2.5 sm:flex" aria-label="Technology preview">
                    {techPreview.map((technology) => (
                      <span
                        key={technology}
                        className="rounded-md border border-white/[0.18] bg-black/20 px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-white/75 sm:text-sm"
                      >
                        {technology}
                      </span>
                    ))}
                    {remainingTechCount > 0 && (
                      <span className="rounded-md border border-brand-gold/40 bg-brand-gold/10 px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-brand-gold sm:text-sm">
                        +{remainingTechCount}
                      </span>
                    )}
                  </div>

                  <div className="mt-7 flex flex-wrap items-center gap-3 lg:mt-8">
                    {activeProject.liveUrl && (
                      <a
                        href={activeProject.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-md border border-brand-gold bg-brand-gold px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-black hover:bg-brand-gold-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
                      >
                        Live Site ↗
                      </a>
                    )}
                    {activeProject.showViewProject && (
                      <button
                        ref={viewProjectTriggerRef}
                        type="button"
                        onClick={() => setIsProjectModalOpen(true)}
                        className="inline-flex items-center rounded-md border border-white/[0.18] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/70 hover:border-white/35 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
                      >
                        View Project →
                      </button>
                    )}
                    {activeProject.showSource && activeProject.sourceUrl && (
                      <a
                        href={activeProject.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium uppercase tracking-[0.12em] text-white/55 underline-offset-4 hover:text-brand-gold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
                      >
                        Source ↗
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>

              <aside className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-white/[0.12] bg-black/25 lg:h-full lg:self-stretch" aria-label="Project navigator">
                <div className="flex items-center justify-between gap-3 border-b border-white/[0.1] px-4 py-4 sm:px-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">Browse work</p>
                  <div className="flex gap-1" role="tablist" aria-label="Project filters">
                    {(['production', 'personal'] as const).map((filter) => {
                      const hasProjects = filter === 'production'
                        ? productionProjects.length > 0
                        : personalProjects.length > 0

                      return (
                        <button
                          key={filter}
                          type="button"
                          role="tab"
                          disabled={!hasProjects}
                          aria-selected={displayedFilter === filter}
                          aria-disabled={!hasProjects}
                          onClick={() => selectFilter(filter)}
                          className={`border rounded-lg px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold ${
                            displayedFilter === filter
                              ? 'border-brand-gold/60 bg-brand-gold/10 text-brand-gold'
                              : hasProjects
                                ? 'border-transparent text-white/45 hover:border-white/[0.14] hover:text-white/75'
                                : 'cursor-not-allowed border-transparent text-white/20'
                          }`}
                        >
                          {filter}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div
                  className="projects-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain p-3 pb-4 scroll-px-3 [-webkit-overflow-scrolling:touch] sm:snap-none sm:p-4 lg:min-h-0 lg:flex-1 lg:overflow-x-hidden lg:overflow-y-auto lg:overscroll-contain lg:flex-col"
                  role="tabpanel"
                  aria-label={`${displayedFilter} projects`}
                >
                  {filteredProjects.map((project, index) => {
                    const isActive = project.id === activeProject.id
                    return (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => setActiveId(project.id)}
                        aria-pressed={isActive}
                        className={`group relative flex w-[88%] shrink-0 snap-start gap-3 overflow-hidden rounded-lg border p-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold sm:w-60 sm:snap-none lg:w-full lg:shrink ${
                          isActive
                            ? 'border-brand-gold/60 bg-white/[0.075]'
                            : 'border-white/[0.08] bg-white/[0.025] hover:border-white/[0.2] hover:bg-white/[0.055]'
                        }`}
                      >
                        <span className={`absolute inset-y-0 left-0 w-px ${isActive ? 'bg-brand-gold' : 'bg-transparent'}`} />
                        <span className="relative block h-20 w-[40%] shrink-0 overflow-hidden bg-black/40 lg:h-[72px]">
                          <Image
                            src={project.image}
                            alt={`${project.title} thumbnail`}
                            fill
                            sizes="(max-width: 1023px) 96px, 120px"
                            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          />
                        </span>
                        <span className="min-w-0 self-center">
                          <span className={`block font-mono text-[10px] tracking-[0.14em] ${isActive ? 'text-brand-gold' : 'text-white/35'}`}>
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className={`mt-1 block truncate text-sm font-semibold ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                            {project.title}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-white/45">{project.projectSubtitle?.trim() || project.description}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </aside>
            </div>
          ) : (
            <div className="border border-white/[0.1] bg-white/[0.03] p-6 text-sm text-white/60">
              No {displayedFilter} projects are available yet.
            </div>
          )}
        </motion.div>
      </Container>
      {isProjectModalOpen && activeProject && (
        <ProjectDetailsModal
          project={activeProject}
          projects={filteredProjects}
          onProjectChange={setActiveId}
          onClose={closeProjectModal}
        />
      )}
    </section>
  )
}
