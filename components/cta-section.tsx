import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="relative py-20 sm:py-32">
      {/* Gradient background effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to build with AI?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start building AI-powered applications in minutes with comprehensive documentation and
            examples.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="https://sdk.vercel.ai/docs" target="_blank" rel="noopener noreferrer">
                Read the Docs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="https://github.com/vercel/ai" target="_blank" rel="noopener noreferrer">
                View on GitHub
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
