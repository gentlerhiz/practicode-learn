# Choice-position audit

**Date:** 15 November 2026  
**Source audited:** Published Supabase lesson catalogue and lesson packs  
**Scope:** Every published lesson for every live course

## Summary

The complete audit covered 322 published lessons and 1,284 choice steps. The correct answer is not Option A in every step, but the published content is strongly biased towards Option A overall and in every audited course.

| Course | Lessons | Choice steps | A | B | C | D |
|---|---:|---:|---:|---:|---:|---:|
| IT Fundamentals | 85 | 308 | 203 (65.9%) | 99 (32.1%) | 6 (1.9%) | 0 |
| Front-End Web Development | 119 | 536 | 414 (77.2%) | 75 (14.0%) | 33 (6.2%) | 14 (2.6%) |
| Back-End Web Development | 29 | 104 | 98 (94.2%) | 6 (5.8%) | 0 | 0 |
| Introduction to Cybersecurity | 13 | 59 | 35 (59.3%) | 21 (35.6%) | 3 (5.1%) | 0 |
| Python Programming | 12 | 50 | 38 (76.0%) | 12 (24.0%) | 0 | 0 |
| SQL and Databases | 64 | 227 | 164 (72.2%) | 63 (27.8%) | 0 | 0 |
| **Total** | **322** | **1,284** | **952 (74.1%)** | **276 (21.5%)** | **42 (3.3%)** | **14 (1.1%)** |

The private content repository was not required for this audit. The configured Supabase project contained the published lesson catalogue and the lesson packs in Supabase Storage.

## Method

The audit:

1. Read live courses from the Supabase `tracks` table.
2. Read every published lesson from the Supabase `lessons` table.
3. Downloaded each lesson pack from its published Supabase Storage path.
4. Inspected every `predict`, `question` and `explore` step.
5. Recorded the position of the option whose `correct` value was `true`.

Positions are shown as the learner sees them: `A`, `B`, `C` or `D`.

## Results

The complete lesson-level audit is represented by the counts above. The strongest bias is in Back-End Web Development, where 94.2% of correct options are A. The lowest is Introduction to Cybersecurity, but A still accounts for 59.3% of its choice steps.

## Interpretation

This is a content-order bias, not evidence that the answer-checking logic is marking wrong answers as correct. The packs contain valid correct options, but many correct options occupy the first position.

The current lesson path is:

1. Authoring MDX in the private content repository.
2. Compiling MDX into JSON lesson packs.
3. Publishing the packs to Supabase Storage.
4. Loading the published packs through the Supabase catalogue.
5. Rendering options in the order stored in each pack.

The database does not store individual answer rows. Options are nested inside each versioned lesson-pack JSON file, so this is not currently a database-query ordering issue.

## Current code decision

Runtime/build randomisation has been rolled back as requested. Options currently remain in the order stored in the published packs.

The content compiler now retains a validation rule requiring exactly one correct option per choice step. This protects correctness data but does not address positional bias.

## Recommended actions

1. Decide whether answer order should be:
   - random per learner attempt;
   - random per lesson load;
   - shuffled once during content publishing.
2. If randomisation is approved, implement it in the shared lesson-loading/player path so it applies consistently to all courses.
3. Preserve option IDs, feedback and live-preview values when moving options.
4. Add tests for `predict`, `question` and `explore` steps.
5. Re-run this complete audit after implementation and monitor new published packs for positional bias.
6. Republish packs only if the chosen solution is build-time or the source content itself is reordered.

No Supabase data was changed during this audit.
