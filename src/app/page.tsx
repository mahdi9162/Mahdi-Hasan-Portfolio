'use client'

import PageWrapper from '@/components/PageWrapper'
import Navbar from '@/components/Navbar'
import ProfileImage from '@/components/ProfileImage'
import MouseSpotlight from '@/components/MouseSpotlight'
import Hero from '@/components/Hero'
import SkillsSection from '@/components/SkillsSection'
import ProjectsSection from '@/components/ProjectsSection'
import AboutSection from '@/components/about/AboutSection'
import ContactSection from '@/components/contact/ContactSection'
import Footer from '@/components/Footer'
import EntryLoader from '@/components/EntryLoader'
import { useEntryLoader } from '@/hooks/useEntryLoader'

export default function Home() {
  const { showEntryLoader, entryLoaderComplete, handleEntryComplete, skipSmartLoader, heroAnimationReady } = useEntryLoader()

  return (
    <>
      {/* Entry Welcome Loader - First Visit Only */}
      {showEntryLoader && (
        <EntryLoader onComplete={handleEntryComplete} />
      )}

      {/* PageWrapper with entry loader state - prevents SmartLoader overlap */}
      <PageWrapper entryLoaderComplete={entryLoaderComplete} skipSmartLoader={skipSmartLoader}>
        {/* Main Content - Always render but PageWrapper controls visibility */}
        <main className="bg-background-light dark:bg-background-dark text-neutral-800 dark:text-neutral-200 min-h-screen relative">
          <MouseSpotlight />
          
          {/* Fixed Navbar */}
          <Navbar />
          
          {/* Hero Section */}
          <section id="hero" className="scroll-mt-24 flex flex-col md:flex-row md:gap-10 md:items-center lg:flex-row lg:gap-0 lg:items-stretch lg:min-h-screen relative z-10 pt-[28px] md:pt-16 mb-12 sm:mb-16 md:mb-28">
            <div className="w-full md:w-[55%] lg:w-[55%] bg-background-light dark:bg-background-dark lg:border-r lg:border-neutral-200/20 dark:lg:border-neutral-800/80 p-6 sm:p-8 md:p-12 relative z-20">
              <Hero animationReady={heroAnimationReady} />
            </div>
            
            {/* Profile Image - Right side of split layout with proper width */}
            <div className="w-full md:w-[45%] lg:w-[45%] relative z-[100] profile-image-container lg:min-h-screen">
              <ProfileImage animationReady={heroAnimationReady} />
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
    </>
  )
}