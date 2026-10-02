# Teaching model

*Licensed under CC BY-SA 4.0.*

PractiCode Learn's teaching model is assembled from well-replicated findings in learning science. Each design rule below cites its evidence. The full references are in [Sources](../research/sources.md).

## 1. Design backwards from outcomes

We use **backward design** (Wiggins & McTighe, 2005):

1. Define what a learner should be able to *do*: outcomes written with revised Bloom's verbs (Anderson & Krathwohl, 2001).
2. Decide what evidence proves it: checks, projects and exams.
3. Only then write the lessons that get them there.

This is also what the Quality Matters rubric checks: objectives, assessments and activities must line up.

## 2. Doing beats watching

Interactive activities produce about **six times** the learning of watching video or reading (Koedinger et al., 2015). Lecture-style teaching makes failure **1.5 times** more likely than active learning (Freeman et al., 2014). The ICAP framework explains why: engagement deepens from **Passive → Active → Constructive → Interactive** (Chi & Wylie, 2014).

**Rule:** at least two-thirds of the steps in every lesson require the learner to act, by predicting, choosing, writing, dragging or building.

## The lesson loop: PRIMM

> **On marketing pages** we describe this loop in plain words as **Guess, Try, Make**, without the PRIMM name. Learners and funders don't need the jargon. The full loop still drives every lesson.

For programming we use **PRIMM** (Sentance, Waite & Kallia, 2019), which is used widely in UK computing education through the Raspberry Pi Foundation and the National Centre for Computing Education.

| Stage | Learner does | Example (Flexbox) |
|---|---|---|
| **Predict** | Reads code and predicts the result before running it | "Where will the three boxes sit with `justify-content: space-between`?" |
| **Run** | Runs it and compares the result with the prediction | Live preview updates; the prediction is marked right or wrong |
| **Investigate** | Traces, annotates and explains how it works | Toggles each value and watches the animated diagram |
| **Modify** | Changes existing code to do something new | "Centre the boxes vertically too." |
| **Make** | Builds something new with the same idea | "Build this navigation bar from scratch." |

PRIMM starts learners *reading* code before *writing* it, which reduces cognitive load and builds confidence. We adapt the same loop for the other tracks:

| Track | Predict | Run | Investigate | Modify | Make |
|---|---|---|---|---|---|
| Data Analysis | Guess the pivot result | Run the pivot | Trace the DAX filter context | Change the measure | Build a report page |
| UI/UX Design | Which layout will users find easier? | See test results | Annotate why | Fix the design | Design a new screen |
| AI & ML | Predict the model's accuracy | Train it | Inspect errors | Tune it | Train your own |

## 3. Manage cognitive load

Working memory is limited (Sweller, 1988). So we:

- **Use worked examples first, then fade them.** Show a full solution, then ask for the last step, then the last two, then the whole thing (worked-example and completion-problem effects).
- **Use Parsons problems** for early code-writing: rearranging given lines into a working program (Parsons & Haden, 2006).
- **Pre-train key terms** before the concept that uses them.
- **Watch for expertise reversal** (Kalyuga et al., 2003). Experienced learners can test out of a module with its mastery check, and scaffolding fades as skill grows.

## 4. Animation done right: Mayer's principles

We replace video with **step-by-step SVG animation that the learner controls**. Applying Mayer's multimedia principles (Mayer, 2020):

| Principle | What it means for us |
|---|---|
| **Segmenting** | Animations advance one step per tap, at the learner's pace, never as a continuous stream |
| **Signalling** | Highlight exactly what changes, in brand yellow on dark or ink outline on light |
| **Spatial contiguity** | Labels sit *on* the diagram, not in a legend |
| **Coherence** | No decorative motion, mascots or background music |
| **Redundancy** | No narration that repeats the on-screen text |
| **Pre-training** | Introduce the parts of a diagram before animating how they interact |

**Accessibility:** every animation has a static, step-through equivalent and a text description. If the operating system's "reduce motion" setting is on, transitions become instant cuts.

## Retrieval and spacing

Testing yourself beats rereading (Roediger & Karpicke, 2006). Spacing practice over days beats cramming (Cepeda et al., 2006). Both are rated "high utility" by Dunlosky et al. (2013).

- **Daily review.** Key concepts become short review cards, scheduled by **FSRS** (Free Spaced Repetition Scheduler, the open-source algorithm Anki has offered since 23.10). A typical review takes 3–5 minutes.
- **Interleaving.** Review sessions mix topics, so learners practise *choosing* the right technique as well as using it.

## 5. Mastery before moving on

Mastery learning combined with tutoring was the basis of Bloom's "2 sigma" finding (Bloom, 1984).

- Each module ends with a **mastery check**. The pass mark is 80%.
- Failed items are explained, and a retake uses *different* questions from the same outcome bank.
- The **skill map** shows each outcome as *Not started → Practising → Mastered*, linked to the external framework.

## 6. Feedback that teaches

Effective feedback answers *Where am I going? How am I going? Where to next?* (Hattie & Timperley, 2007).

- **Immediate:** every interaction responds in under 100 ms, whether it is a prediction, a code test or a choice.
- **Specific:** "Your `.card` uses `margin` but the gap comes from `gap` on the parent", never just "Wrong".
- **Escalating hints:** a nudge first, then the concept with a link back to the relevant step, then a worked example. Hints never just hand over the answer.

## 7. Authentic projects

Following Merrill's First Principles (2002), learning is anchored in **real-world tasks**:

- Each module ends with a **project** whose brief reads like a real client or employer request.
- Projects are checked by **automated tests** (functional) and a **rubric** (quality). Mentor-plan learners also get human review.
- The capstone produces a portfolio piece hosted under the learner's own name, for example on Netlify or GitHub Pages.

## 8. Universal Design for Learning

Following **CAST UDL Guidelines 3.0** (2024), we offer:

- **Multiple means of representation:** text, diagram, code and interactive simulation for the same idea.
- **Multiple means of action:** keyboard, touch and screen reader all fully supported.
- **Multiple means of engagement:** goal choice, pacing choice and real-world context drawn from the learners' own regions.

## 9. Motivation without manipulation

- **Weekly goals** (days per week) instead of fragile daily streaks. Rest days don't break progress.
- **Celebrate mastery, not time spent.**
- No guilt notifications, no leaderboards by default (they demotivate most learners), and no loot boxes.

## 10. AI assistance (planned, later phase)

If we add an AI helper, it follows the **Socratic** model of Khan Academy's Khanmigo. It asks guiding questions, explains errors and never writes the learner's graded work. It will be clearly labelled and optional, and conversations will be private by default.
