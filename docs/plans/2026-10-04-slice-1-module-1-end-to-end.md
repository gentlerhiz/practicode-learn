# Slice 1: Module 1 End to End — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship learn.practicode.tech as a real product: a fast, fully indexed public site, plus Module 1 of Front-End Web Development playable end to end by guests and signed-in learners, with progress, impact measurement, security and documentation in place.

**Architecture:** One Next.js 16 App Router application at the repository root (`src/app`), deployed on Vercel. Public pages are statically rendered for speed and search. Signed-in pages are dynamic, behind a nonce-based Content Security Policy. Supabase provides Postgres (row-level security on every table, writes through validated database functions), Auth (email code and Google) and Storage (lesson packs). Lessons come from the private content repository as validated packs ([ADR 0007](../architecture/adr/0007-lessons-in-a-private-repo-as-lesson-packs.md)). Learner code runs in a sandboxed runner page with an opaque origin.

**Tech Stack:** Next.js 16.3.x · React 19.2+ · TypeScript 7 (`tsc`) with the TypeScript 6 API for tooling · Tailwind CSS 4.3 · Supabase (`@supabase/ssr` 0.12, `@supabase/supabase-js` 2.117) · Zod 4 · lucide-react · Vitest 5 + Testing Library · Playwright 1.63 + axe · Lighthouse CI · Vercel Web Analytics and Speed Insights.

**Spec:** [docs/specs/2026-10-02-v1-platform-design.md](../specs/2026-10-02-v1-platform-design.md). Also read [lesson-format.md](../curriculum/lesson-format.md), [design-system.md](../design/design-system.md) and the design canvas files in `design/canvas/`.

## Global Constraints

- Node.js 22.12 or later locally; Vercel uses Node.js 24. Next.js minimum is 20.9.
- Next.js 16.3.x: `proxy.ts` (not `middleware.ts`), async `params`/`searchParams`/`cookies()`/`headers()`, ESLint CLI (no `next lint`), Turbopack.
- TypeScript: `tsc` is TypeScript 7 (`@typescript/native` alias); the `typescript` package is the TypeScript 6 API (`@typescript/typescript6`) for typescript-eslint. `strict: true`, `noUncheckedIndexedAccess: true`.
- "Lesson packs stay within 150 KB; lesson pages within 170 KB of JavaScript." (spec §2.4)
- "WCAG 2.2 AA passes automated checks plus a manual audit on all v1 screens." (spec §2.3)
- Every public page: Lighthouse SEO score 100, complete metadata, canonical URL, structured data, share image, in the sitemap. Preview deployments are never indexed.
- No claim on a public page that the product can't back today. Features not shipped (AI tutor, certificates, Pro, community, mentors, other tracks) carry a "Coming soon" label or are hidden.
- Front-End is the only live track. Data Analysis, UI/UX Product Design and AI & Machine Learning show as "Coming soon".
- No payments in slice 1. Copy never says Pro is available; it may say "Pro launches with the full track".
- Copy rules (brand and founder preferences): no all-caps except acronyms and code; Title Case for buttons, navigation and labels; sentence case for headings and sentences; never offer career support, job placement or CV reviews; never count tracks; colour means track; yellow buttons are flat (no shadow or glow); brand gradients run blue to violet only (`#3D5AF5` → `#6E4CF5`), never to pink.
- British English in copy (`lang="en-GB"`, `og:locale` `en_GB`).
- Every table has row-level security. Learners can't write progress tables directly; writes go through validated `security definer` functions.
- The Supabase secret key is used only in server code that imports `server-only`. Secrets live only in environment variables, never in the repository.
- Every input that crosses a trust boundary (forms, route params, query strings, fetched lesson packs, webhook bodies) is validated with Zod.
- Every published impact number comes from real data. Estimates are labelled as estimates.
- Commits use the repository's local identity (Rasaq Idris Akande, idrisaloma120@gmail.com) and end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Signed out mid-lesson or session expired** → the learner keeps going, progress is queued on the device and synced after they sign in again; nothing is lost. Test in Task 11.
2. **No connection** → a lesson opened before reloads offline; a lesson never opened shows the offline page with a clear explanation, not a browser error. Test in Task 16.
3. **Theme on first paint** → "Match device" is the default, the page never flashes the wrong theme, and a chosen theme persists across static pages. Test in Task 2.
4. **Malicious `next` parameter** (`//evil.com`, `https://evil.com`, `/\evil.com`, `javascript:`) on any sign-in route → always lands on a path on our own site. Test in Task 10.
5. **Learner code that throws or never reports back** → a friendly message within 4 seconds, the rest of the page stays usable, and the learner can run again. Test in Task 13.

## Founder checklist

Only the founder can do these. Each is listed with the task that needs it.

| # | Action | Needed by |
|---|---|---|
| F1 | Confirm the licences (AGPL-3.0 code, CC BY-SA 4.0 docs and syllabi), which is open question 3 | Task 8, before the first public push |
| F2 | Create two empty GitHub repositories on your account: `practicode-learn` (public) and `practicode-learn-content` (private). No README, licence or .gitignore | Task 8 |
| F3 | Create two Supabase projects in the London region (`eu-west-2`): `practicode-learn-dev` and `practicode-learn`. Send the project URLs and publishable keys; keep secret keys and database passwords private and paste them into `.env.local` yourself | Task 9 |
| F4 | Run `npx supabase login` once on this computer (it opens your browser) | Task 9 |
| F5 | Resend: add and verify the sending domain `practicode.tech` (DNS records), then create an SMTP API key | Task 10 |
| F6 | Google Cloud: create an OAuth client (web) with the redirect URI Supabase shows; paste the client ID and secret into Supabase Auth → Google | Task 10 |
| F7 | Vercel: import the GitHub repository, add the environment variables from `.env.example`, and add the domain `learn.practicode.tech` (one CNAME record at your DNS provider) | Task 8 |
| F8 | Google Search Console and Bing Webmaster Tools: verify `learn.practicode.tech` and submit the sitemap | Task 20 |
| F9 | Send the official logo pack (`PractiCode_Academy_Official_Logo_Pack.zip`) so the interim icons can be replaced | Task 4 (interim icons until then) |
| F10 | Promote your own account to admin once you've signed in: `update public.profiles set role = 'admin' where id = '<your user id>';` in the SQL editor | Task 11 |

## File structure

```
.                                   repository root = the public app repository
├── AGENTS.md                       version-matched Next.js docs pointer + project rules for coding agents
├── package.json · tsconfig.json · next.config.ts · eslint.config.mjs · postcss.config.mjs
├── vitest.config.ts · vitest.setup.ts · playwright.config.ts · lighthouserc.json · vercel.json
├── .env.example                    every variable, with a comment; no values
├── .github/workflows/ci.yml        lint, typecheck, unit, build, e2e, Lighthouse
├── .github/workflows/codeql.yml · .github/dependabot.yml
├── public/runner.html              isolated learner-code runner (CSP sandbox)
├── public/sw.js                    service worker (offline lessons)
├── supabase/config.toml            auth settings as code (pushed with `supabase config push`)
├── supabase/migrations/            SQL migrations (schema, RLS, functions, storage)
├── supabase/templates/             auth email templates (6-digit code + link)
├── content/samples/                CC BY-SA sample lesson + its built pack, for builds without Supabase
├── tools/content-build/            lesson build, code checks, publish, review preview (moved from the content repo)
├── scripts/                        one-off generators (icons, OG fonts)
├── src/
│   ├── proxy.ts                    nonce CSP + Supabase session refresh for dynamic routes
│   ├── app/                        routes (see each task)
│   ├── components/ui/              primitives: button, link-button, card, pill, badge, container, section, heading,
│   │                               icon, field, segmented-control, visually-hidden, skip-link
│   ├── components/layout/          site-header, mobile-menu, site-footer, logo, theme-toggle, app-shell
│   ├── components/marketing/       landing and track page sections
│   ├── components/seo/json-ld.tsx
│   ├── components/share/share-buttons.tsx
│   ├── components/lesson/          player, steps, parts, labs, preview-frame
│   ├── content/                    typed site content: tracks (syllabus data), faq, legal
│   ├── lib/                        env, site, cn, seo, security, supabase, auth, lessons, runner, progress, impact
│   ├── assets/fonts/               static TTFs for share images
│   └── types/database.ts           generated Supabase types
├── tests/e2e/                      Playwright specs
└── docs/                           existing docs + development, operations, security, evidence
```

Unit tests sit next to the code they test (`*.test.ts[x]`). End-to-end tests live in `tests/e2e/`.

---

# Milestone 1: the public site

Ends with learn.practicode.tech live: landing, Front-End track, about and legal pages, fully indexed, secure and documented.

### Task 1: Project foundation

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `.prettierrc.json`, `.prettierignore`, `vitest.config.ts`, `vitest.setup.ts`, `playwright.config.ts`, `.env.example`, `AGENTS.md`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/lib/env.ts`, `src/lib/cn.ts`
- Modify: `.gitignore`
- Test: `src/lib/env.test.ts`, `src/lib/cn.test.ts`

**Interfaces:**
- Produces: `publicEnv` (typed public variables), `serverEnv()` (server-only variables, throws when missing), `cn(...classes)`; npm scripts `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:e2e`, `format`.

- [ ] **Step 1: Scaffold with the current generator in a scratch folder** (the repository root isn't empty, so create-next-app can't run there)

```bash
cd "$SCRATCH" && npx create-next-app@16.3.8 pcl-scaffold --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --use-npm --no-git --yes
```

Copy into the repository root: `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `next-env.d.ts` is **not** copied (it is generated and git-ignored), `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`, `AGENTS.md`. Merge the scaffold's `.gitignore` lines into ours. Do not copy `README.md` or `public/` sample files.

- [ ] **Step 2: Set package metadata, scripts and the TypeScript side-by-side install**

Edit `package.json` so these fields read exactly:

```json
{
  "name": "practicode-learn",
  "version": "0.1.0",
  "private": true,
  "license": "AGPL-3.0-only",
  "type": "module",
  "engines": { "node": ">=22.12" },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "next typegen && tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "format": "prettier --write .",
    "content:samples": "node tools/content-build/build.ts --in content/samples --out content/samples/packs --catalogue content/samples/catalogue.json"
  }
}
```

```bash
npm install zod clsx tailwind-merge lucide-react server-only @supabase/ssr @supabase/supabase-js @vercel/analytics @vercel/speed-insights
npm install -D "typescript@npm:@typescript/typescript6@^6.0.2" "@typescript/native@npm:typescript@^7.0.2" @types/node prettier prettier-plugin-tailwindcss vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test @axe-core/playwright schema-dts @lhci/cli
npx playwright install chromium
```

- [ ] **Step 3: Verify which TypeScript each tool gets**

```bash
npx tsc --version                                   # expected: Version 7.0.x
node -e "console.log(require('typescript').version)" # expected: 6.0.x
```

If `npx tsc` prints 6.x, change the `typecheck` script to `next typegen && node node_modules/@typescript/native/bin/tsc --noEmit` and note it in `docs/development/getting-started.md` (Task 19).

- [ ] **Step 4: Tighten `tsconfig.json`**

Keep the scaffold's settings and add to `compilerOptions`: `"strict": true`, `"noUncheckedIndexedAccess": true`, `"noImplicitOverride": true`, `"forceConsistentCasingInFileNames": true`, `"resolveJsonModule": true`. Keep `"paths": { "@/*": ["./src/*"] }`. `include` must contain `next-env.d.ts`, `.next/types/**/*.ts`, `**/*.ts`, `**/*.tsx`.

- [ ] **Step 5: Configure Next.js**

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  poweredByHeader: false,
  images: { formats: ['image/avif', 'image/webp'] },
}

export default nextConfig
```

(Task 5 adds security headers; Task 4 adds nothing here.)

- [ ] **Step 6: Configure linting and formatting**

`eslint.config.mjs` keeps the scaffold's flat config (`eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`) and adds `globalIgnores(['.next/**', 'coverage/**', 'playwright-report/**', 'test-results/**', 'content/samples/packs/**', 'design/**', 'tools/content-build/preview/**'])`.

```json
// .prettierrc.json
{ "semi": false, "singleQuote": true, "printWidth": 110, "plugins": ["prettier-plugin-tailwindcss"] }
```

`.prettierignore`: `.next`, `design`, `docs`, `content/samples/packs`, `package-lock.json`.

- [ ] **Step 7: Write the failing tests for env and cn**

```ts
// src/lib/env.test.ts
import { describe, expect, it } from 'vitest'
import { parsePublicEnv } from './env'

describe('parsePublicEnv', () => {
  it('fills safe defaults for local development', () => {
    const env = parsePublicEnv({})
    expect(env.NEXT_PUBLIC_SITE_URL).toBe('http://localhost:3000')
    expect(env.NEXT_PUBLIC_CONTENT_SOURCE).toBe('samples')
  })
  it('rejects a site URL that is not a URL', () => {
    expect(() => parsePublicEnv({ NEXT_PUBLIC_SITE_URL: 'learn practicode' })).toThrow()
  })
  it('requires Supabase settings when content comes from Supabase', () => {
    expect(() => parsePublicEnv({ NEXT_PUBLIC_CONTENT_SOURCE: 'supabase' })).toThrow(/SUPABASE/)
  })
})
```

```ts
// src/lib/cn.test.ts
import { expect, it } from 'vitest'
import { cn } from './cn'

it('merges conflicting Tailwind classes, last one wins', () => {
  expect(cn('px-2 py-1', false && 'hidden', 'px-4')).toBe('py-1 px-4')
})
```

- [ ] **Step 8: Run them to see them fail**

Run: `npx vitest run src/lib` — Expected: FAIL, modules not found.

- [ ] **Step 9: Implement env and cn**

```ts
// src/lib/env.ts
import { z } from 'zod'

const PublicEnv = z
  .object({
    NEXT_PUBLIC_SITE_URL: z.url().default('http://localhost:3000'),
    NEXT_PUBLIC_SUPABASE_URL: z.url().optional(),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(20).optional(),
    NEXT_PUBLIC_CONTENT_SOURCE: z.enum(['samples', 'supabase']).default('samples'),
    NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: z.string().optional(),
    NEXT_PUBLIC_BING_SITE_VERIFICATION: z.string().optional(),
  })
  .superRefine((env, ctx) => {
    if (env.NEXT_PUBLIC_CONTENT_SOURCE === 'supabase' && !(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)) {
      ctx.addIssue({ code: 'custom', message: 'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are required when content comes from Supabase' })
    }
  })

export type PublicEnv = z.infer<typeof PublicEnv>
export const parsePublicEnv = (source: Record<string, string | undefined>): PublicEnv => PublicEnv.parse(source)

// Each variable is named literally so Next.js can inline it into client bundles.
export const publicEnv = parsePublicEnv({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_CONTENT_SOURCE: process.env.NEXT_PUBLIC_CONTENT_SOURCE,
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  NEXT_PUBLIC_BING_SITE_VERIFICATION: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
})
```

```ts
// src/lib/server-env.ts
import 'server-only'
import { z } from 'zod'

const ServerEnv = z.object({
  SUPABASE_SECRET_KEY: z.string().min(20),
  REVALIDATE_SECRET: z.string().min(32),
  CRON_SECRET: z.string().min(32),
})

let cached: z.infer<typeof ServerEnv> | undefined
// Read lazily, so pages that never need secrets build without them.
export function serverEnv() {
  cached ??= ServerEnv.parse(process.env)
  return cached
}
```

```ts
// src/lib/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
```

- [ ] **Step 10: Configure Vitest and Playwright**

```ts
// vitest.config.ts
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)), 'server-only': fileURLToPath(new URL('./vitest.server-only.ts', import.meta.url)) } },
  test: { environment: 'jsdom', setupFiles: ['./vitest.setup.ts'], include: ['src/**/*.test.{ts,tsx}', 'tools/**/*.test.ts'], css: false },
})
```

```ts
// vitest.setup.ts
import '@testing-library/jest-dom/vitest'
```

```ts
// vitest.server-only.ts  — lets unit tests import server modules
export {}
```

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: { baseURL: 'http://localhost:3000', trace: 'retain-on-failure' },
  projects: [
    { name: 'phone', use: { ...devices['Pixel 7'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  ],
  webServer: { command: 'npm run build && npm run start', url: 'http://localhost:3000', reuseExistingServer: !process.env.CI, timeout: 300_000 },
})
```

- [ ] **Step 11: Write `.env.example` and `AGENTS.md`**

`.env.example` lists, each with a one-line comment and no value: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_CONTENT_SOURCE`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION`, `SUPABASE_SECRET_KEY`, `REVALIDATE_SECRET`, `CRON_SECRET`, `SUPABASE_TEST_URL`, `SUPABASE_TEST_PUBLISHABLE_KEY`, `SUPABASE_TEST_SECRET_KEY`.

`AGENTS.md` keeps the Next.js managed block written by `next dev` and adds a "Project rules" section that points to this plan's Global Constraints, `docs/development/conventions.md` and `docs/security/threat-model.md`.

- [ ] **Step 12: Run everything**

```bash
npx vitest run && npm run lint && npm run typecheck && npm run build
```

Expected: tests PASS (4), lint clean, typecheck clean, build succeeds.

- [ ] **Step 13: Commit**

```bash
git add -A && git commit -m "build: scaffold the Next.js 16 app with TypeScript 7, Tailwind 4, Vitest and Playwright"
```

### Task 2: Design tokens, theme and UI primitives

