# Design system: Prism

**Prism** is the chosen visual direction for PractiCode Learn (decided 3 October 2026). It is dark-first and colour-coded by track. It keeps the PractiCode logo and Practi Yellow, and it was picked over Atlas Night because it looks like nobody else and feels inviting to beginners. The tokens are in [brand.config.json](../../brand/brand.config.json) under `theme`. They will be exported to CSS custom properties and Tailwind theme values. You can see every screen on the [design canvas](../../design/README.md).

## Principles

1. **Colour means track.** Blue is Web, green is Data, pink is Design and violet is AI.
   - Inside the product, colour is never decorative. A Front-End certificate, lesson or project is blue, not a rainbow.
   - Marketing pages may show all four colours together as the brand palette, as in the hero word pills and the stat cards.
   - A single track colour never appears on something that isn't about that track.
2. **A calm ground lets colour do the work.** Surfaces are near-black, and colour appears where it carries meaning.
3. **One white primary action per view.** The main button is white with dark text.
4. **Yellow belongs to the logo.** Practi Yellow appears in the logo icon. It is used for buttons only through the `ctaColor` option, and then always flat.
5. **AI has its own look.** The AI tutor uses the brand gradient. The site assistant uses the blue-to-violet version, which the founder chose in the canvas. Neither ever reads as a fifth track.

## Colour

### Ground, surfaces and text

| Token | Value | Use |
|---|---|---|
| `bg` | `#07060D` | Page background |
| `surface` | `linear-gradient(180deg, #13101F, #0B0A14)` | Cards and panels |
| `surface-sunken` | `#0E0C1A` | Code blocks, inputs, inset panels |
| `surface-row` | `#0F0D1B` | List rows, FAQ items |
| `line` | `#2A2540` | Card and input borders |
| `line-subtle` | `#1C1930` / `#221E36` | Section dividers, inner dividers |
| `line-control` | `#332E4D` | Outline buttons |
| `text` | `#FFFFFF` | Headings, primary text |
| `text-soft` | `#DCD9EA` | Body text on cards |
| `text-muted` | `#A9A6BC` | Secondary text (8:1 or better on `bg`) |
| `text-subtle` | `#8B88A0` | Meta, captions, fine print (5.9:1 on `bg`) |

### Track colours

Each track has three values. The **fill** sits behind white text. The **tint** is used for text and icons on dark. The **base** is used for glows, bars and dots.

| Track | Fill | Tint | Base |
|---|---|---|---|
| Front-End Web Development | `#3D5AF5` | `#8EA2FF` | `#4D6BFF` |
| Data Analysis | `#0A7D5C` (gradients) or `#2FE6B0` with `#04241A` text | `#4BE3A8` | `#2FE6B0` |
| UI/UX Product Design | `#D9306F` | `#FF7DB0` | `#F0407F` |
| AI & Machine Learning | `#6E4CF5` | `#B9A2FF` | `#7B5CFF` |

**Adding a track:** pick a hue at least 40° away from the existing four, plus a fill that reaches 4.5:1 with white text and a tint that reaches 7:1 on `bg`. Marketing copy never counts tracks or colours ("Available tracks", not "four tracks, four colours"), so adding one is a data change, not a redesign.

### Brand gradient

`linear-gradient(120deg, #3D5AF5, #6E4CF5 50%, #D9306F)`

The gradient appears in a few places:
- the AI tutor (avatar, panel border). The site assistant uses the blue-to-violet part only: `linear-gradient(120deg, #3D5AF5, #6E4CF5 50%)`
- the Pro plan border
- the announcement bar and the score ring

It never stands in for a single track.

### Semantic colours

| Token | Value | Use |
|---|---|---|
| `success` | `#4BE3A8` text, `#2FE6B0` fill with `#04241A` text | Correct answers, passed checks, "Passed" badges |
| `error` | `#FF9AA2` text and outlines | Wrong answers, failing checks |
| `badge` | `#FF8A3D` fill with `#1F0E00` text | Short labels such as "7 days free" and "Best value". Not a track colour. |

