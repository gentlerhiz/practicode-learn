import type { Route } from 'next'
import Link from 'next/link'
import { TutorSpark } from '@/components/learn/tutor-spark'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { Glyph } from '@/components/ui/glyph'
import type { Currency } from '@/content/pricing'
import type { PlanTimeId } from '@/lib/onboarding/plan'
import { cn } from '@/lib/cn'
import { LogOutButton, Pills, Row, SettingsCard, Soon, Switch, Titled, Value, smallButton } from './parts'
import { SettingsNav } from './settings-nav'
import { CountryRow, DeleteRow, EmailRow, GoalPills, NameRow, OfflineList, WeeklySwitch } from './widgets'

export type SettingsData = {
  name: string | null
  email: string | null
  country: string
  currency: Currency
  time: PlanTimeId
  weeklyEmail: boolean
}

const MODES = [
  { id: 'hints', label: 'Hints first, then explain', note: 'Recommended. You still do the thinking, and the full answer is there when you need it.' },
  { id: 'explain', label: 'Explain straight away', note: 'Good for revision, when you already know the idea and want a quick reminder.' },
]

/**
 * PrismSettings. What works today saves straight away; settings for features that haven't launched
 * (reminders, sounds, the tutor, data saver, plans, public profiles) are shown, marked Soon, and locked.
 */
