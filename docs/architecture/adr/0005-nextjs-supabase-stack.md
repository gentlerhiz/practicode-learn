# 0005. Next.js and Supabase as the core stack

- Status: Proposed
- Date: 2026-10-02

## Context

We need fast, accessible, server-rendered pages with little client JavaScript; authentication; a relational database with strict per-learner access control; and a stack a small team can move quickly in. The PractiCode team already builds with Next.js (the marketing site) and with Next.js and Supabase (the internal CRM).

## Decision

- **Next.js (App Router) with TypeScript**, deployed on Vercel.
- **Supabase** for Postgres, Auth, Storage and Row Level Security.
- **Tailwind CSS** with tokens generated from the brand config.
- **MDX** lesson content compiled to static lesson packs on a CDN.
- **In-browser code execution:** sandboxed iframes for the web, Pyodide for Python.

## Consequences

- One language end to end. The team's existing skills transfer directly.
- RLS enforces data isolation at the database, so a bug in application code can't leak another learner's data.
- Supabase is open source, so self-hosting is possible if data residency rules require it.
- **Watch:** Supabase region choice and data residency under NDPA 2023 and GDPR (see [Privacy](../../compliance/privacy-and-data-protection.md)).
- **Watch:** keep client JavaScript within budget. Default to Server Components and add client components only where interaction needs them.
