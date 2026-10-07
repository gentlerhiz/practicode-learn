import type { Route } from 'next'
import { ArrowRight, Icon, Mail } from '@/components/ui/icon'
import { buttonClasses } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { LinkButton } from '@/components/ui/link-button'
import { Section } from '@/components/ui/section'
import { landing } from '@/content/landing'
import { FIRST_LESSON, LESSONS_OPEN, primaryCta } from '@/content/navigation'

const glows = [
  'left-[8%] top-8 bg-[radial-gradient(closest-side,rgba(77,107,255,0.45),transparent)]',
  'right-[8%] top-8 bg-[radial-gradient(closest-side,rgba(240,64,127,0.35),transparent)]',
  'left-[10%] bottom-4 bg-[radial-gradient(closest-side,rgba(47,230,176,0.3),transparent)]',
  'right-[10%] bottom-4 bg-[radial-gradient(closest-side,rgba(123,92,255,0.4),transparent)]',
]

const { open, soon, track } = landing.closing

/**
 * The closing call to action. On the landing page it points to the syllabus until lessons open; on the
 * track page (which is the syllabus) it offers Module 1, or an email nudge until Module 1 opens.
 */
export function CtaBand({ context = 'landing' }: { context?: 'landing' | 'track' }) {
  const copy = context === 'track' ? (LESSONS_OPEN ? track.open : track.soon) : LESSONS_OPEN ? open : soon
  const showPrimary = context === 'landing' || LESSONS_OPEN
  const primary =
    context === 'track' ? { href: FIRST_LESSON as Route, label: 'Start Module 1 Free' } : primaryCta

  // The track page's band (PrismTrack) is one line, "It's free." in green, and one button.
  if (context === 'track' && LESSONS_OPEN) {
    return (
      <Section labelledBy="cta-title" className="pb-16 ph:pb-28">
        <Container>
          <div className="relative overflow-hidden rounded-[36px] border border-line bg-row px-6 py-14 text-center ph:px-8 ph:py-20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 [opacity:var(--pc-glow-opacity)]"
              style={{
                background:
                  'radial-gradient(closest-side at 15% 25%, rgba(77,107,255,0.42), rgba(77,107,255,0) 70%), radial-gradient(closest-side at 85% 75%, rgba(123,92,255,0.40), rgba(123,92,255,0) 70%)',
              }}
            />
            <div className="relative flex flex-col items-center gap-5">
              <h2
                id="cta-title"
                className="font-display text-[30px] leading-9 font-extrabold tracking-[-0.035em] text-ink ph:text-[40px] ph:leading-[44px]"
              >
                Module 1 takes about an hour. <span className="text-da-text">It’s free.</span>
              </h2>
              <LinkButton href={primary.href} className="h-[54px] px-8 text-base">
                {primary.label}
              </LinkButton>
            </div>
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <Section labelledBy="cta-title" className="pb-16 ph:pb-28">
      <Container>
        <div className="relative overflow-hidden rounded-[36px] border border-line px-6 py-16 text-center surface ph:px-12 ph:py-28">
          {glows.map((g) => (
            <span
              key={g}
              aria-hidden="true"
              className={`pointer-events-none absolute h-32 w-64 rounded-full [opacity:var(--pc-glow-opacity)] ${g}`}
            />
          ))}
          <div className="relative mx-auto flex max-w-[760px] flex-col items-center gap-6">
            <Heading level={2} id="cta-title">
              {copy.title}
            </Heading>
            <p className="text-[17px] leading-7 text-ink-soft">{copy.body}</p>
            <div className="flex flex-wrap justify-center gap-3">
              {showPrimary && (
                <LinkButton href={primary.href} size="lg" className="px-8">
                  {primary.label}
                  <Icon as={ArrowRight} size={18} />
                </LinkButton>
              )}
              {!LESSONS_OPEN && (
                <a
                  href={soon.notify.href}
                  className={buttonClasses(
                    { variant: showPrimary ? 'secondary' : 'primary', size: 'lg' },
                    'font-medium',
                  )}
                >
                  <Icon as={Mail} size={18} />
                  {soon.notify.label}
                </a>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
