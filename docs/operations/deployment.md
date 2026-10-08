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

## Going live

Until production has its Supabase settings, the live site runs without them: signing up or logging in fails ("Something went wrong on our side", a 500 from the server action) and lesson links answer 404, because lessons come from the bundled sample instead of Supabase. Do these in order. `npm run prod` (`scripts/prod.mjs`) does the database, sign-in and lesson steps from your computer.

1. **Make `.env.prod`** in the project folder. It is git-ignored, and Next.js never loads it, so local builds and tests can't reach production:

   ```
   PROD_PROJECT_REF=kafoztmgrqstkwzdlyin
   # Supabase (production) → Connect → Session pooler, with your database password filled in
   PROD_DB_URL=postgresql://postgres.kafoztmgrqstkwzdlyin:<password>@<host>:5432/postgres
   # Supabase (production) → Project Settings → API Keys → secret key
   PROD_SUPABASE_SECRET_KEY=
   ```

2. **Database:** `npm run prod -- migrate` lists the migrations production still needs. Then `npm run prod -- migrate --apply` applies them.
3. **Sign-in settings and emails:** `npm run prod -- auth` pushes `supabase/config.toml` and the email templates, with `https://learn.practicode.tech` as the only address sign-in may return to. It uses your own `supabase login`, shows each change and asks before writing.
4. **Google sign-in:** in the production Supabase dashboard, Authentication → Sign In / Providers → Google, turn it on with the same client ID and secret as dev. In Google Cloud, add `https://kafoztmgrqstkwzdlyin.supabase.co/auth/v1/callback` to the OAuth client's authorised redirect URIs.
5. **Lessons:** run `npm run build` in `practicode-learn-content`, then `npm run prod -- lessons` here.
6. **Vercel** → Project Settings → Environment Variables, for **Production**:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://kafoztmgrqstkwzdlyin.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | production publishable key |
   | `SUPABASE_SECRET_KEY` | production secret key |
   | `NEXT_PUBLIC_CONTENT_SOURCE` | `supabase` |
   | `REVALIDATE_SECRET` | a new random value: `node -e "console.log(crypto.randomBytes(32).toString('hex'))"` |
   | `CRON_SECRET` | another new random value, made the same way |

   Then go to Deployments, open the latest production deployment and choose **Redeploy**. `NEXT_PUBLIC_*` values are built into the pages, so they take effect only after a new build. Do this after step 5, because the build reads the lesson list.
7. **Check:** `npm run prod -- check` confirms the tables, the published lessons, that the live site is connected, and that Module 1 Lesson 1 loads.
8. **Automatic publishing (optional):** push `practicode-learn-content` to a private GitHub repository. Give it the Actions secrets `SUPABASE_URL` (production), `SUPABASE_SECRET_KEY` (production) and `REVALIDATE_SECRET` (the same value as in Vercel). From then on, every push to its `main` publishes changed lessons and refreshes their pages.

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
