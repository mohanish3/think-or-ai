# Think or AI

Describe a task, get a verdict: use your own brain, use AI, or a hybrid — with a confidence score, a per-attribute breakdown, and a step-by-step strategy for whichever way it goes.

```bash
git clone https://github.com/mohanish3/think-or-ai
cd think-or-ai
npm install
cp .env.local.example .env.local   # add your OPENAI_API_KEY
npm run dev
```

Open `http://localhost:3000`, type in a task, and get a structured analysis back.

## How it works

The task description is sent to `gpt-4o-mini` with a strict JSON schema and a system prompt that weighs learning value, creativity, emotional weight, time sensitivity, complexity, personal judgment, and repetitiveness. The model returns:

- **Verdict** — Use Your Brain / Use AI / Hybrid, with a 0-100 confidence score
- **Attributes** — a scored breakdown (0-10) of the factors behind the verdict
- **Reasons** — the specific points that drove the call
- **Strategy** — a numbered plan for executing the recommended approach
- **Science note** — the underlying reasoning in plain language

No hardcoded rules or keyword matching — every verdict is generated per-task by the model against the same schema, so results are structured but not templated.

## Stack

Next.js 15 (App Router) + React 19 + Tailwind, single API route (`app/api/analyze/route.ts`) calling the OpenAI SDK. No database — stateless, one request per analysis.

## Requirements

Node.js 20+, an `OPENAI_API_KEY`.
