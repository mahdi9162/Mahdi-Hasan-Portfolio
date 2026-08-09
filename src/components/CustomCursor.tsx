'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { createPortal } from 'react-dom'

const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isHoveringText, setIsHoveringText] = useState(false)
  const [isMagnetic, setIsMagnetic] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Framer Motion motion values for rendering without React state updates
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // Derived motion values for offsets
  const dotX = useTransform(cursorX, (val) => val - 4)
  const dotY = useTransform(cursorY, (val) => val - 4)
  const lensX = useTransform(cursorX, (val) => val - 24)
  const lensY = useTransform(cursorY, (val) => val - 24)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const fineHoverQuery = window.matchMedia('(any-hover: hover) and (any-pointer: fine)')
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let isCursorActive = false

    const canActivateCursor = () => fineHoverQuery.matches && !reducedMotionQuery.matches

    const deactivateCursor = () => {
      if (!isCursorActive) return

      isCursorActive = false
      document.body.classList.remove('custom-cursor-active')
      setIsVisible(false)
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || !canActivateCursor()) return

      // Initialize coordinates before rendering and hiding the native cursor.
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)

      if (!isCursorActive) {
        isCursorActive = true
        setIsVisible(true)
      }
    }

    // Document-level event delegation for text hover state detection
    // This replaces document.elementFromPoint and prevents layout reflows (thrashing)
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target) return
      
      const textTarget = target.closest('[data-lens="on"], h1, h2, h3, h4, h5, h6, p, a, button, li, span')
      setIsHoveringText(!!textTarget)
    }

    // Magnetic effect for interactive elements
    const handleMagneticHover = (e: Event) => {
      const target = e.currentTarget as HTMLElement
      const rect = target.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      setIsMagnetic(true)
      cursorX.set(centerX)
      cursorY.set(centerY)
    }

    const handleMagneticLeave = () => {
      setIsMagnetic(false)
    }

    const handleCapabilityChange = () => {
      if (!canActivateCursor()) deactivateCursor()
    }

    // Add event listeners. Pointer events confirm that an actual mouse is in use.
    document.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.addEventListener('mouseover', handleMouseOver, { passive: true })
    fineHoverQuery.addEventListener('change', handleCapabilityChange)
    reducedMotionQuery.addEventListener('change', handleCapabilityChange)

    // Magnetic elements
    const magneticElements = document.querySelectorAll('[data-magnetic]')
    magneticElements.forEach(el => {
      el.addEventListener('mouseenter', handleMagneticHover as EventListener, { passive: true })
      el.addEventListener('mouseleave', handleMagneticLeave as EventListener, { passive: true })
    })

    // Cleanup
    return () => {
      // Remove custom-cursor-active class on unmount or capability loss.
      document.body.classList.remove('custom-cursor-active')
      
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('mouseover', handleMouseOver)
      fineHoverQuery.removeEventListener('change', handleCapabilityChange)
      reducedMotionQuery.removeEventListener('change', handleCapabilityChange)
      
      magneticElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMagneticHover as EventListener)
        el.removeEventListener('mouseleave', handleMagneticLeave as EventListener)
      })
    }
  }, [cursorX, cursorY])

  useEffect(() => {
    if (!isVisible) return

    // This runs after the portal has rendered at the initialized pointer position.
    document.body.classList.add('custom-cursor-active')
    return () => document.body.classList.remove('custom-cursor-active')
  }, [isVisible])

  if (!isVisible || !isMounted) return null

  const cursorElements = (
    <>
      {/* Main cursor dot - polished lens highlight with 90-100% text readability */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none"
        style={{ 
          zIndex: 999999,
          // Very light translucency with subtle highlight - minimal opacity for readability
          background: isHoveringText 
            ? 'radial-gradient(circle at 40% 30%, rgb(207 174 82 / 0.25), rgb(207 174 82 / 0.15), rgb(207 174 82 / 0.05))'
            : 'radial-gradient(circle at 40% 30%, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
          // Subtle highlight effect without obstructing content
          boxShadow: isHoveringText 
            ? '0 0 4px rgb(207 174 82 / 0.2), inset 0 0 2px rgba(255, 255, 255, 0.4)'
            : '0 0 3px rgba(255, 255, 255, 0.2), inset 0 0 2px rgba(255, 255, 255, 0.5)',
          // Very subtle border for definition
          border: '0.25px solid rgba(255, 255, 255, 0.15)',
          x: dotX,
          y: dotY,
        }}
      />
      
      {/* Magnifying lens - enhances clarity, NO BLUR */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 rounded-full pointer-events-none"
        style={{ 
          zIndex: 999999,
          border: '1px solid rgb(207 174 82 / 0.55)',
          background: 'transparent',
          // Clarity filters only - NO BLUR to avoid haziness
          backdropFilter: 'contrast(1.4) brightness(1.2) saturate(1.3)',
          WebkitBackdropFilter: 'contrast(1.4) brightness(1.2) saturate(1.3)',
          boxShadow: '0 0 18px rgb(207 174 82 / 0.18)',
          x: lensX,
          y: lensY,
        }}
        animate={{
          scale: isHoveringText ? 1.6 : isMagnetic ? 1.3 : 1.0,
        }}
        transition={{
          scale: { duration: 0.7, ease: "easeOut" },
        }}
      />
    </>
  )

  // Render cursor directly to document.body using Portal
  return createPortal(cursorElements, document.body)
}

export default CustomCursor
