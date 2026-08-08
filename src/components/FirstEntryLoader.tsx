'use client'

import { useEffect, useState } from 'react'

interface FirstEntryLoaderProps {
  onComplete: () => void
  onExitStart: () => void
}

const ACTIVE_DURATION = 1850
const SIGNATURE_HOLD_DURATION = 220
const DECONSTRUCTION_DURATION = 280
const APERTURE_RELEASE_DURATION = 520
const EXIT_DURATION = SIGNATURE_HOLD_DURATION + DECONSTRUCTION_DURATION + APERTURE_RELEASE_DURATION
const REDUCED_MOTION_DURATION = 420

const monogramStrokes = [
  { d: 'M16 76V24', threshold: 28 },
  { d: 'M16 24L33 52', threshold: 36 },
  { d: 'M33 52L48 24', threshold: 44 },
  { d: 'M48 24V76', threshold: 52 },
  { d: 'M59 24V76M84 24V76', threshold: 60 },
  { d: 'M59 50H84', threshold: 68 },
]

const getTimelineProgress = (elapsed: number) => {
  if (elapsed < 450) return (elapsed / 450) * 20
  if (elapsed < 1350) return 20 + ((elapsed - 450) / 900) * 58
  if (elapsed < 1650) return 78 + ((elapsed - 1350) / 300) * 17
  return Math.min(95 + ((elapsed - 1650) / 200) * 5, 100)
}

