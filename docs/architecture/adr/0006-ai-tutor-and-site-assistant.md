# 0006. An AI tutor in lessons and an AI assistant on the website

- Status: Proposed
- Date: 2026-10-03

## Context

Learners get stuck, and on a self-paced platform there's no teacher in the room. The founder wants AI built into the platform in two places:

- inside lessons and projects, so a learner can ask the tutor to explain an exercise, with a small number of questions a day
- on the public website, so visitors can ask about tracks, prices and how it works

AI help has real risks for a learning product:

- **It can do the thinking for the learner.** Getting answers without effort undermines the "learn by doing" model ([ADR 0002](0002-interactive-lessons-without-video.md)). Khan Academy's Khanmigo shows that a tutor that asks guiding questions avoids this.
- **It can be wrong.** A confident wrong explanation does more harm than no explanation.
- **It costs money per question.** Unlimited use would break the low cost of serving one more learner ([business model](../../product/business-model.md)).
- **It can undermine assessment.** Module checks and certificate projects must reflect the learner's own work.
- **It handles personal data.** Learner code and questions are personal data under Nigeria's Data Protection Act 2023 and the GDPR.

## Decision

### 1. AI tutor (lessons and projects)

- **Where:** an "Ask AI" panel in the lesson player and the project workspace, plus "Ask AI why" on failing project checks.
- **Grounding:** each request carries the current lesson step, the relevant parts of the lesson pack, and the learner's current code. Answers must stay within that context and name their source ("Based on: Step 4, Try each value").
- **Teaching policy: hints first.**
  - The first answer explains the idea or points to the relevant line, and asks a guiding question.
  - The full answer comes only when the learner has had a go and asks again.
  - The tutor's system prompt and automated evaluations enforce this.
- **Daily caps (proposal):** Free gets 5 questions a day and Pro gets 50. The caps reset at midnight local time. The remaining count is always visible.
- **Off during assessment:** module checks and certificate projects disable the tutor and say so up front.
- **Learner choice:** Settings offers "Hints first, then explain" (the default) or "Explain straight away" for revision.

### 2. Site assistant (public website)

- A floating "Ask us anything" button on marketing pages. It opens a panel on desktop and a bottom sheet on phones.
- Answers come only from a curated knowledge base: tracks, plans and prices in the visitor's currency, devices, certificates and the FAQ.
- No account is needed. Account and payment questions are handed to email (practicodeacademy@gmail.com).
- It never promises job placement or career support (that's not offered), and it never invents prices or dates.

### 3. Shared implementation

- A server-side `tutor` unit sits behind one interface, so the model provider can change without touching the interface.
- The default is a small, fast model, such as Claude Haiku 4.5, with prompt caching for lesson context. A larger model is used only for project reviews if evaluation shows it's needed.
- Quotas are enforced server-side per account (per device for the site assistant), with rate limiting.
- Learner questions and code are **not used to train models**. Conversation logs are kept for 30 days for safety review and quality evaluation, then deleted. Learners can clear their history in Settings.
- Every answer is labelled as AI and shows "It can make mistakes".

## Consequences

**Easier**
- Learners get unstuck in seconds, so fewer drop out.
- The "Ask AI why" link on failing checks turns automated feedback into a conversation.
- It's a clear Pro benefit (10 times the daily questions) without putting learning content behind the paywall.

**Harder**
- We need an evaluation set for each track: good hint-first answers, refusals to just hand over answers during practice, and correct citations. It runs in CI before any prompt or model change.
- Cost needs watching. Track AI cost per active learner per month. If it passes 15% of Pro revenue per learner, lower the caps or route simple questions to cheaper models.
- Safeguarding: some learners may be under 18. The tutor stays on topic, refuses unrelated requests, and logs are reviewable.

**We must now**
- add the `tutor` unit to the [architecture overview](../overview.md)
- add AI processing to the [privacy overview](../../compliance/privacy-and-data-protection.md) and the privacy notice
- confirm the daily caps after measuring real usage in the beta
