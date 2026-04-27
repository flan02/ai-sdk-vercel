'use client'

import { ChatInput, Wrapper } from "@/components/chat";
import { Message } from "@/components/tool-calling";
import { CustomUIMessage } from "@/tools";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useState } from "react";

type Props = {}

const ToolCalling = (props: Props) => {

  const { messages, sendMessage, status } = useChat<CustomUIMessage>({
    transport: new DefaultChatTransport({
      api: '/api/chat-message-parts',
    }),
  });

  const [input, setInput] = useState(
    'Write a topic to create a story you want to hear.',
  );


  return (
    <Wrapper>
      {
        messages.map((message) => (
          <Message
            key={message.id}
            role={message.role}
            parts={message.parts}
          />
        ))
      }

      {status !== 'ready' && (
        <div className="flex items-center gap-2 p-4 text-zinc-500 animate-pulse bg-slate-800/20 rounded-lg">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <span className="text-sm italic">
            {status === 'submitted' ? 'La IA está procesando...' : 'Generando historia...'}
          </span>
        </div>
      )}
      <ChatInput
        input={input}
        onChange={(e) => setInput(e.target.value)}
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage({
            text: input,
          });
          setInput('');
        }}
      />
    </Wrapper>
  );
};




export default ToolCalling