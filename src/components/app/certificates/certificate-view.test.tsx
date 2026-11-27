import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { CertificateView } from './certificate-view'

it('shows course skills and prefills the LinkedIn certification form', () => {
  render(
    <CertificateView
      data={{
        name: 'Amina Bello',
        course: 'Front-End Web Development',
        issued: '28 September 2026',
        code: 'PCL-FE-7Q4M-2K9D',
        url: 'https://learn.practicode.tech/certificate/PCL-FE-7Q4M-2K9D',
        pdfHref: '#',
        lessons: 119,
        projects: 3,
        modules: [],
        skills: ['Build semantic, accessible web pages that meet WCAG 2.2 AA.'],
        revoked: null,
        shapes: [],
      }}
    />,
  )

  expect(screen.getByRole('heading', { name: 'Skills demonstrated' })).toBeVisible()
  expect(screen.getByText('Build semantic, accessible web pages that meet WCAG 2.2 AA.')).toBeVisible()

  const linkedIn = new URL(screen.getByRole('link', { name: 'Add to LinkedIn' }).getAttribute('href')!)
  expect(linkedIn.searchParams.get('startTask')).toBe('CERTIFICATION_NAME')
  expect(linkedIn.searchParams.get('name')).toBe('Front-End Web Development')
  expect(linkedIn.searchParams.get('organizationName')).toBe('PractiCode Learn')
  expect(linkedIn.searchParams.get('issueYear')).toBe('2026')
  expect(linkedIn.searchParams.get('issueMonth')).toBe('9')
  expect(linkedIn.searchParams.get('certUrl')).toBe(
    'https://learn.practicode.tech/certificate/PCL-FE-7Q4M-2K9D',
  )
  expect(linkedIn.searchParams.get('certId')).toBe('PCL-FE-7Q4M-2K9D')
})
