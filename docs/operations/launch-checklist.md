# Launch checklist

What must be true before each stage. Tick items only when they are done and checked, not when they are planned.

## Before the closed beta (the Academy pilot)

**Production configuration**
- [ ] Vercel production variables set: Supabase production URL, publishable key and secret key; `NEXT_PUBLIC_SITE_URL`; `NEXT_PUBLIC_CONTENT_SOURCE=supabase`; `REVALIDATE_SECRET`; `CRON_SECRET`
- [ ] Vercel preview variables point at the dev project
- [ ] Every migration in `supabase/migrations/` applied to production, and the security advisor shows no unexpected warnings
- [ ] Sign-in settings applied to production: site URL `https://learn.practicode.tech`, redirect URLs, 6-digit codes, Resend email, email templates
- [ ] Google sign-in: a production redirect URI in the Google client, and the client ID and secret in the production project
- [ ] The founder's account is an admin in production

**Content**
- [ ] The content repository is pushed, its Actions secrets point at production, and `TOOLS_REF` points at a released commit of this repository
- [ ] Module 1's lessons are published, each checked on a preview first
- [ ] `LESSONS_OPEN` set to `true` in `src/content/navigation.ts`, so the landing and track pages link to the first lesson

**Quality**
- [ ] The full test suite passes on `main`, in CI
- [ ] A lesson played to the end on a low-end Android phone, on a slow connection, and again offline
- [ ] PageSpeed Insights checked for the landing page and a lesson page
- [ ] `learn.practicode.tech` verified in Google Search Console and Bing Webmaster Tools, with the sitemap submitted

**People and data**
- [ ] Pilot learners told what is collected, using the privacy notice
- [ ] A way to reach the team (email) works and is watched

## Before taking payments

- [ ] A lawyer has reviewed the privacy notice, the terms and the accessibility statement (they are working drafts)
- [ ] Vercel Pro (Hobby doesn't allow commercial use) and Supabase Pro (daily backups)
- [ ] A data protection impact assessment covering learning analytics and the AI tutor
- [ ] Payment provider chosen and tested, with refunds and receipts
- [ ] The cookieless analytics position re-checked against the payment pages
- [ ] The Pro offer described only with features that exist
