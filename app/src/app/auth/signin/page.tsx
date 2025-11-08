"use client"

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Header } from "@/components/header"
import { determineUserRoute } from '@/lib/utils'
import Link from 'next/link'

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const route = await determineUserRoute()
        router.push(route)
      }
    }
    checkUser()
  }, [router, supabase.auth])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) {
        console.error('Error signing in:', error)
        // TODO: Replace with proper toast notification
        alert('Error signing in. Please try again.')
      }
    } catch (err) {
      console.error('Sign in error:', err)
      // TODO: Replace with proper toast notification  
      alert('Error signing in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-md mx-auto p-4 sm:p-6 lg:p-8 mt-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground leading-tight">
            Sign In
          </h1>
        </div>
        
        {/* Sign In Card */}
        <div className="bg-muted border border-border rounded-xl p-6 sm:p-8 shadow-2xl">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className={`
              w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg border text-base font-medium transition-all duration-200
              ${isLoading 
                ? 'bg-muted text-muted-foreground cursor-not-allowed border-border opacity-60' 
                : 'bg-background text-foreground hover:bg-muted border-border cursor-pointer hover:shadow-md'
              }
            `}
          >
            {!isLoading && (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </button>
          
          <p className="text-xs text-muted-foreground text-center mt-4 leading-relaxed">
            By continuing, you agree to our <Link href="/terms" className="underline hover:text-foreground transition-colors">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-foreground transition-colors">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}