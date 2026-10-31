# Project format

*Licensed under CC BY-SA 4.0.*

Each module ends with a **project**: a piece of work briefed like a real job for a real client, built in the project workspace, checked automatically and kept in the learner's portfolio. This document specifies what a project is and how it's authored. The workspace in the app implements it.

## What makes a good project

- **A client and a reason.** “Mama Nkechi's customers keep calling to ask about prices” beats “make a menu page”.
- **Room for choices.** Checks test behaviour (“every field has a label”), never one exact solution, so two learners' projects can look different.
- **Only what the module taught**, plus what earlier modules taught.
- **About 60 to 120 minutes** of work.

## Checks

Every project has three kinds of check, and all of them run in the learner's browser, like lesson tests, so they cost nothing to run:

| Kind | Where it comes from | How it runs |
|---|---|---|
| **Works** | The project's own `<Check>`s | In the learner's page, at laptop width |
| **Accessible** | Built in: no serious or critical problems found by axe-core | At laptop width |
| **Fits every screen** | Built in: no sideways scrolling | At 320, 768 and 1280 px |

A project whose files are Python or SQL is a **program**, not a page: it has no page for the accessibility and screen-size checks, so it gets one built-in check instead, **Runs without errors**, and its checks run once, at laptop width. Its brief's checks read what it printed (`logs`, `python()`) or the tables it produced (`allResults()`, `lastResult()`). A project for a course without code can still be a page: a readonly page that draws what the learner writes in a text file, read with `pclFile(name)`, as Introduction to Cybersecurity's risk map does.

A learner can submit once every check passes and they've answered the self-review questions. The database (`pass_project`) also requires the module's lessons to be complete, and, for projects that must be live on the web, the address. The checks run in the browser, so this is practice, not an exam: the results are taken as sent. Passed projects count toward the certificate.

## Authoring format

Projects are MDX files in the private content repository, one per module, at `projects/<track>/<NN>-<slug>.mdx`, where `NN` is the module number. The id is the track's prefix, `p` and the module number: `fe-p02`.

````mdx
---
id: fe-p02
title: A menu page for a local restaurant
description: "60 to 200 characters, for the projects list."
track: front-end-web-development
module: 2
client: Mama Nkechi’s Kitchen
minutes: 90
free: false          # true only for Module 1, which is free
needsSite: false     # true when the project must be live on the web before it passes
version: 1
---

<Brief>
Markdown: who the client is, what they need and why.
</Brief>

<Must>
- A bullet list of what the brief asks for
</Must>

<Nice>
- Optional: a bullet list of extras
</Nice>

```html title="index.html"
the starter file; add readonly for files the learner can't edit
```

<Check name="Every field has a label">
```js
assert(…, 'What to fix, in words the learner can act on.')
```
</Check>

<Review>
- Questions the learner answers about their own work before submitting
</Review>

<Solution>
```html title="index.html"
a model solution, which never ships to learners
```
</Solution>
````

`<Check>`s use the same helpers as lesson tests (`$`, `$$`, `css`, `box`, `assert`, `file` and the rest; see the [lesson format](lesson-format.md)), and every message says what to fix. Prose goes inside `<Brief>`: only code blocks and the elements above sit at the top level.

## Automated checks

`npm run build:projects` in the content repository fails, and the project can't be published, unless the frontmatter is complete, the id matches the file, and the pack matches the app's schema (`src/lib/projects/schema.ts`). `npm run check:projects` then runs every project in a real browser: the model solution must pass every check, including accessibility and all three screen sizes, and the starter must fail at least one of the project's own checks.

## Publishing

`tools/content-build/publish.ts --projects <dir> --projects-catalogue <file>` uploads changed project packs to the lesson buckets under `projects/` (free projects to `lessons-free`, the rest to `lessons-pro`, readable only by Pro members) and writes the `projects` table.
