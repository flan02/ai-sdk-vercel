import { InferUITools, tool, UIMessage } from 'ai'
import * as fsTools from '../app/api/chat-tool-calling/file-system-functionality'
import { createDirectorySchema, deleteSchema, existsSchema, generateImageScrema, listDirectorySchema, readFileSchema, searchFilesSchema, writeFileSchema } from '@/zod/tool-calling'
import { google } from '@ai-sdk/google';
import { generateImage } from 'ai';
import { success } from 'zod/v4';

// NOTE: We define a type for the UI message
// that includes the tools, using the InferUITools
// utility type.

export type CustomUIMessage = UIMessage<
  never,
  never,
  InferUITools<typeof tools>
>

export const tools = {
  writeFile: tool({
    description: 'Write to a file',
    inputSchema: writeFileSchema,
    execute: async ({ path, content }) => {
      const result = await fsTools.writeFile(path, content);
      return {
        ...result,
        content
      }
    }
  }),
  realFile: tool({
    description: 'Read a file',
    inputSchema: readFileSchema,
    execute: async ({ path }) => {
      return fsTools.readFile(path)
    }
  }),
  deletePath: tool({
    description: 'Delete a file or directory',
    inputSchema: deleteSchema,
    execute: async ({ path }) => {
      return fsTools.deletePath(path)
    }
  }),
  listDirectory: tool({
    description: 'List the contents of a directory',
    inputSchema: listDirectorySchema,
    execute: async ({ path }) => {
      return fsTools.listDirectory(path)
    }
  }),
  createDirectory: tool({
    description: 'Create a new directory',
    inputSchema: createDirectorySchema,
    execute: async ({ path }) => {
      return fsTools.createDirectory(path)
    }
  }),
  exists: tool({
    description: 'Check if a file or directory exists',
    inputSchema: existsSchema,
    execute: async ({ path }) => {
      return fsTools.exists(path)
    }
  }),
  searchFiles: tool({
    description: 'Search for files matching a pattern',
    inputSchema: searchFilesSchema,
    execute: async ({ pattern }) => {
      return fsTools.searchFiles(pattern)
    }
  }),
  generateImage: tool({
    description: 'Genera una imagen cinematográfica para la portada de la historia',
    inputSchema: generateImageScrema,
    execute: async ({ prompt }) => {
      try {
        const { image } = await generateImage({
          model: google.image("gemini-2.5-flash-image"),
          prompt,
          n: 1,
          aspectRatio: '16:9'
        })

        const base64Image = `data:image/png;base64,${image.base64}`;

        return {
          success: true,
          url: base64Image,
          message: 'Imagen generada exitosamente'
        }
      } catch (error) {
        console.error("Error pintando la portada:", error);
        return {
          success: false,
          message: 'No se pudo generar la imagen, pero la historia está lista.'
        };
      }
    }

  })
}