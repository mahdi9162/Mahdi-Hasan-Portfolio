'use client'

import { useEffect, useState } from 'react'

interface ReloadShutterLoaderProps {
  onComplete: () => void
  onExitStart: () => void
}

const RELOAD_DURATION = 1100
const REDUCED_MOTION_DURATION = 380

type ReloadPhase = 'arrival' | 'aligned' | 'release'

const ReloadShutterLoader = ({ onComplete, onExitStart }: ReloadShutterLoaderProps) => {
  const [phase, setPhase] = useState<ReloadPhase>('arrival')
  const [showLabel, setShowLabel] = useState(false)
  const [isOverlayFading, setIsOverlayFading] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches)

    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      mediaQuery.removeEventListener('change', updatePreference)
      document.body.style.overflow = originalOverflow
    }
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) {
      setPhase('aligned')
      setShowLabel(true)
      const releaseTimer = window.setTimeout(() => {
        setPhase('release')
        onExitStart()
      }, 170)
      const overlayFadeTimer = window.setTimeout(() => setIsOverlayFading(true), 250)
      const completionTimer = window.setTimeout(onComplete, REDUCED_MOTION_DURATION)

      return () => {
        window.clearTimeout(releaseTimer)
        window.clearTimeout(overlayFadeTimer)
        window.clearTimeout(completionTimer)
      }
    }

    const arrivalTimer = window.setTimeout(() => setPhase('aligned'), 140)
    const labelTimer = window.setTimeout(() => setShowLabel(true), 450)
    const releaseTimer = window.setTimeout(() => {
      setPhase('release')
      onExitStart()
    }, 700)
    const overlayFadeTimer = window.setTimeout(() => setIsOverlayFading(true), 870)
    const completionTimer = window.setTimeout(onComplete, RELOAD_DURATION)

    return () => {
      window.clearTimeout(arrivalTimer)
      window.clearTimeout(labelTimer)
      window.clearTimeout(releaseTimer)
      window.clearTimeout(overlayFadeTimer)
      window.clearTimeout(completionTimer)
    }
  }, [onComplete, onExitStart, prefersReducedMotion])

  const isAligned = phase === 'aligned'
  const isReleasing = phase === 'release'
  const hasArrived = isAligned || isReleasing

  return (
    <div
      className={`fixed inset-0 z-[10000] overflow-hidden bg-[#050505] transition-opacity duration-[230ms] ease-out ${
        isOverlayFading ? 'pointer-events-auto opacity-0' : 'pointer-events-auto opacity-100'
      }`}
      role="status"
      aria-label="Re-syncing portfolio"
      aria-busy="true"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_46%,rgba(212,175,55,0.035),transparent_38%)]" />

      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[46%] h-11 w-full -translate-x-1/2 -translate-y-1/2 sm:h-[52px]">
        <div className="absolute left-1/2 top-0 z-10 h-px w-[58vw] -translate-x-1/2 sm:w-[42vw] md:w-[34vw]">
          <div
            className={`relative h-px w-full transition-[transform,opacity] duration-[300ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              hasArrived ? (isReleasing ? 'translate-x-[60vw] opacity-0' : 'translate-x-0 opacity-100') : 'translate-x-[90vw] opacity-0'
            }`}
          >
            <span className="absolute inset-x-0 -inset-y-[2px] bg-gradient-to-r from-transparent via-brand-gold/[0.20] to-transparent blur-[3px]" />
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/[0.60] to-transparent" />
          </div>
        </div>

        <div className="absolute left-1/2 top-1/2 z-20 h-px w-[72vw] -translate-x-1/2 sm:w-[62vw] md:w-[58vw] xl:w-[52vw]">
          <div
            className={`relative h-px w-full transition-transform duration-[300ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              hasArrived ? 'translate-x-0' : '-translate-x-[100vw]'
            }`}
          >
            <span
              className={`absolute right-1/2 top-0 h-px w-1/2 origin-right bg-gradient-to-l from-brand-gold/[0.95] via-brand-gold/[0.46] to-transparent transition-[transform,opacity] duration-[300ms] ease-out ${
                isReleasing ? '-translate-x-[60vw] opacity-0' : 'translate-x-0 opacity-100'
              }`}
            >
              <span className="absolute inset-x-0 -inset-y-[2px] bg-gradient-to-l from-brand-gold/[0.32] via-brand-gold/[0.12] to-transparent blur-[3px]" />
            </span>
            <span
              className={`absolute left-1/2 top-0 h-px w-1/2 origin-left bg-gradient-to-r from-brand-gold/[0.95] via-brand-gold/[0.46] to-transparent transition-[transform,opacity] duration-[300ms] ease-out ${
                isReleasing ? 'translate-x-[60vw] opacity-0' : 'translate-x-0 opacity-100'
              }`}
            >
              <span className="absolute inset-x-0 -inset-y-[2px] bg-gradient-to-r from-brand-gold/[0.32] via-brand-gold/[0.12] to-transparent blur-[3px]" />
            </span>
            <span className={`absolute left-1/2 top-0 h-px w-16 -translate-x-1/2 bg-brand-gold/[0.45] blur-[4px] transition-opacity duration-200 ${showLabel && isAligned ? 'opacity-100' : 'opacity-0'}`} />
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 z-10 h-px w-[48vw] -translate-x-1/2 sm:w-[36vw] md:w-[27vw]">
          <div
            className={`relative h-px w-full transition-[transform,opacity] duration-[300ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              hasArrived ? (isReleasing ? '-translate-x-[60vw] opacity-0' : 'translate-x-0 opacity-100') : '-translate-x-[90vw] opacity-0'
            }`}
          >
            <span className="absolute inset-x-0 -inset-y-[2px] bg-gradient-to-r from-transparent via-brand-gold/[0.17] to-transparent blur-[3px]" />
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/[0.52] to-transparent" />
          </div>
        </div>

        <span className="absolute left-1/2 top-[calc(100%+10px)] z-30 -translate-x-1/2 -translate-y-1/2 sm:top-[calc(100%+12px)]">
          <span
            className={`block font-mono text-[9px] font-medium tracking-[0.24em] text-brand-gold/85 transition-[opacity,transform] duration-[160ms] sm:text-[10px] ${
              showLabel && !isReleasing ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
            }`}
          >
            RE-SYNC
          </span>
        </span>
      </div>
    </div>
  )
}

export default ReloadShutterLoader
