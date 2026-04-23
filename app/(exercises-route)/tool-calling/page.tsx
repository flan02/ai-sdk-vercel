'use client'

import { ChatInput, Message, Wrapper } from "@/components/chat";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";

type Props = {}

const ToolCalling = (props: Props) => {

  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat-tool-calling'
    })
  });

  const [input, setInput] = useState(
    'Tell me what todo items I have today.',
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