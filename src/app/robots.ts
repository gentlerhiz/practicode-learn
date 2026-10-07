import type { MetadataRoute } from 'next'
import { DYNAMIC_PATHS } from '@/lib/security/headers'
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
        // Private and sign-in pages (src/lib/security/headers.ts), plus the API and the code runner.
        disallow: [...DYNAMIC_PATHS.filter((p) => p !== '/auth'), '/auth/', '/api/', '/runner.html'],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  }
}
