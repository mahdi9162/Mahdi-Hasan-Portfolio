'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  GraduationCap, 
  Terminal, 
  Dumbbell, 
  BadgeCheck
} from 'lucide-react'
import Container from '@/components/shared/Container'
import SectionHeader from '@/components/shared/SectionHeader'
import { EASE_OUT_QUART } from '@/lib/animations'

const AboutSection = () => {
  // Mobile detection for optimized animations
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Animation setup - safe intersection observer
  const shouldReduceMotion = useReducedMotion()

  // Animation variants - mobile-optimized
  const containerVariants: Variants = {
    in: { 
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
    out: { 
      opacity: 1,             // was 0
      y: isMobile ? 20 : 8,   // Reduced y-offset on mobile
      filter: isMobile ? "blur(4px)" : "blur(2px)", // Reduced blur on mobile
      transition: { 
        duration: isMobile ? 0.4 : 0.35, 
        ease: EASE_OUT_QUART 
      }
    }
  }

  const childVariants: Variants = {
    in: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)", 
      transition: { 
        duration: isMobile ? 0.4 : 0.6, 
        ease: EASE_OUT_QUART 
      }
    },
    out: { 
      opacity: 0.65,          // was 0
      y: isMobile ? 20 : 10,  // Reduced y-offset on mobile
      filter: isMobile ? "blur(4px)" : "blur(3px)", // Reduced blur on mobile
      transition: { 
        duration: isMobile ? 0.4 : 0.35, 
        ease: EASE_OUT_QUART 
      }
    }
  }

  const leftVariants: Variants = {
    in: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      filter: "blur(0px)", 
      transition: { 
        duration: 0.6, 
        ease: EASE_OUT_QUART 
      }
    },
    out: { 
      opacity: 0.75,          // was 0
      y: 8,
      scale: 0.99,
      filter: "blur(3px)",
      transition: { 
        duration: 0.35, 
        ease: EASE_OUT_QUART 
      }
    }
  }

  const listVariants: Variants = {
    in: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0
      }
    },
    out: {
      transition: {
        staggerChildren: 0.04
      }
    }
  }

  const listItemVariants: Variants = {
    in: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        duration: 0.35, 
        ease: EASE_OUT_QUART 
      }
    },
    out: { 
      opacity: 0, 
      x: -8, 
      transition: { 
        duration: 0.35, 
        ease: EASE_OUT_QUART 
      }
    }
  }

  return (
    <section id="about" className="scroll-mt-24 w-full bg-black/20 my-28 sm:my-16 md:my-0 md:pt-16 lg:pt-14 md:pb-20 lg:pb-28 xl:pb-32">
      <Container>
        <motion.div 
          className="space-y-8 md:space-y-10 relative z-10"
          initial="out"
          whileInView="in"
          viewport={{ amount: 0.1, margin: "-50px 0px", once: true }}
          variants={containerVariants}
        >
          {/* Section Header */}
          <motion.div variants={childVariants} style={{ willChange: "transform, opacity, filter" }}>
            <SectionHeader 
              title="About" 
              subtitle="A quick story about where I started and what I build now."
            />
          </motion.div>

          <div className="w-full flex flex-col md:flex-row md:justify-between items-start gap-10 lg:gap-14">
            
            {/* Left Side: Portrait & Academic Detail */}
            <motion.div 
              className="w-full md:w-[35%] relative group portrait-hover max-w-[520px] mx-auto md:mx-0"
              variants={leftVariants}
              style={{ willChange: "transform, opacity, filter" }}
            >
              {/* Background Glow Bloom */}
              <div className="absolute -inset-20 bloom-effect opacity-60 pointer-events-none"></div>
              
              {/* Main Portrait Card */}
              <div className="relative z-10 bg-card-dark border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/5] md:aspect-[4/5] relative portrait-image bg-zinc-900/50 md:bg-transparent p-2 md:p-0">
                  <Image
                    src="/formal_about.webp"
                    alt="Modern professional portrait of Mahdi Hasan in a minimalist setting"
                    fill
                    className="object-contain md:object-cover object-center rounded-2xl md:rounded-none"
                    priority={false} // ✅ Not critical for LCP since it's below the fold
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 520px" // ✅ Optimized sizes
                  />
                </div>
                
                {/* Integrated Academic Card */}
                <div className="p-6 bg-zinc-900/40 md:backdrop-blur-sm border-t border-zinc-800">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                        Academic Background
                      </p>
                      <p className="text-white font-semibold text-sm md:text-base my-1">Govt. Titumir College</p>
                      <p className="text-xs text-zinc-400">History Major turned Developer</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decoration elements */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 border-l-2 border-b-2 border-primary/30 rounded-bl-xl"></div>
              <div className="absolute -top-6 -right-6 w-24 h-24 border-r-2 border-t-2 border-primary/30 rounded-tr-xl"></div>
            </motion.div>

            {/* Right Side: Content */}
            <div className="w-full md:w-[58%] self-center">
              <div className="w-full">
                {/* Main Content - Story Area */}
                <motion.div 
                  className="space-y-5 md:space-y-6"
                  variants={childVariants}
                  style={{ willChange: "transform, opacity, filter" }}
                >
                  <p 
                    className="text-sm md:text-base leading-relaxed text-zinc-400 tracking-[0.01em]" 
                    data-lens="on"
                  >
                    I come from a non-traditional background{' '}
                    <span className="text-white font-medium">—my academic path was in History—</span>{' '}
                    but I was always drawn to logic, structure, and building things. The turning point came when I realized I was preparing for a future I didn't want. I chose to pivot, got the support I needed, and began my development journey through Programming Hero—then kept growing through real projects and consistent practice.
                  </p>
                  
                  <p 
                    className="text-sm md:text-lg leading-relaxed text-zinc-200 italic border-l-2 border-primary pl-6 my-4"  
                    data-lens="on"
                  >
                    From history to frontend — I build clean, structured UI that feels product-ready.
                  </p>
                  
                  <p 
                    className="text-sm md:text-base leading-relaxed text-zinc-400 tracking-[0.01em]" 
                    data-lens="on"
                  >
                    Today, I work with the MERN stack with a frontend-first mindset: crafting responsive layouts, building reusable React components, and integrating real features like authentication and APIs. I care about clarity—both in code and in the user experience. I'm also building with Next.js and improving my workflow for scalable, production-ready apps.
                  </p>
                </motion.div>

                {/* Sub-sections: Expertise & Beyond Code */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 mt-6 border-t border-zinc-800">
                
                {/* Expertise */}
                <motion.div 
                  className="space-y-4"
                  variants={childVariants}
                  style={{ willChange: "transform, opacity, filter" }}
                >
                  <div className="flex items-center gap-2 text-primary">
                    <Terminal className="w-5 h-5" />
                    <h3 className="text-white font-bold tracking-wide uppercase text-sm" data-lens="on">
                      Core Expertise
                    </h3>
                  </div>
                  <motion.ul 
                    className="space-y-3"
                    variants={listVariants}
                  >
                    <motion.li 
                      className="flex items-center gap-3 text-sm leading-6 text-zinc-400" 
                      data-lens="on"
                      variants={listItemVariants}
                      style={{ willChange: "transform, opacity" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Responsive Layouts (mobile-first)
                    </motion.li>
                    <motion.li 
                      className="flex items-center gap-3 text-sm leading-6 text-zinc-400" 
                      data-lens="on"
                      variants={listItemVariants}
                      style={{ willChange: "transform, opacity" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      React + Component-Based UI
                    </motion.li>
                    <motion.li 
                      className="flex items-center gap-3 text-sm leading-6 text-zinc-400" 
                      data-lens="on"
                      variants={listItemVariants}
                      style={{ willChange: "transform, opacity" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      API Integration + Auth
                    </motion.li>
                    <motion.li 
                      className="flex items-center gap-3 text-sm leading-6 text-zinc-400" 
                      data-lens="on"
                      variants={listItemVariants}
                      style={{ willChange: "transform, opacity" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Tailwind CSS + Modern UI
                    </motion.li>
                    <motion.li 
                      className="flex items-center gap-3 text-sm leading-6 text-zinc-400" 
                      data-lens="on"
                      variants={listItemVariants}
                      style={{ willChange: "transform, opacity" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      MERN Foundations (Node/Express/MongoDB)
                    </motion.li>
                    <motion.li 
                      className="flex items-center gap-3 text-sm leading-6 text-zinc-400" 
                      data-lens="on"
                      variants={listItemVariants}
                      style={{ willChange: "transform, opacity" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      Deployment (Vercel/Netlify/Firebase)
                    </motion.li>
                  </motion.ul>
                </motion.div>

                {/* Beyond Code */}
                <motion.div 
                  className="space-y-4"
                  variants={childVariants}
                  style={{ willChange: "transform, opacity, filter" }}
                >
                  <div className="flex items-center gap-2 text-primary">
                    <Dumbbell className="w-5 h-5" />
                    <h3 className="text-white font-bold tracking-wide uppercase text-sm" data-lens="on">
                      Beyond Code
                    </h3>
                  </div>
                  <p className="text-sm leading-6 text-zinc-400" data-lens="on">
                    When I'm not coding, I'm usually at the gym. Training keeps me consistent and focused—and that same discipline shows up in how I work: I stay calm under pressure, iterate through feedback, and keep improving until the details feel right.
                  </p>
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">
                      <BadgeCheck className="w-4 h-4" />
                      Discipline
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">
                      <BadgeCheck className="w-4 h-4" />
                      Resilience
                    </div>
                  </div>
                </motion.div>
              </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

export default AboutSection