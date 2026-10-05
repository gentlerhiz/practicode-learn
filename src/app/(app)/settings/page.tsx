import type { Metadata } from 'next'
import { DangerZone } from '@/components/app/danger-zone'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { buttonClasses, Card, Heading } from '@/components/ui'
import { requireUser } from '@/lib/auth/require-user'
import { pageMetadata } from '@/lib/seo/metadata'
import { NameForm } from './name-form'

export const metadata: Metadata = pageMetadata({
  title: 'Settings',
  description: 'Your PractiCode Learn account settings.',
  path: '/settings',
  noindex: true,
})

const sectionTitle = 'font-display text-lg font-bold text-ink'

/** Ported from PrismSettings, keeping what works today: name, appearance, your data and deletion. */
export default async function SettingsPage() {
  const user = await requireUser()
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <Heading level={1} size="lg">
        Settings
      </Heading>
      <Card as="section" aria-labelledby="profile" className="flex flex-col gap-5">
        <h2 id="profile" className={sectionTitle}>
          Profile
        </h2>
        <NameForm name={user.name} />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-ink-soft">Email</p>
          <p className="text-[15px] text-ink">{user.email ?? 'Not set'}</p>
        </div>
      </Card>
      <Card as="section" aria-labelledby="appearance" className="flex flex-col gap-3">
        <h2 id="appearance" className={sectionTitle}>
          Appearance
        </h2>
        <p className="text-[15px] leading-6 text-ink-soft">
          Light is easier to read in bright sunlight. Dark is easier on your eyes at night.
        </p>
        <ThemeToggle variant="segmented" />
      </Card>
      <Card as="section" aria-labelledby="your-data" className="flex flex-col gap-3">
        <h2 id="your-data" className={sectionTitle}>
          Your data
        </h2>
        <p className="text-[15px] leading-6 text-ink-soft">
          Download everything we hold about your learning: your profile, your progress and your learning
          history, as a file you can keep.
        </p>
        <div>
          <a href="/settings/export" download className={buttonClasses({ variant: 'secondary' })}>
            Download My Data
          </a>
        </div>
      </Card>
      <DangerZone />
    </div>
  )
}
