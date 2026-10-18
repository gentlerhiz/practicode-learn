import type { Metadata, Route } from 'next'
import Link from 'next/link'
import { CertificateDocument } from '@/components/app/certificates/certificate-document'
import { CopyLinkButton } from '@/components/app/certificates/copy-link-button'
import { AppPage } from '@/components/app/shell/app-shell'
import { buttonClasses } from '@/components/ui/button'
import { Glyph } from '@/components/ui/glyph'
import { liveTracks } from '@/content/tracks'
import { requireUser } from '@/lib/auth/require-user'
import {
  certificateDate,
  certificateFor,
  certificateShapes,
  certificateUrl,
  type Certificate,
} from '@/lib/certificates/certificates'
import { pageMetadata } from '@/lib/seo/metadata'
import { site } from '@/lib/site'

export const metadata: Metadata = pageMetadata({
  title: 'Certificates',
  description: 'Your PractiCode Learn certificates.',
  path: '/certificates',
  noindex: true,
})

type Progress = { slug: string; title: string; completed: number; total: number; needsName: boolean }

const h2 = 'font-display text-[22px] font-extrabold tracking-[-0.02em] text-ink ph:text-[24px]'

/**
 * Certificates: one for each course a learner completes. Earned certificates show as they print; courses
 * under way show how far there is to go. Visiting issues any certificate that has just been earned.
 */
export default async function CertificatesPage() {
  const user = await requireUser()
  const states = await Promise.all(
    liveTracks().map(async (t) => ({ track: t, state: await certificateFor(user, t.slug) })),
  )
  const earned: { title: string; certificate: Certificate }[] = []
  const going: Progress[] = []
  for (const { track, state } of states) {
    if (state.certificate) earned.push({ title: track.title, certificate: state.certificate })
    else if (state.completed > 0) going.push({ slug: track.slug, title: track.title, ...state })
  }

  return (
    <AppPage>
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-[30px] leading-9 font-extrabold tracking-[-0.035em] text-ink ph:text-[40px] ph:leading-[44px]">
          Certificates
        </h1>
        <p className="text-base text-ink-muted">
          One for each course you complete, with its own page that anyone can open to check it.
        </p>
      </div>

      {earned.length > 0 && (
        <section aria-labelledby="earned-title" className="flex flex-col gap-4">
          <h2 id="earned-title" className={h2}>
            Earned
          </h2>
          <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {earned.map(({ title, certificate: c }) => (
              <li
                key={c.code}
                className="flex flex-col gap-4 rounded-[24px] border border-line p-4 surface ph:p-5"
              >
                <Link
                  href={`/certificate/${c.code}` as Route}
                  aria-label={`Open the ${title} certificate`}
                  className="block overflow-hidden rounded-[14px] border border-line transition-transform hover:-translate-y-0.5"
                >
                  <CertificateDocument
                    id={`cert-${c.code}`}
                    shapes={certificateShapes(c, site.url)}
                    label={`${title} certificate`}
                  />
                </Link>
                <div className="flex flex-col gap-1">
                  <p className="inline-flex items-center gap-1.5 self-start rounded-full bg-success-fill px-2.5 py-0.5 text-xs font-bold text-on-success">
                    <Glyph name="check" size={13} strokeWidth={2.6} />
                    Earned on {certificateDate(c.issuedAt)}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-extrabold text-ink">{title}</h3>
                  <p className="text-[13px] text-ink-subtle">
                    {c.modules} modules · {c.lessons} lessons · <span className="font-mono">{c.code}</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <Link href={`/certificate/${c.code}` as Route} className={buttonClasses({}, 'h-11 px-5')}>
                    View Certificate
                  </Link>
                  <a
                    href={`/certificate/${c.code}/pdf`}
                    download
                    className={buttonClasses(
                      { variant: 'secondary' },
                      'h-11 bg-transparent px-4 font-medium',
                    )}
                  >
                    <Glyph name="download" size={16} />
                    PDF
                  </a>
                  <CopyLinkButton url={certificateUrl(c.code, site.url)} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {going.length > 0 && (
        <section aria-labelledby="progress-title" className="flex flex-col gap-4">
          <h2 id="progress-title" className={h2}>
            In progress
          </h2>
          <ul className="flex flex-col gap-3">
            {going.map((p) => (
              <li
                key={p.slug}
                className="flex flex-col gap-4 rounded-[22px] border border-line p-5 surface ph:flex-row ph:items-center ph:gap-6"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-lg font-extrabold text-ink">{p.title}</h3>
                    <p className="text-[13px] text-ink-muted">
                      {p.completed} of {p.total} lessons
                    </p>
                  </div>
                  <div
                    role="progressbar"
                    aria-label={`${p.title}: lessons completed`}
                    aria-valuemin={0}
                    aria-valuemax={p.total}
                    aria-valuenow={p.completed}
                    className="h-2 overflow-hidden rounded-full bg-control"
                  >
                    <div
                      className="h-full rounded-full bg-fe"
                      style={{ width: `${(p.completed / p.total) * 100}%` }}
                    />
                  </div>
                  <p className="text-[13px] text-ink-subtle">
                    {p.completed === p.total && p.needsName ? (
                      <>
                        Every lesson is done. Your name goes on the certificate:{' '}
                        <Link
                          href={'/settings' as Route}
                          className="font-semibold text-fe-text underline underline-offset-2"
                        >
                          add it in Settings
                        </Link>
                        , then come back here.
                      </>
                    ) : (
                      `Complete the other ${p.total - p.completed} lessons, and your certificate appears here straight away.`
                    )}
                  </p>
                </div>
                <Link href={'/my-tracks' as Route} className={buttonClasses({}, 'h-11 shrink-0 px-5')}>
                  Keep Learning
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {earned.length === 0 && going.length === 0 && (
        <section className="flex flex-col items-start gap-3 rounded-[24px] border border-line p-6 surface ph:p-8">
          <span className="flex size-11 items-center justify-center rounded-xl bg-fe text-white">
            <Glyph name="shield" size={20} />
          </span>
          <h2 className={h2}>No certificates yet</h2>
          <p className="max-w-[560px] text-[15px] leading-6 text-ink-muted">
            Complete every lesson in a course, and its certificate appears here straight away: a page anyone
            can open to check it, and a PDF to download.
          </p>
          <Link href={'/my-tracks' as Route} className={buttonClasses({}, 'mt-1 h-11 px-5')}>
            Start Learning
          </Link>
        </section>
      )}
    </AppPage>
  )
}
