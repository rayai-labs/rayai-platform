"use client"

import { siteContent } from "@/lib/content"
import { GitHubStars } from "@/components/github-stars"

export function RayFoundation() {
  const { headline, description, descriptionEnd, companies } = siteContent.rayFoundation

  return (
    <section id="community" className="border-b border-border bg-zinc-900/70 py-20 md:py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center">
          <div className="mb-8 flex justify-center">
            <GitHubStars />
          </div>

          <h2 className="mb-10 text-3xl font-medium tracking-tight text-foreground md:text-4xl">{headline}</h2>

          {companies && companies.length > 0 && (
            <div className="mb-10">
              <div className="overflow-hidden xl:hidden">
                <div className="flex animate-marquee-rtl gap-12 md:gap-16">
                  {companies.map((company, index) => (
                    <div
                      key={`${company}-${index}`}
                      className="whitespace-nowrap text-2xl font-light tracking-tight text-foreground/70 md:text-3xl"
                    >
                      {company}
                    </div>
                  ))}
                  {companies.map((company, index) => (
                    <div
                      key={`${company}-duplicate-${index}`}
                      className="whitespace-nowrap text-2xl font-light tracking-tight text-foreground/70 md:text-3xl"
                    >
                      {company}
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden xl:flex xl:justify-center xl:gap-16">
                {companies.map((company, index) => (
                  <div
                    key={`${company}-static-${index}`}
                    className="text-3xl font-light tracking-tight text-foreground/70"
                  >
                    {company}
                  </div>
                ))}
              </div>
            </div>
          )}

          {description && (
            <p className="text-lg leading-[1.7] text-muted-foreground md:text-xl md:leading-[1.8] max-w-4xl mx-auto mb-8">
              {description}
            </p>
          )}

          <p className="text-base leading-[1.7] text-muted-foreground md:text-lg md:leading-[1.8] max-w-3xl mx-auto">
            {descriptionEnd}
          </p>

          <div className="mt-10 flex justify-center">
            <a
              href="/join-slack"
              className="inline-flex items-center gap-2 rounded-lg border border-wisteria/30 bg-wisteria/10 px-6 py-3 text-sm font-medium text-wisteria transition-all hover:bg-wisteria/20 hover:border-wisteria/50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
              </svg>
              Join Ray Slack
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
