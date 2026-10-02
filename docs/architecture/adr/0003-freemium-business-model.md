# 0003. Freemium subscription with regional pricing

- Status: Accepted
- Date: 2026-10-02

## Context

There were three models: fully free and non-profit (the freeCodeCamp model), a hybrid of free core plus paid extras, and a freemium subscription (the Coursera Plus and Brilliant model). The founder chose **freemium**.

## Decision

- **Free:** Module 1 of every track, the daily review and the community.
- **Pro:** a subscription that unlocks every module, projects, verified certificates and offline downloads. Regional pricing in local currency; 7-day trial with no card, starting after the first completed lesson.
- **Mentor:** Pro plus a PractiCode Academy cohort.
- **Scholarships and sponsor-a-learner** keep grant funding possible.

## Consequences

- Revenue scales with learners, which suits investors.
- **Weaker for grants** than a non-profit model. We mitigate this with scholarships, sponsor-a-learner, published impact metrics, and possibly a sister foundation later.
- Paywalls only between modules, never in the middle of a lesson ([UX principles](../../design/ux-principles.md)).
- **Required:** validate prices with a willingness-to-pay survey before launch ([business model](../../product/business-model.md)).
- **Required:** the company structure (for-profit, possibly with a social mission) should follow from this decision. Get local legal advice.
