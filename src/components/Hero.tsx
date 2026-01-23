'use client'

import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useEffect, useState } from 'react'
import { EASE_OUT } from '@/lib/animations'
import { useMobile } from '@/hooks/useMediaQueries'

/**
 * MOBILE TYPOGRAPHY SCALE PATTERN (Reusable across all sections):
 * 
 * Section Titles (H1):     text-3xl sm:text-4xl md:text-5xl lg:text-6xl
 * Section Subtitles (H2):  text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl  
 * Body Text (P):           text-sm sm:text-base md:text-lg
 * 
 * Spacing Pattern:
 * - Mobile: mt-3, mt-4, mt-6 (tighter)
 * - Desktop: md:mt-4, md:mt-6, md:mt-8 (original spacing)
 * 
 * Line Height Pattern:
 * - Mobile: leading-tight, leading-snug, leading-relaxed
 * - Desktop: md:leading-none, md:leading-tight, md:leading-relaxed
 */

interface HeroProps {
  entryRevealReady?: boolean
}

const Hero = ({ entryRevealReady = true }: HeroProps) => {
  // Use shared mobile detection hook for better performance
  const isMobile = useMobile()

  // Animation variants for staggered text reveal - optimized for mobile
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.04 : 0.08, // Faster stagger on mobile
        delayChildren: isMobile ? 0.08 : 0.15 // Shorter delay on mobile
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: isMobile ? 12 : 18 // Reduced movement on mobile
    },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: isMobile ? 0.3 : 0.6, // Faster on mobile
        ease: EASE_OUT
      }
    }
  }

  const subtitleVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: isMobile ? 8 : 14 // Reduced movement on mobile
    },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: isMobile ? 0.3 : 0.6, // Faster on mobile
        ease: EASE_OUT
      }
    }
  }

  const descriptionVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: isMobile ? 6 : 10 // Reduced movement on mobile
    },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: isMobile ? 0.3 : 0.6, // Faster on mobile
        ease: EASE_OUT
      }
    }
  }

  const buttonVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: isMobile ? 8 : 12, // Reduced movement on mobile
      scale: isMobile ? 1 : 0.98 // No scale on mobile
    },
    show: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: isMobile ? 0.3 : 0.6, // Faster on mobile
        ease: EASE_OUT
      }
    }
  }

  return (
    <motion.div 
      className="flex flex-col h-full justify-center pt-8 sm:pt-12 md:pt-24 pb-10 sm:pb-12 md:pb-24"
      variants={containerVariants}
      initial="hidden"
      animate={entryRevealReady ? "show" : "hidden"}
      transition={{
        duration: isMobile ? 0.4 : 0.6, // Faster on mobile
        ease: EASE_OUT
      }}
    >
      <div className="max-w-3xl text-center md:text-start md:max-w-[42ch] lg:max-w-3xl">
        {/* Hero Name - Staggered reveal */}
        <motion.div variants={itemVariants}>
          <h1 className="hero-heading text-3xl sm:text-4xl md:text-4xl lg:text-6xl tracking-tighter leading-tight md:leading-none text-neutral-900 dark:text-primary hover:text-brand-gold transition-all duration-300 cursor-pointer hover:drop-shadow-[0_0_20px_rgb(var(--brand-gold)_/_0.3)]" data-lens="on">
            MAHDI HASAN
          </h1>
        </motion.div>
        
        {/* Subheading - Staggered reveal */}
        <motion.div variants={subtitleVariants}>
          <h2 className="hero-subheading mt-3 md:mt-3 lg:mt-4 text-lg sm:text-xl md:text-xl lg:text-3xl xl:text-4xl tracking-tight leading-snug text-neutral-700 dark:text-neutral-300 hover:text-brand-gold-alt transition-all duration-300 cursor-pointer hover:drop-shadow-[0_0_15px_rgb(var(--brand-gold-alt)_/_0.25)]" data-lens="on">
            Junior Frontend Developer
          </h2>
        </motion.div>
        
        {/* Bio paragraph - Staggered reveal */}
        <motion.div variants={descriptionVariants}>
          <div className="hero-description mt-4 md:mt-4 lg:mt-6">
            <span className="inline-block text-xs sm:text-base md:text-base lg:text-lg leading-relaxed md:leading-relaxed text-neutral-600 dark:text-neutral-400 opacity-80 sm:opacity-70 hover:opacity-100 hover:text-neutral-100 dark:hover:text-neutral-50 transition-all duration-300 cursor-pointer max-w-[40ch] md:max-w-none" data-lens="on">
              Building responsive web applications with React, Next.js, and Tailwind CSS. Experienced in full-stack development using the MERN stack with a focus on clean code and user-centric design.
            </span>
          </div>
        </motion.div>

        {/* CTA Buttons - Pop in animation */}
        <motion.div 
          variants={buttonVariants}
          className="flex flex-col sm:flex-row md:flex-row items-stretch sm:items-center md:items-center gap-4 mt-6 md:mt-6 lg:mt-8"
        >
          {/* Primary CTA - Resume */}
          <motion.a
            href="/Mahdi_Hasan's_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 text-sm font-medium bg-brand-gold text-black rounded-md text-center sm:text-left min-w-[140px]"
            data-lens="on"
            whileHover={isMobile ? {} : { 
              scale: 1.05,
              backgroundColor: "rgb(184 152 74)",
              boxShadow: "0 0 25px rgb(207 174 82 / 0.4), 0 8px 32px rgb(207 174 82 / 0.2)"
            }}
            whileTap={{ scale: isMobile ? 0.98 : 0.95 }} // Lighter tap on mobile
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 10,
              duration: isMobile ? 0.4 : 0.8 // Faster on mobile
            }}
          >
            Download Resume
          </motion.a>
          
          {/* Secondary CTA - View Projects */}
          <motion.button 
            className="w-full sm:w-auto px-6 py-3 text-sm font-medium border-2 border-neutral-700 dark:border-neutral-300 text-neutral-800 dark:text-primary rounded-md bg-transparent min-w-[140px]"
            data-lens="on"
            onClick={() => {
              const element = document.getElementById('projects')
              if (element) {
                if ((window as any).lenis) {
                  ;(window as any).lenis.scrollTo(element, {
                    offset: -90,
                    duration: 2.0,
                    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                  })
                } else {
                  // Fallback to native scroll for mobile
                  const elementTop = element.offsetTop - 96 // Account for navbar height
                  window.scrollTo({
                    top: elementTop,
                    behavior: 'smooth'
                  })
                }
              }
            }}
            whileHover={isMobile ? {} : { 
              scale: 1.05,
              borderColor: "rgb(207 174 82)",
              color: "rgb(207 174 82)",
              boxShadow: "0 0 20px rgb(207 174 82 / 0.3), 0 6px 24px rgb(207 174 82 / 0.15)"
            }}
            whileTap={{ scale: isMobile ? 0.98 : 0.95 }} // Lighter tap on mobile
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 10,
              duration: isMobile ? 0.4 : 0.8 // Faster on mobile
            }}
          >
            View Projects
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Hero