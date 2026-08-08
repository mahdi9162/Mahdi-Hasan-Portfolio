'use client'

import { useCallback, useEffect, useState } from 'react'

const FIRST_ENTRY_SESSION_KEY = 'portfolioIntroSeen'
let hasCheckedDocumentNavigation = false

const isBrowserReload = () => {
  const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
  return navigationEntry?.type === 'reload'
}

export const useReloadShutter = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (hasCheckedDocumentNavigation) return
    hasCheckedDocumentNavigation = true

    try {
      const hasSeenFirstEntryIntro = sessionStorage.getItem(FIRST_ENTRY_SESSION_KEY) === '1'

      if (hasSeenFirstEntryIntro && isBrowserReload()) {
        setIsVisible(true)
      }
    } catch {
      // Without session storage, the first-entry state cannot be established safely.
    }
  }, [])

  const complete = useCallback(() => setIsVisible(false), [])

  return { isVisible, complete }
}
