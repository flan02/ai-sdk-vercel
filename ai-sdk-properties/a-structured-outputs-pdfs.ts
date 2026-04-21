import 'dotenv/config';
import { invoiceSchema } from "@/zod/schema"
import { createOpenAI } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { readFileSync } from 'fs';
import path from 'path/win32';

// $ pnpm dlx tsx ai-sdk-properties/a-structured-outputs-pdfs.ts

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const extractDataInvoice = async (invoicePath: string) => {

  const invoiceOutput = Output.object({
    schema: invoiceSchema,
    name: "invoice_output"
    // description: "Structured invoice with total and details",
  });

  const { output } = await generateText({
    model: openrouter('google/gemma-4-31b-it:free'), // google/gemma-4-26b-a4b-it:free
    output: invoiceOutput,
    system:
      `You will receive an invoice. ` +
      `Please extract the data from the invoice. `,
    messages: [{
      role: "user",
      content: [
        {
          type: "file",
          data: readFileSync(invoicePath), // new URL(invoicePath) // ? if the file is on the web
          mediaType: "application/pdf",
        }
      ]
    }]
  })

  return output
}


const result = await extractDataInvoice(
  path.join(import.meta.dirname, './sample-invoice.pdf')
);

console.dir(result, { depth: null });

