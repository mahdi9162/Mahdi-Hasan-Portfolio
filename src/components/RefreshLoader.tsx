'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface RefreshLoaderProps {
  onComplete: () => void
}

const RefreshLoader = ({ onComplete }: RefreshLoaderProps) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Lock body scroll while loader is active
    document.body.style.overflow = 'hidden'
    
    // Minimum display time of 500ms, maximum of 1200ms
    const minTimer = setTimeout(() => {
      // Start fade out after minimum time
      setIsVisible(false)
      
      // Complete after fade out animation (200ms)
      setTimeout(() => {
        document.body.style.overflow = ''
        onComplete()
      }, 200)
    }, 700) // Show for 700ms total (500ms min + 200ms fade)

    return () => {
      clearTimeout(minTimer)
      document.body.style.overflow = ''
    }
  }, [onComplete])

  return (
    <>
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes spin-dot {
          0% { transform: translate(-30px, 0px) rotate(0deg); }
          25% { transform: translate(0px, -30px) rotate(90deg); }
          50% { transform: translate(30px, 0px) rotate(180deg); }
          75% { transform: translate(0px, 30px) rotate(270deg); }
          100% { transform: translate(-30px, 0px) rotate(360deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
        }
      `}</style>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
          >
            <div className="relative w-24 h-24 flex items-center justify-center">
              {/* Golden blurred orb with pulse */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/50 to-transparent md:blur-xl rounded-full"
                style={{ animation: 'pulse-slow 2s ease-in-out infinite' }}
              />
              
              {/* Orbiting golden dot */}
              <div 
                className="absolute w-6 h-6 rounded-full bg-[#D4AF37] shadow-[0_0_20px_#D4AF37]"
                style={{ 
                  animation: 'spin-dot 2s linear infinite',
                  willChange: 'transform'
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default RefreshLoader