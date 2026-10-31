# When a module is done

*Licensed under CC BY-SA 4.0.*

A module opens to learners only when every item below is true. The lesson rules are in [lesson-format.md](lesson-format.md) and the project rules in [project-format.md](project-format.md); this list is what ties them together for one module.

## Lessons

- [ ] Every lesson in the syllabus (`docs/curriculum/tracks/<course>.md`) is written, in the order the syllabus gives.
- [ ] Each lesson ends with a recap: two to four points and at least one review card. The recap is what the module notes are made from, so it should read well on paper without the lesson around it.
- [ ] The labs the lessons use are registered (`src/lib/lessons/labs.ts`) and pass the layout sweep at every width.
- [ ] Code-like text in Match terms, Sort items and options is in backticks, so Markdown can't turn `>` into a quote or `#` into a heading.

## Project

- [ ] The module's project is written ([project-format.md](project-format.md)) and passes `npm run check:projects`.

## Checks

In the content repository:

- [ ] `npm run check`: every lesson builds, and every code step's solution passes and its starter doesn't.
- [ ] The notes render: `node ../Practicode\ Learn/tools/content-build/notes.ts --packs dist/packs --projects dist/projects --out dist/notes --only <id prefix>`. It fails on any character no brand font can draw. Look over the PDF once.

In the app:

- [ ] The track file (`src/content/tracks/<course>.ts`) no longer marks the module `soon`.
- [ ] Unit tests, typecheck and lint pass.

## Publish and play through

- [ ] The lessons are published, and a dry run of `publish.ts` then reports nothing left to publish.
- [ ] Every lesson plays from start to finish on the live site as a Pro member (`tests/manual/modules-2-3.spec.ts` with `TRACK` and `MODULES`).
- [ ] The module notes download from My Courses on the live site.

## Module notes

Each module's notes are a PDF, drawn on request from its published packs (`src/app/learn/[track]/notes/[module]/route.ts`), so they always match the lessons and need no publishing of their own. They hold, for each lesson, its recap points, the code it showed (code blocks and Run It files, up to three of 24 lines or fewer) and its review cards, then the project brief. Module 1's notes are free; the rest are part of Pro. The notes come after the lessons, never before them: the lessons teach by predicting first.
