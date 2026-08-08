'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import {
  Ban,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Database,
  Eye,
  ExternalLink,
  Gauge,
  Globe2,
  Layers3,
  Lock,
  MessagesSquare,
  Server,
  Shield,
  Sparkles,
  Workflow,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { normalizeTechnicalHighlights, type Project, type TechnicalHighlightIcon } from '@/types/project'

const HIGHLIGHT_ICONS: Record<TechnicalHighlightIcon, LucideIcon> = {
  shield: Shield,
  lock: Lock,
  database: Database,
  workflow: Workflow,
  globe: Globe2,
  messages: MessagesSquare,
  'credit-card': CreditCard,
  gauge: Gauge,
  layers: Layers3,
  server: Server,
  zap: Zap,
  sparkles: Sparkles,
}

const getHttpUrl = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) return undefined
  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : undefined
  } catch {
    return undefined
  }
}

const getImageUrl = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) return undefined
  const trimmed = value.trim()
  return trimmed.startsWith('/') ? trimmed : getHttpUrl(trimmed)
}

interface Props {
  project: Project
  projects: Project[]
  onProjectChange: (id: Project['id']) => void
  onClose: () => void
}

export default function ProjectDetailsModal({ project, projects, onProjectChange, onClose }: Props) {
  const dialogRef = useRef<HTMLElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const openedWithRef = useRef<HTMLElement | null>(null)
  const lightboxDialogRef = useRef<HTMLElement>(null)
  const galleryTriggerRefs = useRef<Array<HTMLButtonElement | null>>([])
  const lightboxOriginIndexRef = useRef(0)
  const [mounted, setMounted] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const lightboxOpenRef = useRef(false)
  lightboxOpenRef.current = lightboxIndex !== null
  const currentIndex = Math.max(0, projects.findIndex(item => item.id === project.id))
  const previousProject = currentIndex > 0 ? projects[currentIndex - 1] : null
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null
  const description = project.description?.trim()
  const technologies = useMemo(
    () => (Array.isArray(project.tech) ? project.tech : []).filter((item): item is string => typeof item === 'string' && Boolean(item.trim())),
    [project.tech]
  )
  const keyFeatures = useMemo(
    () => (Array.isArray(project.keyFeatures) ? project.keyFeatures : []).filter((item): item is string => typeof item === 'string' && Boolean(item.trim())),
    [project.keyFeatures]
  )
  const galleryImages = useMemo(
    () => (Array.isArray(project.galleryImages) ? project.galleryImages : []).map(getImageUrl).filter((item): item is string => Boolean(item)),
    [project.galleryImages]
  )
  const technicalHighlights = useMemo(
    () => project.showTechnicalHighlights ? normalizeTechnicalHighlights(project.technicalHighlights) : [],
    [project.showTechnicalHighlights, project.technicalHighlights]
  )
  const liveUrl = getHttpUrl(project.liveUrl)
  const sourceUrl = project.showSource ? getHttpUrl(project.sourceUrl) : undefined
  const heroImage = getImageUrl(project.image)
  const context = project.projectContext?.trim()
  const subtitle = project.projectSubtitle?.trim()
  const organization = project.organization?.trim()
  const projectMetadata = [organization, project.year].filter((value): value is string | number => Boolean(value))
  const eyebrow = [project.classification?.toUpperCase(), context?.toUpperCase()].filter(Boolean).join(' / ')
  const previewImage = lightboxIndex === null ? null : galleryImages[lightboxIndex] ?? null

  const openLightbox = (index: number) => {
    lightboxOriginIndexRef.current = index
    setLightboxIndex(index)
  }

  const closeLightbox = () => {
    const trigger = galleryTriggerRefs.current[lightboxOriginIndexRef.current]
    setLightboxIndex(null)
    requestAnimationFrame(() => trigger?.focus())
  }

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted) return
    openedWithRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const originalBodyOverflow = document.body.style.overflow
    const originalDocumentOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    requestAnimationFrame(() => dialogRef.current?.focus())

    const handleKeyDown = (event: KeyboardEvent) => {
      if (lightboxOpenRef.current) return
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalBodyOverflow
      document.documentElement.style.overflow = originalDocumentOverflow
      document.removeEventListener('keydown', handleKeyDown)
      openedWithRef.current?.focus()
    }
  }, [mounted, onClose])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }, [project.id])

  useEffect(() => {
    if (lightboxIndex === null || !previewImage) return

    requestAnimationFrame(() => lightboxDialogRef.current?.focus())

    const handleLightboxKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeLightbox()
        return
      }
      if (event.key === 'ArrowLeft' && lightboxIndex > 0) {
        event.preventDefault()
        setLightboxIndex(lightboxIndex - 1)
        return
      }
      if (event.key === 'ArrowRight' && lightboxIndex < galleryImages.length - 1) {
        event.preventDefault()
        setLightboxIndex(lightboxIndex + 1)
        return
      }
      if (event.key !== 'Tab') return

      const focusable = lightboxDialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), [tabindex]:not([tabindex="-1"])')
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleLightboxKeyDown)
    return () => document.removeEventListener('keydown', handleLightboxKeyDown)
  }, [galleryImages.length, lightboxIndex, previewImage])

  const galleryClass = galleryImages.length === 1
    ? 'grid-cols-1'
    : galleryImages.length === 2 || galleryImages.length === 4
      ? 'grid-cols-1 sm:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-2'

  if (!mounted) return null

  return createPortal(
    <>
      <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-3 backdrop-blur-[2px] sm:p-6"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-details-title"
        tabIndex={-1}
        onMouseDown={event => event.stopPropagation()}
        className="max-h-[92dvh] w-full max-w-[68rem] overflow-hidden rounded-2xl border border-white/[0.1] bg-[#12120f] shadow-[inset_0_1px_0_rgba(255,255,255,0.045),0_28px_72px_rgba(0,0,0,0.62)] focus:outline-none"
      >
        <div ref={scrollRef} data-lenis-prevent className="project-details-modal-scroll max-h-[92dvh] overflow-x-hidden overflow-y-auto overscroll-contain">
          <div className="space-y-8 p-5 sm:p-7 lg:p-8">
            <header className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                {eyebrow && <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-gold sm:text-xs">{eyebrow}</p>}
                <h2 id="project-details-title" className="mt-2 text-3xl font-semibold leading-tight text-white sm:text-4xl">{project.title}</h2>
                {subtitle && <p className="mt-1 text-xs leading-6 text-white/65 sm:text-lg">{subtitle}</p>}
                {projectMetadata.length > 0 && <p className="mt-2 font-mono text-xs text-white/45">{projectMetadata.join(' · ')}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close project details"
                className="mt-px inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.02] text-white/60 transition-colors hover:border-white/30 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </header>

            {heroImage && (
              <div className="relative aspect-[16/8] overflow-hidden rounded-xl border border-white/[0.1] bg-black/35">
                <Image
                  src={heroImage}
                  alt={`${project.title} project screenshot`}
                  fill
                  sizes="(max-width: 768px) 100vw, 1024px"
                  className="object-cover object-top"
                />
              </div>
            )}

            {description && (
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-white/85">Overview</h3>
                <p className="mt-3 max-w-4xl text-xs leading-5 md:leading-7 text-white/70 sm:text-base">{description}</p>
              </section>
            )}

            {keyFeatures.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-white/85">Key Features</h3>
                <div className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {keyFeatures.map((feature, index) => (
                    <div key={`${feature}-${index}`} className="flex gap-3 border-t border-white/[0.08] pt-3">
                      <span className="font-mono text-xs text-brand-gold">{String(index + 1).padStart(2, '0')}</span>
                      <p className="text-sm leading-6 text-white/70">{feature.trim()}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {technologies.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-white/85">Technology</h3>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {technologies.map(technology => (
                    <span key={technology} className="rounded-md border border-white/[0.16] bg-white/[0.04] px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-white/75 sm:text-sm">
                      {technology.trim()}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {technicalHighlights.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-white/85">Technical Highlights</h3>
                <div className="mt-4 space-y-3">
                  {technicalHighlights.map((highlight, index) => {
                    const Icon = highlight.icon ? HIGHLIGHT_ICONS[highlight.icon] : null
                    return (
                      <div key={`${highlight.text}-${index}`} className="flex items-start gap-3 text-xs md:text-sm leading-6 text-white/70">
                        {Icon ? (
                          <Icon className="mt-1 h-4 w-4 shrink-0 text-brand-gold" aria-hidden="true" />
                        ) : (
                          <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/[0.16] font-mono text-[10px] text-white/50">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        )}
                        <p>{highlight.text}</p>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {galleryImages.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-white/85">Project Gallery</h3>
                <div className={`mt-4 grid gap-3 ${galleryClass}`}>
                  {galleryImages.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      ref={element => { galleryTriggerRefs.current[index] = element }}
                      type="button"
                      onClick={() => openLightbox(index)}
                      aria-label={`Preview ${project.title} gallery image ${index + 1} of ${galleryImages.length}`}
                      className={`group relative block min-w-0 cursor-pointer overflow-hidden rounded-lg bg-white/[0.12] p-px text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold ${
                        galleryImages.length === 3 && index === 0 ? 'sm:row-span-2' : ''
                      }`}
                    >
                      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none">
                        <defs>
                          <filter id={`project-gallery-beam-glow-${index}`} x="-15%" y="-15%" width="130%" height="130%">
                            <feGaussianBlur stdDeviation="2.2" />
                          </filter>
                        </defs>
                        <rect
                          x="0.75"
                          y="0.75"
                          width="calc(100% - 1.5px)"
                          height="calc(100% - 1.5px)"
                          rx="7.25"
                          ry="7.25"
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.14)"
                          strokeWidth="1"
                          vectorEffect="non-scaling-stroke"
                        />
                        <rect
                          x="0.75"
                          y="0.75"
                          width="calc(100% - 1.5px)"
                          height="calc(100% - 1.5px)"
                          rx="7.25"
                          ry="7.25"
                          pathLength="100"
                          fill="none"
                          stroke="rgba(212, 175, 55, 0.6)"
                          strokeWidth="4"
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                          filter={`url(#project-gallery-beam-glow-${index})`}
                          className="project-gallery-border-beam opacity-35 transition-opacity duration-500 group-hover:opacity-50"
                          style={{ animationDelay: `${index * -3.25}s` }}
                        />
                        <rect
                          x="0.75"
                          y="0.75"
                          width="calc(100% - 1.5px)"
                          height="calc(100% - 1.5px)"
                          rx="7.25"
                          ry="7.25"
                          pathLength="100"
                          fill="none"
                          stroke="rgba(212, 175, 55, 0.82)"
                          strokeWidth="1.15"
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                          className="project-gallery-border-beam opacity-80 transition-opacity duration-500 group-hover:opacity-95"
                          style={{ animationDelay: `${index * -3.25}s` }}
                        />
                      </svg>
                      <span className="relative block overflow-hidden rounded-[7px] bg-black/45">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image} alt={`${project.title} gallery image ${index + 1}`} className="block h-auto w-full object-contain" />
                        <span className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:flex group-hover:opacity-100 group-focus-visible:flex group-focus-visible:opacity-100 sm:flex">
                          <span className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-black/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                            <Eye className="h-4 w-4 text-brand-gold" aria-hidden="true" /> Preview
                          </span>
                        </span>
                        <span className="pointer-events-none absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.16] bg-black/65 text-brand-gold sm:hidden">
                          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {(liveUrl || sourceUrl) && (
              <div className="flex flex-wrap gap-3 border-t border-white/[0.1] pt-6">
                {liveUrl && (
                  <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-brand-gold bg-brand-gold px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-black hover:bg-brand-gold-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold">
                    Live Site <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
                {sourceUrl && (
                  <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-white/[0.18] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/70 hover:border-white/35 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold">
                    Source <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
              </div>
            )}

            {projects.length > 1 && (
              <>
                {(previousProject || nextProject) && (
                  <nav className="flex gap-3 border-t border-white/[0.1] pt-5 sm:hidden" aria-label="Project navigation">
                    {previousProject && (
                      <button
                        type="button"
                        onClick={() => onProjectChange(previousProject.id)}
                        className="min-w-0 flex-1 rounded-lg border border-white/[0.12] px-3 py-2.5 text-left transition-colors hover:border-white/30 hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
                      >
                        <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-white/65"><ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous</span>
                        <span className="mt-0.5 block truncate text-xs text-white/45">{previousProject.title}</span>
                      </button>
                    )}
                    {nextProject && (
                      <button
                        type="button"
                        onClick={() => onProjectChange(nextProject.id)}
                        className="min-w-0 flex-1 rounded-lg border border-white/[0.12] px-3 py-2.5 text-right transition-colors hover:border-white/30 hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
                      >
                        <span className="flex items-center justify-end gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-white/65">Next <ChevronRight className="h-4 w-4" aria-hidden="true" /></span>
                        <span className="mt-0.5 block truncate text-xs text-white/45">{nextProject.title}</span>
                      </button>
                    )}
                  </nav>
                )}

                <nav className="hidden gap-3 border-t border-white/[0.1] pt-6 sm:grid sm:grid-cols-2" aria-label="Project navigation">
                  <button
                    type="button"
                    disabled={!previousProject}
                    onClick={() => previousProject && onProjectChange(previousProject.id)}
                    className="min-w-0 rounded-lg border border-white/[0.12] px-4 py-3 text-left transition-colors hover:border-white/30 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-white/65"><ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous Project</span>
                    <span className="mt-1 block truncate text-sm text-white/45">{previousProject?.title ?? 'Start of this project list'}</span>
                  </button>
                  <button
                    type="button"
                    disabled={!nextProject}
                    onClick={() => nextProject && onProjectChange(nextProject.id)}
                    className="min-w-0 rounded-lg border border-white/[0.12] px-4 py-3 text-right transition-colors hover:border-white/30 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <span className="flex items-center justify-end gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-white/65">Next Project <ChevronRight className="h-4 w-4" aria-hidden="true" /></span>
                    <span className="mt-1 block truncate text-sm text-white/45">{nextProject?.title ?? 'End of this project list'}</span>
                  </button>
                </nav>
              </>
            )}
          </div>
        </div>
      </section>
      </div>

      {previewImage && lightboxIndex !== null && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-[1px]" role="presentation">
          <section
            ref={lightboxDialogRef}
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} gallery image ${lightboxIndex + 1} of ${galleryImages.length}`}
            tabIndex={-1}
            onMouseDown={event => {
              if (event.target === event.currentTarget) closeLightbox()
            }}
            className="relative flex h-full w-full items-center justify-center overscroll-contain p-4 focus:outline-none sm:p-8"
          >
            <span className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/[0.12] bg-black/55 px-2.5 py-1 font-mono text-xs text-white/55 sm:left-6 sm:top-6">
              {lightboxIndex + 1} / {galleryImages.length}
            </span>
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close image preview"
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.16] bg-black/65 text-white/70 transition-colors hover:border-white/35 hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold sm:right-6 sm:top-6"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(index => index === null ? null : Math.max(0, index - 1))}
                  disabled={lightboxIndex === 0}
                  aria-label="Previous gallery image"
                  className="absolute left-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.16] bg-black/65 text-white/70 transition-colors hover:border-white/35 hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold disabled:cursor-not-allowed disabled:opacity-30 sm:left-6 sm:h-11 sm:w-11"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(index => index === null ? null : Math.min(galleryImages.length - 1, index + 1))}
                  disabled={lightboxIndex === galleryImages.length - 1}
                  aria-label="Next gallery image"
                  className="absolute right-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.16] bg-black/65 text-white/70 transition-colors hover:border-white/35 hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold disabled:cursor-not-allowed disabled:opacity-30 sm:right-6 sm:h-11 sm:w-11"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage}
              alt={`${project.title} gallery image ${lightboxIndex + 1}`}
              className="block max-h-[90dvh] max-w-[94vw] object-contain"
            />
          </section>
        </div>
      )}
    </>,
    document.body
  )
}
