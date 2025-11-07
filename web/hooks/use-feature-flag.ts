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
  const [isEnabled, setIsEnabled] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.posthog) {
      return window.posthog.onFeatureFlags(() => {
        setIsEnabled(window.posthog?.isFeatureEnabled(flagName) ?? false)
      })
    }
  }, [flagName])

  return isEnabled ?? false
}