**Files:**
- Create: `src/app/globals.css` (replace scaffold), `src/lib/theme.ts`, `src/components/layout/theme-script.tsx`, `src/components/layout/theme-toggle.tsx`, `src/components/ui/{button,link-button,card,pill,badge,container,section,heading,icon,field,segmented-control,visually-hidden,skip-link}.tsx`, `src/components/ui/index.ts`
- Modify: `src/app/layout.tsx`
- Test: `src/lib/theme.test.ts`, `src/components/ui/button.test.tsx`, `src/components/ui/segmented-control.test.tsx`, `tests/e2e/theme.spec.ts`

**Interfaces:**
- Consumes: `cn` (Task 1).
- Produces:
  - `type ThemePreference = 'dark' | 'light' | 'system'`, `resolveTheme(pref, prefersLight): 'dark' | 'light'`, `THEME_STORAGE_KEY = 'pc-theme'`
  - `<ThemeScript />` (in `<head>`), `<ThemeToggle variant="icon" | "segmented" />`
  - `Button({ variant: 'primary'|'secondary'|'ghost', size: 'sm'|'md'|'lg', ...buttonProps })`
  - `LinkButton({ href: Route, variant, size, ...anchorProps })`
  - `Card({ as?: 'div'|'section'|'article'|'li', tone?: 'surface'|'row'|'sunken' })`
  - `Pill({ tone?: 'neutral'|'track'|'soon' })`, `Badge({ tone: 'success'|'error'|'badge'|'track' })`
  - `Container`, `Section({ id?, labelledBy?, spacing?: 'md'|'lg' })`, `Heading({ level: 1-4, size?: 'display'|'xl'|'lg'|'md' })`
  - `Field({ id, label, hint?, error? , children })`, `Input`
  - `SegmentedControl<T extends string>({ label, value, options: {value: T, label: string, icon?}[], onChange })`
  - `VisuallyHidden`, `SkipLink({ href: '#main' })`
  - Tailwind colour tokens: `bg`, `surface`, `sunken`, `row`, `line`, `line-subtle`, `line-control`, `ink`, `ink-soft`, `ink-muted`, `ink-subtle`, `fe`, `fe-text`, `success`, `error`, `badge`, `primary`, `on-primary`; fonts `font-display`, `font-sans`, `font-mono`.

- [ ] **Step 1: Write the failing theme test**

```ts
// src/lib/theme.test.ts
import { describe, expect, it } from 'vitest'
import { resolveTheme, parsePreference } from './theme'

describe('theme', () => {
  it('follows the device by default', () => {
    expect(resolveTheme(parsePreference(null), true)).toBe('light')
    expect(resolveTheme(parsePreference(null), false)).toBe('dark')
  })
  it('honours an explicit choice whatever the device says', () => {
    expect(resolveTheme('dark', true)).toBe('dark')
    expect(resolveTheme('light', false)).toBe('light')
  })
  it('ignores garbage in storage', () => {
    expect(parsePreference('purple')).toBe('system')
  })
})
```

- [ ] **Step 2: Run it** — `npx vitest run src/lib/theme.test.ts` — Expected: FAIL (module not found).

- [ ] **Step 3: Implement theme helpers and the no-flash script**

