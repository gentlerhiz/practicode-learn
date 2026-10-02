# Architecture decision records

We record significant decisions as ADRs using [Michael Nygard's format](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions): context, decision, consequences. An ADR is never edited after it is accepted. A new ADR supersedes it instead.

| # | Title | Status |
|---|---|---|
| [0001](0001-separate-product-under-practicode-brand.md) | Build PractiCode Learn as a separate product under the PractiCode brand | Accepted |
| [0002](0002-interactive-lessons-without-video.md) | Interactive lessons without video | Accepted |
| [0003](0003-freemium-business-model.md) | Freemium subscription with regional pricing | Accepted |
| [0004](0004-open-syllabus-proprietary-lessons.md) | Open syllabus, proprietary lessons | Proposed |
| [0005](0005-nextjs-supabase-stack.md) | Next.js and Supabase as the core stack | Proposed |
| [0006](0006-ai-tutor-and-site-assistant.md) | An AI tutor in lessons and an AI assistant on the website | Proposed |

## Template

```markdown
# NNNN. Title

- Status: Proposed | Accepted | Superseded by NNNN
- Date: YYYY-MM-DD

## Context
What forces are at play? What problem are we solving?

## Decision
What we will do.

## Consequences
What becomes easier, what becomes harder, and what we must now do.
```
