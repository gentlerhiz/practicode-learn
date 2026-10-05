# Deployment

PractiCode Learn runs on **Vercel**. Every push builds; `main` is production.

## Environments

| Environment | Built from | Address | Database | Search engines |
|---|---|---|---|---|
| Production | `main` | https://learn.practicode.tech | Supabase production (Frankfurt) | Indexed |
| Preview | every other branch and pull request | `practicode-learn-*-<team>.vercel.app` | Supabase dev (London) | Blocked |
| Development | your computer | http://localhost:3000 | Supabase dev | n/a |

- **Previews never get indexed:** `robots.txt` disallows everything unless `VERCEL_ENV` is `production` (`src/app/robots.ts`).
- **Server code runs in Frankfurt** (`fra1` in `vercel.json`), next to the production database.
- **Scheduled job:** Vercel Cron calls `/api/cron/impact-snapshot` at 06:00 UTC on the 1st of each month (`vercel.json`). It needs `CRON_SECRET` set.

## Environment variables

Set them in Vercel under Project Settings → Environment Variables, per environment. The full list, with what each is for, is in [`.env.example`](../../.env.example).

- **Production:** the production Supabase URL, publishable key and secret key; `NEXT_PUBLIC_SITE_URL=https://learn.practicode.tech`; `NEXT_PUBLIC_CONTENT_SOURCE=supabase`; `REVALIDATE_SECRET`; `CRON_SECRET`.
- **Preview:** the same names, with the **dev** project's values.

A deployment without Supabase settings still serves the public site: everyone is signed out, and lesson progress stays on the device. Where each secret lives is in [accounts and keys](accounts-and-keys.md).

## The domain

`learn.practicode.tech` is a CNAME to Vercel, at the DNS provider for `practicode.tech`. The `vercel.app` address redirects to it. Plain HTTP redirects to HTTPS, and HSTS is on.

## Database changes

Migrations in `supabase/migrations/` are applied to **dev first**, tested, then applied to production before the code that needs them is promoted. Migration history in the database uses the same version numbers as the files.

## Rolling back

- **Code:** in Vercel → Deployments, open an earlier production deployment and choose **Promote to Production** (instant rollback). Then fix forward on a branch.
- **A lesson:** see [content publishing](content-publishing.md#rolling-back-a-lesson).
- **The database:** migrations only move forward. Undo a change with a new migration. Supabase Pro adds daily backups; the free plan has none, which is one reason to upgrade before payments ([launch checklist](launch-checklist.md)).

## Checking a deployment

- The security headers and Content Security Policy are in place (the end-to-end security tests check these locally).
- `/robots.txt` and `/sitemap.xml` are right for the environment.
- Run PageSpeed Insights on the landing page and a lesson page.
