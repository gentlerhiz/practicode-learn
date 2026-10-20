/**
 * Every course PractiCode Learn offers or is preparing, in one list: the Courses page, the landing page,
 * onboarding and the app all read it. To add a course, add it here (and its syllabus in
 * docs/curriculum/tracks); once its Module 1 is written it gets full content in src/content/tracks.
 * Copy rules: never count courses, never offer career support, and no claim the product can't back today.
 */

/** A subject's colour. Colour means subject, so every course in a subject shares it. */
export type TrackTone = 'fe' | 'da' | 'ux' | 'ai' | 'it' | 'cy'

export type Subject = 'foundations' | 'software' | 'data' | 'security' | 'design' | 'ai'

export const SUBJECTS: { id: Subject; label: string; tone: TrackTone }[] = [
  { id: 'foundations', label: 'Foundations', tone: 'it' },
  { id: 'software', label: 'Software Development', tone: 'fe' },
  { id: 'data', label: 'Data', tone: 'da' },
  { id: 'security', label: 'Security', tone: 'cy' },
  { id: 'design', label: 'Design', tone: 'ux' },
  { id: 'ai', label: 'AI', tone: 'ai' },
]

export const LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const
export type Level = (typeof LEVELS)[number]

export type CatalogueCourse = {
  slug: string
  /** Two letters: lesson ids (it-01-02), project ids (it-p01) and certificate codes (PCL-IT-…) start with it. */
  code: string
  title: string
  /** The name in tight spaces, such as "Front-End". */
  short: string
  subject: Subject
  level: Level
  /** The planned syllabus, once there is one. */
  modules?: number
  hours?: number
  /** One sentence for cards. */
  summary: string
  /** One short line, for the dashboard and onboarding. */
  line: string
  alignment: string
  /** Courses to take first, by slug. */
  prerequisites: string[]
  status: 'live' | 'coming_soon'
  /** Shown on the landing page. */
  featured?: boolean
  /** The title of Module 1, once it's published. */
  firstModule?: string
}

