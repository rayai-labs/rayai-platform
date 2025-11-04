"use client"

import type React from "react"
import { useEffect, useState } from "react"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
      const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"

      if (apiKey) {
        // Dynamically import PostHog only if API key is available
        import("posthog-js")
          .then((posthogModule) => {
            const posthog = posthogModule.default
            posthog.init(apiKey, {
              api_host: host,
              person_profiles: "identified_only",
              capture_pageview: false,
              capture_pageleave: true,
            })
            setIsInitialized(true)
          })
          .catch((error) => {
            console.warn("PostHog failed to initialize:", error)
          })
      }
    }
  }, [])

  return <>{children}</>
}
