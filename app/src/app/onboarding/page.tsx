"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { useToast } from "@/components/ui/toast"

export default function OnboardingPage() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    company: '',
    jobTitle: '',
    familiarity: '',
    buildPlan: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { addToast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Send to API endpoint
      console.log('Form data:', formData)
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
      
      addToast('Account created successfully!', 'success')
      
      // Redirect to keys page
      router.push('/keys')
    } catch (err) {
      addToast('Something went wrong. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 sm:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-foreground leading-tight">
            Get Your API Key
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Tell us about your project to get started with RayAI
          </p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-muted border border-border rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl">
          
          <div className="mb-6">
            <label className="block mb-2 text-foreground font-semibold text-sm">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full p-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-foreground font-semibold text-sm">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              className="w-full p-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-foreground font-semibold text-sm">
              Company *
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Your company"
              required
              className="w-full p-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-foreground font-semibold text-sm">
              Job Title *
            </label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="Your job title"
              required
              className="w-full p-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-foreground font-semibold text-sm">
              Familiarity with Ray *
            </label>
            <select
              name="familiarity"
              value={formData.familiarity}
              onChange={handleChange}
              required
              className="w-full p-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            >
              <option value="">Select an option</option>
              <option value="exploring">Exploring Ray</option>
              <option value="experimenting">Experimenting with Ray</option>
              <option value="migrating">Migrating to Ray</option>
              <option value="production">In production with Ray</option>
            </select>
          </div>

          <div className="mb-8">
            <label className="block mb-2 text-foreground font-semibold text-sm">
              What do you plan to build? *
            </label>
            <textarea
              name="buildPlan"
              value={formData.buildPlan}
              onChange={handleChange}
              placeholder="Tell us about your project..."
              rows={4}
              required
              className="w-full p-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                px-8 py-3 text-base font-medium rounded-lg border transition-all duration-200
                ${isSubmitting 
                  ? 'bg-muted text-muted-foreground cursor-not-allowed border-border' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 border-primary cursor-pointer'
                }
              `}
            >
              {isSubmitting ? "Generating API Key..." : "Generate API Key"}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}