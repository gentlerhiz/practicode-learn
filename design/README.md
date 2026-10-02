# UI designs

High-fidelity, interactive designs for PractiCode Learn v1. They follow the [UX principles](../docs/design/ux-principles.md). The [design system](../docs/design/design-system.md) will be updated to match whichever direction is chosen.

**Live canvas:** https://claude.ai/artifact/7JGtvdSBs74EVYrGr1ZijS
*(Private until it is shared from the canvas's Share menu.)*

## Final two: Atlas Night and Prism

Each direction has its own canvas page with **seven screens**, each at desktop (1440 px) and phone (390 px) width.

| Row | Screen | What it shows |
|---|---|---|
| 1 | **Landing page** | The pitch, the playable "a lesson that talks back" prediction, tracks, pricing with a currency switcher |
| 1 | **Learner dashboard** | Resume card, weekly goal, review, project, path through the track |
| 2 | **Track page** | Front-End Web Development: outcomes, a syllabus you can expand (12 modules, 77 lessons), standards mapping, projects, certificate preview |
| 2 | **Onboarding** | "What do you want to learn first?" Pick a track, time and experience level, and the plan updates as you choose |
| 2 | **Lesson player** | The no-video Investigate step: click a justify-content value and the boxes move, then answer a check question with specific feedback |
| 2 | **Daily review** | Five flashcards: reveal, rate (Again / Hard / Good / Easy) with the next interval, an explanation of why each card is due, and a "done for today" screen |
| 2 | **Certificate** | The public credential page: verified badge, skills mapped to MDN and SFIA, projects, and how to check it's real |

### The prototype flow
Landing → *Start Free* → Onboarding → *Continue* → Dashboard → *Pick up where you left off* → Lesson → *Continue* → Daily review → *Back to Home*.

From the dashboard you can also reach the track page (*My Tracks*) and the certificate (*Certificates*). The landing page's track cards open the track page.

### How the two differ

| | Atlas Night | Prism |
|---|---|---|
| Ground | Black with a single violet glow | Near-black with multi-colour aurora glows |
| Accents | Lilac and aqua | Each track has its own colour: blue (Web), green (Data), pink (Design), violet (AI) |
| Headings | Poppins, tight tracking | Bricolage Grotesque, extra bold |
| Main button | Practi Yellow, flat | White by default (switch to yellow in the Tweaks panel), flat |
| Feel | Calm, premium, serious | Energetic and premium; tracks are recognisable at a glance |
| Onboarding | Lilac selection state | The selected card takes on its track's colour, and so does the page glow |
| Review | One accent throughout | Cards are tagged by track colour; rating buttons are colour-coded |

Spectrum is still on the canvas (page 3) for reference.

### Feedback applied
- No shadows or glows on yellow buttons or yellow elements.
- No "Made by PractiCode Academy, Ibadan" style badges. Hero pills and footers use neutral, standard copy instead.

### Contrast rules used in the dark directions
- Body text `#A6A1B5` / `#A9A6BC` or lighter on near-black (at least 8:1).
- Accent colours used as **text** are light tints (`#B9A2FF`, `#2FF5C9`, `#8EA2FF`, `#4BE3A8`, `#FF7DB0`), all 8:1 or better.
- Track colours used as **fills behind white text** are deeper shades (`#3D5AF5`, `#0A7D5C`, `#D9306F`, `#6E4CF5`), all 4.5:1 or better.
- Aqua and green fills always carry dark text.

### Canvas notes
- Canvas frames max out at 8,000 px, so long phone landing pages are shown in two frames, part 1 and part 2. Open a desktop frame in full view to scroll a whole page.

## Next steps after a direction is chosen
1. Update the [design system](../docs/design/design-system.md) and [brand config](../brand/brand.config.json) with the chosen tokens, fonts and rules.
2. Design the remaining screens: sign-up, settings, project workspace, module mastery check, pricing and checkout.
3. Run a usability test with 5 learners on low-end Android phones.

## Source

[canvas/](canvas/) holds the design source: `.dc.html` artboards and `canvas.json`. These render inside the design canvas runtime, not as standalone pages, and will be rebuilt as React components during implementation.

## Earlier explorations

Set aside on 2 October 2026 and kept in git history at commit `a220965`: Current (Paper & Ink), Adire, Simple and the first lesson player.
