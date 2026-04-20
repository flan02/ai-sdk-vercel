import 'dotenv/config';
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { once } from 'node:events'
import { generateText, type ModelMessage } from 'ai'
import { createOpenAI } from '@ai-sdk/openai';

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

// $ pnpm dlx tsx lib/5-preserving-chat-history.ts

// ? In-Process Server with Hono and Node's built-in HTTP server
// Ventajas: Desacoplado. Podrías usar este servidor en un bot de Discord o una app de escritorio.
export const startServer = async () => {

  const app = new Hono()

  app.post("/api/get-completions", async (ctx) => {
    const messages: ModelMessage[] = await ctx.req.json()

    const result = await generateText({
      model: openrouter('gemma-4-26b-a4b-it:free'),
      messages: messages,
    })

    return ctx.json(result.response.messages)

  })

  const server = serve({
    fetch: app.fetch,
    port: 3001,
    hostname: "localhost"
  })

  // Wait for the "listening" event to fire
  await once(server, "listening")

  return server
}


// example Response
/* 
[
  { role: 'user', content: "What's the capital of Wales?" },
  {
    role: 'assistant',
    content: [
      {
        type: 'text',
        text: 'The capital of Wales is **Cardiff**.',
        providerOptions: { openai: { itemId: 'msg_tmp_bp7tpy2bwfq' } }
      }
    ]
  }
]

*/