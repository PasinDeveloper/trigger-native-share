# RecipeShare

A production-grade recipe blog built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, **shadcn/ui** components, and **PostgreSQL on Neon** — featuring the **Web Share API** for native OS sharing.

## Features

- 📖 **Blog-style recipe listing** — responsive grid of 10 recipes with category, difficulty, and timing info
- 🔍 **Recipe detail pages** — full ingredient lists, step-by-step instructions, and nutrition info
- 📤 **Web Share API** — uses `navigator.share()` for native OS sharing on supported devices
- 📋 **Clipboard fallback** — gracefully falls back to copying the link on unsupported browsers
- 🛡️ **Defensive handling** — catches `AbortError` when users dismiss the share dialog
- 🗄️ **Neon PostgreSQL** — serverless Postgres via Drizzle ORM
- ⚡ **Dynamic rendering** — pages render on demand, keeping the build DB-free

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (manual setup) |
| Database | PostgreSQL on [Neon](https://neon.tech) |
| ORM | Drizzle ORM |
| Share | Web Share API + Clipboard fallback |

## Getting Started

### 1. Clone & Install

```bash
git clone <repo-url>
cd trigger-native-share
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local and add your Neon connection string
```

Get a free Neon database at [console.neon.tech](https://console.neon.tech).

### 3. Set Up the Database

```bash
# Push the schema to your Neon database
npm run db:push

# Seed the database with 10 recipes
npm run db:seed
```

### 4. Run the App

```bash
npm run dev
# Open http://localhost:3000
```

## Database Scripts

| Command | Description |
|---|---|
| `npm run db:push` | Push schema changes directly to the database |
| `npm run db:generate` | Generate SQL migration files |
| `npm run db:migrate` | Run pending migrations |
| `npm run db:seed` | Seed the database with 10 recipes |
| `npm run db:studio` | Open Drizzle Studio (visual DB explorer) |

## Web Share API Implementation

The `ShareButton` component (`src/components/ShareButton.tsx`) implements the full Web Share API spec:

```typescript
// 1. Check support via feature detection
if (typeof navigator !== "undefined" && "share" in navigator) {
  // 2. Validate payload with canShare()
  if (navigator.canShare && !navigator.canShare(shareData)) {
    // fall back to clipboard
  }
  try {
    // 3. Invoke native share dialog
    await navigator.share({ title, text, url });
  } catch (error) {
    if (error.name === "AbortError") {
      // User dismissed — not an error
    } else {
      // Fall back to clipboard
    }
  }
}
```

### Browser Support Matrix

| OS | Supported Browsers |
|---|---|
| Windows 11/10 | Edge, Chrome, Opera |
| macOS | Safari, Chrome, Edge |
| iOS/iPadOS | Safari, Chrome, Edge |
| Android | Chrome, Samsung Internet |

> Desktop Firefox and Linux do not support the Web Share API. The app falls back to clipboard copy automatically.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with header & footer
│   ├── page.tsx            # Home page — recipe grid
│   └── recipes/[slug]/     # Dynamic recipe detail page
│       └── page.tsx
├── components/
│   ├── RecipeCard.tsx      # Blog-style card with share button
│   ├── ShareButton.tsx     # Web Share API + clipboard fallback
│   └── ui/                 # shadcn/ui primitives
│       ├── badge.tsx
│       ├── button.tsx
│       └── card.tsx
├── data/
│   └── recipes/            # 10 recipe JSON source files
├── lib/
│   ├── db.ts               # Lazy Neon/Drizzle connection
│   ├── recipes.ts          # DB query helpers
│   ├── schema.ts           # Drizzle table schema
│   └── utils.ts            # cn() helper
└── types/
    └── recipe.ts           # Recipe TypeScript interface
```
