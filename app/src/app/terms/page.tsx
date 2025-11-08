import { Header } from "@/components/header"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 mt-12">
        <div className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8 text-foreground">Terms of Service</h1>
          
          <div className="space-y-6 text-muted-foreground">
            <p className="text-lg">
              Last updated: [Date to be added]
            </p>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
              <p>
                By accessing and using RayAI's services, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Use License</h2>
              <p>
                Permission is granted to temporarily use RayAI's services for personal and commercial purposes. This license shall automatically terminate if you violate any of these restrictions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Disclaimer</h2>
              <p>
                The materials on RayAI's platform are provided on an 'as is' basis. RayAI makes no warranties, expressed or implied, and hereby disclaims all other warranties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Limitations</h2>
              <p>
                In no event shall RayAI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use RayAI's services.
              </p>
            </section>

            <div className="mt-8 p-4 bg-muted border border-border rounded-lg">
              <p className="text-sm text-muted-foreground italic">
                Note: This is placeholder content. The actual Terms of Service will be provided and updated accordingly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}