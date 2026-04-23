import { google } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  type ModelMessage,
  type UIMessage,
} from 'ai';

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const POST = async (req: Request): Promise<Response> => {
  const body = await req.json();

  // TODO: get the UIMessage[] from the body
  const messages: UIMessage[] = body.messages;

  // TODO: convert the UIMessage[] to ModelMessage[]
  const modelMessages: ModelMessage[] = await convertToModelMessages(messages);

  // TODO: pass the modelMessages to streamText
  const streamTextResult = streamText({
    model: openrouter('google/gemma-4-26b-a4b-it:free'),
    messages: modelMessages,
  });

  // TODO: create a UIMessageStream from the streamTextResult
  const stream = streamTextResult.toUIMessageStream()

  return createUIMessageStreamResponse({
    stream
  });
};