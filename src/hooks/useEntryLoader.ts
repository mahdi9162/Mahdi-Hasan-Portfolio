'use client'

import { useState, useEffect } from 'react'

export const useEntryLoader = () => {
  const [showEntryLoader, setShowEntryLoader] = useState(false)
  const [entryLoaderComplete, setEntryLoaderComplete] = useState(false)
  const [skipSmartLoader, setSkipSmartLoader] = useState(false)
  const [heroAnimationReady, setHeroAnimationReady] = useState(false)

  useEffect(() => {
    // Check if welcome loader has been shown this session
    const welcomeShown = sessionStorage.getItem('welcomeShown')
    
    if (!welcomeShown) {
      // First visit - show welcome loader, skip MH loader
      setShowEntryLoader(true)
      setEntryLoaderComplete(false)
      setSkipSmartLoader(true)
      setHeroAnimationReady(false)
    } else {
      // Returning visit - skip welcome loader, allow MH loader, hero ready immediately
      setShowEntryLoader(false)
      setEntryLoaderComplete(true)
      setSkipSmartLoader(false)
      setHeroAnimationReady(true)
    }
  }, [])

  const handleEntryComplete = () => {
    // Welcome loader completed - skip MH loader entirely
    setShowEntryLoader(false)
    setEntryLoaderComplete(true)
    // Trigger hero animation slightly before loader fully fades
    setTimeout(() => {
      setHeroAnimationReady(true)
    }, 200) // Start hero animation 200ms before loader finishes fading
  }

  return {
    showEntryLoader,
    entryLoaderComplete,
    handleEntryComplete,
    skipSmartLoader,
    heroAnimationReady // New flag for hero animation timing
  }
}