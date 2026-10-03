# UI designs

High-fidelity, interactive designs for PractiCode Learn v1, in the **Prism** direction (chosen 3 October 2026). They follow the [UX principles](../docs/design/ux-principles.md) and the [design system](../docs/design/design-system.md), including its spacing standard and its light mode.

**Live canvas:** https://claude.ai/artifact/7JGtvdSBs74EVYrGr1ZijS
*(Private until it is shared from the canvas's Share menu.)*

## Prism: 38 screens, in dark and light, each at desktop (1440 px) and phone (390 px) width

| Canvas page | What's on it |
|---|---|
| **1 · Prism (dark)** | Every screen in dark mode. The canvas opens here. |
| **2 · Prism (light)** | The same screens in light mode, laid out in the same places. |
| 3 · Atlas Night, 4 · Spectrum | Earlier directions, kept for reference |

Both Prism pages are laid out in labelled rows:

| Row | Screens |
|---|---|
| **Landing, dashboards** | Landing page (two desktop parts, three phone parts), the open site assistant on a phone, the learner dashboard, the dashboard for a brand-new learner |
| **Core learning** | Track page, onboarding, daily review, certificate |
| **A lesson, in order** | Predict, Investigate (AI tutor open), Modify, Make, the Python notebook version of Modify (AI & ML), then the guest lesson and its finish screen |
| **Account** | Sign-up, log in, 6-digit code, check your email, reset password, new password |
| **Practice and projects** | Projects list, project workspace, module check, module check results, community |
| **Plans and payments** | Pricing, checkout, bank transfer and USSD, payment confirmed, payment failed, scholarship application, Mentor cohorts |
| **Settings, states, legal** | Settings, loading skeleton, offline, page not found (404), privacy, terms and accessibility |
| **About, and menus on phones** | The About page (its phone version is in two parts, because canvas frames stop at 8,000 px), then the guest menu and the learner menu open on a phone |

## Clicking through

Every link and button goes to a real screen. Light screens link to light screens, and dark to dark. The theme switch (navbar for guests, sidebar for learners, and both phone menus) jumps to the same page in the other mode.

| Journey | Path |
|---|---|
| New learner | Landing → *Start Free* → Onboarding → Sign-up → Check your email (or the 6-digit code for phone) → New learner dashboard → first lesson |
| Guest | Landing → *Start one* → Try a lesson → Lesson complete → Sign-up |
| A lesson | Predict → Investigate (with AI tutor) → Modify → Make → Daily review |
| Returning learner | Log in → Dashboard → *Jump Back In*, *Open Project*, *Take the Check*, *Choose a Plan*, Settings |
| Projects and checks | Projects → Project workspace (*Ask AI why* on a failing check) · Module check → Results |
| Paying | Pricing → Checkout → card → Payment confirmed, or bank transfer / USSD → "checking" → Payment received |
| Switching theme | The sun or moon button in the navbar · *Light mode* or *Dark mode* under Settings in the sidebar · the same row in either phone menu · Settings → Learning → Appearance |
| Finding out who we are | Any footer → *About* |
| Help | Site assistant on the landing page · Community · Scholarship · Mentor enquiry · Legal pages |

Three screens are states rather than destinations, so nothing links to them: loading, payment failed and 404. Payment failed does link onward, to another card, bank transfer or USSD.

## What changed in this round (3 October 2026)

**About page and navigation**
- **About page:** a new page linked from every footer (not the navbar). Its sections are the mission, the story from the Ibadan classroom, how we teach, how it's built for real phones and budgets, our commitments, leadership (Idris Akande Rasaq, founder), and two ways in: *Learn with us* and *Work with us* for employers, schools and funders. Every claim comes from the curriculum, privacy and pricing docs.
- **Guest menu on phones:** marketing pages now have a menu button. Its sheet holds Tracks, How It Works, AI Tutor, Pricing, Mentors, the theme switch and Log In.
- **Learner menu on phones:** app pages now have a menu button in the top bar. Its sheet holds every sidebar item, including My Tracks, Certificates and Community, which phones couldn't reach before. The bottom tab bar stays.
- **Theme switch:** guests switch from the navbar, learners from the sidebar, and anyone from the phone menus.


**Light mode**
- Every screen now has a light version, on its own canvas page.
- It follows the [light mode rules](../docs/design/design-system.md#light-mode):
  - soft white surfaces and near-black primary buttons
  - track cards that stay vivid
  - deeper track colours for text
  - tinted selected states
  - the black logo icon
- Settings has a new **Appearance** choice: Dark, Light or Match device.

**Landing page**
- The track cards keep their illustrations on phones, next to the *Start Free* button.
- In "Small numbers. Big difference.", the 150 KB card is replaced by **80% to pass every module**. It says that each module ends with a check and a project briefed like a real job, so the certificate means something. The section's subtitle no longer talks about networks.

**Lessons**
- On phones, each lesson step keeps the controls next to what they change:
  - Investigate puts the code and live preview straight under the value buttons.
  - Make puts the editor before the tests.
  - The Python notebook comes before the question.
- On the canvas, the lesson steps now sit together in one row, in lesson order.

## Checks run before publishing
- Structure check on all 166 Prism frames (tags balanced, every `{{value}}` provided).
- Link check: every link points to an existing screen and every in-page anchor exists.
- Spacing check: no padding, margin or gap off the scale.
- Every frame's height was measured in a browser at 1440 px and 390 px. Light and dark heights match exactly.
- Contrast check on every light screen at both widths. No text falls below 3:1 except gradient headline text, which the checker can't measure, and mock-ups of a learner's own website.
- Interaction test: every handler in every frame is clicked twice and the screen re-rendered, and every click binding resolves to a real function. No button is left without an action. The one exception is "Submit Project", which stays disabled, with a note, while project checks are failing.
- Layout sweep at 1440 px and 390 px: no text runs off the screen or is clipped. The only exception is the tools strip under the hero, which scrolls by design and stops for reduced motion.
- Visual review of every screen in both modes, including the interactive states.

## Next steps
1. Usability test with 5 learners on low-end Android phones (lesson steps, AI tutor, checkout), in both modes, including outdoors in daylight.
2. Founder review of the [v1 spec](../docs/specs/2026-10-02-v1-platform-design.md), then the implementation plan.
3. Replace the interim logo with the official logo pack.

## Source

[canvas/](canvas/) holds the design source: `.dc.html` artboards and `canvas.json`. Dark files are named `Prism…`, light files `PrismLight…`. They render inside the design canvas runtime, not as standalone pages, and will be rebuilt as React components during implementation, with light and dark as two token sets.

## Earlier rounds

- **Spacing round:** one 8-point spacing scale and one section rhythm across every screen, and 24 new screens for 37 in total. The founder's own canvas edits were kept: the landing order, the removed hero pills, AI pill, checklist and lesson-loop section, the trimmed track hero, and the site assistant's colours.
- Current (Paper & Ink), Adire, Simple and the first lesson player were set aside on 2 October 2026 and are kept in git history at commit `a220965`.
- Atlas Night and Spectrum stay on the canvas for reference.
