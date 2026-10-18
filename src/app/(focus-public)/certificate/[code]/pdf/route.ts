import { documentFor, findCertificate, isCertificateCode } from '@/lib/certificates/certificates'
import { certificatePdf } from '@/lib/certificates/pdf'
import { site } from '@/lib/site'

/** The certificate as an A4 landscape PDF, downloaded as a file. Revoked certificates have none. */
export async function GET(_request: Request, { params }: RouteContext<'/certificate/[code]/pdf'>) {
  const code = (await params).code.toUpperCase()
  const certificate = isCertificateCode(code) ? await findCertificate(code) : null
  if (!certificate) return new Response('There’s no certificate with that ID.', { status: 404 })
  if (certificate.revokedAt)
    return new Response('This certificate was revoked, so it has no PDF.', { status: 410 })

  const pdf = await certificatePdf(documentFor(certificate, site.url))
  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="PractiCode-Learn-Certificate-${certificate.code}.pdf"`,
      // Revoking must take effect straight away, so nothing keeps a copy.
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  })
}
