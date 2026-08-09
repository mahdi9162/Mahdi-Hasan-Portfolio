'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { ProjectGalleryItem } from '@/types/project'

interface Props {
  projectTitle: string
  items: ProjectGalleryItem[]
  initialIndex: number
  onClose: () => void
}

export default function ProjectGalleryLightbox({ projectTitle, items, initialIndex, onClose }: Props) {
  const dialogRef = useRef<HTMLElement>(null)
  const [mounted, setMounted] = useState(false)
  const [activeIndex, setActiveIndex] = useState(() => Math.min(Math.max(initialIndex, 0), Math.max(items.length - 1, 0)))
  const activeItem = items[activeIndex]
  const hasCaption = Boolean(activeItem?.captionTitle || activeItem?.captionDescription)
  const imageMaxHeight = hasCaption ? 'max-h-[70dvh]' : 'max-h-[calc(90dvh-1rem)]'

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted || !activeItem) return

    const originalBodyOverflow = document.body.style.overflow
    const originalDocumentOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    requestAnimationFrame(() => dialogRef.current?.focus())

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key === 'ArrowLeft' && activeIndex > 0) {
        event.preventDefault()
        setActiveIndex(index => Math.max(0, index - 1))
        return
      }
      if (event.key === 'ArrowRight' && activeIndex < items.length - 1) {
        event.preventDefault()
        setActiveIndex(index => Math.min(items.length - 1, index + 1))
        return
      }
      if (event.key !== 'Tab') return

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), [tabindex]:not([tabindex="-1"])')
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
    }
  }, [activeIndex, activeItem, items.length, mounted, onClose])

  if (!mounted || !activeItem) return null

  return createPortal(
    <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-[1px]" role="presentation">
      <section
        ref={dialogRef}
        data-lenis-prevent
        role="dialog"
        aria-modal="true"
        aria-label={`${projectTitle} gallery image ${activeIndex + 1} of ${items.length}`}
        tabIndex={-1}
        onMouseDown={event => {
          if (event.target === event.currentTarget) onClose()
        }}
        className="relative flex h-full w-full items-center justify-center overscroll-contain p-4 focus:outline-none sm:p-8"
      >
        <span className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/[0.12] bg-black/55 px-2.5 py-1 font-mono text-xs text-white/55 sm:left-6 sm:top-6">
          {activeIndex + 1} / {items.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close image preview"
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.16] bg-black/65 text-white/70 transition-colors hover:border-white/35 hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold sm:right-6 sm:top-6"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setActiveIndex(index => Math.max(0, index - 1))}
              disabled={activeIndex === 0}
              aria-label="Previous gallery image"
              className="absolute left-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.16] bg-black/65 text-white/70 transition-colors hover:border-white/35 hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold disabled:cursor-not-allowed disabled:opacity-30 sm:left-6 sm:h-11 sm:w-11"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex(index => Math.min(items.length - 1, index + 1))}
              disabled={activeIndex === items.length - 1}
              aria-label="Next gallery image"
              className="absolute right-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.16] bg-black/65 text-white/70 transition-colors hover:border-white/35 hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold disabled:cursor-not-allowed disabled:opacity-30 sm:right-6 sm:h-11 sm:w-11"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </>
        )}

        <div className="w-full max-w-6xl">
          <div className={`flex ${imageMaxHeight} items-center justify-center overflow-hidden rounded-xl border border-white/[0.1] bg-black/45`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeItem.imageUrl}
              alt={activeItem.captionTitle || `${projectTitle} gallery image ${activeIndex + 1}`}
              className={`block ${imageMaxHeight} max-w-full object-contain`}
            />
          </div>
          {hasCaption && (
            <div className="mx-auto mt-3 max-w-4xl rounded-lg border border-white/[0.1] bg-[#11110f] px-4 py-3 sm:px-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-gold">{String(activeIndex + 1).padStart(2, '0')}</p>
              {activeItem.captionTitle && <p className="mt-1 text-sm font-medium text-white/85">{activeItem.captionTitle}</p>}
              {activeItem.captionDescription && <p className="mt-1 text-xs leading-5 text-white/55 sm:text-sm">{activeItem.captionDescription}</p>}
            </div>
          )}
        </div>
      </section>
    </div>,
    document.body
  )
}
