import type { MetadataRoute } from 'next'
import { publicPages } from '@/lib/seo/pages'
import { absoluteUrl } from '@/lib/site'

// Published free lessons join this list in Task 15 (listPublishedLessons).
export default function sitemap(): MetadataRoute.Sitemap {
  return publicPages.map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: new Date(page.updated),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))
}
