import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { withRetry } from '@/lib/utils'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  let next = searchParams.get('next') ?? '/onboarding'
  
  if (!next.startsWith('/')) {
    next = '/onboarding'
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        try {
          const { data: profile, error: profileError } = await withRetry(async () => {
            return await supabase
              .from('profile')
              .select('onboarding_completed')
              .eq('id', user.id)
              .single()
          })

          if (profileError || !profile) {
            console.log('OAuth: New user, redirecting to onboarding')
            next = '/onboarding'
          } else if (profile.onboarding_completed) {
            console.log('OAuth: Returning user, redirecting to dashboard')
            next = '/keys'
          } else {
            console.log('OAuth: Incomplete onboarding, redirecting to onboarding')
            next = '/onboarding'
          }
        } catch (err) {
          console.error('Error checking profile after retries:', err)
          next = '/onboarding'
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}