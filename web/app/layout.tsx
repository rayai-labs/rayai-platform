import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import { AnimatedBackground } from "@/components/animated-background"
import { PostHogProvider } from "@/components/posthog-provider"
import { PostHogPageView } from "@/components/posthog-pageview"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "RayAI - Agentic AI Infrastructure",
  description: "Scale AI Agents without Infra complexity",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <PostHogProvider>
        <body className={`font-sans ${inter.variable} antialiased`}>
          <AnimatedBackground />
          <div className="relative z-10">
            <Suspense fallback={<div>Loading...</div>}>
              <PostHogPageView />
              {children}
            </Suspense>
          </div>
        </body>
      </PostHogProvider>
    </html>
  )
}
