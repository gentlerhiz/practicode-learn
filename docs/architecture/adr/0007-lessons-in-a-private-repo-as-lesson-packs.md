# 0007. Lessons live in a private repository and ship as validated lesson packs

- Status: Proposed
- Date: 2026-10-04

## Context

- **The lessons are the product people pay for.** The app code and the syllabi are public ([ADR 0004](0004-open-syllabus-proprietary-lessons.md)), so the lessons need a home that isn't.
- **The library is large to write but small to store.** The Front-End track alone is about 120 lessons, and every lesson pack is capped at 150 KB compressed ([lesson format](../../curriculum/lesson-format.md)). The whole catalogue of four tracks fits in well under 100 MB.
- **Drafts are written quickly, with AI assistance, so quality needs gates.** A broken code example or a task that is already solved must not reach a learner.
- **Lessons must work offline**, and a fix to a lesson should reach learners without redeploying the app.
- **Pro lessons shouldn't be freely downloadable** by anyone who finds the URL.

## Decision

1. **One private repository for lessons** (`practicode-learn-content`): one MDX file per lesson, following the lesson format.
2. **A build step validates every lesson** and compiles it into a lesson pack (JSON) per lesson version. It fails if a lesson breaks a rule in the lesson format's automated checks: structure, hints, feedback, word limits, outcomes, the size budget, and code. For code, it runs every coding task's model solution and starter code in a real browser at phone and laptop widths. Model solutions are written to a separate file and never ship to learners.
3. **Publishing is automatic on merge.** A GitHub Action in the content repository builds the packs and uploads them to Supabase Storage:
   - free lesson packs to a public bucket
   - Pro lesson packs to a private bucket, served through short-lived signed links after the app checks the learner's plan
   - tests for certificate-bearing assessments to a bucket only the server can read

   It also writes the catalogue (tracks, modules, lessons, versions, free or Pro) to Postgres. The Supabase service key is a secret in the content repository only.
4. **The app holds no lessons.** It reads the catalogue and downloads packs at runtime, and its service worker keeps them for offline use. A merged fix reaches learners in minutes. The public repository keeps a few sample packs, so anyone can run the app without the content.
5. **One sandbox runtime.** The code that builds a learner's preview document and runs the tests is a single module, used by the automated checks and by the lesson player. A test that passes in the checks passes for learners.
6. **Review before merge.** Each build produces a review preview that plays the lessons as learners see them, with a reviewer mode for answers and notes per step. An instructor reviews every lesson, and a second reviewer approves the pull request. Lessons drafted with AI assistance say so: "designed and reviewed by PractiCode instructors, drafted with AI assistance".

## Consequences

- **Easier:** content ships without app releases, with full version history and reviewable diffs. The public repository never contains paid content. Broken examples and already-solved tasks are caught before review.
- **Harder:** two repositories have to agree on the pack format. Packs carry a `schema` number, and the player must accept the current and the previous schema during a change.
- **Costs:** Supabase Storage downloads count towards the plan's egress allowance. At about 150 KB per lesson this is small, but it is measured.
- **Limits:** a paying learner can copy a lesson they have downloaded, as with any web content. The signed links stop casual access and mass downloading.
- **To do:** the build and preview tools live in the content repository for now. They move into the public repository as the `content-build` unit when the app is scaffolded, and the content repository's Action then runs them at a pinned version.
