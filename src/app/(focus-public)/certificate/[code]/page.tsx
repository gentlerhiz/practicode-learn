import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CertificateView } from '@/components/app/certificates/certificate-view'
import { getTrackContent } from '@/content/tracks'
import {
  certificateDate,
  certificateSkills,
  certificateUrl,
  findCertificate,
  isCertificateCode,
} from '@/lib/certificates/certificates'
import { pageMetadata } from '@/lib/seo/metadata'
import { site } from '@/lib/site'

async function load(params: PageProps<'/certificate/[code]'>['params']) {
  const code = (await params).code.toUpperCase()
  return isCertificateCode(code) ? findCertificate(code) : null
}

export async function generateMetadata({ params }: PageProps<'/certificate/[code]'>): Promise<Metadata> {
  const certificate = await load(params)
  const track = certificate && getTrackContent(certificate.track)
  return pageMetadata({
    title: certificate && track ? `${certificate.name}: ${track.title}` : 'Certificate not found',
    description: 'A PractiCode Learn certificate, checked against PractiCode Learn’s own records.',
    path: certificate ? `/certificate/${certificate.code}` : '/certificate',
    // A learner's name is theirs to share, not ours to put in search results.
    noindex: true,
  })
}

/** PrismCertificate: the public page anyone can open to check a certificate. */
export default async function CertificatePage({ params }: PageProps<'/certificate/[code]'>) {
  const certificate = await load(params)
  const track = certificate && getTrackContent(certificate.track)
  if (!certificate || !track) notFound()
  return (
    <CertificateView
      data={{
        name: certificate.name,
        track: track.title,
        shortTrack: 'Front-End',
        issued: certificateDate(certificate.issuedAt),
        id: certificate.code,
        completed: `All ${certificate.modules} modules, ${certificate.lessons} lessons`,
        skills: certificateSkills(certificate.track, certificate.modules),
        projects: [],
        url: certificateUrl(certificate.code, site.url),
        revoked: certificate.revokedAt ? certificateDate(certificate.revokedAt) : null,
      }}
    />
  )
}
