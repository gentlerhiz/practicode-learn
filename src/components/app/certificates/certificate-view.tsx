import type { Route } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/layout/logo'
import { buttonClasses } from '@/components/ui/button'
import { Glyph } from '@/components/ui/glyph'
import type { Shape } from '@/lib/certificates/document'
import { CertificateDocument } from './certificate-document'
import { CopyLinkButton } from './copy-link-button'

export type CertificateData = {
  name: string
  course: string
  issued: string
  code: string
  /** The public page's full address. */
  url: string
  /** Where the PDF downloads from. */
  pdfHref: string
  lessons: number
  modules: { number: number; title: string; map: string }[]
  /** When the certificate was withdrawn, if it was. */
  revoked: string | null
  /** The certificate itself, laid out (src/lib/certificates/document.ts). */
  shapes: Shape[]
}

const linkedIn = (d: CertificateData) => {
  const [year, month] = [d.issued.split(' ').at(-1), d.issued.split(' ')[1]]
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const q = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: d.course,
    organizationName: 'PractiCode Learn',
    issueYear: year ?? '',
    issueMonth: String(months.indexOf(month ?? '') + 1),
    certUrl: d.url,
    certId: d.code,
  })
  return `https://www.linkedin.com/profile/add?${q}`
}

function Fact({ label, children, mono }: { label: string; children: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-divider py-3 last:border-0">
      <dt className="shrink-0 text-[13px] text-ink-subtle">{label}</dt>
      <dd
        className={
          mono ? 'text-right font-mono text-[13px] break-all text-ink' : 'text-right text-sm text-ink'
        }
      >
        {children}
      </dd>
    </div>
  )
}

/**
 * The public page anyone can open to check a certificate: the certificate itself, exactly as the PDF
 * prints, the facts beside it, what the learner completed, and how the check works.
 */
