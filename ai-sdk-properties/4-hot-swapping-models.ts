import { createOpenAI } from "@ai-sdk/openai";
import { generateText, type LanguageModel } from "ai";

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const ask = async (prompt: string, model: LanguageModel) => {

  const { text } = await generateText({
    model,
    prompt
  })

  return text
}

const prompt = `Tell me a story about any Batman comic from the 1980s.`;

const googleResult = await ask(prompt, openrouter('google/gemma-4-26b-a4b-it:free'))
// if we are using another model, we only change the var name to map with the model we want to use, for example:
// const anthropicResult = await ask(prompt, anthropic('claude-2:free'))
// const openaiResult = await ask(prompt, openai('gpt-4:free'))
