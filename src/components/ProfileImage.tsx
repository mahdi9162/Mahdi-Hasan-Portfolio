'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface ProfileImageProps {
  entryRevealReady?: boolean
}

const ProfileImage = ({ entryRevealReady = true }: ProfileImageProps) => {
  const imageVariants = {
    hidden: { 
      opacity: 0,
      filter: "blur(14px)",
      scale: 1.03
    },
    show: { 
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
      transition: {
        duration: 0.8,
        delay: 0.2,
        ease: [0.16, 1, 0.3, 1]
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
        className="relative w-full h-full group"
        variants={imageVariants}
        initial="hidden"
        animate={entryRevealReady ? "show" : "hidden"}
        whileHover={{ scale: 1.05 }}
        style={{ 
          opacity: 1, 
          visibility: 'visible', 
          display: 'block',
          // Fallback to ensure no permanent blur
          filter: entryRevealReady ? "blur(0px)" : undefined
        }}
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