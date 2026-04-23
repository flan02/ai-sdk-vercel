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