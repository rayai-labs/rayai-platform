"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { siteContent } from "@/lib/content"
import { useEffect, useState } from "react"
import { GitHubStars } from "@/components/github-stars"
import { usePathname } from "next/navigation"

export function Header() {
  const { logo, brand, nav, cta } = siteContent.header
  const [activeSection, setActiveSection] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === "/" && window.location.hash) {
      const hash = window.location.hash.replace("#", "")
      setTimeout(() => {
        const element = document.getElementById(hash)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    }
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      const sections = nav.map((item) => item.href.replace("#", ""))
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetBottom = offsetTop + element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [nav])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      if (pathname === "/") {
        e.preventDefault()
        const targetId = href.replace("#", "")
        const element = document.getElementById(targetId)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
          setMobileMenuOpen(false)
        }
      } else {
        setMobileMenuOpen(false)
      }
    } else {
      setMobileMenuOpen(false)
    }
  }

  const getNavHref = (href: string) => {
    if (href.startsWith("#") && pathname !== "/") {
      return `/${href}`
    }
    return href
  }

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-1.5">
            <a href="/" className="flex items-center gap-1.5">
              <Image src={logo.src || "/placeholder.svg"} alt={logo.alt} width={32} height={32} className="h-8 w-8" />
              <span className="text-xl font-bold tracking-tight">
                {brand.name}
                <span className="text-primary">{brand.highlight}</span>
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {nav.map((item) => {
              const isActive = activeSection === item.href.replace("#", "")
              return (
                <a
                  key={item.href}
                  href={getNavHref(item.href)}
                  onClick={(e) => handleClick(e, item.href)}
                  className={`text-sm font-normal transition-colors ${
                    isActive ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </a>
              )
            })}
          </nav>

          {/* Desktop CTA and GitHub Stars */}
          <div className="hidden lg:flex items-center gap-4">
            <GitHubStars />
            <a href="https://calendly.com/pavitra-rayai/25-min" target="_blank" rel="noopener noreferrer">
              <Button className="cursor-pointer">{cta}</Button>
            </a>
          </div>

          {/* Hamburger menu */}
          <button
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              {nav.map((item) => {
                const isActive = activeSection === item.href.replace("#", "")
                return (
                  <a
                    key={item.href}
                    href={getNavHref(item.href)}
                    onClick={(e) => handleClick(e, item.href)}
                    className={`text-sm font-normal transition-colors py-2 ${
                      isActive ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </a>
                )
              })}
              <div className="flex flex-col gap-3 pt-2 border-t border-border">
                <GitHubStars />
                <a href="https://calendly.com/pavitra-rayai/25-min" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full cursor-pointer">{cta}</Button>
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
