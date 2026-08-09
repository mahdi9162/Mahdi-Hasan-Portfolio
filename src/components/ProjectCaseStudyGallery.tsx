'use client'

import { useRef, useState } from 'react'
import { Eye } from 'lucide-react'
import ProjectGalleryLightbox from '@/components/ProjectGalleryLightbox'
import type { ProjectGalleryItem } from '@/types/project'

interface Props {
  projectTitle: string
  items: ProjectGalleryItem[]
}

export default function ProjectCaseStudyGallery({ projectTitle, items }: Props) {
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const closeLightbox = () => {
    const trigger = lightboxIndex === null ? null : triggerRefs.current[lightboxIndex]
    setLightboxIndex(null)
    requestAnimationFrame(() => trigger?.focus())
  }

  return (
    <>
      <section>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-gold">Project gallery</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          {items.map((item, index) => (
            <figure key={`${item.imageUrl}-${index}`} className="overflow-hidden rounded-xl border border-white/[0.1] bg-white/[0.025]">
              <button
                ref={element => { triggerRefs.current[index] = element }}
                type="button"
                onClick={() => setLightboxIndex(index)}
                aria-label={`Preview ${projectTitle} gallery image ${index + 1} of ${items.length}`}
                className="group relative block w-full cursor-zoom-in overflow-hidden text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-brand-gold"
              >
                <span className="relative block overflow-hidden bg-black/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt={item.captionTitle || `${projectTitle} screenshot ${index + 1}`} className="h-auto w-full object-contain transition-opacity duration-200 group-hover:opacity-90" />
                  <span className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-black/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 sm:flex">
                    <span className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-black/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                      <Eye className="h-4 w-4 text-brand-gold" aria-hidden="true" /> Preview
                    </span>
                  </span>
                  <span className="pointer-events-none absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.16] bg-black/65 text-brand-gold lg:hidden">
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </span>
              </button>
              {(item.captionTitle || item.captionDescription) && (
                <figcaption className="border-t border-white/[0.08] px-4 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-gold">{String(index + 1).padStart(2, '0')}</p>
                  {item.captionTitle && <p className="mt-1 text-sm font-medium text-white/85">{item.captionTitle}</p>}
                  {item.captionDescription && <p className="mt-1 text-xs leading-5 text-white/50">{item.captionDescription}</p>}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </section>

      {lightboxIndex !== null && (
        <ProjectGalleryLightbox
          projectTitle={projectTitle}
          items={items}
          initialIndex={lightboxIndex}
          onClose={closeLightbox}
        />
      )}
    </>
  )
}
