import Link from 'next/link'
import { Header } from "@/components/header"

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-md mx-auto p-4 sm:p-6 lg:p-8 mt-12">
        <div className="bg-muted border border-border rounded-xl p-6 sm:p-8 shadow-2xl text-center">
          <h1 className="text-2xl font-bold mb-4 text-foreground">
            Authentication Error
          </h1>
          <p className="text-muted-foreground mb-6">
            Something went wrong during sign in. Please try again.
          </p>
          <Link 
            href="/auth/signin"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  )
}