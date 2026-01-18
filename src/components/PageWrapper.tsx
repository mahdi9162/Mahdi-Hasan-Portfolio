'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SmartLoader from './SmartLoader'

interface PageWrapperProps {
  children: React.ReactNode
  entryLoaderComplete?: boolean
  skipSmartLoader?: boolean // New prop to skip SmartLoader entirely
}

const PageWrapper = ({ children, entryLoaderComplete = true, skipSmartLoader = false }: PageWrapperProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)

  const handleLoadingComplete = () => {
    setIsLoading(false)
    // Immediate content reveal after loader completes
    setTimeout(() => {
      setShowContent(true)
    }, 100)
  }

  // Handle entry loader completion and SmartLoader logic
  useEffect(() => {
    if (skipSmartLoader) {
      // Skip SmartLoader entirely (after welcome loader)
      setIsLoading(false)
      setShowContent(true)
    } else if (entryLoaderComplete) {
      // Entry loader is complete, proceed with SmartLoader
      setIsLoading(true)
      setShowContent(false)
    } else {
      // Entry loader is still running, don't show anything
      setIsLoading(false)
      setShowContent(false)
    }
  }, [entryLoaderComplete, skipSmartLoader])

  // Prevent any flash of content during loading
  useEffect(() => {
    // Ensure body stays black during loading
    document.body.style.backgroundColor = '#000000'
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.body.style.backgroundColor = ''
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (!isLoading && showContent) {
      // Restore normal body styles after content is shown
      setTimeout(() => {
        document.body.style.backgroundColor = ''
        document.body.style.overflow = ''
      }, 500)
    }
  }, [isLoading, showContent])

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && entryLoaderComplete && !skipSmartLoader && (
          <SmartLoader 
            key="loader" 
            onComplete={handleLoadingComplete}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showContent && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ backgroundColor: 'transparent' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default PageWrapper