```ts
// src/lib/theme.ts
export type ThemePreference = 'dark' | 'light' | 'system'
export const THEME_STORAGE_KEY = 'pc-theme'
export const parsePreference = (raw: string | null): ThemePreference => (raw === 'dark' || raw === 'light' ? raw : 'system')
export const resolveTheme = (pref: ThemePreference, prefersLight: boolean): 'dark' | 'light' =>
  pref === 'system' ? (prefersLight ? 'light' : 'dark') : pref

// Runs in <head> before first paint. Kept tiny and dependency-free; its hash is allowed by the CSP (Task 5).
export const THEME_BOOT_SCRIPT = `(function(){try{var p=localStorage.getItem('${THEME_STORAGE_KEY}');p=p==='dark'||p==='light'?p:'system';var t=p==='system'?(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'):p;var d=document.documentElement;d.dataset.theme=t;d.dataset.themePref=p}catch(e){}})()`
```

```tsx
// src/components/layout/theme-script.tsx
import { THEME_BOOT_SCRIPT } from '@/lib/theme'

export function ThemeScript({ nonce }: { nonce?: string }) {
  return <script nonce={nonce} dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
}
```

`ThemeToggle` (client): reads `data-theme-pref`, writes `localStorage[THEME_STORAGE_KEY]`, sets `data-theme`/`data-theme-pref` on `<html>`, and while the preference is `system` listens to `matchMedia('(prefers-color-scheme: light)')` changes. `variant="icon"` is the round sun/moon button for the guest navbar (`aria-label` "Switch to light mode" / "Switch to dark mode"); `variant="segmented"` renders `SegmentedControl` with Dark, Light and Match device (Settings → Appearance).

- [ ] **Step 4: Write the tokens**

`src/app/globals.css` starts with `@import "tailwindcss";`, then defines every token from [design-system.md](../design/design-system.md) twice: on `:root, [data-theme="dark"]` (dark values) and on `[data-theme="light"]` (light values), as `--pc-*` custom properties. Then:

```css
@theme inline {
  --color-bg: var(--pc-bg);
  --color-sunken: var(--pc-surface-sunken);
  --color-row: var(--pc-surface-row);
  --color-line: var(--pc-line);
  --color-line-subtle: var(--pc-line-subtle);
  --color-line-control: var(--pc-line-control);
  --color-ink: var(--pc-text);
  --color-ink-soft: var(--pc-text-soft);
  --color-ink-muted: var(--pc-text-muted);
  --color-ink-subtle: var(--pc-text-subtle);
  --color-fe: #3d5af5;
  --color-fe-text: var(--pc-fe-text);
  --color-success: var(--pc-success);
  --color-error: var(--pc-error);
  --color-badge: #ff8a3d;
  --color-primary: var(--pc-primary);
  --color-on-primary: var(--pc-on-primary);
  --font-display: var(--font-bricolage), 'Poppins', system-ui, sans-serif;
  --font-sans: var(--font-poppins), system-ui, sans-serif;
  --font-mono: var(--font-jetbrains), ui-monospace, monospace;
}
```

`--pc-surface` (the card gradient) is used through a `.surface` utility: `@utility surface { background: var(--pc-surface); }`. Base layer: `html { background: var(--pc-bg); color: var(--pc-text); }`, `:focus-visible` outline in `var(--pc-fe-line)`, `@media (prefers-reduced-motion: reduce)` disables transitions and animations.

- [ ] **Step 5: Wire fonts and the theme script into the root layout**

```tsx
// src/app/layout.tsx (fonts and theme part; metadata comes in Task 4)
import { Bricolage_Grotesque, JetBrains_Mono, Poppins } from 'next/font/google'
import { ThemeScript } from '@/components/layout/theme-script'
import './globals.css'

const display = Bricolage_Grotesque({ subsets: ['latin'], weight: ['700', '800'], variable: '--font-bricolage', display: 'swap' })
const sans = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-poppins', display: 'swap' })
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-jetbrains', display: 'swap' })

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en-GB" data-theme="dark" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="bg-bg font-sans text-ink antialiased">{children}</body>
    </html>
  )
}
```

`suppressHydrationWarning` is needed because the boot script changes `data-theme` before React hydrates.

- [ ] **Step 6: Write failing component tests**

```tsx
// src/components/ui/button.test.tsx
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { Button } from './button'

it('renders a real button that defaults to type="button"', () => {
  render(<Button>Start Free</Button>)
  expect(screen.getByRole('button', { name: 'Start Free' })).toHaveAttribute('type', 'button')
})
it('primary buttons never get a shadow class', () => {
  render(<Button variant="primary">Go</Button>)
  expect(screen.getByRole('button').className).not.toMatch(/shadow/)
})
```

```tsx
// src/components/ui/segmented-control.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import { SegmentedControl } from './segmented-control'

it('moves the selection with arrow keys, like a radio group', async () => {
  const onChange = vi.fn()
  render(<SegmentedControl label="Appearance" value="dark" onChange={onChange} options={[{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }, { value: 'system', label: 'Match device' }]} />)
  const dark = screen.getByRole('radio', { name: 'Dark' })
  expect(dark).toHaveAttribute('aria-checked', 'true')
  dark.focus()
  await userEvent.keyboard('{ArrowRight}')
  expect(onChange).toHaveBeenCalledWith('light')
})
```

- [ ] **Step 7: Run** — `npx vitest run src/components/ui` — Expected: FAIL.

- [ ] **Step 8: Implement the primitives**

```tsx
// src/components/ui/button.tsx
import { cn } from '@/lib/cn'

const variants = {
  primary: 'bg-primary text-on-primary hover:opacity-90',
  secondary: 'border border-line-control text-ink hover:bg-row',
  ghost: 'text-ink-muted hover:text-ink',
} as const
const sizes = { sm: 'h-9 px-4 text-sm', md: 'h-11 px-5 text-[15px]', lg: 'h-14 px-7 text-base' } as const

export type ButtonStyle = { variant?: keyof typeof variants; size?: keyof typeof sizes }
export const buttonClasses = ({ variant = 'primary', size = 'md' }: ButtonStyle, extra?: string) =>
  cn('inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-45', variants[variant], sizes[size], extra)

export function Button({ variant, size, className, type = 'button', ...props }: ButtonStyle & React.ComponentProps<'button'>) {
  return <button type={type} className={buttonClasses({ variant, size }, className)} {...props} />
}
```

`LinkButton` reuses `buttonClasses` on `next/link`. `SegmentedControl` uses `role="radiogroup"` with `aria-label`, buttons with `role="radio"` and `aria-checked`, roving `tabIndex`, and Left/Right/Home/End keys. Every other primitive is a thin, typed wrapper around semantic HTML with token classes (see Interfaces). Icons: `src/components/ui/icon.tsx` re-exports the lucide icons used on the site with `strokeWidth={1.85}`, `aria-hidden` by default.

- [ ] **Step 9: Write the theme end-to-end test (Review Focus 3)**

```ts
// tests/e2e/theme.spec.ts
import { expect, test } from '@playwright/test'

test('first paint follows a light device, with no dark flash', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  const themes: string[] = []
  await page.exposeFunction('reportTheme', (t: string) => themes.push(t))
  await page.addInitScript(() => {
    new MutationObserver(() => (window as unknown as { reportTheme: (t: string) => void }).reportTheme(document.documentElement.dataset.theme ?? '')).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  expect(themes.filter((t) => t === 'dark')).toHaveLength(0)
})

test('an explicit choice survives navigation between static pages', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await page.evaluate(() => localStorage.setItem('pc-theme', 'light'))
  await page.goto('/about')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})
```

(The second test passes once `/about` exists in Task 8; until then it is skipped with `test.fixme`.)

- [ ] **Step 10: Run unit tests and e2e theme test** — `npx vitest run && npx playwright test tests/e2e/theme.spec.ts --project=desktop` — Expected: PASS (the `/about` test reported as fixme).

- [ ] **Step 11: Commit** — `git add -A && git commit -m "feat(ui): Prism tokens, no-flash theme and reusable UI primitives"`

### Task 3: Site chrome and route groups

**Files:**
- Create: `src/components/layout/{logo,site-header,mobile-menu,site-footer,app-shell}.tsx`, `src/app/(marketing)/layout.tsx`, `src/app/(auth)/layout.tsx`, `src/content/navigation.ts`, `public/brand/icon-yellow.svg`, `public/brand/icon-black.svg`
- Test: `tests/e2e/navigation.spec.ts`

**Interfaces:**
- Consumes: UI primitives, `ThemeToggle` (Task 2).
- Produces: `<SiteHeader />`, `<SiteFooter />`, `<AppShell user={{ name: string | null, isAdmin: boolean }}>`, `navigation.guest: NavItem[]`, `navigation.footer: { heading: string; links: NavItem[] }[]`, `navigation.app: NavItem[]` where `type NavItem = { href: Route; label: string }`.

- [ ] **Step 1: Copy the interim icons** — `cp brand/logo/icon-yellow.svg brand/logo/icon-black.svg public/brand/`

- [ ] **Step 2: Write the navigation data** — `src/content/navigation.ts` exports:
  - `guest`: Tracks (`/tracks/front-end-web-development`), How It Works (`/#how-it-works`), About (`/about`).
  - `footer`: Learn (Front-End Web Development, How It Works), Company (About, PractiCode Academy external link), Legal (Privacy, Terms, Accessibility).
  - `app`: Home (`/home`), My Track (`/tracks/front-end-web-development`), Settings (`/settings`).

  Nothing links to a page that doesn't exist yet. Pricing, Mentors, Review, Projects, Certificates and Community come later.

- [ ] **Step 3: Write the failing navigation test**

```ts
// tests/e2e/navigation.spec.ts
import { expect, test } from '@playwright/test'

test('phone menu opens, traps nothing, and closes with Escape', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'phone only')
  await page.goto('/')
  const button = page.getByRole('button', { name: 'Open menu' })
  await button.click()
  await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'About' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(button).toHaveAttribute('aria-expanded', 'false')
  await expect(button).toBeFocused()
})

test('footer links to About, and every footer link resolves', async ({ page, request }) => {
  await page.goto('/')
  const links = await page.getByRole('contentinfo').getByRole('link').evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).href))
  expect(links.some((l) => l.endsWith('/about'))).toBe(true)
  for (const href of links.filter((l) => l.startsWith('http://localhost'))) {
    expect((await request.get(href)).status(), href).toBe(200)
  }
})
```

- [ ] **Step 4: Run** — `npx playwright test tests/e2e/navigation.spec.ts` — Expected: FAIL.

- [ ] **Step 5: Implement the chrome by porting the canvas**

Port from `design/canvas/PrismLanding.dc.html` (header and footer) and `design/canvas/PrismMenuPhone.dc.html` / `PrismAppMenuPhone.dc.html` (menus):
- Inline styles become token classes (`#07060D` → `bg-bg`, `#2A2540` → `border-line`, `#A9A6BC` → `text-ink-muted`, and so on, per the design-system token table).
- `{{holes}}` become props or component state; `<sc-for>` becomes `.map()`; `<sc-if>` becomes conditional rendering.
- Under 960 px the header keeps the logo, Start Free and the menu button. The menu is a client component: a button with `aria-expanded` and `aria-controls`, a sheet below the header with `<nav aria-label="Main">`, Escape closes it and returns focus to the button.
- The logo is the interim icon plus the Poppins wordmark ("Practi" 400, "Code" 700, " Learn" 400). It uses the yellow icon in dark mode and the black icon in light mode, via `[data-theme="light"] .logo-dark { display: none }`.
- The footer has no "Made by … Ibadan" badge. It ends with "© 2026 Practicode Consult Limited".
- `AppShell` is the learner layout: a sidebar from 1024 px, and a top bar with a menu sheet below that. It contains only `navigation.app`, plus the theme switch and Sign Out (a `<form method="post" action="/auth/signout">`).

`src/app/(marketing)/layout.tsx` renders `<SkipLink />`, `<SiteHeader />`, `<main id="main">{children}</main>` and `<SiteFooter />`. `(auth)/layout.tsx` renders a minimal centred layout with the logo.

- [ ] **Step 6: Run** — `npx playwright test tests/e2e/navigation.spec.ts` — Expected: PASS (once Task 8's `/about` exists; until then the footer test's link check skips 404s for routes listed in a `PENDING` array, which Task 8 empties).

- [ ] **Step 7: Commit** — `git add -A && git commit -m "feat(layout): site header, phone menu, footer and app shell"`

### Task 4: SEO, share images and sharing

**Files:**
- Create: `src/lib/site.ts`, `src/lib/seo/metadata.ts`, `src/lib/seo/jsonld.ts`, `src/lib/seo/pages.ts`, `src/components/seo/json-ld.tsx`, `src/components/share/share-buttons.tsx`, `src/app/{robots.ts,sitemap.ts,manifest.ts,opengraph-image.tsx,twitter-image.tsx,icon.svg,apple-icon.png,favicon.ico}`, `src/app/llms.txt/route.ts`, `src/lib/og/brand-card.tsx`, `src/assets/fonts/{BricolageGrotesque-ExtraBold.ttf,Poppins-Regular.ttf,Poppins-SemiBold.ttf}`, `scripts/fetch-og-fonts.mjs`, `scripts/generate-icons.mjs`
- Modify: `src/app/layout.tsx`
- Test: `src/lib/seo/metadata.test.ts`, `src/lib/seo/jsonld.test.ts`, `src/components/share/share-buttons.test.tsx`, `tests/e2e/seo.spec.ts`

**Interfaces:**
- Consumes: `publicEnv` (Task 1).
- Produces:
  - `site: { name: string; url: string; description: string; locale: 'en_GB'; email: string; sameAs: string[] }`
  - `pageMetadata({ title, description, path, noindex?, type?: 'website' | 'article' }): Metadata`
  - `publicPages: { path: Route; title: string; description: string; changeFrequency: 'weekly' | 'monthly'; priority: number }[]` (single registry used by the sitemap and tests), and `metaFor(path: Route): Metadata` (= `pageMetadata` of that registry entry; throws for an unregistered path)
  - JSON-LD builders: `organizationLd()`, `websiteLd()`, `breadcrumbLd(items: { name: string; path: string }[])`, `courseLd(track: TrackContent)`, `faqLd(items: { q: string; a: string }[])`, `learningResourceLd(lesson: LessonMeta)`
  - `<JsonLd data={...} />`
  - `shareUrls({ url, text }): { whatsapp: string; x: string; linkedin: string; facebook: string }`, `<ShareButtons url text title />`
  - `brandCard({ eyebrow, title, footer }): JSX` for every `ImageResponse`

- [ ] **Step 1: Write failing tests for metadata and JSON-LD**

```ts
// src/lib/seo/metadata.test.ts
import { describe, expect, it } from 'vitest'
import { pageMetadata } from './metadata'
import { publicPages } from './pages'

describe('pageMetadata', () => {
  it('sets canonical, Open Graph and X card from one call', () => {
    const m = pageMetadata({ title: 'About', description: 'Who we are and why we teach this way, in plain words.', path: '/about' })
    expect(m.alternates?.canonical).toBe('/about')
    expect(m.openGraph).toMatchObject({ url: '/about', title: 'About', siteName: 'PractiCode Learn', locale: 'en_GB' })
    expect(m.twitter).toMatchObject({ card: 'summary_large_image' })
    expect(m.robots).toMatchObject({ index: true, follow: true })
  })
  it('marks private pages noindex', () => {
    expect(pageMetadata({ title: 'Settings', description: 'x'.repeat(60), path: '/settings', noindex: true }).robots).toMatchObject({ index: false, follow: false })
  })
})

describe('publicPages', () => {
  it.each(publicPages)('$path has a title of 60 characters or fewer and a 70–160 character description', (p) => {
    expect(p.title.length).toBeLessThanOrEqual(60)
    expect(p.description.length).toBeGreaterThanOrEqual(70)
    expect(p.description.length).toBeLessThanOrEqual(160)
  })
})
```

```ts
// src/lib/seo/jsonld.test.ts
import { expect, it } from 'vitest'
import { serializeJsonLd, organizationLd, breadcrumbLd } from './jsonld'

it('escapes characters that could close the script element', () => {
  expect(serializeJsonLd({ name: '</script><script>alert(1)</script>' })).not.toContain('</script>')
})
it('builds absolute breadcrumb URLs', () => {
  const ld = breadcrumbLd([{ name: 'Tracks', path: '/tracks/front-end-web-development' }])
  expect(ld.itemListElement[0]).toMatchObject({ position: 1, item: expect.stringMatching(/^https?:\/\//) })
})
it('describes the organisation with a logo', () => {
  expect(organizationLd()).toMatchObject({ '@type': 'EducationalOrganization', name: 'PractiCode Learn', logo: expect.stringContaining('/brand/') })
})
```

```tsx
// src/components/share/share-buttons.test.tsx
import { expect, it } from 'vitest'
import { shareUrls } from './share-buttons'

it('encodes share links for each network', () => {
  const s = shareUrls({ url: 'https://learn.practicode.tech/about', text: 'Learn by doing & keep it' })
  expect(s.whatsapp).toBe('https://wa.me/?text=Learn%20by%20doing%20%26%20keep%20it%20https%3A%2F%2Flearn.practicode.tech%2Fabout')
  expect(s.linkedin).toBe('https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Flearn.practicode.tech%2Fabout')
  expect(s.x).toContain('https://x.com/intent/post?')
  expect(s.facebook).toContain('https://www.facebook.com/sharer/sharer.php?u=')
})
```

- [ ] **Step 2: Run** — `npx vitest run src/lib/seo src/components/share` — Expected: FAIL.

- [ ] **Step 3: Implement site config, metadata, page registry and JSON-LD**

```ts
// src/lib/site.ts
import brand from '../../brand/brand.config.json'
import { publicEnv } from './env'

export const site = {
  name: brand.product.name,
  url: publicEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, ''),
  description: 'Learn the skills employers are hiring for, by doing. Interactive lessons, real projects and practice that works on your phone.',
  locale: 'en_GB' as const,
  email: brand.product.supportEmail,
  sameAs: ['https://practicode.tech'],
}
export const absoluteUrl = (path: string) => new URL(path, `${site.url}/`).toString()
```

```ts
// src/lib/seo/metadata.ts
import type { Metadata } from 'next'
import { site } from '@/lib/site'

type PageMeta = { title: string; description: string; path: string; noindex?: boolean; type?: 'website' | 'article' }

export function pageMetadata({ title, description, path, noindex = false, type = 'website' }: PageMeta): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type, url: path, title, description, siteName: site.name, locale: site.locale },
    twitter: { card: 'summary_large_image', title, description },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  }
}
```

`src/lib/seo/pages.ts` exports `publicPages` for `/`, `/tracks/front-end-web-development`, `/about`, `/legal/privacy`, `/legal/terms`, `/legal/accessibility`, each with its final title and description (Task 6–8 pages import their metadata from here, so the registry is the single source).

```ts
// src/lib/seo/jsonld.ts (core)
import type { BreadcrumbList, EducationalOrganization, WithContext } from 'schema-dts'
import { absoluteUrl, site } from '@/lib/site'

export const serializeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c')

export const organizationLd = (): WithContext<EducationalOrganization> => ({
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: site.name,
  url: site.url,
  logo: absoluteUrl('/brand/icon-yellow.svg'),
  email: site.email,
  parentOrganization: { '@type': 'Organization', name: 'PractiCode Academy', url: 'https://practicode.tech' },
  sameAs: site.sameAs,
})

export const breadcrumbLd = (items: { name: string; path: string }[]): WithContext<BreadcrumbList> & { itemListElement: { position: number; item: string; name: string }[] } => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Home', path: '/' }, ...items].map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
})
```

`websiteLd()`, `courseLd(track)` (`@type: Course` with `name`, `description`, `provider`, `inLanguage: 'en-GB'`, `educationalLevel: 'Beginner'`, `hasCourseInstance: { courseMode: 'Online', courseWorkload: 'PT140H' }`, `offers: { price: 0, priceCurrency: 'NGN', category: 'Free' }` for Module 1 only, `syllabusSections` from the track's modules), `faqLd(items)` and `learningResourceLd(lesson)` follow the same pattern with `schema-dts` types.

```tsx
// src/components/seo/json-ld.tsx
import { serializeJsonLd } from '@/lib/seo/jsonld'

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />
}
```

- [ ] **Step 4: Implement share links**

```tsx
// src/components/share/share-buttons.tsx (URL builder; the component renders these as links)
export function shareUrls({ url, text }: { url: string; text: string }) {
  const u = encodeURIComponent(url)
  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    x: `https://x.com/intent/post?${new URLSearchParams({ text, url })}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
  }
}
```

`<ShareButtons>` is a client component. It shows one "Share" button that calls `navigator.share` when available, otherwise a row of links (WhatsApp, X, LinkedIn, Facebook) with `target="_blank" rel="noopener noreferrer"` and a "Copy Link" button that uses `navigator.clipboard.writeText` and announces "Link copied" in an `aria-live` region.

- [ ] **Step 5: Root metadata, robots, sitemap, manifest and llms.txt**

In `src/app/layout.tsx` add:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'PractiCode Learn: learn the skills employers are hiring for', template: '%s · PractiCode Learn' },
  description: site.description,
  applicationName: site.name,
  publisher: 'Practicode Consult Limited',
  formatDetection: { telephone: false, email: false, address: false },
  verification: { google: publicEnv.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION, other: publicEnv.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { 'msvalidate.01': publicEnv.NEXT_PUBLIC_BING_SITE_VERIFICATION } : undefined },
}
export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#07060D' }, { media: '(prefers-color-scheme: light)', color: '#F5F4FA' }],
  colorScheme: 'dark light',
}
```

and render `<JsonLd data={[organizationLd(), websiteLd()]} />` in `<body>`.

```ts
// src/app/robots.ts
import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  // Preview deployments must never be indexed.
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') return { rules: [{ userAgent: '*', disallow: '/' }] }
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/home', '/settings', '/admin', '/auth/', '/api/', '/verify', '/runner.html'] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  }
}
```

`sitemap.ts` returns `publicPages` plus every published free lesson (`listPublishedLessons()` from Task 15; until then only `publicPages`), with `lastModified`. `manifest.ts` returns name, short_name "PractiCode", description, `start_url: '/'`, `display: 'standalone'`, `background_color` and `theme_color` `#07060D`, `lang: 'en-GB'`, `categories: ['education']`, icons 192, 512 and 512 maskable from `public/icons/`. `llms.txt/route.ts` returns a short plain-text description of the site with links to the public pages, `Content-Type: text/plain; charset=utf-8`, statically generated.

- [ ] **Step 6: Generate icons and fetch share-image fonts**

`scripts/generate-icons.mjs` renders `brand/logo/icon-yellow.svg` on `#07060D` with Playwright to PNGs (16, 32, 48, 180, 192, 512, 512-maskable with 20% safe padding) into `public/icons/`, writes `src/app/apple-icon.png` (180), copies the SVG to `src/app/icon.svg`, and packs 16/32/48 PNGs into `src/app/favicon.ico` (ICO header + PNG entries). `scripts/fetch-og-fonts.mjs` requests the Google Fonts CSS with a legacy user agent so it returns static TTF URLs, downloads Bricolage Grotesque 800 and Poppins 400/600 into `src/assets/fonts/` (OFL, keep `OFL.txt` alongside). Run both and commit the outputs. These icons are interim until the official logo pack arrives (F9); re-running the script with the new SVG replaces them.

- [ ] **Step 7: Default share image**

```tsx
// src/app/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { brandCard, ogFonts } from '@/lib/og/brand-card'

export const alt = 'PractiCode Learn: learn the skills employers are hiring for'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(brandCard({ eyebrow: 'PractiCode Learn', title: 'Learn the skills employers are hiring for', footer: 'learn.practicode.tech' }), { ...size, fonts: await ogFonts() })
}
```

`brandCard` draws the Prism look with flexbox only: `#07060D` ground, a blue-to-violet glow, the yellow icon (read from `public/brand/icon-yellow.svg` as a data URI), Bricolage Grotesque title, Poppins footer. `twitter-image.tsx` re-exports the same default, `alt`, `size` and `contentType`. Keep the PNG under 300 KB so WhatsApp shows the preview.

- [ ] **Step 8: Write the e2e SEO test**

```ts
// tests/e2e/seo.spec.ts
import { expect, test } from '@playwright/test'
import { publicPages } from '../../src/lib/seo/pages'

for (const p of publicPages) {
  test(`${p.path} has complete search and share metadata`, async ({ page }) => {
    await page.goto(p.path)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en-GB')
    await expect(page.locator('h1')).toHaveCount(1)
    const meta = (sel: string) => page.locator(sel).first().getAttribute('content')
    expect(await meta('meta[name="description"]')).toBeTruthy()
    expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toMatch(new RegExp(`${p.path === '/' ? '/?$' : p.path}$`))
    for (const prop of ['og:title', 'og:description', 'og:image', 'og:url']) expect(await meta(`meta[property="${prop}"]`), prop).toBeTruthy()
    expect(await meta('meta[name="twitter:card"]')).toBe('summary_large_image')
    for (const block of await page.locator('script[type="application/ld+json"]').allTextContents()) expect(() => JSON.parse(block)).not.toThrow()
  })
}

test('robots.txt points at the sitemap and hides private pages', async ({ request }) => {
  const body = await (await request.get('/robots.txt')).text()
  expect(body).toContain('Sitemap:')
  expect(body).toContain('Disallow: /home')
})

test('sitemap lists every public page', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text()
  for (const p of publicPages) expect(xml).toContain(`${p.path === '/' ? '' : p.path}</loc>`)
})
```

- [ ] **Step 9: Run** — `npx vitest run && npx playwright test tests/e2e/seo.spec.ts --project=desktop` — Expected: unit PASS; e2e PASS for `/` (other pages pass once Tasks 6–8 land; mark them `test.fixme` via a `PENDING` list that Task 8 empties).

- [ ] **Step 10: Commit** — `git add -A && git commit -m "feat(seo): metadata, structured data, sitemap, robots, manifest, icons and share images"`

### Task 5: Security headers, Content Security Policy and the security model

**Files:**
- Create: `src/lib/security/csp.ts`, `src/lib/security/headers.ts`, `src/proxy.ts`, `docs/architecture/adr/0008-security-model.md`, `docs/security/threat-model.md`
- Modify: `next.config.ts`, `src/app/layout.tsx`, `docs/architecture/adr/README.md`, `SECURITY.md`
- Test: `src/lib/security/csp.test.ts`, `tests/e2e/security-headers.spec.ts`

**Interfaces:**
- Consumes: `THEME_BOOT_SCRIPT` (Task 2), `publicEnv` (Task 1).
- Produces:
  - `buildCsp({ mode: 'static' | 'nonce'; nonce?: string; dev: boolean; supabaseUrl?: string; themeScriptHash: string }): string`
  - `themeScriptHash(): string` (`'sha256-…'` of `THEME_BOOT_SCRIPT`)
  - `securityHeaders: { key: string; value: string }[]`
  - `DYNAMIC_PATHS = ['/home', '/settings', '/admin', '/login', '/signup', '/verify', '/auth']` (used by the proxy matcher and the static-header exclusion)
  - Request header `x-nonce` on dynamic routes.

- [ ] **Step 1: Write the failing CSP tests**

```ts
// src/lib/security/csp.test.ts
import { describe, expect, it } from 'vitest'
import { buildCsp } from './csp'

const base = { dev: false, supabaseUrl: 'https://abc.supabase.co', themeScriptHash: "'sha256-AAA'" }

describe('buildCsp', () => {
  it('dynamic pages use a nonce with strict-dynamic and no unsafe-inline scripts', () => {
    const csp = buildCsp({ ...base, mode: 'nonce', nonce: 'n0nce' })
    expect(csp).toContain("script-src 'self' 'nonce-n0nce' 'strict-dynamic'")
    expect(csp).not.toMatch(/script-src[^;]*'unsafe-inline'/)
  })
  it('never allows eval in production', () => {
    expect(buildCsp({ ...base, mode: 'static' })).not.toContain('unsafe-eval')
    expect(buildCsp({ ...base, mode: 'nonce', nonce: 'x' })).not.toContain('unsafe-eval')
  })
  it('locks down framing, plugins, base URI and forms', () => {
    const csp = buildCsp({ ...base, mode: 'static' })
    for (const d of ["frame-ancestors 'none'", "object-src 'none'", "base-uri 'self'", "form-action 'self' https://abc.supabase.co https://accounts.google.com"]) expect(csp).toContain(d)
  })
  it('only connects to our own origin, Supabase and Vercel analytics', () => {
    expect(buildCsp({ ...base, mode: 'static' })).toContain("connect-src 'self' https://abc.supabase.co https://vitals.vercel-insights.com")
  })
  it('allows the runner frame from our own origin only', () => {
    expect(buildCsp({ ...base, mode: 'static' })).toContain("frame-src 'self'")
  })
})
```

- [ ] **Step 2: Run** — `npx vitest run src/lib/security` — Expected: FAIL.

- [ ] **Step 3: Implement the CSP builder and headers**

```ts
// src/lib/security/csp.ts
import { createHash } from 'node:crypto'
import { THEME_BOOT_SCRIPT } from '@/lib/theme'

export const themeScriptHash = () => `'sha256-${createHash('sha256').update(THEME_BOOT_SCRIPT).digest('base64')}'`

// Set by Step 6 after measuring: '' if static pages run without inline flight scripts, otherwise "'unsafe-inline'".
export const STATIC_INLINE = "'unsafe-inline'"

type CspInput = { mode: 'static' | 'nonce'; nonce?: string; dev: boolean; supabaseUrl?: string; themeScriptHash: string }

export function buildCsp({ mode, nonce, dev, supabaseUrl, themeScriptHash }: CspInput): string {
  const eval_ = dev ? " 'unsafe-eval'" : ''
  // Static pages can't carry a per-request nonce. They rely on Subresource Integrity for bundles,
  // the theme script's hash, and 'unsafe-inline' only as the fallback that Task 5 Step 6 decides.
  const script = mode === 'nonce' ? `'self' 'nonce-${nonce}' 'strict-dynamic'${eval_}` : `'self' ${themeScriptHash} ${STATIC_INLINE}${eval_}`
  const style = mode === 'nonce' && !dev ? `'self' 'nonce-${nonce}'` : `'self' 'unsafe-inline'`
  return [
    "default-src 'self'",
    `script-src ${script}`.replace(/\s+/g, ' ').trim(),
    `style-src ${style}`,
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src 'self'${supabaseUrl ? ` ${supabaseUrl}` : ''} https://vitals.vercel-insights.com`,
    "frame-src 'self'",
    "worker-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    // sign-in forms redirect to Supabase, then Google; Chrome applies form-action to those redirects
    `form-action 'self'${supabaseUrl ? ` ${supabaseUrl}` : ''} https://accounts.google.com`,
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ].join('; ')
}
```

```ts
// src/lib/security/headers.ts
export const DYNAMIC_PATHS = ['/home', '/settings', '/admin', '/login', '/signup', '/verify', '/auth'] as const

export const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  // No X-Frame-Options: CSP frame-ancestors covers every browser Next.js 16 supports, and two framing headers would conflict on the runner.
]

// The runner is always sandboxed by its own CSP, so even opened directly it has an opaque origin.
export const runnerHeaders = [
  { key: 'Content-Security-Policy', value: "sandbox allow-scripts; default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; frame-ancestors 'self'" },
  { key: 'X-Robots-Tag', value: 'noindex' },
]
```

- [ ] **Step 4: Apply headers in `next.config.ts`**

```ts
async headers() {
  const staticCsp = buildCsp({ mode: 'static', dev: process.env.NODE_ENV === 'development', supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL, themeScriptHash: themeScriptHash() })
  const dynamic = DYNAMIC_PATHS.map((p) => p.slice(1)).join('|')
  return [
    { source: '/:path*', headers: securityHeaders },
    { source: `/((?!${dynamic}|runner\\.html).*)`, headers: [{ key: 'Content-Security-Policy', value: staticCsp }] },
    { source: '/runner.html', headers: runnerHeaders },
  ]
},
experimental: { sri: { algorithm: 'sha256' } },
```

- [ ] **Step 5: Write the proxy for dynamic routes** (session refresh is added in Task 10)

```ts
// src/proxy.ts
import { NextResponse, type NextRequest } from 'next/server'
import { buildCsp, themeScriptHash } from '@/lib/security/csp'

