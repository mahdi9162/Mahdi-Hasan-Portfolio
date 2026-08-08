'use client'

import { useCallback, useEffect, useState } from 'react'

const INTRO_SESSION_KEY = 'portfolioIntroSeen'

export const useFirstEntryIntro = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(INTRO_SESSION_KEY)) return

      sessionStorage.setItem(INTRO_SESSION_KEY, '1')
      setIsVisible(true)
    } catch {
      // If session storage is unavailable, still provide the intro for this mount.
      setIsVisible(true)
    }
  }, [])

  const complete = useCallback(() => setIsVisible(false), [])

  return { isVisible, complete }
}
