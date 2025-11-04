import { siteContent } from "@/lib/content"

export function CTA() {
  const { headline, subheadline, careersButton, careersLink } = siteContent.cta

  return (
    <section
      id="solutions"
      className="relative py-32 bg-gradient-to-br from-royal-purple via-wisteria to-plum text-primary-foreground border-b border-primary-foreground/20 overflow-hidden"
    >
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-lavender-pink/30 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-mimi-pink/30 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 text-balance tracking-tight drop-shadow-lg">
            {headline}
          </h2>
          <p className="text-xl mb-12 text-primary-foreground/95 text-balance leading-relaxed font-light max-w-2xl mx-auto">
            {subheadline}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
            <a
              href="/join-slack"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-royal-purple transition-all hover:bg-white/90 hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl w-auto"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
              </svg>
              Join Ray Slack
            </a>

            <a
              href={careersLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-black/80 backdrop-blur-sm border border-white/20 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-black/90 hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl w-auto"
            >
              {careersButton}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
