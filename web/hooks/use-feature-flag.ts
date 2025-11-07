"use client"

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    posthog?: {
      isFeatureEnabled: (flag: string) => boolean
      onFeatureFlags: (callback: () => void) => void
    }
  }
}

export function useFeatureFlag(flagName: string): boolean {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.onFeatureFlags(() => {
        setIsEnabled(window.posthog?.isFeatureEnabled(flagName) || false)
        setIsLoaded(true)
      })

      setIsEnabled(window.posthog.isFeatureEnabled(flagName))
      setIsLoaded(true)
    }
  }, [flagName])

  return isEnabled
}