'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import Container from '@/components/shared/Container'
import { EASE_OUT_QUART } from '@/lib/animations'

// ✅ Dynamic import for Work Summary Modal - only loads when needed
const WorkSummaryModal = dynamic(() => import('./WorkSummaryModal'), {
  ssr: false, // Don't render on server
  loading: () => null // No loading component needed
})

interface Project {
  id: number
  title: string
  description: string
  summary: string
  tech: string[]
  image: string
  liveUrl: string
  sourceUrl?: string
  category: 'frontend' | 'client'
  bullets?: string[]
}

const ProjectsSection = () => {
  // Mobile detection for optimized animations
  const [isMobile, setIsMobile] = useState(false)
  const [isMounted, setIsMounted] = useState(false) // Track component mount status
  
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])
  
  // Memoize the mobile check function to prevent recreation
  const checkMobile = useCallback(() => {
    if (!isMounted) return
    setIsMobile(window.innerWidth < 768)
  }, [isMounted])
  
  useEffect(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    return () => window.removeEventListener('resize', checkMobile)
  }, [checkMobile])

  // Memoize projects array to prevent recreation on every render
  const projects: Project[] = useMemo(() => [
    {
      id: 1,
      title: 'Voyago',
      description: 'A modern vehicle booking platform that makes renting and managing cars simple—users can explore, book, and track rides, while hosts control listings and availability through a clean dashboard.',
      summary: 'Vehicle booking platform',
      tech: ['React', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'Firebase'],
      image: '/voyago.webp',
      liveUrl: 'https://voyago-2805d.web.app',
      sourceUrl: 'https://github.com/mahdi9162/Voyago-Client-Side.git',
      category: 'frontend'
    },
    {
      id: 2,
      title: 'EduBridge',
      description: 'A trust-focused tuition management system designed to keep tutors and students aligned—handling learning flow, tracking progress, and daily class coordination without unnecessary complexity.',
      summary: 'Tuition management system',
      tech: ['React', 'Tailwind CSS', 'Firebase', 'Node.js', 'MongoDB'],
      image: '/edubridge.webp',
      liveUrl: 'https://edubridge-production.web.app',
      sourceUrl: 'https://github.com/mahdi9162/EduBridge-Client-Side.git',
      category: 'frontend'
    },
    {
      id: 3,
      title: 'AppVerse',
      description: 'A sleek productivity app explorer where users can discover tools, view detailed insights, and manage installs instantly—built for smooth interaction, clarity, and speed.',
      summary: 'Productivity app explorer',
      tech: ['React', 'Tailwind', 'JavaScript'],
      image: '/appverse.webp',
      liveUrl: 'https://appversee.netlify.app',
      sourceUrl: 'https://github.com/mahdi9162/AppVerse.git',
      category: 'frontend'
    },
    {
      id: 4,
      title: 'Skillora',
      description: 'A local 1-on-1 skill-sharing platform that connects learners with nearby mentors—making it easy to discover skills, schedule sessions, and learn in a more personal, real-world way.',
      summary: 'Skill-sharing platform',
      tech: ['React', 'Tailwind CSS', 'Firebase', 'MongoDB', 'Express'],
      image: '/skillora.webp',
      liveUrl: 'https://skillora-505c9.web.app',
      sourceUrl: 'https://github.com/mahdi9162/Skillora.git',
      category: 'frontend'
    },
    {
      id: 5,
      title: 'SwashPeak — Storefront UI Refresh (Client)',
      description: 'Frontend improvements shipped to a live storefront—navigation, responsive layout, and UI polish.',
      summary: 'E-commerce storefront redesign',
      tech: ['HTML', 'CSS', 'Responsive Layout', 'Theme Sections (Shopify)'],
      image: '/SwashPeak.webp',
      liveUrl: 'https://swashpeak.com/',
      category: 'client',
      bullets: [
        'Improved navigation + category structure so users can find products faster',
        'Made the storefront fully responsive across mobile/tablet/desktop',
        'Added modern sections + UI polish for a cleaner brand presentation'
      ]
    }
  ], [])

  const [activeTab, setActiveTab] = useState<'frontend' | 'client'>('frontend')
  const [activeId, setActiveId] = useState(projects.find(p => p.category === 'frontend')?.id || 1)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [showWorkSummary, setShowWorkSummary] = useState(false)
  const [scrollState, setScrollState] = useState({
    isAtTop: true,
    isAtBottom: false,
    canScrollUp: false,
    canScrollDown: true,
    scrollTop: 0,
    scrollHeight: 0,
    clientHeight: 0,
    thumbHeight: 0,
    thumbTop: 0
  })
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  // ✅ Memoize animation variants to prevent recreation on every render
  const containerVariants: Variants = useMemo(() => ({
    show: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { 
        duration: isMobile ? 0.4 : 0.6, 
        ease: EASE_OUT_QUART, 
        staggerChildren: 0.08, 
        delayChildren: 0 
      }
    },
    hide: { 
      // IMPORTANT: never fully hide the whole section
      opacity: 1,                 // was 0
      y: isMobile ? 20 : 8,       // Reduced y-offset on mobile
      filter: isMobile ? "blur(4px)" : "blur(2px)", // Reduced blur on mobile
      transition: { 
        duration: isMobile ? 0.4 : 0.35, 
        ease: EASE_OUT_QUART 
      }
    }
  }), [isMobile])

  const childVariants: Variants = useMemo(() => ({
    show: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { 
        duration: isMobile ? 0.4 : 0.6, 
        ease: EASE_OUT_QUART 
      }
    },
    hide: { 
      // IMPORTANT: also avoid vanishing children completely
      opacity: 0.65,              // was 0
      y: isMobile ? 20 : 10,      // Reduced y-offset on mobile
      filter: isMobile ? "blur(4px)" : "blur(3px)", // Reduced blur on mobile
      transition: { 
        duration: isMobile ? 0.4 : 0.35, 
        ease: EASE_OUT_QUART 
      }
    }
  }), [isMobile])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    // Add listener for media query changes
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      if (!isMounted) return
      setPrefersReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleMediaQueryChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange)
    }
  }, [isMounted])

  // Update active project when tab changes
  useEffect(() => {
    const filteredProjects = projects.filter(p => p.category === activeTab)
    if (filteredProjects.length > 0) {
      setActiveId(filteredProjects[0].id)
    }
  }, [activeTab, projects])

  // Wheel event handler for right column scroll - Projects tab only
  useEffect(() => {
    if (activeTab !== 'frontend' || !isMounted) return // Only apply to Projects tab
    
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const handleWheel = (e: WheelEvent) => {
      // Prevent state updates on unmounted component
      if (!isMounted) return
      
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer
      const isAtTop = scrollTop <= 1
      const isAtBottom = scrollTop >= scrollHeight - clientHeight - 1
      const deltaY = e.deltaY

      // Check if container can scroll in the wheel direction
      const canScrollUp = !isAtTop && deltaY < 0
      const canScrollDown = !isAtBottom && deltaY > 0

      // If container can scroll, prevent page scroll and let container scroll naturally
      if (canScrollUp || canScrollDown) {
        e.preventDefault()
        e.stopPropagation()
        // Let the container handle the scroll naturally
        scrollContainer.scrollBy({ top: deltaY, behavior: 'auto' })
      }
      // If at limits, allow page scroll (don't preventDefault)
    }

    // Add wheel listener to the scroll container with proper options
    scrollContainer.addEventListener('wheel', handleWheel, { passive: false, capture: true })

    return () => {
      scrollContainer.removeEventListener('wheel', handleWheel, true)
    }
  }, [activeTab, isMounted])

  // Filter projects by active tab - memoized to prevent recalculation
  const filteredProjects = useMemo(() => 
    projects.filter(p => p.category === activeTab), 
    [projects, activeTab]
  )
  
  const active = useMemo(() => 
    filteredProjects.find(p => p.id === activeId) || filteredProjects[0], 
    [filteredProjects, activeId]
  )
  
  const mini = useMemo(() => 
    filteredProjects.filter(p => p.id !== activeId), 
    [filteredProjects, activeId]
  )

  // Memoize click handler to prevent recreation
  const handleMiniClick = useCallback((id: number) => {
    if (!isMounted) return
    setActiveId(id)
  }, [isMounted])

  // Memoize scroll handler to prevent recreation
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (!isMounted) return
    
    const target = e.target as HTMLDivElement
    const { scrollTop, scrollHeight, clientHeight } = target
    
    const isAtTop = scrollTop <= 5
    const isAtBottom = scrollTop >= scrollHeight - clientHeight - 5
    
    // Calculate custom scrollbar dimensions with proper padding
    const contentHeight = scrollHeight
    const visibleHeight = clientHeight
    const scrollableHeight = Math.max(0, contentHeight - visibleHeight)
    
    const trackHeight = visibleHeight - 32 // Account for top/bottom padding (16px each)
    const thumbHeight = Math.max(16, (visibleHeight / contentHeight) * trackHeight)
    const thumbTop = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * (trackHeight - thumbHeight) : 0
    
    setScrollState({
      isAtTop,
      isAtBottom,
      canScrollUp: !isAtTop,
      canScrollDown: !isAtBottom,
      scrollTop,
      scrollHeight: contentHeight,
      clientHeight: visibleHeight,
      thumbHeight,
      thumbTop
    })
  }, [isMounted])

  // Memoize keyboard handler to prevent recreation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isMounted) return
    
    const target = e.target as HTMLDivElement
    
    switch (e.key) {
      case 'ArrowDown':
      case 'PageDown':
        e.preventDefault()
        target.scrollBy({ top: 100, behavior: 'smooth' })
        break
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault()
        target.scrollBy({ top: -100, behavior: 'smooth' })
        break
      case 'Home':
        e.preventDefault()
        target.scrollTo({ top: 0, behavior: 'smooth' })
        break
      case 'End':
        e.preventDefault()
        target.scrollTo({ top: target.scrollHeight, behavior: 'smooth' })
        break
    }
  }, [isMounted])

  return (
    <>
      <section id="projects" className="w-full bg-black/20 my-12 sm:my-16 md:my-0 md:pt-8 lg:pt-12 xl:pt-16 md:pb-20 lg:pb-28 xl:pb-32">
        <Container>
          <motion.div 
            ref={sectionRef}
            className="space-y-5 md:space-y-8 lg:space-y-10 relative z-10"
            variants={containerVariants}
            initial="hide"
            whileInView="show"
            viewport={{ amount: 0.1, margin: "-50px 0px", once: true }}
            style={{ willChange: "transform, opacity, filter" }}
          >
            {/* Header */}
            <motion.div 
              className="mb-8 md:mb-14 lg:mb-16 text-left scroll-mt-24 md:scroll-mt-28"
              variants={childVariants}
            >
              <div className="flex items-center gap-4 mb-3">
                <h2 
                  className="text-2xl md:text-5xl font-bold text-white uppercase tracking-[0.08em] hover:text-brand-gold-alt transition-all duration-300 cursor-pointer hover:drop-shadow-[0_0_15px_rgb(var(--brand-gold-alt)_/_0.25)]" 
                  data-lens="on"
                >
                  Projects
                </h2>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-white/20 to-transparent max-w-[140px]" />
              </div>
              <p className="text-xs md:text-lg text-white/70 max-w-[620px] leading-relaxed" data-lens="on">
                Showcase of my latest work and projects.
              </p>
            </motion.div>

            {/* Tab Navigation */}
            <motion.div 
              className="flex gap-1 md:gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/[0.08] w-fit"
              variants={childVariants}
            >
              <button
                onClick={() => setActiveTab('frontend')}
                className={`py-2 px-4 md:py-3 md:px-6 rounded-lg font-medium text-sm transition-all duration-300 ${
                  activeTab === 'frontend'
                    ? 'bg-brand-gold text-black shadow-md'
                    : 'text-white/70 hover:text-white/90 hover:bg-white/[0.06]'
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setActiveTab('client')}
                className={`py-2 px-4 md:py-3 md:px-6 rounded-lg font-medium text-sm transition-all duration-300 ${
                  activeTab === 'client'
                    ? 'bg-brand-gold text-black shadow-md'
                    : 'text-white/70 hover:text-white/90 hover:bg-white/[0.06]'
                }`}
              >
                Client Work
              </button>
            </motion.div>

            {/* Main Layout - Animated Tab Content */}
            <motion.div
              variants={childVariants}
              style={{ willChange: "transform, opacity, filter" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ 
                    duration: 0.24, 
                    ease: EASE_OUT_QUART 
                  }}
                  className="min-h-0 lg:min-h-[600px]" // Stable height to prevent layout jump
                >
                {activeTab === 'client' && filteredProjects.length === 1 ? (
                  /* Client Work: Premium Top Media + Bottom Content Card */
                  <div className="max-w-4xl mx-auto">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={active.id}
                        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                        transition={{ duration: 0.3, ease: EASE_OUT_QUART }}
                        className="bg-white/[0.05] border border-white/[0.14] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.35)] md:backdrop-blur-sm overflow-hidden"
                      >
                        {/* Top: Hero Image */}
                        <div className="relative h-[240px] md:h-[280px] overflow-hidden p-3 md:p-0 bg-black/30 md:bg-transparent">
                          <Image
                            src={active.image}
                            alt={`${active.title} project preview`}
                            fill
                            priority={true} // ✅ LCP optimization - loads immediately
                            className="object-contain md:object-cover object-center md:object-[50%_20%]"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px" // ✅ Optimized sizes
                          />
                          
                          {/* Mobile: Single Consistent Overlay */}
                          <div className="md:hidden absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/25 pointer-events-none"></div>
                          
                          {/* Mobile: Subtle Glass Haze */}
                          <div className="md:hidden absolute inset-0 bg-white/5 pointer-events-none"></div>
                          
                          {/* Desktop: Lighter gradient overlay for crispness */}
                          <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 via-60% to-transparent" />
                          
                          {/* Client Work Badge */}
                          <div className="absolute top-4 left-4 z-10">
                            <span className="px-3 py-1.5 bg-black/60 md:backdrop-blur-sm text-brand-gold text-xs font-medium rounded-full border border-brand-gold/30">
                              Client Work
                            </span>
                          </div>
                        </div>

                        {/* Bottom: Content Area - 2 Column Layout */}
                        <div className="p-6 md:p-8">
                          <div className="grid md:grid-cols-5 gap-6 md:gap-8">
                            {/* Left Column - 60% (3/5) */}
                            <div className="md:col-span-3 space-y-6 min-w-0">
                              {/* Title & Subtitle */}
                              <div>
                                <h3 className="text-xl md:text-2xl lg:text-3xl text-white font-semibold tracking-tight leading-[1.25] md:leading-[1.2] lg:leading-[1.15] mb-3" data-lens="on">
                                  {active.title}
                                </h3>
                                <p className="text-sm md:text-base text-white/70 leading-relaxed mb-6" data-lens="on">
                                  {active.description}
                                </p>
                              </div>

                              {/* Key Deliverables */}
                              {active.bullets && (
                                <div>
                                  <h4 className="text-sm font-semibold text-white/85 tracking-wide mb-3" data-lens="on">
                                    Key Deliverables
                                  </h4>
                                  <ul className="space-y-3">
                                    {active.bullets.map((bullet, index) => (
                                      <li key={index} className="flex items-start gap-3" data-lens="on">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/70 mt-2 flex-shrink-0" />
                                        <span className="text-sm text-white/70 leading-[1.65]">
                                          {bullet}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            {/* Right Column - 40% (2/5) - Constrained Container */}
                            <div className="md:col-span-2 min-w-0 flex flex-col gap-6">
                              {/* Tech Stack */}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-white/85 tracking-wide mb-3" data-lens="on">
                                  Technologies
                                </h4>
                                <div className="flex flex-col gap-3 w-full min-w-0">
                                  {active.tech.map((tech) => (
                                    <div 
                                      key={tech}
                                      className="w-full bg-white/[0.08] text-white/75 rounded-full text-xs font-medium border border-white/[0.12] flex items-center justify-center text-center overflow-hidden py-2 px-4"
                                      style={{ 
                                        whiteSpace: 'normal',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        lineHeight: '1.2',
                                        minHeight: '32px'
                                      }}
                                      title={tech}
                                    >
                                      {tech}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex-1 min-w-0 mt-6">
                                <h4 className="text-sm font-semibold text-white/85 tracking-wide mb-3" data-lens="on">
                                  Links
                                </h4>
                                <div className="space-y-3 max-w-[360px]">
                                  <a 
                                    href={active.liveUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-2 px-5 py-3 bg-brand-gold text-black font-medium rounded-lg shadow-md hover:bg-brand-gold-dark transition-all duration-300 text-sm w-full h-11"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    Live Website
                                  </a>
                                  
                                  <button 
                                    onClick={() => setShowWorkSummary(true)}
                                    className="flex items-center justify-center gap-2 px-5 py-3 bg-transparent text-white/85 font-medium rounded-lg border border-white/25 hover:bg-white/[0.08] hover:border-white/35 hover:text-white/95 transition-all duration-300 text-sm w-full h-11"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Work Summary
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                ) : (
                  /* Projects: 2-Column Layout */
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 h-auto min-h-0 lg:items-stretch lg:[height:calc(100vh-14rem)]">
                    
                    {/* Left: Featured Card */}
                    <div className="lg:col-span-8 min-h-0">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={active.id}
                          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                          transition={{ duration: 0.3, ease: EASE_OUT_QUART }}
                          className="bg-white/[0.05] border border-white/[0.14] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.35)] md:backdrop-blur-sm overflow-hidden flex flex-col h-full"
                        >
                          {/* Zone A: Full Card Hero + Inner Cinema Frame */}
                          <div className="relative overflow-hidden bg-neutral-900 w-full h-[220px] md:h-[300px] lg:h-[340px] flex-shrink-0">
                            {/* Blurred background layer */}
                            <Image
                              src={active.image}
                              alt=""
                              fill
                              className="object-cover object-center md:blur-2xl scale-110 opacity-40"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px" // ✅ Optimized sizes
                            />
                            
                            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70" />
                            
                            {/* Inner cinema frame */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-[92%] h-[88%] md:w-[92%] md:h-[78%] lg:w-[92%] lg:h-[80%] rounded-xl md:rounded-2xl overflow-hidden relative p-3 md:p-0 border border-white/10 md:border-0">
                                <Image
                                  src={active.image}
                                  alt={`${active.title} project preview`}
                                  fill
                                  priority={true} // ✅ LCP optimization - main featured image
                                  className="object-contain md:object-cover object-center max-h-full max-w-full group-hover:scale-[1.02] transition-transform duration-700"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 700px" // ✅ Optimized sizes
                                />
                              </div>
                            </div>
                            
                            {/* Subtle vignette overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent via-30% via-70% to-black/25 z-20 pointer-events-none hidden md:block" />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent via-transparent to-black/25 z-20 pointer-events-none md:hidden" />
                          </div>

                          {/* Zone B: Content Area */}
                          <div className="flex-1 min-h-0 p-5 md:px-6 lg:px-8 md:mt-4 lg:mt-5 flex flex-col gap-4 overflow-y-auto md:overflow-visible">
                            <h3 className="text-xl md:text-3xl lg:text-4xl text-white font-bold line-clamp-1 flex-shrink-0" data-lens="on">
                              {active.title}
                            </h3>
                            
                            <p className="text-white/75 text-xs md:text-base leading-relaxed md:leading-relaxed lg:leading-7 line-clamp-4 md:line-clamp-4 lg:line-clamp-5 flex-shrink-0" data-lens="on">
                              {active.description}
                            </p>
                          </div>

                          {/* Zone C: Bottom CTA Area (always visible) */}
                          <div className="p-5 md:px-6 lg:px-8 md:sticky md:bottom-0 md:pt-8 md:pb-5 md:bg-black/30 md:backdrop-blur-md md:border-t md:border-white/10 space-y-4 flex-shrink-0">
                            {/* Tech Stack */}
                            <div className="flex flex-wrap gap-2 pb-5">
                              {active.tech.map((tech) => (
                                <span 
                                  key={tech}
                                  className="px-4 py-2 md:px-5 md:py-2 bg-white/[0.08] text-white/80 rounded-full text-xs md:text-sm font-medium border border-white/[0.12] whitespace-nowrap h-8 md:h-9 flex items-center"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col md:flex-row gap-2 md:gap-3">
                              <a 
                                href={active.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full md:flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-brand-gold text-black font-mono font-medium rounded-lg shadow-md hover:bg-brand-gold-dark transition-all duration-300 text-[10px] md:text-sm lg:text-base whitespace-nowrap h-9 md:h-11"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                {active.category === 'client' ? 'Live Website' : 'Live Demo'}
                              </a>
                              
                              {active.category === 'client' ? (
                                <button 
                                  onClick={() => setShowWorkSummary(true)}
                                  className="w-full md:flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-transparent text-white/85 font-mono font-medium rounded-lg border border-white/25 hover:bg-white/[0.08] hover:border-white/35 hover:text-white/95 transition-all duration-300 text-[10px] md:text-sm lg:text-base whitespace-nowrap h-9 md:h-11"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Work Summary
                                  </button>
                                ) : (
                                  <a 
                                    href={active.sourceUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full md:flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-transparent text-white/85 font-mono font-medium rounded-lg border border-white/25 hover:bg-white/[0.08] hover:border-white/35 hover:text-white/95 transition-all duration-300 text-[10px] md:text-sm lg:text-base whitespace-nowrap h-9 md:h-11"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                    Source Code
                                  </a>
                                )}
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Right: Mini Projects Panel */}
                    <div className="lg:col-span-4 hidden lg:block min-h-0">
                      <div className="projectsPanel relative rounded-2xl bg-white/[0.02] border border-white/[0.08] min-h-0 h-full">
                        {/* Right Preview Wrapper with scrollbar overlay */}
                        <div 
                          className="rightPreview relative h-full"
                        >
                          {/* Scroll Container - Hidden native scrollbar, custom scrollbar UI */}
                          <div 
                            ref={scrollContainerRef}
                            className="h-full overflow-y-auto overflow-x-hidden p-5 pr-8 space-y-4 focus:outline-none min-h-0 hidden-scrollbar-container"
                            style={{
                              overscrollBehaviorY: 'contain',
                              WebkitOverflowScrolling: 'touch',
                              scrollBehavior: 'auto',
                              scrollbarWidth: 'none', // Firefox
                              msOverflowStyle: 'none' // IE/Edge
                            }}
                            onScroll={handleScroll}
                            onKeyDown={handleKeyDown}
                            tabIndex={0}
                            role="region"
                            aria-label="Projects list"
                          >
                          <AnimatePresence mode="popLayout">
                            {mini.map((project) => (
                              <motion.button
                                key={project.id}
                                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -10 }}
                                transition={{ duration: 0.25, ease: EASE_OUT_QUART }}
                                onClick={() => handleMiniClick(project.id)}
                                className="group relative bg-white/[0.04] border border-white/[0.12] rounded-xl overflow-hidden hover:border-brand-gold/40 hover:bg-white/[0.06] hover:shadow-[0_6px_24px_rgba(207,174,82,0.14)] transition-all duration-300 text-left w-full"
                              >
                                <div className="w-full h-[160px] bg-neutral-900 relative overflow-hidden">
                                  <Image
                                    src={project.image}
                                    alt={`${project.title} preview`}
                                    fill
                                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 1024px) 0px, 400px" // ✅ Only loads on desktop (lg+)
                                  />
                                  
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                  
                                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-brand-gold/20 md:backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <svg className="w-3.5 h-3.5 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  </div>
                                </div>

                                <div className="p-4">
                                  <h4 className="text-base font-bold text-white mb-1 group-hover:text-brand-gold transition-colors duration-300 line-clamp-1" data-lens="on">
                                    {project.title}
                                  </h4>
                                  <p className="text-xs text-white/65 line-clamp-1" data-lens="on">
                                    {project.summary}
                                  </p>
                                </div>
                              </motion.button>
                            ))}
                          </AnimatePresence>
                        </div>

                        {/* Custom Scrollbar UI - Floating/Inset Style */}
                        {scrollState.scrollHeight > scrollState.clientHeight && (
                          <div className="absolute top-4 right-2 w-1.5 z-20" style={{ height: 'calc(100% - 32px)' }}>
                            {/* Scrollbar Track */}
                            <div 
                              className="w-full h-full bg-white/[0.06] rounded-full relative"
                              onPointerDown={(e) => {
                                const container = scrollContainerRef.current
                                if (!container) return
                                
                                const rect = e.currentTarget.getBoundingClientRect()
                                const clickY = e.clientY - rect.top
                                const trackHeight = rect.height
                                const scrollRatio = clickY / trackHeight
                                const maxScroll = container.scrollHeight - container.clientHeight
                                
                                container.scrollTop = scrollRatio * maxScroll
                              }}
                            >
                              {/* Scrollbar Thumb */}
                              <div 
                                className="absolute left-0 w-full bg-white/[0.25] rounded-full transition-colors duration-150 hover:bg-white/[0.35]"
                                style={{
                                  height: `${Math.max(16, scrollState.thumbHeight)}px`,
                                  top: `${scrollState.thumbTop}px`
                                }}
                                onPointerDown={(e) => {
                                  e.stopPropagation()
                                  e.preventDefault()
                                  
                                  const container = scrollContainerRef.current
                                  if (!container) return
                                  
                                  const startY = e.clientY
                                  const startScrollTop = container.scrollTop
                                  const maxScroll = container.scrollHeight - container.clientHeight
                                  const trackHeight = scrollState.clientHeight - 32 // Account for top/bottom padding
                                  const thumbHeight = Math.max(16, scrollState.thumbHeight)
                                  
                                  const handlePointerMove = (moveEvent: PointerEvent) => {
                                    const deltaY = moveEvent.clientY - startY
                                    const scrollDelta = (deltaY / (trackHeight - thumbHeight)) * maxScroll
                                    container.scrollTop = Math.max(0, Math.min(maxScroll, startScrollTop + scrollDelta))
                                  }
                                  
                                  const handlePointerUp = () => {
                                    document.removeEventListener('pointermove', handlePointerMove)
                                    document.removeEventListener('pointerup', handlePointerUp)
                                  }
                                  
                                  document.addEventListener('pointermove', handlePointerMove)
                                  document.addEventListener('pointerup', handlePointerUp)
                                }}
                              />
                            </div>
                          </div>
                        )}
                        </div>

                        {/* Fade Gradients */}
                        <div 
                          className={`absolute top-0 left-0 right-0 h-16 scroll-fade-top z-10 pointer-events-none transition-opacity duration-300 ${
                            scrollState.isAtTop ? 'opacity-0' : 'opacity-100'
                          }`}
                        />
                        
                        <div 
                          className={`absolute bottom-0 left-0 right-0 h-16 scroll-fade-bottom z-10 pointer-events-none transition-opacity duration-300 ${
                            scrollState.isAtBottom ? 'opacity-0' : 'opacity-100'
                          }`}
                        />

                        {/* Scroll Hint */}
                        {scrollState.canScrollDown && scrollState.isAtTop && (
                          <div className="absolute bottom-6 right-6 z-20 pointer-events-none">
                            <div className="flex flex-col items-center gap-1 px-3 py-2 bg-black/60 md:backdrop-blur-sm rounded-lg border border-white/10">
                              <span className="text-[10px] text-white/60 font-mono uppercase tracking-wider">
                                Scroll
                              </span>
                              <motion.svg 
                                className="w-3 h-3 text-white/40"
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                                animate={{ y: [0, 3, 0] }}
                                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                              </motion.svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mobile: Horizontal Scroll */}
                    <div className="lg:hidden col-span-1">
                      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-6 px-6">
                        {mini.map((project) => (
                          <button
                            key={project.id}
                            onClick={() => handleMiniClick(project.id)}
                            className="group relative bg-white/[0.04] border border-white/[0.12] rounded-xl overflow-hidden hover:border-brand-gold/40 transition-all duration-300 text-left snap-start flex-shrink-0 w-64"
                          >
                            <div className="w-full h-[120px] bg-neutral-900 relative overflow-hidden">
                              <Image
                                src={project.image}
                                alt={`${project.title} preview`}
                                fill
                                className="object-cover object-top"
                                sizes="(max-width: 768px) 256px, 0px" // ✅ Only loads on mobile
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                            </div>
                            <div className="p-3">
                              <h4 className="text-sm font-bold text-white mb-1 line-clamp-1" data-lens="on">
                                {project.title}
                              </h4>
                              <p className="text-xs text-white/65 line-clamp-1" data-lens="on">
                                {project.summary}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Mobile Navigation Dots - Attached to cards */}
                      {activeTab === 'frontend' && (
                        <div className="flex justify-center gap-2 pt-3 pb-1">
                          {filteredProjects.map((project) => (
                            <button
                              key={project.id}
                              onClick={() => setActiveId(project.id)}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                project.id === activeId
                                  ? 'bg-brand-gold w-6'
                                  : 'bg-white/20 hover:bg-white/40'
                              }`}
                              aria-label={`View ${project.title}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Work Summary Modal - ✅ Dynamically loaded only when needed */}
      {showWorkSummary && active.category === 'client' && (
        <WorkSummaryModal 
          active={active} 
          onClose={() => setShowWorkSummary(false)} 
        />
      )}
    </>
  )
}

export default ProjectsSection