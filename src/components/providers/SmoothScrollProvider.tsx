'use client'

import { useEffect, useState } from 'react'
import Lenis from 'lenis'

interface SmoothScrollProviderProps {
  children: React.ReactNode
}

export const SmoothScrollProvider = ({ children }: SmoothScrollProviderProps) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Only initialize Lenis on desktop (md+)
    if (isMobile) {
      // Clear any existing Lenis instance
      if ((window as any).lenis) {
        ;(window as any).lenis.destroy()
        ;(window as any).lenis = null
      }
      return
    }

    const lenis = new Lenis({
      duration: 2.2, // Luxury slow timing
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth easeOut
      lerp: 0.04, // Very smooth, controlled
      smoothWheel: true,
      wheelMultiplier: 1.15, // Balanced mouse wheel sensitivity
      touchMultiplier: 1.1, // Controlled trackpad sensitivity
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
      ;(window as any).lenis = null
    }
  }, [isMobile])

  return <>{children}</>
}