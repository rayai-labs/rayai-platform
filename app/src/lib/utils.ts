import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function determineUserRoute(): Promise<string> {
  console.log('User authenticated, routing to keys page')
  return '/keys'
}