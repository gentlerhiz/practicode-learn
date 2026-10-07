import { LogoIcon } from '@/components/layout/logo'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { landing } from '@/content/landing'

export function FounderQuote() {
  const { quote } = landing
  return (
    <Section aria-label="Why we built PractiCode Learn">
      <Container>
        <figure className="relative overflow-hidden rounded-[36px] border border-line bg-sunken px-6 py-10 text-center ph:px-16 ph:py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-(--pc-glow-opacity)"
            style={{
              background:
                'radial-gradient(closest-side at 18% 30%, rgba(77,107,255,0.26), rgba(77,107,255,0) 70%), radial-gradient(closest-side at 84% 70%, rgba(240,64,127,0.22), rgba(240,64,127,0) 70%), radial-gradient(closest-side at 50% 110%, rgba(123,92,255,0.28), rgba(123,92,255,0) 70%)',
            }}
          />
          <svg aria-hidden="true" viewBox="0 0 64 48" className="relative mx-auto mb-8 h-[42px] w-14">
            <defs>
              <linearGradient id="quote-mark" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#4D6BFF" />
                <stop offset="0.5" stopColor="#7B5CFF" />
                <stop offset="1" stopColor="#F0407F" />
              </linearGradient>
            </defs>
            <path
              fill="url(#quote-mark)"
              d="M4 46V28C4 14 10 5 24 2l3 6c-8 3-11 8-11 15h10v23zm34 0V28c0-14 6-23 20-26l3 6c-8 3-11 8-11 15h10v23z"
            />
          </svg>
          <blockquote className="relative mx-auto max-w-[940px] font-display text-[26px] leading-[34px] font-bold tracking-[-0.025em] text-balance text-ink ph:text-[40px] ph:leading-[50px]">
            <p>
              “{quote.text.plain} <span className="bg-[linear-gradient(90deg,var(--pc-fe-text),var(--pc-ai-text)_50%,var(--pc-ux-text))] bg-clip-text text-transparent">{quote.text.accent}</span>”
            </p>
          </blockquote>
          <figcaption className="relative mt-8 flex items-center justify-center gap-3 text-base font-medium text-ink-soft">
            <span className="flex size-10 items-center justify-center rounded-full border border-line bg-control">
              <LogoIcon className="h-[18px] w-5" />
            </span>
            {quote.by}
          </figcaption>
        </figure>
      </Container>
    </Section>
  )
}
