# Accounts and keys

Every service PractiCode Learn depends on, what it's for, where its keys live and how to rotate them. **This file never contains a key.** Keys live in the places listed here, and nowhere else: not in the repository, issues, chat messages or documents.

## Accounts

| Service | What it's for | Notes |
|---|---|---|
| **GitHub** (`gentlerhiz`) | `practicode-learn` (public: the app, docs and content tools) and `practicode-learn-content` (private: the lessons) | The content repository's Action publishes lessons |
| **Vercel** | Hosting, previews, analytics, the monthly cron job | Hobby plan for the closed beta. Move to Pro before taking payments: Hobby doesn't allow commercial use |
| **Supabase: production** | The live database, sign-in and lesson storage. Frankfurt (`eu-central-1`) | Owned by the PractiCode Academy account; the founder is an admin. Free plan, so no backups yet |
| **Supabase: dev** | Development, previews and the database tests. London (`eu-west-2`) | Holds test data only |
| **Resend** | Sign-in emails from `learn@practicode.tech` (domain `practicode.tech`, region Ireland) | Supabase's own email service sends only 2 emails an hour |
| **Google Cloud** | "Continue with Google" (an OAuth client) | Brand verification needs the domain verified in Search Console |
| **Google Search Console** | Indexing and the sitemap, for the `practicode.tech` domain | Also proves domain ownership to Google |
| **Groq** | The AI tutor (planned for slice 4) | Not used yet |

## Where each key lives

| Key | Lives in | Used by |
|---|---|---|
| Supabase publishable key and URL (dev, production) | Vercel environment variables; your `.env.local` (dev) | The app, in browsers. Public by design: row-level security protects the data |
| Supabase secret key (dev, production) | Vercel environment variables; GitHub Actions secrets in the content repository; your `.env.local` (dev only) | Server code that imports `server-only`; publishing; the database tests |
| Database passwords | The Supabase dashboard; a password manager | Rarely needed: migrations go through the Supabase tools |
| `REVALIDATE_SECRET` | Vercel (production) and the content repository's Actions secrets: the same value in both | The publish step, to refresh lesson pages |
| `CRON_SECRET` | Vercel (production) | Vercel Cron, for the monthly impact snapshot |
| Resend API key (sending access only) | Your `.env.local` (`RESEND_SMTP_KEY`), then Supabase's sign-in email settings via `npm run auth:push` | Sign-in emails |
| Google OAuth client secret | The Supabase dashboard (Authentication → Google) | Google sign-in |
| Supabase personal access token | Your own computer's `supabase login` | Pushing sign-in settings |

## Rotating a key

Rotate straight away if a key may have been exposed: pasted somewhere, committed, or seen by someone who has left. Otherwise rotate yearly.

- **Supabase secret key:** create a new secret key in the project's API keys settings, update Vercel and the content repository's Actions secrets, redeploy, check sign-in and publishing still work, then delete the old key.
- **`REVALIDATE_SECRET` and `CRON_SECRET`:** generate a new random value of 32 or more characters, update every place listed above, redeploy.
- **Resend:** create a new sending-only key, put it in `.env.local`, run `npm run auth:push` for each project, then revoke the old key in Resend.
- **Google OAuth:** create a new client secret in Google Cloud, paste it into Supabase (Authentication → Google), then delete the old secret.
- **Database password:** reset it in the Supabase dashboard. Nothing in the app uses it directly.

## Leaving and joining

When someone joins, give them the least access they need, and their own Vercel and Supabase membership rather than shared logins. When someone leaves, remove their access and rotate every secret they could see.
