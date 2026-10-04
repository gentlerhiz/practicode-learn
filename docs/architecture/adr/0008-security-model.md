# 0008. Security model: two-mode Content Security Policy, sandboxed learner code, validated writes

- Status: Proposed
- Date: 2026-10-04

## Context

- **Public pages must be fast and fully indexable.** They are statically rendered and served from Vercel's CDN. A per-request value such as a CSP nonce forces dynamic rendering, which costs speed and search ranking.
- **Signed-in pages handle accounts and progress.** They render per request anyway, so they can carry the strictest policy.
- **Learners run their own code.** Lesson previews execute arbitrary HTML, CSS and JavaScript, and must never reach the learner's session, cookies or our origin.
- **Impact figures are public evidence** for funders and assessors. Learners must not be able to inflate their own progress by calling the API directly.
- **The repository is public** (AGPL-3.0), so no secret may live in it, and every dependency is a supply-chain risk.

The target is [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) Level 2.

## Decision

1. **Two Content Security Policy modes**, built by one function (`src/lib/security/csp.ts`).
   - **Static mode, for public pages**, set in `next.config.ts` headers. Scripts may come from our own origin. Bundles carry Subresource Integrity hashes (`experimental.sri`).
   - **Nonce mode, for dynamic routes** (`/home`, `/settings`, `/admin`, `/login`, `/signup`, `/verify`, `/auth`), set by `src/proxy.ts`. Each response gets a fresh nonce, plus `'strict-dynamic'`. Next.js reads the nonce from the request header and adds it to its own scripts.
   - **Both modes:** no `eval` outside development, `object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'none'`, and forms limited to our origin, Supabase and Google sign-in. Connections are limited to our origin, Supabase and Vercel analytics.
   - **The theme boot script** (the script that prevents a flash of the wrong theme) is allowed by its SHA-256 hash, so it needs no nonce on either kind of page.
2. **Measured: static pages need `'unsafe-inline'` for scripts.** On 4 October 2026, with Next.js 16.3.8, we built the site and loaded `/` under a policy without it. Next.js's inline page-data scripts (`self.__next_f.push(…)`) raised 10 violations, and the page didn't hydrate. Static mode therefore allows inline scripts, and drops the theme hash, because browsers ignore `'unsafe-inline'` whenever a hash or nonce is present. The remaining protections are:
   - no untrusted HTML is ever rendered on public pages
   - JSON-LD is escaped (`serializeJsonLd`)
   - external scripts are blocked
   - 6 of the 8 script files carry integrity hashes; the other 2 are same-origin chunks that Turbopack doesn't hash yet

   We will re-measure when Next.js ships hashes for its inline scripts.
3. **Styles allow `'unsafe-inline'` in both modes.** React style attributes and `next/font` need it, and injected CSS can't run code.
4. **Learner code runs in a sandboxed runner** (`public/runner.html`). Its own CSP header starts with `sandbox allow-scripts`, so it always has an opaque origin, even when opened directly. The lesson page frames it, and they talk only through `postMessage`. It is never indexed.
5. **Row-level security on every table.** Learners can't write progress tables directly. Writes go through `security definer` functions that validate input, are idempotent by event id and cap time per event. Impact functions are callable by admins and the service role only.
6. **Zod at every trust boundary:** forms, route parameters, query strings, fetched lesson packs, webhook bodies and environment variables.
7. **Secrets only in environment variables.** The Supabase secret key is read only by modules that import `server-only`, so importing one into client code fails the build.
8. **Safe redirects.** Every `next` parameter on sign-in routes goes through one function (`safeRedirect`) that only returns paths on our own site.
9. **Other headers on every response:**
   - HSTS for two years, including subdomains
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - a Permissions-Policy that turns off camera, microphone, geolocation, payment, USB and topics
   - `Cross-Origin-Opener-Policy: same-origin`
   - no `X-Powered-By`

   `X-Frame-Options` is left out because `frame-ancestors` covers every supported browser, and the two would conflict on the runner.

## Consequences

- Public pages stay static and fast, at the cost of `'unsafe-inline'` for scripts there. That risk is acceptable while public pages render no user content. Any feature that renders learner content on a public page must move to nonce mode first.
- Adding a third-party script, font host or API means changing `buildCsp`. The tests in `src/lib/security/csp.test.ts` and `tests/e2e/security-headers.spec.ts` show what changed.
- Inflated progress needs a server-side bypass, not a crafted request. That is what makes the impact figures defensible.
- The threat model ([docs/security/threat-model.md](../../security/threat-model.md)) lists each threat with its mitigation and the code or task that implements it.
