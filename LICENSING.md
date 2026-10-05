# Licensing

PractiCode Learn uses different licences for different kinds of material. The goal is to keep the platform open and the syllabus reusable, while protecting the paid lesson content that funds the work. The reasoning is in [ADR 0004](docs/architecture/adr/0004-open-syllabus-proprietary-lessons.md).

| Material | Where | Licence |
|---|---|---|
| Application source code | Everything not listed in another row | [GNU Affero General Public License v3.0](LICENSE) |
| Syllabi, learning outcomes and standards mappings | `docs/curriculum/`, and the syllabus data the app is built from in `src/content/tracks/` | [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/) |
| Other documentation | `docs/` (excluding `docs/curriculum/`) | [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/) |
| Full lesson content (lesson text, exercises, tests, animations, exams) | Separate private repository | All rights reserved |
| PractiCode names, logos and brand assets | `brand/`, `public/brand/`, `public/icons/`, and the app icons and logo drawings generated from them (`src/app/icon.svg`, `src/app/favicon.ico`, `src/app/apple-icon.png`) | All rights reserved; see below |
| Photographs of people | `src/assets/images/` | All rights reserved. Not covered by the code licence |
| Fonts (Poppins, Bricolage Grotesque) | `src/assets/fonts/` | [SIL Open Font License 1.1](https://openfontlicense.org), as stated in the licence files beside them |

## What this means in practice

- **Code (AGPL-3.0).** You may use, study, modify and share it. If you run a modified version as a network service, you must offer your users the source of that modified version.
- **Syllabi (CC BY-SA 4.0).** Teachers, schools and other platforms may reuse and adapt our syllabi and standards mappings. They must credit "PractiCode Learn" with a link to this repository, and share adaptations under the same licence.
- **Lesson content.** The interactive lessons, exercise test suites and exam banks are not published here and may not be redistributed.
- **Brand.** The PractiCode name and logos identify our products. A fork must use a different name and logo. Accurate, unmodified references to PractiCode, for example "forked from PractiCode Learn", are fine.

## Contributions

By submitting a contribution you agree that it is licensed under the licence that applies to the files you change. You also confirm that you have the right to submit it. See [CONTRIBUTING.md](CONTRIBUTING.md#licensing-of-contributions).

## Third-party standards and trademarks

References to frameworks and certifications show what our syllabi are *aligned to*. They do not mean PractiCode Learn is endorsed by, or affiliated with, the bodies that own them. Those frameworks and certifications are MDN Curriculum, SFIA, Microsoft PL-300, ISO 9241-210, CS2023, WCAG, Open Badges and others. All trademarks belong to their owners.
