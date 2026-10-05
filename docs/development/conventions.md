# Conventions

How the code is organised and written. When in doubt, follow the nearest existing code.

## Folder layout

```
src/
  app/                 Routes (App Router)
    (marketing)/       Public pages: landing, tracks, about, legal
    (auth)/            Log in, sign up, the code page
    (app)/             Signed-in pages: home, settings, admin
    (dev)/fixtures/    Test-only pages, built only with PCL_FIXTURES=1
    learn/             Lesson pages
    api/               Route handlers (cron, revalidate)
  components/
    ui/                Primitives (Button, Card, Field, Heading…): use these, don't style raw elements
    layout/            Header, footer, app shell, theme switch
    marketing/         Landing and track page sections
    lesson/            The lesson player, steps, parts, labs and the runner frame
    app/               Signed-in components
  content/             Copy and syllabus data for public pages
  lib/                 Logic without UI: auth, lessons, progress, runner, security, SEO, Supabase clients
supabase/              Migrations, sign-in settings and email templates
tools/content-build/   The lesson build, code checks, preview and publishing (Node-run TypeScript)
content/samples/       Made-up sample lessons (CC BY-SA), for tests and local work
tests/e2e/             Playwright tests;  tests/db/  database tests
```

## Components

- **Server Components by default.** Add `'use client'` only where interaction needs it, and keep that component small.
- **Reuse the primitives** in `src/components/ui`. If a primitive is missing, add it there rather than styling one-off elements.
- **Accessibility is part of done:** a keyboard path, visible focus, labelled controls, text alternatives, no information by colour alone, and reduced motion respected. Every page has an axe check in the end-to-end tests, in both themes.

## Styling

- Tailwind CSS 4 with the Prism design tokens from `src/app/globals.css` (`bg-row`, `text-ink-soft`, `border-line`, `text-fe-text`…). Never hard-code a colour that has a token.
- Both themes work everywhere: check light and dark.
- Track colours mean tracks. Don't use them as decoration.

## Server and client boundaries

- Validate every input that crosses a trust boundary with **Zod**: form data, route bodies, query strings, messages from the runner frame. In browser code, use `zod/mini`.
- The Supabase **secret key** is read only by files that import `server-only` (`src/lib/supabase/admin.ts`, `src/lib/server-env.ts`).
- On the server, verify the session with `getClaims()` (`requireUser`), never `getSession()`.
- Progress is written only through the `record_progress()` database function, which checks every value.
- Browser code reads public settings from `src/lib/public-config.ts`, not from `src/lib/env.ts`, so Zod isn't shipped to learners.

## Naming

- Files and folders: `kebab-case`. Components: `PascalCase`. Functions and variables: `camelCase`.
- Name things for what they mean to a learner or a reader, not how they're built.

## Copy rules

- **British English.** Sentence case for headings; Title Case for buttons and labels ("Send Me a Code"). No all-caps except acronyms.
- Say **learner**, not student or user.
- **Never claim what the product can't do today.** Planned features are labelled as planned, or left out.
- **Never count tracks** in copy: more are coming.
- **Never offer career support**, job placement or CV reviews.
- No jargon such as PRIMM on public pages.

## Commits

- Conventional Commits: `feat(scope): …`, `fix(…)`, `docs(…)`, `test(…)`, `chore(…)`.
- Commits are authored by the founder. No co-author trailers.
- Each commit leaves the build, the types, the lint and the tests passing.
- Never commit secrets, `.env.local`, `.mcp.json` or real learner data.
