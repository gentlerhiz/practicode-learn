# PractiCode Learn v1: platform design

- **Status:** Draft, awaiting founder review
- **Date:** 2026-10-02 (updated 2026-10-03 with the visual direction and AI decisions, and 2026-10-04 with the content pipeline, hosting, the beta AI provider and the build order)
- **Next step after approval:** a written implementation plan

## 1. Intent

### What the founder asked for
- A world-class learning platform under the PractiCode name, better than Coursera, Udemy and freeCodeCamp, and presentable anywhere in the world.
- Courses mapped to world-recognised curricula, taught in a rigorous, evidence-based way.
- UI/UX first: the landing page and the learner dashboard.
- A public GitHub repository with complete documentation.

### Decisions made (2 October 2026)
| Question | Decision |
|---|---|
| Business model | **Freemium subscription** ([ADR 0003](../architecture/adr/0003-freemium-business-model.md)) |
| Repository | **Public on GitHub** |
| Tracks at launch | **All four Academy tracks shown as live**: Front-End Web Development, Data Analysis, UI/UX Product Design, AI & Machine Learning |
| Audience | **Africa-first, global-ready**: local currency, low data and offline are built in |

### Decisions made (3 October 2026)
| Question | Decision |
|---|---|
| Visual direction | **Prism**, with the Atlas Night logo lockup (icon plus Poppins wordmark) in the navbar and footer ([design system](../design/design-system.md)) |
| Headline message | **Learn the skills employers are hiring for.** Low data and offline are features we explain further down, not the opening line |
| AI | **An AI tutor** in lessons and projects (hints first, daily caps) and **a site assistant** on the website ([ADR 0006](../architecture/adr/0006-ai-tutor-and-site-assistant.md)) |
| Landing page | PRIMM is explained in plain words (Guess, Try, Make); the "lesson that talks back" demo uses Data Analysis; feature cards show Machine Learning and UI/UX; the founder quote is added; the tracks heading doesn't count tracks |
| Free short courses | **Deferred.** Not designed for now |

### Decisions made (4 October 2026)
| Question | Decision |
|---|---|
| Where lessons live | **A private content repository**, one MDX file per lesson. Every merge builds and checks the lessons and publishes the packs to Supabase Storage. Free packs are public; Pro packs sit behind short-lived signed links. The app holds no lessons ([ADR 0007](../architecture/adr/0007-lessons-in-a-private-repo-as-lesson-packs.md)) |
| Lesson format | **Exact and checked automatically** ([lesson format](../curriculum/lesson-format.md)). Tested with two lessons, Front-End 1.1 and 6.4, which the founder reviewed and approved |
| Interactivity | **If an answer can be shown, the learner sees it**: Predict steps they run, live questions where every option can be tried, Explore steps and labs. Plain multiple choice is only for questions with nothing to run |
| Who writes lessons | Claude drafts from the syllabus and the Academy's material. An instructor reviews every lesson in the review preview, and a second reviewer approves the merge. Authors and reviewers sign a rights agreement assigning their work to Practicode Consult Limited. Lessons say "designed and reviewed by PractiCode instructors, drafted with AI assistance" |
| Front-End syllabus | **v0.2**: 15 modules, about 120 lessons and in-browser labs ([syllabus](../curriculum/tracks/front-end-web-development.md)). React stays a future track |
| Hosting | **Free plans for the closed beta, with no payments taken.** That means Vercel Hobby, Supabase Free and Resend's free tier for email. **Move to Vercel Pro and Supabase Pro (about US$45 a month) on the day the first payment is taken**, because Vercel Hobby is for non-commercial use only and Supabase Free has no backups. Supabase's built-in email is a test service (2 messages an hour), so sign-in email goes through Resend from the start |
| AI provider for the beta | **Groq's free tier**, which doesn't keep or train on prompts by default, behind the `tutor` interface. Move to a paid small model at launch. Avoid free tiers that may use learners' messages for training |
| Build order | **Thin slices**, starting with Module 1 playable end to end on the free plans, then a pilot with about 20 Academy students. After that, content and app features are built in parallel, with payments last (§3) |

### Assumptions (please correct)
- The product name is **PractiCode Learn** and the domain is **learn.practicode.tech** ([ADR 0001](../architecture/adr/0001-separate-product-under-practicode-brand.md)).
- The visual identity is the Prism theme: dark-first with a matching light mode, colour-coded by track, with the September 2026 PractiCode logo and Practi Yellow in the logo. The light mode follows the device setting unless the learner picks one in Settings.
- PractiCode Academy delivers the **Mentor** plan at the current fee (₦80,000 per 3-month course).
- **Career support is not offered** and must not be implied anywhere.
- The AI & ML tool list (Python, Jupyter, pandas, scikit-learn, TensorFlow) still needs confirmation.

## 2. Success criteria for v1

