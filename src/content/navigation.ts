import type { Route } from 'next'

export type NavItem = { href: Route; label: string }
export type ExternalNavItem = {
  href: `https://${string}` | `mailto:${string}`
  label: string
  external: true
}
export type FooterGroup = { heading: string; links: (NavItem | ExternalNavItem)[] }

/**
 * Lessons open in Milestone 2 (the lesson player). Until then the primary action points to the
 * syllabus, so no button leads to a page that doesn't exist yet.
 */
export const LESSONS_OPEN = false

export const FIRST_LESSON = '/learn/front-end-web-development/what-happens-when-you-open-a-website'
// Paths into dynamic routes (/tracks/[track], /legal/[doc]) are cast: typed routes check the route,
// not each slug (Next.js docs, typedRoutes). Static pages such as /about need no cast.
export const TRACK_PAGE = '/tracks/front-end-web-development' as Route

export const primaryCta: NavItem = LESSONS_OPEN
  ? { href: FIRST_LESSON as Route, label: 'Start Free' }
  : { href: TRACK_PAGE, label: 'See the Syllabus' }

/** Pages linked from the navigation that don't exist yet. Tests skip them. Empty since Task 8. */
export const PENDING: string[] = []

export const guest: NavItem[] = [
  { href: TRACK_PAGE, label: 'Tracks' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/about', label: 'About' },
]

export const footer: FooterGroup[] = [
  {
    heading: 'Learn',
    links: [
      { href: TRACK_PAGE, label: 'Front-End Web Development' },
      { href: '/#how-it-works', label: 'How It Works' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: 'https://practicode.tech', label: 'PractiCode Academy', external: true },
      { href: 'mailto:practicodeacademy@gmail.com', label: 'Contact', external: true },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { href: '/legal/privacy' as Route, label: 'Privacy' },
      { href: '/legal/terms' as Route, label: 'Terms' },
      { href: '/legal/accessibility' as Route, label: 'Accessibility Statement' },
    ],
  },
]

export const app: NavItem[] = [
  // Signed-in pages arrive in Milestone 2 (Task 17); typed routes can't see them until then.
  { href: '/home' as Route, label: 'Home' },
  { href: TRACK_PAGE, label: 'My Track' },
  { href: '/settings' as Route, label: 'Settings' },
]

export const isExternal = (item: NavItem | ExternalNavItem): item is ExternalNavItem => 'external' in item
