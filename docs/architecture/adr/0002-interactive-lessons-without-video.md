# 0002. Interactive lessons without video

- Status: Accepted
- Date: 2026-10-02

## Context

Video lectures dominate online learning, but:

- **Learning:** doing beats watching. Interactive activities showed about six times the learning effect of video or reading in a MOOC study (Koedinger et al., 2015).
- **Access:** streaming uses about 1–3 GB per hour. That is a meaningful cost relative to income across much of Africa, and video stalls on weak connections.
- **Cost:** video hosting and bandwidth are the largest variable costs for video-first platforms.
- **Maintenance:** re-filming whenever a tool's interface changes is slow and expensive.

## Decision

Lessons are built from **text, runnable code and learner-advanced SVG animation**, following PRIMM and Mayer's multimedia principles. **No video lectures.** Short clips may appear only where motion genuinely can't be shown any other way, such as a physical action. Each one needs an ADR-level justification, captions and a transcript.

## Consequences

- Lessons cost about 150 KB instead of about 15–20 MB per minute of video, and they work offline.
- The marginal cost per learner is close to zero.
- Content is version-controlled text, so updates are a pull request.
- **Harder:** authoring an interactive lesson takes more design skill than recording a talk. We need a reusable diagram and step-component library, plus authoring guidelines.
- **Marketing:** "no video" must be framed as a benefit ("learn by doing; works on any network"), not as a limitation.
