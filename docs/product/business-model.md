# Business model

**Decision:** freemium subscription with regional pricing ([ADR 0003](../architecture/adr/0003-freemium-business-model.md)).

## Plans

| | **Free** | **Pro** | **Mentor** |
|---|---|---|---|
| Who it's for | Trying a track, casual learners | Serious learners working towards a credential | Learners who want a teacher and a cohort |
| Lessons | Module 1 of every track | Every module of every track | Everything in Pro |
| Daily spaced review | ✓ | ✓ | ✓ |
| Community forum | ✓ | ✓ | ✓ |
| Projects with automated feedback | Module 1 project only | All projects | All projects |
| Verified certificates (Open Badges 3.0) | — | ✓ | ✓ |
| Offline module downloads | Module 1 | All modules | All modules |
| Exam-prep pathways (for example, PL-300) | — | ✓ | ✓ |
| Live classes and human reviews | — | — | ✓ weekly, 3-month cohort |
| Delivered by | PractiCode Learn | PractiCode Learn | PractiCode Academy, online or in Ibadan |

New accounts get a **7-day Pro trial** with no card required, which starts after the learner finishes their first lesson.

## Regional pricing (proposal)

Prices are set by country, adjusted for purchasing power, and shown in local currency based on where the visitor is (with a manual override).

| Region | Pro, monthly | Pro, yearly | Mentor |
|---|---|---|---|
| Nigeria | ₦6,500 | ₦59,000 | ₦80,000 per 3-month course (current Academy fee) |
| Ghana | GH₵ 85 | GH₵ 790 | Online cohort, priced separately |
| Kenya | KSh 950 | KSh 8,900 | Online cohort, priced separately |
| United Kingdom | £9 | £79 | Online cohort, priced separately |
| Rest of world | US$12 | US$99 | Online cohort, priced separately |

> **These are proposals, not decisions.** Before launch, run a Van Westendorp price-sensitivity survey with at least 100 prospective learners in Nigeria, Ghana and Kenya. Check the results against competitors: AltSchool Africa charges roughly US$20–50 a month, and Coursera, Codecademy and Brilliant offer subscriptions. Yearly plans cost about the same as 9 months of the monthly price.

## Scholarships and sponsors

Freemium and grant funding can work together:

- **Need-based scholarships** give free Pro access to learners who apply and qualify. We publish the share of learners on scholarship as an impact metric.
- **Sponsor a learner** lets companies and individuals fund Pro seats, and sponsors receive anonymised progress reports.
- **Grant-funded cohorts** let foundations fund Mentor-plan cohorts for specific groups, such as women in tech or learners in rural states.

This gives grant-makers a clear social mission to fund, while subscriptions cover running costs. If a major funder requires non-profit status, consider a sister foundation that buys Pro seats from the company for its beneficiaries.

## Unit economics, and why video-free matters here

| Cost driver | Video-first platform | PractiCode Learn |
|---|---|---|
| Content delivery | Video hosting and streaming bandwidth, the largest variable cost | Static lesson packs of about 150 KB each, served from a CDN |
| Code execution | Often server-side containers | In the learner's browser at no marginal cost; server checks only for certificates |
| Content production | Filming, editing, re-shooting when tools change | Text, code and SVG under version control, updated with a pull request |

The cost of serving one more learner is close to zero. That keeps the Free tier sustainable and scholarships affordable.

## Future revenue (not in v1)

- **Schools and teams:** licences for universities, SIWES programmes and employers, with cohort analytics.
- **Exam vouchers:** partnerships with certification bodies.
- **Content licensing:** licensing lesson content to other institutions.

## Guardrails

- No dark patterns: cancellation is one click, no auto-renewal surprises, and trial reminders 2 days before billing.
- No fake discounts or countdown timers.
- Everything a learner earned while subscribed, including progress and certificates, is theirs to keep.
