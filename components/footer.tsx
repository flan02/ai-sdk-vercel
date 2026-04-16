import Link from "next/link"
import { Sparkles } from "lucide-react"

const footerLinks = {
  product: [
    { label: "Documentation", href: "https://sdk.vercel.ai/docs" },
    { label: "Providers", href: "https://sdk.vercel.ai/providers" },
    { label: "Examples", href: "https://sdk.vercel.ai/examples" },
    { label: "Templates", href: "https://vercel.com/templates" },
  ],
  resources: [
    { label: "GitHub", href: "https://github.com/vercel/ai" },
    { label: "Changelog", href: "https://sdk.vercel.ai/changelog" },
    { label: "Blog", href: "https://vercel.com/blog" },
    { label: "Discord", href: "https://vercel.community" },
  ],
  company: [
    { label: "Vercel", href: "https://vercel.com" },
    { label: "Next.js", href: "https://nextjs.org" },
    { label: "v0", href: "https://v0.dev" },
    { label: "Careers", href: "https://vercel.com/careers" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground">
                <Sparkles className="h-4 w-4 text-background" />
              </div>
              <span className="text-lg font-semibold text-foreground">AI SDK</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              The AI Toolkit for TypeScript.
              <br />
              Built by Vercel.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Product</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Resources</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Vercel, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
