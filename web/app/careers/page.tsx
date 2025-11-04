import { Header } from "@/components/sections/header"
import { Careers } from "@/components/sections/careers"
import { Footer } from "@/components/sections/footer"

export default function CareersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <Careers />
      </div>
      <Footer />
    </div>
  )
}
