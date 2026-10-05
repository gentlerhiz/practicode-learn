# Testing

What each layer of tests proves, and how to run it. A change is done when the build, the types, the lint and every test pass.

## The layers

| Layer | Tool | Where | What it proves |
|---|---|---|---|
| Unit and component | Vitest, Testing Library | `src/**/*.test.ts(x)` | Logic and components behave: safe redirects, the progress queue, the lesson-player rules, the highlighter, settings actions, route handlers |
| Content tools | Vitest | `tools/**/*.test.ts` | The lesson build catches bad lessons and keeps solutions out of packs; publishing uploads only what changed |
| Database | Vitest against the **dev** project | `tests/db/` | Row-level security and grants: learners only see their own rows, can't write progress directly, can't make themselves admins; impact figures are admin-only and count confirmed learners |
| End to end | Playwright and axe | `tests/e2e/` | Real pages in Chromium at phone and desktop sizes: sign-in, lessons played to the end, offline lessons, settings, security headers, structured data, and no accessibility violations in either theme |
| Lesson code | `tools/content-build/check-code.ts` | Every lesson | In a real browser at 360 and 960 px, each model solution passes its tests and each starter fails at least one |

## Running them

```bash
npm test                 # unit, component, tool and database tests
npm run test:e2e         # builds the app, serves it on port 3100, runs every end-to-end test
npx playwright test tests/e2e/lesson.spec.ts --project=desktop   # one file, one device
npm run content:check    # code checks for the sample lessons
```

## Database tests

They run against the hosted **dev** project (there is no local Supabase) and skip themselves when the `SUPABASE_TEST_*` variables are missing. Each run creates its own test users (`…@test.practicode.tech`) and deletes them afterwards. They never send email.

## End-to-end tests

- The test server is a production build on **port 3100**, built with `PCL_FIXTURES=1` so the test-only pages under `/fixtures` exist. Deployments never set that flag, so those pages answer 404 there.
- Tests that sign in create a confirmed test account and a code with the admin API, so no email is sent. The one test that signs up through the real form sends to Resend's test inbox (`delivered+…@resend.dev`), which never bounces.
- Before clicking a client component, tests wait for React to hydrate it (`tests/e2e/hydration.ts`). Without this, a click on a busy machine can land before the page is ready.

## Lighthouse

Lighthouse 13 is run by hand against a production build (`npm run build && npm run start`). `lighthouserc.json` holds the targets: SEO, accessibility and best practices at 100. Lighthouse CI 0.15 bundles Lighthouse 12, which can't trace current Chrome, so it isn't in CI yet. On the live site, use PageSpeed Insights.
