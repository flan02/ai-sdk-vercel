"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const tabs = [
  {
    id: "streaming",
    label: "Streaming",
    code: `import { streamText } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: 'openai/gpt-5',
    system: 'You are a helpful assistant.',
    messages,
  })

  return result.toUIMessageStreamResponse()
}`,
  },
  {
    id: "tools",
    label: "Tool Calling",
    code: `import { streamText, tool } from 'ai'
import { z } from 'zod'

const result = streamText({
  model: 'openai/gpt-5',
  messages,
  tools: {
    getWeather: tool({
      description: 'Get weather for a location',
      inputSchema: z.object({
        location: z.string()
      }),
      execute: async ({ location }) => {
        return { location, temp: 72, unit: 'F' }
      },
    }),
  },
})`,
  },
  {
    id: "structured",
    label: "Structured Output",
    code: `import { generateText, Output } from 'ai'
import { z } from 'zod'

const result = await generateText({
  model: 'openai/gpt-5',
  prompt: 'Generate a recipe for chocolate chip cookies',
  output: Output.object({
    schema: z.object({
      name: z.string(),
      ingredients: z.array(z.object({
        item: z.string(),
        amount: z.string(),
      })),
      instructions: z.array(z.string()),
    }),
  }),
})`,
  },
  {
    id: "agents",
    label: "Agents",
    code: `import { ToolLoopAgent, createAgentUIStreamResponse, tool } from 'ai'
import { z } from 'zod'

const agent = new ToolLoopAgent({
  model: 'openai/gpt-5',
  instructions: 'You are a research assistant.',
  tools: {
    search: tool({
      description: 'Search the web',
      inputSchema: z.object({ query: z.string() }),
      execute: async ({ query }) => searchWeb(query),
    }),
  },
})

export async function POST(req: Request) {
  const { messages } = await req.json()
  return createAgentUIStreamResponse({ agent, uiMessages: messages })
}`,
  },
]

export function CodeSection() {
  const [activeTab, setActiveTab] = useState("streaming")
  const activeCode = tabs.find((t) => t.id === activeTab)?.code || ""

  return (
    <section id="code" className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple, powerful APIs
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Write clean, maintainable code with intuitive APIs designed for developer productivity.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {/* Tab bar */}
            <div className="flex border-b border-border bg-secondary/50">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-4 py-3 text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "border-b-2 border-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Code block */}
            <div className="p-4 sm:p-6">
              <pre className="overflow-x-auto text-sm leading-relaxed">
                <code className="text-muted-foreground">
                  {activeCode.split("\n").map((line, i) => (
                    <div key={i} className="flex">
                      <span className="mr-6 select-none text-muted-foreground/50 w-6 text-right">
                        {i + 1}
                      </span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightCode(line),
                        }}
                      />
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function highlightCode(line: string): string {
  return line
    .replace(
      /(import|from|export|async|function|const|return|await)/g,
      '<span class="text-accent">$1</span>'
    )
    .replace(
      /('.*?')/g,
      '<span class="text-chart-4">$1</span>'
    )
    .replace(
      /(\{|\}|\(|\)|\[|\])/g,
      '<span class="text-muted-foreground">$1</span>'
    )
    .replace(
      /(\/\/.*$)/g,
      '<span class="text-muted-foreground/60">$1</span>'
    )
}
