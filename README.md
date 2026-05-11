# AutoAdvisor 🚗

AI-powered car ownership assistant — insurance, financing, maintenance, and more.

Built with React + Vite, powered by Claude (Anthropic).

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy to Vercel (one command)

```bash
npm install -g vercel
vercel deploy --prod
```

That's it. Vercel auto-detects Vite and handles the build.

## How it works

The app calls the Anthropic API directly from the browser. The API key
is handled by the Claude.ai artifact proxy in development; for your own
standalone deployment you'll need to either:

1. **Add a backend proxy** (recommended for production) — a simple
   Express/Next.js route that forwards requests to Anthropic with your
   API key stored as an environment variable.

2. **Use Vercel Edge Functions** — add `/api/chat.js` as a proxy and
   point the frontend fetch at `/api/chat` instead.

### Quick proxy setup for Vercel

Create `api/chat.js`:

```js
export const config = { runtime: 'edge' }

export default async function handler(req) {
  const body = await req.json()
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  })
  return new Response(res.body, { headers: { 'Content-Type': 'application/json' } })
}
```

Then in `App.jsx`, change the fetch URL from
`https://api.anthropic.com/v1/messages` to `/api/chat`.

Add your key in Vercel dashboard: Settings → Environment Variables →
`ANTHROPIC_API_KEY`.
