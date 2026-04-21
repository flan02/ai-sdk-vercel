import dotenv from 'dotenv';
import { tool, generateText } from "ai";
import z from 'zod';
import { createOpenAI } from '@ai-sdk/openai';

// $ pnpm dlx tsx ai-sdk-properties/b-embeddings-vectordb.ts
dotenv.config();

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

// $ pnpm dlx tsx ai-sdk-properties/c-tool-calling.ts

const logToConsoleTool = tool({
  description: "Logs a message to the console",
  inputSchema: z.object({
    text: z.string().describe("The message to log to the console")
  }),
  execute: async ({ text }) => {
    console.log("> Bot says: ", text);
    return { ok: true }
  }
});


const logToConsole = async (prompt: string) => {
  const { steps } = await generateText({
    model: openrouter('google/gemma-4-31b-it:free'), // google/gemma-4-26b-a4b-it:free
    prompt,
    system:
      `Your only role in life is to log` +
      `messages to the console. ` +
      `Use the tool provided to log the ` +
      `prompt to the console. `,
    tools: {
      logToConsole: logToConsoleTool,
    }
  })

  console.dir(steps[0].toolCalls, { depth: null });
  console.dir(steps[0].toolResults, { depth: null });
}


await logToConsole("Hello world!");

// $ It took 2 steps. The first step was to call the tool, and the second step was to return the result of the tool call.
// Expected output in the console:
/* 
> Bot says:  Hello world!
[
  {
    type: 'tool-call',
    toolCallId: 'tool_logToConsole_RzQKfnOOO9o5RIHwo9Wd',
    toolName: 'logToConsole',
    input: { text: 'Hello world!' },
    providerExecuted: undefined,
    providerMetadata: { openai: { itemId: 'fc_tmp_z4zxciqfay8' } },
    title: undefined
  }
]
[
  {
    type: 'tool-result',
    toolCallId: 'tool_logToConsole_RzQKfnOOO9o5RIHwo9Wd',
    toolName: 'logToConsole',
    input: { text: 'Hello world!' },
    output: { ok: true },
    dynamic: false,
    providerMetadata: { openai: { itemId: 'fc_tmp_z4zxciqfay8' } }
  }
]
*/