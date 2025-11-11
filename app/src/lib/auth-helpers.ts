import { createClient } from '@/lib/supabase/client'
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

export interface AuthValidationResult {
  isValid: boolean
  shouldSignOut: boolean
  error?: string
}

type AddToastFunction = (message: string, type: 'success' | 'error') => void

/**
 * Validates the current user session and handles broken sessions gracefully
 */
export async function validateSession(): Promise<AuthValidationResult> {
  const supabase = createClient()
  
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      return {
        isValid: false,
        shouldSignOut: true,
        error: 'Session corrupted'
      }
    }
    
    if (!session) {
      return {
        isValid: false,
        shouldSignOut: false,
        error: 'No session found'
      }
    }
    
    const { error: userError } = await supabase.auth.getUser()
    
    if (userError?.code === 'user_not_found') {
      return {
        isValid: false,
        shouldSignOut: true,
        error: 'User no longer exists'
      }
    }
    
    if (userError) {
      return {
        isValid: false,
        shouldSignOut: true,
        error: 'Authentication error'
      }
    }
    
    return {
      isValid: true,
      shouldSignOut: false
    }
    
  } catch (error) {
    console.error('Session validation failed:', error)
    return {
      isValid: false,
      shouldSignOut: true,
      error: 'Session validation failed'
    }
  }
}

/**
 * Handles authentication errors consistently across the app
 */
export async function handleAuthError(
  error: any, 
  router: AppRouterInstance, 
  addToast?: AddToastFunction
) {
  const supabase = createClient()
  
  if (error?.code === 'user_not_found' || error?.shouldSignOut) {
    await supabase.auth.signOut()
    
    if (addToast) {
      addToast('Session expired. Please sign in again.', 'error')
    }
    
    router.push('/auth/signin')
    return true
  }
  
  return false
}

interface DevAuthResult {
  success: boolean
  error?: string
}

/**
 * Creates or signs in a development test user for local testing
 */
export async function devSignIn(): Promise<DevAuthResult> {
  if (process.env.NODE_ENV !== 'development') {
    return { success: false, error: 'Dev signin only available in development' }
  }
  
  if (process.env.NEXT_PUBLIC_ENABLE_DEV_AUTH !== 'true') {
    return { success: false, error: 'Dev auth not enabled' }
  }
  
  const supabase = createClient()
  const DEV_EMAIL = process.env.NEXT_PUBLIC_DEV_AUTH_EMAIL
  const DEV_PASSWORD = process.env.NEXT_PUBLIC_DEV_AUTH_PASSWORD
  
  if (!DEV_EMAIL || !DEV_PASSWORD) {
    return { 
      success: false, 
      error: 'Dev auth credentials not configured. Please set NEXT_PUBLIC_DEV_AUTH_EMAIL and NEXT_PUBLIC_DEV_AUTH_PASSWORD.' 
    }
  }
  
  try {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: DEV_EMAIL,
      password: DEV_PASSWORD,
    })

    if (!signInError) {
      return { success: true }
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: DEV_EMAIL,
      password: DEV_PASSWORD,
      options: {
        data: {
          full_name: 'Dev Test User',
          avatar_url: 'https://via.placeholder.com/150/6366f1/ffffff?text=DEV',
          provider_id: 'dev-user-local-id',
        },
      },
    })

    if (signUpError) {
      if (signUpError.message.includes('User already registered')) {
        return { success: false, error: 'Dev user exists, but the password in your .env file is incorrect.' }
      }
      return { success: false, error: signUpError.message }
    }

    if (signUpData.user && !signUpData.session) {
      return {
        success: false,
        error: 'Email confirmation required. Please check your Supabase settings to disable email confirmation for development.',
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Dev signin error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Dev signin failed',
    }
  }
}

/**
 * Checks if development authentication is enabled
 */
export function isDevAuthEnabled(): boolean {
  const isDev = process.env.NODE_ENV === 'development'
  const devAuthFlag = process.env.NEXT_PUBLIC_ENABLE_DEV_AUTH === 'true'
  
  return isDev && devAuthFlag
}