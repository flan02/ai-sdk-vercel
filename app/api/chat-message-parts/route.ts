import { google } from '@ai-sdk/google';
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { CustomUIMessage } from '@/tools';

// import { createDirectorySchema, deleteSchema, existsSchema, listDirectorySchema, readFileSchema, searchFilesSchema, writeFileSchema } from '@/zod/tool-calling';
// import * as fsTools from './file-system-functionality';
import { tools as customTools } from '@/tools';
// * NOTE: If we define multiple tools, we can export them as an object and then pass them to the streamText function
// It works and simplifies the code in streamText fc
// ? tools: { ...customTools }


export const POST = async (req: Request): Promise<Response> => {
  const body: { messages: CustomUIMessage[] } = await req.json();
  const { messages } = body;

  // ? Only if I wanna send the last message to the model. Useful when we work with useCompletion()
  const text = messages[messages.length - 1];

  if (!text) {
    return new Response('No messages provided', { status: 400 });
  }


  // const convertedMessages = await convertToModelMessages(messages);

  console.log('Last message:', text.parts.map(part => part.type === 'text' ? part.text : '').join(''));

  const topic = text.parts.map(part => part.type === 'text' ? part.text : '').join('');
  // throw new Error('Manual error ...')

  // const PROMPT = ` Write me a poem about a pirate in pirate.md `;
  const PROMPT = `
  Write story about the following topic
  
  requested by the user: ${topic} 
  
  and save it in file.md
  `

  const result = streamText({
    model: google('gemma-4-31b-it'), //'gemini-flash-lite-latest'
    // messages: convertedMessages,
    prompt: PROMPT,
    system: `
      You are a helpful assistant that can use a sandboxed file system to create, edit and delete files.

      Tools to work with filesystem:
      - writeFile
      - readFile
      - deletePath
      - listDirectory
      - createDirectory
      - exists
      - searchFiles

      Tools to generate images:
      - generateImage

      Workflow
      1. Understand the user's request to generate content.
      2. Immediately utilize 'writeFile' to save the generated content to a file named 'file.md'.
      3. After the file was saved successfully, utilize 'generateImage' to create an image that visually represents the content of the file. The prompt for the image generation should be based on the content of the file and should be detailed to ensure a relevant image is generated.
    
      Do not execute the tools in parallel, respect the order: Text -> Save file -> Generate image. This is crucial for the correct functioning of the workflow.
      `,
    tools: { ...customTools },
    stopWhen: [stepCountIs(10)],
  });

  const stream = result.toUIMessageStream({
    onFinish: ({ messages }) => { // We are using messages from the scope of onFinish, not the messages from the request body nor a random variable 
      console.log('--- ON FINISH ---');
      console.dir(messages, { depth: null });
    }
  })

  // ! Only for testing purposes, to see the structure in the backend
  // ! In a real application, we would stream this to the frontend and the frontend would handle the messages and their parts to render them accordingly
  // console.log('--- STREAM ---');
  // for await (const message of stream) {
  //   console.log(message);
  // }

  return createUIMessageStreamResponse({ stream });
};


