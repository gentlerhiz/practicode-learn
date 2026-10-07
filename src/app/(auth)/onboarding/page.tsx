import type { Metadata } from 'next'
import { Onboarding } from '@/components/auth/onboarding'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Choose Your Track',
  description: 'Pick what to learn first and how much time you have. Every track starts free.',
  path: '/onboarding',
  noindex: true,
})

/** PrismOnboarding. */
export default function OnboardingPage() {
  return <Onboarding />
}
