import 'dotenv/config';
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai"
import { readFile, readFileSync } from 'node:fs';
import path from 'node:path';

const systemPrompt =
  `You will receive an image. ` +
  `Please create an alt text for the image. ` +
  `Be concise. ` +
  `Use adjectives only when necessary. ` +
  `Do not pass 160 characters. ` +
  `Use simple language. `


const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});


export const describeImage = async (imagePath: string) => {

  const imageAsUint8Array = readFileSync(imagePath) // ? if the image is local. Now we have the image as a Uint8Array
  // const imageAsUint8Array = readFile(imagePath, (err, data) => {
  //   if (err) {
  //     console.error('Error reading the image file:', err);
  //     return;
  //   }
  //   return data;
  // });


  const { text } = await generateText({
    model: openrouter('google/gemma-4-31b-it:free'), // google/gemma-4-26b-a4b-it:free
    system: systemPrompt,
    messages: [{
      role: "user",
      content: [
        {
          type: "image",
          image: imageAsUint8Array! // new URL(imagePath) // ? if the image is on the web
        }
      ]
    }]
  })

  return text
}


const description = await describeImage(
  path.join(import.meta.dirname, './fireworks.jpg')
);

console.log(description);