Every state pairs colour with an icon and a word (✓ Passed, ✕ Needs a fix). Colour is never the only signal (WCAG 1.4.1).

### Practi Yellow

- It appears in the logo icon on every screen.
- It is not used for text, thin lines or glows.
- With `ctaColor` set to "Practi Yellow", primary buttons become `#FED606` with black text. They stay flat, with no shadow and no glow.

## Typography

| Role | Family | Weights |
|---|---|---|
| Headings and big numbers | **Bricolage Grotesque** | 700–800, tracking −0.02 to −0.04 em |
| Body, labels, buttons | **Poppins** | 400–600 |
| Code | **JetBrains Mono** | 400–600 |
| Wordmark | **Poppins**: "Practi" Regular, "Code" Bold, " Learn" Regular, white | — |

All three are free on Google Fonts under the OFL. The brand's Poppins-only rule still covers the logo and wordmark. Bricolage Grotesque is a product-level choice for headings, made with Prism.

| Style | Desktop | Phone |
|---|---|---|
| Hero | 78 / 90 | 44 / 54 |
| Section heading | 52–56 / 56–60 | 34 / 40 |
| Page title (app) | 40–46 / 44–50 | 30–34 / 36–40 |
| Card title | 18–24 | 18–21 |
| Body | 16–17 / 26–28 | 15–16 |
| Small | 13–14 / 20–22 | 13 |
| Caption | 11–12 | 11–12 |

- **Case:** Title Case for buttons, navigation and labels. Sentence case for headings and sentences. No all-caps except acronyms and literal code (`AVERAGE`, `MEDIAN`).
- Lesson text has a maximum line length of 68 characters.
- Long quotes and headings use `text-wrap: balance`, so a line never ends with one orphaned word.

## Spacing

All spacing comes from one scale on an 8-point grid, with 4 and 12 for tight spots:

**4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 56 · 64 · 80 · 96 · 112**

Micro values are the only exceptions: 1–2 px for hairlines, and 6 px between pips. A script in the design tooling snaps every padding, margin and gap in the artboards to this scale, so stray values like 14, 18, 22 or 28 px can't creep back in.

| Where | Desktop | Phone (under 600 px) |
|---|---|---|
| Page gutters | 24 | 16 |
| Between marketing sections, content to content | 112 | 64 |
| Hero padding | 64 top, 96 bottom (56 when a section follows straight after) | 40 top, 64 bottom |
| Section heading to its content | 48 | 32 |
| Eyebrow to heading, heading to intro | 12, 16 | 12, 16 |
| Text and visual side by side | 64 apart | stacked, 32 apart |
| Card grids | 24 | 16 |
| Card padding: standard, large | 24, 32 | 20, 24 |
| Inside a card: tight, default, between groups | 8, 16, 24 | same |
| App pages with a sidebar: main padding, between cards | 32, 24 | 24 top and 16 sides, 16 |
| Flow pages (sign-up, checkout, results): top, bottom | 48, 80 | 32, 48 |
| Forms: label to field, field to field | 8, 20 | same |
| Button groups, chip groups | 12, 8 | same |

**How section rhythm works**
- Plain sections carry half the rhythm on each side: 56 px, or 32 px on phones. Two neighbours always add up to 112 px (64 px on phones).
- The first section after the hero gets the full amount on top. The last section gets it at the bottom.
- A full-width band with its own background adds 56 px of margin outside and 112 px of padding inside, so its edges keep the same rhythm.

## Layout

- Maximum widths:
  - 1240 px for marketing pages
  - 1100–1200 px for app and flow pages
  - 488 px for sign-in cards
  - 1440 px for the lesson player with the tutor open
- Breakpoints use **container queries**. Marketing pages use 1239, 959 and 599 px. App pages use 1023 and 640 px.
- App pages share one sidebar (neutral icons, with the active item in white) and, on phones, one bottom tab bar.

## Shape and depth

