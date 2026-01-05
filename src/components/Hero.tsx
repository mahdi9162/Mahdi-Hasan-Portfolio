'use client'

import SocialLinks from './SocialLinks'

const Hero = () => {
  return (
    <main className="flex-grow flex flex-col justify-center py-12 md:py-24 relative z-30">
      <div className="max-w-3xl">
        {/* Tier 1: Hero Name - Muted premium gold */}
        <h1 
          className="hero-heading hero-name tracking-tighter leading-none text-neutral-900 dark:text-primary hover:text-[#CFAE52] transition-all duration-700 cursor-pointer hover:drop-shadow-[0_0_20px_rgba(207,174,82,0.3)]"
          data-lens="on"
        >
          MAHDI HASAN
        </h1>
        
        {/* Tier 1: Subheading - Keep original golden tone */}
        <h2 
          className="hero-subheading mt-4 text-3xl md:text-4xl tracking-tight text-neutral-700 dark:text-neutral-300 hover:text-[#D4AF37] transition-all duration-700 cursor-pointer hover:drop-shadow-[0_0_15px_rgba(212,175,55,0.25)]"
          data-lens="on"
        >
          Junior Frontend Developer
        </h2>
        
        {/* Tier 3: Paragraph - Tightened hover area with inline-block */}
        <div className="hero-description mt-6 leading-relaxed">
          <span 
            className="inline-block text-neutral-600 dark:text-neutral-400 opacity-70 hover:opacity-100 hover:text-neutral-100 dark:hover:text-neutral-50 transition-all duration-700 cursor-pointer"
            data-lens="on"
          >
            I build clean, responsive, and user-friendly web interfaces with React and Tailwind CSS. I enjoy turning ideas into real products through practical projects and consistent learning. Currently exploring Next.js and improving my full-stack skills.
          </span>
        </div>
        
        <div className="hero-social mt-8">
          <SocialLinks />
        </div>
      </div>
    </main>
  )
}

export default Hero