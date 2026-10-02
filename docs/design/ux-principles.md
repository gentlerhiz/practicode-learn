# UX principles and accessibility

## Ten principles

1. **One clear next step.** Every screen has one primary action. The dashboard's job is to get you back into a lesson within one tap.
2. **Resume exactly.** Learners resume at the exact *step*, not just the lesson, on any device. Sessions are short and interrupted, and the product is built for that.
3. **Respect data.** Show lesson sizes. Never autoplay anything heavy. Load images only when they teach. Offer "download on Wi-Fi only".
4. **Offline is normal.** Downloaded modules behave exactly like online ones. Progress syncs quietly when the connection returns, and conflicts resolve in the learner's favour.
5. **Progress means skill.** Show skills mastered against a public framework, not minutes watched or percentages of videos viewed.
6. **Feedback in under 100 ms.** Every tap, prediction and test run responds immediately.
7. **Kind motivation.** Weekly goals with rest days. Celebrate mastery. No guilt, no fake urgency, no dark patterns.
8. **Honest upgrades.** Paywalls sit only *between* modules, never in the middle of a lesson. Learners always know what is free before they start.
9. **Local by default, global by design.** Local currency, local examples and region-neutral language. Ready for right-to-left layouts and translation.
10. **Accessible is the baseline.** If a feature can't be made accessible, it doesn't ship.

## Key flows

| Flow | Success criterion |
|---|---|
| **First visit → first lesson** | A new visitor can finish a full lesson within 10 minutes, on a low-end phone over slow 4G, without creating an account first. An account is offered afterwards to save progress. |
| **Daily return** | From opening the app to the first interaction takes 2 taps or fewer |
| **Free → Pro** | The upgrade is offered at the end of Module 1, with a clear comparison and a 7-day trial with no card required |
| **Offline** | A module downloads in one tap and works with no connection, including code exercises |
| **Cancel** | One click from settings. No retention maze. |

## Accessibility

**Target: WCAG 2.2 Level AA** (W3C Recommendation, October 2023) across the whole product, including lessons, code exercises and diagrams.

### Requirements

| Area | Requirement |
|---|---|
| Contrast | Text 4.5:1 (3:1 for 24 px and larger); UI components and meaningful graphics 3:1. See the [colour rules](design-system.md#the-yellow-rules). |
| Keyboard | Everything operable by keyboard, with visible focus and logical order. Drag-and-drop steps (Parsons, order, match) have keyboard alternatives (WCAG 2.5.7 Dragging Movements). |
| Target size | At least 24 × 24 px (WCAG 2.5.8). Our standard is 44 × 44 px. |
| Focus not obscured | Sticky headers and bottom bars never cover the focused element (WCAG 2.4.11) |
| Screen readers | Semantic HTML first, ARIA only when needed. Lesson feedback is announced via `aria-live`. Diagrams have text descriptions for every state. |
| Code editor | Screen-reader-compatible editor (CodeMirror 6, which has an accessibility mode); test results announced as text |
| Motion | `prefers-reduced-motion` honoured; no flashing content |
| Zoom and reflow | Works at 320 px width and 400% zoom without horizontal scrolling (WCAG 1.4.10) |
| Language | Plain English, reading age about 12–14 for interface copy; a glossary for technical terms |
| Authentication | No cognitive tests at login: passkeys, magic links or password managers supported (WCAG 3.3.8) |
| Consistent help | The Help link sits in the same place on every page (WCAG 3.2.6) |

### How we verify

1. **Automated:** axe-core in CI on every page and lesson template, blocking on violations.
2. **Manual:** a keyboard-only pass and a screen-reader pass (NVDA with Firefox, VoiceOver with Safari, TalkBack with Chrome on Android) per release.
3. **People:** usability sessions that include disabled learners, paid for their time.
4. **Public accessibility statement** at launch, with a contact route for barriers.

## Performance as UX

| Metric | Target (75th percentile, mobile) |
|---|---|
| Largest Contentful Paint | < 2.5 s |
| Interaction to Next Paint | < 200 ms |
| Cumulative Layout Shift | < 0.1 |
| JavaScript on lesson pages | ≤ 170 KB compressed |
| Lesson pack | ≤ 150 KB compressed |

These are checked in CI with Lighthouse budgets, and in production with real-user monitoring segmented by country and connection type.
