# PractiCode Learn v1: platform design

- **Status:** Draft, awaiting founder review
- **Date:** 2026-10-02 (updated 2026-10-03 with the visual direction and AI decisions)
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
All 37 screens are in the Prism direction, in dark and light mode, each at desktop and phone width, and every link leads to a real screen. Learners choose the mode in Settings (Dark, Light or Match device). See [design/README.md](../../design/README.md).

| Area | Screens |
|---|---|
| Marketing | Landing (with site assistant), track page, pricing, Mentor cohorts, scholarship application, legal pages, page not found |
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
  - `runner`: sandboxed code execution plus test harness
  - `review-scheduler`: an FSRS wrapper, written as pure functions
  - `progress-sync`: IndexedDB queue plus idempotent replay
  - `billing`: payment provider adapters behind one interface
  - `content-build`: MDX to validated lesson packs
  - `tutor`: the AI tutor and site assistant, with grounding, the hints-first policy and quotas ([ADR 0006](../architecture/adr/0006-ai-tutor-and-site-assistant.md))
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

1. **What does "live" mean for each track at launch?** Writing all 46 modules to world-class quality before launch is a large content effort. *Proposal:* "live" means Module 1 (free) plus Modules 2–4 (Pro) are complete, with the remaining modules released on a published monthly schedule shown on each track page.
2. **Pricing.** The proposed regional prices need a willingness-to-pay survey ([business model](../product/business-model.md)).
3. **Licensing.** Confirm AGPL-3.0 for code and CC BY-SA 4.0 for syllabi *before the first public push* ([ADR 0004](../architecture/adr/0004-open-syllabus-proprietary-lessons.md)).
4. **Content authors.** Who writes lessons for each track, and under what rights agreement?
5. **GitHub location.** Personal account or a `practicode` organisation? An organisation is better for a product with a team.
6. **Founder credit.** The names and roles to show in the README and on the About page.
7. **AI tutor caps.** Are 5 a day on Free and 50 on Pro right? Confirm after measuring beta usage ([business model](../product/business-model.md)).
8. **SQL in Data Analysis.** SQL is one of the skills most often asked for in data analyst job adverts, but the current syllabus follows the Academy's Excel and Power BI course. Should we add a SQL module?

## 7. Risks

| Risk | Mitigation |
|---|---|
| Content production is slower than planned | Make one track excellent first; reusable diagram components; publish release schedules honestly |
| Power BI is Windows-only | Say so up front; offer concept simulators and Power BI service options |
| Freemium is weaker for grants | Scholarships, sponsor-a-learner, public impact metrics |
| "PractiCode" trademark conflict abroad | Run the WIPO, UKIPO and USPTO searches before going global; brand config makes a rename cheap |
| The AI tutor gives wrong or too-complete answers | Ground it in lesson content, show a source under every answer, hints first, a per-track evaluation set in CI, and switch it off during assessments |
| AI costs grow faster than revenue | Daily caps, a small default model with prompt caching, and a cost-per-learner guardrail |
| Credibility damaged by the existing site | Remove placeholder partner logos and any unverifiable testimonials from practicode.tech before pitching |
