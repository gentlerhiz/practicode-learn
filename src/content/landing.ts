/**
 * Every word on the landing page, in one typed file. Copy rules: British English, no all-caps, Title
 * Case for buttons, sentence case for headings, never count tracks, never offer career support, and no
 * claim the product can't back today (unshipped features say "Coming soon").
 */

export type TrackTone = 'fe' | 'da' | 'ux' | 'ai'

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
  hero: {
    title: { before: 'Learn the', pill: 'skills', after: 'employers are hiring for' },
    intro:
      'Start with Front-End Web Development: short, hands-on lessons where you predict, run and build real code in your browser, from your very first week.',
    secondary: { label: 'How It Works', href: '#how-it-works' },
  },

  tools: [
    'HTML',
    'CSS',
    'JavaScript',
    'Flexbox',
    'Grid',
    'Git',
    'GitHub',
    'VS Code',
    'DevTools',
    'Fetch API',
    'npm',
    'Vite',
    'EmailJS',
    'Netlify',
  ],

  tracks: {
    eyebrow: 'Available tracks',
    title: 'Start with the web. More is on the way.',
    intro:
      'Front-End Web Development is open first. The other tracks are being built now, and each one will start free.',
    standardsLabel: 'Our syllabi line up with standards employers already trust',
    standards: ['MDN Curriculum', 'SFIA 9', 'Microsoft PL-300', 'ISO 9241-210', 'ACM CS2023'],
    cards: [
      {
        slug: 'front-end-web-development',
        tone: 'fe',
        title: 'Front-End Web Development',
        level: 'Beginner · 15 modules',
        summary: 'Build websites that look right on every screen, then put them online for real.',
        alignment: 'Aligned to the MDN Curriculum',
        status: 'live',
      },
      {
        slug: 'data-analysis',
        tone: 'da',
        title: 'Data Analysis',
        level: 'Beginner · 11 modules',
        summary:
          'Tidy messy spreadsheets, find what the numbers are saying, and build dashboards people actually read.',
        alignment: 'Aligned to Microsoft PL-300',
        status: 'coming_soon',
      },
      {
        slug: 'ui-ux-product-design',
        tone: 'ux',
        title: 'UI/UX Product Design',
        level: 'Beginner · 11 modules',
        summary: 'Talk to real users, sketch ideas, and turn them into designs people can click through.',
        alignment: 'Aligned to ISO 9241-210',
        status: 'coming_soon',
      },
      {
        slug: 'ai-machine-learning',
        tone: 'ai',
        title: 'AI & Machine Learning',
        level: 'Intermediate · 12 modules',
        summary: "Train models in Python, check whether they're any good, and learn where AI goes wrong.",
        alignment: 'Aligned to ACM CS2023',
        status: 'coming_soon',
      },
    ] satisfies TrackCard[],
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
        caption: 'the pass mark we set for every module',
        body: 'Each module ends with a check and a project briefed like a real job, so a certificate means something. Module checks and certificates arrive with the full track.',
        link: { label: 'See What You’ll Build', href: '/tracks/front-end-web-development#projects' },
      },
      {
        tone: 'ux' as TrackTone,
        label: 'The weight',
        figure: '150 KB',
        caption: 'the most any lesson may weigh',
        body: 'Every lesson has a size budget, checked before it is published, so it loads on a weak connection and a small data plan.',
        link: { label: 'How Lessons Work', href: '#how-it-works' },
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
    rows: [
      ['How you learn', 'Mostly watching', 'Mostly doing'],
      ['When you get stuck', 'Comments under a video', 'Hints at every step, then the answer'],
      ['Your code', 'Typed along with the video', 'Checked as you write it'],
      ['Data for an hour of learning', 'Hundreds of MB, more in HD', 'Usually under 1 MB'],
      ['Offline', 'Sometimes, in an app', 'Save lessons in your browser and learn offline'],
      ['To start', 'Often a card or a trial', 'Module 1 is free, with no card'],
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
