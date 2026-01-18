'use client'

import { motion } from 'framer-motion'
import PageWrapper from '@/components/PageWrapper'
import Navbar from '@/components/Navbar'
import SocialLinks from '@/components/SocialLinks'
import ProfileImage from '@/components/ProfileImage'
import MouseSpotlight from '@/components/MouseSpotlight'
import SkillsSection from '@/components/SkillsSection'
import ProjectsSection from '@/components/ProjectsSection'
import AboutSection from '@/components/about/AboutSection'
import ContactSection from '@/components/contact/ContactSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <PageWrapper>
      <main className="bg-background-light dark:bg-background-dark text-neutral-800 dark:text-neutral-200 min-h-screen relative">
        <MouseSpotlight />
        
        {/* Fixed Navbar */}
        <Navbar />
        
        {/* Hero Section */}
        <section id="hero" className="scroll-mt-24 pb-16 md:pb-20 lg:pb-28 xl:pb-32 flex flex-col lg:flex-row min-h-screen relative z-10 pt-16">
          <div className="w-full lg:w-[55%] bg-background-light dark:bg-background-dark lg:border-r lg:border-neutral-200/20 dark:lg:border-neutral-800/80 p-6 sm:p-8 md:p-12 relative z-20">
            <div className="flex flex-col h-full justify-center py-12 md:py-24">
              <div className="max-w-3xl">
                {/* Hero Name */}
                <motion.div
                  initial={{ opacity: 0, y: 80, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                >
                  <h1 className="hero-heading hero-name tracking-tighter leading-none text-neutral-900 dark:text-primary hover:text-brand-gold transition-all duration-300 cursor-pointer hover:drop-shadow-[0_0_20px_rgb(var(--brand-gold)_/_0.3)]" data-lens="on">
                    MAHDI HASAN
                  </h1>
                </motion.div>
                
                {/* Subheading */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                >
                  <h2 className="hero-subheading mt-4 text-3xl md:text-4xl tracking-tight text-neutral-700 dark:text-neutral-300 hover:text-brand-gold-alt transition-all duration-300 cursor-pointer hover:drop-shadow-[0_0_15px_rgb(var(--brand-gold-alt)_/_0.25)]" data-lens="on">
                    Junior Frontend Developer
                  </h2>
                </motion.div>
                
                {/* Bio paragraph */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                >
                  <div className="hero-description mt-6 leading-relaxed">
                    <span className="inline-block text-neutral-600 dark:text-neutral-400 opacity-70 hover:opacity-100 hover:text-neutral-100 dark:hover:text-neutral-50 transition-all duration-300 cursor-pointer" data-lens="on">
                      Building responsive web applications with React, Next.js, and Tailwind CSS. Experienced in full-stack development using the MERN stack with a focus on clean code and user-centric design.
                    </span>
                  </div>
                </motion.div>
                
                {/* Social Links */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                >
                  <div className="hero-social mt-8">
                    <SocialLinks />
                  </div>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
                >
                  <div className="flex items-center space-x-4 mt-8">
                    {/* Primary CTA - Resume */}
                    <motion.a
                      href="/Mahdi-Hasan-CV.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 text-sm font-medium bg-brand-gold text-black rounded-md"
                      data-lens="on"
                      whileHover={{ 
                        scale: 1.05,
                        backgroundColor: "rgb(184 152 74)",
                        boxShadow: "0 0 25px rgb(207 174 82 / 0.4), 0 8px 32px rgb(207 174 82 / 0.2)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 10,
                        duration: 0.8
                      }}
                    >
                      Download CV
                    </motion.a>
                    
                    {/* Secondary CTA - View Projects */}
                    <motion.button 
                      className="px-6 py-3 text-sm font-medium border-2 border-neutral-700 dark:border-neutral-300 text-neutral-800 dark:text-primary rounded-md bg-transparent"
                      data-lens="on"
                      onClick={() => {
                        const element = document.getElementById('projects')
                        if (element && (window as any).lenis) {
                          ;(window as any).lenis.scrollTo(element, {
                            offset: -90,
                            duration: 2.0,
                            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                          })
                        }
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        borderColor: "rgb(207 174 82)",
                        color: "rgb(207 174 82)",
                        boxShadow: "0 0 20px rgb(207 174 82 / 0.3), 0 6px 24px rgb(207 174 82 / 0.15)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 10,
                        duration: 0.8
                      }}
                    >
                      View Projects
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* Profile Image - Right side of split layout with proper width */}
          <div className="w-full lg:w-[45%] relative z-[100] profile-image-container" style={{ minHeight: '100vh' }}>
            <ProfileImage />
          </div>
        </section>

        {/* Skills Section */}
        <SkillsSection />

        {/* Projects Section */}
        <ProjectsSection />

        {/* About Section */}
        <AboutSection />

        {/* Contact Section */}
        <ContactSection />

        {/* Footer */}
        <Footer />
      </main>
    </PageWrapper>
  )
}