export async function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const csp = buildCsp({ mode: 'nonce', nonce, dev: process.env.NODE_ENV === 'development', supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL, themeScriptHash: themeScriptHash() })
  const headers = new Headers(request.headers)
  headers.set('x-nonce', nonce)
  headers.set('Content-Security-Policy', csp)
  const response = NextResponse.next({ request: { headers } })
  response.headers.set('Content-Security-Policy', csp)
  return response
}

export const config = {
  matcher: [{ source: '/(home|settings|admin|login|signup|verify|auth)/:path*', missing: [{ type: 'header', key: 'next-router-prefetch' }] }, '/(home|settings|admin|login|signup|verify)'],
}
```

The root layout reads `(await headers()).get('x-nonce')` **only inside the (app)/(auth) layouts**, and passes it to `<ThemeScript nonce>` there. The marketing layout stays static.

- [ ] **Step 6: Decide the static inline-script policy by measurement**

Build and start the app, open `/` in Playwright with a temporary CSP that sets `STATIC_INLINE = ''`, and collect `securitypolicyviolation` events. If none fire (SRI covers every script), keep `STATIC_INLINE = ''`. If Next.js's inline flight-data scripts are blocked, set `STATIC_INLINE = "'unsafe-inline'"` and record the reason in ADR 0008. Either way, commit the measured result and the test below.

- [ ] **Step 7: Write the headers e2e test**

```ts
// tests/e2e/security-headers.spec.ts
import { expect, test } from '@playwright/test'

test('public pages send the security headers', async ({ request }) => {
  const h = (await request.get('/')).headers()
  expect(h['strict-transport-security']).toContain('max-age=63072000')
  expect(h['x-content-type-options']).toBe('nosniff')
  expect(h['content-security-policy']).toContain("frame-ancestors 'none'")
  expect(h['x-powered-by']).toBeUndefined()
})

test('signed-in pages use a fresh nonce per request', async ({ request }) => {
  const a = (await request.get('/login')).headers()['content-security-policy']
  const b = (await request.get('/login')).headers()['content-security-policy']
  expect(a).toMatch(/'nonce-[A-Za-z0-9+/=]+'/)
  expect(a).not.toBe(b)
})

test('the runner is sandboxed even when opened directly', async ({ request }) => {
  expect((await request.get('/runner.html')).headers()['content-security-policy']).toMatch(/^sandbox allow-scripts/)
})

test('no CSP violations on the landing page', async ({ page }) => {
  const violations: string[] = []
  await page.exposeFunction('cspViolation', (v: string) => violations.push(v))
  await page.addInitScript(() => document.addEventListener('securitypolicyviolation', (e) => (window as unknown as { cspViolation: (v: string) => void }).cspViolation(`${e.violatedDirective} ${e.blockedURI}`)))
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  expect(violations).toEqual([])
})
```

- [ ] **Step 8: Write ADR 0008 and the threat model**

ADR 0008 (Proposed) records: the two CSP modes and why (static speed and search vs per-request nonces), the measured inline-script decision, the runner sandbox, RLS with writes through validated functions, Zod at every trust boundary, `server-only` for secrets, safe redirects, OWASP ASVS Level 2 as the target. `docs/security/threat-model.md` lists assets (learner accounts and progress, lesson content, impact data, keys), actors, trust boundaries, and for each threat (account takeover, XSS, malicious learner code, inflated progress, open redirect, scraping Pro content, leaked keys, supply chain) the mitigation and the task that implements it. Update `SECURITY.md` with the reporting address and a link to the threat model.

- [ ] **Step 9: Run** — `npx vitest run && npx playwright test tests/e2e/security-headers.spec.ts --project=desktop` — Expected: PASS.

- [ ] **Step 10: Commit** — `git add -A && git commit -m "feat(security): security headers, two-mode CSP, sandboxed runner headers, ADR 0008 and threat model"`

### Task 6: Landing page

**Files:**
- Create: `src/app/(marketing)/page.tsx`, `src/components/marketing/{hero,track-cards,how-it-works,lesson-demo,features,stats,comparison,founder-quote,faq,cta-band}.tsx`, `src/content/landing.ts`, `src/content/faq.ts`
- Test: `tests/e2e/landing.spec.ts`

**Interfaces:**
- Consumes: UI primitives (Task 2), chrome (Task 3), `pageMetadata`, `publicPages`, `JsonLd`, `faqLd` (Task 4).
- Produces: `landing` content object (all copy in one typed file), `faq: { q: string; a: string }[]` reused by `faqLd`.

- [ ] **Step 1: Write the failing landing test**

```ts
// tests/e2e/landing.spec.ts
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('landing leads with the promise and one primary action', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('skills employers are hiring for')
  await expect(page.getByRole('link', { name: 'Start Free' }).first()).toHaveAttribute('href', '/learn/front-end-web-development/what-happens-when-you-open-a-website')
})

test('only Front-End is live; other tracks say Coming soon', async ({ page }) => {
  await page.goto('/')
  const tracks = page.getByRole('region', { name: 'Available tracks' })
  await expect(tracks.getByText('Coming soon')).toHaveCount(3)
})

test('no promises the beta cannot keep', async ({ page }) => {
  await page.goto('/')
  const text = (await page.locator('main').innerText()).toLowerCase()
  for (const banned of ['job placement', 'career support', 'cv review', 'guaranteed job']) expect(text).not.toContain(banned)
})

test('landing has no accessibility violations in either theme', async ({ page }) => {
  for (const scheme of ['dark', 'light'] as const) {
    await page.emulateMedia({ colorScheme: scheme })
    await page.goto('/')
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
    expect(results.violations, scheme).toEqual([])
  }
})
```

- [ ] **Step 2: Run** — `npx playwright test tests/e2e/landing.spec.ts` — Expected: FAIL.

- [ ] **Step 3: Build the page by porting the canvas sections**

Source: `design/canvas/PrismLanding.dc.html` (desktop, both parts) and the phone parts for responsive behaviour; light values come from the tokens, not from `PrismLight*`. Port each section into its component with copy moved to `src/content/landing.ts`:

| Canvas section | Component | Treatment in the beta |
|---|---|---|
| Hero | `hero.tsx` | Keep. Primary "Start Free" links to the first Module 1 lesson; secondary "See the Syllabus" links to the track page |
| Tracks | `track-cards.tsx` | Front-End card live. Data, UI/UX and AI cards show a "Coming soon" pill instead of a button. Heading "Available tracks" (`<section aria-labelledby>`) |
| Guess, Try, Make demo | `how-it-works.tsx`, `lesson-demo.tsx` | Keep; anchor `id="how-it-works"`. The demo is a static illustration of a Front-End step (no live code), so it ships no client JS |
| Feature cards | `features.tsx` | Keep labs, phone-friendly, offline. AI tutor and certificates get a "Coming soon" pill |
| Small numbers, big difference | `stats.tsx` | Keep only figures that are true now: lesson length, 80% to pass a module, pack size budget phrased as a design rule. No learner counts |
| Comparison table | `comparison.tsx` | Keep rows that describe PractiCode Learn as it is in the beta; remove rows about Pro pricing |
| Research card | inside `stats.tsx` | Keep, quoting Koedinger et al. 2015 exactly as stated in `docs/curriculum/pedagogy.md` |
| Founder quote | `founder-quote.tsx` | Keep |
| FAQ | `faq.tsx` | Keep, with answers updated for the beta (free, Front-End first, devices). `<details>` elements, no JS. Feeds `faqLd` |
| Closing call to action | `cta-band.tsx` | Keep |
| Pricing teaser, mentors, community, site assistant | — | Not shipped in slice 1 |

Rules: Server Components only on this page (no `'use client'` except the header's menu and theme toggle); images through `next/image`; every section `aria-labelledby` its heading; headings in order (one `h1`, then `h2` per section). Metadata: `export const metadata = metaFor('/')`; render `<JsonLd data={faqLd(faq)} />`.

- [ ] **Step 4: Run** — `npx playwright test tests/e2e/landing.spec.ts tests/e2e/seo.spec.ts` — Expected: PASS.

- [ ] **Step 5: Visual check** — screenshot `/` at 390 and 1440 in dark and light (`npx playwright test --project=phone --project=desktop tests/e2e/landing.spec.ts --update-snapshots` is not used; take one-off screenshots with a script) and compare with the canvas renders. Fix any spacing or token mismatch.

- [ ] **Step 6: Commit** — `git add -A && git commit -m "feat(landing): landing page built from the Prism canvas, with beta-honest copy"`

### Task 7: Front-End track page

**Files:**
- Create: `src/content/tracks/front-end-web-development.ts`, `src/content/tracks/index.ts`, `src/app/(marketing)/tracks/[track]/page.tsx`, `src/app/(marketing)/tracks/[track]/opengraph-image.tsx`, `src/components/marketing/{syllabus,track-hero,outcomes,projects-grid}.tsx`
- Test: `src/content/tracks/front-end-web-development.test.ts`, `tests/e2e/track.spec.ts`

**Interfaces:**
- Consumes: Tasks 2–4.
- Produces: `type TrackContent = { slug: string; title: string; status: 'live' | 'coming_soon'; summary: string; hours: number; modules: { number: number; title: string; summary: string; project: string; lessons: { title: string; minutes?: number }[]; free: boolean }[]; outcomes: string[]; alignment: string[] }`, `tracks: TrackContent[]`, `getTrack(slug): TrackContent | undefined`.

- [ ] **Step 1: Write the failing sync test** (keeps the page data identical to the public syllabus)

```ts
// src/content/tracks/front-end-web-development.test.ts
import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'
import { frontEnd } from './front-end-web-development'

it('matches the module and lesson list in the published syllabus', () => {
  const md = readFileSync('docs/curriculum/tracks/front-end-web-development.md', 'utf8')
  const section = md.split('## Lessons')[1]!.split('\n## ')[0]!
  const rows = [...section.matchAll(/^\d+\. \*\*(.+?)\*\* \((\d+)\): (.+)$/gm)]
  expect(rows).toHaveLength(15)
  rows.forEach((row, i) => {
    const mod = frontEnd.modules[i]!
    expect(mod.title).toBe(row[1])
    expect(mod.lessons.map((l) => l.title)).toEqual(row[3]!.split(' · '))
    expect(mod.lessons).toHaveLength(Number(row[2]))
  })
})
```

- [ ] **Step 2: Run** — Expected: FAIL.

- [ ] **Step 3: Write the track data** from the syllabus (15 modules, lesson titles, projects, outcomes, MDN/WCAG/SFIA alignment, ~140 hours). Module 1 `free: true`.

- [ ] **Step 4: Build the page** by porting `design/canvas/PrismTrack.dc.html`: hero (title, summary, facts: 15 modules, 119 lessons, about 140 hours, 15 projects and a capstone), outcomes, the syllabus as an accessible accordion (`<details>` per module; Module 1 open, listing lesson links for published lessons and plain text for unpublished ones), alignment panel, device notes, projects grid. `generateStaticParams` returns live tracks only; unknown or coming-soon slugs call `notFound()` (coming-soon tracks get pages later). Metadata: `metaFor('/tracks/front-end-web-development')`; JSON-LD `courseLd` + `breadcrumbLd`. The track share image uses `brandCard({ eyebrow: 'Front-End Web Development', title: 'Build websites that work on every screen', footer: '15 modules · Module 1 free' })`.

- [ ] **Step 5: Write and run the e2e test**

```ts
// tests/e2e/track.spec.ts
import { expect, test } from '@playwright/test'

test('track page lists all 15 modules and opens Module 1', async ({ page }) => {
  await page.goto('/tracks/front-end-web-development')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Front-End')
  await expect(page.locator('details')).toHaveCount(15)
  await expect(page.locator('details').first()).toHaveAttribute('open', '')
})

test('coming-soon tracks have no page yet', async ({ request }) => {
  expect((await request.get('/tracks/data-analysis')).status()).toBe(404)
})
```

Run: `npx vitest run src/content && npx playwright test tests/e2e/track.spec.ts tests/e2e/seo.spec.ts` — Expected: PASS.

- [ ] **Step 6: Commit** — `git add -A && git commit -m "feat(track): Front-End track page from the published syllabus, with course structured data"`

### Task 8: About, legal and error pages; first public deploy

**Files:**
- Create: `src/app/(marketing)/about/page.tsx`, `src/app/(marketing)/legal/[doc]/page.tsx`, `src/content/legal/{privacy,terms,accessibility}.ts`, `src/app/not-found.tsx`, `src/app/error.tsx`, `src/app/global-error.tsx`
- Modify: test `PENDING` lists in Tasks 2–4 (empty them), `README.md`
- Test: extend `tests/e2e/seo.spec.ts` (all pages now real), `tests/e2e/errors.spec.ts`

**Interfaces:**
- Consumes: Tasks 2–4.
- Produces: `legalDocs: Record<'privacy' | 'terms' | 'accessibility', { title: string; updated: string; sections: { heading: string; body: string[] }[] }>`.

- [ ] **Step 1: Write the failing error-page test**

```ts
// tests/e2e/errors.spec.ts
import { expect, test } from '@playwright/test'

test('unknown pages return 404 with a way back', async ({ page }) => {
  const res = await page.goto('/no-such-page')
  expect(res?.status()).toBe(404)
  await expect(page.getByRole('link', { name: 'Go to the Home Page' })).toHaveAttribute('href', '/')
  expect(await page.locator('meta[name="robots"]').getAttribute('content')).toContain('noindex')
})
```

- [ ] **Step 2: Build the pages** by porting `design/canvas/PrismAbout.dc.html` (with the founder's leadership section exactly as on the canvas; the founder photo is the canvas upload, so download it once from the canvas, save as `public/images/founder.jpg`, and render with `next/image`), `PrismLegal.dc.html` (privacy, terms, accessibility; the privacy notice must name: account data, progress data, country derived from the connection at sign-up, cookieless analytics, Supabase in London, Vercel, Resend, retention, and the rights to export and delete, which Task 17 implements) and `PrismError.dc.html`. Legal text is a working draft; add a visible "Last updated" date and note in `docs/operations/launch-checklist.md` (Task 20) that a lawyer reviews it before payments start.

- [ ] **Step 3: Empty the `PENDING` lists** in `tests/e2e/navigation.spec.ts`, `tests/e2e/seo.spec.ts` and `tests/e2e/theme.spec.ts`, then run the whole suite: `npx vitest run && npx playwright test` — Expected: PASS.

- [ ] **Step 4: Lighthouse locally** — `npx lhci autorun --config=lighthouserc.json` (config from Task 20 Step 3, created here early) — Expected: SEO 100, Accessibility ≥ 0.95 (target 100), Best Practices ≥ 0.95, Performance ≥ 0.9 on mobile for `/`, `/tracks/front-end-web-development`, `/about`.

- [ ] **Step 5: First public push and deploy** (needs F1, F2, F7)

```bash
git remote add origin https://github.com/<founder-username>/practicode-learn.git
git push -u origin main
```

Vercel builds from GitHub. Check `https://learn.practicode.tech/robots.txt` lists the sitemap, and a preview deployment's `robots.txt` says `Disallow: /`.

- [ ] **Step 6: Commit** — `git add -A && git commit -m "feat(site): about, legal and error pages; Milestone 1 complete"`

**Milestone 1 review checkpoint:** run the full test suite and Lighthouse, then a fresh whole-branch review before Milestone 2.

---

# Milestone 2: the learning loop

Ends with Module 1 playable by guests and learners, progress and impact measured, offline lessons, and content published from the private repository.

### Task 9: Database schema, row-level security and storage

**Files:**
- Create: `supabase/config.toml`, `supabase/migrations/20261004120000_core_schema.sql`, `supabase/migrations/20261004120100_progress_functions.sql`, `supabase/migrations/20261004120200_impact_functions.sql`, `supabase/migrations/20261004120300_storage.sql`, `src/types/database.ts`, `tests/db/helpers.ts`
- Test: `tests/db/rls.test.ts`

**Interfaces:**
- Produces tables `tracks`, `lessons`, `profiles`, `lesson_progress`, `learning_events`, `impact_snapshots`; functions `is_admin()`, `record_progress(...)`, `impact_summary()`, `impact_countries()`; storage buckets `lessons-free` (public read) and `lessons-pro` (private); generated `Database` type.

- [ ] **Step 1: Link the dev project** (needs F3, F4)

```bash
npx supabase init   # creates supabase/config.toml; keep it
npx supabase link --project-ref <dev-project-ref>
```

- [ ] **Step 2: Write the core schema migration**

