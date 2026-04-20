import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai'

// ? this is how a system prompt looks like under the hood

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const summarizeText = async (input: string) => {

  const { text } = await generateText({
    model: openrouter('google/gemma-4-26b-a4b-it:free'),
    messages: [
      {
        role: "system",
        content:
          `You are a text summarizer. ` +
          `Summarize the text you receive. ` +
          `Be concise. ` +
          `Return only the summary. ` +
          `Do not use the phrase "here is a summary". ` +
          `Highlight relevant phrases in bold. ` +
          `The summary should be be two sentences long. `,
      },
      {
        role: "user",
        content: input,
      }
    ]
  });
  return text;
}