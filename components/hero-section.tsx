"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, Copy, ArrowRight } from "lucide-react"

export function HeroSection() {
  const [copied, setCopied] = useState(false)
  const installCommand = "npm i ai @ai-sdk/react"

  const handleCopy = () => {
    navigator.clipboard.writeText(installCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-32">
      {/* Gradient background effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Announcement banner */}
          <Link
            href="https://sdk.vercel.ai/docs"
            className="group mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
          >
            <span className="flex h-2 w-2 rounded-full bg-accent" />
            <span>AI SDK 6 is now available</span>
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            The AI Toolkit for TypeScript
          </h1>

          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            From the creators of Next.js, the AI SDK is a free open-source library that gives you
            the tools you need to build AI-powered products.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="https://sdk.vercel.ai/docs" target="_blank" rel="noopener noreferrer">
                Get Started
              </Link>
            </Button>

            <button
              onClick={handleCopy}
              className="flex h-11 items-center gap-3 rounded-md border border-border bg-card px-4 font-mono text-sm text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
            >
              <span className="text-accent">$</span>
              <span>{installCommand}</span>
              {copied ? (
                <Check className="h-4 w-4 text-accent" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
