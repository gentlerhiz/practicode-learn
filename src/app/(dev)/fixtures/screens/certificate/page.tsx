import type { Metadata, Route } from 'next'
import { CertificateView } from '@/components/app/certificates/certificate-view'
import { requirePreviews } from '@/lib/fixtures/gate'

export const metadata: Metadata = { title: 'Certificate preview', robots: { index: false, follow: false } }

const project = '/fixtures/screens/project' as Route

/** PrismCertificate with the canvas's sample graduate. */
export default function CertificatePreview() {
  requirePreviews()
  return (
    <CertificateView
      data={{
        name: 'Amina Bello',
        track: 'Front-End Web Development',
        shortTrack: 'Front-End',
        issued: '28 September 2026',
        id: 'PCL-FE-7Q4M-2K9D',
        exam: '87%, plus 15 projects and a capstone',
        url: 'https://learn.practicode.tech/certificate/PCL-FE-7Q4M-2K9D',
        skills: [
          { name: 'How the web works', map: 'MDN: Web standards' },
          { name: 'Semantic HTML', map: 'MDN: Semantic HTML · SFIA PROG 2' },
          { name: 'Git and GitHub', map: 'MDN: Version control' },
          { name: 'CSS fundamentals', map: 'MDN: CSS fundamentals' },
          { name: 'Typography and web fonts', map: 'MDN: CSS text styling' },
          { name: 'Responsive layout', map: 'MDN: CSS layout · WCAG 1.4.10' },
          { name: 'JavaScript fundamentals', map: 'MDN: JavaScript · SFIA PROG 2' },
          { name: 'DOM and Web APIs', map: 'MDN: Web APIs' },
          { name: 'Working with APIs', map: 'MDN: Web APIs · SFIA PROG 3' },
          { name: 'Accessibility', map: 'MDN: Accessibility · SFIA ACIN 2' },
          { name: 'Design for developers', map: 'MDN: Design for developers · SFIA HCEV 2' },
          { name: 'Testing and deployment', map: 'MDN: Testing, Performance · SFIA TEST 2' },
        ],
        projects: [
          { label: 'Capstone', title: 'A booking site for a local tailor', note: '5 pages, contact form, Lighthouse 94', href: project },
          { label: 'Module 11', title: 'A weather dashboard with a contact form', note: 'Handles slow and failed requests gracefully', href: project },
          { label: 'Module 13', title: 'An accessibility audit and fix', note: '27 issues found, all fixed, WCAG 2.2 AA', href: project },
        ],
      }}
    />
  )
}