```sql
-- supabase/migrations/20261004120000_core_schema.sql
-- Catalogue: written only by the content pipeline with the secret key. Everyone can read it.
create table public.tracks (
  slug text primary key check (slug ~ '^[a-z0-9-]+$'),
  title text not null,
  status text not null check (status in ('live', 'coming_soon')),
  position int not null,
  updated_at timestamptz not null default now()
);

create table public.lessons (
  id text primary key check (id ~ '^[a-z]{2}-\d{2}-\d{2}$'),
  track_slug text not null references public.tracks (slug),
  module int not null check (module between 1 and 99),
  lesson int not null check (lesson between 1 and 99),
  slug text not null check (slug ~ '^[a-z0-9-]+$'),
  title text not null,
  description text not null,
  minutes int not null check (minutes between 1 and 60),
  free boolean not null default false,
  version int not null check (version >= 1),
  steps int not null check (steps between 1 and 60),
  bytes int not null check (bytes > 0),
  hash text not null,
  pack_path text not null,
  published_at timestamptz not null default now(),
  unique (track_slug, slug),
  unique (track_slug, module, lesson)
);

-- One row per learner. Country comes from the connection at sign-up (server only), never from the client.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) <= 80),
  country_code char(2) check (country_code ~ '^[A-Z]{2}$'),
  role text not null default 'learner' check (role in ('learner', 'admin')),
  created_at timestamptz not null default now()
);

create table public.lesson_progress (
  learner_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id text not null references public.lessons (id),
  lesson_version int not null,
  status text not null check (status in ('started', 'completed')),
  steps_done int not null default 0 check (steps_done >= 0),
  active_seconds int not null default 0 check (active_seconds between 0 and 86400),
  attempts jsonb not null default '{}'::jsonb check (pg_column_size(attempts) < 2048),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (learner_id, lesson_id)
);

-- Append-only learning record (xAPI-style). The id is generated on the device, so retries are idempotent.
create table public.learning_events (
  id uuid primary key,
  learner_id uuid not null references public.profiles (id) on delete cascade,
  verb text not null check (verb in ('lesson_started', 'lesson_completed')),
  lesson_id text not null references public.lessons (id),
  lesson_version int not null,
  offline boolean not null default false,
  occurred_at timestamptz not null,
  received_at timestamptz not null default now()
);
create index learning_events_learner_time on public.learning_events (learner_id, occurred_at);
create index learning_events_time on public.learning_events (occurred_at);

-- Monthly impact figures without personal data, so evidence survives account deletions.
create table public.impact_snapshots (
  month date primary key,
  metrics jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.tracks enable row level security;
alter table public.lessons enable row level security;
alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.learning_events enable row level security;
alter table public.impact_snapshots enable row level security;

create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin')
$$;

create policy "catalogue is public" on public.tracks for select to anon, authenticated using (true);
create policy "lessons are public" on public.lessons for select to anon, authenticated using (true);
create policy "learners read their own profile" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "learners rename themselves" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
revoke update on public.profiles from authenticated;
grant update (display_name) on public.profiles to authenticated;
create policy "learners read their own progress" on public.lesson_progress for select to authenticated using ((select auth.uid()) = learner_id);
create policy "learners read their own events" on public.learning_events for select to authenticated using ((select auth.uid()) = learner_id);
create policy "admins read snapshots" on public.impact_snapshots for select to authenticated using (public.is_admin());
-- No insert, update or delete policies on progress or events: writes go through record_progress().

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, left(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'), 80));
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
```

- [ ] **Step 3: Write the progress function migration**

```sql
-- supabase/migrations/20261004120100_progress_functions.sql
-- The only way to write progress. Validates every field so learners can't inflate their own record,
-- which keeps the impact figures trustworthy.
create function public.record_progress(
  p_event_id uuid,
  p_lesson_id text,
  p_lesson_version int,
  p_verb text,
  p_occurred_at timestamptz,
  p_steps_done int,
  p_active_seconds int,
  p_attempts jsonb,
  p_offline boolean default false
) returns void
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_minutes int;
  v_steps int;
  v_version int;
begin
  if v_uid is null then raise exception 'sign in first' using errcode = '28000'; end if;
  select minutes, steps, version into v_minutes, v_steps, v_version from public.lessons where id = p_lesson_id;
  if not found then raise exception 'unknown lesson' using errcode = '22023'; end if;
  if p_verb not in ('lesson_started', 'lesson_completed') then raise exception 'unknown verb' using errcode = '22023'; end if;
  if p_lesson_version < 1 or p_lesson_version > v_version then raise exception 'unknown lesson version' using errcode = '22023'; end if;
  if p_occurred_at > now() + interval '5 minutes' or p_occurred_at < now() - interval '30 days' then
    raise exception 'event time out of range' using errcode = '22023';
  end if;
  if jsonb_typeof(coalesce(p_attempts, '{}'::jsonb)) <> 'object' or pg_column_size(p_attempts) >= 2048 then
    raise exception 'bad attempts' using errcode = '22023';
  end if;

  insert into public.learning_events (id, learner_id, verb, lesson_id, lesson_version, offline, occurred_at)
  values (p_event_id, v_uid, p_verb, p_lesson_id, p_lesson_version, coalesce(p_offline, false), p_occurred_at)
  on conflict (id) do nothing;
  if not found then return; end if; -- a retried event changes nothing

  insert into public.lesson_progress as lp (learner_id, lesson_id, lesson_version, status, steps_done, active_seconds, attempts, completed_at)
  values (
    v_uid, p_lesson_id, p_lesson_version,
    case when p_verb = 'lesson_completed' then 'completed' else 'started' end,
    least(greatest(p_steps_done, 0), v_steps),
    least(greatest(p_active_seconds, 0), v_minutes * 60 * 3),
    coalesce(p_attempts, '{}'::jsonb),
    case when p_verb = 'lesson_completed' then p_occurred_at end
  )
  on conflict (learner_id, lesson_id) do update set
    lesson_version = greatest(lp.lesson_version, excluded.lesson_version),
    status = case when lp.status = 'completed' then 'completed' else excluded.status end,
    steps_done = greatest(lp.steps_done, excluded.steps_done),
    -- each event reports seconds since the last one; a lesson can't add more than ten times its length
    active_seconds = least(lp.active_seconds + excluded.active_seconds, v_minutes * 60 * 10),
    attempts = excluded.attempts,
    completed_at = coalesce(lp.completed_at, excluded.completed_at),
    updated_at = now();
end $$;

revoke execute on function public.record_progress from public, anon;
grant execute on function public.record_progress to authenticated;
```

- [ ] **Step 4: Write the impact functions migration**

```sql
-- supabase/migrations/20261004120200_impact_functions.sql
-- Definitions match docs/product/impact-metrics.md. Admins and the snapshot job only.
create function public.impact_summary() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  if not (public.is_admin() or (select auth.role()) = 'service_role') then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  return jsonb_build_object(
    'measured_at', now(),
    'registered_learners', (select count(*) from public.profiles),
    'countries_reached', (select count(distinct country_code) from public.profiles where country_code is not null),
    'learners_started_a_lesson', (select count(distinct learner_id) from public.lesson_progress),
    'lessons_completed', (select count(*) from public.lesson_progress where status = 'completed'),
    'active_learners_28d', (select count(distinct learner_id) from public.learning_events where verb = 'lesson_completed' and occurred_at >= now() - interval '28 days'),
    'hours_of_learning', (select round(coalesce(sum(active_seconds), 0) / 3600.0, 1) from public.lesson_progress),
    'activation_rate_24h', (
      select round(100.0 * count(*) filter (where exists (
        select 1 from public.learning_events e where e.learner_id = p.id and e.verb = 'lesson_completed' and e.occurred_at < p.created_at + interval '24 hours'
      )) / nullif(count(*), 0), 1)
      from public.profiles p where p.created_at < now() - interval '24 hours'),
    'week4_retention', (
      select round(100.0 * count(*) filter (where exists (
        select 1 from public.learning_events e where e.learner_id = p.id and e.occurred_at >= p.created_at + interval '21 days' and e.occurred_at < p.created_at + interval '28 days'
      )) / nullif(count(*), 0), 1)
      from public.profiles p where p.created_at < now() - interval '28 days'),
    'module1_completion', (
      with m1 as (select id from public.lessons where track_slug = 'front-end-web-development' and module = 1),
      starters as (select distinct learner_id from public.lesson_progress where lesson_id in (select id from m1)),
      finishers as (
        select learner_id from public.lesson_progress
        where lesson_id in (select id from m1) and status = 'completed'
        group by learner_id having count(*) = (select count(*) from m1)
      )
      select round(100.0 * (select count(*) from finishers) / nullif((select count(*) from starters), 0), 1)),
    'offline_completions', (select count(*) from public.learning_events where verb = 'lesson_completed' and offline)
  );
end $$;

create function public.impact_countries() returns table (country_code char(2), learners bigint, active_learners_28d bigint)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not (public.is_admin() or (select auth.role()) = 'service_role') then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  return query
    select p.country_code, count(*), count(*) filter (where exists (
      select 1 from public.learning_events e where e.learner_id = p.id and e.verb = 'lesson_completed' and e.occurred_at >= now() - interval '28 days'))
    from public.profiles p where p.country_code is not null group by p.country_code order by 2 desc;
end $$;

revoke execute on function public.impact_summary, public.impact_countries from public, anon;
grant execute on function public.impact_summary, public.impact_countries to authenticated;
```

- [ ] **Step 5: Write the storage migration**

```sql
-- supabase/migrations/20261004120300_storage.sql
insert into storage.buckets (id, name, public) values ('lessons-free', 'lessons-free', true), ('lessons-pro', 'lessons-pro', false)
on conflict (id) do nothing;
-- Free packs are public through the bucket's public URL. Pro packs are only reachable through signed URLs
-- created on the server after a plan check (slice 4), so no select policy is granted on lessons-pro.
```

- [ ] **Step 6: Push and generate types**

```bash
npx supabase db push
npx supabase gen types typescript --linked > src/types/database.ts
```

- [ ] **Step 7: Write the failing RLS tests** (they run when the `SUPABASE_TEST_*` variables point at the dev project)

```ts
// tests/db/rls.test.ts
import { beforeAll, describe, expect, it } from 'vitest'
import { anon, admin, signedInAs, testEnvReady, seedLesson } from './helpers'

describe.skipIf(!testEnvReady)('row-level security', () => {
  let a: Awaited<ReturnType<typeof signedInAs>>
  let b: Awaited<ReturnType<typeof signedInAs>>
  beforeAll(async () => {
    await seedLesson({ id: 'zz-01-01', minutes: 10, steps: 9, version: 1 })
    a = await signedInAs('learner-a')
    b = await signedInAs('learner-b')
  })

  it('anyone can read the catalogue', async () => {
    const { data, error } = await anon().from('lessons').select('id').eq('id', 'zz-01-01')
    expect(error).toBeNull()
    expect(data).toHaveLength(1)
  })

  it('learners cannot write progress directly', async () => {
    const { error } = await a.client.from('lesson_progress').insert({ learner_id: a.id, lesson_id: 'zz-01-01', lesson_version: 1, status: 'completed' })
    expect(error).not.toBeNull()
  })

  it('a repeated event changes nothing', async () => {
    const args = { p_event_id: crypto.randomUUID(), p_lesson_id: 'zz-01-01', p_lesson_version: 1, p_verb: 'lesson_started', p_occurred_at: new Date().toISOString(), p_steps_done: 2, p_active_seconds: 60, p_attempts: {} }
    await a.client.rpc('record_progress', args)
    await a.client.rpc('record_progress', args)
    const { data } = await a.client.from('lesson_progress').select('active_seconds').eq('lesson_id', 'zz-01-01').single()
    expect(data?.active_seconds).toBe(60)
  })

  it('caps time so nobody can claim hours they did not spend', async () => {
    await a.client.rpc('record_progress', { p_event_id: crypto.randomUUID(), p_lesson_id: 'zz-01-01', p_lesson_version: 1, p_verb: 'lesson_completed', p_occurred_at: new Date().toISOString(), p_steps_done: 99, p_active_seconds: 999_999, p_attempts: {} })
    const { data } = await a.client.from('lesson_progress').select('active_seconds, steps_done, status').eq('lesson_id', 'zz-01-01').single()
    expect(data?.active_seconds).toBeLessThanOrEqual(10 * 60 * 10)
    expect(data?.steps_done).toBe(9)
    expect(data?.status).toBe('completed')
  })

  it('learners only ever see their own progress', async () => {
    const { data } = await b.client.from('lesson_progress').select('learner_id')
    expect(data?.every((r) => r.learner_id === b.id)).toBe(true)
  })

  it('learners cannot make themselves admins', async () => {
    await a.client.from('profiles').update({ role: 'admin' } as never).eq('id', a.id)
    const { data } = await admin().from('profiles').select('role').eq('id', a.id).single()
    expect(data?.role).toBe('learner')
  })

  it('impact figures are for admins only', async () => {
    const { error } = await a.client.rpc('impact_summary')
    expect(error?.code).toBe('42501')
  })
})
```

