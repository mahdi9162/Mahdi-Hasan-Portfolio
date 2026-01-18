'use client'

import { useState, useEffect } from 'react'

export const useEntryLoader = () => {
  const [showEntryLoader, setShowEntryLoader] = useState(false)
  const [showRefreshLoader, setShowRefreshLoader] = useState(false)
  const [entryLoaderComplete, setEntryLoaderComplete] = useState(false)
  const [skipSmartLoader, setSkipSmartLoader] = useState(false)
  const [heroAnimationReady, setHeroAnimationReady] = useState(false)

  useEffect(() => {
    // Check if welcome loader has been shown this session
    const welcomeShown = sessionStorage.getItem('welcomeShown')
    
    // Detect if this is a page refresh/reload
    const isRefresh = window.performance.navigation.type === 1 || 
                     (window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming)?.type === 'reload'
    
    if (!welcomeShown) {
      // First visit - show welcome loader, skip MH loader, no refresh loader
      setShowEntryLoader(true)
      setShowRefreshLoader(false)
      setEntryLoaderComplete(false)
      setSkipSmartLoader(true)
      setHeroAnimationReady(false)
    } else if (isRefresh) {
      // Page refresh - show refresh loader, skip welcome and MH loader
      setShowEntryLoader(false)
      setShowRefreshLoader(true)
      setEntryLoaderComplete(false)
      setSkipSmartLoader(true)
      setHeroAnimationReady(false)
    } else {
      // Normal navigation - skip all loaders, allow MH loader, hero ready immediately
      setShowEntryLoader(false)
      setShowRefreshLoader(false)
      setEntryLoaderComplete(true)
      setSkipSmartLoader(false)
      setHeroAnimationReady(true)
    }
  }, [])

  const handleEntryComplete = () => {
    // Welcome loader completed - skip MH loader entirely
    setShowEntryLoader(false)
    setEntryLoaderComplete(true)
    
    // Delay hero animation reveal by 180ms after loader completes
    setTimeout(() => {
      setHeroAnimationReady(true)
    }, 180)
  }

  const handleRefreshComplete = () => {
    // Refresh loader completed - skip MH loader entirely
    setShowRefreshLoader(false)
    setEntryLoaderComplete(true)
    
    // Delay hero animation reveal by 180ms after loader completes
    setTimeout(() => {
      setHeroAnimationReady(true)
    }, 180)
  }

  return {
    showEntryLoader,
    showRefreshLoader,
    entryLoaderComplete,
    handleEntryComplete,
    handleRefreshComplete,
    skipSmartLoader,
    heroAnimationReady
  }
}