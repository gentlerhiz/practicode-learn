# Lesson format

*Licensed under CC BY-SA 4.0.*

This document specifies what a lesson *is*: its structure, its step types, how it is authored and how much it may weigh. The lesson player in the app implements this spec.

## Hierarchy

```
Track            Front-End Web Development
└── Module       6. Flexbox                                        (ends with a mastery check and a project)
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

| Type | Component | Description | Interaction |
|---|---|---|---|
| `explain` | `<Explain>` | Short text, at most 80 words, with optional code | Read, then Continue |
| `diagram` | `<Diagram>` | A lab drawing that advances one state at a time, with a title and text for every state | Next and Previous, or the arrow keys |
| `predict` | `<Predict>` | A scenario or code, plus a multiple-choice prediction. With `run`, the learner then runs the code and compares | Choose, Check, then Run It. Being wrong is fine: the answer is revealed |
| `question` | `<Question>` | Single choice with feedback for every option. With `live`, every option is a piece of code the learner can try in a live preview before choosing | Choose (and see it live), then Check, until correct |
| `explore` | `<Explore>` | A control with a set of values, driving live code or a lab, then a question | Try the values, then answer |
| `order` | `<Order>` | Put items in sequence | Move buttons (keyboard and touch), then Check |
| `code` | `<Code>` | An editor with starter files and tests, for the Modify and Make stages | Edit, Run, Run Tests |
| `recap` | `<Recap>` | Two to four key points, plus review cards for daily review | Continue |
| `parsons`, `match`, `reflect` | Planned | Rearrange code lines, pair items, free-text reflection | Not built yet |

Every interactive step has a **keyboard path**, a **screen-reader label**, **feedback for every option**, and **three escalating hints**: a nudge, then the concept, then a worked example that isn't the answer.

Each step names its stage with `stage`: `hook`, `predict`, `run`, `investigate`, `modify`, `make`, or `apply` (for lessons without code). The player shows it as "Step 4 of 9 · Investigate".

## Authoring format

Lessons are authored in **MDX** (Markdown with components) in a private content repository, one file per lesson at `tracks/<track>/<NN-module>/<NN-lesson>.mdx`. A build step validates each file and compiles it into a versioned **lesson pack** (JSON) that the app downloads. The build, the code checks and the review preview live in this repository, in `tools/content-build`, and the content repository runs them from here, so the checks, the app and the format can never drift apart.

**Frontmatter.** `id`, `title`, `track`, `module`, `lesson`, `minutes` (5 to 20), `free`, `version` and `outcomes` are required. `description` is required too: 120 to 160 characters, used for search results and share cards. Put it in quotes if it contains a colon. A lesson's **slug**, used in its web address, is its file name without the number prefix: `01-what-happens-when-you-open-a-website.mdx` becomes `what-happens-when-you-open-a-website`.

````mdx
---
id: fe-06-04
title: Aligning items with Flexbox
description: "Line up the items in a flex row with align-items and align-self, trying stretch, start, centre and end live on a real navigation bar."
track: front-end-web-development
module: 6
lesson: 4
minutes: 12
free: false
version: 1
outcomes: [fe.layout.flex-axis, fe.layout.flex-align]
prerequisites: [fe-06-03]
---

<Predict stage="predict" run assesses="fe.layout.flex-align">

These four boxes sit in a flex row that is 96px tall. None of them has a height set. What will they look like?

```css title="styles.css"
.nav { display: flex; height: 96px; }
```

<Option id="a" feedback="That's what `align-items: flex-start` does.">Each box is only as tall as its text</Option>
<Option id="b" correct feedback="Right. The default value of `align-items` is `stretch`.">Every box stretches to the full height</Option>

<Hint>None of the boxes has a height. So what decides how tall they are?</Hint>
<Hint>Flex items fill the space across the row unless you tell them otherwise.</Hint>
<Hint>Example: in a flex row 100px tall, a box with no height set becomes 100px tall.</Hint>

<Reveal>
Surprised? Most people are.
</Reveal>

</Predict>
````

### Components

| Component | Attributes | Children |
|---|---|---|
| `<Explain>` | `stage` | Markdown, optional code blocks |
| `<Predict>`, `<Question>` | `stage`, `assesses`, `run` (Predict) or `live` | Prompt, optional code blocks (with `{{value}}` for `live`), `<Option>`s, three `<Hint>`s, optional `<Reveal>` |
| `<Explore>` | `stage`, `assesses`, `control`, `values` (comma-separated), optional `lab` | Prompt, code blocks containing `{{value}}` (or a `lab`), `<Ask>`, `<Option>`s, three `<Hint>`s, optional `<Reveal>` |
| `<Diagram>` | `stage`, `lab` | Prompt, two or more `<State title="…">` |
| `<Order>` | `stage`, `assesses`, `wrong` (feedback) | Prompt, three or more `<Item>`s in the correct order (the player shuffles them), three `<Hint>`s |
| `<Code>` | `stage` (`modify` or `make`), `assesses` | Prompt, starter code blocks, one or more `<Test name="…">` with a JavaScript block, three `<Hint>`s, a `<Solution>` |
| `<Recap>` | — | A bullet list of 2–4 key points, one or more `<Card front="…" back="…" />` |
| `<Option>` | `id`, `feedback`, `correct`, `value` (the code tried in a `live` step) | The option text |

- **Code blocks** need a file name, as in ` ```css title="styles.css" `. Add `readonly` for files the learner can't edit.
- **Tests** run inside the learner's sandboxed preview. They can use `$`, `$$`, `css(selector, property)`, `box(selector)`, `textBox(selector)` (the box around the text itself), `near(a, b, tolerance)` and `assert(condition, message)`. The message is what the learner sees, so it says what to fix. Prefer tests that check the result on the page over tests that look for one particular line of code, so any correct solution passes.
- **Prefer doing to choosing.** Where an answer can be shown, let the learner see it: `run` a prediction, `live` a question, or use `<Explore>`. Plain multiple choice is for questions with nothing to run.
- **Solutions** never ship to learners. They are kept for the automated checks and for reviewers.
- **Labs** are interactive drawings built into the player: `request-journey`, `flex-axes` and `url-anatomy` (diagrams), and `page-load` and `http-exchange` (explorations). The list lives in `src/lib/lessons/labs.ts`; a lesson that names any other lab fails the build.
- **MDX rules for authors:** put tags such as `<h1>`, and anything with curly braces, inside backticks. A bare `<` or `{` in prose is read as a component or an expression. Attributes are plain quoted strings; expressions and imports are rejected.

