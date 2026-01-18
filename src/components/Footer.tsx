'use client'

import { useEffect, useState } from 'react'

const Footer = () => {
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const dhakaTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(now)
      setCurrentTime(dhakaTime)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="section-gap bg-black px-6 md:px-8 overflow-hidden mt-28 pb-16 md:pb-12">
      <div className="max-w-7xl mx-auto relative">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-12 relative z-10">
          <div className="space-y-6 w-full md:w-auto">
            <div className="w-full overflow-visible">
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[12rem] font-black text-white leading-none tracking-tighter opacity-10 select-none text-center md:text-left max-w-full">
                MAHDI
              </h2>
            </div>
            <p className="text-zinc-500 max-w-sm text-sm md:text-lg">
              Thanks for stopping by. Let's turn ideas into clean, responsive UI.
            </p>
            
            {/* Status Pills - Compact & Subtle */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-white/3 border border-white/5 text-zinc-400 text-xs">
                Open to roles
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/3 border border-white/5 text-zinc-400 text-xs">
                Freelance available
              </span>
            </div>

            {/* Single Email Action */}
            <div className="mt-4">
              <a 
                href="mailto:hasanmahdi6060@gmail.com"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-zinc-300 transition-all hover:bg-primary/10 hover:border-primary/40 hover:text-white hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 text-sm font-medium"
                aria-label="Email Mahdi"
              >
                Email me
              </a>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-4">
            <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold">
              Local Time / Dhaka, BD
            </p>
            <p className="text-2xl font-medium text-white">
              <span className="text-emerald-500 mr-2 animate-pulse">●</span>
              {currentTime && (
                <span className="text-zinc-300 text-lg font-mono">
                  {currentTime}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-12"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 px-4 md:px-0">
          <p className="text-zinc-600 text-xs md:text-sm">
            © 2026 Mahdi Hasan. All rights reserved.
          </p>
          
          <div className="flex flex-wrap gap-x-6 gap-y-3 justify-center">
            <a 
              href="https://linkedin.com/in/your-profile" 
              target="_blank"
              rel="noreferrer"
              className="text-xs uppercase tracking-widest text-white/60 hover:text-primary hover:underline underline-offset-4 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
              data-lens="on"
            >
              LinkedIn
            </a>
            <a 
              href="https://github.com/your-username" 
              target="_blank"
              rel="noreferrer"
              className="text-xs uppercase tracking-widest text-white/60 hover:text-primary hover:underline underline-offset-4 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
              data-lens="on"
            >
              GitHub
            </a>
            <a 
              href="https://x.com/your-username" 
              target="_blank"
              rel="noreferrer"
              className="text-xs uppercase tracking-widest text-white/60 hover:text-primary hover:underline underline-offset-4 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
              data-lens="on"
            >
              X (Twitter)
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer