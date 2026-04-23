import { google } from '@ai-sdk/google';
import { writeFile, readFile } from 'fs/promises';
import { generateText, Output } from 'ai';
import { z } from 'zod';

// $ pnpm dlx tsx lib/generate-text.ts

const res = await generateText({
  model: google('gemma-4-26b-a4b-it:free'),
  prompt: `Give the first paragraph of a story about an imaginary planet.`
})

console.log('generateText:');
console.log(res.text);  // type of res is { text: string }

/*
generateText:
The planet of Zog is a small, rocky world located in a distant galaxy. 
It is home to a variety of strange and wonderful creatures, including the Zoglings, 
small, furry beings with large eyes and long tails. The planet's surface is covered 
in towering mountains and deep valleys, and its atmosphere is thick with a purple haze. 
Despite its harsh conditions, the Zoglings have thrived on their planet, 
developing advanced technology and a rich culture.
*/

const objectSchema = z.object({
  facts: z.array(z.string()).describe("An array of key facts from the text."),
});

const responseOutput = Output.object({
  schema: objectSchema,
  name: "text_output"
})

// * New in SDK 6. Before, we used to do with generateObject, but now we can do it with generateText and specifying the output as an object with a zod schema.
const { output } = await generateText({
  model: google('gemma-4-26b-a4b-it:free'),
  output: responseOutput,
  prompt: `
    Give me an array of key facts from the following text
    
    ${res.text}

    Remove all flowerly language. Speak as if you are a scientist.
  `
})

console.log('generateObject:');
console.log(output.facts); // type of output.facts is string[]

/*
generateObject:
facts: [
  "The planet of Zog is a small, rocky world located in a distant galaxy.",
  "It is home to a variety of strange and wonderful creatures, including the Zoglings, small, furry beings with large eyes and long tails.",
  "The planet's surface is covered in towering mountains and deep valleys.",
  "Its atmosphere is thick with a purple haze.",
  "Despite its harsh conditions, the Zoglings have thrived on their planet, developing advanced technology and a rich culture."
]
*/