| Element | Radius |
|---|---|
| Buttons, chips, segmented controls | Pill (999 px) |
| Inputs | 14 px |
| Small cards, list rows | 16–22 px |
| Cards, panels | 24–30 px |
| Bands and the final call to action | 36–40 px |

- Depth comes from borders and surface gradients.
- **Aurora glows** are radial gradients of the track colours at 16–34% opacity. They sit only behind hero areas and feature cards.
- The chat launcher and the chat panel are the only elements with drop shadows.

## Components

| Component | Notes |
|---|---|
| **Primary button** | White pill, `#07060D` text, 42–56 px tall. One per view. |
| **Secondary button** | Transparent pill with a `line-control` border. |
| **Track card** | Track fill gradient fading into `bg`, an illustration, a level and module count, the standard it is aligned to, and a white "Start Free" button with track-coloured text. |
| **Choice option** | Full-width (at least 48 px tall) with a letter key. Selected: the track tint border. After checking: success or error border plus a written explanation. |
| **Code block** | JetBrains Mono, line numbers in `#5E5A75`. **Put `white-space: pre` on each line, never on the container.** On the container, the gaps between lines render as blank lines. |
| **Check row** | Passed: a track-fill tile with a white tick. Failing: an `error` outline with a cross, "Needs a fix", the file and line, and **Ask AI why**. |
| **AI tutor panel** | Brand-gradient border. It shows the questions left today (pips), the conversation with a "Based on: …" source under each answer, suggested questions, an input, and a line saying it can make mistakes. It docks as a third column on wide screens and drops below the lesson on narrower ones. |
| **Site assistant** | A blue-to-violet "Ask us anything" pill, bottom right. It becomes a round icon under 600 px. It opens a 384 px panel on desktop and a bottom sheet on phones, with a white logo circle in the header and suggested questions and an email hand-off. |
| **Toggle** | On: white track, dark knob. Off: `#26213B` track, grey knob. `role="switch"`. |
| **Radio card** | Ring and dot plus a border change. Used for billing period, payment method and tutor mode. |
| **Score ring** | Brand gradient arc on a `line-subtle` track, with the percentage in Bricolage Grotesque. |
| **Step bar** | Segmented, one segment per step, with the current step named in text ("Step 4 of 9 · Investigate"). |

## The AI tutor: UX rules

1. **Hints before answers.** The first reply points at the idea or the line that matters. The full answer comes only after the learner has had a go and asks again.
2. **Grounded and cited.** Answers use the current lesson and the learner's code. Each one shows where it came from.
3. **Limits are visible.** The panel shows how many questions are left today. Free accounts get 5 a day and Pro gets 50 (a proposal; see [business model](../product/business-model.md)).
4. **Off during assessments.** Module checks and certificate projects say so up front.
5. **Honest.** It is labelled as AI, never a person, says it can make mistakes, and offers an email hand-off.

See [ADR 0006](../architecture/adr/0006-ai-tutor-and-site-assistant.md).

## Motion

| Use | Spec |
|---|---|
| Hero floaters | 7–9 s float, 14 px travel |
| Tool marquee | 40 s linear loop |
| Hover and press | 120 ms ease-out |
| Panels | 200 ms `cubic-bezier(0.2, 0, 0, 1)` |

- Lesson diagrams are learner-advanced and never autoplay.
- `prefers-reduced-motion: reduce` turns all animation off.

## Data visualisation

- Series use track colours, so time spent on Web is blue and Data is green.
- In lessons, the point being taught gets the strongest colour. For example, an outlier bar is solid green and the normal days are 42% green.
- Reference lines (average, median) use dashed orange and solid white, and are named in a legend that shows their values.
- Every chart has a text alternative that lists the values.

## Contrast rules

- Body text uses `#A9A6BC` or lighter on `bg` (8:1 or better). Small print uses `#8B88A0` (5.9:1).
- Track tints used as text reach 7:1 or better on `bg`.
- Track fills behind white text reach 4.5:1 or better.
- Aqua and green fills always carry dark text (`#04241A`).
