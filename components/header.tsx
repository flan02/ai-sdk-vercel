"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Sparkles } from "lucide-react"

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#code", label: "Examples" },
  { href: "#providers", label: "Providers" },
  { href: "https://sdk.vercel.ai/docs", label: "Docs", external: true },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground">
            <Sparkles className="h-4 w-4 text-background" />
          </div>
          <span className="text-lg font-semibold text-foreground">AI SDK</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="https://github.com/vercel/ai" target="_blank" rel="noopener noreferrer">
              GitHub
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="https://sdk.vercel.ai/docs" target="_blank" rel="noopener noreferrer">
              Get Started
            </Link>
          </Button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col gap-2 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="https://github.com/vercel/ai" target="_blank" rel="noopener noreferrer">
                  GitHub
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="https://sdk.vercel.ai/docs" target="_blank" rel="noopener noreferrer">
                  Get Started
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
