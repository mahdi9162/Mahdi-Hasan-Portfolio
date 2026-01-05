'use client'

import Image from 'next/image'

const AboutSection = () => {
  const coreExpertise = [
    'React & JavaScript Development',
    'Tailwind CSS & Responsive Design',
    'Component-Based Architecture',
    'User Interface & Experience Design',
    'Frontend Performance Optimization',
    'Modern Web Development Practices',
    'Dashboard & CRUD System Development'
  ]

  return (
    <section id="about" className="section min-h-screen w-full bg-black py-20 px-4 sm:px-6 lg:px-8">
      {/* Section Heading */}
      <div className="max-w-7xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl text-white mb-8" data-lens="on">
          About
        </h2>
        <p className="text-lg text-white/65" data-lens="on">
          Learn more about me and my background.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/5 border border-white/10 rounded-xl shadow-lg p-6 sm:p-10 md:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            
            {/* Content - Left Side */}
            <div className="flex flex-col justify-center order-2 lg:order-1">
              <div className="mb-12">
                <h3 className="text-5xl md:text-6xl text-white mb-6" data-lens="on">
                  ABOUT
                </h3>
                <div className="space-y-4 text-base text-white/70 leading-relaxed">
                  <p data-lens="on">
                    I'm Mahdi Hasan, a Frontend Developer who enjoys building clean, responsive, and user-friendly web applications. My journey into programming started with curiosity and gradually grew through structured learning and hands-on projects.
                  </p>
                  <p data-lens="on">
                    I work mainly with JavaScript, React, and Tailwind CSS, focusing on reusable components, smooth user flows, and practical features such as dashboards and CRUD systems. I enjoy turning ideas into interfaces that feel simple, intuitive, and reliable for real users.
                  </p>
                  <p data-lens="on">
                    Outside of programming, I enjoy staying active through physical exercise and taking time to reflect on personal goals, which helps me stay focused and disciplined. I'm currently exploring Next.js and backend fundamentals, with the goal of growing into a well-rounded developer who builds meaningful and impactful products.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-mono tracking-wider text-white mb-6" data-lens="on">
                  CORE EXPERTISE
                </h4>
                <ul className="space-y-3 text-base text-white/70">
                  {coreExpertise.map((skill, index) => (
                    <li key={index} className="hover:text-[#CFAE52] transition-colors duration-700 cursor-pointer" data-lens="on">
                      – {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Image - Right Side */}
            <div className="flex items-center justify-center order-1 lg:order-2">
              <div className="relative w-full max-w-md aspect-[4/5] rounded-lg overflow-hidden">
                <Image
                  src="/formal_about.webp"
                  alt="Mahdi Hasan - Frontend Developer portrait"
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection