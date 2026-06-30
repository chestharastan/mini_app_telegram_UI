# Shop App — Next.js

This project was converted from Vite React to a Next.js App Router project.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Local browser checkout

Checkout uses Telegram `initData` in production. To test checkout from a normal
local browser, add your bot token to `.env.local` without the `NEXT_PUBLIC_`
prefix:

```bash
BOT_TOKEN=your_telegram_bot_token
```

Restart `npm run dev` after changing `.env.local`. The local Next.js proxy uses
that token only on localhost/development to sign a test Telegram user.

## Build

```bash
npm run build
npm start
```
