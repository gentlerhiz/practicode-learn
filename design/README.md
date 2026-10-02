# UI designs

High-fidelity, interactive designs for PractiCode Learn v1, in the **Prism** direction (chosen 3 October 2026). They follow the [UX principles](../docs/design/ux-principles.md) and the [design system](../docs/design/design-system.md).

**Live canvas:** https://claude.ai/artifact/7JGtvdSBs74EVYrGr1ZijS
*(Private until it is shared from the canvas's Share menu.)*

## Prism: 13 screens

Page 1 of the canvas. Every screen is shown at desktop (1440 px) and phone (390 px) width.

| Row | Screen | What it shows |
|---|---|---|
| 1 | **Landing page** | The hero with the AI tutor pill, the Data Analysis "lesson that talks back", the evidence, the founder quote, how a lesson works, the AI tutor, available tracks, the features, the comparison table, the Mentor plan, pricing and the FAQ |
| 1 | **Site assistant** | The floating "Ask us anything" button on the landing page. Click it to open the chat on desktop. A separate phone frame shows the open chat sheet |
| 1 | **Learner dashboard** | Resume card, weekly goal, review, the current project (3 of 5 checks), the path through the track, and "Ask AI" |
| 2 | **Track page** | Front-End Web Development: outcomes, the syllabus, standards, projects and a certificate preview |
| 2 | **Onboarding** | "What do you want to learn first?" The selected track's colour carries through the page |
| 2 | **Lesson player with AI tutor** | The Investigate step, with the AI tutor docked beside it: questions left today, answers with sources, suggested questions |
| 2 | **Daily review** | Five flashcards with FSRS ratings, tagged by track |
| 2 | **Certificate** | The public credential page, all in the track's colour |
| 3 | **Sign-up** | Email or phone number, a password strength meter, an opt-in progress email, and the plan carried over from onboarding |
| 3 | **Checkout** | Pro with a 7-day free trial: yearly or monthly, card, bank transfer or USSD, nothing due today, and a reminder promise |
| 3 | **Project workspace** | Brief, automatic checks (3 of 5 passing), "Ask AI why" on a failing check, the editor with the problem line highlighted, and a live preview that marks the overflow |
| 3 | **Module check** | A code-reading question with a "How sure are you?" rating. The AI tutor is off during checks |
| 3 | **Module check results** | 83%, passed, a skill-by-skill breakdown, the two questions worth another look (added to tomorrow's review), and calibration |
| 3 | **Settings** | Profile, learning, AI tutor mode, data saver and offline downloads, plan and billing, privacy and data rights |

### The prototype flow
Landing → *Start Free* → Onboarding → *Continue* → Sign-up → *Create My Account* → Dashboard → *Jump Back In* → Lesson (with AI tutor) → *Continue* → Daily review.

From the dashboard:
- *Open Project* leads to the project workspace.
- *Choose a Plan* leads to checkout.
- The avatar or *Me* leads to Settings.
- *Certificates* leads to the certificate.

From the module check, *Finish Check* leads to the results, and from there to the project and Module 7.

### What changed in this round (3 October 2026)
1. The navbar and footer use the Atlas Night lockup: the yellow icon plus the Poppins wordmark.
2. The hero copy now leads with "Learn the skills employers are hiring for" instead of no-video and low-data claims.
3. The lesson player has an AI tutor panel with a daily limit (5 on Free, 50 on Pro).
4. The hero pill now reads "A personal AI tutor, built into every lesson".
5. The landing page has a site assistant: a floating button that opens a chat with suggested questions.
6. "A lesson that talks back" now uses Data Analysis. It's an Excel `AVERAGE` vs `MEDIAN` question with a chart that shows why.
7. In "Everything you need to actually finish", the projects card now shows Machine Learning (a spam filter) and the skill map shows UI/UX.
8. The founder quote section is added: "In our classroom in Ibadan…"
9. The PRIMM section is now "Every lesson works the same simple way": Guess, Try, Make.
10. The tracks heading is now "Available tracks · Pick a track. Switch anytime.", so adding a track needs no copy change.
11. Colour now means track everywhere. The certificate skill tiles, track page outcome ticks and dashboard project card use the track's colour.
12. Six new screens: sign-up, checkout, project workspace, module check, module check results and settings.
13. Fixes:
    - Code blocks no longer show blank lines between lines.
    - Phone frames were resized to their measured heights. The track page phone frame had been cutting off about 900 px.

Free short courses were deferred at the founder's request.

## Canvas layout
- **Page 1, Prism (chosen):**
  - Row 1: landing (two desktop frames, three phone frames and the open chat) and the dashboard.
  - Row 2: track page, onboarding, lesson, review and certificate.
  - Row 3: sign-up, checkout, project, module check, results and settings.
- **Page 2, Atlas Night** and **page 3, Spectrum** are kept for reference.
- Canvas frames max out at 8,000 px, so the long landing page is split into parts. Open a desktop frame in full view to scroll the whole page.
- The **Tweaks** panel has a `ctaColor` option (White or Practi Yellow) on most screens, plus `assistant` (Closed or Open) and `currency` on the landing page.

## Next steps
1. Usability test with 5 learners on low-end Android phones (the lesson player, AI tutor and checkout).
2. Founder review of the [v1 spec](../docs/specs/2026-10-02-v1-platform-design.md), then the implementation plan.
3. Replace the interim logo with the official logo pack.

## Source

[canvas/](canvas/) holds the design source: `.dc.html` artboards and `canvas.json`. They render inside the design canvas runtime, not as standalone pages, and will be rebuilt as React components during implementation.

## Earlier explorations

- Current (Paper & Ink), Adire, Simple and the first lesson player were set aside on 2 October 2026 and are kept in git history at commit `a220965`.
- Atlas Night and Spectrum stay on the canvas for reference.
