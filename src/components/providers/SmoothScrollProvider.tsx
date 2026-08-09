'use client'

import { useEffect, useState } from 'react'
import Lenis from 'lenis'

interface SmoothScrollProviderProps {
  children: React.ReactNode
}

type ViewportMode = 'pending' | 'mobile' | 'desktop'

export const SmoothScrollProvider = ({ children }: SmoothScrollProviderProps) => {
  // Resolve the viewport only after mount so mobile never creates Lenis during
  // the shared hook's initial desktop-shaped render.
  const [viewportMode, setViewportMode] = useState<ViewportMode>('pending')

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const updateViewportMode = () => {
      const nextMode: ViewportMode = mediaQuery.matches ? 'mobile' : 'desktop'
      setViewportMode(currentMode => currentMode === nextMode ? currentMode : nextMode)
    }

    updateViewportMode()
    mediaQuery.addEventListener('change', updateViewportMode)

    return () => mediaQuery.removeEventListener('change', updateViewportMode)
  }, [])

  useEffect(() => {
    // Pending and mobile modes intentionally keep native scrolling untouched.
    if (viewportMode !== 'desktop') return

    const lenis = new Lenis({
      duration: 2.2, // Luxury slow timing
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth easeOut
      lerp: 0.04, // Very smooth, controlled
      smoothWheel: true,
      wheelMultiplier: 1.15, // Balanced mouse wheel sensitivity
      touchMultiplier: 1.1, // Controlled trackpad sensitivity
      infinite: false,
    })

    let animationFrameId: number

    function raf(time: number) {
      lenis.raf(time)
      animationFrameId = requestAnimationFrame(raf)
    }

    animationFrameId = requestAnimationFrame(raf)

    // Make lenis available globally for anchor scrolling
    ;(window as any).lenis = lenis

    return () => {
      cancelAnimationFrame(animationFrameId)
      lenis.destroy()
      ;(window as any).lenis = null
    }
  }, [viewportMode])

  return <>{children}</>
}
