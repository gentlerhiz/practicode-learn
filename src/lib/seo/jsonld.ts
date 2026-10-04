import type { BreadcrumbList, EducationalOrganization, FAQPage, WebSite, WithContext } from 'schema-dts'
import { absoluteUrl, site } from '@/lib/site'

/** JSON for a <script> element. Escaping "<" stops any value from closing the element early. */
export const serializeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c')

export const organizationLd = (): WithContext<EducationalOrganization> => ({
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: site.name,
  url: site.url,
  logo: absoluteUrl('/brand/icon-yellow.svg'),
  email: site.email,
  parentOrganization: { '@type': 'Organization', name: 'PractiCode Academy', url: 'https://practicode.tech' },
  sameAs: site.sameAs,
})

export const websiteLd = (): WithContext<WebSite> => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: site.name,
  url: site.url,
  inLanguage: 'en-GB',
  publisher: { '@type': 'Organization', name: site.publisher },
})

type Crumb = { name: string; path: string }
type BreadcrumbItem = { '@type': 'ListItem'; position: number; name: string; item: string }

export const breadcrumbLd = (
  items: Crumb[],
): WithContext<BreadcrumbList> & { itemListElement: BreadcrumbItem[] } => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Home', path: '/' }, ...items].map((crumb, i) => ({
    '@type': 'ListItem' as const,
    position: i + 1,
    name: crumb.name,
    item: absoluteUrl(crumb.path),
  })),
})

export const faqLd = (items: { q: string; a: string }[]): WithContext<FAQPage> => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
})