const FirstEntryLoader = ({ onComplete, onExitStart }: FirstEntryLoaderProps) => {
  const [progress, setProgress] = useState(0)
  const [exitPhase, setExitPhase] = useState<'active' | 'hold' | 'deconstruct' | 'release'>('active')
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
      setProgress(100)
      setExitPhase('release')
      onExitStart()

      const completionTimer = window.setTimeout(onComplete, REDUCED_MOTION_DURATION)
      return () => window.clearTimeout(completionTimer)
    }

    const activeDuration = prefersReducedMotion ? REDUCED_MOTION_DURATION : ACTIVE_DURATION
    const startedAt = performance.now()
    let animationFrame = 0

    const tick = (now: number) => {
      const elapsed = now - startedAt
      const nextProgress = prefersReducedMotion
        ? Math.min((elapsed / activeDuration) * 100, 100)
        : getTimelineProgress(elapsed)

      setProgress(Math.round(nextProgress))

      if (elapsed < activeDuration) {
        animationFrame = requestAnimationFrame(tick)
      } else {
        setProgress(100)
        setExitPhase('hold')
      }
    }

    animationFrame = requestAnimationFrame(tick)
    const deconstructionTimer = window.setTimeout(() => {
      setExitPhase('deconstruct')
    }, activeDuration + SIGNATURE_HOLD_DURATION)
    const releaseTimer = window.setTimeout(() => {
      setExitPhase('release')
      onExitStart()
    }, activeDuration + SIGNATURE_HOLD_DURATION + DECONSTRUCTION_DURATION)
    const completionTimer = window.setTimeout(onComplete, activeDuration + EXIT_DURATION)

    return () => {
      cancelAnimationFrame(animationFrame)
      window.clearTimeout(deconstructionTimer)
      window.clearTimeout(releaseTimer)
      window.clearTimeout(completionTimer)
    }
  }, [onComplete, onExitStart, prefersReducedMotion])

  const guidesVisible = prefersReducedMotion || progress >= 24
  const completedMark = prefersReducedMotion || progress >= 95
  const isDeconstructing = exitPhase === 'deconstruct'
  const isReleasing = exitPhase === 'release'
  const signatureMoment = !prefersReducedMotion && progress >= 95 && exitPhase === 'hold'

  return (
    <>
      <style>{`
        @keyframes aperture-grain {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.34; }
        }

        .aperture-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.58'/%3E%3C/svg%3E");
          animation: aperture-grain 2.4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .aperture-grain {
            animation: none;
          }
        }
      `}</style>

      <div
        className={`fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-[#050505] transition-opacity duration-[520ms] ${
          isReleasing ? 'pointer-events-auto opacity-0' : 'pointer-events-auto opacity-100'
        }`}
        role="status"
        aria-label="Initializing portfolio"
        aria-busy="true"
      >
        <div aria-hidden="true" className="aperture-grain pointer-events-none absolute inset-0 opacity-[0.075] mix-blend-soft-light" />

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {[19, 50, 81].map((left) => (
            <span
              key={left}
              className={`absolute top-[-12%] h-[124%] w-px origin-center bg-brand-gold/[0.11] transition-[opacity,transform,background-color] duration-[350ms] ${
                isReleasing ? 'scale-y-[1.28] bg-brand-gold/[0.17] opacity-100' : 'scale-y-100 opacity-75'
              }`}
              style={{ left: `${left}%` }}
            />
          ))}
        </div>

        <div className="relative flex h-[clamp(250px,42vw,360px)] w-[min(86vw,390px)] flex-col items-center justify-center">
          <div
            aria-hidden="true"
            className={`absolute left-1/2 top-1/2 h-px w-[76%] -translate-x-1/2 -translate-y-1/2 origin-center bg-brand-gold/35 transition-[opacity,transform] duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:w-[70%] ${
              guidesVisible && !isReleasing ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
            }`}
          />
          <div
            aria-hidden="true"
            className={`absolute left-1/2 top-1/2 h-[66%] w-px -translate-x-1/2 -translate-y-1/2 origin-center bg-brand-gold/30 transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:h-[72%] ${
              guidesVisible ? (isReleasing ? 'scale-y-[3] opacity-90' : 'scale-y-100 opacity-100') : 'scale-y-0 opacity-0'
            }`}
          />
          <div
            aria-hidden="true"
            className={`absolute left-[28%] top-[58%] hidden h-px w-[34%] -rotate-[31deg] origin-left bg-brand-gold/20 transition-[opacity,transform] duration-[800ms] sm:block ${
              guidesVisible && !isReleasing ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
            }`}
          />

          <div
            className={`relative z-10 h-[clamp(118px,34vw,145px)] w-[clamp(118px,34vw,145px)] transition-[opacity,transform] duration-[350ms] md:h-[clamp(150px,12vw,190px)] md:w-[clamp(150px,12vw,190px)] ${
              isReleasing ? 'scale-[1.68] opacity-0' : 'scale-100 opacity-100'
            }`}
          >
            <div className={`absolute inset-0 rounded-full border border-white/[0.07] bg-black shadow-[inset_0_0_34px_rgba(0,0,0,0.98),0_0_34px_rgba(212,175,55,0.07)] transition-[opacity,transform] duration-[520ms] ${isReleasing ? 'scale-[1.2] opacity-0' : ''}`} />
            <div className={`absolute inset-[8%] rounded-full border border-white/[0.055] transition-[opacity,transform] duration-[470ms] ${isReleasing ? 'scale-[1.38] opacity-0' : ''}`} />
            <div className={`absolute inset-[16%] rounded-full border border-black/90 shadow-[inset_0_0_28px_rgba(0,0,0,1)] transition-[opacity,transform] duration-[420ms] ${isReleasing ? 'scale-[1.55] opacity-0' : ''}`} />
            <div className="absolute inset-[25%] rounded-full bg-[#020202] shadow-[inset_0_0_22px_rgba(0,0,0,1)]" />

            <svg aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 200 200" fill="none">
              <defs>
                <filter id="aperture-sweep-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2.2" />
                </filter>
              </defs>
              <path
                d="M121 22 A82 82 0 0 1 177 83"
                stroke="rgba(212,175,55,0.24)"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#aperture-sweep-glow)"
                className="transition-[opacity,transform] duration-[520ms] ease-out"
                style={{ opacity: isReleasing ? 0 : 1, transformOrigin: '100px 100px', transform: `rotate(${progress * 1.15 - 24}deg) scale(${isReleasing ? 1.16 : 1})` }}
              />
              <path
                d="M121 22 A82 82 0 0 1 177 83"
                stroke="rgba(221,193,104,0.82)"
                strokeWidth="1.15"
                strokeLinecap="round"
                className="transition-[opacity,transform] duration-[520ms] ease-out"
                style={{ opacity: isReleasing ? 0 : 1, transformOrigin: '100px 100px', transform: `rotate(${progress * 1.15 - 24}deg) scale(${isReleasing ? 1.16 : 1})` }}
              />
            </svg>

            <svg aria-hidden="true" className="absolute inset-[23%] h-[54%] w-[54%]" viewBox="0 0 100 100" fill="none">
              <g stroke="rgba(245,244,238,0.94)" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
                {monogramStrokes.map((stroke, index) => (
                  <path
                    key={stroke.d}
                    d={stroke.d}
                    pathLength="1"
                    strokeDasharray="1"
                    strokeDashoffset={progress >= stroke.threshold || prefersReducedMotion ? '0' : '1'}
                    className="transition-[stroke-dashoffset,opacity,transform] duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{
                      opacity: isDeconstructing || isReleasing ? 0 : 1,
                      transitionDelay: isDeconstructing || isReleasing ? `${index * 36}ms` : '0ms',
                      transformBox: 'fill-box',
                      transformOrigin: 'center',
                      transform: isDeconstructing || isReleasing ? 'scaleX(1.08)' : 'scaleX(1)',
                    }}
                  />
                ))}
              </g>
              <g stroke="rgba(212,175,55,0.68)" strokeWidth="0.8" strokeLinecap="square">
                {monogramStrokes.map((stroke, index) => (
                  <path
                    key={`fragment-${stroke.d}`}
                    d={stroke.d}
                    pathLength="1"
                    strokeDasharray="0.38 0.62"
                    strokeDashoffset={isDeconstructing || isReleasing ? `${-index * 0.08}` : '1'}
                    className="transition-[stroke-dashoffset,opacity] duration-[280ms] ease-out"
                    style={{
                      opacity: isDeconstructing && !isReleasing ? 0.72 : 0,
                      transitionDelay: `${index * 36}ms`,
                    }}
                  />
                ))}
              </g>
              <path
                d="M48 24V76"
                stroke="rgba(212,175,55,0.62)"
                strokeWidth="0.8"
                strokeDasharray="14 38"
                strokeDashoffset={isDeconstructing ? '-52' : completedMark ? '0' : '14'}
                className="transition-[stroke-dashoffset,opacity] duration-[280ms]"
                style={{ opacity: isDeconstructing ? 0.9 : signatureMoment || prefersReducedMotion ? 0.7 : 0.2 }}
              />
            </svg>

          </div>

          <div className={`relative z-10 mt-5 flex flex-col items-center transition-opacity duration-300 ${isReleasing ? 'opacity-0' : 'opacity-100'}`}>
            <span className="font-mono text-[10px] font-medium tracking-[0.14em] text-brand-gold/85 sm:text-[11px]">
              {String(progress).padStart(2, '0')}%
            </span>
            <span className="mt-2 font-mono text-[9px] tracking-[0.2em] text-white/42 sm:text-[10px]">
              INITIALIZING PORTFOLIO
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default FirstEntryLoader
