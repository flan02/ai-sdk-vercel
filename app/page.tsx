import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { CodeSection } from "@/components/code-section"
import { ProvidersSection } from "@/components/providers-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ProvidersSection />
        <FeaturesSection />
        <CodeSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