/*
? EXAMPLE OUTPUT IF WE USE A PROMPT SENT BY THE USER
 GET /message-parts 200 in 48ms (next.js: 5ms, application-code: 43ms)
--- STREAM ---
{ type: 'start' }
{ type: 'start-step' }
{ type: 'reasoning-start', id: '0' }
{
  type: 'reasoning-delta',
  id: '0',
  delta: 'The user wants a poem about a pirate written to a file named '
}
{
  type: 'reasoning-delta',
  id: '0',
  delta: '`pirate.md`.\n' +
    '\n' +
    '1.  **Compose the poem:** I need to write a short poem about a pirate'
}
{
  type: 'reasoning-delta',
  id: '0',
  delta: '.\n' +
    '2.  **Call `writeFile`:** Use the `writeFile` tool to save the poem to `pir'
}
{ type: 'reasoning-delta', id: '0', delta: 'ate.md`.' }
{
  type: 'tool-input-start', // TODO: Step 1 - The tool is called with a specific toolCallId, toolName
  toolCallId: 'zJmbzbXtF4TtRKV0',
  toolName: 'writeFile',
  providerMetadata: {
    google: {
      thoughtSignature: 'EiYKJGUyNDgzMGE3LTVjZDYtNDJmZS05OThiLWVlNTM5ZTcyYjljMw=='
    }
  }
}
{
  type: 'tool-input-delta', // TODO: Shows the input being build incrementally
  toolCallId: 'zJmbzbXtF4TtRKV0',
  inputTextDelta: `{"path":"pirate.md","content":"# The Tale of Captain Iron-Eye\\n\\nWith a patch on his eye and a hook for a hand,\\nCaptain Iron-Eye sailed from the sandy strand.\\nHis ship, the *Crimson Gale*, a terror of the sea,\\nWhere the waves crash wild and the salt wind blows free.\\n\\nHe sought out the gold of the Aztec kings,\\nWhere the siren sings and the ocean rings.\\nThrough storms that howled and tempests that tore,\\nHe chased the horizon, forever wanting more.\\n\\n\\"Avast!\\" he would cry, with a voice like a roar,\\nAs his crew stormed the deck of a distant shore.\\nWith cutlasses flashing and pistols in play,\\nThey plundered the riches and sailed far away.\\n\\nBut gold is a burden, and fame is a ghost,\\nOf all the treasures, he loved the coast most.\\nNow he tells his tales in a tavern's dim light,\\nOf the treasures he found in the dead of the night."}`
}
{
  type: 'tool-input-available', // TODO: Indicate that the input is now available
  toolCallId: 'zJmbzbXtF4TtRKV0',
  toolName: 'writeFile',
  input: {
    path: 'pirate.md',
    content: '# The Tale of Captain Iron-Eye\n' +
      '\n' +
      'With a patch on his eye and a hook for a hand,\n' +
      'Captain Iron-Eye sailed from the sandy strand.\n' +
      'His ship, the *Crimson Gale*, a terror of the sea,\n' +
      'Where the waves crash wild and the salt wind blows free.\n' +
      '\n' +
      'He sought out the gold of the Aztec kings,\n' +
      'Where the siren sings and the ocean rings.\n' +
      'Through storms that howled and tempests that tore,\n' +
      'He chased the horizon, forever wanting more.\n' +
      '\n' +
      '"Avast!" he would cry, with a voice like a roar,\n' +
      'As his crew stormed the deck of a distant shore.\n' +
      'With cutlasses flashing and pistols in play,\n' +
      'They plundered the riches and sailed far away.\n' +
      '\n' +
      'But gold is a burden, and fame is a ghost,\n' +
      'Of all the treasures, he loved the coast most.\n' +
      "Now he tells his tales in a tavern's dim light,\n" +
      'Of the treasures he found in the dead of the night.'
  },
  providerMetadata: {
    google: {
      thoughtSignature: 'EiYKJGUyNDgzMGE3LTVjZDYtNDJmZS05OThiLWVlNTM5ZTcyYjljMw=='
    }
  }
}
{
  type: 'tool-output-available', // TODO: This event shows the result of the tool execution
  toolCallId: 'zJmbzbXtF4TtRKV0',
  output: {
    success: true, // TODO: Indicates whether the tool execution was successful
    message: 'File written successfully: pirate.md',
    path: 'pirate.md'
  },
  providerMetadata: {
    google: {
      thoughtSignature: 'EiYKJGUyNDgzMGE3LTVjZDYtNDJmZS05OThiLWVlNTM5ZTcyYjljMw=='
    }
  }
}

--- After the tool completes, we finish that step and start a new one where we stream text to the frontend ---

{ type: 'reasoning-end', id: '0' }
{ type: 'finish-step' }
{ type: 'start-step' }
{ type: 'text-start', id: '0' }
{ type: 'text-delta', id: '0', delta: 'OK' }
{
  type: 'text-delta',
  id: '0',
  delta: ". I've written the poem about a pirate in `pirate.md"
}
{ type: 'text-delta', id: '0', delta: '`.' }
{ type: 'text-end', id: '0' }
{ type: 'finish-step' }
{ type: 'finish', finishReason: 'stop' }

--- ON FINISH ---
--- The onFinish callback gives us the final shape of the UIMessage, which is what would be used by useChat in a frontend application ---

[
  {
    id: '',
    metadata: undefined,
    role: 'assistant',
    parts: [ // TODO: "parts" is the key property. Collects all the streamed chunks into a clean structure
      { type: 'step-start' }, // ? Marks the beginning of a step
      {
        type: 'reasoning',
        text: 'The user wants a poem about a pirate written to a file named `pirate.md`.\n' +
          '\n' +
          '1.  **Compose the poem:** I need to write a short poem about a pirate.\n' +
          '2.  **Call `writeFile`:** Use the `writeFile` tool to save the poem to `pirate.md`.',
        providerMetadata: undefined,
        state: 'done'
      },
      {
        type: 'tool-writeFile', // ? Contains both the input and output of the tool call
        toolCallId: 'zJmbzbXtF4TtRKV0',
        state: 'output-available',
        title: undefined,
        input: {
          path: 'pirate.md',
          content: '# The Tale of Captain Iron-Eye\n' +
            '\n' +
            'With a patch on his eye and a hook for a hand,\n' +
            'Captain Iron-Eye sailed from the sandy strand.\n' +
            'His ship, the *Crimson Gale*, a terror of the sea,\n' +
            'Where the waves crash wild and the salt wind blows free.\n' +
            '\n' +
            'He sought out the gold of the Aztec kings,\n' +
            'Where the siren sings and the ocean rings.\n' +
            'Through storms that howled and tempests that tore,\n' +
            'He chased the horizon, forever wanting more.\n' +
            '\n' +
            '"Avast!" he would cry, with a voice like a roar,\n' +
            'As his crew stormed the deck of a distant shore.\n' +
            'With cutlasses flashing and pistols in play,\n' +
            'They plundered the riches and sailed far away.\n' +
            '\n' +
            'But gold is a burden, and fame is a ghost,\n' +
            'Of all the treasures, he loved the coast most.\n' +
            "Now he tells his tales in a tavern's dim light,\n" +
            'Of the treasures he found in the dead of the night.'
        },
        output: {
          success: true,
          message: 'File written successfully: pirate.md',
          path: 'pirate.md'
        },
        rawInput: undefined,
        errorText: undefined,
        providerExecuted: undefined,
        preliminary: undefined,
        callProviderMetadata: {
          google: {
            thoughtSignature: 'EiYKJGUyNDgzMGE3LTVjZDYtNDJmZS05OThiLWVlNTM5ZTcyYjljMw=='
          }
        },
        resultProviderMetadata: {
          google: {
            thoughtSignature: 'EiYKJGUyNDgzMGE3LTVjZDYtNDJmZS05OThiLWVlNTM5ZTcyYjljMw=='
          }
        }
      },
      { type: 'step-start' }, // ? Beginning a new step
      {
        type: 'text',
        text: "OK. I've written the poem about a pirate in `pirate.md`.", // ? Final response
        providerMetadata: undefined,
        state: 'done'
      }
    ]
  }
]




*/

