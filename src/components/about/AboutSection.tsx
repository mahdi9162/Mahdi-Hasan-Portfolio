'use client'

import Image from 'next/image'
import { 
  GraduationCap, 
  Terminal, 
  Dumbbell, 
  BadgeCheck
} from 'lucide-react'
import Container from '@/components/shared/Container'
import SectionHeader from '@/components/shared/SectionHeader'

const AboutSection = () => {
  return (
    <section id="about" className="scroll-mt-24 section-gap w-full bg-background-dark mb-28 sm:mb-16 md:mb-0">
      <Container>
        <div className="space-y-8 md:space-y-10">
          {/* Section Header */}
          <SectionHeader 
            title="About" 
            subtitle="Learn more about me and my background."
          />

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              
              {/* Left Side: Portrait & Academic Detail (5 Columns) */}
              <div className="lg:col-span-5 relative group portrait-hover">
                {/* Background Glow Bloom */}
                <div className="absolute -inset-20 bloom-effect opacity-60 pointer-events-none"></div>
                
                {/* Main Portrait Card */}
                <div className="relative z-10 bg-card-dark border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
                  <div className="aspect-[4/5] relative portrait-image">
                    <Image
                      src="/formal_about.webp"
                      alt="Modern professional portrait of Mahdi Hasan in a minimalist setting"
                      fill
                      className="object-cover object-center"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    />
                  </div>
                  
                  {/* Integrated Academic Card */}
                  <div className="p-6 bg-zinc-900/90 backdrop-blur-sm border-t border-zinc-800">
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
              </div>

              {/* Right Side: Content (7 Columns) */}
              <div className="lg:col-span-7 pt-6 font-display items-start">
                <div className="max-w-[680px]">
                  {/* Main Content - Story Area */}
                  <div className="flex flex-col gap-6">
                    <p className="text-[15px] leading-[1.9] text-zinc-400 tracking-[0.01em] mb-2" data-lens="on">
                      I come from a non-traditional background{' '}
                      <span className="text-white font-medium">—my academic path was in History—</span>{' '}
                      but I was always drawn to logic, structure, and building things. The turning point came when I realized I was preparing for a future I didn't want. I chose to pivot, got the support I needed, and began my development journey through Programming Hero—then kept growing through real projects and consistent practice.
                    </p>
                    
                    <p className="text-sm md:text-[18px] leading-[1.7] text-zinc-200 italic border-l-2 border-primary pl-6 mt-6 mb-6"  data-lens="on">
                      From history to frontend — I build clean, structured UI that feels product-ready.
                    </p>
                    
                    <p className="text-[15px] leading-[1.9] text-zinc-400 tracking-[0.01em] mt-2" data-lens="on">
                      Today, I work with the MERN stack with a frontend-first mindset: crafting responsive layouts, building reusable React components, and integrating real features like authentication and APIs. I care about clarity—both in code and in the user experience. I'm also building with Next.js and improving my workflow for scalable, production-ready apps.
                    </p>
                  </div>

                  {/* Sub-sections: Expertise & Beyond Code */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 mt-8 border-t border-zinc-800">
                  
                  {/* Expertise */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-primary">
                      <Terminal className="w-5 h-5" />
                      <h3 className="text-white font-bold tracking-wide uppercase text-sm" data-lens="on">
                        Core Expertise
                      </h3>
                    </div>
                    <ul className="flex flex-col space-y-3">
                      <li className="flex items-center gap-3 text-sm leading-6 text-zinc-400" data-lens="on">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Responsive Layouts (mobile-first)
                      </li>
                      <li className="flex items-center gap-3 text-sm leading-6 text-zinc-400" data-lens="on">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        React + Component-Based UI
                      </li>
                      <li className="flex items-center gap-3 text-sm leading-6 text-zinc-400" data-lens="on">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        API Integration + Auth
                      </li>
                      <li className="flex items-center gap-3 text-sm leading-6 text-zinc-400" data-lens="on">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Tailwind CSS + Modern UI
                      </li>
                      <li className="flex items-center gap-3 text-sm leading-6 text-zinc-400" data-lens="on">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        MERN Foundations (Node/Express/MongoDB)
                      </li>
                      <li className="flex items-center gap-3 text-sm leading-6 text-zinc-400" data-lens="on">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Deployment (Vercel/Netlify/Firebase)
                      </li>
                    </ul>
                  </div>

                  {/* Beyond Code */}
                  <div className="flex flex-col gap-4">
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
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default AboutSection