1. A visitor on a low-end Android phone over slow 4G can finish a full free lesson within 10 minutes of landing, before signing up.
2. All four tracks are enrollable, with Module 1 free and at least three Pro modules ready at launch (see §6, open question 1).
3. WCAG 2.2 AA passes automated checks plus a manual audit on all v1 screens.
4. Lesson packs stay within 150 KB; lesson pages within 170 KB of JavaScript.
5. A learner can subscribe in ₦, GH₵, KSh, £ or US$ with a local payment method.
6. Impact metrics (activation, Module 1 completion, learners by country) are instrumented from launch.

## 3. Scope

### In v1
| Area | Includes |
|---|---|
| Marketing | Landing page, track pages, pricing (regional), FAQ, legal pages, accessibility statement, site assistant |
| Onboarding | Try a lesson without an account; sign-up (magic link, Google, passkey); goal and experience questions; weekly-goal setting |
| Dashboard | Resume card, daily review, weekly goal, skill map (aligned to framework), current project, other tracks, plan status |
| Lesson player | All [step types](../curriculum/lesson-format.md#step-types), HTML, CSS and JS runner, hints, feedback, AI tutor panel, reduced motion, keyboard and screen-reader support |
| Projects | Project workspace with brief, editor, live preview, automatic checks and "Ask AI why" on failing checks |
| Practice | Daily review with FSRS scheduling; module mastery checks |
| Plans | Free, Pro (with a 7-day trial) and Mentor (an enquiry form handed to the Academy); regional pricing; cancel in one click |
| Platform | PWA install; offline for downloaded modules; progress sync; xAPI event log; analytics with consent |

### Not in v1
Python execution (Phase 2) · server-verified certificates and Open Badges (Phase 2) · scholarships portal (Phase 2) · translations (Phase 3) · free short courses (deferred) · schools and teams plans · cybersecurity track · native apps.

### Delivery in slices
v1 is built in slices. Each slice ends with something learners can use.

| Slice | What ships | Hosting | Exit test |
|---|---|---|---|
| 1. Module 1, end to end | Sign-in (Google and email); the Front-End track page; the lesson player with every step type built so far; the code playground and the labs Module 1 needs; progress saved to Supabase; the content pipeline from the private repository; offline caching of opened lessons | Free plans | A learner on a low-end Android phone finishes Module 1 without help |
| 2. Pilot | Modules 1 and 2 with about 20 Academy students; measure where they get stuck, completion, and tutor questions per learner | Free plans | Pilot findings written up, and the top problems fixed |
| 3. Learning loop | Dashboard, daily review (FSRS), module checks, projects with automatic checks, downloads for offline | Free plans | The five key flows pass end-to-end tests on a throttled phone profile |
| 4. Launch | Payments and Pro access, the AI tutor, the site assistant, regional pricing, legal pages, analytics with consent | Vercel Pro, Supabase Pro | The first paying learner, and the success criteria in §2 |

Content runs alongside, one module at a time, with instructor review.

## 4. Design

The UI designs are on the [design canvas](../../design/README.md).

### Information architecture
```
learn.practicode.tech
├── /                     Landing
├── /tracks/[track]       Track page (outcomes, syllabus, alignment, device notes)
├── /pricing
├── /mentor              Mentor cohorts (enquiry form)
├── /scholarships        Scholarship application
├── /about               About PractiCode Learn (linked from the footer, not the navbar)
├── /try/[lesson]         Free lesson without an account
├── /signup  /login
├── /verify-code  /check-email  /reset  /reset/new
├── /home                 Learner dashboard
├── /learn/[track]/[module]/[lesson]   Lesson player
├── /review               Daily review session
├── /projects  /projects/[id]
├── /checks/[module]      Module check and results
├── /community
├── /checkout  /checkout/transfer  /checkout/done
├── /skills               Skill map
├── /downloads            Offline packs
├── /settings             Account, plan, appearance (dark, light, match device), data, accessibility, privacy
├── /legal                Privacy, terms, accessibility statement
└── /verify/[credential]  Public credential verification (Phase 2)
```

### Screens designed in this phase
All 38 screens are in the Prism direction, in dark and light mode, each at desktop and phone width, and every link leads to a real screen. Learners choose the mode in Settings (Dark, Light or Match device). See [design/README.md](../../design/README.md).

| Area | Screens |
|---|---|
| Marketing | Landing (with site assistant), track page, pricing, Mentor cohorts, scholarship application, about, legal pages, page not found |
| Account | Sign-up, log in, 6-digit code, check your email, reset password, new password |
| Getting started | Onboarding, guest lesson, guest lesson complete, new learner dashboard |
| Learning | Dashboard, lesson steps (Predict, Investigate with AI tutor, Modify, Make, Python notebook), daily review |
| Practice | Projects list, project workspace, module check, module check results, certificate, community |
| Paying | Checkout, bank transfer and USSD, payment confirmed, payment failed |
| Settings and states | Settings, loading, offline |

## 5. Architecture

As proposed in [Architecture overview](../architecture/overview.md). Summary:

- **Units, each with one job:**
  - `web`: the Next.js app (pages and server actions)
  - `lesson-player`: renders lesson packs and has no network dependencies
  - `runner`: sandboxed code execution plus test harness, the same module the content checks use ([ADR 0007](../architecture/adr/0007-lessons-in-a-private-repo-as-lesson-packs.md))
  - `labs`: the interactive drawings lessons refer to by name, such as `request-journey`, `page-load` and `flex-axes`
  - `review-scheduler`: an FSRS wrapper, written as pure functions
  - `progress-sync`: IndexedDB queue plus idempotent replay
  - `billing`: payment provider adapters behind one interface
  - `content-build`: MDX to validated lesson packs
  - `tutor`: the AI tutor and site assistant, with grounding, the hints-first policy and quotas ([ADR 0006](../architecture/adr/0006-ai-tutor-and-site-assistant.md))
- **Data flow, lesson pack:** the app looks the lesson up in the catalogue, downloads its pack from Supabase Storage (a Pro pack through a short-lived signed link), and the service worker keeps it for offline use.
- **Data flow, lesson step:** the player renders a step from the pack; the learner acts; the player evaluates it locally (or `runner` does, for code); an xAPI event goes onto the `progress-sync` queue; the queue syncs to Postgres when online; mastery and review cards update server-side.
- **Error handling:**
  - Lesson packs are cached, so a network failure never interrupts a lesson.
  - Sync retries with backoff, and its status shows quietly in the interface.
  - Payment webhooks are idempotent.
  - Runner errors show as learner-friendly messages with the raw error available.
- **Testing:**
  - Unit tests for the scheduler, mastery calculation and pricing.
  - Contract tests for lesson pack schemas.
  - Playwright end-to-end tests for the five key flows on a throttled mobile profile.
  - axe and Lighthouse budgets in CI.

## 6. Open questions

1. **What does "live" mean for each track at launch?** Writing all 49 modules to world-class quality before launch is a large content effort. *Recommendation:* launch with Front-End complete, or at least Modules 1–6. Other tracks open as each track's Module 1 is written and reviewed, with the remaining modules released on a published schedule shown on each track page. This changes the 2 October decision that all four tracks are shown as live at launch, so it needs the founder's decision.
2. **Pricing.** The proposed regional prices need a willingness-to-pay survey ([business model](../product/business-model.md)).
3. **Licensing.** Confirm AGPL-3.0 for code and CC BY-SA 4.0 for syllabi *before the first public push* ([ADR 0004](../architecture/adr/0004-open-syllabus-proprietary-lessons.md)).
4. **Rights agreement.** Authors are decided (see 4 October decisions). The agreement that instructors and reviewers sign, assigning their contributions to Practicode Consult Limited, still needs writing, ideally with a lawyer's review.
5. **GitHub location.** Personal account or a `practicode` organisation? An organisation is better for a product with a team. **This blocks slice 1**, because it decides where the app and content repositories are created.
6. **Founder credit.** The names and roles to show in the README and on the About page.
7. **AI tutor caps.** Are 5 a day on Free and 50 on Pro right? Confirm after measuring beta usage ([business model](../product/business-model.md)).
8. **SQL in Data Analysis.** SQL is one of the skills most often asked for in data analyst job adverts, but the current syllabus follows the Academy's Excel and Power BI course. Should we add a SQL module?
9. **Accounts.** The founder creates the Vercel, Supabase, Resend and Groq accounts under the company's details before slice 1 deploys. Only the founder can do this.
10. **Pilot cohort.** Which group of about 20 Academy students takes the slice 2 pilot, and when?

## 7. Risks

| Risk | Mitigation |
|---|---|
| Content production is slower than planned | Make one track excellent first; reusable diagram components; publish release schedules honestly |
| Power BI is Windows-only | Say so up front; offer concept simulators and Power BI service options |
| Freemium is weaker for grants | Scholarships, sponsor-a-learner, public impact metrics |
| "PractiCode" trademark conflict abroad | Run the WIPO, UKIPO and USPTO searches before going global; brand config makes a rename cheap |
| The AI tutor gives wrong or too-complete answers | Ground it in lesson content, show a source under every answer, hints first, a per-track evaluation set in CI, and switch it off during assessments |
| AI costs grow faster than revenue | Daily caps, a small default model with prompt caching, and a cost-per-learner guardrail |
| Lessons drafted with AI contain mistakes | Automated checks run every example and task; an instructor reviews every lesson; a second reviewer approves each merge; the pilot shows where learners still struggle |
| The beta outgrows the free plans | The free plans carry a closed beta of a few hundred learners. Vercel Hobby stops when its limits are hit and can't take payments, so the move to paid plans is planned for the first payment, not left for an outage |
| Instructor review becomes the bottleneck | About 30–60 minutes per lesson. Agree a weekly review rhythm with the Academy, and add reviewers before content speeds up |
| Credibility damaged by the existing site | Remove placeholder partner logos and any unverifiable testimonials from practicode.tech before pitching |
