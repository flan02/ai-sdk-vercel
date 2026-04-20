import 'dotenv/config';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';


// $ pnpm dlx tsx lib/stream-text.ts

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function main() {
  const QUESTION = 'What is the color of the sun?'


  try {
    console.log('... Generating response ...');
    const { textStream, text } = await streamText({
      model: openrouter('google/gemma-4-26b-a4b-it:free'),
      system: 'You are a helpful assistant. You must generate every response in Markdown format.',
      prompt: QUESTION,
    });

    // Process the text stream as it arrives
    for await (const t of textStream) {
      process.stdout.write(t);
    }

    const finalText = await text; // Get the final text response when the stream is finished

    return textStream

  } catch (error) {
    console.error('We got the following error: ', error)
  }

}

main().catch(console.error);