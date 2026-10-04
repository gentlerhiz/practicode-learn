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
 * (Pages a later task creates are cast to Route until they exist; see PENDING in content/navigation.)
 */
export const publicPages: PublicPage[] = [
  {
    path: '/',
    title: 'PractiCode Learn: learn the skills employers are hiring for',
    absoluteTitle: true,
    description:
      'Learn web development by doing, not watching. Interactive lessons, in-browser labs and real projects that work on your phone.',
    changeFrequency: 'weekly',
    priority: 1,
    updated: '2026-10-04',
  },
  {
    path: '/tracks/front-end-web-development' as Route,
    title: 'Front-End Web Development course',
    description:
      'Learn HTML, CSS, JavaScript and Git by building real websites, with interactive lessons and in-browser labs. Module 1 is free.',
    changeFrequency: 'weekly',
    priority: 0.9,
    updated: '2026-10-04',
  },
  {
    path: '/about' as Route,
    title: 'About PractiCode Learn',
    description:
      'Why we built PractiCode Learn, how we teach through doing rather than watching, and the PractiCode Academy team behind it.',
    changeFrequency: 'monthly',
    priority: 0.6,
    updated: '2026-10-04',
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
