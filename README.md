# PlayStre Frontend

Frontend for **PlayStre**, a game creation platform built with [Next.js](https://nextjs.org/).

## Backend and AI

PlayStre’s AI and game-creation features are served by a **Flask** application (**Python**). The Flask service integrates the [**OpenRouter**](https://openrouter.ai/) API for model calls. In development, run the Flask server separately and point the frontend at its base URL (see [Environment variables](#environment-variables) below).

## Prerequisites

- Node.js 18+
- `npm` or `yarn`
- (Optional for full stack) Python environment for the PlayStre Flask server

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### 3. Build for production

```bash
npm run build
```

### 4. Run the production build

```bash
npm start
```

## Available scripts

| Script           | Description                                      |
| ---------------- | ------------------------------------------------ |
| `npm run dev`    | Start the development server with hot reload     |
| `npm run build`  | Create an optimized production build             |
| `npm start`      | Run the production server (run `build` first)   |
| `npm run lint`   | Run ESLint                                     |

## Tech stack

**Frontend (this repo)**

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**

**PlayStre stack (with backend)**

- **Python** + **Flask** — game and AI API routes
- **OpenRouter** — LLM/AI for generation (configured on the server; use `.env` on Flask or proxy from Next)

## Environment variables

Add required variables in **`.env.local`** at the project root (this file is not committed; see Next.js [Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables) docs).

Typical values depend on your Flask setup, for example:

- **`NEXT_PUBLIC_API_BASE_URL`** — Base URL of the Flask server (e.g. `http://127.0.0.1:5000` in development) if the browser calls the API directly.
- If only the **Flask** server talks to OpenRouter, set **`OPENROUTER_API_KEY`** (or equivalent) in the **Python** environment, not necessarily in the Next app.

Adjust names to match your actual Flask and OpenRouter configuration.
