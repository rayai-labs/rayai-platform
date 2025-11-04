import type React from "react"
import { Card } from "@/components/ui/card"
import { siteContent } from "@/lib/content"
import { AnimatedRotatingText } from "@/components/animated-rotating-text"

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Puzzle: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
      />
    </svg>
  ),
  Network: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
      />
    </svg>
  ),
  Container: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  ),
  ShieldCheck: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  ),
  Chip: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
      />
    </svg>
  ),
  CloudStack: ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01" />
    </svg>
  ),
}

export function Features() {
  const { headline, rotatingPhrases, items } = siteContent.features

  return (
    <section id="features" className="relative py-24 bg-background/70 border-b border-border overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 text-balance tracking-tight leading-normal pb-2">
            {headline}{" "}
            <span className="inline">
              <AnimatedRotatingText
                phrases={rotatingPhrases}
                className="text-transparent bg-gradient-to-r from-wisteria to-lavender-pink bg-clip-text"
              />{" "}
              <span>agents</span>
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {items.map((item, index) => {
            const Icon = iconMap[item.icon]
            const colors = [
              {
                bg: "bg-royal-purple/10",
                text: "text-royal-purple",
                border: "border-royal-purple/30",
                glow: "group-hover:shadow-royal-purple/30",
              },
              {
                bg: "bg-wisteria/10",
                text: "text-wisteria",
                border: "border-wisteria/30",
                glow: "group-hover:shadow-wisteria/30",
              },
              { bg: "bg-plum/10", text: "text-plum", border: "border-plum/30", glow: "group-hover:shadow-plum/30" },
              {
                bg: "bg-lavender-pink/10",
                text: "text-lavender-pink",
                border: "border-lavender-pink/30",
                glow: "group-hover:shadow-lavender-pink/30",
              },
              {
                bg: "bg-mimi-pink/10",
                text: "text-mimi-pink",
                border: "border-mimi-pink/30",
                glow: "group-hover:shadow-mimi-pink/30",
              },
              {
                bg: "bg-wisteria/10",
                text: "text-wisteria",
                border: "border-wisteria/30",
                glow: "group-hover:shadow-wisteria/30",
              },
            ]
            const color = colors[index % colors.length]

            return (
              <Card
                key={item.title}
                className={`group p-8 hover:shadow-2xl transition-all duration-300 border ${color.border} hover:border-opacity-80 hover:-translate-y-1 ${color.glow} bg-card/80 backdrop-blur-sm`}
              >
                <div
                  className={`mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl ${color.bg} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`h-8 w-8 ${color.text}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3 tracking-tight group-hover:text-foreground transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{item.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
