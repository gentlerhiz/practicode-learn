# Standards framework

*Licensed under CC BY-SA 4.0. See [LICENSING.md](../../LICENSING.md).*

"World-class" has to mean something checkable. Every PractiCode Learn outcome maps to at least one external framework that learners, employers, universities and funders already recognise.

## Three layers of alignment

| Layer | Question it answers | Framework |
|---|---|---|
| **1. Profession** | "What job-level skill does this build?" | **SFIA 9**, the global skills and competency framework for the digital world, used by governments, employers and professional bodies worldwide. Optional cross-reference to the European **e-CF (EN 16234-1)**. |
| **2. Discipline** | "Does this cover what experts in the field agree on?" | One recognised curriculum per track, listed below |
| **3. Course quality** | "Is the course itself well designed?" | **Quality Matters Higher Education Rubric (7th ed.)** for course design, **WCAG 2.2 AA** for accessibility and **CAST UDL 3.0** for inclusive design |

## Discipline frameworks per track

| Track | Primary framework | Secondary references | SFIA 9 skills (target level) |
|---|---|---|---|
| Front-End Web Development | **MDN Curriculum** (Mozilla): 9 core and 9 extension modules | WCAG 2.2; W3C standards | PROG (2–3), HCEV (2), ACIN (2), TEST (2), RELM (2) |
| Data Analysis | **Microsoft PL-300** skills measured: prepare, model, visualise and analyse, manage and secure | Data literacy; data protection law (NDPA 2023, GDPR) | BINT (2–3), VISL (2–3), DATM (2) |
| UI/UX Product Design | **ISO 9241-210:2019** human-centred design activities | UK Design Council Double Diamond; WCAG 2.2; benchmarked against the scope of the Google UX Design Certificate | URCH (2–3), HCEV (2–3), USEV (2), ACIN (2) |
| AI & Machine Learning | **ACM/IEEE-CS/AAAI CS2023**, Artificial Intelligence knowledge area | UNESCO Recommendation on the Ethics of AI (2021); benchmarked against AWS AIF-C01 and Microsoft AI-901 | DATS (2–3), MLNG (2–3) |
| Cybersecurity (planned) | **NICE Framework** (NIST SP 800-181r1) | CompTIA Security+ SY0-701 objectives | SCTY (2–3), THIN (2), PENT (2) |

### SFIA levels explained
SFIA describes seven levels of responsibility: 1 *Follow*, 2 *Assist*, 3 *Apply*, 4 *Enable*, 5 *Ensure, advise*, 6 *Initiate, influence* and 7 *Set strategy, inspire, mobilise*. Our tracks target **level 2 (Assist) to level 3 (Apply)**, the level of a junior professional. Saying this openly is more credible than claiming senior-level outcomes.

## How mapping works

Every learning outcome in a syllabus has a stable ID and one or more framework references:

```yaml
- id: fe.layout.flex-align
  outcome: Align and distribute items along both axes using Flexbox
  bloom: apply
  maps_to:
    - mdn: core/css-layout
    - sfia: PROG@2
    - wcag: "1.4.10"   # Reflow
  assessed_by: [lesson:fe-06-04, check:fe-06, project:fe-06-landing]
```

Rules:
1. **Observable verbs.** Outcomes use revised Bloom's verbs such as *build*, *debug* and *compare*. Never *know* or *understand*.
2. **Assessed.** Every outcome is assessed at least once.
3. **Traceable.** The skill map in the learner dashboard and the claims inside each Open Badges 3.0 credential come from these mappings.
4. **Published.** Mappings live in this repository so anyone can audit them. They are machine-readable and can be exported in the 1EdTech CASE format later.

## Course quality process

Each track goes through this cycle before launch and every 12 months after:

1. **Self-review against the QM rubric.** Course overview, learning objectives, assessment, instructional materials, learner activities, course technology, learner support, and accessibility and usability.
2. **External practitioner review.** At least two working professionals in the field review the syllabus and the project briefs.
3. **Accessibility audit.** WCAG 2.2 AA with automated checks (axe) plus a manual screen-reader pass (TalkBack on Android, NVDA on Windows).
4. **Learner pilot.** At least 20 learners, measuring learning gain from the diagnostic to the mastery check.
5. **Formal QM certification** once the course platform is mature. This is optional, but strong evidence for funders and universities.

## What we do *not* claim

- We are **not accredited** by Mozilla, Microsoft, ISO, ACM or the SFIA Foundation. We say "aligned to", never "certified by".
- Our certificates are **not** vendor certifications. Exam-prep pathways help learners prepare for vendor exams such as PL-300, which they book and pay for separately.
