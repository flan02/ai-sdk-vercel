import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { CodeSection } from "@/components/code-section"
import { ProvidersSection } from "@/components/providers-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <div className="mb-12 w-[80%] mx-auto flex space-x-6">
          <Link href='/stream-text-to-ui' target="_blank" className="underline underline-offset-2 text-emerald-100">Stream Text to UI</Link>
          <Link href='/tool-calling' target="_blank" className="underline underline-offset-2 text-emerald-100">{`Tool Calling (naive agent)`}</Link>
          <Link href='/images-describing' target="_blank" className="underline underline-offset-2 text-emerald-100">Image Description</Link>
          <Link href='/message-parts' target="_blank" className="underline underline-offset-2 text-emerald-100">Message Parts</Link>
        </div>
        <ProvidersSection />
        <FeaturesSection />
        <CodeSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
