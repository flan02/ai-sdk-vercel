const providers = [
  { name: "OpenAI", model: "GPT-5" },
  { name: "Anthropic", model: "Claude" },
  { name: "Google", model: "Gemini" },
  { name: "Fireworks", model: "Fast Inference" },
  { name: "AWS Bedrock", model: "Multi-Model" },
  { name: "Groq", model: "Ultra Fast" },
]

export function ProvidersSection() {
  return (
    <section id="providers" className="border-y border-border bg-card py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-10 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Trusted by builders using
        </p>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {providers.map((provider) => (
            <div key={provider.name} className="flex flex-col items-center gap-1">
              <span className="text-lg font-semibold text-foreground">{provider.name}</span>
              <span className="text-xs text-muted-foreground">{provider.model}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
