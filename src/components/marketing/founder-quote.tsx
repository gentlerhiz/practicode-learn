import { LogoIcon } from '@/components/layout/logo'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { landing } from '@/content/landing'

export function FounderQuote() {
  const { quote } = landing
  return (
    <Section aria-label="Why we built PractiCode Learn">
      <Container>
        <figure className="relative overflow-hidden rounded-[36px] border border-line px-6 py-12 text-center surface ph:px-16 ph:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 left-[10%] size-72 rounded-full bg-[radial-gradient(closest-side,rgba(77,107,255,0.28),transparent)] [opacity:var(--pc-glow-opacity)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[8%] -bottom-10 size-72 rounded-full bg-[radial-gradient(closest-side,rgba(123,92,255,0.26),transparent)] [opacity:var(--pc-glow-opacity)]"
          />
          <svg aria-hidden="true" viewBox="0 0 48 36" className="relative mx-auto mb-6 h-9 w-12">
            <defs>
              <linearGradient id="quote-mark" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#3D5AF5" />
                <stop offset="1" stopColor="#6E4CF5" />
              </linearGradient>
            </defs>
            <path
              fill="url(#quote-mark)"
              d="M0 36V22C0 10 6 3 18 0l2 5c-6 2-9 6-9 12h8v19H0Zm27 0V22c0-12 6-19 18-22l2 5c-6 2-9 6-9 12h8v19H27Z"
            />
          </svg>
          <blockquote className="relative mx-auto max-w-[800px] font-display text-[26px] leading-[34px] font-bold tracking-[-0.02em] text-ink ph:text-[40px] ph:leading-[50px]">
            <p>
              “{quote.text.plain} <span className="brand-gradient-text">{quote.text.accent}</span>”
            </p>
          </blockquote>
          <figcaption className="relative mt-8 flex items-center justify-center gap-3 text-[15px] font-medium text-ink">
            <span className="flex size-10 items-center justify-center rounded-full border border-line bg-sunken">
              <LogoIcon className="h-[17px] w-5" />
            </span>
            {quote.by}
          </figcaption>
        </figure>
      </Container>
    </Section>
  )
}
