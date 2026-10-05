import type { Metadata } from 'next'
import { Heading } from '@/components/ui'
import { requireUser } from '@/lib/auth/require-user'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Home',
  description: 'Your PractiCode Learn home.',
  path: '/home',
  noindex: true,
})

// A placeholder so sign-in has somewhere to land; Task 17 builds the learner home.
export default async function HomePage() {
  const user = await requireUser()
  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <Heading level={1} size="lg">
        {user.name ? `Welcome, ${user.name}` : 'Welcome'}
      </Heading>
      <p className="text-base leading-[26px] text-ink-muted">
        Your home page, with your progress and next lesson, opens with Module 1.
      </p>
    </div>
  )
}
