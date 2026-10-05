import type {
  BreadcrumbList,
  Course,
  EducationalOrganization,
  FAQPage,
  LearningResource,
  WebSite,
  WithContext,
} from 'schema-dts'
import type { TrackContent } from '@/content/tracks/types'
import type { LessonMeta } from '@/lib/lessons/types'
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

type CourseLd = WithContext<Course> & {
  url: string
  syllabusSections: { '@type': 'Syllabus'; name: string; description: string }[]
}

/** A track as a schema.org Course. Only Module 1 is free, which the offer's category and description say. */
export const courseLd = (track: TrackContent): CourseLd => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: track.title,
  description: track.summary,
  url: absoluteUrl(`/tracks/${track.slug}`),
  inLanguage: 'en-GB',
  educationalLevel: track.level,
  teaches: track.outcomes,
  provider: { '@type': 'EducationalOrganization', name: site.name, url: site.url },
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'Online',
    courseWorkload: `PT${track.hours}H`,
  },
  offers: {
    '@type': 'Offer',
    price: 0,
    priceCurrency: 'NGN',
    // Only Module 1 is free, so the course as a whole is partially free.
    category: 'Partially Free',
    description: 'Module 1 is free, with no card needed.',
  },
  syllabusSections: track.modules.map((m) => ({
    '@type': 'Syllabus' as const,
    name: `Module ${m.number}: ${m.title}`,
    description: m.summary,
  })),
})

/** A lesson as a schema.org LearningResource: interactive, timed, and part of its track's Course. */
export const learningResourceLd = (
  lesson: LessonMeta,
  { trackTitle, teaches }: { trackTitle?: string; teaches: string[] },
): WithContext<LearningResource> => ({
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: lesson.title,
  description: lesson.description,
  url: absoluteUrl(`/learn/${lesson.track}/${lesson.slug}`),
  inLanguage: 'en-GB',
  learningResourceType: 'Interactive lesson',
  interactivityType: 'active',
  educationalLevel: 'Beginner',
  timeRequired: `PT${lesson.minutes}M`,
  isAccessibleForFree: lesson.free,
  teaches,
  provider: { '@type': 'EducationalOrganization', name: site.name, url: site.url },
  ...(trackTitle
    ? { isPartOf: { '@type': 'Course', name: trackTitle, url: absoluteUrl(`/tracks/${lesson.track}`) } }
    : {}),
})
