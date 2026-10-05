# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project will use [Semantic Versioning](https://semver.org/) once the application ships.

## [Unreleased]

### Added

- **Milestone 1, the public site** (Next.js 16, TypeScript 7, Tailwind CSS 4):
  - landing page, built from the Prism canvas, with a lesson demo that works without JavaScript
  - Front-End Web Development track page: all 15 modules and 119 lessons, kept identical to the published syllabus by tests
  - About page with the founder's leadership section, plus privacy, terms and accessibility pages (a working draft for legal review) and 404 and error pages
  - search and sharing: titles, descriptions, canonical URLs, structured data (organisation, website, course, breadcrumbs, FAQ), sitemap, robots, llms.txt, web app manifest, favicon and app icons, share images, and share buttons
  - security: HSTS and the standard headers, a Content Security Policy with per-request nonces on signed-in routes, ADR 0008 and a threat model
  - light, dark and Match device themes with no flash on first load
  - reusable UI components on the Prism design tokens
  - unit tests (Vitest) and end-to-end tests at phone and desktop sizes, with automated accessibility checks in both themes (Playwright and axe)
  - cookieless visit and speed analytics on Vercel
- A "Beta · Module 1 opens soon" notice, while lessons are not yet open
- Repository foundation: README, licensing (AGPL-3.0 code, CC BY-SA 4.0 syllabi), contributing guide, Code of Conduct and security policy
- Brand configuration and interim logo files
- Product vision, personas, business model and impact metrics
- Competitive analysis of ten learning platforms, plus a UI research tools review
- Curriculum standards framework, teaching model and lesson format specification
- Syllabi for Front-End Web Development, Data Analysis, UI/UX Product Design, and AI & Machine Learning
- Design system and UX principles
- Proposed architecture and ADRs 0001–0005
- Privacy and data protection overview
- Draft v1 platform specification
- UI designs for the landing page, learner dashboard and lesson player
- Four further visual directions (Atlas Night, Adire, Spectrum, Simple), plus more human-sounding copy
- Prism: a new direction merging Atlas Night and Spectrum
- Five more screens for each of Atlas Night and Prism: track page, onboarding, lesson player, daily review and certificate, all linked into a clickable flow
- Six new Prism screens: sign-up, checkout, project workspace, module check, module check results and settings
- AI tutor panel in the lesson player, "Ask AI why" on failing project checks, and a site assistant on the landing page
- ADR 0006: an AI tutor in lessons and an AI assistant on the website
- AI tutor limits and cost guardrails in the business model, plus AI sections in the architecture and privacy docs
- Founder quote section on the landing page
- 24 more Prism screens, for 37 in total:
  - account: log in, 6-digit code, check your email, reset password, new password
  - lesson steps: guest lesson, guest lesson complete, Predict, Modify, Make, Python notebook
  - payments: pricing page, bank transfer and USSD, payment confirmed, payment failed
  - states: new learner dashboard, loading, offline, page not found
  - other pages: projects list, legal pages, scholarship application, Mentor cohorts, community
- A spacing standard (8-point scale, one section rhythm, standard card, grid and form spacing), documented in the design system and applied to every artboard
- Prism light mode for all 37 screens, at desktop and phone width, on its own canvas page. Its tokens and rules are in the design system and brand config.
- An Appearance setting (Dark, Light or Match device) in Settings
- An About page (mission, story, how we teach, access, commitments, leadership, and ways to learn or work with us), linked from every footer
- Menus on phones: a guest menu on marketing pages and a learner menu on app pages
- A light/dark switch in the navbar for guests, under Settings in the sidebar for learners, and in both phone menus

### Changed

