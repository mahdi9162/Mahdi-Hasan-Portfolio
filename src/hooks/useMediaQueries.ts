'use client'

import { useState, useEffect } from 'react'

/**
 * Shared hook for mobile detection using matchMedia API
 * Replaces window resize-based checks to reduce rerenders on mobile
 * (mobile address bar show/hide triggers resize frequently)
 */
export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Use matchMedia for better performance and accuracy
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    
    // Set initial value
    setIsMobile(mediaQuery.matches)
    
    // Create handler for media query changes
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }
    
    // Add listener
    mediaQuery.addEventListener('change', handleChange)
    
    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return isMobile
}

/**
 * Shared hook for reduced motion detection
 * Centralizes accessibility preference handling
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches)
    
    // Create handler for media query changes
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    
    // Add listener
    mediaQuery.addEventListener('change', handleChange)
    
    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return prefersReducedMotion
}

/**
 * Combined hook for both mobile and reduced motion detection
 * Use when you need both values to avoid duplicate media queries
 */
export const useMediaPreferences = () => {
  const isMobile = useMobile()
  const prefersReducedMotion = useReducedMotion()
  
  return { isMobile, prefersReducedMotion }
}