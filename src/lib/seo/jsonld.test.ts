import { expect, it } from 'vitest'
import { breadcrumbLd, faqLd, organizationLd, serializeJsonLd } from './jsonld'

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
