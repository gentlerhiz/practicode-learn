# Innovation log

Dated entries for what is new in PractiCode Learn: what it is, why it matters, and where to see it. Newest first.

## 5 October 2026 · Lessons that work offline

Once a learner has opened a lesson, it reloads and plays with no connection, including the code runner, so code steps still run. Progress is queued on the device and sent when the connection comes back. Pages that aren't saved show a plain offline page that lists the lessons that are. Sign-in and signed-in pages are never stored on the device.

**Why it matters:** many of our learners are on prepaid mobile data and patchy networks.

See [`public/sw.js`](../../public/sw.js), [`public/offline.html`](../../public/offline.html), [`src/lib/progress/queue.ts`](../../src/lib/progress/queue.ts) and [`tests/e2e/offline.spec.ts`](../../tests/e2e/offline.spec.ts).

## 5 October 2026 · A library of interactive labs

Concepts that are hard to picture are taught with interactive drawings built into the player:

- a request travelling between a phone and a server
- a page loading file by file on a fast or a slow connection
- the two axes of a flex layout
- the parts of a web address
- an HTTP request and its response

Each lab has an accessible name, a text description of every state, keyboard controls and a reduced-motion version. A lesson can only name a lab that exists: the build refuses others.

See [`src/components/lesson/labs/`](../../src/components/lesson/labs/) and [`src/lib/lessons/labs.ts`](../../src/lib/lessons/labs.ts).

## 5 October 2026 · Progress writes that keep the impact figures trustworthy

Learner progress can only be written through one database function, `record_progress()`. It:

- checks the lesson, the version and the time of every event
- caps the time a lesson can add
- ignores repeated events, so retries from a weak connection are safe

Direct writes are refused by row-level security. A learner counts as registered only once they confirm their email, so the figures never include people who never finished signing up.

See [`supabase/migrations/20261004120100_progress_functions.sql`](../../supabase/migrations/20261004120100_progress_functions.sql), [`20261005130000_profiles_on_confirmation.sql`](../../supabase/migrations/20261005130000_profiles_on_confirmation.sql), the [definitions in code](../product/impact-metrics.md#definitions-in-code) and the database tests in [`tests/db/`](../../tests/db/).

## 5 October 2026 · One isolated code runner, shared by the checks and the player

Learner code runs in a sandboxed frame with an opaque origin, so it can't reach the learner's session, storage or the page around it. The same document builder runs every lesson's model solution and starter code in a real browser before publishing, so a test that passes in the checks passes for learners.

Tests are compiled into the page as functions rather than evaluated, so they work under a strict Content Security Policy. Code that never finishes gets a friendly message after 4 seconds.

See [`src/lib/runner/build-document.ts`](../../src/lib/runner/build-document.ts), [`public/runner.html`](../../public/runner.html), [`src/components/lesson/preview-frame.tsx`](../../src/components/lesson/preview-frame.tsx) and [`tools/content-build/check-code.ts`](../../tools/content-build/check-code.ts).

## 4 October 2026 · Live questions

In a "live" question, every answer is a piece of code the learner can try in a live preview before choosing. Learners see the effect of each option rather than guessing from text. This came from the founder's review of the first lessons, which asked for doing over choosing.

See [`docs/curriculum/lesson-format.md`](../curriculum/lesson-format.md#components) and [`src/components/lesson/steps/choice.tsx`](../../src/components/lesson/steps/choice.tsx).

## 4 October 2026 · A lesson format with automated teaching checks

Lessons follow the PRIMM sequence: predict, run, investigate, modify, make. They are written in MDX and compiled into validated lesson packs. The build refuses a lesson unless:

- at least two-thirds of its steps are interactive
- every interactive step has three escalating hints
- every answer, right or wrong, explains itself
- every learning outcome is assessed
- the pack is within its data budget

Every code step's model solution must pass its tests, and its starter code must fail one, in a real browser at phone and laptop widths.

See [`docs/curriculum/lesson-format.md`](../curriculum/lesson-format.md), [`tools/content-build/build.ts`](../../tools/content-build/build.ts) and [`docs/curriculum/pedagogy.md`](../curriculum/pedagogy.md).
