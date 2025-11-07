"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { siteContent } from "@/lib/content"
import { Check, Plus } from "lucide-react"
import { useFeatureFlag } from "@/hooks/use-feature-flag"

export function Pricing() {
  const { headline, subheadline, tiers, features } = siteContent.pricing
  const signupFlowEnabled = useFeatureFlag('signup-flow')

  return (
    <section id="pricing" className="relative py-24 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance tracking-tight leading-normal pb-2">
            {headline}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{subheadline}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {tiers.map((tier) => {
            const tierFeatures = tier.name === "Starter" ? features.starter : features.enterprise
            return (
              <Card
                key={tier.name}
                className="relative p-10 border-2 border-wisteria shadow-2xl shadow-wisteria/20 bg-card/90 backdrop-blur-sm flex flex-col"
              >
                {/* Tier Name */}
                <div className="mb-6">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-wisteria to-lavender-pink bg-clip-text text-transparent">
                    {tier.name}
                  </h3>
                </div>

                {/* Pricing - Made more prominent */}
                <div className="mb-6 pb-6 border-b border-border/50">
                  {tier.pricing?.map((line, index) => (
                    <p
                      key={index}
                      className={
                        index === 0 ? "text-3xl font-bold text-foreground mb-1" : "text-base text-muted-foreground"
                      }
                    >
                      {line}
                    </p>
                  ))}
                </div>

                {/* Best For Section */}
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-wider text-wisteria/70 font-semibold mb-2">Best For</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tier.bestFor}</p>
                </div>

                {/* Features */}
                <div className="flex-1 mb-8">
                  <ul className="space-y-3">
                    {tierFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        {tier.name === "Enterprise" && index === 0 ? (
                          <Check className="h-5 w-5 text-lavender-pink flex-shrink-0 mt-0.5" />
                        ) : tier.name === "Enterprise" && index > 0 ? (
                          <Plus className="h-5 w-5 text-wisteria flex-shrink-0 mt-0.5" />
                        ) : (
                          <Check className="h-5 w-5 text-wisteria flex-shrink-0 mt-0.5" />
                        )}
                        <span
                          className={`text-sm leading-relaxed ${
                            feature === "Everything included in Cloud"
                              ? "text-lavender-pink font-semibold"
                              : "text-foreground/90"
                          }`}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="flex justify-center">
                  <a 
                    href={
                      tier.name === "Starter" && signupFlowEnabled 
                        ? tier.ctaLink 
                        : tier.name === "Starter" 
                        ? "https://calendly.com/pavitra-rayai/25-min"
                        : tier.ctaLink
                    } 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-wisteria to-lavender-pink hover:opacity-90 px-12"
                    >
                      {tier.name === "Starter" && signupFlowEnabled 
                        ? tier.cta 
                        : tier.name === "Starter" 
                        ? "Talk to us"
                        : tier.cta}
                    </Button>
                  </a>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
