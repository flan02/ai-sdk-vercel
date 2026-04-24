import { InferUITools, tool, UIMessage } from 'ai'
import * as fsTools from '../app/api/chat-tool-calling/file-system-functionality'
import { createDirectorySchema, deleteSchema, existsSchema, listDirectorySchema, readFileSchema, searchFilesSchema, writeFileSchema } from '@/zod/tool-calling'

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
      return fsTools.writeFile(path, content);
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
  })
}