import { convertToModelMessages, type ModelMessage } from 'ai'
import { startServer } from '../lib/portable-server'

// const messages: ModelMessage[] = [
//   {
//     role: "system",
//     content: "You are a helpful assistant."
//   },
//   {
//     role: "user",
//     content: "What is the capital of France?"
//   },
//   {
//     role: "assistant",
//     content: "The capital of France is Paris."
//   }
// ]

const messages: ModelMessage[] = [
  {
    role: "user",
    content: "What's the capital of Wales?"
  },
]


await startServer()


const response = await fetch('http://localhost:3001/api/get-completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(messages)
})

const newMessages = (await response.json()) as ModelMessage[]

const allMessages = [...messages, ...newMessages]

console.dir(allMessages, { depth: null })