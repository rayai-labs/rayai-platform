"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function JoinSlackPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const data = {
      email: formData.get("email"),
      name: formData.get("name"),
      company: formData.get("company"),
      jobTitle: formData.get("jobTitle"),
      familiarity: formData.get("familiarity"),
      buildPlan: formData.get("buildPlan"),
      timestamp: new Date().toISOString(),
    }

    try {
      const response = await fetch("/api/submit-slack-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to submit form")
      }

      setIsSuccess(true)
    } catch (err) {
      setError("Something went wrong. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container mx-auto flex h-16 items-center px-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to home
            </Link>
          </div>
        </header>

        <main className="container mx-auto max-w-2xl px-4 py-16 md:py-24">
          <div className="text-center">
            <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-full bg-wisteria/20">
              <svg className="h-8 w-8 text-wisteria" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="mb-4 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">You're all set!</h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Thank you for joining the Ray community. Click the button below to join our Slack workspace.
            </p>

            <a
              href="https://join.slack.com/t/ray/shared_invite/zt-3fmti8rea-DO4Tg2pClpi8vpaWmoGyPg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-lg bg-wisteria px-8 py-4 text-lg font-medium text-wisteria-foreground hover:bg-wisteria/90 transition-colors"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
              </svg>
              Join Ray Slack
            </a>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to home
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto max-w-2xl px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-wisteria/30 bg-wisteria/10 px-6 py-2">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
            </svg>
            <span className="text-sm font-medium text-wisteria">Join the Community</span>
          </div>

          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">Join Ray Slack</h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            Connect with the Ray community, get help, and stay updated on the latest developments.
          </p>
        </div>

        {/* Form placeholder */}
        <div className="rounded-lg border border-border bg-card p-8 md:p-12">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                Email address <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-wisteria focus:outline-none focus:ring-2 focus:ring-wisteria/20"
                required
              />
            </div>

            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
                Full name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your name"
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-wisteria focus:outline-none focus:ring-2 focus:ring-wisteria/20"
                required
              />
            </div>

            <div>
              <label htmlFor="company" className="mb-2 block text-sm font-medium text-foreground">
                Company <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="company"
                name="company"
                placeholder="Your company"
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-wisteria focus:outline-none focus:ring-2 focus:ring-wisteria/20"
                required
              />
            </div>

            <div>
              <label htmlFor="jobTitle" className="mb-2 block text-sm font-medium text-foreground">
                Job Title/Occupation <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                placeholder="Your job title"
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-wisteria focus:outline-none focus:ring-2 focus:ring-wisteria/20"
                required
              />
            </div>

            <div>
              <label htmlFor="familiarity" className="mb-2 block text-sm font-medium text-foreground">
                Familiarity with Ray <span className="text-destructive">*</span>
              </label>
              <select
                id="familiarity"
                name="familiarity"
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground focus:border-wisteria focus:outline-none focus:ring-2 focus:ring-wisteria/20"
                required
              >
                <option value="">Select an option</option>
                <option value="exploring">Exploring Ray</option>
                <option value="experimenting">Experimenting with Ray</option>
                <option value="migrating">Migrating to Ray</option>
                <option value="production">In production with Ray</option>
              </select>
            </div>

            <div>
              <label htmlFor="buildPlan" className="mb-2 block text-sm font-medium text-foreground">
                Describe what you plan to build on Ray <span className="text-destructive">*</span>
              </label>
              <textarea
                id="buildPlan"
                name="buildPlan"
                placeholder="Tell us about your project or use case..."
                rows={4}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-wisteria focus:outline-none focus:ring-2 focus:ring-wisteria/20 resize-none"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-wisteria text-wisteria-foreground hover:bg-wisteria/90"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Get Slack Invite"}
            </Button>

            {error && <p className="text-sm text-destructive text-center">{error}</p>}
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            By joining, you agree to our community guidelines and code of conduct.
          </p>
        </div>
      </main>
    </div>
  )
}
