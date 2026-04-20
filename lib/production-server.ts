import { Hono } from 'hono'
import { handle } from 'hono/vercel' // 👈 El adaptador mágico

const app = new Hono().basePath('/api')

app.get('/hello', (c) => c.json({ message: 'Hello from Hono!' }))

// En lugar de serve(app), hacés esto:
export const POST = handle(app)
export const GET = handle(app)