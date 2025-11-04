import { Button } from "@/components/ui/button"
import Image from "next/image"
import { siteContent } from "@/lib/content"

export function Hero() {
  const {
    badge,
    headline,
    headlineHighlight,
    subheadline,
    subheadlineNoWrap,
    subheadlineEnd,
    primaryCta,
    secondaryCta,
  } = siteContent.hero

  return (
    <section
      id="home"
      className="relative py-20 sm:py-24 lg:py-32 bg-background/80 border-b border-border/30 overflow-hidden"
    >
      <div className="absolute top-20 left-10 w-72 h-72 bg-wisteria/20 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-lavender-pink/20 rounded-full blur-3xl opacity-40" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-lavender-pink/10 border border-lavender-pink/30 px-4 py-2 text-sm font-light text-lavender-pink shadow-lg shadow-lavender-pink/20">
            <Image
              src={badge.logo || "/placeholder.svg"}
              alt="Open Core Ventures"
              width={20}
              height={20}
              className="h-5 w-5"
            />
            {badge.text}
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tighter text-balance mb-8 leading-[1.1]">
            {headline}
            <span className="bg-gradient-to-r from-wisteria via-plum to-lavender-pink bg-clip-text text-transparent">
              {headlineHighlight}
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground text-balance mb-10 leading-[1.6] font-light max-w-4xl mx-auto">
            {subheadline}
            <span className="whitespace-nowrap">{subheadlineNoWrap}</span>
            {subheadlineEnd}
          </p>

          <p className="text-sm text-muted-foreground/80 mb-6 font-light">
            Whether you're exploring or scaling, we're here to help
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="https://calendly.com/pavitra-rayai/25-min" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="text-base font-medium bg-royal-purple hover:bg-royal-purple/90 text-white shadow-xl shadow-royal-purple/30 hover:shadow-2xl hover:shadow-royal-purple/40 transition-all hover:scale-105 cursor-pointer"
              >
                {primaryCta}
              </Button>
            </a>
            <a
              href="/join-slack"
              className="w-auto inline-flex items-center gap-2 rounded-lg border border-wisteria/30 bg-wisteria/10 px-6 h-10 text-base font-medium text-wisteria transition-all hover:bg-wisteria/20 hover:border-wisteria/50 hover:scale-105 cursor-pointer"
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
