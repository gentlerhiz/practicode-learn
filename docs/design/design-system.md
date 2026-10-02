# Design system

The PractiCode Learn interface uses the PractiCode brand: Practi Yellow, Code Black, Paper and Poppins. It is extended into a product system that holds up on a ₦60,000 Android phone and a 5K monitor alike. Tokens live in [brand.config.json](../../brand/brand.config.json) and will be exported to CSS custom properties and Tailwind theme values.

## Colour

### Core palette

| Token | Hex | Use |
|---|---|---|
| `yellow` | `#FED606` | Primary buttons, selected states, highlights on dark. **Fill only.** |
| `black` | `#000000` | Logo, text on yellow |
| `ink` | `#111111` | Body text, icons, progress fills on light |
| `ink-muted` | `#5C5A54` | Secondary text (6.2:1 on Paper, 6.9:1 on white) |
| `paper` | `#F4F2EC` | Page background (light) |
| `white` | `#FFFFFF` | Cards and surfaces (light) |
| `line` | `#E2DFD6` | Dividers and card borders (decorative) |
| `line-strong` | `#8A877F` | Input borders and functional outlines (3.2:1 on Paper, meets WCAG 1.4.11) |
| `dark` | `#0B0B0B` | Dark screens and the code editor ground. Solid and flat. |
| `dark-surface` | `#161616` | Cards on dark |
| `dark-muted` | `#A3A39E` | Secondary text on dark (7.8:1) |

### Semantic colours

| Token | Hex | Contrast on white | Use |
|---|---|---|---|
| `success` | `#1F7A3A` | 5.4:1 | Correct answers, passing tests, "Mastered" |
| `danger` | `#B42318` | 6.6:1 | Errors, failing tests |
| `info` | `#1D4ED8` | 6.7:1 | Links in long-form text, informational notes |

Semantic states always pair colour with an **icon and a word** (✓ Correct, ✕ Not quite). Colour is never the only signal (WCAG 1.4.1).

### The yellow rules

1. **Yellow is a fill, never text.** It is never used for text or thin lines on light backgrounds (brand rule).
2. **Text on yellow is always black or ink** (14.8:1).
3. **Yellow never carries meaning alone on light backgrounds.** Against Paper it reaches only 1.3:1, which fails WCAG 1.4.11 for meaningful graphics. On light surfaces, progress bars and selected states use **ink**. On dark surfaces, yellow is excellent (13.9:1 on `#0B0B0B`).
4. Use one yellow action per view. If everything is yellow, nothing is.

## Typography

**Poppins** for everything in the interface. **JetBrains Mono** for code only; code must be monospaced, so this is the one functional exception to the brand's "Poppins only" rule. Both are free on Google Fonts under the OFL.

| Style | Size / line height | Weight | Use |
|---|---|---|---|
| Display | 56 / 64 (fluid: `clamp(36px, 5vw, 56px)`) | 700 | Landing hero |
| H1 | 40 / 48 | 700 | Page titles |
| H2 | 28 / 36 | 600 | Section titles |
| H3 | 20 / 28 | 600 | Card titles |
| Body L | 18 / 30 | 400 | Lesson text (long reading) |
| Body | 16 / 26 | 400 | Default |
| Small | 14 / 22 | 400–500 | Meta, labels |
| Caption | 12 / 18 | 500 | Badges only. Never long text. |
| Code | 14–15 / 24 | 400 | Editor and code blocks |

- **Case:** Title Case for buttons, labels and navigation. Sentence case for headings and sentences. **No all-caps** except acronyms (HTML, CSS, DAX, AI).
- Lesson text has a maximum line length of **68 characters**.
- Letter-spacing stays at normal everywhere.

## Spacing and layout

- 4 px base unit. The scale is 4, 8, 12, 16, 24, 32, 48, 64, 96 and 128.
- 12-column grid on desktop with a 24 px gutter and a 1200 px maximum content width. One column on phones with 16–20 px side margins.
- Breakpoints work at the **container** level (container queries) wherever possible, so components adapt to where they sit as well as to the screen.

## Shape and depth

| Token | Value | Use |
|---|---|---|
| `radius-s` | 8 px | Inputs, chips |
| `radius-m` | 12 px | Buttons, small cards |
| `radius-l` | 20 px | Cards, panels |
| `radius-xl` | 28 px | Hero panels, the app icon |

Depth comes from **borders and surface colour, not shadows**, in keeping with the brand's flat style. One soft shadow (`0 1px 2px rgb(0 0 0 / 6%)`) is allowed for floating menus only. There are no glows, gradients or grain.

## Iconography

[Lucide](https://lucide.dev) (ISC licence): 24 px grid, 1.75 px stroke, round caps. Icons are always paired with a visible label in navigation; icon-only buttons have an `aria-label`. Third-party tool logos (Figma, Power BI and so on) are used only from official files the brand owners supply, never redrawn.

## Motion

| Token | Duration | Easing | Use |
|---|---|---|---|
| `instant` | 0 ms | — | Reduced-motion replacement for everything |
| `quick` | 120 ms | ease-out | Hover and press feedback |
| `base` | 200 ms | `cubic-bezier(0.2, 0, 0, 1)` | Panels, accordions |
| `lesson` | 250–400 ms | `cubic-bezier(0.2, 0, 0, 1)` | Diagram keyframes in lessons |

- Animations in lessons are **learner-advanced**. They never autoplay or loop.
- `prefers-reduced-motion: reduce` makes every transition instant.
- Celebrations are small and brief: a check mark that draws in under 400 ms. No confetti storms.

## Core components

| Component | Notes |
|---|---|
| **Button** | Primary: yellow fill with black text. Secondary: ink outline. Tertiary: text with underline on hover. Minimum height 44 px; visible focus ring (2 px ink plus a 2 px white offset). |
| **Card** | White on Paper with a 1 px `line` border and `radius-l`. |
| **Progress bar** | Ink fill on a `line` track (light), or yellow fill on a `#2A2A2A` track (dark). Always paired with a text value. |
| **Skill row** | Outcome name, framework tag, and a state of *Not started*, *Practising* or *Mastered* shown with icon and text. |
| **Lesson step bar** | Segmented, one segment per step, with the current step labelled for screen readers. |
| **Code editor** | Dark ground (`#0B0B0B`), JetBrains Mono, high-contrast syntax theme (all tokens ≥ 4.5:1). |
| **Choice option** | Full-width tap target (≥ 48 px) with a letter key hint for keyboard users. |
| **Feedback banner** | Success or danger, with icon, title and explanation. Announced with `aria-live="polite"`. |
| **Data chip** | Shows the lesson size and offline status, so learners can plan their data use. |

## Themes

- **Light** (default): Paper ground with white surfaces.
- **Dark:** `#0B0B0B` ground with `#161616` surfaces, following the brand's solid-black style with no textures or particles.
- Follows the system setting, with a manual override saved per learner.

## Data visualisation

Charts in the dashboard and in Data Analysis lessons use ink, a mid grey and one yellow highlight on dark backgrounds, or ink plus `info` blue on light. Series are told apart by **lightness**, not hue alone, and every chart has a table alternative.
