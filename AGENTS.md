<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project rules

PractiCode Learn is a public, AGPL-licensed learning platform. Before changing code, read:

- The Global Constraints in [the slice 1 plan](docs/plans/2026-10-04-slice-1-module-1-end-to-end.md#global-constraints): stack versions, copy rules, security rules and budgets.
- [docs/development/conventions.md](docs/development/conventions.md): code layout, components and naming.
- [docs/security/threat-model.md](docs/security/threat-model.md): what we protect and how.

In short:

- Server Components by default; a client component only where interaction needs it.
- Reuse the primitives in `src/components/ui` instead of styling raw elements.
- Validate every input that crosses a trust boundary with Zod.
- Never import the Supabase secret key outside files that import `server-only`.
- British English, no all-caps, never offer career support, never count tracks, and no claim the product can't back today.
