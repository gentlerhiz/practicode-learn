import type { Metadata } from 'next'
import { connection } from 'next/server'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { ArrowRight, Icon } from '@/components/ui/icon'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { LinkButton } from '@/components/ui/link-button'
import { SkipLink } from '@/components/ui/skip-link'
import { TRACK_PAGE } from '@/content/navigation'

// Next.js adds <meta name="robots" content="noindex"> to 404 responses itself.
export const metadata: Metadata = { title: 'Page not found' }

export default async function NotFound() {
  // Rendered per request: a 404 under a signed-in path (say /login/x) carries the nonce CSP, and only
  // per-request rendering adds the nonce to its scripts. 404s are rare, so the cost is small.
  await connection()
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main">
        <Container width="prose" className="flex flex-col items-center gap-6 py-20 text-center ph:py-28">
          <p className="font-display text-[88px] leading-none font-extrabold tracking-[-0.05em] text-fe-text ph:text-[120px]">
            404
          </p>
          <Heading level={1} size="lg">
            We couldn’t find that page
          </Heading>
          <p className="max-w-[520px] text-[17px] leading-7 text-ink-muted">
            It may have moved, or the link has a typo. Start again from the home page, or jump into the track.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <LinkButton href="/" size="lg">
              Go to the Home Page
            </LinkButton>
            <LinkButton href={TRACK_PAGE} variant="secondary" size="lg">
              Front-End Web Development
              <Icon as={ArrowRight} size={18} />
            </LinkButton>
          </div>
          <p className="text-sm text-ink-subtle">
            Followed a link from us?{' '}
            <a
              href="mailto:practicodeacademy@gmail.com?subject=Broken%20link%20on%20PractiCode%20Learn"
              className="text-fe-text underline underline-offset-2"
            >
              Tell us
            </a>{' '}
            and we’ll fix it.
          </p>
        </Container>
      </main>
      <SiteFooter />
    </>
  )
}
