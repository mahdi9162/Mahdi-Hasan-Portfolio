'use client'

import { useCallback, useEffect, useState } from 'react'

const INTRO_SESSION_KEY = 'portfolioIntroSeen'
type FirstEntryIntroState = 'checking' | 'show-intro' | 'skip-intro'

let resolvedIntroState: FirstEntryIntroState = 'checking'

export const useFirstEntryIntro = () => {
  const [state, setState] = useState<FirstEntryIntroState>(resolvedIntroState)

  useEffect(() => {
    if (resolvedIntroState !== 'checking') {
      setState(resolvedIntroState)
      return
    }

    try {
      if (sessionStorage.getItem(INTRO_SESSION_KEY)) {
        resolvedIntroState = 'skip-intro'
        setState('skip-intro')
        return
      }

      sessionStorage.setItem(INTRO_SESSION_KEY, '1')
      resolvedIntroState = 'show-intro'
      setState('show-intro')
    } catch {
      // If session storage is unavailable, still provide the intro for this mount.
      resolvedIntroState = 'show-intro'
      setState('show-intro')
    }
  }, [])

  const complete = useCallback(() => {
    resolvedIntroState = 'skip-intro'
    setState('skip-intro')
  }, [])

  return {
    isChecking: state === 'checking',
    isVisible: state === 'show-intro',
    complete,
  }
}
