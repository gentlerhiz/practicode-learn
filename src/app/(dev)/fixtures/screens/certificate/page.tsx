import type { Metadata } from 'next'
import { CertificateView } from '@/components/app/certificates/certificate-view'
import { frontEnd } from '@/content/tracks/front-end-web-development'
import { layoutCertificate } from '@/lib/certificates/document'
import { requirePreviews } from '@/lib/fixtures/gate'

export const metadata: Metadata = { title: 'Certificate preview', robots: { index: false, follow: false } }

const url = 'https://learn.practicode.tech/certificate/PCL-FE-7Q4M-2K9D'

/** The certificate page with the canvas's sample graduate. */
export default function CertificatePreview() {
  requirePreviews()
  return (
    <CertificateView
      data={{
        name: 'Amina Bello',
        course: frontEnd.title,
        issued: '28 September 2026',
        code: 'PCL-FE-7Q4M-2K9D',
        url,
        pdfHref: '#',
        lessons: 119,
        projects: 3,
        modules: frontEnd.modules.map((m) => ({ number: m.number, title: m.title, map: m.mdn })),
        revoked: null,
        shapes: layoutCertificate({
          name: 'Amina Bello',
          course: frontEnd.title,
          badge: ['Front-End', 'Web Development'],
          detail: 'All 15 modules · 119 lessons · Aligned to the MDN Curriculum',
          issued: '28 September 2026',
          code: 'PCL-FE-7Q4M-2K9D',
          url,
        }),
      }}
    />
  )
}
