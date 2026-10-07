import type { Metadata } from 'next'
import { SettingsView } from '@/components/app/settings/settings-view'
import { AppPage } from '@/components/app/shell/app-shell'
import { CURRENCIES, type Currency } from '@/content/pricing'
import { requireUser } from '@/lib/auth/require-user'
import { parsePlan } from '@/lib/onboarding/plan'
import { pageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'Settings',
  description: 'Your PractiCode Learn account settings.',
  path: '/settings',
  noindex: true,
})

const BY_COUNTRY: Record<string, Currency> = { NG: 'NGN', GH: 'GHS', KE: 'KES', GB: 'GBP' }

/** PrismSettings. */
export default async function SettingsPage() {
  const user = await requireUser()
  const country = user.country ? (new Intl.DisplayNames(['en-GB'], { type: 'region' }).of(user.country) ?? user.country) : 'Not set'
  const saved = user.prefs.currency
  const currency: Currency = saved && saved in CURRENCIES ? (saved as Currency) : (BY_COUNTRY[user.country ?? ''] ?? 'USD')
  return (
    <AppPage>
      <SettingsView
        data={{
          name: user.name,
          email: user.email,
          country,
          currency,
          time: parsePlan(user.plan).time,
          weeklyEmail: user.prefs.weeklyEmail,
        }}
      />
    </AppPage>
  )
}
