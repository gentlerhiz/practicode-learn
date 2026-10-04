import { ArrowRight, Icon, Mail } from '@/components/ui/icon'
import { buttonClasses } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { LinkButton } from '@/components/ui/link-button'
import { Section } from '@/components/ui/section'
import { landing } from '@/content/landing'
import { LESSONS_OPEN, primaryCta } from '@/content/navigation'

const glows = [
  'left-[8%] top-8 bg-[radial-gradient(closest-side,rgba(77,107,255,0.45),transparent)]',
  'right-[8%] top-8 bg-[radial-gradient(closest-side,rgba(240,64,127,0.35),transparent)]',
  'left-[10%] bottom-4 bg-[radial-gradient(closest-side,rgba(47,230,176,0.3),transparent)]',
  'right-[10%] bottom-4 bg-[radial-gradient(closest-side,rgba(123,92,255,0.4),transparent)]',
]

/** The closing call to action. Before lessons open it offers the syllabus and an email nudge. */
export function CtaBand() {
  const copy = LESSONS_OPEN ? landing.closing.open : landing.closing.soon
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
              <LinkButton href={primaryCta.href} size="lg" className="px-8">
                {primaryCta.label}
                <Icon as={ArrowRight} size={18} />
              </LinkButton>
              {'notify' in copy && (
                <a
                  href={copy.notify.href}
                  className={buttonClasses({ variant: 'secondary', size: 'lg' }, 'font-medium')}
                >
                  <Icon as={Mail} size={18} />
                  {copy.notify.label}
                </a>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
