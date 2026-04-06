<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

import @skills/vercel-react-best-practices
import @skills/find-skills

## 🛠 Stack & Rules

- **Package Manager:** pnpm (Never use npm or yarn).
- **IA:** Vercel AI SDK (ai-sdk/openai). Use streaming and Tool Calling.
- **Styling:** Tailwind CSS + shadcn/ui.
- **Goal:** The project is only for learning purposes so far.

## 💡 Instructions

- Always prioritize Server Components and Server Actions.
- If a suggested API doesn't match Next.js 16 docs, flag it immediately.
- Document code and explain technical logic in English (for professional practice).
