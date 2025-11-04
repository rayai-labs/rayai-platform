import Image from "next/image"
import { siteContent } from "@/lib/content"

export function Footer() {
  const { logo, brand, links, copyright } = siteContent.footer

  return (
    <footer className="border-t border-border py-16 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-1.5">
            <Image src={logo.src || "/placeholder.svg"} alt={logo.alt} width={28} height={28} className="h-7 w-7" />
            <span className="text-lg font-bold tracking-tight">
              {brand.name}
              <span className="text-primary">{brand.highlight}</span>
            </span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground font-light">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-foreground transition-colors">
                {link.label}
              </a>
            ))}
          </div>
          <p className="text-sm text-muted-foreground font-light">{copyright}</p>
        </div>
      </div>
    </footer>
  )
}
