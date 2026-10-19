/**
 * Every word on the landing page, in one typed file. Copy rules: British English, no all-caps, Title
 * Case for buttons, sentence case for headings, never count tracks, never offer career support, and no
 * claim the product can't back today (unshipped features say "Coming soon").
 */
import { catalogue, levelLine, toneOf, type TrackTone } from './catalogue'

export type { TrackTone } from './catalogue'

export type TrackCard = {
  slug: string
  tone: TrackTone
  title: string
  level: string
  summary: string
  alignment: string
  status: 'live' | 'coming_soon'
}

export const landing = {
  banner: { text: 'Try a real lesson right now. No sign-up, no card.', link: 'Start one →' },

  hero: {
    // The canvas headline: one pill per track, in its colour.
    pills: [
      { word: 'code', tone: 'fe' },
      { word: 'data', tone: 'da' },
      { word: 'design', tone: 'ux' },
      { word: 'AI', tone: 'ai' },
    ] as { word: string; tone: TrackTone }[],
    intro:
      'Learn the skills employers are hiring for, one hands-on lesson at a time. Every course is built around industry standards employers already use, and you build real projects from your very first week.',
    primary: 'Start Learning Free',
    secondary: { label: 'Explore Courses', href: '/courses' },
  },

  // The scrolling strip under the hero, coloured by track.
  tools: [
    { name: 'HTML', tone: 'fe' },
    { name: 'CSS', tone: 'fe' },
    { name: 'JavaScript', tone: 'fe' },
    { name: 'The command line', tone: 'it' },
    { name: 'Cloud storage', tone: 'it' },
    { name: 'Passkeys', tone: 'cy' },
    { name: 'Two-factor sign-in', tone: 'cy' },
    { name: 'SQL', tone: 'da' },
    { name: 'Figma', tone: 'ux' },
    { name: 'FigJam', tone: 'ux' },
    { name: 'Python', tone: 'ai' },
    { name: 'pandas', tone: 'ai' },
    { name: 'scikit-learn', tone: 'ai' },
    { name: 'Git', tone: 'git' },
  ] as { name: string; tone: TrackTone | 'git' }[],

  tracks: {
    eyebrow: 'Courses',
    title: 'Pick a course. Switch anytime.',
    intro: 'Module 1 of every course is free, so trying one costs you nothing. More courses are on the way.',
    browse: 'Browse All Courses',
    standardsLabel: 'Our syllabi line up with standards employers already trust',
    standards: ['MDN Curriculum', 'CompTIA Tech+', 'NIST CSF 2.0', 'SFIA 9', 'ISO 9241-210', 'ACM CS2023'],
    // The featured courses, in catalogue order.
    cards: catalogue
      .filter((c) => c.featured)
      .map((c) => ({
        slug: c.slug,
        tone: toneOf(c),
        title: c.title,
        level: levelLine(c),
        summary: c.summary,
        alignment: c.alignment,
        status: c.status,
      })) satisfies TrackCard[],
  },

  stats: {
    title: 'Small numbers. Big difference.',
    intro: { plain: 'Three numbers that shaped how we built this,', accent: 'and what they mean for you.' },
    cards: [
      {
        tone: 'fe' as TrackTone,
        label: 'The research',
        figure: '6×',
        caption: 'the learning benefit of doing, compared with watching',
        body: 'Carnegie Mellon researchers studied a course on Coursera. Extra hands-on practice did more than six times as much for learning as extra watching or reading.',
        link: {
          label: 'Read the Study',
          href: 'https://doi.org/10.1145/2724660.2724681',
          description: 'Koedinger et al., 2015 (opens the paper)',
        },
      },
      {
        tone: 'da' as TrackTone,
        label: 'The bar',
        figure: '80%',
        caption: 'to pass every module',
        body: "Each module ends with a check and a project briefed like a real job. You move on once you've got it, so your certificate means something.",
        link: { label: 'See What You’ll Build', href: '/courses/front-end-web-development#syllabus' },
      },
      {
        tone: 'ux' as TrackTone,
        label: 'The price',
        figure: '₦0',
        caption: 'to start any course',
        body: 'Module 1 is free for good. No card, and no trial clock ticking in the corner.',
        link: { label: 'See the Plans', href: '#pricing' },
      },
    ],
  },

  features: {
    title: 'Everything you need to actually finish',
    intro: {
      plain: 'Starting a course is easy. Finishing it is the hard part,',
      accent: "so that's what we built for.",
    },
  },

  demo: {
    title: 'A lesson that talks back',
    paragraphs: ['Every step asks you to do something. Pick an answer, change a value, fix a line of code.'],
    emphasis: {
      plain: 'Get it wrong and the preview shows you why.',
      accent: 'Get it right and the next step builds on it.',
      end: 'You find out what you know by using it, not by being told.',
    },
    note: 'Try this one from the Flexbox module. Pick a value and watch the navigation bar.',
    step: {
      context: 'Front-End Web Development · Module 6 · Flexbox',
      kind: 'Predict',
      question: 'The links sit at the top of the bar. Which value lines them up along the middle?',
      code: '.nav {\n  display: flex;\n  align-items: ???;\n}',
      options: [
        {
          id: 'flex-start',
          letter: 'A',
          value: 'flex-start',
          feedback: 'Not quite. flex-start pins the items to the top of the bar, where they already are.',
        },
        {
          id: 'center',
          letter: 'B',
          value: 'center',
          feedback: 'Right. center lines the items up along the middle of the bar, whatever its height.',
        },
        {
          id: 'flex-end',
          letter: 'C',
          value: 'flex-end',
          feedback: 'Not quite. flex-end drops the items to the bottom of the bar.',
        },
      ],
      prompt: 'Pick a value to see what happens.',
    },
  },

  quote: {
    text: {
      plain:
        "In our classroom in Ibadan, the students who did best weren't the ones who watched the most. They were the ones who tried things, got them wrong, and tried again.",
      accent: 'So we built the whole platform around that.',
    },
    by: 'The PractiCode team',
  },

  comparison: {
    title: 'Built for doing, not just watching.',
    intro: {
      plain: 'Here’s what changes when every lesson asks you to do something,',
      accent: 'and help is there the moment you need it.',
    },
    columns: ['What you get', 'The usual video course', 'PractiCode Learn'] as const,
    proFrom: 'Pro launches with the full course',
    rows: [
      ['How you learn', 'Mostly watching', 'Mostly doing'],
      ['Help when you’re stuck', 'Comments under a video', 'An AI tutor in lessons and projects'],
      ['Data for an hour of learning', 'Hundreds of MB, more in HD', 'Usually under 1 MB. AI modules add a one-time 10–30 MB download.'],
      ['Offline', 'Sometimes, in an app', 'Save lessons to your device and learn offline'],
      ['Remembering it next month', 'Up to you', 'A 4-minute daily review'],
      ['What the certificate proves', 'That you finished', 'Which skills you mastered'],
      ['Prices', 'Usually in dollars', 'Naira, cedis, shillings, pounds or dollars'],
      ['A real person to ask', 'A forum, if you’re lucky', 'Mentor plan with PractiCode Academy'],
    ] as const,
  },

  faqTitle: 'Questions people ask us',

  closing: {
    open: {
      title: 'Your first lesson takes about ten minutes.',
      body: 'No account, no card. Just open a lesson and start.',
    },
    track: {
      open: {
        title: 'Module 1 takes about an hour. It’s free.',
        body: 'No account, no card. Open the first lesson and start.',
      },
      soon: {
        title: 'Module 1 opens soon. It’s free.',
        body: 'Want a nudge when it opens? Email us and we’ll tell you.',
      },
    },
    soon: {
      title: 'Module 1 opens soon, free.',
      body: 'See exactly what you’ll learn, lesson by lesson. Want a nudge when it opens? Email us and we’ll tell you.',
      notify: {
        label: 'Email Me When It Opens',
        href: 'mailto:practicodeacademy@gmail.com?subject=Tell%20me%20when%20PractiCode%20Learn%20opens',
      },
    },
  },
} as const
