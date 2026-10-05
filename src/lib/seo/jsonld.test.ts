import { expect, it } from 'vitest'
import { breadcrumbLd, faqLd, learningResourceLd, organizationLd, serializeJsonLd } from './jsonld'

it('escapes characters that could close the script element', () => {
  expect(serializeJsonLd({ name: '</script><script>alert(1)</script>' })).not.toContain('</script>')
})
it('builds absolute breadcrumb URLs', () => {
  const ld = breadcrumbLd([{ name: 'Tracks', path: '/tracks/front-end-web-development' }])
  expect(ld.itemListElement[0]).toMatchObject({ position: 1, item: expect.stringMatching(/^https?:\/\//) })
})
it('describes the organisation with a logo', () => {
  expect(organizationLd()).toMatchObject({
    '@type': 'EducationalOrganization',
    name: 'PractiCode Learn',
    logo: expect.stringContaining('/brand/'),
  })
})
it('turns FAQ items into questions with accepted answers', () => {
  const ld = faqLd([{ q: 'Is it free?', a: 'Module 1 is free.' }])
  expect(ld).toMatchObject({
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is it free?',
        acceptedAnswer: { '@type': 'Answer', text: 'Module 1 is free.' },
      },
    ],
  })
})

it('describes a track as a Course with a free online instance and its modules', async () => {
  const { courseLd } = await import('./jsonld')
  const { frontEnd } = await import('@/content/tracks/front-end-web-development')
  const ld = courseLd(frontEnd)
  expect(ld).toMatchObject({
    '@type': 'Course',
    name: 'Front-End Web Development',
    inLanguage: 'en-GB',
    educationalLevel: 'Beginner',
    provider: { '@type': 'EducationalOrganization', name: 'PractiCode Learn' },
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'Online', courseWorkload: 'PT140H' },
    offers: { '@type': 'Offer', price: 0, category: 'Partially Free' },
  })
  expect(ld.syllabusSections).toHaveLength(15)
  expect(String(ld.url)).toMatch(/\/tracks\/front-end-web-development$/)
})

it('describes a lesson as a free, timed learning resource that is part of its track', () => {
  const ld = learningResourceLd(
    {
      id: 'fe-01-01',
      track: 'front-end-web-development',
      module: 1,
      lesson: 1,
      slug: 'what-happens-when-you-open-a-website',
      title: 'What happens when you open a website',
      description: 'Follow one tap from your phone to a finished page.',
      minutes: 10,
      free: true,
      version: 1,
      packUrl: '',
    },
    { trackTitle: 'Front-End Web Development', teaches: ['How a browser asks a server for a page'] },
  )
  expect(ld).toMatchObject({
    '@type': 'LearningResource',
    name: 'What happens when you open a website',
    url: expect.stringMatching(/\/learn\/front-end-web-development\/what-happens-when-you-open-a-website$/),
    timeRequired: 'PT10M',
    isAccessibleForFree: true,
    inLanguage: 'en-GB',
    teaches: ['How a browser asks a server for a page'],
    isPartOf: { '@type': 'Course', name: 'Front-End Web Development' },
  })
})
