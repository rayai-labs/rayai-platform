import { Header } from "@/components/sections/header"
import { Hero } from "@/components/sections/hero"
import { RayFoundation } from "@/components/sections/ray-foundation"
import { Features } from "@/components/sections/features"
import { Independent } from "@/components/sections/independent"
import { CTA } from "@/components/sections/cta"
import { Footer } from "@/components/sections/footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <RayFoundation />
      <Features />
      <Independent />
      <CTA />
      <Footer />
    </div>
  )
}