`tests/db/helpers.ts` creates test users through the admin API (`auth.admin.createUser({ email: '<name>@test.practicode.tech', password, email_confirm: true })`), signs them in with `signInWithPassword`, upserts the test track and lesson with the admin client, and exports `testEnvReady = Boolean(process.env.SUPABASE_TEST_URL && process.env.SUPABASE_TEST_SECRET_KEY)` and `generateOtp(email)` (Task 10's e2e test uses it). Add `'tests/db/**/*.test.ts'` to Vitest's `include`.

- [ ] **Step 8: Run** — `npx vitest run tests/db` — Expected: PASS against the dev project (skipped where the variables aren't set).

- [ ] **Step 9: Commit** — `git add -A && git commit -m "feat(db): schema, row-level security, validated progress writes, impact functions and storage"`

### Task 10: Accounts and sign-in

**Files:**
- Create: `src/lib/supabase/{client,server,admin,proxy}.ts`, `src/lib/auth/{redirect,actions,require-user,country}.ts`, `src/app/(auth)/{login,signup,verify}/page.tsx`, `src/components/auth/{email-form,code-form,google-button}.tsx`, `src/app/auth/{callback,confirm,signout}/route.ts`, `supabase/templates/{magic_link,confirmation}.html`
- Modify: `src/proxy.ts`, `supabase/config.toml`, `src/app/(app)/layout.tsx` (create)
- Test: `src/lib/auth/redirect.test.ts`, `tests/e2e/auth.spec.ts`

**Interfaces:**
- Consumes: `Database` type (Task 9), `buildCsp` and proxy (Task 5).
- Produces:
  - `createClient()` browser and server variants, `createAdminClient()` (server-only)
  - `updateSession(request, headers): Promise<{ response: NextResponse; userId: string | null }>`
  - `safeRedirect(next: string | null | undefined, fallback?: Route): Route`
  - Server actions `sendSignInCode(prev, formData)`, `verifySignInCode(prev, formData)`, `signInWithGoogle(formData)`
  - `requireUser(): Promise<{ id: string; email: string | null; name: string | null; isAdmin: boolean }>`
  - `recordCountry(userId: string): Promise<void>`

- [ ] **Step 1: Write the failing redirect test (Review Focus 4)**

```ts
// src/lib/auth/redirect.test.ts
import { describe, expect, it } from 'vitest'
import { safeRedirect } from './redirect'

describe('safeRedirect', () => {
  it.each(['//evil.com', 'https://evil.com', '/\\evil.com', 'javascript:alert(1)', '\\\\evil.com', '/%2F%2Fevil.com', ' //evil.com'])('refuses %s', (bad) => {
    expect(safeRedirect(bad)).toBe('/home')
  })
  it('keeps a normal path with its query', () => {
    expect(safeRedirect('/learn/front-end-web-development/urls-domains-and-dns?step=3')).toBe('/learn/front-end-web-development/urls-domains-and-dns?step=3')
  })
  it('uses the fallback when nothing is given', () => {
    expect(safeRedirect(null, '/')).toBe('/')
  })
})
```

- [ ] **Step 2: Run** — Expected: FAIL.

- [ ] **Step 3: Implement `safeRedirect`**

```ts
// src/lib/auth/redirect.ts
import type { Route } from 'next'

export function safeRedirect(next: string | null | undefined, fallback: Route = '/home'): Route {
  if (!next) return fallback
  let decoded: string
  try { decoded = decodeURIComponent(next.trim()) } catch { return fallback }
  // Only same-site paths: one leading slash, no backslashes, no protocol, no control characters.
  if (!decoded.startsWith('/') || decoded.startsWith('//') || decoded.includes('\\') || /[\u0000-\u001f]/.test(decoded)) return fallback
  const url = new URL(decoded, 'https://learn.practicode.tech')
  if (url.origin !== 'https://learn.practicode.tech') return fallback
  return `${url.pathname}${url.search}` as Route
}
```

- [ ] **Step 4: Implement the Supabase clients and session refresh**

```ts
// src/lib/supabase/server.ts
import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { publicEnv } from '@/lib/env'
import type { Database } from '@/types/database'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(publicEnv.NEXT_PUBLIC_SUPABASE_URL!, publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try { list.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) }
        catch { /* Server Components can't set cookies; the proxy refreshes the session instead */ }
      },
    },
  })
}
```

```ts
// src/lib/supabase/client.ts
'use client'
import { createBrowserClient } from '@supabase/ssr'
import { publicEnv } from '@/lib/env'
import type { Database } from '@/types/database'

export const createClient = () => createBrowserClient<Database>(publicEnv.NEXT_PUBLIC_SUPABASE_URL!, publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!)
```

```ts
// src/lib/supabase/admin.ts
import 'server-only'
import { createClient as createSupabase } from '@supabase/supabase-js'
import { publicEnv } from '@/lib/env'
import { serverEnv } from '@/lib/server-env'
import type { Database } from '@/types/database'

export const createAdminClient = () =>
  createSupabase<Database>(publicEnv.NEXT_PUBLIC_SUPABASE_URL!, serverEnv().SUPABASE_SECRET_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
```

```ts
// src/lib/supabase/proxy.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

// Refreshes the session cookie and verifies it with getClaims (never trust getSession on the server).
export async function updateSession(request: NextRequest, extra: Record<string, string>) {
  const build = () => {
    const headers = new Headers(request.headers)
    for (const [k, v] of Object.entries(extra)) headers.set(k, v)
    return NextResponse.next({ request: { headers } })
  }
  let response = build()
  const supabase = createServerClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value))
        response = build()
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })
  const { data } = await supabase.auth.getClaims()
  return { response, userId: (data?.claims?.sub as string | undefined) ?? null }
}
```

Update `src/proxy.ts`: compute the nonce and CSP as in Task 5, call `updateSession(request, { 'x-nonce': nonce, 'Content-Security-Policy': csp })`, set the CSP on `response`, and for `/home`, `/settings` and `/admin` redirect to `/login?next=<path>` when `userId` is null.

- [ ] **Step 5: Implement sign-in actions, pages and routes**

`sendSignInCode` validates `{ email: z.email(), name?: z.string().trim().max(80), terms?: z.literal('on'), next?: z.string() }` (sign-up requires `terms`), calls `supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: isSignup, emailRedirectTo: absoluteUrl('/auth/confirm?next=' + encodeURIComponent(safeRedirect(next))), data: isSignup ? { full_name: name } : undefined } })`, maps Supabase errors to plain messages ("Too many attempts. Wait a minute and try again." for 429; "We couldn't send the code. Check the address and try again." otherwise), and redirects to `/verify?email=...&next=...`. `verifySignInCode` validates a 6-digit code (`z.string().regex(/^\d{6}$/)`), calls `verifyOtp({ email, token, type: 'email' })`, then `recordCountry(user.id)` and `redirect(safeRedirect(next))`. `signInWithGoogle` calls `signInWithOAuth({ provider: 'google', options: { redirectTo: absoluteUrl('/auth/callback?next=' + ...) } })` and redirects to `data.url`.

`/auth/callback` exchanges `code` with `exchangeCodeForSession`, `/auth/confirm` verifies `token_hash` + `type` with `verifyOtp`; both call `recordCountry` and redirect with `safeRedirect`. `/auth/signout` accepts POST only, signs out, redirects to `/`. `recordCountry` reads `x-vercel-ip-country` from `headers()`, validates `^[A-Z]{2}$`, and sets `profiles.country_code` with the admin client only when it is still null.

Pages port `PrismSignup`, `PrismLogin` and `PrismCode` from the canvas using `useActionState` for errors, `Field`/`Input` primitives, `autocomplete="email"` and `autocomplete="one-time-code"`, `inputmode="numeric"`, and a Google button. Metadata: `noindex`.

`supabase/config.toml` [auth]: `site_url`, `additional_redirect_urls` (production, preview wildcard, localhost), `[auth.email] otp_length = 6`, `otp_expiry = 900`, templates from `supabase/templates/` (showing the 6-digit `{{ .Token }}` prominently, plus the link), `[auth.email.smtp]` host `smtp.resend.com`, port 465, user `resend`, `pass = "env(RESEND_SMTP_KEY)"`, sender `PractiCode Learn <learn@practicode.tech>`, `[auth.rate_limit]` email_sent 30/hour. Push with `npx supabase config push` (needs F5). Google provider: `[auth.external.google] enabled = true`, client ID and secret from env (needs F6).

`src/app/(app)/layout.tsx` calls `requireUser()` (getClaims → profile) and renders `AppShell`.

- [ ] **Step 6: Write the e2e auth test**

```ts
// tests/e2e/auth.spec.ts
import { expect, test } from '@playwright/test'
import { generateOtp, testEnvReady } from '../db/helpers'

test('private pages send visitors to log in, then back', async ({ page }) => {
  await page.goto('/settings')
  await expect(page).toHaveURL(/\/login\?next=%2Fsettings/)
})

test('a bad email is caught before anything is sent', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('not-an-email')
  await page.getByRole('button', { name: 'Send Me a Code' }).click()
  await expect(page.getByText('Enter a valid email address')).toBeVisible()
})

test('sign in with a code and land where you were going', async ({ page }) => {
  test.skip(!testEnvReady, 'needs the dev Supabase project')
  const email = `e2e-${Date.now()}@test.practicode.tech`
  await page.goto('/signup?next=%2Fsettings')
  await page.getByLabel('Your name').fill('Test Learner')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel(/I agree/).check()
  await page.getByRole('button', { name: 'Send Me a Code' }).click()
  await expect(page).toHaveURL(/\/verify/)
  await page.getByLabel('6-digit code').fill(await generateOtp(email))
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page).toHaveURL(/\/settings$/)
})
```

`generateOtp(email)` uses `admin.auth.admin.generateLink({ type: 'magiclink', email })` and returns `data.properties.email_otp`.

- [ ] **Step 7: Run** — `npx vitest run src/lib/auth && npx playwright test tests/e2e/auth.spec.ts` — Expected: PASS.

- [ ] **Step 8: Commit** — `git add -A && git commit -m "feat(auth): email code and Google sign-in with verified sessions and safe redirects"`

### Task 11: Progress sync and impact measurement

**Files:**
- Create: `src/lib/progress/{queue,tracker,sync,types}.ts`, `src/app/(app)/admin/impact/page.tsx`, `src/app/(app)/admin/impact/export/route.ts`, `src/app/api/cron/impact-snapshot/route.ts`, `src/components/impact/metric-card.tsx`, `vercel.json`
- Modify: `src/app/layout.tsx` (Analytics, SpeedInsights), `docs/product/impact-metrics.md`
- Test: `src/lib/progress/queue.test.ts`, `src/lib/progress/tracker.test.ts`, `src/app/api/cron/impact-snapshot/route.test.ts`

**Interfaces:**
- Consumes: `record_progress`, `impact_summary`, `impact_countries` (Task 9); `createClient` (Task 10).
- Produces:
  - `type ProgressEvent = { id: string; lessonId: string; lessonVersion: number; verb: 'lesson_started' | 'lesson_completed'; occurredAt: string; stepsDone: number; activeSeconds: number; attempts: Record<string, number>; offline: boolean }`
  - `createQueue(storage: Storage, key?: string): { enqueue(e: ProgressEvent): void; pending(): ProgressEvent[]; flush(send: (e: ProgressEvent) => Promise<'ok' | 'retry' | 'auth'>): Promise<{ sent: number; left: number; needsAuth: boolean }> }`
  - `createActiveTimer({ now, idleAfterMs }): { touch(): void; visible(v: boolean): void; take(): number }` (seconds since the last `take`, excluding idle and hidden time)
  - `syncProgress(): Promise<void>` (flushes with the browser Supabase client; maps 401/28000 to `'auth'`, network errors to `'retry'`)

- [ ] **Step 1: Write the failing queue test (Review Focus 1)**

```ts
// src/lib/progress/queue.test.ts
import { beforeEach, describe, expect, it } from 'vitest'
import { createQueue } from './queue'
import type { ProgressEvent } from './types'

const ev = (id: string): ProgressEvent => ({ id, lessonId: 'fe-01-01', lessonVersion: 1, verb: 'lesson_started', occurredAt: new Date().toISOString(), stepsDone: 1, activeSeconds: 30, attempts: {}, offline: false })

describe('progress queue', () => {
  beforeEach(() => localStorage.clear())

  it('keeps events when the learner is signed out, and sends them after sign-in', async () => {
    const q = createQueue(localStorage)
    q.enqueue(ev('a'))
    q.enqueue(ev('b'))
    expect(await q.flush(async () => 'auth')).toMatchObject({ sent: 0, left: 2, needsAuth: true })
    expect(createQueue(localStorage).pending()).toHaveLength(2) // survives a reload
    expect(await q.flush(async () => 'ok')).toMatchObject({ sent: 2, left: 0, needsAuth: false })
  })

  it('never stores the same event twice', () => {
    const q = createQueue(localStorage)
    q.enqueue(ev('a'))
    q.enqueue(ev('a'))
    expect(q.pending()).toHaveLength(1)
  })

  it('stops at the first failure so events stay in order', async () => {
    const q = createQueue(localStorage)
    ;['a', 'b', 'c'].forEach((id) => q.enqueue(ev(id)))
    const sent: string[] = []
    await q.flush(async (e) => (e.id === 'b' ? 'retry' : (sent.push(e.id), 'ok')))
    expect(sent).toEqual(['a'])
    expect(q.pending().map((e) => e.id)).toEqual(['b', 'c'])
  })

  it('drops events older than 30 days, which the server would refuse', async () => {
    const q = createQueue(localStorage)
    q.enqueue({ ...ev('old'), occurredAt: new Date(Date.now() - 31 * 864e5).toISOString() })
    expect(q.pending()).toHaveLength(0)
  })

  it('survives corrupted storage', () => {
    localStorage.setItem('pc-progress-v1', '{nope')
    expect(createQueue(localStorage).pending()).toEqual([])
  })
})
```

- [ ] **Step 2: Write the failing timer test**

```ts
// src/lib/progress/tracker.test.ts
import { expect, it } from 'vitest'
import { createActiveTimer } from './tracker'

it('counts only active, visible time', () => {
  let t = 0
  const timer = createActiveTimer({ now: () => t, idleAfterMs: 120_000 })
  timer.touch(); t += 30_000; timer.touch()        // 30 s active
  t += 600_000                                    // 10 min idle, counts only up to the idle limit
  timer.visible(false); t += 60_000; timer.visible(true) // hidden minute doesn't count
  expect(timer.take()).toBe(150)
  expect(timer.take()).toBe(0)
})
```

- [ ] **Step 3: Run** — `npx vitest run src/lib/progress` — Expected: FAIL.

- [ ] **Step 4: Implement the queue, timer and sync**

```ts
// src/lib/progress/queue.ts
import type { ProgressEvent } from './types'

const MAX = 500
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000

export function createQueue(storage: Storage, key = 'pc-progress-v1') {
  const read = (): ProgressEvent[] => {
    try {
      const parsed: unknown = JSON.parse(storage.getItem(key) ?? '[]')
      return Array.isArray(parsed) ? (parsed as ProgressEvent[]).filter((e) => Date.now() - Date.parse(e.occurredAt) < MAX_AGE_MS) : []
    } catch { return [] }
  }
  const write = (list: ProgressEvent[]) => { try { storage.setItem(key, JSON.stringify(list.slice(-MAX))) } catch { /* storage full or blocked: keep in memory only */ } }
  return {
    enqueue(e: ProgressEvent) { const list = read(); if (!list.some((x) => x.id === e.id)) write([...list, e]) },
    pending: read,
    async flush(send: (e: ProgressEvent) => Promise<'ok' | 'retry' | 'auth'>) {
      const list = read()
      let sent = 0
      for (const e of list) {
        const r = await send(e)
        if (r !== 'ok') { write(list.slice(sent)); return { sent, left: list.length - sent, needsAuth: r === 'auth' } }
        sent++
      }
      write([])
      return { sent, left: 0, needsAuth: false }
    },
  }
}
```

```ts
// src/lib/progress/tracker.ts
export function createActiveTimer({ now, idleAfterMs }: { now: () => number; idleAfterMs: number }) {
  let last = now()
  let visible = true
  let bank = 0
  const settle = () => {
    const t = now()
    if (visible) bank += Math.min(t - last, idleAfterMs)
    last = t
  }
  return {
    touch: settle,
    visible(v: boolean) { settle(); visible = v },
    take() { settle(); const s = Math.floor(bank / 1000); bank -= s * 1000; return s },
  }
}
```

`sync.ts` creates the queue on `localStorage`, flushes with `supabase.rpc('record_progress', toArgs(e))`, maps errors (`code === '28000'` or status 401 → `'auth'`; `TypeError` from fetch → `'retry'`; `22023` validation errors → drop the event and log once), and runs on `online`, on sign-in (`onAuthStateChange('SIGNED_IN')`) and every 30 seconds while a lesson is open.

- [ ] **Step 5: Analytics, admin impact page, export and monthly snapshot**

Root layout adds `<Analytics />` and `<SpeedInsights />` from `@vercel/analytics/next` and `@vercel/speed-insights/next` (cookieless; no banner needed; named in the privacy notice).

`/admin/impact` (dynamic, admin only: `requireUser()` then `notFound()` unless `isAdmin`) calls `impact_summary` and `impact_countries`, shows each figure in a `MetricCard` with its definition underneath, the measured-at time, a countries table, and the saved monthly snapshots. Every figure links to its definition in `docs/product/impact-metrics.md`. `/admin/impact/export` returns the same data as CSV (admin only, `Content-Disposition: attachment`). `vercel.json`:

```json
{ "crons": [{ "path": "/api/cron/impact-snapshot", "schedule": "0 6 1 * *" }] }
```

```ts
// src/app/api/cron/impact-snapshot/route.ts
import { timingSafeEqual } from 'node:crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { serverEnv } from '@/lib/server-env'

const authorised = (header: string | null) => {
  const expected = Buffer.from(`Bearer ${serverEnv().CRON_SECRET}`)
  const got = Buffer.from(header ?? '')
  return got.length === expected.length && timingSafeEqual(got, expected)
}

export async function GET(request: Request) {
  if (!authorised(request.headers.get('authorization'))) return new Response('Unauthorised', { status: 401 })
  const db = createAdminClient()
  const { data, error } = await db.rpc('impact_summary')
  if (error) return new Response('Failed', { status: 500 })
  const month = new Date().toISOString().slice(0, 7) + '-01'
  await db.from('impact_snapshots').upsert({ month, metrics: data })
  return Response.json({ month })
}
```

Route test: missing or wrong bearer → 401; right bearer → calls `rpc('impact_summary')` (admin client mocked with `vi.mock('@/lib/supabase/admin')`).

- [ ] **Step 6: Document the definitions** — add a "Definitions in code" table to `docs/product/impact-metrics.md` mapping each figure on the admin page to its SQL in `20261004120200_impact_functions.sql`, and state that figures not yet measured (assessments, certificates, scholarships, revenue, testimonials, partnerships, institutions) arrive with the features that create them.

- [ ] **Step 7: Run** — `npx vitest run src/lib/progress src/app/api` — Expected: PASS.

- [ ] **Step 8: Commit** — `git add -A && git commit -m "feat(impact): offline-safe progress sync, active-time measurement, admin impact page and monthly snapshots"`

### Task 12: Lesson packs in the app, and the content tools

**Files:**
- Create: `src/lib/lessons/{schema,labs,catalogue,packs,types}.ts`, `tools/content-build/{build,check-code,publish,preview}.ts`, `tools/content-build/preview/{player.js,player.css}` (moved), `content/samples/01-samples/01-every-step.mdx`, `content/samples/LICENSE.md`
- Modify: `docs/curriculum/lesson-format.md` (add `description` and `slug`), the content repository's two lessons (add `description`)
- Test: `src/lib/lessons/schema.test.ts`, `tools/content-build/build.test.ts`

**Interfaces:**
- Produces:
  - `LessonPack` Zod schema (schema 1) and `parsePack(json: unknown): LessonPack`
  - `LAB_NAMES = ['request-journey', 'page-load', 'flex-axes', 'url-anatomy', 'http-exchange'] as const`, `type LabName`
  - `listPublishedLessons(track?: string): Promise<LessonMeta[]>`, `getLesson(track: string, slug: string): Promise<LessonMeta | null>`, `loadPack(meta: LessonMeta): Promise<LessonPack>` where `type LessonMeta = { id: string; track: string; module: number; lesson: number; slug: string; title: string; description: string; minutes: number; free: boolean; version: number; packUrl: string }`
  - CLI: `node tools/content-build/build.ts --in <dir> --out <dir> --catalogue <file>`; `check-code.ts --packs <dir>`; `publish.ts --packs <dir> --catalogue <file>`

- [ ] **Step 1: Add `description` and `slug` to the lesson format.** Frontmatter gains `description` (120–160 characters, used for search results and share cards). `slug` is the file name without its number prefix (`01-what-happens-when-you-open-a-website.mdx` → `what-happens-when-you-open-a-website`). Update the lesson-format doc's frontmatter example, components table and `LessonPack` type, and add descriptions to `fe-01-01` and `fe-06-04` in the content repository.

- [ ] **Step 2: Write the failing schema tests**

```ts
// src/lib/lessons/schema.test.ts
import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'
import { parsePack } from './schema'

const sample = () => JSON.parse(readFileSync('content/samples/packs/zz-01-01.json', 'utf8'))

it('accepts a built sample pack', () => {
  expect(parsePack(sample()).steps.length).toBeGreaterThan(5)
})
it('rejects a pack from a newer schema', () => {
  expect(() => parsePack({ ...sample(), schema: 2 })).toThrow()
})
it('rejects a lab the player does not know', () => {
  const pack = sample()
  pack.steps.push({ type: 'diagram', stage: 'investigate', lab: 'warp-drive', states: [{ title: 'a', html: 'b' }, { title: 'c', html: 'd' }] })
  expect(() => parsePack(pack)).toThrow()
})
```

- [ ] **Step 3: Implement the schema** as a Zod discriminated union on `type` that mirrors the `LessonPack` TypeScript type in lesson-format.md exactly, with `lab: z.enum(LAB_NAMES)`, `schema: z.literal(1)`, `slug: z.string().regex(/^[a-z0-9-]+$/)`, `description: z.string().min(120).max(160)`, and `.strict()` objects so unknown fields fail.

- [ ] **Step 4: Move the content tools into this repository, in TypeScript**

Port `build.mjs`, `check-code.mjs` and `preview.mjs` from `D:\Desktop\practicode-learn-content\tools` to `tools/content-build/*.ts` (Node runs them with built-in type stripping, so use only erasable TypeScript: no enums, no namespaces, no parameter properties). Changes while porting: read `LAB_NAMES` from `src/lib/lessons/labs.ts`; take `--in`, `--out` and `--catalogue` arguments; add `slug` and `description`; validate every built pack with `parsePack` before writing; `check-code.ts` imports the document builder from `src/lib/runner/build-document.ts` (Task 13) so the checks and the player share one runtime. Copy the preview player files unchanged into `tools/content-build/preview/`.

- [ ] **Step 5: Write the sample lesson** `content/samples/01-samples/01-every-step.mdx` (id `zz-01-01`, slug `every-step`, track `samples`, CC BY-SA 4.0, about a made-up topic) using every step type and lab once, then `npm run content:samples` and commit the built `content/samples/packs/` and `content/samples/catalogue.json`.

- [ ] **Step 6: Implement catalogue and pack loading** — `NEXT_PUBLIC_CONTENT_SOURCE=samples` reads `content/samples/catalogue.json` and packs from disk; `supabase` reads `lessons` with the anon client and fetches packs from the `lessons-free` public URL. Both validate with `parsePack`; a pack that fails validation throws a typed `PackError`, which the lesson page turns into its error state.

- [ ] **Step 7: Run** — `npx vitest run src/lib/lessons tools` — Expected: PASS.

- [ ] **Step 8: Point the content repository at these tools** — its `package.json` scripts call `node ../practicode-learn/tools/content-build/build.ts --in tracks --out dist/packs --catalogue dist/catalogue.json` locally (CI checks out this repository at a pinned commit, Task 18); delete its own `tools/` folder and commit there.

- [ ] **Step 9: Commit** — `git add -A && git commit -m "feat(lessons): lesson pack schema, catalogue loading and content tools in the public repo"`

### Task 13: The isolated code runner

**Files:**
- Create: `public/runner.html`, `src/lib/runner/{build-document,protocol}.ts`, `src/components/lesson/preview-frame.tsx`, `src/app/(dev)/fixtures/runner/page.tsx`
- Test: `src/lib/runner/build-document.test.ts`, `tests/e2e/runner.spec.ts`

**Interfaces:**
- Produces:
  - `buildDocument(files: LessonFile[], opts?: { value?: string; tests?: LessonTest[] }): string`
  - `type RunnerMessage = { type: 'ready' } | { type: 'pcl-tests'; results: TestResult[] }`, `type TestResult = { name: string; pass: boolean; message?: string }`
  - `<PreviewFrame files value? tests? onResults?(r: TestResult[]) label />` with an imperative `run()` via ref; 4-second timeout produces a single failed result with the message "Your code didn't finish. Check for a loop that never ends, or an error in the console."

- [ ] **Step 1: Write the failing builder tests**

```ts
// src/lib/runner/build-document.test.ts
import { expect, it } from 'vitest'
import { buildDocument } from './build-document'

const files = [{ name: 'index.html', lang: 'html', code: '<p>Hi</p>' }, { name: 'styles.css', lang: 'css', code: 'p { color: red }' }]

it('puts CSS in the head and HTML in the body', () => {
  const doc = buildDocument(files)
  expect(doc).toMatch(/<style>p \{ color: red \}<\/style><\/head><body><p>Hi<\/p>/)
})
it('substitutes a live value wherever {{value}} appears', () => {
  expect(buildDocument([{ name: 'styles.css', lang: 'css', code: 'a { align-items: {{value}}; }' }], { value: 'center' })).toContain('align-items: center;')
})
it('cannot be broken out of with a closing script tag in learner code', () => {
  const doc = buildDocument([{ name: 'script.js', lang: 'js', code: 'console.log("</script><img src=x onerror=alert(1)>")' }])
  expect(doc.match(/<\/script>/g)).toHaveLength(1)
})
```

- [ ] **Step 2: Run** — Expected: FAIL.

- [ ] **Step 3: Implement** `build-document.ts` by porting `tools/runtime/sandbox.mjs` from the content repository to TypeScript (same harness API: `$`, `$$`, `css`, `box`, `textBox`, `near`, `assert`; tests compiled in as functions, no `eval`; a `setTimeout`, not `requestAnimationFrame`, before running tests).

- [ ] **Step 4: Write `public/runner.html`**

```html
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Runner</title></head>
<body><script>
  // Sandboxed by its own CSP: opaque origin, no cookies, no storage, no navigation of the parent.
  window.addEventListener('message', function (e) {
    if (e.source !== window.parent || !e.data || e.data.type !== 'run' || typeof e.data.html !== 'string') return
    document.open(); document.write(e.data.html); document.close()
  })
  parent.postMessage({ type: 'ready' }, '*')
</script></body></html>
```

`PreviewFrame` (client) renders `<iframe src="/runner.html?r={n}" sandbox="allow-scripts" title={label}>`; on `ready` from that iframe's `contentWindow` it posts `{ type: 'run', html: buildDocument(...) }`; it accepts `pcl-tests` only when `event.source === iframe.contentWindow`; `run()` bumps `n` to get a fresh document; a 4-second timer reports the timeout result. The dev fixture page renders three frames (passing tests, a throwing script, a document with no harness) and returns `notFound()` when `process.env.NODE_ENV === 'production'`.

- [ ] **Step 5: Write the e2e runner test (Review Focus 5)**

```ts
// tests/e2e/runner.spec.ts
import { expect, test } from '@playwright/test'

test.use({ baseURL: 'http://localhost:3000' })
test.skip(process.env.PW_PRODUCTION === '1', 'fixture only exists in development')

test('passing tests report back', async ({ page }) => {
  await page.goto('/fixtures/runner')
  await expect(page.getByTestId('passing-results')).toContainText('2 of 2 passed')
})

test('a script that throws ends in a friendly message, and the page still works', async ({ page }) => {
  await page.goto('/fixtures/runner')
  await expect(page.getByTestId('throwing-results')).toContainText("Your code didn't finish", { timeout: 6000 })
  await page.getByRole('button', { name: 'Run Again' }).first().click()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('learner code cannot read our cookies or storage', async ({ page }) => {
  await page.goto('/fixtures/runner')
  await expect(page.getByTestId('isolation-results')).toContainText('origin: null')
})
```

The `isolation` fixture's test code asserts `String(window.origin) === 'null'` and that `document.cookie` access throws or is empty.

- [ ] **Step 6: Run** — `npx vitest run src/lib/runner && npx playwright test tests/e2e/runner.spec.ts` (against `npm run dev`, with `PW_PRODUCTION` unset) — Expected: PASS.

- [ ] **Step 7: Commit** — `git add -A && git commit -m "feat(runner): isolated learner-code runner with tests, timeouts and an opaque origin"`

### Task 14: The lesson player and labs

**Files:**
- Create: `src/components/lesson/player/{player,use-lesson-player,progress-bar,step-nav}.tsx`, `src/components/lesson/steps/{explain,choice,explore,diagram,order,code,recap}.tsx`, `src/components/lesson/parts/{options,hints,feedback,code-files,editor,tests-list,highlight}.tsx`, `src/components/lesson/labs/{index,request-journey,page-load,flex-axes,url-anatomy,http-exchange}.tsx`
- Test: `src/components/lesson/player/use-lesson-player.test.ts`, `src/components/lesson/parts/highlight.test.ts`, `src/components/lesson/steps/choice.test.tsx`, `src/components/lesson/steps/order.test.tsx`

**Interfaces:**
- Consumes: `LessonPack`, `LAB_NAMES` (Task 12); `PreviewFrame`, `buildDocument` (Task 13); `createActiveTimer` (Task 11).
- Produces:
  - `<LessonPlayer pack onEvent(e: { verb: 'lesson_started' | 'lesson_completed'; stepsDone: number; attempts: Record<string, number> }) onFinish() />`
  - `useLessonPlayer(pack, opts?: { startAt?: number })` → `{ index, step, state, canContinue, attempts: Record<string, number>, check(optionId), run(), reveal(), next(), back(), recordTests(results), moveItem(from, to) }`
  - `OrderStep({ step, initialOrder?: number[], onSolved(): void })` (the player passes a fixed shuffle; tests pass their own)
  - `labs: Record<LabName, React.ComponentType<{ state: number } | { value: string }>>`

Completion rules (from the review preview, which the founder approved): Explain, Diagram and Recap are done on view. A Predict step is done after Check, plus Run It when it has `run`; being wrong is fine, and the answer is revealed. A Question or Explore step is done when the correct option is checked. An Order step is done when the order is correct. A Code step is done when every test passes.

- [ ] **Step 1: Write the failing reducer tests**

```ts
// src/components/lesson/player/use-lesson-player.test.ts
import { act, renderHook } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'
import { parsePack } from '@/lib/lessons/schema'
import { useLessonPlayer } from './use-lesson-player'

const pack = parsePack(JSON.parse(readFileSync('content/samples/packs/zz-01-01.json', 'utf8')))
const go = (type: string) => pack.steps.findIndex((s) => s.type === type)

it('a predict step needs a check and a run, but not a right answer', () => {
  const { result } = renderHook(() => useLessonPlayer(pack, { startAt: go('predict') }))
  const wrong = (result.current.step as { options: { id: string; correct: boolean }[] }).options.find((o) => !o.correct)!
  act(() => result.current.check(wrong.id))
  expect(result.current.canContinue).toBe(false)
  act(() => result.current.run())
  expect(result.current.canContinue).toBe(true)
})

it('a question step needs the right answer', () => {
  const { result } = renderHook(() => useLessonPlayer(pack, { startAt: go('question') }))
  const opts = (result.current.step as { options: { id: string; correct: boolean }[] }).options
  act(() => result.current.check(opts.find((o) => !o.correct)!.id))
  expect(result.current.canContinue).toBe(false)
  act(() => result.current.check(opts.find((o) => o.correct)!.id))
  expect(result.current.canContinue).toBe(true)
})

it('counts attempts per step for the progress record', () => {
  const { result } = renderHook(() => useLessonPlayer(pack, { startAt: go('question') }))
  const opts = (result.current.step as { options: { id: string; correct: boolean }[] }).options
  act(() => result.current.check(opts[0]!.id))
  act(() => result.current.check(opts[1]!.id))
  expect(result.current.attempts[String(go('question'))]).toBe(2)
})

it('a code step is done only when every test passes', () => {
  const { result } = renderHook(() => useLessonPlayer(pack, { startAt: go('code') }))
  act(() => result.current.recordTests([{ name: 'a', pass: true }, { name: 'b', pass: false }]))
  expect(result.current.canContinue).toBe(false)
  act(() => result.current.recordTests([{ name: 'a', pass: true }, { name: 'b', pass: true }]))
  expect(result.current.canContinue).toBe(true)
})
```

- [ ] **Step 2: Run** — Expected: FAIL.

- [ ] **Step 3: Implement the reducer** (`useReducer` with per-step state keyed by index: `selected`, `checkedId`, `correct`, `ran`, `hints`, `order`, `solved`, `results`, `value`, `at`; `canContinue` derived by the completion rules above; `attempts` incremented on every `check` and every `recordTests`).

- [ ] **Step 4: Implement the step components and parts** by porting `tools/content-build/preview/player.js` (the founder-approved preview) to React:
  - **Options:** native radio inputs inside a `fieldset`.
  - **Feedback:** an `aria-live` slot with ✓/✕ and a word.
  - **Hints:** "Show a Hint", then "Another Hint".
  - **Code files:** tabs with `role="tablist"`, plus `highlight()` (whole-line mark for `{{value}}`).
  - **Editor:** a textarea at 16px on phones, a symbol bar, and Tab inserts two spaces.
  - **Tests list:** Passed / Needs a fix / Not run.

  Steps are Server-Component-free client components loaded only on lesson pages. Port the labs from the preview: `request-journey` (with the address callout and arrows aligned to the server boxes), `page-load` (with the instant replay on redraw) and `flex-axes`. Add `url-anatomy` (tap each part of `https://learn.practicode.tech/tracks?ref=whatsapp#syllabus` — scheme, subdomain, domain, top-level domain, path, query, fragment — to highlight and name it; states follow the Diagram contract) and `http-exchange` (Explore lab: choose a request — the home page, a missing page, a page that moved, the server is down — and see the status line, the response headers and what the browser shows: `200 OK`, `404 Not Found`, `301 Moved Permanently`, `503 Service Unavailable`). Every lab has an accessible name and a text description of each state, and respects reduced motion.

- [ ] **Step 5: Write and run component tests**

```tsx
// src/components/lesson/steps/order.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'
import { OrderStep } from './order'

it('reorders with the move buttons and reports when solved', async () => {
  const items = ['<p>First</p>', '<p>Second</p>', '<p>Third</p>']
  let solved = false
  render(<OrderStep step={{ type: 'order', stage: 'investigate', body: '<p>Order</p>', items, wrong: 'Not yet', hints: ['a', 'b', 'c'] }} initialOrder={[2, 1, 0]} onSolved={() => (solved = true)} />)
  await userEvent.click(screen.getAllByRole('button', { name: 'Move down' })[0]!) // Third ↓ → 1,2,0
  await userEvent.click(screen.getAllByRole('button', { name: 'Move down' })[1]!) // → 1,0,2
  await userEvent.click(screen.getAllByRole('button', { name: 'Move up' })[1]!)   // → 0,1,2
  await userEvent.click(screen.getByRole('button', { name: 'Check the Order' }))
  expect(solved).toBe(true)
})
```

`choice.test.tsx` covers: a live question re-renders the preview value when an option is chosen; wrong-then-right keeps Continue locked until right; feedback text is announced. `highlight.test.ts` covers: the `{{value}}` line is wrapped whole; CSS comments and selectors aren't broken by the mark.

Run: `npx vitest run src/components/lesson` — Expected: PASS.

- [ ] **Step 6: Commit** — `git add -A && git commit -m "feat(player): lesson player, every step type and the Module 1 labs"`

### Task 15: Lesson pages

**Files:**
- Create: `src/app/learn/[track]/[lesson]/{page,opengraph-image,layout}.tsx`, `src/components/lesson/{lesson-shell,lesson-outline,lesson-complete,guest-save-prompt}.tsx`, `src/app/learn/[track]/[lesson]/error.tsx`
- Modify: `src/app/sitemap.ts` (add lessons), `src/lib/seo/jsonld.ts` (lesson resource)
- Test: `tests/e2e/lesson.spec.ts`

**Interfaces:**
- Consumes: Tasks 11–14.
- Produces: the route `/learn/[track]/[lesson]`; `<LessonComplete minutes nextLesson share isGuest />`.

- [ ] **Step 1: Write the failing lesson e2e test**

```ts
// tests/e2e/lesson.spec.ts
import { expect, test } from '@playwright/test'

const URL = '/learn/samples/every-step'

test('a guest can play a whole lesson and is offered to save progress', async ({ page }) => {
  await page.goto(URL)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  // play through using the same moves as the review walk-through: right answers, runs, solutions
  await playWholeLesson(page)
  await expect(page.getByRole('heading', { name: /done/ })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Save My Progress' })).toHaveAttribute('href', /\/signup\?next=/)
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('pc-progress-v1') ?? '[]').length)).toBeGreaterThan(0)
})

test('lesson pages are readable by search engines before any JavaScript runs', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false })
  const page = await ctx.newPage()
  await page.goto(URL)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('region', { name: "What's in this lesson" })).toBeVisible()
})

test('an unknown lesson is a 404', async ({ request }) => {
  expect((await request.get('/learn/samples/no-such-lesson')).status()).toBe(404)
})
```

`playWholeLesson` lives in `tests/e2e/helpers/play.ts`, ported from the scratchpad walk-through used to QA the review preview.

- [ ] **Step 2: Run** — Expected: FAIL.

- [ ] **Step 3: Build the route.** `generateStaticParams` returns every published free lesson (samples included when `CONTENT_SOURCE=samples`, excluded from the sitemap and `noindex` when the track is `samples`). `generateMetadata` uses the lesson's title and `description`, canonical path, `type: 'article'`. The page server-renders the lesson header, breadcrumbs, a "What's in this lesson" outline (stage names and the recap points) and `learningResourceLd`, then mounts the client `LessonPlayer` with the pack. Non-free lessons render "This lesson is part of Pro, which launches with the full track" with `noindex`, and never load the pack. The client shell starts the active timer, enqueues `lesson_started` on the first interaction and `lesson_completed` on finish (with `offline: !navigator.onLine`), and calls `syncProgress()`. The completion screen ports `PrismTryDone` (minutes taken, what you can explain now = recap points, up next, share buttons, and for guests the save prompt linking to `/signup?next=<this lesson>`). The per-lesson share image uses `brandCard({ eyebrow: 'Front-End · Module 1 · Lesson 1', title: lesson.title, footer: 'Free lesson · learn.practicode.tech' })`.

- [ ] **Step 4: Check the JavaScript budget** — build, load a lesson page, sum the transferred JavaScript with Playwright (`page.on('response')` for `script` resources) and assert ≤ 170 KB compressed; add this as a test in `tests/e2e/lesson.spec.ts`.

- [ ] **Step 5: Run** — `npx playwright test tests/e2e/lesson.spec.ts tests/e2e/seo.spec.ts` — Expected: PASS.

- [ ] **Step 6: Commit** — `git add -A && git commit -m "feat(lessons): static, indexable lesson pages with guest play, progress and share cards"`

### Task 16: Offline lessons

**Files:**
- Create: `public/sw.js`, `src/components/pwa/register-sw.tsx`, `src/app/offline/page.tsx`
- Modify: `src/app/layout.tsx`
- Test: `tests/e2e/offline.spec.ts`

**Interfaces:**
- Produces: a service worker with three caches — `pc-static-v1` (immutable `/_next/static/*`, fonts, icons: cache first), `pc-pages-v1` (lesson and track pages: network first, falling back to cache, then `/offline`), `pc-packs-v1` (lesson pack JSON: stale while revalidate).

- [ ] **Step 1: Write the failing offline test (Review Focus 2)**

```ts
// tests/e2e/offline.spec.ts
import { expect, test } from '@playwright/test'

test('a lesson opened once reloads with no connection', async ({ page, context }) => {
  await page.goto('/learn/samples/every-step')
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await page.reload() // let the worker control the page and cache it
  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('a lesson never opened shows the offline page, not a browser error', async ({ page, context }) => {
  await page.goto('/')
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await context.setOffline(true)
  await page.goto('/about')
  await expect(page.getByRole('heading', { name: "You're offline" })).toBeVisible()
})
```

- [ ] **Step 2: Run** — Expected: FAIL.

- [ ] **Step 3: Implement** `public/sw.js` (install: precache `/offline`, icons and the manifest; activate: delete caches whose names aren't in the current list; fetch: the three strategies above, `GET` only, same-origin only, never cache `/auth`, `/api`, `/home`, `/settings` or `/admin`). Register it from a client component in production only, after `load`. The offline page ports `PrismOffline` with "You're offline" and lists the lessons it can open (read from `caches` in a small client component).

- [ ] **Step 4: Run** — `npx playwright test tests/e2e/offline.spec.ts` — Expected: PASS.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat(pwa): offline lessons with a service worker and an offline page"`

### Task 17: Learner home and settings

**Files:**
- Create: `src/app/(app)/home/page.tsx`, `src/app/(app)/settings/{page,actions}.ts(x)`, `src/app/(app)/settings/export/route.ts`, `src/components/app/{resume-card,module-progress,danger-zone}.tsx`
- Test: `src/app/(app)/settings/actions.test.ts`, `tests/e2e/settings.spec.ts`

**Interfaces:**
- Consumes: `requireUser` (Task 10), progress tables (Task 9), catalogue (Task 12), `ThemeToggle` (Task 2).
- Produces: server actions `renameLearner(prev, formData)`, `deleteAccount(prev, formData)`; route `GET /settings/export` (JSON attachment).

- [ ] **Step 1: Write the failing action tests**

```ts
// src/app/(app)/settings/actions.test.ts
import { describe, expect, it, vi } from 'vitest'
vi.mock('@/lib/auth/require-user', () => ({ requireUser: async () => ({ id: 'u1', email: 'a@b.c', name: 'A', isAdmin: false }) }))
const deleteUser = vi.fn(async () => ({ error: null }))
vi.mock('@/lib/supabase/admin', () => ({ createAdminClient: () => ({ auth: { admin: { deleteUser } } }) }))
vi.mock('@/lib/supabase/server', () => ({ createClient: async () => ({ auth: { signOut: vi.fn() }, from: () => ({ update: () => ({ eq: async () => ({ error: null }) }) }) }) }))
vi.mock('next/navigation', () => ({ redirect: vi.fn() }))
import { deleteAccount, renameLearner } from './actions'

describe('settings actions', () => {
  it('rejects a name longer than 80 characters', async () => {
    const fd = new FormData(); fd.set('name', 'x'.repeat(81))
    expect(await renameLearner(undefined, fd)).toMatchObject({ error: expect.stringMatching(/80/) })
  })
  it('deletes only after the learner types "delete"', async () => {
    const fd = new FormData(); fd.set('confirm', 'yes')
    expect(await deleteAccount(undefined, fd)).toMatchObject({ error: expect.any(String) })
    expect(deleteUser).not.toHaveBeenCalled()
    fd.set('confirm', 'delete')
    await deleteAccount(undefined, fd)
    expect(deleteUser).toHaveBeenCalledWith('u1')
  })
})
```

- [ ] **Step 2: Run** — Expected: FAIL.

- [ ] **Step 3: Build the pages.**
  - **Home** ports `PrismDashboardNew`. It shows a greeting with the learner's name, and a resume card for the most recent unfinished lesson (or Module 1, Lesson 1). It lists Module 1 with each lesson's status, and says "Module 2 is on its way" with no date.
  - **Settings** ports `PrismSettings`, keeping only: name, appearance (`ThemeToggle variant="segmented"`), "Download My Data" and "Delete My Account".
  - **Export** returns the learner's profile, progress and events, read with their own session so RLS applies, as `practicode-learn-data-YYYY-MM-DD.json`.
  - **Delete** validates `confirm === 'delete'`, deletes the user with the admin client (profile, progress and events go with it through `on delete cascade`), signs out and redirects to `/?account=deleted`. The landing page then shows "Your account and data have been deleted".

- [ ] **Step 4: Write and run the e2e test** (dev project): sign in, rename, export (the download contains the new name), delete (signing in again with the same email creates a fresh empty account).

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat(app): learner home, settings, data export and account deletion"`

### Task 18: Publishing lessons from the private repository

**Files:**
- Create: `tools/content-build/publish.ts` (fill in), `src/app/api/revalidate/route.ts`, in the content repository: `.github/workflows/publish.yml`
- Test: `tools/content-build/publish.test.ts`, `src/app/api/revalidate/route.test.ts`

**Interfaces:**
- Consumes: catalogue tables and storage (Task 9), built packs (Task 12).
- Produces: `planPublish(local: CatalogueEntry[], remote: CatalogueEntry[]): { upload: CatalogueEntry[]; unchanged: string[] }`; `POST /api/revalidate` with `{ paths: string[] }` and `Authorization: Bearer <REVALIDATE_SECRET>`.

- [ ] **Step 1: Write the failing tests**

```ts
// tools/content-build/publish.test.ts
import { expect, it } from 'vitest'
import { planPublish } from './publish'

const e = (id: string, hash: string) => ({ id, version: 1, hash, track: 'front-end-web-development', module: 1, lesson: 1, slug: id, title: id, description: 'd'.repeat(130), minutes: 10, free: true, steps: 9, bytes: 3000 })

it('uploads only lessons whose content changed', () => {
  const plan = planPublish([e('fe-01-01', 'aaa'), e('fe-01-02', 'bbb')], [e('fe-01-01', 'aaa')])
  expect(plan.upload.map((x) => x.id)).toEqual(['fe-01-02'])
  expect(plan.unchanged).toEqual(['fe-01-01'])
})
```

```ts
// src/app/api/revalidate/route.test.ts
import { expect, it, vi } from 'vitest'
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
process.env.REVALIDATE_SECRET = 's'.repeat(40); process.env.SUPABASE_SECRET_KEY = 'k'.repeat(40); process.env.CRON_SECRET = 'c'.repeat(40)
import { POST } from './route'

it('refuses requests without the secret', async () => {
  expect((await POST(new Request('http://x/api/revalidate', { method: 'POST', body: '{"paths":["/"]}' }))).status).toBe(401)
})
it('refuses paths that are not ours', async () => {
  const res = await POST(new Request('http://x/api/revalidate', { method: 'POST', headers: { authorization: `Bearer ${'s'.repeat(40)}` }, body: JSON.stringify({ paths: ['https://evil.com'] }) }))
  expect(res.status).toBe(400)
})
```

- [ ] **Step 2: Run** — Expected: FAIL.

- [ ] **Step 3: Implement.**

`publish.ts` does four things in order:
1. Reads the built catalogue and the remote `lessons` rows.
2. Uploads each changed pack to `lessons-free/<id>/v<version>.json` (or `lessons-pro`) with `upsert: true` and `cacheControl: '31536000'`. Versioned paths are immutable.
3. Upserts the `tracks` and `lessons` rows.
4. POSTs `/api/revalidate` with the changed lesson paths, their track pages and `/sitemap.xml`.

The revalidate route checks the bearer token with `timingSafeEqual`. It validates `{ paths: z.array(z.string().regex(/^\/[a-z0-9\-/.]*$/)).max(200) }` and calls `revalidatePath` for each path.

```yaml
# practicode-learn-content/.github/workflows/publish.yml
name: Publish lessons
on: { push: { branches: [main] }, workflow_dispatch: {} }
permissions: { contents: read }
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
        with: { path: content }
      - uses: actions/checkout@v5
        with: { repository: <founder-username>/practicode-learn, ref: ${{ vars.TOOLS_REF }}, path: app }
      - uses: actions/setup-node@v5
        with: { node-version: 24, cache: npm, cache-dependency-path: app/package-lock.json }
      - run: npm ci
        working-directory: app
      - run: npx playwright install --with-deps chromium
        working-directory: app
      - run: node tools/content-build/build.ts --in ../content/tracks --out ../content/dist/packs --catalogue ../content/dist/catalogue.json
        working-directory: app
      - run: node tools/content-build/check-code.ts --packs ../content/dist/packs
        working-directory: app
      - run: node tools/content-build/publish.ts --packs ../content/dist/packs --catalogue ../content/dist/catalogue.json
        working-directory: app
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SECRET_KEY: ${{ secrets.SUPABASE_SECRET_KEY }}
          REVALIDATE_URL: https://learn.practicode.tech/api/revalidate
          REVALIDATE_SECRET: ${{ secrets.REVALIDATE_SECRET }}
```

- [ ] **Step 4: Run** — `npx vitest run tools src/app/api` — Expected: PASS. Then push the content repository (F2) and check the Action publishes `fe-01-01` and `fe-06-04` to the dev project first (point the secrets at dev), then at production.

- [ ] **Step 5: Commit** (both repositories) — `git commit -m "feat(content): publish lessons from the private repository and revalidate pages"`

### Task 19: Documentation and the evidence system

**Files:**
- Create: `docs/development/{getting-started,conventions,testing}.md`, `docs/operations/{deployment,accounts-and-keys,content-publishing,launch-checklist}.md`, `docs/evidence/{README,innovation-log,open-source,recognition,partnerships,feedback}.md`, `docs/evidence/impact-reports/README.md`
- Modify: `README.md`, `CONTRIBUTING.md`, `docs/README.md`, `CHANGELOG.md`, `ROADMAP.md`

**Interfaces:**
- Produces: the documentation set below. No code.

- [ ] **Step 1: Developer docs.**
  - `getting-started.md` covers prerequisites, cloning, `.env.local` from `.env.example`, running with sample content, connecting the dev Supabase project, and every npm script.
  - `conventions.md` covers folder layout, component rules, styling with tokens, server and client boundaries, naming, copy rules and commit messages.
  - `testing.md` covers what each test layer proves, how to run the database tests against the dev project, and how Lighthouse is run.

- [ ] **Step 2: Operations docs.**
  - `deployment.md` covers Vercel, environments, the domain, preview indexing protection and rollbacks.
  - `accounts-and-keys.md` lists each account and what it is for: GitHub, Vercel, Supabase dev and production, Resend, Google OAuth, Search Console, and Groq (slice 4). It records where each key lives and how to rotate it, and never records the keys themselves.
  - `content-publishing.md` covers the content repository flow, review, publishing and rollback by version.
  - `launch-checklist.md` lists what must be true before the closed beta, and before payments, including the lawyer's review of the legal pages.

- [ ] **Step 3: The evidence system** (Global Talent–aware, public and truthful)

`docs/evidence/README.md` explains the principle: record evidence as it happens, publish only true, verifiable facts, and keep personal documents (identity, transcripts, letters) out of this repository, in a private archive. It maps the founder's evidence structure to where each item lives:

| Evidence | Where |
|---|---|
| Product vision | `docs/product/vision.md` |
| Problem statement and target learners | `docs/product/vision.md` (personas) |
| Technical architecture | `docs/architecture/` and the ADRs |
| GitHub repository | this repository, with its commit history and CHANGELOG |
| Development roadmap | `ROADMAP.md`, `docs/specs/`, `docs/plans/` |
| Innovation log | `docs/evidence/innovation-log.md` |
| Product analytics and learner impact | the admin impact page; monthly snapshots summarised in `docs/evidence/impact-reports/` |
| User feedback | `docs/evidence/feedback.md` (pilot findings; quotes only with written consent) |
| Scholarship programme | added when the programme starts (slice 4) |
| Partnerships | `docs/evidence/partnerships.md` (for example, Community Partner of Muslim Tech Expo 4.0) |
| Media and recognition | `docs/evidence/recognition.md` |
| Open source | `docs/evidence/open-source.md` (public code, syllabi under CC BY-SA, contributions) |
| Evidence archive (personal documents) | private, outside the repository |

`innovation-log.md` starts with dated entries for what is already built, each saying what is new and linking to the code or ADR:
- the PRIMM lesson format with automated checks
- live questions
- the isolated runner shared by checks and player
- validated progress writes that keep impact figures trustworthy
- the lab library

- [ ] **Step 4: Update `README.md`.** Cover what the product is, its status (beta), the live link, a screenshot, the tech stack, quick start, documentation links, licences, and the founder and company.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "docs: developer, operations and security docs, and the evidence system"`

### Task 20: Continuous integration, production checks and launch

**Files:**
- Create: `.github/workflows/ci.yml`, `.github/workflows/codeql.yml`, `.github/dependabot.yml`, `lighthouserc.json` (if not created in Task 8), `tests/e2e/smoke.spec.ts`
- Modify: `docs/operations/launch-checklist.md`

- [ ] **Step 1: CI workflow**

```yaml
# .github/workflows/ci.yml
name: CI
on: { push: { branches: [main] }, pull_request: {} }
permissions: { contents: read }
concurrency: { group: ci-${{ github.ref }}, cancel-in-progress: true }
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with: { node-version: 24, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - run: npm audit --audit-level=high --omit=dev
  e2e:
    runs-on: ubuntu-latest
    needs: quality
    env: { NEXT_PUBLIC_CONTENT_SOURCE: samples, NEXT_PUBLIC_SITE_URL: http://localhost:3000 }
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with: { node-version: 24, cache: npm }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test
        env: { PW_PRODUCTION: '1' }
      - run: npx lhci autorun
      - uses: actions/upload-artifact@v4
        if: failure()
        with: { name: playwright-report, path: playwright-report }
```

- [ ] **Step 2: Code scanning and dependency updates** — `codeql.yml` (JavaScript/TypeScript, on push, pull request and weekly) and `dependabot.yml` (npm weekly, GitHub Actions monthly, grouping Next.js/React and Supabase updates).

- [ ] **Step 3: Lighthouse configuration**

```json
{
  "ci": {
    "collect": { "startServerCommand": "npm run start", "url": ["http://localhost:3000/", "http://localhost:3000/tracks/front-end-web-development", "http://localhost:3000/about", "http://localhost:3000/learn/samples/every-step"], "numberOfRuns": 2, "settings": { "preset": "perf" } },
    "assert": { "assertions": { "categories:seo": ["error", { "minScore": 1 }], "categories:accessibility": ["error", { "minScore": 0.95 }], "categories:best-practices": ["error", { "minScore": 0.95 }], "categories:performance": ["warn", { "minScore": 0.9 }] } },
    "upload": { "target": "temporary-public-storage" }
  }
}
```

The lesson URL above uses the sample lesson, which is `noindex`, so Lighthouse's SEO check for it is relaxed in its own assertion set (`"matchingUrlPattern": "/learn/samples/"` with `categories:seo` at `warn`).

- [ ] **Step 4: Production smoke test** — `tests/e2e/smoke.spec.ts` runs against `PLAYWRIGHT_BASE_URL=https://learn.practicode.tech`. It checks that the landing page, track page, a published Module 1 lesson, `robots.txt`, `sitemap.xml`, the share image (status 200, `image/png`, under 300 KB) and the security headers are all as expected. Run it after every production deploy.

- [ ] **Step 5: Search engines** (F8) — verify the domain in Google Search Console and Bing Webmaster Tools through the verification variables, submit `https://learn.practicode.tech/sitemap.xml`, and request indexing for the landing and track pages.

- [ ] **Step 6: Launch checklist for the closed beta.** It requires:
  - every test green, and Lighthouse SEO at 100
  - the smoke test passing on production
  - the founder signed in and set as admin (F10), with the impact page loading
  - Module 1's published lessons playable on a low-end Android phone over a slow connection
  - account deletion tested
  - the privacy notice live
  - Resend sending from `practicode.tech`

- [ ] **Step 7: Commit** — `git add -A && git commit -m "ci: tests, Lighthouse, CodeQL and Dependabot; production smoke test and launch checklist"`

### Task 21: Module 1 lessons 2–6 (content repository)

**Files:**
- Create in `practicode-learn-content/tracks/front-end-web-development/01-how-the-web-works/`: `02-urls-domains-and-dns.mdx`, `03-requests-responses-and-status-codes.mdx`, `04-html-css-and-javascript-who-does-what.mdx`, `05-your-first-web-page.mdx`, `06-reading-mdn-the-developers-dictionary.mdx`

These are content, written by the review workflow in ADR 0007, alongside the code tasks above. They follow the founder's rule from the review: if an answer can be shown, the learner sees it.

| Lesson | Hands-on core |
|---|---|
| 2. URLs, domains and DNS | `url-anatomy` diagram; a live question that changes one part of a URL and shows where the browser would go; a DNS trip in the `request-journey` style |
| 3. Requests, responses and status codes | `http-exchange` explore with the four requests; an order step for the request–response sequence; a transfer question about a 404 shared on WhatsApp |
| 4. HTML, CSS and JavaScript: who does what | an Explore step with values "HTML only", "+ CSS", "+ JavaScript" running the same page; a live question removing one layer |
| 5. Your first web page | Code steps with tests: write a heading and paragraph, add a link, then a Make step building the start of the "About me" project |
| 6. Reading MDN, the developer's dictionary | a mocked MDN page and questions that send the learner to find answers in it; a reflect-style apply question |

- [ ] **Step 1:** Draft each lesson and run `npm run check` until it passes.
- [ ] **Step 2:** Rebuild the review preview and send the link to the founder for review notes.
- [ ] **Step 3:** Apply the notes, then merge to `main`. The publish Action ships them.
- [ ] **Step 4:** Confirm they appear on the track page and in the sitemap, and play end to end on a phone.

**Slice 1 exit test:** a learner on a low-end Android phone finishes Module 1 without help, their progress appears on their home page, and the admin impact page counts it.
