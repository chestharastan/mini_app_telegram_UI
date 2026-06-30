# Shop App — Next.js

This project was converted from Vite React to a Next.js App Router project.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Web checkout

Checkout works from the public Vercel domain and from Telegram. Customers must
provide a phone number before placing an order. Telegram users can use the
`Share Telegram phone` button when the app is opened inside Telegram.

When Telegram `initData` is not available, the Next.js API route signs a web
checkout identity on the server. Add the same bot token used by the backend to
local `.env.local` and to Vercel environment variables, without the
`NEXT_PUBLIC_` prefix:

```bash
BOT_TOKEN=your_telegram_bot_token
```

Restart `npm run dev` after changing `.env.local`. Redeploy Vercel after adding
the environment variable there.

## Build

```bash
npm run build
npm start
```
