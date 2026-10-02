# Lesson format

*Licensed under CC BY-SA 4.0.*

This document specifies what a lesson *is*: its structure, its step types, how it is authored and how much it may weigh. The lesson player in the app implements this spec.

## Hierarchy

```
Track            Front-End Web Development
└── Module       6. Layout: Flexbox, Grid and responsive design   (ends with a mastery check and a project)
    └── Lesson   4. Aligning items with Flexbox                   (10–15 minutes)
        └── Step 1 of 9: Predict                                  (one screen, one idea)
```

## Anatomy of a lesson

| Part | Purpose | Typical steps |
|---|---|---|
| **Hook** | Why this matters, as a real-world problem | 1 |
| **Predict** | Activate prior knowledge and commit to a guess | 1–2 |
| **Run** | See the result and confront the misconception | 1 |
| **Investigate** | Explore the mechanism with an interactive diagram | 2–4 |
| **Modify** | Change working code or a working design | 1–2 |
| **Make** | Build something small from scratch | 1 |
| **Recap** | Two or three key points; these become review cards | 1 |

## Step types

| Type | Description | Interaction |
|---|---|---|
| `explain` | Short text, at most 80 words, with an optional static diagram | Read, then Continue |
| `diagram` | An SVG diagram that advances step by step (segmented animation) | Tap or Space to advance; scrub back |
| `predict` | Code or a scenario, plus a multiple-choice or free-text prediction | Choose, then Check |
| `run` | Runnable code with a live preview | Run; the result is compared with the prediction |
| `explore` | Interactive simulation driven by controls such as toggles or sliders | Manipulate the controls, then answer a question |
| `parsons` | Rearrange code lines into a working order | Drag, or use keyboard reordering |
| `code` | An editor with starter code and hidden tests | Edit, Run tests, Submit |
| `choice` | Single or multiple choice with elaborative feedback per option | Choose, then Check |
| `order` / `match` | Sequence or pair items | Drag, or use the keyboard |
| `reflect` | A short free-text reflection, not graded | Type, then Continue |
| `recap` | Key points; each one is flagged as a review card | Continue |

Every interactive step has: a **keyboard path**, a **screen-reader label**, **feedback for each wrong answer**, and **three escalating hints**.

## Authoring format

Lessons are authored in **MDX** (Markdown with components) in a private content repository, then compiled into versioned lesson packs.

```mdx
---
id: fe-06-04
title: Aligning items with Flexbox
track: front-end-web-development
module: 6
minutes: 12
outcomes: [fe.layout.flex-align, fe.layout.flex-axis]
prerequisites: [fe-06-03]
---

<Step type="explain">
A navigation bar has a logo on the left and links on the right. How do you push them apart?
</Step>

<Step type="predict" answer="b">
  <Code lang="css">{`.nav { display: flex; justify-content: space-between; }`}</Code>
  <Choice id="a">All items bunch up on the left</Choice>
  <Choice id="b" feedback="Yes: space goes *between* items, none at the edges.">First and last items touch the edges, with equal gaps between</Choice>
  <Choice id="c" feedback="That's space-around: equal space around each item.">Equal space around every item</Choice>
</Step>

<Step type="explore" diagram="flex-justify" controls={["justify-content"]}>
Try each value. Which one leaves no space at the edges?
</Step>
```

## Performance budget

The budget is a product requirement, and CI will fail the build when a lesson exceeds it.

| Asset | Budget (compressed) |
|---|---|
| Lesson pack (text, SVG, exercise data) | **≤ 150 KB** |
| Images (only when essential) | ≤ 40 KB each, AVIF or WebP, lazy-loaded |
| Shared player runtime (cached once) | ≤ 170 KB of JavaScript |
| Module offline pack | ≤ 2 MB |

For comparison, one minute of standard-definition streaming video is roughly 15–20 MB.

## Animation rules

- SVG with CSS or Web Animations API transitions, at 150–400 ms per transition and ease-out.
- Each animation is a list of **keyframes the learner advances**. It never autoplays and never loops.
- Respect `prefers-reduced-motion`: transitions become instant, and a step list is always available.
- Every diagram has an accessible name and a text description of each state.
- Colour is never the only signal. Use shape, label or pattern as well.

## Localisation

- All strings live in message files, not in components.
- Code samples and examples use region-neutral names, or draw on the learner's region, for example datasets from the Nigerian Bureau of Statistics or the World Bank.
- Right-to-left layouts are supported from the start (for future Arabic).

## Quality checklist (per lesson)

- [ ] At least two-thirds of steps are interactive
- [ ] Every outcome in the frontmatter is assessed
- [ ] Every wrong answer has specific feedback
- [ ] Every diagram has a text alternative and works with reduced motion
- [ ] Works at 320 px width and at 200% zoom
- [ ] The pack is within 150 KB
- [ ] Reviewed by a second author
