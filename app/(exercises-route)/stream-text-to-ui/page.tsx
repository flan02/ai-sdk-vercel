'use client'
import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { ChatInput, Message, Wrapper } from '@/components/chat';

const App = () => {
  // TODO: use the useChat hook to get the messages and sendMessage function
  const { messages, sendMessage } = useChat();

  const [input, setInput] = useState(
    `What's the capital of France?`,
  );

  return (
    <Wrapper>
      {messages.map((message) => (
        <Message
          key={message.id}
          role={message.role}
          parts={message.parts}
        />
      ))}
      <ChatInput
        input={input}
        onChange={(e) => setInput(e.target.value)}
        onSubmit={(e) => {
          e.preventDefault();
          // TODO: send the message
          sendMessage({
            text: input
          });
          setInput('');
        }}
      />
    </Wrapper>
  );
};

export default App;