- Chose **Prism** as the visual direction. The design system and brand config now describe the Prism theme.
- The landing page now leads with "Learn the skills employers are hiring for". It uses the Atlas Night logo lockup, explains lessons as Guess, Try, Make, uses Data Analysis in the lesson demo, shows Machine Learning and UI/UX in the feature cards, and uses an "Available tracks" heading.
- Colour now means track everywhere, including certificate skill tiles, track outcome ticks and the dashboard project card.
- Onboarding now leads to sign-up, and the dashboard links to the project workspace, checkout and settings.
- Every link in the prototype now leads to a real screen. There are no placeholder links left.
- The landing page follows the founder's canvas edits: tracks come straight after the hero, and the lesson-loop section, hero pills, AI pill and hero checklist are removed. The site assistant has no pink and a white logo circle.
- Checkout now reads "Keep Pro after your trial", in line with the no-card trial. The trial end date is 8 October everywhere.
- The landing page's 150 KB stat card is now "80% to pass every module", about module checks, real-job project briefs and a certificate that means something.
- Track cards on the landing page keep their illustrations on phones.
- On phones, lesson steps keep controls next to what they change: Investigate shows the code and preview under the value buttons, Make puts the editor before the tests, and the Python notebook comes before the question.
- The canvas now has "Prism (dark)" and "Prism (light)" pages, and the lesson steps sit together in one row in lesson order.
- Claims tightened across the site and docs. Device claims now say that most lessons work on a phone, while some modules need a computer (Power BI needs a Windows PC, Figma design work needs a laptop). Data claims mention the one-time Python download for AI & ML modules. The video data figure is "hundreds of MB to about 3 GB an hour". The Coursera study is quoted as the paper states it, and the AI tutor copy no longer promises "any exercise" or "the exact line".
- The sidebar uses neutral icons, with the active item in white. Lesson step bars, demo boxes, certificate projects and track page details use only the track's colour.
- Shortlisted to three directions: Atlas Night, Spectrum and Prism. Current, Adire, Simple and the first lesson player were set aside and remain in git history.
- Removed shadows and glows from yellow buttons.
- Replaced "Made by PractiCode Academy, Ibadan" style badges with neutral copy.
- Long phone landing pages now show in two canvas frames, because canvas frames max out at 8,000 px.
- The v1 spec is approved, with the founder's answers: Front-End complete first, GitHub on the founder's account, SEO, sharing, security, documentation and impact measurement as requirements.
- Implementation plan for slice 1: 21 tasks in two milestones (the public site, then the learning loop).
- The v1 spec now records the 4 October decisions:
  - where lessons live, and who writes and reviews them
  - the "show, don't just ask" rule for lessons
  - free plans for the closed beta, then paid plans from the first payment
  - the AI provider for the beta
  - delivery in four slices, from Module 1 end to end to launch
- ADR 0007: lessons live in a private repository and ship as validated lesson packs. ADR 0005 and the architecture overview point to it, and lesson packs are now stored in Supabase Storage instead of a separate CDN.
- The design canvas follows Front-End syllabus v0.2 and the real Lesson 6.4:
  - The track page lists all 15 modules, Module 1's six lessons and the new projects.
  - The dashboard path shows 15 modules.
  - Module names, counts and hours are updated on the landing, onboarding, sign-up, offline, settings, results and certificate screens.
  - The four Flexbox lesson screens now teach `align-items` and `align-self`, as the lesson does.
  - The guest lesson asks Lesson 1's real opening question.
  - The Module 6 project is now "Navigation bar and menu cards".
  - The light track page's first module number is white again, so it passes contrast.
- The lesson format is now exact, tested against the first two lessons: the components and their attributes, the test helpers, the automated checks a lesson must pass before it can be published, and the shape of the lesson pack the app downloads. Predict steps can run their code, so "run" is no longer a separate step type, and "choice" is now `question`.
- Front-End Web Development syllabus v0.2: 15 modules and about 120 lessons, with lesson titles and the in-browser labs. Git basics move to Module 3 so learners publish a live site early, and branches and pull requests come in Module 12. Layout and JavaScript each get two modules. New coverage: the terminal, DevTools, using AI assistants critically, npm, Vite, Prettier, ESLint, API key safety, SEO, custom domains and client projects.

### Fixed

- Every control in the prototype now does something:
  - Copy buttons confirm, and coupon codes get an answer.
  - Typed questions work in both chats, and count towards the tutor's daily limit.
  - The bell opens notifications, and "Continue with Google" signs you in.
  - The module check has a Question 11 to go back to.
  - Settings rows edit in place, and Match device can be chosen.
  - Cancelling the trial and deleting the account each ask you to confirm first.

- Code blocks no longer render blank lines between lines.
- Phone frames are sized to their measured heights. The track page phone frame was cutting off about 900 px.
