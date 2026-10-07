import type { Metadata, Route } from 'next'
import Link from 'next/link'
import { CertificateBadge } from '@/components/app/certificates/certificate-view'
import { AppPage } from '@/components/app/shell/app-shell'
import { buttonClasses } from '@/components/ui/button'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Certificates',
  description: 'Your PractiCode Learn certificates.',
  path: '/certificates',
  noindex: true,
})

/**
 * Certificates. None exist yet (they arrive with module checks and projects), so this shows the badge a
 * learner will earn and what it takes, in the canvas's certificate style.
 */
export default function CertificatesPage() {
  return (
    <AppPage>
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-[30px] leading-9 font-extrabold tracking-[-0.035em] text-ink ph:text-[40px] ph:leading-[44px]">
          Certificates
        </h1>
        <p className="text-base text-ink-muted">Verifiable credentials that show exactly which skills you proved.</p>
      </div>
      <section className="surface grid grid-cols-1 items-center gap-8 rounded-[30px] border border-line p-6 ph:p-10 tab:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <p className="self-start rounded-full bg-control px-3 py-1 text-xs font-semibold text-ink-muted">No certificates yet</p>
          <h2 className="font-display text-[28px] leading-8 font-extrabold tracking-[-0.025em] text-ink ph:text-[34px] ph:leading-[38px]">
            Your first one: Front-End Web Development
          </h2>
          <p className="text-[15px] leading-6 text-ink-muted">
            Finish the modules, pass each module check with 80% or more, and complete the projects. Your certificate is an Open
            Badges 3.0 credential that anyone can check, mapped to the MDN Curriculum and SFIA 9. Module checks and projects open
            with the full track.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href={'/my-tracks' as Route} className={buttonClasses({}, 'h-12 px-6')}>
              Keep Learning
            </Link>
            <Link href={'/projects' as Route} className={buttonClasses({ variant: 'secondary' }, 'h-12 bg-transparent px-6 font-medium')}>
              See the Projects
            </Link>
          </div>
        </div>
        <div className="flex justify-center opacity-90">
          <CertificateBadge track={['Front-End', 'Web Development']} size={240} />
        </div>
      </section>
    </AppPage>
  )
}
