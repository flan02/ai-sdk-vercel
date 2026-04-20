import 'dotenv/config';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { writeFile } from 'fs/promises';

// $ pnpm dlx tsx lib/generate-text.ts

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function main() {
  const QUESTION = 'Create a quickly summary about the history of the Middle Age and medieval times.'
  const generatedFile = 'response_ai.md'

  try {
    console.log('... Generating response ...');
    const { text } = await generateText({
      model: openrouter('google/gemma-4-26b-a4b-it:free'),
      system: 'You are a helpful assistant. You must generate every response in Markdown format.',
      prompt: QUESTION,
    });

    await writeFile(generatedFile, text, 'utf-8');

    console.log(`✅ ¡Ready! you can check the generated file in: ${generatedFile}`);
    // console.log(text);

  } catch (error) {
    console.error('We got the following error: ', error)
  }

}

main().catch(console.error);