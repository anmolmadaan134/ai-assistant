# 🤖 AI Assistant (Next.js + AI SDK v5)

A modern AI chat application built using **Next.js 15**, **AI SDK v5**, **Groq/OpenAI**, **NextAuth**, **Drizzle ORM**, and **shadcn/ui**.

It supports **authentication**, **tool calling**, **streaming responses**, and **persistent chat history**.

**Production URL** - https://ai-assistant-flame-seven.vercel.app/

---

## ✨ Features

- 🔐 Google & GitHub authentication (NextAuth)
- 💬 Streaming AI chat (AI SDK v5)
- 🧰 Tool calling
  - Weather (OpenWeather)
  - Stocks (Alpha Vantage)
  - Formula 1 (Ergast)
- 🗃️ Chat history stored per user (PostgreSQL)
- 🎨 Clean UI using shadcn/ui
- 🚪 Logout support

---

## 🧠 How It Works

- Users must be logged in to access `/chat`
- Messages are streamed from the model
- The model decides when to call tools
- Tool outputs are rendered as cards
- User & assistant messages are saved to the database
- History is restored on login

---

## 🏗️ Tech Stack

- **Framework:** Next.js (App Router)
- **Auth:** NextAuth
- **AI:** AI SDK v5
- **Model:** Groq / OpenAI
- **Database:** PostgreSQL + Drizzle ORM
- **UI:** shadcn/ui + Tailwind CSS

---

## ⚙️ Environment Variables

```env
DATABASE_URL=
NEXTAUTH_SECRET=

GOOGLE_ID=
GOOGLE_SECRET=
GITHUB_ID=
GITHUB_SECRET=

GROQ_API_KEY=
OPENAI_API_KEY=

OPENWEATHER_API_KEY=
ALPHAVANTAGE_API_KEY=

```

## Run Locally
```


npm install
npx drizzle-kit migrate
npm run dev

```
