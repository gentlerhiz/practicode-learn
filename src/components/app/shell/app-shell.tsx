import type { Route } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/layout/logo'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { SkipLink } from '@/components/ui/skip-link'
import { NavList, TabBar } from './app-nav'
import { IMPACT_NAV, MAIN_NAV, SETTINGS_NAV, TAB_NAV } from './nav-items'
import { ShellProvider, TopBar, type SearchEntry } from './top-bar'

export type ShellUser = {
  name: string | null
  email: string | null
  isAdmin: boolean
  /** "Free · joined today" and the like. */
  status: string
  /** Days left of a Pro trial, when there is one: the sidebar then shows the trial card. */
  trialDaysLeft?: number
  reviewDue?: number
}

export function initials(name: string | null, email: string | null) {
  const words = (name ?? '').trim().split(/\s+/).filter(Boolean)
  if (words.length >= 2) return `${words[0]![0]}${words.at(-1)![0]}`.toUpperCase()
  if (words[0]) return words[0].slice(0, 2).toUpperCase()
  return (email ?? '?').slice(0, 2).toUpperCase()
}

function AccountCard({ user, className }: { user: ShellUser; className?: string }) {
  return (
    <Link href={'/settings' as Route} className={`flex items-center gap-3 rounded-[14px] hover:opacity-85 ${className ?? ''}`}>
      <span
        aria-hidden="true"
        className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-badge text-[13px] font-bold text-on-badge"
      >
        {initials(user.name, user.email)}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-ink">{user.name ?? user.email ?? 'Your account'}</span>
        <span className="block text-xs text-ink-subtle">{user.status}</span>
      </span>
    </Link>
  )
}

/** The canvas's Pro trial card in the sidebar, shown only while a trial is running. */
function TrialCard({ days }: { days: number }) {
  return (
    <div className="flex flex-col gap-2 rounded-[20px] bg-[linear-gradient(140deg,#5a3bea_0%,#9a2f9e_60%,#c42a6c_100%)] p-5 text-white">
      <p className="font-display text-xl font-extrabold">Pro trial</p>
      <p className="text-[13px] leading-5 text-[#f6edff]">
        {days === 1 ? '1 day left' : `${days} days left`}. Your progress stays yours, whatever you decide.
      </p>
      <Link
        href={'/checkout' as Route}
        className="press mt-2 flex h-11 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#07060d] hover:bg-white/90"
      >
        Choose a Plan
      </Link>
    </div>
  )
}

/** The signed-in layout from PrismDashboard: sidebar from 1024 px; top bar, menu and tab bar below that. */
export function AppShell({
  user,
  search,
  children,
}: {
  user: ShellUser
  search: SearchEntry[]
  children: React.ReactNode
}) {
  const main = MAIN_NAV.map((item) => ((item.href as string) === '/review' && user.reviewDue ? { ...item, badge: user.reviewDue } : item))
  const lower = user.isAdmin ? [SETTINGS_NAV, IMPACT_NAV] : [SETTINGS_NAV]
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[360px] -right-[240px] h-[760px] w-[1000px] opacity-(--pc-glow-opacity)"
        style={{
          background:
            'radial-gradient(closest-side at 35% 50%, rgba(77,107,255,0.24), rgba(77,107,255,0) 75%), radial-gradient(closest-side at 70% 55%, rgba(240,64,127,0.18), rgba(240,64,127,0) 75%)',
        }}
      />
      <SkipLink />
      <div className="relative lg:grid lg:min-h-dvh lg:grid-cols-[252px_minmax(0,1fr)]">
        <aside className="hidden flex-col gap-8 border-r border-line-subtle bg-sheet px-4 py-6 lg:flex">
          <Logo href={'/home' as Route} className="px-2" />
          <nav aria-label="Main">
            <NavList items={main} />
          </nav>
          {user.trialDaysLeft ? <TrialCard days={user.trialDaysLeft} /> : null}
          <div className="flex flex-col gap-2 border-t border-line-subtle pt-4">
            <ul>
              {lower.map((item) => (
                <li key={item.href}>
                  <NavList items={[item]} />
                </li>
              ))}
              <li>
                <ThemeToggle variant="item" />
              </li>
            </ul>
            <AccountCard user={user} className="px-2 pt-3" />
          </div>
        </aside>
        <ShellProvider
          value={{
            entries: search,
            menuItems: [...main, ...lower],
            account: <AccountCard user={user} />,
            initials: initials(user.name, user.email),
          }}
        >
          <div className="flex min-w-0 flex-col">
            {children}
            <TabBar items={TAB_NAV} />
          </div>
        </ShellProvider>
      </div>
    </div>
  )
}

/**
 * One signed-in page: its top bar (the full bar only on the dashboard, as designed; a slim phone bar
 * everywhere else) and its main column.
 */
export function AppPage({
  topBar = 'compact',
  width = 'max-w-[1180px]',
  className,
  children,
}: {
  topBar?: 'full' | 'compact'
  width?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <>
      <TopBar variant={topBar} />
      <main
        id="main"
        className={`box-border flex w-full flex-1 flex-col gap-4 px-4 pt-6 pb-10 lg:gap-6 lg:p-8 ${width} ${className ?? ''}`}
      >
        {children}
      </main>
    </>
  )
}
