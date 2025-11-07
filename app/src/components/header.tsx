import Image from "next/image"
import Link from "next/link"

export function Header() {
  const websiteUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://rayai.com'

  return (
    <header className="border-b border-border/50 bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center">
          <Link 
            href={websiteUrl}
            className="flex items-center hover:opacity-80 transition-opacity"
            target={websiteUrl.startsWith('http') ? '_blank' : '_self'}
            rel={websiteUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            <Image 
              src="/logo.svg" 
              alt="RayAI Logo" 
              width={32} 
              height={32} 
              className="h-7 w-7 sm:h-8 sm:w-8" 
            />
            <span className="ml-2 text-base sm:text-lg font-bold text-foreground tracking-tight">
              Ray<span className="text-primary">AI</span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}