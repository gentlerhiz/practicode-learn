import type { Metadata } from 'next'
import { site } from '@/lib/site'

export type PageMeta = {
  title: string
  description: string
  path: string
  noindex?: boolean
  type?: 'website' | 'article'
  /** Use the title as written, without the " · PractiCode Learn" suffix (the home page). */
  absoluteTitle?: boolean
  /**
   * Share image. Defaults to the site-wide card. A route with its own opengraph-image file passes
   * 'route', so Next.js fills in that file (its URL carries a build hash, so it can't be written here).
   */
  image?: { url: string; alt: string } | 'route'
}

export const DEFAULT_SHARE_IMAGE = {
  url: '/opengraph-image',
  alt: 'PractiCode Learn: learn the skills employers are hiring for',
}

/** One call gives a page its title, description, canonical URL, Open Graph, X card and robots rules. */
export function pageMetadata({
  title,
  description,
  path,
  noindex = false,
  type = 'website',
  absoluteTitle = false,
  image = DEFAULT_SHARE_IMAGE,
}: PageMeta): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    // A page's openGraph replaces the layout's entirely (Next.js merges metadata shallowly), so the
    // share image is set here on every page rather than inherited.
    openGraph: {
      type,
      url: path,
      title,
      description,
      siteName: site.name,
      locale: site.locale,
      ...(image === 'route'
        ? {}
        : { images: [{ url: image.url, width: 1200, height: 630, alt: image.alt }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image === 'route' ? {} : { images: [{ url: image.url, alt: image.alt }] }),
    },
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
        },
  }
}
