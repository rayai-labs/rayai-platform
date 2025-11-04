import { siteContent } from "@/lib/content"

export function SocialProof() {
  const { label, companies } = siteContent.socialProof

  return (
    <section id="about" className="py-24 bg-card/70 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-light text-muted-foreground uppercase tracking-wider mb-12">{label}</p>
          <div className="flex flex-wrap items-center justify-center gap-16 opacity-50">
            {companies.map((company) => (
              <div key={company} className="text-3xl font-light tracking-tight">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
