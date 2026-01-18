'use client'

import { useState, useEffect } from 'react'

interface EntryLoaderProps {
  onComplete: () => void
}

const EntryLoader = ({ onComplete }: EntryLoaderProps) => {
  const [progress, setProgress] = useState(0)
  const [showDoorTransition, setShowDoorTransition] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    // Lock body scroll on mount
    document.body.style.overflow = 'hidden'
    
    return () => {
      // Restore body scroll on unmount
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    // Progress animation over 2.8 seconds (0 to 100%)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 3.57 // 100% over 2.8 seconds (3.57% every 100ms)
      })
    }, 100)

    // Start door transition after 2.8 seconds
    const doorTimer = setTimeout(() => {
      setShowDoorTransition(true)
      
      // Start exit sequence after door transition
      setTimeout(() => {
        setIsExiting(true)
        
        // Complete after fade-out
        setTimeout(() => {
          sessionStorage.setItem('entryLoaderSeen', '1')
          sessionStorage.setItem('welcomeShown', '1') // Mark welcome as shown
          onComplete()
        }, 400) // 400ms fade-out
      }, 800) // 800ms door transition (faster)
    }, 2800) // 2.8s total duration

    return () => {
      clearInterval(progressInterval)
      clearTimeout(doorTimer)
    }
  }, [onComplete])

  // Calculate stroke-dashoffset for ring (276 is circumference)
  const strokeDashoffset = 276 - (progress / 100) * 276

  return (
    <>
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes goldGlow {
          0%, 100% { 
            text-shadow: 0 0 20px rgb(212 175 55 / 0.6);
          }
          50% { 
            text-shadow: 0 0 40px rgb(212 175 55 / 0.9), 0 0 60px rgb(212 175 55 / 0.5);
          }
        }
        
        @keyframes lightSweep {
          0% { 
            background-position: -200% 0;
          }
          100% { 
            background-position: 200% 0;
          }
        }
        
        .gold-glow {
          animation: goldGlow 2s ease-in-out infinite;
        }
        
        .light-sweep {
          background: linear-gradient(
            90deg,
            transparent 0%,
            transparent 40%,
            rgba(212, 175, 55, 0.3) 50%,
            transparent 60%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: lightSweep 2s ease-in-out infinite;
          -webkit-background-clip: text;
          background-clip: text;
        }
        
        .gold-glow-disabled {
          text-shadow: 0 0 20px rgb(212 175 55 / 0.4);
        }
      `}</style>

      <div 
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden transition-opacity duration-400 ${
          isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Top Door Panel */}
        <div 
          className={`absolute top-0 left-0 w-full h-1/2 bg-zinc-950 border-b border-white/5 transition-transform duration-800 ${
            showDoorTransition ? '-translate-y-full' : 'translate-y-0'
          }`}
        />
        
        {/* Bottom Door Panel */}
        <div 
          className={`absolute bottom-0 left-0 w-full h-1/2 bg-zinc-950 border-t border-white/5 transition-transform duration-800 ${
            showDoorTransition ? 'translate-y-full' : 'translate-y-0'
          }`}
        />
        
        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* WELCOME Text */}
          <h1 className="text-[clamp(56px,10vw,120px)] md:text-9xl font-black text-white tracking-tighter leading-none mb-8">
            <span 
              className={`inline-block text-[#D4AF37] ${
                prefersReducedMotion ? 'gold-glow-disabled' : 'gold-glow'
              }`}
            >
              W
            </span>
            <span 
              className={prefersReducedMotion ? '' : 'light-sweep'}
            >
              ELCOME
            </span>
            <span className="text-[#D4AF37]">.</span>
          </h1>
          
          {/* Progress Ring */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              {/* Background ring */}
              <circle 
                cx="48" 
                cy="48" 
                r="44" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="transparent" 
                className="text-zinc-900"
              />
              {/* Progress ring */}
              <circle 
                cx="48" 
                cy="48" 
                r="44" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="transparent" 
                strokeDasharray="276" 
                strokeDashoffset={strokeDashoffset}
                className="text-[#D4AF37] transition-all duration-100 ease-linear"
                style={{
                  filter: 'drop-shadow(0 0 8px rgb(212 175 55 / 0.6))'
                }}
              />
            </svg>
            {/* Percentage Text */}
            <span className="absolute text-sm font-mono text-white">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default EntryLoader