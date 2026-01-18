'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Mail, MapPin, Phone } from 'lucide-react'
import { EASE_OUT_QUART } from '@/lib/animations'

interface FormData {
  name: string
  email: string
  phone: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

const ContactSection = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success'>('idle')

  // Animation variants - same pattern as Projects/About sections
  const containerVariants: Variants = {
    show: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { 
        duration: 0.6, 
        ease: EASE_OUT_QUART, 
        staggerChildren: 0.08, 
        delayChildren: 0 
      }
    },
    hide: { 
      // IMPORTANT: never fully hide the whole section
      opacity: 1,                 // was 0
      y: 8,                       // small move only
      filter: "blur(2px)",        // light blur only
      transition: { 
        duration: 0.35, 
        ease: EASE_OUT_QUART 
      }
    }
  }

  const leftVariants: Variants = {
    show: { 
      opacity: 1, 
      x: 0, 
      y: 0, 
      filter: "blur(0px)",
      transition: { 
        duration: 0.6, 
        ease: EASE_OUT_QUART 
      }
    },
    hide: { 
      opacity: 0.65,              // was 0
      x: -10,
      y: 8,
      filter: "blur(3px)",
      transition: { 
        duration: 0.35, 
        ease: EASE_OUT_QUART 
      }
    }
  }

  const rightVariants: Variants = {
    show: { 
      opacity: 1, 
      x: 0, 
      y: 0, 
      filter: "blur(0px)",
      transition: { 
        duration: 0.6, 
        ease: EASE_OUT_QUART 
      }
    },
    hide: { 
      opacity: 0.65,              // was 0
      x: 10,
      y: 8,
      filter: "blur(3px)",
      transition: { 
        duration: 0.35, 
        ease: EASE_OUT_QUART 
      }
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    // Simulate processing
    setTimeout(() => {
      setSubmitStatus('success')
      setIsSubmitting(false)
      // Reset form after success
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '', message: '' })
        setSubmitStatus('idle')
      }, 2000)
    }, 1500)
  }

  return (
    <section id="contact" className="scroll-mt-24 section-gap w-full bg-background-dark font-display my-28 md:pt-10 md:pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-start"
          initial="hide"
          whileInView="show"
          viewport={{ amount: 0.18, once: false }}
          variants={containerVariants}
          style={{ willChange: "transform, opacity, filter" }}
        >
          {/* Left Section: Premium Contact Info */}
          <motion.div 
            className="lg:col-span-5 flex flex-col md:gap-10 w-full md:max-w-[640px] md:mx-auto md:text-left lg:max-w-none lg:mx-0"
            variants={leftVariants}
            style={{ willChange: "transform, opacity, filter" }}
          >
            {/* Premium Headline */}
            <div className="space-y-6">
              <div className="space-y-1">
                <h1 className="text-2xl md:text-5xl lg:text-6xl leading-none font-semibold tracking-[-0.02em] text-white">
                  Open a
                </h1>
                <h1 className="text-4xl md:text-6xl lg:text-7xl leading-none font-semibold tracking-[-0.02em] text-primary/70">
                  Channel
                </h1>
              </div>
              
              {/* Progress Section */}
              <div className="flex flex-col gap-4 max-w-md mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-zinc-500 text-[13px] leading-relaxed">Securing message channel...</p>
                  <p className="text-[12px] font-medium text-primary tracking-[0.12em] uppercase">88%</p>
                </div>
                <div className="rounded-full bg-zinc-900 h-2 overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: '88%' }}></div>
                </div>
                
                {/* Premium highlight line */}
                <p className="mt-6 text-zinc-500 text-xs md:text-sm text-center md:text-start">Fast replies • Clear scope • Clean delivery</p>
              </div>
            </div>

            {/* Contact Info Block */}
            <div className="mt-8 pt-8 border-t border-white/5">
              <p className="text-zinc-500 text-[12px] tracking-[0.18em] uppercase mb-4">Contact</p>
              <p className="text-zinc-500 text-[13px] mt-2 mb-4">Based in Bangladesh • UTC+6</p>
              <div className="space-y-5">
                {/* Address */}
                <div className="flex items-center gap-3">
                  <MapPin className="text-primary/80 text-[18px]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-zinc-300 text-[14px] leading-relaxed">West Brahmondi, Narsingdi, Bangladesh</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <Mail className="text-primary/80 text-[18px]" />
                  <div className="flex-1 min-w-0">
                    <a 
                      href="mailto:hasanmahdi6060@gmail.com" 
                      className="text-zinc-300 text-[14px] leading-relaxed hover:text-zinc-100 hover:drop-shadow-[0_0_14px_rgba(223,181,42,0.18)] transition-all duration-300"
                    >
                      hasanmahdi6060@gmail.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3">
                  <Phone className="text-primary/80 text-[18px]" />
                  <div className="flex-1 min-w-0">
                    <a 
                      href="tel:01880230924" 
                      className="text-zinc-300 text-[14px] leading-relaxed hover:text-zinc-100 transition-colors"
                    >
                      01880230924
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="mt-8 hidden md:block">
              <p className="text-zinc-500 text-xs font-mono tracking-wide">
                System Status: {submitStatus === 'success' ? 'Message ready to send' : 'Waiting for user input'}
              </p>
            </div>
          </motion.div>

          {/* Right Section: Premium Contact Form */}
          <motion.div 
            className="lg:col-span-7 w-full md:max-w-[640px] md:mx-auto lg:max-w-none lg:mx-0"
            variants={rightVariants}
            style={{ willChange: "transform, opacity, filter" }}
          >
            <div className="glass-card rounded-2xl p-4 md:p-10 shadow-2xl relative overflow-hidden w-full max-w-full">
              {/* Subtle Background Pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
              
              <div className="relative z-10 flex flex-col gap-6 md:gap-8 min-w-0">
                <div>
                  <h2 className="text-xl md:text-[38px] leading-[1.1] font-semibold tracking-[-0.02em] text-white mb-2">Send me a message</h2>
                  <p className="text-zinc-500 text-xs md:text-sm leading-relaxed mt-2">Direct packet transfer to my terminal.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-6 min-w-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 min-w-0">
                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-200 text-sm font-medium mb-2 block">
                        Name
                      </label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full rounded-xl bg-zinc-800/40 border border-white/10 px-2 py-3 md:py-4 text-xs leading-[1.6] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition ${
                          errors.name ? 'border-red-500' : ''
                        }`}
                        placeholder="Your full name"
                        type="text"
                      />
                      {errors.name && (
                        <p className="text-red-400 text-xs px-1">{errors.name}</p>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-zinc-200 text-sm font-medium mb-2 block">
                        Email
                      </label>
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full rounded-xl bg-zinc-800/40 border border-white/10 px-2 py-3 md:py-4 text-xs leading-[1.6] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition ${
                          errors.email ? 'border-red-500' : ''
                        }`}
                        placeholder="your.email@example.com"
                        type="email"
                      />
                      {errors.email && (
                        <p className="text-red-400 text-xs px-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-200 text-sm font-medium mb-2 block">
                      Phone (optional)
                    </label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-xl bg-zinc-800/40 border border-white/10 px-2 py-3 md:py-4 text-xs leading-[1.6] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
                      placeholder="Your phone number (optional)"
                      type="text"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-200 text-sm font-medium mb-2 block">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl bg-zinc-800/40 border border-white/10 px-2 py-3 md:py-4 text-xs leading-[1.6] text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition resize-none min-h-[120px] md:min-h-[160px] max-h-[140px] md:max-h-[170px] ${
                        errors.message ? 'border-red-500' : ''
                      }`}
                      placeholder="Tell me about your project, timeline, and any specific requirements..."
                      rows={5}
                    />
                    {errors.message && (
                      <p className="text-red-400 text-xs px-1">{errors.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-4 flex h-10 md:h-14 items-center justify-center rounded-xl bg-primary text-black text-xs md;text-[13px] tracking-[0.24em] uppercase font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                    <svg 
                      className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default ContactSection