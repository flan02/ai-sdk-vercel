import 'dotenv/config';
import { recipeSchema } from "@/zod/schema"
import { createOpenAI } from "@ai-sdk/openai";
import { generateText, Output } from "ai";

// $ pnpm dlx tsx ai-sdk-properties/6-structured-outputs.ts

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const createRecipe = async (prompt: string) => {

  const recipeOutput = Output.object({
    schema: recipeSchema,
    name: "recipe_output"
    // description: "Structured recipe with ingredients and steps",
  });

  const { output } = await generateText({
    model: openrouter('google/gemma-4-31b-it:free'), // google/gemma-4-26b-a4b-it:free
    output: recipeOutput,
    prompt,
    system:
      `You are helping a user create a recipe. ` +
      `Use British English variants of ingredient names. ` +
      `like Coriander over Cilantro. ` +
      `Respond with a valid JSON object that conforms to the schema. Do not include any additional text. Only respond with the JSON object. `
  })

  return output.recipe
}


const recipe = await createRecipe('How to make baba ganoush?');
