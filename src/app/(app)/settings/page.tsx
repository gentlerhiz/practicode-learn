import type { Metadata } from 'next'
import { Card, Heading } from '@/components/ui'
import { requireUser } from '@/lib/auth/require-user'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Settings',
  description: 'Your PractiCode Learn account settings.',
  path: '/settings',
  noindex: true,
})

// A placeholder so sign-in has somewhere to land; Task 17 builds settings.
export default async function SettingsPage() {
  const user = await requireUser()
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <Heading level={1} size="lg">
        Settings
      </Heading>
      <Card className="flex flex-col gap-2">
        <p className="text-sm text-ink-muted">Signed in as</p>
        <p className="text-base font-semibold text-ink">{user.email ?? user.name ?? 'your account'}</p>
      </Card>
      <p className="text-base leading-[26px] text-ink-muted">
        More settings, including exporting and deleting your data, open with Module 1.
      </p>
    </div>
  )
}
