"use client"

import { useEffect, useState } from "react"

interface AnimatedRotatingTextProps {
  phrases: string[]
  className?: string
}

export function AnimatedRotatingText({ phrases, className = "" }: AnimatedRotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % phrases.length)
        setIsAnimating(false)
      }, 500)
    }, 3000)

    return () => clearInterval(interval)
  }, [phrases.length])

  return (
    <span className="inline-block relative min-h-[1.8em] pb-2">
      <span
        className={`inline-block transition-all duration-500 ${
          isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
        } ${className}`}
      >
        {phrases[currentIndex]}
      </span>
    </span>
  )
}
