import { google } from '@ai-sdk/google';
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from 'ai';
import * as fsTools from './file-system-functionality';
import { createDirectorySchema, deleteSchema, existsSchema, listDirectorySchema, readFileSchema, searchFilesSchema, writeFileSchema } from '@/zod/tool-calling';
import { createOpenAI } from '@ai-sdk/openai';

import { tools as customTools } from '@/tools';

// * NOTE: If we define multiple tools, we can export them as an object and then pass them to the streamText function
// It works and simplifies the code in streamText fc
// ? tools: { ...customTools }

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});


export const POST = async (req: Request): Promise<Response> => {
  const body: { messages: UIMessage[] } = await req.json();
  const { messages } = body;

  // ? Only if I wanna send the last message to the model. Useful when we work with useCompletion()
  // const lastMessage = messages[messages.length - 1];

  // if (!lastMessage) {
  //   return new Response('No messages provided', { status: 400 });
  // }


  const convertedMessages = await convertToModelMessages(messages);

  console.log('Current convertedMessages', convertedMessages);

  // return new Response('ok');

  const result = streamText({
    model: google('gemini-flash-lite-latest'),//openrouter('google/gemma-4-26b-a4b-it:free'),
    messages: convertedMessages, //cleanMessages as any
    system: `
      You are a helpful assistant that can use a sandboxed file system to create, edit and delete files.

      You have access to the following tools:
      - writeFile
      - readFile
      - deletePath
      - listDirectory
      - createDirectory
      - exists
      - searchFiles

      Use these tools to record notes, create todo lists, and edit documents for the user.

      Use markdown files to store information.
    `,
    tools: {
      writeFile: tool({
        description: 'Write to a file',
        inputSchema: writeFileSchema,
        execute: async ({ path, content }) => {
          return fsTools.writeFile(path, content);
        },
      }),
      readFile: tool({
        description: 'Read a file',
        inputSchema: readFileSchema,
        execute: async ({ path }) => {
          return fsTools.readFile(path);
        },
      }),
      deletePath: tool({
        description: 'Delete a file or directory',
        inputSchema: deleteSchema,
        execute: async ({ path }) => {
          return fsTools.deletePath(path);
        },
      }),
      listDirectory: tool({
        description: 'List a directory',
        inputSchema: listDirectorySchema,
        execute: async ({ path }) => {
          return fsTools.listDirectory(path);
        },
      }),
      createDirectory: tool({
        description: 'Create a directory',
        inputSchema: createDirectorySchema,
        execute: async ({ path }) => {
          return fsTools.createDirectory(path);
        },
      }),
      exists: tool({
        description: 'Check if a file or directory exists',
        inputSchema: existsSchema,
        execute: async ({ path }) => {
          return fsTools.exists(path);
        },
      }),
      searchFiles: tool({
        description: 'Search for files',
        inputSchema: searchFilesSchema,
        execute: async ({ pattern }) => {
          return fsTools.searchFiles(pattern);
        },
      }),
    },
    stopWhen: [stepCountIs(10)],
  });

  return result.toUIMessageStreamResponse();
};