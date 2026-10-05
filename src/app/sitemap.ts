import type { MetadataRoute } from 'next'
import { listPublishedLessons } from '@/lib/lessons/catalogue'
import { publicPages } from '@/lib/seo/pages'
import { absoluteUrl } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = publicPages.map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: new Date(page.updated),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))
  // Free lessons are indexable; sample lessons exist only to test the player, and Pro ones show nothing yet.
  const lessons = (await listPublishedLessons())
    .filter((l) => l.free && l.track !== 'samples')
    .map((l) => ({
      url: absoluteUrl(`/learn/${l.track}/${l.slug}`),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  return [...pages, ...lessons]
}