export function SettingsView({ data }: { data: SettingsData }) {
  return (
    <>
      <div>
        <h1 className="font-display text-[30px] leading-9 font-extrabold tracking-[-0.035em] text-ink ph:text-[40px] ph:leading-[44px]">
          Settings
        </h1>
        <p className="mt-1.5 text-base text-ink-muted">Changes save as soon as you make them.</p>
      </div>
      <div className="grid grid-cols-1 items-start gap-8 tab:grid-cols-[200px_minmax(0,1fr)]">
        <SettingsNav />
        <div className="flex flex-col gap-4">
          <SettingsCard id="set-profile" icon="user" title="Profile" intro="This is what appears on your certificates.">
            <NameRow name={data.name} />
            <EmailRow email={data.email} />
            <Row>
              <Value label="Phone" value="Not added" />
              <button type="button" disabled className={smallButton} aria-describedby="phone-soon">
                Add
              </button>
              <span id="phone-soon" className="sr-only">
                Phone sign-in arrives soon
              </span>
            </Row>
            <CountryRow country={data.country} currency={data.currency} />
            <Row>
              <Titled title="Log out" note="Sign out of PractiCode Learn on this device." />
              <LogOutButton />
            </Row>
          </SettingsCard>

          <SettingsCard id="set-learning" icon="target" title="Learning" intro="Small and steady wins. Pick what fits your week.">
            <GoalPills time={data.time} />
            <div className="flex flex-col gap-3 border-t border-line-subtle py-4">
              <Titled title="Appearance" note="Light is easier to read in bright sunlight. Dark is easier on your eyes at night." />
              <ThemeToggle variant="pills" />
            </div>
            <Row>
              <Value label="Reminder" value={<>Off<Soon /></>} />
              <button type="button" disabled className={smallButton}>
                Change
              </button>
            </Row>
            <Row>
              <Titled id="weekly-label" title="Sunday progress email" note="A short note on what you did this week and what is next." />
              <WeeklySwitch on={data.weeklyEmail} />
            </Row>
            <Row>
              <Titled id="sound-label" title="Sounds" note="A soft chime when you get an answer right." soon />
              <Switch on={false} labelledBy="sound-label" disabled />
            </Row>
          </SettingsCard>

          <SettingsCard id="set-tutor" icon="tutor" title="AI tutor" intro="Your tutor knows your lessons and code. Choose how it helps.">
            <div className="flex flex-col gap-3 border-t border-line-subtle py-4">
              <p id="mode-label" className="text-[15px] font-medium text-ink">
                When you ask for help
                <Soon />
              </p>
              <div role="radiogroup" aria-labelledby="mode-label" className="flex flex-col gap-2">
                {MODES.map((m, i) => (
                  <button
                    key={m.id}
                    type="button"
                    role="radio"
                    aria-checked={i === 0}
                    disabled
                    className={cn(
                      'flex cursor-not-allowed items-start gap-3 rounded-2xl border-[1.5px] p-4 text-left',
                      i === 0 ? 'border-[#7b5cff] bg-[rgba(123,92,255,0.12)]' : 'border-line opacity-70',
                    )}
                  >
                    <span className={cn('mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2', i === 0 ? 'border-[#b9a2ff]' : 'border-line-strong')}>
                      {i === 0 && <span className="block size-2 rounded-full bg-[#b9a2ff]" />}
                    </span>
                    <span>
                      <span className="block text-[15px] font-semibold text-ink">{m.label}</span>
                      <span className="mt-1 block text-[13px] leading-5 text-ink-muted">{m.note}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <Row>
              <Titled id="sources-label" title="Show where answers come from" note="Each answer links to the part of the lesson it is based on." soon />
              <Switch on labelledBy="sources-label" disabled />
            </Row>
            <Row>
              <div className="flex min-w-0 items-center gap-3">
                <TutorSpark size={28} />
                <div>
                  <p className="text-[15px] font-medium text-ink">5 questions a day on Free</p>
                  <p className="mt-0.5 text-[13px] text-ink-muted">The tutor arrives soon. Pro will give you 50 a day.</p>
                </div>
              </div>
              <Link href={'/pricing' as Route} className="text-[13px] font-medium whitespace-nowrap text-fe-text underline underline-offset-2 hover:no-underline">
                See Pro
              </Link>
            </Row>
          </SettingsCard>

          <SettingsCard id="set-data" icon="wifi" title="Data and offline" intro="Learn more on less data.">
            <Row>
              <Titled id="saver-label" title="Data saver" note="Diagrams load only when you tap them, and pictures stay small." soon />
              <Switch on={false} labelledBy="saver-label" disabled />
            </Row>
            <Row>
              <Titled id="wifi-label" title="Download on Wi-Fi only" note="Saving modules for offline waits until you are on Wi-Fi." soon />
              <Switch on={false} labelledBy="wifi-label" disabled />
            </Row>
            <OfflineList />
          </SettingsCard>

          <SettingsCard id="set-plan" icon="card" title="Plan and billing" intro="No surprises. We remind you before anything is charged.">
            <Row>
              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-ink">
                  Free
                  <span className="ml-2 rounded-full bg-success-fill px-2 py-0.5 text-[11px] font-bold text-on-success">Your plan</span>
                </p>
                <p className="mt-1 text-[13px] text-ink-muted">Module 1 of every track, for good. Pro launches with the full track.</p>
              </div>
              <Link href={'/pricing' as Route} className={smallButton}>
                See Plans
              </Link>
            </Row>
            <Row>
              <Value label="Payment method" value="None" />
              <button type="button" disabled className={smallButton}>
                Update
              </button>
            </Row>
            <Row>
              <Value label="Receipts" value={data.email ? `None yet. They’ll go to ${data.email}` : 'None yet'} />
              <button type="button" disabled className={smallButton}>
                View
              </button>
            </Row>
          </SettingsCard>

          <SettingsCard id="set-privacy" icon="shield" title="Privacy and your data" intro="Your data is yours. We follow Nigeria’s Data Protection Act 2023 and the GDPR.">
            <div className="flex flex-col gap-3 border-t border-line-subtle py-4">
              <p id="vis-label" className="text-[15px] font-medium text-ink">
                Who can see your profile and certificates
                <Soon />
              </p>
              <Pills
                role="radiogroup"
                labelledBy="vis-label"
                options={[
                  { id: 'me', label: 'Only me' },
                  { id: 'link', label: 'Anyone with the link' },
                ]}
                value="me"
                disabled
              />
            </div>
            <Row>
              <Titled title="Download your data" note="Everything we hold about you, in one file." />
              <a href="/settings/export" download className={smallButton}>
                <Glyph name="download" size={15} />
                Download
              </a>
            </Row>
            <DeleteRow />
          </SettingsCard>
        </div>
      </div>
    </>
  )
}
