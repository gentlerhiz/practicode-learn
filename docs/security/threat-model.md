# Threat model

> Last reviewed: 4 October 2026, for slice 1 (the public site and Module 1). Review it whenever a feature adds an asset, an actor or a trust boundary, and before payments launch.

The design decisions behind these mitigations are in [ADR 0008](../architecture/adr/0008-security-model.md).

## What we protect

| Asset | Why it matters |
|---|---|
| Learner accounts | Email addresses and sign-in sessions. Takeover exposes a learner's data and progress. |
| Progress and learning records | Learners' own work, and the source of every certificate and impact figure |
| Impact data | Public evidence for funders, partners and assessors. It must be real and defensible. |
| Lesson content | The paid product. Pro lessons and certificate tests mustn't leak. |
| Keys and secrets | The Supabase secret key, revalidation and cron secrets, and later the payment keys |
| The domain and brand | Visitors trust `learn.practicode.tech` and the PractiCode name. |

## Who might attack

- **Curious or competitive learners.** They might try to skip lessons, fake progress or reach Pro content.
- **Opportunistic attackers.** Automated scanning, credential stuffing and spam sign-ups.
- **Malicious code in a lesson preview.** A learner pastes code from elsewhere that tries to steal a session.
- **A compromised dependency or build tool.**

## Trust boundaries

1. Browser to our app (Vercel): every request, form and query string
2. Our app to Supabase (Postgres, Auth, Storage): the publishable key with row-level security, or the secret key on the server only
3. Lesson page to runner frame: arbitrary learner code on one side, our page on the other
4. Content repository to Supabase Storage: the publish pipeline
5. Third parties: Google sign-in, Resend email, Vercel analytics

## Threats and mitigations

| Threat | Mitigation | Where |
|---|---|---|
| **Cross-site scripting** on our pages | React escaping; no untrusted HTML on public pages; escaped JSON-LD; CSP (nonce mode on signed-in pages, static mode on public pages); no `eval` | `src/lib/security/csp.ts`, `src/lib/seo/jsonld.ts`, Task 5 |
| **Malicious learner code** in a preview | Runner page with a CSP `sandbox allow-scripts` header (opaque origin), `postMessage` only, 4-second timeout, never indexed | `public/runner.html`, Task 13 |
| **Account takeover** | Supabase Auth with 6-digit email codes and Google; no passwords; sessions refreshed on the server with `getClaims()`; rate limits on Auth | Task 10 |
| **Open redirect** through `next` | `safeRedirect` allows same-site paths only (rejects `//`, `/\`, schemes and full URLs) | Task 10 |
| **Inflated progress or impact figures** | No direct writes to progress tables; `record_progress()` validates, is idempotent by event id and caps time; monthly snapshots; impact functions for admins only | Tasks 9 and 11 |
| **Reading another learner's data** | Row-level security on every table, tested against the dev project | Task 9 |
| **Scraping Pro content** | Pro packs in a private bucket behind short-lived signed links, issued only after a plan check; certificate tests never leave the server | Tasks 12 and 18 |
| **Leaked keys** | Secrets only in environment variables; `.env*` ignored by git; secret key only in `server-only` modules; GitHub secret scanning and CodeQL | Tasks 1, 10 and 20 |
| **Clickjacking** | `frame-ancestors 'none'` everywhere except the runner, which only our own pages may frame | Task 5 |
| **Supply-chain compromise** | Lockfile committed; Dependabot; CodeQL; npm install scripts not allowed by default; Subresource Integrity on bundles | Tasks 5 and 20 |
| **Spam sign-ups and abuse** | Supabase Auth rate limits and email verification; CAPTCHA if abuse appears | Task 10 |
| **Search engines indexing previews or private pages** | `robots.txt` disallows everything on previews and private paths on production; private pages set `noindex` | Task 4 |

## Known accepted risks

- **Public pages allow inline scripts** (see ADR 0008). This is accepted while those pages render no user content.
- **Two Turbopack chunks have no integrity hash.** They come from our own origin, so CSP still limits scripts to it.
- **Legal pages are a working draft.** A lawyer reviews them before payments start (launch checklist).
