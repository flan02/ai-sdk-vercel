import z from 'zod'

export const writeFileSchema = z.object({
  path: z
    .string()
    .describe('The path to the file to create'),
  content: z
    .string()
    .describe('The content of the file to create'),
})

export const readFileSchema = z.object({
  path: z
    .string()
    .describe('The path to the file to read'),
})

export const deleteSchema = z.object({
  path: z
    .string()
    .describe(
      'The path to the file or directory to delete',
    ),
})

export const listDirectorySchema = z.object({
  path: z
    .string()
    .describe('The path to the directory to list'),
})

export const createDirectorySchema = z.object({
  path: z
    .string()
    .describe('The path to the directory to create'),
})

export const existsSchema = z.object({
  path: z
    .string()
    .describe(
      'The path to the file or directory to check',
    ),
})

export const searchFilesSchema = z.object({
  pattern: z
    .string()
    .describe('The pattern to search for'),
})

export const generateImageScrema = z.object({
  prompt: z.string().describe('Descripción visual detallada para el generador de imágenes.'),
  aspectRatio: z.enum(['1:1', '16:9', '9:16']).default('1:1').optional()
})
