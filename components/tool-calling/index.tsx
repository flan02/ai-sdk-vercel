import { CustomUIMessage } from '@/tools';
import type { UIDataTypes, UIMessagePart, UITools } from 'ai';
import React from 'react';
import ReactMarkdown from 'react-markdown';

export const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {props.children}
    </div>
  )
}

export const Message = ({
  role,
  parts,
}: {
  role: string;
  parts: CustomUIMessage['parts'] // * Contains custom tools added to the UI message parts
  // parts: UIMessagePart<UIDataTypes, UITools>[];
}) => {
  const prefix = role === 'user' ? 'User: ' : 'AI: ';

  const text = parts
    .map((part, index) => {
      if (part.type === 'text') {
        return (
          <div key={index} className="prose prose-invert my-6">
            <ReactMarkdown>{prefix + part.text}</ReactMarkdown>
          </div>
        );
      }
      // ? NOTE: Note how the tool-writeFile part is type-safe. Beautiful
      if (part.type === 'tool-writeFile') {
        return (
          <div key={index} className="bg-slate-800/20 border border-slate-200 rounded p-3 text-sm">
            <div className='font-semibold mb-1 text-blue-300'>{`**Tool Call:** Write to file \`${part.input?.path}\``}</div>
          </div>
        )
      }
      return '';
    })
    .join('');
};

export const ChatInput = ({
  input,
  onChange,
  onSubmit,
  disabled,
}: {
  input: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled?: boolean;
}) => (
  <form onSubmit={onSubmit}>
    <input
      className={`fixed bottom-0 w-full max-w-md p-2 mb-8 border-2 border-zinc-700 rounded shadow-xl bg-gray-800 ${disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      value={input}
      placeholder={
        disabled
          ? 'Please handle tool calls first...'
          : 'Say something...'
      }
      onChange={onChange}
      disabled={disabled}
      autoFocus
    />
  </form>
);