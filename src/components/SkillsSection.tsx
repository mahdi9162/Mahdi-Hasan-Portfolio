'use client'

import { 
  SiReact, 
  SiTailwindcss, 
  SiJavascript, 
  SiNodedotjs, 
  SiExpress, 
  SiMongodb, 
  SiGit, 
  SiFirebase, 
  SiNetlify 
} from 'react-icons/si'

const SkillsSection = () => {
  const skillsData = {
    frontend: ['React', 'Tailwind CSS', 'JavaScript', 'HTML', 'CSS'],
    backend: ['Node.js', 'Express.js', 'REST APIs'],
    database: ['MongoDB', 'Firebase'],
    tools: ['Git', 'GitHub', 'VS Code', 'Postman', 'Netlify']
  }

  const floatingIcons = [
    { name: 'React', icon: SiReact, animation: 'animate-float1', delay: '-3s' },
    { name: 'Tailwind CSS', icon: SiTailwindcss, animation: 'animate-float2', delay: '-1s' },
    { name: 'JavaScript', icon: SiJavascript, animation: 'animate-float3', delay: '-5s' },
    { name: 'Node.js', icon: SiNodedotjs, animation: 'animate-float3', delay: '-2s' },
    { name: 'MongoDB', icon: SiMongodb, animation: 'animate-float1', delay: '0s' },
    { name: 'Express.js', icon: SiExpress, animation: 'animate-float2', delay: '-4s' },
    { name: 'Git', icon: SiGit, animation: 'animate-float2', delay: '-6s' },
    { name: 'Firebase', icon: SiFirebase, animation: 'animate-float3', delay: '-8s' },
    { name: 'Netlify', icon: SiNetlify, animation: 'animate-float1', delay: '-7s' }
  ]

  return (
    <section id="skills" className="section min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-black">
      {/* Section Heading - Consistent with Projects */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12">
        <h2 className="text-4xl md:text-5xl text-white mb-8" data-lens="on">
          Skills
        </h2>
        <p className="text-lg text-white/65" data-lens="on">
          Technologies I work with.
        </p>
      </div>

      {/* Main Skills Content */}
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left: Floating Icons Cluster */}
          <div className="relative flex items-center justify-center h-[500px] lg:h-[600px] order-2 lg:order-1">
            <div className="grid grid-cols-3 gap-8 sm:gap-12 w-full max-w-md">
              {floatingIcons.map((iconData, index) => {
                const IconComponent = iconData.icon
                return (
                  <div 
                    key={iconData.name}
                    className={`flex flex-col items-center justify-center ${iconData.animation}`}
                    style={{ animationDelay: iconData.delay }}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-neutral-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-neutral-700/50 hover:border-neutral-600/60 hover:bg-neutral-800/90 transition-all duration-700 hover:shadow-xl">
                      <IconComponent 
                        className="w-8 h-8 sm:w-10 sm:h-10" 
                        style={{ color: 'inherit' }}
                      />
                    </div>
                    <span 
                      className="mt-3 text-xs sm:text-sm text-white/65 hover:text-[#CFAE52] transition-colors duration-700 cursor-pointer"
                      data-lens="on"
                    >
                      {iconData.name}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right: Tech Stack List (Terminal/Mono Vibe) */}
          <div className="space-y-12 order-1 lg:order-2">
            <div className="space-y-10 font-mono">
              {/* Frontend */}
              <div>
                <h3 
                  className="text-white tracking-wide mb-4 text-base hover:text-[#CFAE52] transition-colors duration-700 cursor-pointer"
                  data-lens="on"
                >
                  Frontend
                </h3>
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  {skillsData.frontend.map((skill) => (
                    <span 
                      key={skill}
                      className="text-white/65 hover:text-[#CFAE52] transition-colors duration-700 cursor-pointer"
                      data-lens="on"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Backend */}
              <div>
                <h3 
                  className="text-white tracking-wide mb-4 text-base hover:text-[#CFAE52] transition-colors duration-700 cursor-pointer"
                  data-lens="on"
                >
                  Backend
                </h3>
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  {skillsData.backend.map((skill) => (
                    <span 
                      key={skill}
                      className="text-white/65 hover:text-[#CFAE52] transition-colors duration-700 cursor-pointer"
                      data-lens="on"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Database/Services */}
              <div>
                <h3 
                  className="text-white tracking-wide mb-4 text-base hover:text-[#CFAE52] transition-colors duration-700 cursor-pointer"
                  data-lens="on"
                >
                  Database / Services
                </h3>
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  {skillsData.database.map((skill) => (
                    <span 
                      key={skill}
                      className="text-white/65 hover:text-[#CFAE52] transition-colors duration-700 cursor-pointer"
                      data-lens="on"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div>
                <h3 
                  className="text-white tracking-wide mb-4 text-base hover:text-[#CFAE52] transition-colors duration-700 cursor-pointer"
                  data-lens="on"
                >
                  Tools
                </h3>
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  {skillsData.tools.map((skill) => (
                    <span 
                      key={skill}
                      className="text-white/65 hover:text-[#CFAE52] transition-colors duration-700 cursor-pointer"
                      data-lens="on"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SkillsSection