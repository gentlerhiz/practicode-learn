import type { Metadata } from 'next'
import { Onboarding, type OnboardingStep } from '@/components/auth/onboarding'
import { catalogue } from '@/content/catalogue'
import { liveTracks } from '@/content/tracks'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Choose Your Course',
  description: 'Pick what to learn first and how much time you have. Every course starts free.',
  path: '/onboarding',
  noindex: true,
})

const toStep = (value: unknown): OnboardingStep => (value === '2' ? 2 : value === '3' ? 3 : 1)

/** Onboarding in three steps (?step=1, 2 or 3). Step 2 is PrismOnboarding. */
export default async function OnboardingPage({ searchParams }: PageProps<'/onboarding'>) {
  const { step } = await searchParams
  // Each open course's Module 1, by course code, for the plan on step 3.
  const firstModules = Object.fromEntries(
    liveTracks().map((t) => {
      const first = t.modules[0]!
      const code = catalogue.find((c) => c.slug === t.slug)!.code
      return [code, { title: first.title, lessons: first.lessons.map((l) => l.title), project: first.project }]
    }),
  )
  return <Onboarding step={toStep(step)} firstModules={firstModules} />
}
