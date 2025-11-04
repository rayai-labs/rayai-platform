"use client"

import { siteContent } from "@/lib/content"

export function Independent() {
  const { headline, description, items } = siteContent.independent

  return (
    <section className="relative py-24 border-b border-border/50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-12 text-center text-balance bg-gradient-to-r from-wisteria via-plum to-lavender-pink bg-clip-text text-transparent leading-normal pb-2">
            {headline}
          </h2>

          {/* Description paragraph */}
          <p className="text-lg sm:text-xl text-muted-foreground text-center mb-12 leading-relaxed max-w-4xl mx-auto">
            {description}
          </p>

          {/* Feature list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-lg bg-card/50 border border-border/50 hover:border-wisteria/30 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-wisteria" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-base text-foreground/90 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
