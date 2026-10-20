import type { Metadata, Route } from 'next'
import { pageMetadata } from './metadata'

export type PublicPage = {
  path: Route
  title: string
  description: string
  changeFrequency: 'weekly' | 'monthly'
  priority: number
  /** Date the page content last changed meaningfully (sitemap lastmod). Update it with the content. */
  updated: string
  absoluteTitle?: boolean
}

/**
 * Every public, indexable page, in one place. The sitemap, the SEO tests and each page's metadata
 * all read from this list, so a page can't ship without a title, description and sitemap entry.
 */
export const publicPages: PublicPage[] = [
  {
    path: '/',
    title: 'PractiCode Learn: learn the skills employers are hiring for',
    absoluteTitle: true,
    description:
      'Learn code, data, design and AI by actually doing it: interactive lessons, in-browser labs and real projects, built for your phone. Module 1 is free.',
    changeFrequency: 'weekly',
    priority: 1,
    updated: '2026-10-04',
  },
  {
    path: '/courses',
    title: 'Courses',
    description:
      'Every PractiCode Learn course, from IT fundamentals to web development and cybersecurity: hands-on lessons and labs, built for your phone. Module 1 is free.',
    changeFrequency: 'weekly',
    priority: 0.9,
    updated: '2026-10-19',
  },
  {
    path: '/courses/it-fundamentals' as Route,
    title: 'IT Fundamentals: Computers and Digital Skills course',
    description:
      'Learn how computers, files, networks and the cloud work, and use the command line, with hands-on labs from your very first lesson. Module 1 is free.',
    changeFrequency: 'weekly',
    priority: 0.9,
    updated: '2026-10-19',
  },
  {
    path: '/courses/front-end-web-development' as Route,
    title: 'Front-End Web Development course',
    description:
      'Learn HTML, CSS, JavaScript and Git by building real websites, with interactive lessons and in-browser labs. Module 1 is free.',
    changeFrequency: 'weekly',
    priority: 0.9,
    updated: '2026-10-04',
  },
  {
    path: '/courses/back-end-web-development' as Route,
    title: 'Back-End Web Development course',
    description:
      'Build APIs, databases and sign-in with Node.js, Express and PostgreSQL, starting from zero, with a simulated server in your browser. Module 1 is free.',
    changeFrequency: 'weekly',
    priority: 0.9,
    updated: '2026-10-20',
  },
  {
    path: '/courses/python-programming' as Route,
    title: 'Python Programming course',
    description:
      'Learn Python from zero with real Python running in your browser: variables, decisions, loops, functions, files and classes. Module 1 is free.',
    changeFrequency: 'weekly',
    priority: 0.9,
    updated: '2026-10-20',
  },
  {
    path: '/courses/sql-and-databases' as Route,
    title: 'SQL and Databases course',
    description:
      'Learn SQL on real PostgreSQL in your browser: query, filter, join and summarise data, then design databases of your own. Module 1 is free.',
    changeFrequency: 'weekly',
    priority: 0.9,
    updated: '2026-10-20',
  },
  {
    path: '/courses/introduction-to-cybersecurity' as Route,
    title: 'Introduction to Cybersecurity course',
    description:
      'Protect your accounts, devices and data, spot phishing and scams, and see how security work happens, in safe simulated labs. Module 1 is free.',
    changeFrequency: 'weekly',
    priority: 0.9,
    updated: '2026-10-19',
  },
  {
    path: '/about',
    title: 'About PractiCode Learn',
    description:
      'Why we built PractiCode Learn, how we teach through doing rather than watching, and the PractiCode Academy team behind it.',
    changeFrequency: 'monthly',
    priority: 0.6,
    updated: '2026-10-04',
  },
  {
    path: '/pricing' as Route,
    title: 'Pricing',
    description:
      'Module 1 of every course is free for good. Pro unlocks every module, priced for your country, and payments open with the full course.',
    changeFrequency: 'monthly',
    priority: 0.7,
    updated: '2026-10-07',
  },
  {
    path: '/mentors' as Route,
    title: 'Mentor cohorts',
    description:
      'Learn with a teacher and a class: a 3-month PractiCode Academy cohort with weekly live classes and project reviews, online or in Ibadan.',
    changeFrequency: 'monthly',
    priority: 0.6,
    updated: '2026-10-07',
  },
  {
    path: '/scholarship' as Route,
    title: 'Scholarships',
    description:
      'If paying for Pro is hard right now, apply for a scholarship. A person reads every application, and if you qualify, Pro is free for 12 months.',
    changeFrequency: 'monthly',
    priority: 0.5,
    updated: '2026-10-07',
  },
  {
    path: '/legal/privacy' as Route,
    title: 'Privacy notice',
    description:
      'What personal data PractiCode Learn collects and why, where it is stored, how long we keep it, and how to export or delete it.',
    changeFrequency: 'monthly',
    priority: 0.3,
    updated: '2026-10-04',
  },
  {
    path: '/legal/terms' as Route,
    title: 'Terms of use',
    description:
      'The rules for using PractiCode Learn, including your account, acceptable use, the code you write and our responsibilities to you.',
    changeFrequency: 'monthly',
    priority: 0.3,
    updated: '2026-10-04',
  },
  {
    path: '/legal/accessibility' as Route,
    title: 'Accessibility statement',
    description:
      'How we work towards WCAG 2.2 AA on PractiCode Learn, what we test, the gaps we know about, and how to report a barrier.',
    changeFrequency: 'monthly',
    priority: 0.3,
    updated: '2026-10-04',
  },
]

/** Metadata for a registered public page. Throws for an unregistered path, so typos fail the build. */
export function metaFor(path: Route): Metadata {
  const page = publicPages.find((p) => p.path === path)
  if (!page) throw new Error(`${path} is not registered in publicPages`)
  return pageMetadata(page)
}
