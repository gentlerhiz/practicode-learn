# Getting started

How to run PractiCode Learn on your own computer, from a fresh clone to a signed-in learner playing a lesson.

## What you need

- **Node.js 22.12 or later** (24 is what CI and Vercel use).
- **Git.**
- For signing in, progress and the database tests: access to the **dev Supabase project**. Without it, the public site and the sample lesson still work.

## 1. Clone and install

```bash
git clone https://github.com/gentlerhiz/practicode-learn.git
cd practicode-learn
npm install
npx playwright install chromium   # only if you will run the end-to-end tests or the code checks
```

## 2. Settings

```bash
cp .env.example .env.local
```

Every variable is optional for the public site. `.env.local` is git-ignored: never commit it, and never paste its values into issues or chats. Each variable is described in [`.env.example`](../../.env.example). The ones that matter most:

| Variable | Needed for | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Sign-in, progress, home and settings | Public values from the dev project's API settings |
| `SUPABASE_SECRET_KEY` | Recording a learner's country, deleting accounts, publishing lessons | Bypasses row-level security. Only code that imports `server-only` reads it |
| `NEXT_PUBLIC_CONTENT_SOURCE` | Where lessons come from | `samples` (the default: `content/samples`, no database needed) or `supabase` |
| `SUPABASE_TEST_URL`, `SUPABASE_TEST_PUBLISHABLE_KEY`, `SUPABASE_TEST_SECRET_KEY` | The database tests | Always the **dev** project, never production |
| `RESEND_SMTP_KEY` | `npm run auth:push` only | Sent to Supabase as the sign-in email password |

## 3. Run it

```bash
npm run dev          # http://localhost:3000
```

- The landing page, the Front-End track page and the legal pages need nothing else.
- The sample lesson is at **http://localhost:3000/learn/samples/every-step**. It uses every step type and lab, so it is the quickest way to see the lesson player.
- Signing in needs the Supabase variables. Sign-in sends a real email through Resend; to sign in without an email, the end-to-end tests use a generated code (see [testing](testing.md)).

The service worker (offline lessons) only runs in production builds, so `npm run dev` never caches your changes. To try it, run `npm run build && npm run start`.

## Every npm script

| Script | What it does |
|---|---|
| `npm run dev` | Development server with hot reload on port 3000 |
| `npm run build`, `npm run start` | Production build, and serving it |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generates the route types, then type-checks with TypeScript 7 |
| `npm test`, `npm run test:watch` | Unit, component, tool and database tests (Vitest) |
| `npm run test:e2e` | End-to-end tests in Chromium at phone and desktop sizes, on port 3100 (Playwright and axe) |
| `npm run format` | Prettier |
| `npm run content:samples` | Builds `content/samples` into lesson packs and a catalogue |
| `npm run content:check` | Runs every sample code step in a real browser: solutions pass, starters fail |
| `npm run auth:push` | Applies the sign-in settings in `supabase/config.toml` to the dev project. Run it yourself: it uses your own `supabase login` and shows each change before writing |

## Working with the database

The schema lives in `supabase/migrations/`, one file per change, applied in order. There is no local Supabase (it would need Docker): changes are applied to the dev project, then to production at release. See [testing](testing.md) for the database tests and [content publishing](../operations/content-publishing.md) for lessons.

## Where to go next

- [Conventions](conventions.md): how the code is organised and written.
- [Testing](testing.md): what each test layer proves.
- [Architecture](../architecture/overview.md) and the [decision records](../architecture/adr/README.md).
- [Threat model](../security/threat-model.md) before touching sign-in, progress or the runner.
