'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

const SocialLinks = () => {
  const socialLinks = [
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/mahdi9162',
      icon: (
        <svg aria-hidden="true" className="h-6 w-6" fill="#0077b5" viewBox="0 0 24 24">
          <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.25 6.5 1.75 1.75 0 016.5 8.25zM19 19h-3v-4.75c0-1.4-1.2-2.5-2.5-2.5S11 12.85 11 14.25V19h-3v-9h2.9v1.3a3.1 3.1 0 012.8-1.5c2.2 0 3.8 1.8 3.8 4.2V19z" />
        </svg>
      )
    },
    {
      name: 'Google',
      href: '#',
      icon: (
        <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24">
          <path 
            d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C14.76,4.73 16.04,5.7 17.06,6.66L19.16,4.68C17.38,3.12 15.08,2 12.19,2C6.92,2 2.73,6.23 2.73,12C2.73,17.77 6.92,22 12.19,22C17.6,22 21.54,18.33 21.54,12.27C21.54,11.75 21.48,11.43 21.35,11.1Z" 
            fill="#4285F4"
          />
        </svg>
      )
    }
  ]

  return (
    <div className="flex items-center space-x-4">
      {socialLinks.map((link) => (
        <motion.div
          key={link.name}
          whileHover={{ 
            scale: 1.2,
            rotate: 5,
          }}
          whileTap={{ scale: 0.9 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 10 
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-transparent p-0 h-auto w-auto group"
            data-magnetic
            asChild
          >
            <a
              aria-label={`${link.name} Profile`}
              href={link.href}
              className="transition-all duration-700"
            >
              <div className="group-hover:brightness-0 group-hover:saturate-100 group-hover:sepia group-hover:hue-rotate-[45deg] transition-all duration-700" style={{ filter: 'none' }}>
                {link.icon}
              </div>
            </a>
          </Button>
        </motion.div>
      ))}
    </div>
  )
}

export default SocialLinks