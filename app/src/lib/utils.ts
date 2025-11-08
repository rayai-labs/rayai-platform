import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      if (attempt === maxRetries) {
        throw error
      }
      
      const delay = delayMs * Math.pow(2, attempt - 1)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw new Error('All retry attempts exhausted')
}

export async function determineUserRoute(supabase: any, userId: string): Promise<string> {
  try {
    const { data: profile, error: profileError } = await withRetry(async () => {
      return await supabase
        .from('profile')
        .select('onboarding_completed')
        .eq('id', userId)
        .single()
    })

    if (profile?.onboarding_completed) {
      console.log('User state: Returning user, routing to dashboard')
      return '/keys'
    } else {
      const reason = profileError || !profile ? 'New user' : 'Incomplete onboarding';
      console.log(`User state: ${reason}, routing to onboarding`);
      return '/onboarding'
    }
  } catch (err) {
    console.error('Error checking user state after retries:', err)
    return '/onboarding'
  }
}