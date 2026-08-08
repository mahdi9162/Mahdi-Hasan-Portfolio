'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Container from '@/components/shared/Container'
import SectionHeader from '@/components/shared/SectionHeader'
import { EASE_OUT_QUART } from '@/lib/animations'
import { projects as fallbackProjects } from '@/data/projects'
import type { Project } from '@/types/project'
import { supabase } from '@/lib/supabase'

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

const getProjectSummary = (project: Project) => project.description || project.summary

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

            return {
              id: row.id,
              title: row.title,
              description: row.full_description ?? row.short_description ?? '',
              summary: row.short_description ?? '',
              tech: Array.isArray(row.tech_stack) ? row.tech_stack : [],
              image,
              liveUrl: row.live_url ?? '',
              sourceUrl: getOptionalUrl(row.github_url),
              classification: row.classification === 'production' || row.classification === 'personal'
                ? row.classification
                : 'personal',
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
                <div className="relative h-56 shrink-0 overflow-hidden rounded-t-xl bg-black/35 sm:h-72 lg:aspect-[16/6] lg:h-auto xl:aspect-[16/7]">
                  <Image
                    src={activeProject.image}
                    alt={`${activeProject.title} project screenshot`}
                    fill
                    priority
                    sizes="(max-width: 1023px) 100vw, (max-width: 1280px) 62vw, 760px"
                    className="object-cover object-top"
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
                  <p className="mt-2 text-sm text-white/60 sm:text-base">{activeProject.summary}</p>
                  <p className="mt-4 line-clamp-3 max-w-3xl text-sm leading-6 text-white/75 sm:text-[15px]">
                    {getProjectSummary(activeProject)}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2.5" aria-label="Technology preview">
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
                    <button
                      type="button"
                      disabled
                      title="Project details will be available soon"
                      className="inline-flex items-center rounded-md border border-white/[0.18] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/45 disabled:cursor-not-allowed"
                    >
                      View Project →
                    </button>
                    {displayedFilter === 'personal' && activeProject.sourceUrl && (
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
                          className={`border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold ${
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
                  className="projects-scrollbar flex gap-3 overflow-x-auto p-3 pb-4 sm:p-4 lg:min-h-0 lg:flex-1 lg:overflow-x-hidden lg:overflow-y-auto lg:overscroll-contain lg:flex-col"
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
                        className={`group relative flex w-52 shrink-0 gap-3 overflow-hidden rounded-lg border p-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold sm:w-60 lg:w-full lg:shrink ${
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
                          <span className="mt-0.5 block truncate text-xs text-white/45">{project.summary}</span>
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
    </section>
  )
}
