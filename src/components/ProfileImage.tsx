'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface ProfileImageProps {
  animationReady?: boolean
}

const ProfileImage = ({ animationReady = true }: ProfileImageProps) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
  }, [])

  const imageVariants = {
    hidden: { 
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 1.04,
      filter: prefersReducedMotion ? 'blur(0px)' : 'blur(6px)'
    },
    visible: { 
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 1.2,
        delay: 0.3,
        ease: "easeOut"
      }
    }
  }

  return (
    <div 
      className="profile-image w-full h-[360px] sm:h-[420px] md:h-[520px] lg:h-screen relative overflow-visible lg:overflow-hidden"
      style={{ 
        zIndex: 100, 
        opacity: 1, 
        visibility: 'visible',
        display: 'block'
      }}
    >
      <motion.div
        variants={imageVariants}
        initial="hidden"
        animate={animationReady ? "visible" : "hidden"}
        whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full h-full group"
        style={{ opacity: 1, visibility: 'visible', display: 'block' }}
      >
        <Image
          alt="Professional portrait of Mahdi Hasan"
          className="w-full h-full object-contain lg:object-cover grayscale group-hover:grayscale-0 transition-all duration-300 ease-out"
          src="/formal_Img_org.webp"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 45vw"
          style={{ 
            zIndex: 50, 
            opacity: 1, 
            visibility: 'visible',
            display: 'block'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 dark:from-black/50 dark:via-transparent dark:to-black/20 pointer-events-none z-40" />
      </motion.div>
    </div>
  )
}

export default ProfileImage