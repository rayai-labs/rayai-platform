import { siteContent } from "@/lib/content"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

export function Careers() {
  const { headline, subheadline, cta, ctaLink, badge } = siteContent.careers

  return (
    <section className="relative py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance">{headline}</h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground text-balance">{subheadline}</p>

          {/* CTA Button */}
          <div className="pt-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-wisteria to-plum hover:from-wisteria/90 hover:to-plum/90 text-white font-semibold"
            >
              <a href={ctaLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                {cta}
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>

          {/* Backed by Badge */}
          <div className="pt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 border border-border">
              <Image
                src={badge.logo || "/placeholder.svg"}
                alt="Open Core Ventures"
                width={24}
                height={24}
                className="rounded"
              />
              <span className="text-sm text-muted-foreground">{badge.text}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
