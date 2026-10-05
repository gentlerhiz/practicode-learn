# Evidence

A public, dated record of what PractiCode Learn is, what is new about it and what difference it makes, for funders, partners and assessors.

## Principles

- **Record evidence as it happens.** A dated entry written at the time is worth more than a summary written later.
- **Publish only what is true and checkable.** Every claim links to the code, document or data that shows it. Estimates are labelled as estimates; anything not yet measured says so.
- **Learners' words only with consent.** Quotes appear only with written permission and the attribution the learner chose.
- **Personal documents never go here.** Identity documents, transcripts, contracts, letters and anything else personal stay in a private archive outside this repository.

## Where each piece of evidence lives

| Evidence | Where |
|---|---|
| Product vision | [`docs/product/vision.md`](../product/vision.md) |
| Problem statement and target learners | [`docs/product/vision.md`](../product/vision.md) (personas) |
| Technical architecture | [`docs/architecture/`](../architecture/overview.md) and the [decision records](../architecture/adr/README.md) |
| GitHub repository | This repository, with its commit history and [CHANGELOG](../../CHANGELOG.md) |
| Development roadmap | [`ROADMAP.md`](../../ROADMAP.md), [`docs/specs/`](../specs/), [`docs/plans/`](../plans/) |
| Innovation log | [`innovation-log.md`](innovation-log.md) |
| Product analytics and learner impact | The admin impact page (`/admin/impact`, with a CSV export); monthly snapshots summarised in [`impact-reports/`](impact-reports/README.md); definitions in [`impact-metrics.md`](../product/impact-metrics.md#definitions-in-code) |
| User feedback | [`feedback.md`](feedback.md) (pilot findings; quotes only with written consent) |
| Scholarship programme | Added when the programme starts (slice 4) |
| Partnerships | [`partnerships.md`](partnerships.md) |
| Media and recognition | [`recognition.md`](recognition.md) |
| Open source | [`open-source.md`](open-source.md) |
| Evidence archive (personal documents) | Private, outside this repository |

## How the impact figures stay honest

The figures on the admin impact page come straight from the database, with definitions published in [`impact-metrics.md`](../product/impact-metrics.md#definitions-in-code):

- **One validated route for progress.** Progress can only be written through one database function, which checks every value and caps time, so learners can't inflate their own record.
- **Confirmed learners only.** A learner counts only after confirming their email.
- **Snapshots survive deletions.** Monthly snapshots hold no personal data, so they stay accurate after learners delete their accounts.
