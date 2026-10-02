# Competitive analysis

*Researched October 2026. Prices and features change, so check them before quoting externally.*

We studied the three platforms named in our brief (Coursera, Udemy and freeCodeCamp). We also studied the platforms with the best-regarded *interactive* learning design (Brilliant, Codecademy, Scrimba, Khan Academy, Duolingo and The Odin Project) and the two most relevant African competitors (ALX and AltSchool Africa).

## Summary

| Platform | Model | Format | Strength we learn from | Weakness we avoid |
|---|---|---|---|---|
| **Coursera** | Freemium, subscription (Coursera Plus), degrees | Video lectures, quizzes, peer review | University and industry brands (Google, IBM, Meta certificates); personalised deadlines | Video-heavy and passive; dense, upsell-heavy interface; low completion in self-paced courses |
| **Udemy** | Marketplace, per-course pricing plus a Personal Plan subscription | Instructor-made video | Huge breadth; lifetime access; clear course landing pages | Quality varies widely; permanent "discounts" undermine trust; certificates carry little weight |
| **freeCodeCamp** | Non-profit, free | Interactive browser editor, workshops, labs, short lectures; proctored exams for the new Certified Full Stack Developer | Free and open-source; the editor runs in the browser; serious certification with a final exam | Utilitarian interface; little personalisation; isolating to learn alone |
| **Brilliant** | Subscription | Interactive problems and visualisations, no video | Learn-by-doing with immediate visual feedback; 15-minute sessions | Not built around career credentials; little real-tool practice |
| **Codecademy** | Freemium, Pro | Interactive editor with instructions | Low-friction start; career paths | Heavy hand-holding; less transfer to real tools |
| **Scrimba** | Freemium, Pro | Interactive screencasts you can edit | Partner of the MDN Curriculum; you can pause and edit the code inside the screencast | Still video-like in data use |
| **Khan Academy** | Non-profit | Mastery-based practice, Khanmigo AI tutor | Mastery learning at scale; AI tutor that guides without giving answers | Mostly school subjects, not careers |
| **Duolingo** | Freemium | Bite-sized gamified lessons | Habit design, learning path, instant feedback | Streak pressure can feel manipulative; shallow for complex skills |
| **The Odin Project** | Free, open-source | Curated readings plus real-tool projects | Real developer workflow from day one; strong community | Text-only and self-directed; high drop-off for beginners |
| **ALX** | Sponsored, free for many African learners | Intensive programmes | Reach and employer relationships across Africa | Intensive schedules; application-gated |
| **AltSchool Africa** | Paid, about US$20–50 a month (reported) | Live and recorded classes, diplomas | Africa-native brand; reports 100,000+ learners in 50+ countries | Video and live-class bandwidth; cohort-bound |

## Platform notes

### Coursera
- **Landing and discovery:** a search-first homepage with partner logos as social proof, and Professional Certificates as the hero product. Coursera has recently invested in redesigned discovery and regional pricing.
- **Learner home:** "continue learning" cards, deadlines and recommendations. The interface packs in a lot of information, and upsells compete with learning.
- **Lessons:** mostly video followed by a graded quiz, with peer-graded assignments for open-ended work.
- **Takeaway:** credibility from recognisable partners works, and so do *personalised* deadlines. Learning itself is passive.

### Udemy
- **Course page:** the clearest in the market. It shows what you'll learn, requirements, the curriculum accordion, instructor details and reviews.
- **Pricing:** list prices that are almost always "on sale" erode trust, which is a dark pattern to avoid.
- **Takeaway:** copy the clarity of the course page. Reject the marketplace quality lottery and the fake urgency.

### freeCodeCamp
- **Curriculum:** the new Certified Full Stack Developer path combines workshops, short lectures with comprehension checks, labs (projects in a blank editor with test suites), review pages, quizzes, a capstone and a proctored final exam. Certifications are free and exam-based.
- **Editor:** an in-browser code editor with tests. It's simple and effective.
- **Takeaway:** test-driven labs and exam-backed certificates are the benchmark for rigour. A warmer, more guided experience and better visual explanations would help beginners.

### Brilliant
- **Format:** a diagram you can manipulate, a question and immediate visual feedback. When you're wrong, the diagram shows why.
- **Takeaway:** this is our closest model for the lesson player, applied to career skills with real tools and recognised standards.

### Duolingo and Khan Academy
- **Duolingo:** a learning path as the home screen, daily goals and celebrations. We use goals and gentle streaks with "rest days", without guilt-driven notifications.
- **Khan Academy:** mastery levels per skill and an AI tutor that asks guiding questions. Our skill map and any future AI help follow this Socratic approach.

### ALX and AltSchool Africa
- They show proven demand for digital-skills training across Africa, and willingness to pay of roughly US$20–50 a month at AltSchool.
- Both rely on live or recorded video and cohort schedules. Our self-paced, low-data, offline-capable format fills a gap they leave.

## Where the gap is

No platform combines all five of these:

1. **Interactive, video-free lessons** for career skills (Brilliant does interactive, but not for careers)
2. **Low-data, offline-first** delivery on any phone
3. **Outcomes mapped to global standards**, published openly
4. **Practice built on learning science**: spaced review and mastery checks
5. **A human mentor path** through a physical academy

That combination is our position.

## UX patterns we adopt

| Pattern | Seen at | How we use it |
|---|---|---|
| Single "resume" call to action on the home screen | Duolingo, Coursera | The dashboard hero card always shows the exact next step |
| Interactive diagram with immediate feedback | Brilliant | Predict and Investigate steps |
| In-browser editor with tests | freeCodeCamp, Codecademy | Run, Modify and Make steps; projects |
| Mastery levels per skill | Khan Academy | Skill map, aligned to the external framework |
| Course page with outcomes, curriculum and requirements | Udemy | Track pages |
| Daily goal, celebration | Duolingo | Weekly goal (kinder than daily), with rest days |
| Personalised deadlines | Coursera | Optional target date that sets a weekly pace |

## Patterns we reject

- Fake discounts, countdown timers and "only 3 seats left" urgency
- Paywalls in the middle of a lesson. Gating happens only between modules.
- Guilt-trip notifications ("You made Duo sad")
- Progress measured as minutes watched
- Partner logos or testimonials we can't verify

## Next research steps

1. Sign up to each platform and record its onboarding, lesson and paywall flows. Annotate them in FigJam.
2. Test 5 learners per round on our prototype, on low-end Android phones (Nielsen, 2000).
3. Re-run this analysis every 6 months.
