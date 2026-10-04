import { describe, expect, it } from 'vitest'
import { pageMetadata } from './metadata'
import { metaFor, publicPages } from './pages'

describe('pageMetadata', () => {
  it('sets canonical, Open Graph and X card from one call', () => {
    const m = pageMetadata({
      title: 'About',
      description: 'Who we are and why we teach this way, in plain words.',
      path: '/about',
    })
    expect(m.alternates?.canonical).toBe('/about')
    expect(m.openGraph).toMatchObject({
      url: '/about',
      title: 'About',
      siteName: 'PractiCode Learn',
      locale: 'en_GB',
    })
    expect(m.twitter).toMatchObject({ card: 'summary_large_image' })
    expect(m.robots).toMatchObject({ index: true, follow: true })
  })
  it('always carries a share image, because a page replaces the layout openGraph', () => {
    const m = pageMetadata({ title: 'About', description: 'x'.repeat(80), path: '/about' })
    expect(m.openGraph?.images).toEqual([
      expect.objectContaining({ url: '/opengraph-image', width: 1200, height: 630 }),
    ])
    expect(m.twitter?.images).toEqual([expect.objectContaining({ url: '/opengraph-image' })])
  })
  it('marks private pages noindex', () => {
    expect(
      pageMetadata({ title: 'Settings', description: 'x'.repeat(60), path: '/settings', noindex: true })
        .robots,
    ).toMatchObject({ index: false, follow: false })
  })
})

describe('publicPages', () => {
  it.each(publicPages)(
    '$path has a title of 60 characters or fewer and a 70–160 character description',
    (p) => {
      expect(p.title.length).toBeLessThanOrEqual(60)
      expect(p.description.length).toBeGreaterThanOrEqual(70)
      expect(p.description.length).toBeLessThanOrEqual(160)
    },
  )
  it('gives every page a unique title and description', () => {
    expect(new Set(publicPages.map((p) => p.title)).size).toBe(publicPages.length)
    expect(new Set(publicPages.map((p) => p.description)).size).toBe(publicPages.length)
  })
  it('refuses metadata for a page that is not registered', () => {
    expect(() => metaFor('/nowhere' as never)).toThrow(/not registered/)
  })
})
