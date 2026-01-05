'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home') // Default to home instead of projects
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
    }

    // IntersectionObserver for all sections including hero
    const sections = ['hero', 'skills', 'projects', 'about', 'contact']
    const ratiosRef = new Map<string, number>()
    
    const observers = sections.map(section => {
      const element = document.getElementById(section)
      if (!element) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          // Update the intersection ratio for this section
          if (entry.isIntersecting) {
            ratiosRef.set(section, entry.intersectionRatio)
          } else {
            ratiosRef.delete(section)
          }
          
          // Find the section with the highest intersection ratio
          if (ratiosRef.size > 0) {
            let bestSection = ''
            let highestRatio = 0
            
            ratiosRef.forEach((ratio, sectionId) => {
              if (ratio > highestRatio) {
                highestRatio = ratio
                bestSection = sectionId
              }
            })
            
            // Map hero to home for navbar display
            const activeSection = bestSection === 'hero' ? 'home' : bestSection
            setActiveSection(activeSection)
          }
        },
        { 
          threshold: [0, 0.1, 0.25, 0.4, 0.6], // Multiple thresholds for precise detection
          rootMargin: '-110px 0px -60% 0px' // Navbar offset + bottom margin
        }
      )

      observer.observe(element)
      return observer
    })

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Initial check
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observers.forEach(observer => observer?.disconnect())
    }
  }, [])

  const handleNavClick = (sectionId: string) => {
    // Close mobile menu when nav item is clicked
    setMobileMenuOpen(false)
    
    if (sectionId === 'home') {
      // Scroll to very top for Home
      if ((window as any).lenis) {
        ;(window as any).lenis.scrollTo(0, {
          duration: 2.0,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        })
      }
    } else {
      const element = document.getElementById(sectionId)
      if (element && (window as any).lenis) {
        ;(window as any).lenis.scrollTo(element, {
          offset: -90,
          duration: 2.0,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        })
      }
    }
  }

  const handleLogoClick = () => {
    // Close mobile menu and scroll to top
    setMobileMenuOpen(false)
    
    // Logo also scrolls to top
    if ((window as any).lenis) {
      ;(window as any).lenis.scrollTo(0, {
        duration: 2.0,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      })
    }
  }

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ]

  return (
    <>
      <motion.header 
        className="fixed top-0 left-0 right-0 z-[90] transition-all duration-700 ease-out"
        style={{
          background: scrolled 
            ? 'rgba(0, 0, 0, 0.8)' 
            : 'transparent',
          backdropFilter: scrolled ? 'blur(12px) saturate(1.1)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px) saturate(1.1)' : 'none',
          borderBottom: scrolled 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Clickable to scroll to top */}
            <motion.div 
              className="text-xl tracking-[-0.02em] text-neutral-900 dark:text-primary cursor-pointer"
              data-lens="on"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              onClick={handleLogoClick}
            >
              MH
            </motion.div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex">
              <ul className="flex items-center space-x-8">
                {navItems.map((item) => (
                  <li key={item.id} className="relative">
                    <button
                      onClick={() => handleNavClick(item.id)}
                      className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-[#CFAE52] transition-colors duration-700 ease-out py-2 px-1 relative"
                      data-lens="on"
                    >
                      {item.label}
                      {/* Active indicator - tiny gold dot */}
                      {activeSection === item.id && (
                        <motion.div
                          className="absolute -bottom-1 left-1/2 w-1 h-1 bg-[#CFAE52] rounded-full"
                          layoutId="activeIndicator"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          style={{ transform: 'translateX(-50%)' }}
                        />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile Hamburger Button */}
            <button
              className="md:hidden p-2 text-neutral-600 dark:text-neutral-400 hover:text-[#CFAE52] transition-colors duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open menu"
              data-lens="on"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <motion.div
        className={`fixed top-16 left-0 right-0 z-[85] md:hidden transition-all duration-300 ease-out ${
          mobileMenuOpen 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="bg-black/90 backdrop-blur-lg border-b border-white/10 shadow-lg">
          <nav className="px-6 py-4">
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`block w-full text-left py-3 px-4 rounded-lg transition-all duration-300 ${
                      activeSection === item.id
                        ? 'bg-[#CFAE52]/20 text-[#CFAE52] border-l-4 border-[#CFAE52]'
                        : 'text-white/80 hover:text-[#CFAE52] hover:bg-white/5'
                    }`}
                    data-lens="on"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </motion.div>
    </>
  )
}

export default Navbar