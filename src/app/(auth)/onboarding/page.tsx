import type { Metadata } from 'next'
import { Onboarding, type OnboardingStep } from '@/components/auth/onboarding'
import { frontEnd } from '@/content/tracks/front-end-web-development'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Choose Your Track',
  description: 'Pick what to learn first and how much time you have. Every track starts free.',
  path: '/onboarding',
  noindex: true,
})

const toStep = (value: unknown): OnboardingStep => (value === '2' ? 2 : value === '3' ? 3 : 1)

/** Onboarding in three steps (?step=1, 2 or 3). Step 2 is PrismOnboarding. */
export default async function OnboardingPage({ searchParams }: PageProps<'/onboarding'>) {
  const { step } = await searchParams
  const first = frontEnd.modules[0]!
  return (
    <Onboarding
      step={toStep(step)}
      firstModule={{ title: first.title, lessons: first.lessons.map((l) => l.title), project: first.project }}
    />
  )
}
