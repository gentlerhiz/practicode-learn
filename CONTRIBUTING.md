# Contributing to PractiCode Learn

Thank you for helping. This project aims to give anyone, anywhere, a world-class way to learn a digital skill, and that only works with many people's knowledge.

## Ways to contribute

| You are… | You can help by… | Start here |
|---|---|---|
| An educator or industry practitioner | Reviewing a syllabus, outcomes or standards mapping | [Curriculum feedback issue](.github/ISSUE_TEMPLATE/curriculum_feedback.yml) |
| An accessibility specialist or assistive-tech user | Auditing designs against WCAG 2.2 AA | [UX principles](docs/design/ux-principles.md#accessibility) |
| A translator | Translating the interface (once i18n lands) | Open an issue to coordinate |
| A designer | Critiquing UI designs, proposing patterns | [design/](design/README.md) |
| A developer | Code, once implementation starts | [Architecture](docs/architecture/overview.md) |

The project is in the **design phase**. The most valuable contributions right now are reviews of the docs in `docs/`.

## Ground rules

- Follow the [Code of Conduct](CODE_OF_CONDUCT.md).
- For anything larger than a typo, **open an issue first** so we can agree the approach before you spend time.
- Keep pull requests small and focused on one change.
- Never commit secrets, API keys or personal data, including real learner data in fixtures.

## Workflow

1. Fork the repository and create a branch from `main`: `feat/short-description`, `fix/…`, `docs/…` or `curriculum/…`.
2. Make your change. Update docs in the same pull request when behaviour changes.
3. Write commits in the [Conventional Commits](https://www.conventionalcommits.org/) style, for example `docs(curriculum): add PL-300 mapping for module 7`.
4. Open a pull request using the template, and link the issue.
5. A maintainer reviews it. Curriculum changes need one subject-matter reviewer, and UI changes need an accessibility check.

## Writing style

- Plain English, short sentences, active voice. Many of our readers use English as a second or third language.
- Use sentence case for headings and Title Case for UI labels and buttons. Don't use all-caps, except for acronyms such as HTML and DAX.
- Say "learner", not "student" or "user", when you mean someone learning on the platform.
- Cite sources for factual claims about learning science, data costs or standards. Add them to [docs/research/sources.md](docs/research/sources.md).

## Curriculum contributions

Every learning outcome must:

1. Start with an observable verb from the revised Bloom's taxonomy, such as *build*, *explain* or *debug*. Avoid *understand*.
2. Map to at least one external framework reference, such as an MDN module, SFIA skill and level, or PL-300 skill area. See the [Standards framework](docs/curriculum/standards-framework.md).
3. Be assessed by at least one exercise, check or project.

## Architecture decisions

Significant technical decisions are recorded as ADRs in [docs/architecture/adr/](docs/architecture/adr/). To propose a change, copy the template, number it sequentially and open a pull request with status `Proposed`.

## Licensing of contributions

By contributing, you agree that your contribution is licensed under the licence covering the files you change (see [LICENSING.md](LICENSING.md)): code under AGPL-3.0, documentation and syllabi under CC BY-SA 4.0. You also confirm that you have the right to submit the work.

Staff, contractors and Academy team members who contribute to proprietary lesson content sign a separate written agreement that assigns those rights to PractiCode.

## Questions

Open a [discussion or issue](../../issues), or email practicodeacademy@gmail.com.
