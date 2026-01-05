'use client'

import { useState } from 'react'
import Image from 'next/image'

const ProjectsSection = () => {
  const projects = [
    {
      id: 1,
      title: 'Voyago',
      description: 'A modern vehicle booking platform that makes renting and managing cars simple—users can explore, book, and track rides, while hosts control listings and availability through a clean dashboard.',
      tech: ['React', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'Firebase (Auth)'],
      image: '/voyago.webp',
      liveUrl: 'https://voyago-2805d.web.app',
      sourceUrl: 'https://github.com/mahdi9162/Voyago-Client-Side.git'
    },
    {
      id: 2,
      title: 'EduBridge',
      description: 'A trust-focused tuition management system designed to keep tutors and students aligned—handling learning flow, tracking progress, and daily class coordination without unnecessary complexity.',
      tech: ['React', 'Tailwind CSS', 'Firebase (Auth)', 'Node.js', 'MongoDB'],
      image: '/edubridge.webp',
      liveUrl: 'https://edubridge-production.web.app',
      sourceUrl: 'https://github.com/mahdi9162/EduBridge-Client-Side.git'
    },
    {
      id: 3,
      title: 'AppVerse',
      description: 'A sleek productivity app explorer where users can discover tools, view detailed insights, and manage installs instantly—built for smooth interaction, clarity, and speed.',
      tech: ['React', 'Tailwind', 'JavaScript'],
      image: '/appverse.webp',
      liveUrl: 'https://appversee.netlify.app',
      sourceUrl: 'https://github.com/mahdi9162/AppVerse.git'
    },
    {
      id: 4,
      title: 'Skillora',
      description: 'A local 1-on-1 skill-sharing platform that connects learners with nearby mentors—making it easy to discover skills, schedule sessions, and learn in a more personal, real-world way.',
      tech: ['React', 'Tailwind CSS', 'Firebase (Auth)', 'MongoDB', 'Express'],
      image: '/skillora.webp',
      liveUrl: 'https://skillora-505c9.web.app',
      sourceUrl: 'https://github.com/mahdi9162/Skillora.git'
    }
  ]

  const [selectedProject, setSelectedProject] = useState(projects[0])

  return (
    <section id="projects" className="section min-h-screen w-full bg-black py-20 px-4 sm:px-6 lg:px-8">
      {/* Section Heading */}
      <div className="max-w-7xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl text-white mb-8" data-lens="on">
          Projects
        </h2>
        <p className="text-lg text-white/65" data-lens="on">
          Showcase of my latest work and projects.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Featured Project - Left Side */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl shadow-lg p-6 md:p-8">
          {/* Project Image */}
          <div className="aspect-video w-full rounded-lg bg-neutral-900 mb-8 overflow-hidden relative">
            <Image
              src={selectedProject.image}
              alt={`${selectedProject.title} project preview`}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            {/* Fallback background for when image is loading or fails */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950 flex items-center justify-center -z-10">
              <span className="text-neutral-600 text-sm">Loading project preview...</span>
            </div>
          </div>

          {/* Project Details */}
          <div className="flex flex-col space-y-6">
            <h3 className="text-3xl md:text-4xl text-white" data-lens="on">
              {selectedProject.title}
            </h3>
            
            <p className="text-white/70 max-w-2xl text-base md:text-lg" data-lens="on">
              {selectedProject.description}
            </p>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-3 pt-2">
              {selectedProject.tech.map((tech) => (
                <span 
                  key={tech}
                  className="px-3 py-1.5 bg-white/10 text-white/80 rounded-full text-sm font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <a 
                href={selectedProject.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#CFAE52] text-black font-mono rounded-lg shadow-md hover:bg-[#B8984A] transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Live Demo
              </a>
              
              <a 
                href={selectedProject.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-transparent text-white/80 font-mono rounded-lg border border-white/20 hover:bg-white/10 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Source Code
              </a>
            </div>
          </div>
        </div>

        {/* Available Projects List - Right Side */}
        <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-xl shadow-lg overflow-hidden">
          {/* List Header */}
          <div className="p-6 border-b border-white/10">
            <h4 className="text-sm font-mono uppercase tracking-widest text-white/60">
              Available Projects
            </h4>
          </div>

          {/* Projects List */}
          <div className="h-[30rem] lg:h-[calc(100%-65px)] overflow-y-auto custom-scrollbar">
            <div className="flex flex-col">
              {projects.map((project, index) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={`block p-6 text-left transition-colors duration-200 ${
                    selectedProject.id === project.id
                      ? 'bg-white/10 border-l-4 border-[#CFAE52]'
                      : 'border-b border-white/10 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-sm font-mono text-white/50">
                      {String(index + 1).padStart(2, '0')} //
                    </span>
                    <div className="flex-1">
                      <h5 className="text-lg text-white mb-1" data-lens="on">
                        {project.title}
                      </h5>
                      <p className="text-sm text-white/60 line-clamp-2">
                        {project.description.substring(0, 60)}...
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProjectsSection