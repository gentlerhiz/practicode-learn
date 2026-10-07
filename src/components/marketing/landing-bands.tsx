import type { Route } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { buttonClasses } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { LinkButton } from '@/components/ui/link-button'
import { Section } from '@/components/ui/section'
import { FIRST_LESSON } from '@/content/navigation'
import { PlanCards } from './plan-cards'
import { SectionHeading } from './section-heading'

/** The gradient strip above the landing header. */
export function TryBanner() {
  return (
    <div className="bg-[linear-gradient(90deg,#3046e0_0%,#6a45f0_50%,#c42a6c_100%)] px-4 py-2 text-center text-sm font-medium text-white">
      Try a real lesson right now. No sign-up, no card.{' '}
      <Link href={FIRST_LESSON as Route} className="font-bold underline underline-offset-2 hover:no-underline">
        Start one →
      </Link>
    </div>
  )
}

/** "Learning is easier with someone in your corner." (anchor #mentor) */
export function MentorBand() {
  return (
    <Section id="mentor" labelledBy="mentor-title">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-8 overflow-hidden rounded-[36px] bg-[linear-gradient(120deg,#4a30d8_0%,#8a2fa8_55%,#c42a6c_100%)] px-6 py-10 text-white ph:p-14">
          <div className="flex max-w-[640px] flex-col gap-4">
            <h2
              id="mentor-title"
              className="font-display text-[34px] leading-10 font-extrabold tracking-[-0.03em] ph:text-[46px] ph:leading-[50px]"
            >
              Learning is easier with someone in your corner.
            </h2>
            <p className="text-[17px] leading-7 text-[#f6edff]">
              Join a 3-month PractiCode Academy cohort, online or in person. Weekly live classes, real feedback on your
              projects, and people to learn with. ₦80,000 per course.
            </p>
          </div>
          <Link
            href={'/mentors' as Route}
            className="press inline-flex h-14 items-center rounded-full bg-white px-6 text-base font-semibold text-[#07060d] hover:bg-white/90"
          >
            Ask About the Next Cohort
          </Link>
        </div>
      </Container>
    </Section>
  )
}

/** "Choose a plan. Change it whenever." (anchor #pricing) */
export function PricingSection() {
  return (
    <Section id="pricing" labelledBy="pricing-title">
      <Container className="flex flex-col gap-8 ph:gap-12">
        <SectionHeading
          id="pricing-title"
          title="Choose a plan. Change it whenever."
          intro={{ plain: 'Shown in your currency.', accent: 'Cancel in one click, no phone calls.' }}
          accentTone="da"
        />
        <PlanCards />
        <p className="text-center text-[15px] text-ink-muted">
          Money tight right now?{' '}
          <Link href={'/scholarship' as Route} className="font-medium text-fe-text underline underline-offset-2 hover:text-ink">
            Apply for a scholarship.
          </Link>{' '}
          If you qualify, Pro is free.{' '}
          <Link href={'/pricing' as Route} className="text-ink-soft underline underline-offset-2 hover:text-ink">
            Compare every plan
          </Link>
        </p>
      </Container>
    </Section>
  )
}

/** "Your first lesson takes about ten minutes.": the closing band on the landing page. */
export function ClosingBand() {
  return (
    <Section labelledBy="cta-title" className="pb-16 ph:pb-28">
      <Container>
        <div className="relative overflow-hidden rounded-[40px] border border-line bg-sunken px-6 py-16 text-center ph:px-8 ph:py-28">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-(--pc-glow-opacity)"
            style={{
              background:
                'radial-gradient(closest-side at 12% 20%, rgba(77,107,255,0.45), rgba(77,107,255,0) 70%), radial-gradient(closest-side at 88% 22%, rgba(240,64,127,0.40), rgba(240,64,127,0) 70%), radial-gradient(closest-side at 14% 86%, rgba(47,230,176,0.32), rgba(47,230,176,0) 70%), radial-gradient(closest-side at 86% 84%, rgba(123,92,255,0.45), rgba(123,92,255,0) 70%)',
            }}
          />
          <div className="relative mx-auto flex max-w-[760px] flex-col items-center gap-6">
            <Heading level={2} id="cta-title" className="ph:text-[60px] ph:leading-[64px] ph:tracking-[-0.04em]">
              Your first lesson takes about ten minutes.
            </Heading>
            <p className="text-[17px] leading-7 text-ink-soft">No account, no card. Just open a lesson and start.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <LinkButton href={'/onboarding' as Route} size="lg" className="gap-3 px-8">
                Start Learning Free
                <ArrowRight aria-hidden="true" size={18} strokeWidth={1.85} />
              </LinkButton>
              <a href="#tracks" className={buttonClasses({ variant: 'secondary', size: 'lg' }, 'bg-transparent px-6 font-medium')}>
                Explore the Tracks
              </a>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
