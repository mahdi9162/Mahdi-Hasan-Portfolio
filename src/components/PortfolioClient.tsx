'use client'

import { motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import PageWrapper from '@/components/PageWrapper'
import FirstEntryLoader from '@/components/FirstEntryLoader'
import Navbar from '@/components/Navbar'
import ProfileImage from '@/components/ProfileImage'
import MouseSpotlight from '@/components/MouseSpotlight'
import Hero from '@/components/Hero'
import SkillsSection from '@/components/SkillsSection'
import ProjectsSection from '@/components/ProjectsSection'
import AboutSection from '@/components/about/AboutSection'
import ContactSection from '@/components/contact/ContactSection'
import Footer from '@/components/Footer'
import FallBeamBackground from '@/components/FallBeamBackground'
import { useFirstEntryIntro } from '@/hooks/useFirstEntryIntro'
import type { Project } from '@/types/project'
import type { SerializableSkillCategory } from '@/app/page'
import type { HeroContent } from '@/types/hero'
import type { AboutContent } from '@/types/about'

interface Props {
  initialProjects?: Project[]
  projectsFromSupabase?: boolean
  initialSkillCategories?: SerializableSkillCategory[]
  skillsFromSupabase?: boolean
  initialHeroContent?: HeroContent
  initialAboutContent?: AboutContent
}

export default function PortfolioClient({ initialProjects, projectsFromSupabase = true, initialSkillCategories, skillsFromSupabase = true, initialHeroContent, initialAboutContent }: Props) {
  const { isVisible: showFirstEntryIntro, complete: completeFirstEntryIntro } = useFirstEntryIntro()
  const [introReleaseStarted, setIntroReleaseStarted] = useState(false)
  const startIntroRelease = useCallback(() => setIntroReleaseStarted(true), [])

  const introIsCoveringPage = showFirstEntryIntro && !introReleaseStarted

  return (
    <>
      {showFirstEntryIntro && (
        <FirstEntryLoader
          onComplete={completeFirstEntryIntro}
          onExitStart={startIntroRelease}
        />
      )}

      <PageWrapper>
        <motion.div
          initial={{ opacity: 0.6, scale: 1.015, filter: 'blur(5px)' }}
          animate={introIsCoveringPage
            ? { opacity: 0, scale: 1.02, filter: 'blur(6px)' }
            : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: introReleaseStarted ? 0.52 : 0, ease: 'easeOut' }}
        >
          {/* Fall Beam Background — public portfolio only, not rendered on /dashboard */}
          <FallBeamBackground
            beamColorClass="golden"
            className="z-1"
          />
          <main id="main-content" className="text-neutral-800 dark:text-neutral-200 min-h-screen relative" style={{ touchAction: 'pan-y' }}>
            <MouseSpotlight />

            <Navbar />

            {/* Hero Section */}
            <section id="hero" className="scroll-mt-24 flex flex-col md:flex-row md:gap-10 md:items-center lg:flex-row lg:gap-0 lg:items-stretch lg:min-h-screen relative z-10 pt-[28px] md:pt-16 mb-12 sm:mb-16 md:mb-28">
              <div className="w-full md:w-[55%] lg:w-[55%] bg-black/20 lg:border-r lg:border-neutral-200/20 dark:lg:border-neutral-800/80 p-6 sm:p-8 md:p-12 relative z-20">
                <Hero heroContent={initialHeroContent} />
              </div>
              <div className="w-full md:w-[45%] lg:w-[45%] relative z-[100] profile-image-container lg:min-h-screen">
                <ProfileImage profileImageUrl={initialHeroContent?.profile_image_url} />
              </div>
            </section>

            <SkillsSection initialSkillCategories={initialSkillCategories} skillsFromSupabase={skillsFromSupabase} />
            <ProjectsSection initialProjects={initialProjects} projectsFromSupabase={projectsFromSupabase} />
            <AboutSection aboutContent={initialAboutContent} />
            <ContactSection />
            <Footer />
          </main>
        </motion.div>
      </PageWrapper>
    </>
  )
}
