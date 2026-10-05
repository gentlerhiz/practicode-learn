/**
 * About page copy, from the design canvas (PrismAbout), adjusted so every claim is true in the beta.
 * The leadership section is the founder's own wording; change it only with the founder.
 */
export const about = {
  hero: {
    eyebrow: 'About PractiCode Learn',
    title: 'Job-ready skills, learned by doing.',
    intro:
      'PractiCode Learn is an interactive learning platform from PractiCode Academy in Nigeria. Learners will build real skills by doing the work, starting with Front-End Web Development, with data analysis, product design and AI to follow.',
    mission: {
      label: 'Our mission',
      text: 'Make job-ready digital skills practical and affordable for anyone willing to put in the practice.',
      note: 'Talent is spread evenly. Hands-on teaching at a fair price isn’t. We’re closing that gap, starting in Africa.',
    },
  },
  story: {
    eyebrow: 'Our story',
    title: 'It started in a classroom.',
    paragraphs: [
      'PractiCode Academy teaches digital skills in three-month cohorts, in person in Ibadan and online, and runs a Women in Tech initiative alongside them. One pattern kept showing up: progress came from practice, not from watching.',
      'Yet most online courses are built the other way round, as long videos that are hard to stream and easy to forget.',
      'So we built PractiCode Learn around practice. Short lessons that ask you to act, feedback the moment you do, and hints for when you’re stuck. It is the classroom we know works, without needing to be in the room.',
    ],
    quote:
      'The students who did best weren’t the ones who watched the most. They were the ones who tried things, got them wrong, and tried again.',
    quoteBy: 'The PractiCode team',
  },
  teach: {
    eyebrow: 'How we teach',
    title: 'Built around practice. Measured against real standards.',
    items: [
      {
        title: 'Learn by doing',
        body: 'Every lesson step asks you to guess, try or build something, and shows you the result straight away.',
      },
      {
        title: 'Standards employers use',
        body: 'Each syllabus maps to a recognised framework: the MDN Curriculum, SFIA 9, Microsoft PL-300, ISO 9241-210 and ACM CS2023.',
      },
      {
        title: 'Real projects',
        body: 'Every module ends with a project briefed like a real job. Coding tasks are checked by automated tests as you write them.',
      },
      {
        title: 'A tutor that coaches',
        body: 'The AI tutor will know the lesson you’re on, give hints before answers, and show where each answer comes from.',
        soon: true,
      },
    ],
  },
  access: {
    eyebrow: 'Africa first, open to everyone',
    title: 'Designed for real phones, real networks and real budgets.',
    items: [
      'Lessons are built to run in the browser, even on low-cost Android phones. Some modules need a computer, and each track says which.',
      'Lessons you open on Wi-Fi will keep working offline.',
      'Every lesson has a size budget of 150 KB, so it loads on a weak connection.',
      'Module 1 is free, with no card needed.',
    ],
  },
  commitments: {
    eyebrow: 'Our commitments',
    title: 'Promises we keep.',
    items: [
      {
        title: 'Your data is yours.',
        body: 'We never sell personal data or use it for advertising. When accounts open, you can download or delete your data any time.',
      },
      {
        title: 'No pressure tactics.',
        body: 'No fake countdowns or guilt trips. When Pro launches, you’ll cancel in one click, with no phone calls.',
      },
      {
        title: 'Accessible by design.',
        body: 'We design to WCAG 2.2 AA, in light and dark mode, for small screens first.',
      },
      {
        title: 'Honest about AI.',
        body: 'Lessons are drafted with AI assistance and reviewed by our instructors. When the AI tutor arrives, it will say it can be wrong and link every answer to the lesson.',
      },
    ],
  },
  leadership: {
    eyebrow: 'Leadership',
    title: 'Led by an engineer who teaches.',
    name: 'Idris Akande Rasaq',
    role: 'Founder, PractiCode Academy and PractiCode Learn',
    bio: 'Idris is a software engineer and educator who founded PractiCode Academy to give people in Nigeria practical, industry-focused tech training. Idris has built production web applications for software companies in Canada, taught programming to more than 100 students, and now designs and leads PractiCode Learn, from the curriculum to the code.',
    facts: [
      'Software engineer for companies in Canada, working remotely, since 2023',
      'Taught ASP.NET, PHP and Python as an IT instructor at Aptech Computer Education, Ibadan',
      'BSc Computer Science, University of Ibadan',
    ],
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/idris-rasaq-5202091a6/' },
      { label: 'GitHub', href: 'https://github.com/gentlerhiz' },
    ],
  },
  work: {
    learn: {
      title: 'Learn with us',
      body: 'Front-End Web Development opens first, and Module 1 will be free for good. Prefer a teacher and a class? Join a PractiCode Academy cohort.',
      academy: { label: 'PractiCode Academy Cohorts', href: 'https://practicode.tech' },
    },
    partner: {
      title: 'Work with us',
      body: 'We partner with employers, schools and funders who want more people job-ready in digital skills. Tell us what you’re working on.',
      email: {
        label: 'Email the Team',
        href: 'mailto:practicodeacademy@gmail.com?subject=Working%20with%20PractiCode%20Learn',
      },
    },
    address: 'PractiCode Academy · 7B Oba Olagbegi, Old Bodija, Ibadan, Nigeria',
  },
} as const
