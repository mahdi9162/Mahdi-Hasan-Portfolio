'use client'

import toast from 'react-hot-toast'

const ContactSection = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Show success toast
    toast.success('Message sent successfully!')
    
    // Reset form fields
    e.currentTarget.reset()
  }
  return (
    <section id="contact" className="section min-h-screen w-full bg-black py-20 px-4 sm:px-6 lg:px-8">
      {/* Section Heading */}
      <div className="max-w-7xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl text-white mb-8" data-lens="on">
          Get in Touch
        </h2>
        <p className="text-lg text-white/65" data-lens="on">
          Let's connect and discuss opportunities.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/5 border border-white/10 rounded-2xl shadow-lg backdrop-blur-sm p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Contact Form - Left Side */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-mono text-white/80 mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  className="block w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#CFAE52] focus:border-[#CFAE52] transition-all duration-300"
                  data-lens="on"
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-white/80 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your.email@example.com"
                  className="block w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#CFAE52] focus:border-[#CFAE52] transition-all duration-300"
                  data-lens="on"
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-white/80 mb-2" htmlFor="phone">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Your Phone Number"
                  className="block w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#CFAE52] focus:border-[#CFAE52] transition-all duration-300"
                  data-lens="on"
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-white/80 mb-2" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Enter Your Message"
                  className="block w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl px-5 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#CFAE52] focus:border-[#CFAE52] transition-all duration-300 resize-none"
                  data-lens="on"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#CFAE52] text-black font-mono font-medium py-3 px-8 rounded-full hover:bg-[#B8984A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CFAE52] focus:ring-offset-black transition-all duration-300 transform hover:scale-105"
                  data-lens="on"
                >
                  Send Message
                </button>
              </div>
            </form>

            {/* Contact Info - Right Side */}
            <div className="space-y-10 lg:pl-8">
              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-6 h-6 mt-1">
                  <svg className="w-6 h-6 text-[#CFAE52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl text-white mb-2" data-lens="on">
                    Address
                  </h3>
                  <p className="text-white/70" data-lens="on">
                    100/6 West Brahmondi, Narsingdi, Bangladesh
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-6 h-6 mt-1">
                  <svg className="w-6 h-6 text-[#CFAE52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl text-white mb-2" data-lens="on">
                    Email
                  </h3>
                  <p className="text-white/70" data-lens="on">
                    hasanmahdi6060@gmail.com
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-6 h-6 mt-1">
                  <svg className="w-6 h-6 text-[#CFAE52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl text-white mb-2" data-lens="on">
                    Phone
                  </h3>
                  <p className="text-white/70" data-lens="on">
                    01880230924
                  </p>
                </div>
              </div>

              {/* Follow Us */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-6 h-6 mt-1">
                  <svg className="w-6 h-6 text-[#CFAE52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl text-white mb-2" data-lens="on">
                    Follow Us
                  </h3>
                  <div className="flex items-center space-x-4 mt-2">
                    {/* LinkedIn */}
                    <a
                      href="https://www.linkedin.com/in/mahdi9162/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-white/70 hover:bg-[#CFAE52] hover:text-black transition-all duration-300"
                      data-lens="on"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.615 3.185A2.385 2.385 0 0017.615 2H6.385A2.385 2.385 0 004.385 3.185 2.385 2.385 0 004 4.385V19.615c0 .59.224 1.155.635 1.566A2.21 2.21 0 006.385 22h11.23a2.21 2.21 0 001.75-.635 2.385 2.385 0 00.635-1.566V4.385A2.385 2.385 0 0019.615 3.185zM8.5 18.5h-2v-9h2v9zm-1-10.125a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zM18.5 18.5h-2v-4.5c0-1.08-.02-2.46-1.5-2.46s-1.735 1.16-1.735 2.38V18.5h-2v-9h1.9v.85h.025a2.025 2.025 0 011.825-1c1.95 0 2.3 1.285 2.3 2.95V18.5z" />
                      </svg>
                    </a>

                    {/* Facebook */}
                    <a
                      href="https://www.facebook.com/mahdi916"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-white/70 hover:bg-[#CFAE52] hover:text-black transition-all duration-300"
                      data-lens="on"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    </a>

                    {/* Instagram */}
                    <a
                      href="https://www.instagram.com/rifu91629/?hl=en"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-white/70 hover:bg-[#CFAE52] hover:text-black transition-all duration-300"
                      data-lens="on"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12.017 0C8.396 0 7.929.01 6.71.048 5.498.087 4.79.167 4.204.31c-.63.148-1.13.348-1.618.832-.49.48-.686.984-.832 1.618-.143.585-.223 1.293-.262 2.505C.01 7.929 0 8.396 0 12.017s.01 4.087.048 5.303c.039 1.212.119 1.92.262 2.505.148.634.348 1.138.832 1.618.48.49.984.686 1.618.832.585.143 1.293.223 2.505.262 1.219.038 1.686.048 5.303.048s4.087-.01 5.303-.048c1.212-.039 1.92-.119 2.505-.262.634-.148 1.138-.348 1.618-.832.49-.48.686-.984.832-1.618.143-.585.223-1.293.262-2.505C23.99 16.087 24 15.62 24 12.017s-.01-4.087-.048-5.303c-.039-1.212-.119-1.92-.262-2.505-.148-.634-.348-1.138-.832-1.618-.48-.49-.984-.686-1.618-.832C19.655.167 18.947.087 17.735.048 16.516.01 16.049 0 12.017 0zm0 2.162c3.204 0 3.584.012 4.85.07 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.06 1.265.072 1.646.072 4.85s-.012 3.584-.072 4.85c-.053 1.17-.249 1.805-.413 2.227-.217.562-.477.96-.896 1.382-.419.419-.819.679-1.381.896-.422.164-1.057.36-2.227.413-1.265.06-1.646.072-4.85.072s-3.584-.012-4.85-.072c-1.17-.053-1.805-.249-2.227-.413a3.81 3.81 0 01-1.382-.896 3.81 3.81 0 01-.896-1.382c-.164-.422-.36-1.057-.413-2.227-.06-1.265-.072-1.646-.072-4.85s.012-3.584.072-4.85c.053-1.17.249-1.805.413-2.227.217-.562.477-.96.896-1.382.419-.419.819-.679 1.381-.896.422-.164 1.057-.36 2.227-.413 1.265-.06 1.646-.072 4.85-.072zm0 3.676a6.179 6.179 0 100 12.358 6.179 6.179 0 000-12.358zm0 10.196a4.017 4.017 0 110-8.034 4.017 4.017 0 010 8.034zm7.846-10.405a1.441 1.441 0 11-2.883 0 1.441 1.441 0 012.883 0z" clipRule="evenodd" />
                      </svg>
                    </a>

                    {/* Twitter (X) */}
                    <a
                      href="https://x.com/mahdi9162"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-white/70 hover:bg-[#CFAE52] hover:text-black transition-all duration-300"
                      data-lens="on"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection