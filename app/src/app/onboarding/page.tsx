"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { useToast } from "@/components/ui/toast"
import { createClient } from '@/lib/supabase/client'
import { withRetry } from '@/lib/utils'

export default function OnboardingPage() {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    company: '',
    jobTitle: '',
    rayFamiliarity: '',
    projectDescription: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { addToast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        router.push('/auth/signin')
        return
      }

      setFormData(prev => ({
        ...prev,
        email: session.user.email || '',
        fullName: session.user.user_metadata?.full_name || ''
      }))
      
      setIsLoading(false)
    }
    
    getUser()
  }, [router, supabase.auth])

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
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/auth/signin')
        return
      }

      const { error } = await withRetry(async () => {
        return await supabase
          .from('profile')
          .update({
            email: formData.email,
            full_name: formData.fullName,
            company: formData.company,
            job_title: formData.jobTitle,
            ray_familiarity: formData.rayFamiliarity,
            project_description: formData.projectDescription,
            onboarding_completed: true
          })
          .eq('id', session.user.id)
      })

      if (error) {
        console.error('Error updating profile:', error)
        addToast('Something went wrong. Please try again.', 'error')
        return
      }
      
      router.push('/keys')
    } catch (err) {
      console.error('Submission error:', err)
      addToast('Something went wrong. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 mt-12">
          <div className="text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    )
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
              name="fullName"
              value={formData.fullName}
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
              name="rayFamiliarity"
              value={formData.rayFamiliarity}
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
              name="projectDescription"
              value={formData.projectDescription}
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