import { Layers, Zap, Code2, Box, Workflow, Shield } from "lucide-react"

const features = [
  {
    icon: Layers,
    title: "Unified Provider API",
    description:
      "Switch between AI providers by changing a single line of code. OpenAI, Anthropic, Google, and more.",
  },
  {
    icon: Zap,
    title: "Streaming Responses",
    description:
      "Don&apos;t let your users wait. Stream AI responses instantly with built-in support for real-time updates.",
  },
  {
    icon: Code2,
    title: "Structured Outputs",
    description:
      "Generate type-safe structured data with Output.object() and Zod schemas for reliable AI outputs.",
  },
  {
    icon: Workflow,
    title: "Tool Calling",
    description:
      "Let AI call your functions with built-in tool execution, multi-step reasoning, and automatic loops.",
  },
  {
    icon: Box,
    title: "Framework Agnostic",
    description:
      "Build with React, Next.js, Vue, Nuxt, SvelteKit, and more. Works anywhere JavaScript runs.",
  },
  {
    icon: Shield,
    title: "Built-in Agents",
    description:
      "Create autonomous agents with ToolLoopAgent for complex multi-step tasks and workflows.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to build AI apps
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A comprehensive toolkit designed for modern AI application development.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent/50"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <feature.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
