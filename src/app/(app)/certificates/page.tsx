import type { Metadata, Route } from 'next'
import Link from 'next/link'
import { CertificateBadge, CopyLinkButton } from '@/components/app/certificates/certificate-view'
import { AppPage } from '@/components/app/shell/app-shell'
import { buttonClasses } from '@/components/ui/button'
import { Glyph } from '@/components/ui/glyph'
import { requireUser } from '@/lib/auth/require-user'
import { certificateDate, certificateFor, certificateUrl } from '@/lib/certificates/certificates'
import { OPEN_TRACK } from '@/lib/learn/progress'
import { pageMetadata } from '@/lib/seo/metadata'
import { site } from '@/lib/site'

export const metadata: Metadata = pageMetadata({
  title: 'Certificates',
  description: 'Your PractiCode Learn certificates.',
  path: '/certificates',
  noindex: true,
})

const card =
  'surface grid grid-cols-1 items-center gap-8 rounded-[30px] border border-line p-6 ph:p-10 tab:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]'
const title =
  'font-display text-[28px] leading-8 font-extrabold tracking-[-0.025em] text-ink ph:text-[34px] ph:leading-[38px]'

/**
 * Certificates, in the canvas's certificate style. Completing every lesson in the track issues one the
 * first time this page finds the track complete; until then it shows how far the learner is.
 */
export default async function CertificatesPage() {
  const user = await requireUser()
  const state = await certificateFor(user, OPEN_TRACK)

  return (
    <AppPage>
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-[30px] leading-9 font-extrabold tracking-[-0.035em] text-ink ph:text-[40px] ph:leading-[44px]">
          Certificates
        </h1>
        <p className="text-base text-ink-muted">
          Credentials anyone can check, showing exactly what you completed.
        </p>
      </div>
      {state.certificate ? (
        <section className={card}>
          <div className="flex flex-col gap-4">
            <p className="inline-flex items-center gap-2 self-start rounded-full bg-success-fill px-3 py-1 text-xs font-bold text-on-success">
              <Glyph name="check" size={14} strokeWidth={2.6} />
              Earned on {certificateDate(state.certificate.issuedAt)}
            </p>
            <h2 className={title}>Front-End Web Development</h2>
            <p className="text-[15px] leading-6 text-ink-muted">
              You completed every lesson in all {state.certificate.modules} modules:{' '}
              {state.certificate.lessons} lessons. Your certificate has its own page, so anyone can check it.
              Share the link, add it to LinkedIn, or save it as a PDF.
            </p>
            <p className="text-[13px] text-ink-subtle">
              Credential ID <span className="font-mono text-ink">{state.certificate.code}</span>
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/certificate/${state.certificate.code}` as Route}
                className={buttonClasses({}, 'h-12 px-6')}
              >
                View Certificate
              </Link>
              <CopyLinkButton url={certificateUrl(state.certificate.code, site.url)} />
            </div>
          </div>
          <div className="flex justify-center">
            <CertificateBadge track={['Front-End', 'Web Development']} size={240} />
          </div>
        </section>
      ) : (
        <section className={card}>
          <div className="flex flex-col gap-4">
            <p className="self-start rounded-full bg-control px-3 py-1 text-xs font-semibold text-ink-muted">
              No certificates yet
            </p>
            <h2 className={title}>Your first one: Front-End Web Development</h2>
            <p className="text-[15px] leading-6 text-ink-muted">
              Complete every lesson in all 15 modules, and your certificate appears here straight away, with
              its own page that anyone can open to check it.
            </p>
            {state.total > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-ink">
                  You’ve completed {state.completed} of {state.total} lessons.
                </p>
                <div
                  role="progressbar"
                  aria-label="Lessons completed"
                  aria-valuemin={0}
                  aria-valuemax={state.total}
                  aria-valuenow={state.completed}
                  className="h-2 overflow-hidden rounded-full bg-control"
                >
                  <div
                    className="h-full rounded-full bg-fe"
                    style={{ width: `${(state.completed / state.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
            {state.needsName && state.completed === state.total && state.total > 0 && (
              <p role="status" className="rounded-xl border border-line bg-row px-3 py-2 text-sm text-ink">
                Your name goes on your certificate.{' '}
                <Link
                  href={'/settings' as Route}
                  className="font-semibold text-fe-text underline underline-offset-2"
                >
                  Add it in Settings
                </Link>
                , then come back here.
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Link href={'/my-tracks' as Route} className={buttonClasses({}, 'h-12 px-6')}>
                Keep Learning
              </Link>
              <Link
                href={'/projects' as Route}
                className={buttonClasses({ variant: 'secondary' }, 'h-12 bg-transparent px-6 font-medium')}
              >
                See the Projects
              </Link>
            </div>
          </div>
          <div className="flex justify-center opacity-90">
            <CertificateBadge track={['Front-End', 'Web Development']} size={240} />
          </div>
        </section>
      )}
    </AppPage>
  )
}
