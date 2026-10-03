# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project will use [Semantic Versioning](https://semver.org/) once the application ships.

## [Unreleased]

### Added

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
- The sidebar uses neutral icons, with the active item in white. Lesson step bars, demo boxes, certificate projects and track page details use only the track's colour.
- Shortlisted to three directions: Atlas Night, Spectrum and Prism. Current, Adire, Simple and the first lesson player were set aside and remain in git history.
- Removed shadows and glows from yellow buttons.
- Replaced "Made by PractiCode Academy, Ibadan" style badges with neutral copy.
- Long phone landing pages now show in two canvas frames, because canvas frames max out at 8,000 px.

### Fixed

- Code blocks no longer render blank lines between lines.
- Phone frames are sized to their measured heights. The track page phone frame was cutting off about 900 px.
