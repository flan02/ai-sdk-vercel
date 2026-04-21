import dotenv from 'dotenv';
import { tool, streamText, stepCountIs } from "ai";
import z from 'zod';
import { createOpenAI } from '@ai-sdk/openai';


dotenv.config();

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

// $ pnpm dlx tsx ai-sdk-properties/d-first-agent.ts


export const getWeatherTool = tool({
  description: 'Get the weather in a location',
  inputSchema: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  execute: async ({ location }) => { // In a real implementation, this would call a weather API. For this example, it returns a random temperature.
    return `The weather in ${location} is ${72 + Math.floor(Math.random() * 21) - 10} degrees Fahrenheit.`
  },
});


const askAQuestion = async (prompt: string) => {
  const { textStream, steps } = await streamText({
    model: openrouter('google/gemma-4-31b-it:free'),
    prompt,
    tools: {
      getWeather: getWeatherTool,
    },
    stopWhen: stepCountIs(2)
  })

  // console.dir(await steps, { depth: null });
  for await (const text of textStream) {
    process.stdout.write(text);
  }

}



await askAQuestion("What is the weather in Boston?");


// $ It tooke 1 step, which was to call the agent. The agent then called the tool to get the weather in city that the user specified, and returned the result of the tool call as the final output.
// Expected output in the console:
/* 
[
  DefaultStepResult {
    stepNumber: 0,
    model: {
      provider: 'openai.responses',
      modelId: 'google/gemma-4-31b-it:free'
    },
    functionId: undefined,
    metadata: undefined,
    experimental_context: undefined,
    content: [
      {
        type: 'reasoning',
        text: '',
        providerMetadata: {
          openai: {
            itemId: 'rs_tmp_180jkq721xd',
            reasoningEncryptedContent: 'EiYKJGUyNDgzMGE3LTVjZDYtNDJmZS05OThiLWVlNTM5ZTcyYjljMw=='
          }
        }
      },
      {
        type: 'tool-call',
        toolCallId: 'tool_getWeather_J70jBKFdAJZIoELWnr8a',
        toolName: 'getWeather',
        input: { location: 'Boston' },
        providerExecuted: undefined,
        providerMetadata: { openai: { itemId: 'fc_tmp_shcgccne76' } },
        title: undefined
      },
      {
        type: 'tool-result',
        toolCallId: 'tool_getWeather_J70jBKFdAJZIoELWnr8a',
        toolName: 'getWeather',
        input: { location: 'Boston' },
        output: 'The weather in Boston is 75 degrees Fahrenheit.',
        dynamic: false,
        providerMetadata: { openai: { itemId: 'fc_tmp_shcgccne76' } }
      }
    ],
    finishReason: 'tool-calls',
    rawFinishReason: undefined,
    usage: {
      inputTokens: 62,
      inputTokenDetails: {
        noCacheTokens: 62,
        cacheReadTokens: 0,
        cacheWriteTokens: undefined
      },
      outputTokens: 15,
      outputTokenDetails: { textTokens: 15, reasoningTokens: 0 },
      totalTokens: 77,
      raw: {
        input_tokens: 62,
        input_tokens_details: { cached_tokens: 0 },
        output_tokens: 15,
        output_tokens_details: { reasoning_tokens: 0 }
      },
      reasoningTokens: 0,
      cachedInputTokens: 0
    },
    warnings: [],
    request: {
      body: {
        model: 'google/gemma-4-31b-it:free',
        input: [
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: 'What is the weather in Boston?'
              }
            ]
          }
        ],
        temperature: undefined,
        top_p: undefined,
        max_output_tokens: undefined,
        conversation: undefined,
        max_tool_calls: undefined,
        metadata: undefined,
        parallel_tool_calls: undefined,
        previous_response_id: undefined,
        store: undefined,
        user: undefined,
        instructions: undefined,
        service_tier: undefined,
        include: undefined,
        prompt_cache_key: undefined,
        prompt_cache_retention: undefined,
        safety_identifier: undefined,
        top_logprobs: undefined,
        truncation: undefined,
        tools: [
          {
            type: 'function',
            name: 'getWeather',
            description: 'Get the weather in a location',
            parameters: {
              type: 'object',
              properties: {
                location: {
                  type: 'string',
                  description: 'The location to get the weather for'
                }
              },
              required: [ 'location' ],
              additionalProperties: false,
              '$schema': 'http://json-schema.org/draft-07/schema#'
            }
          }
        ],
        tool_choice: 'auto'
      }
    },
    response: {
      id: 'gen-1776799499-V7Cehak1ivlurELkCpOH',
      timestamp: 2026-04-21T19:24:59.000Z,
      modelId: 'google/gemma-4-31b-it-20260402:free',
      headers: {
        'access-control-allow-origin': '*',
        'access-control-expose-headers': 'X-Generation-Id,cf-ray',
        'cache-control': 'no-cache',
        'cf-ray': '9efec5a499b01fe4-EZE',
        connection: 'keep-alive',
        'content-type': 'text/event-stream',
        date: 'Tue, 21 Apr 2026 19:25:00 GMT',
        'permissions-policy': 'payment=(self "https://checkout.stripe.com" "https://connect-js.stripe.com" "https://js.stripe.com" "https://*.js.stripe.com" "https://hooks.stripe.com")',
        'referrer-policy': 'no-referrer, strict-origin-when-cross-origin',
        server: 'cloudflare',
        'transfer-encoding': 'chunked',
        'x-content-type-options': 'nosniff',
        'x-generation-id': 'gen-1776799499-V7Cehak1ivlurELkCpOH'
      },
      messages: [
        {
          role: 'assistant',
          content: [
            {
              type: 'reasoning',
              text: '',
              providerOptions: {
                openai: {
                  itemId: 'rs_tmp_180jkq721xd',
                  reasoningEncryptedContent: 'EiYKJGUyNDgzMGE3LTVjZDYtNDJmZS05OThiLWVlNTM5ZTcyYjljMw=='
                }
              }
            },
            {
              type: 'tool-call',
              toolCallId: 'tool_getWeather_J70jBKFdAJZIoELWnr8a',
              toolName: 'getWeather',
              input: { location: 'Boston' },
              providerExecuted: undefined,
              providerOptions: { openai: { itemId: 'fc_tmp_shcgccne76' } }
            }
          ]
        },
        {
          role: 'tool',
          content: [
            {
              type: 'tool-result',
              toolCallId: 'tool_getWeather_J70jBKFdAJZIoELWnr8a',
              toolName: 'getWeather',
              output: {
                type: 'text',
                value: 'The weather in Boston is 75 degrees Fahrenheit.'
              },
              providerOptions: { openai: { itemId: 'fc_tmp_shcgccne76' } }
            }
          ]
        }
      ]
    },
    providerMetadata: {
      openai: {
        responseId: 'gen-1776799499-V7Cehak1ivlurELkCpOH',
        serviceTier: 'auto'
      }
    }
  }
]
*/