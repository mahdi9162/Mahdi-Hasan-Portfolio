'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ProfileImage = () => {
  return (
    <div 
      className="profile-image w-full h-80 sm:h-96 md:h-[500px] lg:h-screen relative overflow-hidden"
      style={{ 
        zIndex: 100, 
        opacity: 1, 
        visibility: 'visible',
        display: 'block',
        minHeight: '500px'
      }}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full h-full group"
        style={{ opacity: 1, visibility: 'visible', display: 'block' }}
      >
        <Image
          alt="Professional portrait of Mahdi Hasan"
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
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