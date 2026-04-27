import { handleDownload } from '@/client-fc';
import { CustomUIMessage } from '@/tools';
// import type { UIDataTypes, UIMessagePart, UITools } from 'ai';

import ReactMarkdown from 'react-markdown';

export const Wrapper = (props: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {props.children}
    </div>
  )
}

export const Message = ({ role, parts }: { role: string; parts: CustomUIMessage['parts'] }) => {

  return (
    <div className="flex flex-col gap-2 my-6">
      <div className="text-xs uppercase tracking-widest opacity-50 font-bold">
        {role === 'user' ? 'User' : 'AI'}
      </div>

      <div className="flex flex-col gap-4">
        {parts.map((part, index) => {
          if (part.type === 'text') {
            return (
              <div key={index} className="prose prose-invert max-w-none">
                <ReactMarkdown>{part.text}</ReactMarkdown>
              </div>
            );
          }

          if (part.type === 'tool-writeFile') {
            return (
              <div key={index} className="bg-slate-800/40 border border-blue-500/30 rounded-lg p-4 text-sm shadow-inner">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-blue-300 font-mono">
                    <span className="text-lg">💾</span>
                    <span>Tool Call: <strong>Write to file</strong></span>
                  </div>

                  {/* BOTÓN DE DESCARGA: Solo aparece si el output está disponible */}
                  {part.state === 'output-available' && part.output?.success && (
                    <button
                      onClick={() => handleDownload(part.output.content, part.output.path)}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-md text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <span>📥</span> Descargar {part.output.path}
                    </button>
                  )}
                </div>

                <div className="mt-2 text-zinc-400 bg-black/20 p-2 rounded flex justify-between items-center">
                  <span>Ruta: <code className="text-blue-400">{part.input?.path}</code></span>

                  {/* Feedback visual del estado */}
                  <div className="mt-2 text-zinc-500 text-[10px] italic">
                    {part.state === 'output-available' ? '✓ Guardado' : '... Procesando archivo'}
                  </div>
                </div>
              </div>
            );
          }

          if (part.type === 'tool-generateImage') {
            const isDone = part.state === 'output-available';

            return (
              <div key={index} className="my-2 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
                {!isDone ? (
                  // Estado: Cargando/Pintando
                  <div className="flex aspect-video flex-col items-center justify-center gap-2 animate-pulse">
                    <span className="text-2xl">🎨</span>
                    <p className="text-xs text-zinc-500 font-mono text-center px-4">
                      {part.input?.prompt ? `Pintando: ${part.input.prompt}` : 'Generando portada...'}
                    </p>
                  </div>
                ) : (
                  // Estado: Imagen Lista
                  <div className="flex flex-col">
                    <img
                      src={part.output.url}
                      alt="Portada de la historia"
                      className="w-full aspect-video object-cover"
                    />

                  </div>
                )}
              </div>
            );
          }

        })}
      </div>
    </div>
  );
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