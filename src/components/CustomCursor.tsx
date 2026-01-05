'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isHoveringText, setIsHoveringText] = useState(false)
  const [isMagnetic, setIsMagnetic] = useState(false)

  useEffect(() => {
    // Hide cursor on mobile devices and touch devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    
    if (isMobile || isTouchDevice) return

    // Check if device supports hover
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!supportsHover) return

    setIsVisible(true)

    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX
      const mouseY = e.clientY
      setMousePosition({ x: mouseX, y: mouseY })

      // Reliable target detection using elementFromPoint
      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY)
      if (elementUnderMouse) {
        // Check if element or closest parent is a text target
        const textTarget = elementUnderMouse.closest('[data-lens="on"], h1, h2, h3, h4, h5, h6, p, a, button, li, span')
        setIsHoveringText(!!textTarget)
      } else {
        setIsHoveringText(false)
      }
    }

    // Magnetic effect for interactive elements
    const handleMagneticHover = (e: Event) => {
      const target = e.currentTarget as HTMLElement
      const rect = target.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      setIsMagnetic(true)
      setMousePosition({ x: centerX, y: centerY })
    }

    const handleMagneticLeave = () => {
      setIsMagnetic(false)
    }

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Magnetic elements
    const magneticElements = document.querySelectorAll('[data-magnetic]')
    magneticElements.forEach(el => {
      el.addEventListener('mouseenter', handleMagneticHover as EventListener, { passive: true })
      el.addEventListener('mouseleave', handleMagneticLeave as EventListener, { passive: true })
    })

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      
      magneticElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMagneticHover as EventListener)
        el.removeEventListener('mouseleave', handleMagneticLeave as EventListener)
      })
    }
  }, [])

  if (!isVisible) return null

  return (
    <>
      {/* Main cursor dot - polished lens highlight with 90-100% text readability */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none"
        style={{ 
          zIndex: 9999,
          // Very light translucency with subtle highlight - minimal opacity for readability
          background: isHoveringText 
            ? 'radial-gradient(circle at 40% 30%, rgba(207, 174, 82, 0.25), rgba(207, 174, 82, 0.15), rgba(207, 174, 82, 0.05))'
            : 'radial-gradient(circle at 40% 30%, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
          // Subtle highlight effect without obstructing content
          boxShadow: isHoveringText 
            ? '0 0 4px rgba(207, 174, 82, 0.2), inset 0 0 2px rgba(255, 255, 255, 0.4)'
            : '0 0 3px rgba(255, 255, 255, 0.2), inset 0 0 2px rgba(255, 255, 255, 0.5)',
          // Very subtle border for definition
          border: '0.25px solid rgba(255, 255, 255, 0.15)',
        }}
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
        }}
        transition={{
          x: { type: "tween", ease: "easeOut", duration: 0.1 },
          y: { type: "tween", ease: "easeOut", duration: 0.1 },
        }}
      />
      
      {/* Magnifying lens - enhances clarity, NO BLUR */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 rounded-full pointer-events-none"
        style={{ 
          zIndex: 9999,
          border: '1px solid rgba(207, 174, 82, 0.55)',
          background: 'transparent',
          // Clarity filters only - NO BLUR to avoid haziness
          backdropFilter: 'contrast(1.4) brightness(1.2) saturate(1.3)',
          WebkitBackdropFilter: 'contrast(1.4) brightness(1.2) saturate(1.3)',
          boxShadow: '0 0 18px rgba(207, 174, 82, 0.18)',
        }}
        animate={{
          x: mousePosition.x - 24,
          y: mousePosition.y - 24,
          scale: isHoveringText ? 1.6 : isMagnetic ? 1.3 : 1.0,
        }}
        transition={{
          x: { type: "tween", ease: "easeOut", duration: 0.1 },
          y: { type: "tween", ease: "easeOut", duration: 0.1 },
          scale: { duration: 0.7, ease: "easeOut" },
        }}
      />
    </>
  )
}

export default CustomCursor