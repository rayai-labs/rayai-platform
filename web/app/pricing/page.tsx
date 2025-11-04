import { Header } from "@/components/sections/header"
import { Pricing } from "@/components/sections/pricing"
import { CTA } from "@/components/sections/cta"
import { Footer } from "@/components/sections/footer"

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  )
}
