'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

interface SmoothScrollProviderProps {
  children: React.ReactNode
}

export const SmoothScrollProvider = ({ children }: SmoothScrollProviderProps) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.2, // Luxury slow timing
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth easeOut
      lerp: 0.04, // Very smooth, controlled
      smoothWheel: true,
      wheelMultiplier: 0.6, // Slow, luxury feel
      touchMultiplier: 1.2,
      infinite: false,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Make lenis available globally for anchor scrolling
    ;(window as any).lenis = lenis

    return () => {
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}