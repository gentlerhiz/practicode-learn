# UI designs

High-fidelity, interactive designs for PractiCode Learn v1, in the **Prism** direction (chosen 3 October 2026). They follow the [UX principles](../docs/design/ux-principles.md) and the [design system](../docs/design/design-system.md), including its spacing standard.

**Live canvas:** https://claude.ai/artifact/7JGtvdSBs74EVYrGr1ZijS
*(Private until it is shared from the canvas's Share menu.)*

## Prism: 37 screens, each at desktop (1440 px) and phone (390 px) width

Page 1 of the canvas is laid out in labelled rows.

| Row | Screens |
|---|---|
| **Landing, dashboards** | Landing page (two desktop parts, three phone parts), the open site assistant on a phone, the learner dashboard, the dashboard for a brand-new learner |
| **Core learning** | Track page, onboarding, lesson player (Investigate step with the AI tutor), daily review, certificate |
| **Account** | Sign-up, log in, 6-digit code, check your email, reset password, new password |
| **Lesson steps** | Guest "try a lesson", guest lesson complete with sign-up nudge, Predict, Modify, Make, Python notebook (AI & ML) |
| **Practice and projects** | Projects list, project workspace, module check, module check results, community |
| **Plans and payments** | Pricing, checkout, bank transfer and USSD, payment confirmed, payment failed, scholarship application, Mentor cohorts |
| **Settings, states, legal** | Settings, loading skeleton, offline, page not found (404), privacy, terms and accessibility |

Atlas Night (page 2) and Spectrum (page 3) are kept for reference.

## Clicking through

Every link and button goes to a real screen. There are no placeholder links.

| Journey | Path |
|---|---|
| New learner | Landing → *Start Free* → Onboarding → Sign-up → Check your email (or the 6-digit code for phone) → New learner dashboard → first lesson |
| Guest | Landing → *Start one* → Try a lesson → Lesson complete → Sign-up |
| A lesson | Predict → Investigate (with AI tutor) → Modify → Make → Daily review |
| Returning learner | Log in → Dashboard → *Jump Back In*, *Open Project*, *Take the Check*, *Choose a Plan*, Settings |
| Projects and checks | Projects → Project workspace (*Ask AI why* on a failing check) · Module check → Results |
| Paying | Pricing → Checkout → card → Payment confirmed, or bank transfer / USSD → "checking" → Payment received |
| Help | Site assistant on the landing page · Community · Scholarship · Mentor enquiry · Legal pages |

Three screens are states rather than destinations, so nothing links to them: loading, payment failed and 404. Payment failed does link onward, to another card, bank transfer or USSD.

## What changed in this round (3 October 2026)

**Spacing, made standard everywhere**
- One spacing scale on an 8-point grid (4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 112). Every padding, margin and gap in every Prism artboard was snapped to it.
- One section rhythm: 112 px between marketing sections on desktop, 64 px on phones. The landing page had places where two sections added up to 224 px. Those are fixed.
- Standard card padding (24, or 32 for large cards; 20 and 24 on phones), 24 px card grids (16 on phones), 48 px from a section heading to its content (32 on phones), and 20 px between form fields.
- The full table is in the [design system](../docs/design/design-system.md#spacing).

**New screens:** log in, 6-digit code, check your email, reset and new password; pricing page, bank transfer and USSD, payment confirmed, payment failed; guest lesson and guest lesson complete; Predict, Modify, Make and Python notebook steps; new learner dashboard, loading, offline and 404; projects list; legal pages, scholarship application, Mentor cohorts and community.

**Your canvas edits, kept**
- Landing order: hero, tools, tracks, stats, "Everything you need", "A lesson that talks back", AI tutor, quote, comparison, mentor, pricing, FAQ.
- Removed: the hero's floating pills, the AI pill, the hero checklist, and the "Every lesson works the same simple way" section.
- Track page: removed the "Beginner" pill and the two badges on the hero mock-up.
- Site assistant: no pink in the button or chat header, a white logo circle, and plain sparkle icons.
- The canvas editor had pinned fixed heights on some landing sections and nested them inside each other, which breaks the phone layout. The order and removals were re-applied to clean markup instead.

**Also fixed**
- Colour now means track in the product: lesson step bars, demo boxes, certificate projects, track page chips and project cards are Front-End blue. Sidebar icons are neutral, with the active item in white. Review rating buttons use meaning colours (red Again, orange Hard, white Good, green Easy).
- The trial story is consistent: the trial ends on 8 October, checkout says "Keep Pro after your trial", and nothing is due today.
- Code blocks scroll sideways on phones instead of being cut off.

## Checks run before publishing
- Structure check on all 78 frames (tags balanced, every `{{value}}` provided).
- Link check: every link points to an existing screen and every in-page anchor exists.
- Spacing check: no padding, margin or gap off the scale.
- Every frame's height was measured in a browser at 1440 px and 390 px, so nothing is cut off.
- Visual review of every screen at both widths.

## Next steps
1. Usability test with 5 learners on low-end Android phones (lesson steps, AI tutor, checkout).
2. Founder review of the [v1 spec](../docs/specs/2026-10-02-v1-platform-design.md), then the implementation plan.
3. Replace the interim logo with the official logo pack.

## Source

[canvas/](canvas/) holds the design source: `.dc.html` artboards and `canvas.json`. They render inside the design canvas runtime, not as standalone pages, and will be rebuilt as React components during implementation.

## Earlier explorations

- Current (Paper & Ink), Adire, Simple and the first lesson player were set aside on 2 October 2026 and are kept in git history at commit `a220965`.
- Atlas Night and Spectrum stay on the canvas for reference.