// ? EXAMPLE OUTPUT IF WE USE MESSAGES LIKE CHAT-TOOL-CALLING ROUTE
/* 
 GET /message-parts 200 in 282ms (next.js: 124ms, application-code: 158ms)
Current convertedMessages [ { role: 'user', content: [ [Object] ] } ]
--- STREAM ---
{ type: 'start' }
{ type: 'start-step' }
{ type: 'reasoning-start', id: '0' }
{
  type: 'reasoning-delta',
  id: '0',
  delta: 'The user is asking for their todo items for today. I need to'
}
{
  type: 'reasoning-delta',
  id: '0',
  delta: " check the file system for any files that might contain todo lists. I'll start by listing the files in the current"
}
{
  type: 'reasoning-delta',
  id: '0',
  delta: ' directory to see if there are any obvious "todo" files.'
}
{
  type: 'tool-input-start',
  toolCallId: 'wxjJqBVgaSDCmOwe',
  toolName: 'listDirectory',
  providerMetadata: {
    google: {
      thoughtSignature: 'EiYKJGUyNDgzMGE3LTVjZDYtNDJmZS05OThiLWVlNTM5ZTcyYjljMw=='
    }
  }
}
{
  type: 'tool-input-delta',
  toolCallId: 'wxjJqBVgaSDCmOwe',
  inputTextDelta: '{"path":"."}'
}
{
  type: 'tool-input-available',
  toolCallId: 'wxjJqBVgaSDCmOwe',
  toolName: 'listDirectory',
  input: { path: '.' },
  providerMetadata: {
    google: {
      thoughtSignature: 'EiYKJGUyNDgzMGE3LTVjZDYtNDJmZS05OThiLWVlNTM5ZTcyYjljMw=='
    }
  }
}
{
  type: 'tool-output-available',
  toolCallId: 'wxjJqBVgaSDCmOwe',
  output: {
    success: true,
    items: [ [Object] ],
    message: 'Directory listed successfully: ',
    path: ''
  },
  providerMetadata: {
    google: {
      thoughtSignature: 'EiYKJGUyNDgzMGE3LTVjZDYtNDJmZS05OThiLWVlNTM5ZTcyYjljMw=='
    }
  }
}
{ type: 'reasoning-end', id: '0' }
{ type: 'finish-step' }
{ type: 'start-step' }
{ type: 'reasoning-start', id: '0' }
{
  type: 'reasoning-delta',
  id: '0',
  delta: "I see a `todo.md` file. I'll read"
}
{
  type: 'reasoning-delta',
  id: '0',
  delta: ' its content to see what todo items are listed.'
}
{
  type: 'tool-input-start',
  toolCallId: 'pv1kZ7VNSAbEexnD',
  toolName: 'realFile',
  providerMetadata: {
    google: {
      thoughtSignature: 'EiYKJGUyNDgzMGE3LTVjZDYtNDJmZS05OThiLWVlNTM5ZTcyYjljMw=='
    }
  }
}
{
  type: 'tool-input-delta',
  toolCallId: 'pv1kZ7VNSAbEexnD',
  inputTextDelta: '{"path":"todo.md"}'
}
{
  type: 'tool-input-available',
  toolCallId: 'pv1kZ7VNSAbEexnD',
  toolName: 'realFile',
  input: { path: 'todo.md' },
  providerMetadata: {
    google: {
      thoughtSignature: 'EiYKJGUyNDgzMGE3LTVjZDYtNDJmZS05OThiLWVlNTM5ZTcyYjljMw=='
    }
  }
}
{
  type: 'tool-output-available',
  toolCallId: 'pv1kZ7VNSAbEexnD',
  output: {
    success: true,
    content: '- Write my talk\r\n',
    message: 'File read successfully: todo.md',
    path: 'todo.md'
  },
  providerMetadata: {
    google: {
      thoughtSignature: 'EiYKJGUyNDgzMGE3LTVjZDYtNDJmZS05OThiLWVlNTM5ZTcyYjljMw=='
    }
  }
}
{ type: 'reasoning-end', id: '0' }
{ type: 'finish-step' }
{ type: 'start-step' }
{ type: 'reasoning-start', id: '0' }
{
  type: 'reasoning-delta',
  id: '0',
  delta: 'The `todo.md` file contains one item: "Write my'
}
{
  type: 'reasoning-delta',
  id: '0',
  delta: ' talk". I will inform the user.'
}
{ type: 'reasoning-end', id: '0' }
{ type: 'text-start', id: '1' }
{
  type: 'text-delta',
  id: '1',
  delta: 'You have one todo item for today:\n- Write my talk'
}
{ type: 'text-end', id: '1' }
{ type: 'finish-step' }
{ type: 'finish', finishReason: 'stop' }
--- ON FINISH ---
[
  {
    id: '',
    metadata: undefined,
    role: 'assistant',
    parts: [
      { type: 'step-start' },
      {
        type: 'reasoning',
        text: `The user is asking for their todo items for today. I need to check the file system for any files that might contain todo lists. I'll start by listing the files in the current directory to see if there are any obvious "todo" files.`,
        providerMetadata: undefined,
        state: 'done'
      },
      {
        type: 'tool-listDirectory',
        toolCallId: 'wxjJqBVgaSDCmOwe',
        state: 'output-available',
        title: undefined,
        input: { path: '.' },
        output: {
          success: true,
          items: [ { name: 'todo.md', type: 'file', size: 17 } ],
          message: 'Directory listed successfully: ',
          path: ''
        },
        rawInput: undefined,
        errorText: undefined,
        providerExecuted: undefined,
        preliminary: undefined,
        callProviderMetadata: {
          google: {
            thoughtSignature: 'EiYKJGUyNDgzMGE3LTVjZDYtNDJmZS05OThiLWVlNTM5ZTcyYjljMw=='
          }
        },
        resultProviderMetadata: {
          google: {
            thoughtSignature: 'EiYKJGUyNDgzMGE3LTVjZDYtNDJmZS05OThiLWVlNTM5ZTcyYjljMw=='
          }
        }
      },
      { type: 'step-start' },
      {
        type: 'reasoning',
        text: "I see a `todo.md` file. I'll read its content to see what todo items are listed.",
        providerMetadata: undefined,
        state: 'done'
      },
      {
        type: 'tool-realFile',
        toolCallId: 'pv1kZ7VNSAbEexnD',
        state: 'output-available',
        title: undefined,
        input: { path: 'todo.md' },
        output: {
          success: true,
          content: '- Write my talk\r\n',
          message: 'File read successfully: todo.md',
          path: 'todo.md'
        },
        rawInput: undefined,
        errorText: undefined,
        providerExecuted: undefined,
        preliminary: undefined,
        callProviderMetadata: {
          google: {
            thoughtSignature: 'EiYKJGUyNDgzMGE3LTVjZDYtNDJmZS05OThiLWVlNTM5ZTcyYjljMw=='
          }
        },
        resultProviderMetadata: {
          google: {
            thoughtSignature: 'EiYKJGUyNDgzMGE3LTVjZDYtNDJmZS05OThiLWVlNTM5ZTcyYjljMw=='
          }
        }
      },
      { type: 'step-start' },
      {
        type: 'reasoning',
        text: 'The `todo.md` file contains one item: "Write my talk". I will inform the user.',
        providerMetadata: undefined,
        state: 'done'
      },
      {
        type: 'text',
        text: 'You have one todo item for today:\n- Write my talk',
        providerMetadata: undefined,
        state: 'done'
      }
    ]
  }
]

*/