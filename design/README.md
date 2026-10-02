# UI designs

High-fidelity, interactive designs for PractiCode Learn v1. They follow the [design system](../docs/design/design-system.md) and the [UX principles](../docs/design/ux-principles.md).

**Live canvas:** https://claude.ai/artifact/7JGtvdSBs74EVYrGr1ZijS
*(Private until it is shared from the canvas's Share menu.)*

Every screen is drawn at **desktop (1440 px)** and **phone (390 px)** width. The layouts are fluid and adapt using container queries.

## Visual directions (pick one)

The canvas has one page per direction. Each page has a landing page and a learner dashboard. The lesson player exists only in option 1 for now, and it will be restyled to match whichever direction is chosen.

| # | Direction | Look | Type | Best at | Trade-off |
|---|---|---|---|---|---|
| 1 | **Current** | Paper, ink and Practi Yellow; flat; brand house style | Poppins | Brand consistency with the Academy; calm and credible | The least distinctive of the five |
| 2 | **Atlas Night** | Black with violet glows and an aqua accent; bento cards with mini UI; comparison table (inspired by searchatlas.com) | Poppins, tight tracking | Feels premium and "tech"; strong for investors and global audiences | Glows and gradients depart from the brand's flat style; dark pages use more battery on LCD phones |
| 3 | **Adire** | Indigo and white with patterns inspired by Yoruba adire cloth; editorial layout | Fraunces (serif) + Poppins | The most distinctive and meaningful; tells the Ibadan origin story to the world | A serif headline face is new to the brand; the patterns need careful use to stay subtle |
| 4 | **Spectrum** | White with four vivid track colours (blue, green, pink, violet) and floating cards; very little yellow | Bricolage Grotesque + Poppins | Playful, energetic and youthful; each track becomes instantly recognisable | Busiest to maintain; yellow is reduced to the logo |
| 5 | **Simple** | White, one column, big tap targets, plain words ("Make websites") | Poppins | The easiest for first-time learners; the fastest on low-end phones | Less wow on a pitch deck |

Interactive in every direction: the hero prediction (options 1–3), the currency and billing switchers in pricing (options 1–4), and links between screens. Option 2 has a **CTA colour** tweak (Practi Yellow or Atlas Aqua) in the canvas's Tweaks panel. Option 1's dashboard has a **plan** tweak (Pro trial, Free or Pro).

## Screens (option 1)

### 1. Landing page
| Section | Purpose | Design decision |
|---|---|---|
| Hero | State the promise and prove it | Headline "Learn by doing. Not by watching." beside a **playable Predict step**. Visitors try the product before reading about it (Brilliant-style). |
| Standards strip | Credibility without fake logos | Text chips naming the frameworks each track is aligned to. No partner logos we can't verify. |
| Why it's different | The three pillars | Learning (Koedinger 2015, cited), data (150 KB vs ~17 MB per minute of video), proof (frameworks plus verifiable badges) |
| Tracks | Choose a path | Four equal cards showing outcome, effort, tools and alignment. "Start Free" goes straight into a lesson. |
| Lesson loop | Explain the pedagogy | The five PRIMM steps on a solid black section |
| Mentor plan | Bridge to PractiCode Academy | Human cohort option at the real Academy fee. No career-support claims. |
| Pricing | Freemium, regional | A **live currency switcher** (₦, GH₵, KSh, £, US$) and monthly or yearly toggle. Scholarships offered right next to it. |
| FAQ | Remove doubts | Native `<details>` elements: accessible and needing no JavaScript |
| Final call to action | Convert | Full-bleed Practi Yellow, "No account needed to try it" |

### 2. Learner dashboard
| Area | Purpose |
|---|---|
| Resume card | One clear next step: exact lesson and step, time left, offline status |
| Weekly goal | Kind motivation. Days per week, and rest days never break the run. |
| Daily review | Spaced repetition: cards due and estimated time |
| Ready offline | What is on the device and how big it is |
| Current project | Automated checks as a checklist |
| Skill map | Mastery per module, **aligned to the MDN Curriculum** |
| Explore other tracks | Module 1 free in every track |
| Plan card | Freemium state. The tweak switches between *Pro trial*, *Free* and *Pro*. |

On phones the sidebar becomes a bottom tab bar, and the plan card becomes a compact banner.

### 3. Lesson player
An **Investigate** step from *Front-End Web Development, Module 6, Lesson 4*:
- Segmented step bar ("Step 4 of 9 · Investigate")
- Value buttons that move the boxes in the **live preview** and update line 3 of the code
- A check question with **specific feedback for every wrong answer**
- Escalating hints, a single yellow "Continue" button and a keyboard hint

## Prototype flow

Landing → *Start Learning Free* → Lesson → *Continue* → Dashboard → *Resume Lesson* → Lesson.

## Source

[canvas/](canvas/) contains the design source (`.dc.html` artboards and `canvas.json`). They render inside the design canvas runtime, not as standalone pages. They will be rebuilt as React components during implementation.

## Accessibility notes built into the designs

- Real `<button>`, `<a>`, `<input>` and `<label>` elements throughout, with `aria-pressed`, `aria-checked` and `aria-live` where state changes
- Text contrast of at least 4.5:1. Yellow is used only as a fill, with black text.
- Progress on light surfaces uses ink rather than yellow (WCAG 1.4.11)
- Touch targets of at least 44 px
- Colour is never the only signal: check and cross icons and words accompany the green and red states
