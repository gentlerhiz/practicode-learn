import type { Route } from 'next'
import type { GlyphName } from '@/components/ui/glyph'

export type AppNavItem = { href: Route; label: string; icon: GlyphName; badge?: number }

/** The canvas sidebar, top to bottom. Settings sits apart, under the plan card. */
export const MAIN_NAV: AppNavItem[] = [
  { href: '/home' as Route, label: 'Home', icon: 'home' },
  { href: '/my-tracks' as Route, label: 'My Tracks', icon: 'book' },
  { href: '/review' as Route, label: 'Review', icon: 'review' },
  { href: '/projects' as Route, label: 'Projects', icon: 'folder' },
  { href: '/certificates' as Route, label: 'Certificates', icon: 'shield' },
  { href: '/community' as Route, label: 'Community', icon: 'people' },
]

export const SETTINGS_NAV: AppNavItem = { href: '/settings' as Route, label: 'Settings', icon: 'settings' }
export const IMPACT_NAV: AppNavItem = { href: '/admin/impact' as Route, label: 'Impact', icon: 'target' }

/** The phone tab bar: Home, Learn, Review, Projects, Me. */
export const TAB_NAV: AppNavItem[] = [
  { href: '/home' as Route, label: 'Home', icon: 'home' },
  { href: '/my-tracks' as Route, label: 'Learn', icon: 'book' },
  { href: '/review' as Route, label: 'Review', icon: 'review' },
  { href: '/projects' as Route, label: 'Projects', icon: 'folder' },
  { href: '/settings' as Route, label: 'Me', icon: 'user' },
]

export const isCurrent = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`)
