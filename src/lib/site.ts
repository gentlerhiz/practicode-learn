import brand from '../../brand/brand.config.json' with { type: 'json' }
import { publicEnv } from './env'

/**
 * The canonical address. NEXT_PUBLIC_SITE_URL wins; if a production build forgot to set it, we still
 * point search engines at the real domain rather than localhost, and previews use their own URL.
 */
function resolveSiteUrl(): string {
  const configured = publicEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  if (!configured.includes('localhost')) return configured
  if (process.env.VERCEL_ENV === 'production') return `https://${brand.product.domain}`
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return configured
}

export const site = {
  name: brand.product.name,
  shortName: brand.product.shortName,
  url: resolveSiteUrl(),
  description:
    'Learn the skills employers are hiring for, by doing. Interactive lessons, real projects and practice that works on your phone.',
  locale: 'en_GB' as const,
  email: brand.product.supportEmail,
  sameAs: ['https://practicode.tech'],
  publisher: 'Practicode Consult Limited',
}

export const absoluteUrl = (path: string) => new URL(path, `${site.url}/`).toString()
