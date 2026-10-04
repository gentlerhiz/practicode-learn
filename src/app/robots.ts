import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  // Preview deployments must never be indexed.
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/home', '/settings', '/admin', '/auth/', '/api/', '/verify', '/runner.html'],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  }
}
