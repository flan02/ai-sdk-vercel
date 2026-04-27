'use client'
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { Message, Wrapper } from '@/components/chat';
import { ChatInput } from '@/components/image-describing';

type Props = {}

const fileToDataURL = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};


const page = (props: Props) => {

  const { messages, sendMessage } = useChat({});

  const [input, setInput] = useState(
    'Could you describe this image?',
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(
    null,
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
        onInputChange={(e) => setInput(e.target.value)}
        onFileSelect={(file: File | null) => setSelectedFile(file)}
        selectedFile={selectedFile}
        onSubmit={async (e) => {
          e.preventDefault();

          const formData = new FormData(
            e.target as HTMLFormElement,
          );
          const file = formData.get('file') as File;

          sendMessage({
            parts: [
              {
                type: 'text',
                text: input,
              },
              {
                type: 'file',
                mediaType: file.type,
                url: await fileToDataURL(file),
              },
            ],
          });
          setInput('');
          setSelectedFile(null);
        }}
      />
    </Wrapper>
  );
}

export default page