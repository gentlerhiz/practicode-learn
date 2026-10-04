# Front-End Web Development

*Syllabus v0.2 (approved outline, draft for practitioner review) · Licensed under CC BY-SA 4.0*

> **Build responsive, accessible, interactive websites from scratch, and ship them to the web.**

| | |
|---|---|
| **For** | Complete beginners, including career switchers and students |
| **Prerequisites** | Basic computer and phone use. No coding experience needed. |
| **Estimated effort** | ~140 hours across 15 modules (about 120 lessons) plus a capstone (≈ 6–7 months at 5 hours a week) |
| **Tools** | HTML5, CSS3, JavaScript, VS Code, the terminal, browser DevTools, Git, GitHub, GitHub Pages, npm, Vite, Prettier, ESLint, REST APIs, EmailJS, Netlify, Figma (reading designs) |
| **Primary alignment** | [MDN Curriculum](https://developer.mozilla.org/en-US/curriculum/): both getting-started modules, all 9 core modules, and the Web APIs, Modern tooling, Transform and animate CSS, Security and privacy, Testing and Performance extensions |
| **Also aligned to** | WCAG 2.2 AA · SFIA 9: PROG@2–3, HCEV@2, ACIN@2, TEST@2, RELM@2 |
| **Credential** | PractiCode Learn Certificate: Front-End Web Development (Open Badges 3.0) |

## By the end, you can

1. Build semantic, accessible web pages that meet WCAG 2.2 AA.
2. Lay out responsive interfaces with Flexbox and Grid that work from 320 px phones to wide desktops.
3. Write JavaScript that responds to users and fetches live data from REST APIs.
4. Use the terminal, Git and GitHub to version, collaborate on and publish code.
5. Set up a modern project with npm, Vite, Prettier and ESLint.
6. Test, optimise and deploy a site to production, on your own domain.
7. Use AI assistants critically: ask good questions, check the answers and never ship code you can't explain.
8. Present a portfolio of at least six projects hosted under your own name.

## Modules

| # | Module | Key outcomes | MDN Curriculum | Project |
|---|---|---|---|---|
| 1 | **How the web works** · *Free* | Explain how browsers, servers, DNS and HTTP work together; build and read a first page; look things up on MDN | Core: Web standards and semantics | An "About me" page, built in the browser |
| 2 | **HTML: structure and meaning** | Structure content with meaningful elements; build accessible forms, tables and media; write the head for search and link previews | Core: Semantic HTML | A menu page for a local restaurant |
| 3 | **Your toolkit and your first live site** | Set up VS Code or a cloud editor; move around with the terminal; commit, push and publish with Git, GitHub and GitHub Pages; inspect pages with DevTools; use AI assistants critically | Getting started: Environment setup, Soft skills · Core: Version control | The menu page, live on the web, with a README |
| 4 | **CSS fundamentals** | Apply selectors, the cascade, specificity, inheritance and the box model; use colour, units and custom properties; debug with DevTools | Core: CSS fundamentals | Style the restaurant menu |
| 5 | **Typography, images and icons** | Set readable type scales; load web fonts efficiently; serve responsive images and SVG icons; apply a spacing system | Core: CSS text styling | A magazine-style article page |
| 6 | **Flexbox** | Build one-dimensional layouts; align and distribute items along both axes; apply common layout patterns | Core: CSS layout | A navigation bar and card section |
| 7 | **Grid and responsive design** | Build two-dimensional layouts; make them responsive with media and container queries; position elements; animate with respect for reduced motion | Core: CSS layout · Extension: Transform and animate CSS | A responsive landing page for a local business |
| 8 | **JavaScript fundamentals** | Use variables, types, conditions, functions, arrays, loops and objects; debug with the console and breakpoints | Core: JavaScript fundamentals | A bill splitter |
| 9 | **Thinking in JavaScript** | Break problems into steps; use scope, array methods, error handling and modules; read unfamiliar code | Core: JavaScript fundamentals | A budget tracker's logic, with tests |
| 10 | **The DOM and events** | Select and change elements; handle events; validate forms; save data in the browser; keep interactions keyboard-accessible | Extension: Web APIs | An interactive quiz |
| 11 | **Data and APIs: fetch, JSON and EmailJS** | Fetch and send JSON with async/await; handle loading, empty and error states; send a form with EmailJS; keep secrets out of front-end code | Extensions: Web APIs, Security and privacy | A currency or weather dashboard with a working contact form |
| 12 | **Git for teams and modern tooling** | Branch, merge, resolve conflicts and review pull requests; manage packages with npm; build with Vite; format and lint code | Core: Version control · Extension: Modern tooling | Move the dashboard to Vite through a pull request |
| 13 | **Accessibility** | Audit and fix pages against WCAG 2.2 AA; test with the keyboard and a screen reader | Core: Accessibility | An accessibility audit and fix of an earlier project |
| 14 | **Design for developers** | Apply hierarchy, alignment, spacing and colour; read a Figma file and export assets; build a design faithfully | Core: Design for developers | Build a page from a Figma design |
| 15 | **Ship it: performance, SEO and real clients** | Measure and improve Core Web Vitals; apply SEO basics; deploy to Netlify on a custom domain; write a first automated test; run a client project from brief to handover | Extensions: Performance, Testing · Getting started: Soft skills | Deploy a site with a Lighthouse score of 90+ |
| ★ | **Capstone** | Plan, build and ship a multi-page site from a real-world brief | — | A portfolio site, plus a site for a real local business or non-profit |

## Lessons

Each lesson takes 10–15 minutes and follows the [lesson format](../lesson-format.md).

1. **How the web works** (6): What happens when you open a website · URLs, domains and DNS · Requests, responses and status codes · HTML, CSS and JavaScript: who does what · Your first web page · Reading MDN, the developer's dictionary
2. **HTML: structure and meaning** (10): Elements, tags and attributes · Headings, paragraphs and lists · Links and file paths · Images and alt text · Page structure: header, nav, main, footer · Sections and articles · Tables, used properly · Forms: inputs, labels and buttons · Built-in form validation · The head: titles, meta tags and link previews
3. **Your toolkit and your first live site** (9): Files, folders and paths · Setting up VS Code · No laptop yet? Free cloud editors · The terminal in 15 minutes · Git basics: init, add, commit · GitHub: push your code · Publish with GitHub Pages · Browser DevTools · AI assistants: ask, check, understand
4. **CSS fundamentals** (10): Connecting CSS to HTML · Selectors · The cascade and specificity · Inheritance · Colour and contrast · Units: px, rem, %, vw · The box model · Block and inline · Custom properties · Debugging CSS in DevTools
5. **Typography, images and icons** (6): Web fonts that load fast · Type scales and readable text · Spacing systems · Responsive images and modern formats · SVG icons · Backgrounds, borders and shadows
6. **Flexbox** (7): Normal flow · Flex containers, main and cross axis · justify-content · Aligning items with Flexbox · Wrapping and gap · grow, shrink and basis · Patterns: navbars, cards, footers, centring
7. **Grid and responsive design** (8): Rows, columns and fr · Placing items and naming areas · auto-fit and minmax · Mobile-first and media queries · Container queries · Positioning and z-index · Transitions, animation and reduced motion · Testing on real phones
8. **JavaScript fundamentals** (10): What JavaScript does, and the console · let and const · Strings, numbers and booleans · Comparisons and conditions · Functions · Arrays · Loops · Objects · Template literals and string methods · Debugging with breakpoints
9. **Thinking in JavaScript** (7): Breaking problems into steps · Scope · map, filter and find · reduce · Errors and try…catch · Modules: import and export · Reading other people's code
10. **The DOM and events** (9): What the DOM is · Selecting elements · Changing text, classes and attributes · Creating and removing elements · Click, input and submit events · Event delegation · Form validation with JavaScript · Saving data with localStorage · Focus and keyboard support
11. **Data and APIs: fetch, JSON and EmailJS** (9): JSON · How APIs work · Promises and async/await · Fetching data · Loading, empty and error states · Sending data with POST · Contact forms with EmailJS · API keys: what's safe in front-end code · Debugging network requests
12. **Git for teams and modern tooling** (9): Branches · Merging and conflicts · Pull requests and code review · Good commits and .gitignore · Node and npm · package.json and scripts · Vite · Prettier and ESLint · Using a library from npm
13. **Accessibility** (6): Who accessibility is for · Keyboard and focus · Screen readers: TalkBack and NVDA · Contrast and colour · Accessible forms and errors · Automated audits: axe and Lighthouse
14. **Design for developers** (5): Visual hierarchy · Alignment, spacing and consistency · Reading a Figma file · Exporting assets · Building a design faithfully
15. **Ship it: performance, SEO and real clients** (8): Lighthouse and Core Web Vitals · Faster images and fonts · SEO basics · Deploying to Netlify from GitHub · Custom domains and HTTPS · Netlify forms and redirects · A first automated test · Working with a client: brief, scope, handover

## Labs

Interactive labs run entirely in the learner's browser, so they cost nothing per learner and work offline.

| Lab | What the learner does | Modules |
|---|---|---|
| Code playground | Writes HTML, CSS and JavaScript with a live preview, a console and instant checks; a symbol bar helps on phones | Most lessons |
| Request journey | Steps through a web request: DNS, server, response | 1 |
| Terminal and Git simulator | Types commands into a simulated terminal and watches the commit history draw itself | 3, 12 |
| Cascade lab | Compares two CSS rules and sees which one wins, and why | 4 |
| Box model and layout labs | Changes Flexbox and Grid values and watches the boxes move | 4–7 |
| Responsive frame | Drags a width slider and watches breakpoints and container queries apply | 7 |
| DOM and events visualiser | Sees the page as a tree and watches a click travel up through it | 10 |
| Async visualiser | Steps through the call stack and the task and promise queues | 9, 11 |
| Simulated APIs and EmailJS | Fetches from APIs that can be slow, broken or offline; sends a form and sees the email arrive in a simulated inbox | 11 |
| Mini DevTools | Inspects elements and reads the console on a phone | 3 onwards |

## Assessment

- **In lessons:** predictions, code tasks with hidden tests and Parsons problems (formative, unlimited attempts).
- **Module mastery checks:** randomised from the outcome bank. The pass mark is 80%.
- **Module projects:** automated tests for functionality plus a rubric covering semantics, accessibility, responsiveness and code quality.
- **Capstone:** rubric-assessed, with human review for Mentor-plan learners and peer review otherwise.
- **Final exam (certificate):** timed and randomised, with server-verified code tasks.

## Device notes

Modules 1–2 and every lesson's Predict, Investigate and review steps work on a phone. Module 3 sets up VS Code and the terminal on a computer; phone learners can practise the same commands in the terminal and Git simulator, and the module lists free cloud editors. From Module 4, writing larger amounts of code is much easier on a laptop, and we recommend one.

## Next steps after this track

JavaScript frameworks (React), TypeScript and back-end development are candidates for future tracks. They correspond to the MDN *JavaScript frameworks* extension and beyond. Modules 9, 11 and 12 (modules, async code, npm and Vite) prepare learners for them.
