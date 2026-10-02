# Vision, positioning and personas

## Mission

**Give anyone, anywhere, a practical path into a digital career, on any phone and any network.**

## The problem

1. **Passive formats don't build skill.** Most platforms lead with video lectures. The evidence is consistent: learners who *do* learn far more than learners who *watch* (Koedinger et al., 2015; Freeman et al., 2014; see [Sources](../research/sources.md)). Typical self-paced course completion is low.
2. **Heavy formats exclude people.** Video needs a strong, steady connection and a lot of data. Nigeria's mobile data is among the cheapest in Africa (about US$0.39 per GB, ITU 2026). Even so, a 40-hour video course costs a real share of a ₦70,000 minimum monthly wage, and video stalls on weak signals. In many other countries data costs much more.
3. **Credentials are hard to trust.** Employers can't tell what a certificate represents. Learners can't show what they can do against a standard the employer already knows.

## Our answer

PractiCode Learn teaches digital skills through **interactive, video-free lessons**. Each lesson is a short sequence of steps where learners predict, run, investigate, modify and make. Concepts are shown through code that runs in the browser and SVG diagrams that animate one step at a time. Every outcome maps to a recognised framework, and achievements are issued as verifiable credentials.

### Positioning statement

> For people starting or switching into a digital career, especially across Africa, **PractiCode Learn** is an interactive learning platform that **builds job-ready skills by doing, not watching**. Unlike video-first platforms such as Coursera and Udemy, every lesson is hands-on, works on low-end phones and offline, and is mapped to globally recognised standards. Unlike free text-heavy curricula, it adds a polished experience, practice built on spaced repetition, and an optional human mentor.

### The founding story (for funders and assessors)

> PractiCode Academy has trained [N] people in person in Ibadan since [YEAR]. Demand outgrew a classroom, so we built PractiCode Learn: an interactive platform that needs no video and works on low data. It now serves [X] learners in [Y] countries.

Replace the placeholders with audited numbers only. Never estimate them.

### Why it's credible

- **Continuity.** It grew out of an academy that already teaches these four tracks in person.
- **Scale.** It works for anyone with a browser, and it is not tied to one city.
- **Novelty.** Interactive, video-free and low-data, mapped to standards and issuing verifiable credentials. No incumbent combines all of these.

## Brand architecture

| | |
|---|---|
| Product | **PractiCode Learn** at `learn.practicode.tech` |
| Parent brand | PractiCode, which shares the logo, colours and Poppins type |
| Sister product | **PractiCode Academy**, the in-person and virtual cohorts. It is the first delivery partner and runs the Mentor plan. |
| Internal tools | `app.practicode.tech`, the business CRM, kept separate from the learner product |

The brand is configured in one place ([brand.config.json](../../brand/brand.config.json)), so a rename costs one file. Before launching outside Nigeria, search for "PractiCode" in the WIPO Global Brand Database, UKIPO and USPTO. See [ADR 0001](../architecture/adr/0001-separate-product-under-practicode-brand.md).

## Personas

Personas guide design decisions. Each one is grounded in the Academy's learners and is to be validated through interviews before launch.

### Tolu, the career switcher (primary)
- 26, Ibadan. Works in retail and wants a remote front-end job.
- Has a mid-range Android phone and shares a family laptop in the evenings. Buys data in weekly bundles.
- Has 30–45 minutes on weekdays during the commute, and more at weekends.
- **Needs:** short sessions that resume exactly where they stopped, offline lessons for the bus, and visible progress worth showing an employer.
- **Frustrations:** videos that buffer, courses that never end, certificates nobody asks about.

### Amina, the student (primary)
- 20, Kano, studying computer science. Doing SIWES (industrial training) and wants real skills before graduating.
- Has a laptop on campus Wi-Fi and a phone everywhere else.
- **Needs:** a structured path that complements university theory, projects for a portfolio, and recognisable alignment such as the MDN Curriculum and SFIA.

### Kwame, the working professional (secondary)
- 34, Accra. An operations manager who wants data analysis skills for promotion.
- Uses a work laptop and has budget for a subscription.
- **Needs:** fast, focused lessons, PL-300-aligned outcomes, and credentials that HR will accept.

### Grace, the global learner (secondary)
- 29, Manchester. Wants UI/UX design skills and finds video courses slow.
- **Needs:** a polished, efficient experience. She discovers that "low data" also means "fast" everywhere.

### The funder (stakeholder)
- A programme officer at a foundation or tech company.
- **Needs:** honest impact numbers: learners, countries, completion, learning gain, cost per learner and the share of learners on scholarships. See [Impact metrics](impact-metrics.md).

## Product principles

1. **Doing over watching.** If a learner could do it instead of reading about it, they do it.
2. **Every byte earns its place.** Respect the learner's data, battery and time.
3. **One clear next step.** Every screen answers "what should I do now?"
4. **Show, don't claim.** Progress is shown as skills mastered against a public standard, not as minutes watched.
5. **Kind, not addictive.** Motivation through goals and mastery. No guilt-trips, no dark patterns.
6. **Accessible by default.** WCAG 2.2 AA is the minimum, not a stretch goal.
7. **Honest everywhere.** No invented stats, testimonials or partner logos, and no unoffered services. Career support is not offered and must not be implied.

## What success looks like in year one

- A learner on a ₦60,000 Android phone with a weak 3G signal can sign up and finish their first lesson within 10 minutes.
- At least 40% of learners who start Module 1 finish it. Self-paced course completion is commonly far lower, so this target is ambitious and will be tracked openly.
- Each track's syllabus has been reviewed by at least two external practitioners.
- Pricing has been validated with real willingness-to-pay data in at least three countries.