export const catalogue: CatalogueCourse[] = [
  {
    slug: 'it-fundamentals',
    code: 'it',
    title: 'IT Fundamentals: Computers and Digital Skills',
    short: 'IT Fundamentals',
    subject: 'foundations',
    level: 'Beginner',
    modules: 13,
    hours: 45,
    summary:
      'Start from zero: how computers, files, networks and the cloud work, the command line, and what people in tech actually do.',
    line: 'Understand the tech you use, from files to the cloud.',
    alignment: 'Aligned to CompTIA Tech+',
    prerequisites: [],
    status: 'live',
    featured: true,
    firstModule: 'How computers work',
  },
  {
    slug: 'front-end-web-development',
    code: 'fe',
    title: 'Front-End Web Development',
    short: 'Front-End',
    subject: 'software',
    level: 'Beginner',
    modules: 15,
    hours: 140,
    summary: 'Build websites that look right on every screen, then put them online for real.',
    line: 'Build websites that look right on every screen.',
    alignment: 'Aligned to the MDN Curriculum',
    prerequisites: [],
    status: 'live',
    featured: true,
    firstModule: 'How the web works',
  },
  {
    slug: 'back-end-web-development',
    code: 'be',
    title: 'Back-End Web Development',
    short: 'Back-End',
    subject: 'software',
    level: 'Beginner',
    modules: 15,
    hours: 140,
    summary: 'Build the server side of apps with Node.js, Express and PostgreSQL: APIs, databases, sign-in and security.',
    line: 'Build APIs, databases and sign-in with Node.js.',
    alignment: 'Aligned to MDN Learn and the OWASP API Security Top 10',
    prerequisites: [],
    status: 'live',
    firstModule: 'How the back end works',
  },
  {
    slug: 'introduction-to-cybersecurity',
    code: 'cy',
    title: 'Introduction to Cybersecurity',
    short: 'Cybersecurity',
    subject: 'security',
    level: 'Beginner',
    modules: 10,
    hours: 35,
    summary:
      'Protect your accounts, devices, money and data, spot scams before they land, and see how security work really happens.',
    line: 'Protect your accounts, devices and data.',
    alignment: 'Aligned to the NIST Cybersecurity Framework 2.0',
    prerequisites: [],
    status: 'live',
    featured: true,
    firstModule: 'Why security matters to you',
  },
  {
    slug: 'python-programming',
    code: 'py',
    title: 'Python Programming',
    short: 'Python',
    subject: 'software',
    level: 'Beginner',
    modules: 12,
    hours: 60,
    summary: 'Write real programs in Python, the language behind data analysis, AI and automation.',
    line: 'Write real programs in Python.',
    alignment: 'Aligned to the Python Institute’s PCEP and PCAP',
    prerequisites: [],
    status: 'live',
    firstModule: 'Getting started with Python',
  },
  {
    slug: 'sql-and-databases',
    code: 'sq',
    title: 'SQL and Databases',
    short: 'SQL',
    subject: 'data',
    level: 'Beginner',
    modules: 10,
    hours: 40,
    summary: 'Ask real databases questions with SQL, then design and build databases of your own.',
    line: 'Query, design and build databases with SQL.',
    alignment: 'Aligned to the SQL standard (ISO/IEC 9075)',
    prerequisites: [],
    status: 'live',
    firstModule: 'Databases and your first query',
  },
  {
    slug: 'data-analysis',
    code: 'da',
    title: 'Data Analysis',
    short: 'Data Analysis',
    subject: 'data',
    level: 'Intermediate',
    summary: 'Clean messy data, find what the numbers are saying, and present it so people act on it.',
    line: 'Clean data and find what the numbers say.',
    alignment: 'Aligned to CompTIA Data+',
    prerequisites: ['python-programming', 'sql-and-databases'],
    status: 'coming_soon',
    featured: true,
  },
  {
    slug: 'ui-ux-product-design',
    code: 'ux',
    title: 'UI/UX Product Design',
    short: 'UI/UX',
    subject: 'design',
    level: 'Beginner',
    modules: 11,
    summary: 'Talk to real users, sketch ideas, and turn them into designs people can click through.',
    line: 'Design apps people enjoy using.',
    alignment: 'Aligned to ISO 9241-210',
    prerequisites: [],
    status: 'coming_soon',
  },
  {
    slug: 'ai-machine-learning',
    code: 'ai',
    title: 'AI & Machine Learning',
    short: 'AI & ML',
    subject: 'ai',
    level: 'Intermediate',
    modules: 12,
    summary: "Build models in Python, check whether they're any good, and learn where AI goes wrong.",
    line: 'Build models and learn where AI goes wrong.',
    alignment: 'Aligned to ACM CS2023',
    prerequisites: ['python-programming'],
    status: 'coming_soon',
  },
  {
    slug: 'javascript-in-depth',
    code: 'js',
    title: 'JavaScript in Depth',
    short: 'JavaScript',
    subject: 'software',
    level: 'Advanced',
    summary: 'Go beyond the basics: how JavaScript really runs, async code, patterns and testing.',
    line: 'Master how JavaScript really works.',
    alignment: 'Syllabus in preparation',
    prerequisites: ['front-end-web-development'],
    status: 'coming_soon',
  },
  {
    slug: 'cybersecurity-and-linux',
    code: 'cl',
    title: 'Cybersecurity and the Linux Command Line',
    short: 'Cybersecurity and Linux',
    subject: 'security',
    level: 'Intermediate',
    summary: 'Defend real systems: Linux, networks, logs and the tools security teams use every day.',
    line: 'Defend systems with Linux and security tools.',
    alignment: 'Syllabus in preparation',
    prerequisites: ['introduction-to-cybersecurity', 'python-programming'],
    status: 'coming_soon',
  },
]

/** Suggested orders through the catalogue, shown on the Courses page. */
export const PATHS: { title: string; summary: string; steps: string[] }[] = [
  {
    title: 'Build for the web',
    summary: 'From your first computer skills to sites and APIs you can put your name on.',
    steps: ['it-fundamentals', 'front-end-web-development', 'back-end-web-development', 'javascript-in-depth'],
  },
  {
    title: 'Work with data',
    summary: 'Programming first, then databases, then analysis.',
    steps: ['it-fundamentals', 'python-programming', 'sql-and-databases', 'data-analysis'],
  },
  {
    title: 'Protect systems',
    summary: 'Stay safe yourself, then learn to defend others.',
    steps: ['it-fundamentals', 'introduction-to-cybersecurity', 'python-programming', 'cybersecurity-and-linux'],
  },
]

export const subjectOf = (course: Pick<CatalogueCourse, 'subject'>) =>
  SUBJECTS.find((s) => s.id === course.subject)!

export const toneOf = (course: Pick<CatalogueCourse, 'subject'>): TrackTone => subjectOf(course).tone

export const findCourse = (slug: string) => catalogue.find((c) => c.slug === slug)

export const courseByCode = (code: string) => catalogue.find((c) => c.code === code)

/** "Beginner · 15 modules", or just the level while the syllabus is in preparation. */
export const levelLine = (course: CatalogueCourse) =>
  course.modules ? `${course.level} · ${course.modules} modules` : course.level

export const liveCourses = () => catalogue.filter((c) => c.status === 'live')