### Automated checks

The build fails, and the lesson can't be published, unless:

- the frontmatter is valid and complete, the id matches the module, lesson and file location, and the description is 120 to 160 characters
- Explain steps are 80 words or fewer
- at least two-thirds of the steps are interactive
- every interactive step has exactly three hints, and every option has feedback
- every choice step has a correct option, and option ids are unique
- every outcome in the frontmatter is assessed by at least one step
- in a real browser at phone and laptop widths, every model solution passes its tests and the starter code fails at least one
- every runnable example renders without errors
- the pack is within the 150 KB budget
- the pack matches the app's own schema (`src/lib/lessons/schema.ts`), which rejects any field the format doesn't define

### Lesson pack

The app receives one JSON file per lesson version:

```ts
type LessonPack = {
  schema: 1; id: string; slug: string; description: string; version: number; title: string; track: string;
  module: number; lesson: number; minutes: number; free: boolean;
  outcomes: string[]; prerequisites: string[];
  steps: Step[];             // HTML already rendered from Markdown at build time
};
type Step = { type: string; stage: string; assesses?: string[]; body?: string } & (
  | { type: 'explain' }
  | { type: 'predict' | 'question'; files?: File[]; run?: true; live?: true; options: Option[]; hints: string[]; reveal?: string }
  | { type: 'explore'; control: string; values: string[]; lab?: string; files?: File[]; ask: string; options: Option[]; hints: string[]; reveal?: string }
  | { type: 'diagram'; lab: string; states: { title: string; html: string }[] }
  | { type: 'order'; items: string[]; wrong: string; hints: string[] }
  | { type: 'code'; files: File[]; tests: { name: string; code: string }[]; hints: string[] }
  | { type: 'recap'; points: string[]; cards: { front: string; back: string }[] }
);
type File = { name: string; lang: string; code: string; readonly?: true };
type Option = { id: string; html: string; correct: boolean; feedback: string; value?: string };
```

Practice tests ship inside the pack, so a curious learner can read them. That's acceptable for practice. Tests for certificate-bearing assessments never ship, and run on the server.

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

The build checks the structural rules (see [Automated checks](#automated-checks)). A reviewer checks the rest in the review preview, which plays the lesson the way learners will see it and collects notes per step:

- [ ] The content is accurate, including tool screens and version-specific details
- [ ] Each wrong-answer feedback names the real misconception behind that answer
- [ ] Examples and projects make sense to our learners
- [ ] Hints escalate from a nudge to the concept to a worked example, without giving the answer away
- [ ] Every diagram has a text alternative and works with reduced motion
- [ ] It works at 320 px width and at 200% zoom
- [ ] A second author (an instructor) has reviewed it