export function CertificateView({ data }: { data: CertificateData }) {
  const first = data.name.split(' ')[0]
  const live = !data.revoked
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[320px] left-1/2 h-[760px] w-[1400px] -translate-x-1/2 opacity-(--pc-glow-opacity)"
        style={{
          background:
            'radial-gradient(closest-side at 35% 50%, rgba(77,107,255,0.30), rgba(77,107,255,0) 72%), radial-gradient(closest-side at 68% 45%, rgba(123,92,255,0.24), rgba(123,92,255,0) 72%)',
        }}
      />
      <header className="relative border-b border-line-subtle">
        <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between gap-4 px-4 ph:px-6">
          <Logo />
          <p className="flex items-center gap-2 text-[13px] text-ink-muted">
            <Glyph name="shield" size={15} />
            Certificate check
          </p>
        </div>
      </header>

      <main
        id="main"
        className="relative mx-auto box-border flex max-w-[1180px] flex-col gap-14 px-4 pt-8 pb-20 ph:px-6 ph:pt-12"
      >
        <section aria-labelledby="certificate-title" className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            {live ? (
              <p className="inline-flex items-center gap-2 self-start rounded-full bg-success-fill px-3.5 py-1.5 text-[13px] font-bold text-on-success">
                <Glyph name="check" size={15} strokeWidth={2.6} />
                Verified: this certificate is real and active
              </p>
            ) : (
              <p className="inline-flex items-center gap-2 self-start rounded-full border border-error px-3.5 py-1.5 text-[13px] font-bold text-error">
                <Glyph name="close" size={15} />
                Revoked on {data.revoked}: this certificate is no longer valid
              </p>
            )}
            <h1
              id="certificate-title"
              className="font-display text-[32px] leading-[38px] font-extrabold tracking-[-0.035em] text-ink ph:text-[44px] ph:leading-[48px]"
            >
              {data.name}
              <span className="block text-[18px] leading-7 font-semibold tracking-normal text-ink-muted ph:text-[22px] ph:leading-8">
                completed {data.course}
              </span>
            </h1>
          </div>

          <div className="grid grid-cols-1 items-start gap-6 tab:grid-cols-[minmax(0,1fr)_340px]">
            <figure className="m-0 overflow-hidden rounded-2xl border border-line shadow-[0_30px_60px_-30px_rgba(21,18,42,0.45)] ph:rounded-[20px]">
              <CertificateDocument
                id="certificate"
                shapes={data.shapes}
                label={`Certificate of completion: ${data.name} completed every lesson and exercise in ${data.course}. Issued ${data.issued}. Credential ID ${data.code}.`}
              />
            </figure>

            <aside
              aria-label="Certificate details"
              className="flex flex-col gap-5 rounded-[22px] border border-line p-5 surface ph:p-6"
            >
              <dl className="flex flex-col">
                <Fact label="Issued to">{data.name}</Fact>
                <Fact label="Course">{data.course}</Fact>
                <Fact label="Issued">{data.issued}</Fact>
                <Fact label="Issued by">PractiCode Learn</Fact>
                <Fact label="Credential ID" mono>
                  {data.code}
                </Fact>
                <Fact label="Status">{live ? 'Active' : `Revoked on ${data.revoked}`}</Fact>
              </dl>
              {live && (
                <div className="flex flex-col gap-2.5">
                  <a href={data.pdfHref} download className={buttonClasses({}, 'h-12 w-full px-5')}>
                    <Glyph name="download" size={17} />
                    Download PDF
                  </a>
                  <div className="grid grid-cols-2 gap-2.5">
                    <a
                      href={linkedIn(data)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonClasses(
                        { variant: 'secondary' },
                        'h-11 bg-transparent px-4 font-medium',
                      )}
                    >
                      Add to LinkedIn
                    </a>
                    <CopyLinkButton url={data.url} />
                  </div>
                </div>
              )}
            </aside>
          </div>
        </section>

        <section aria-labelledby="completed-title" className="flex flex-col gap-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h2
                id="completed-title"
                className="font-display text-[26px] font-extrabold tracking-[-0.03em] text-ink ph:text-[30px]"
              >
                What {first} completed
              </h2>
              <p className="text-sm text-ink-muted">
                Every lesson and exercise in {data.modules.length} modules: {data.lessons} lessons in all.
              </p>
            </div>
            <p className="text-[13px] text-ink-subtle">Mapped to the MDN Curriculum</p>
          </div>
          <ol className="grid grid-cols-1 gap-2.5 ph:grid-cols-2 tab:grid-cols-3">
            {data.modules.map((m) => (
              <li
                key={m.number}
                className="flex items-start gap-3 rounded-2xl border border-line p-3.5 surface"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-fe font-mono text-[12px] font-semibold text-white">
                  {String(m.number).padStart(2, '0')}
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-sm font-medium text-ink">{m.title}</span>
                  <span className="text-xs text-ink-subtle">{m.map}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="about-title" className="grid grid-cols-1 gap-4 tab:grid-cols-2">
          <h2 id="about-title" className="sr-only">
            About this certificate
          </h2>
          <div className="flex flex-col gap-2.5 rounded-[22px] border border-line p-6 surface">
            <h3 className="font-display text-xl font-extrabold text-ink">What it shows</h3>
            <p className="text-sm leading-6 text-ink-muted">
              {first} completed every lesson in {data.course} on PractiCode Learn: interactive lessons with
              code that runs and is checked in the browser. The course is aligned to the MDN Curriculum. It
              isn’t a degree or a vendor certification.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 rounded-[22px] border border-line p-6 surface">
            <h3 className="font-display text-xl font-extrabold text-ink">How to check it</h3>
            <p className="text-sm leading-6 text-ink-muted">
              This page is the record. It’s read from PractiCode Learn’s own records each time it opens, so
              the details are exactly as issued and nobody can edit them, not even {first}. The QR code on the
              PDF leads here, and a revoked certificate says so.
            </p>
          </div>
        </section>

        <p className="text-center text-[13px] text-ink-subtle">
          <Link href={'/' as Route} className="underline underline-offset-2 hover:no-underline">
            PractiCode Learn
          </Link>
          : learn the skills employers are hiring for.
        </p>
      </main>
    </div>
  )
}
