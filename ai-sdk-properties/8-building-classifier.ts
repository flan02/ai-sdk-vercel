import 'dotenv/config';
import { createOpenAI } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { sentimentSchema } from '@/zod/schema';

// $ pnpm dlx tsx ai-sdk-properties/8-building-classifier.ts

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const classifySentiment = async (text: string) => {

  const sentimentOutput = Output.object({
    schema: sentimentSchema,
    name: "sentiment_output"
  })


  const { output } = await generateText({
    model: openrouter('google/gemma-4-31b-it:free'), // google/gemma-4-26b-a4b-it:free
    output: sentimentOutput,
    prompt: text,
    system:
      `Classify the sentiment of the text as either. ` +
      `Positive, Negative or Neutral. `
  })

  return output.sentiment
}

const result = await classifySentiment(`I'm not sure how I feel`)

console.log(result);
