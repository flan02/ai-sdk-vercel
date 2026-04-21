import { z } from "zod";

export const recipeSchema = z.object({
  recipe: z.object({
    name: z.string(),
    ingredients: z.array(
      z.object({
        name: z.string(),
        amount: z.string()
      })
    ),
    steps: z.array(z.string())
  })
})


export const sentimentSchema = z.object({
  sentiment: z.enum(["positive", "negative", "neutral"]),
})


export const invoiceSchema = z.object({
  total: z.number().describe("The total amount of the invoice"),
  currency: z.string().describe("The currency of the total amount, e.g., USD, EUR"),
  invoiceNumber: z.string().describe("The unique identifier for the invoice"),
  companyAddress: z.string().describe("The address of the company issuing the invoice"),
  companyName: z.string().describe("The name of the company issuing the invoice"),
  invoiceeAddress: z.string().describe("The address of who the invoice is issued to"),
}).describe("The extracted data from the invoice.")