import type { Route } from 'next'
import Link from 'next/link'
import { app } from '@/content/navigation'
import { SkipLink } from '@/components/ui/skip-link'
import { Logo } from './logo'
import { MobileMenu } from './mobile-menu'
import { ThemeToggle } from './theme-toggle'

export type ShellUser = { name: string | null; isAdmin: boolean }

function SignOut() {
  return (
    <form method="post" action="/auth/signout">
      <button
        type="submit"
        className="flex h-12 w-full items-center rounded-[14px] px-3 text-[15px] text-ink-soft hover:bg-row"
      >
        Sign Out
      </button>
    </form>
  )
}

/**
 * The signed-in layout: a sidebar from 1024 px, a top bar with a menu sheet below that.
 * It only links to pages a learner can use today.
 */
export function AppShell({ user, children }: { user: ShellUser; children: React.ReactNode }) {
  const items = user.isAdmin ? [...app, { href: '/admin/impact' as Route, label: 'Impact' }] : app
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[252px_minmax(0,1fr)]">
      <SkipLink />
      <aside className="hidden flex-col gap-8 border-r border-line-subtle bg-sunken px-4 py-6 lg:flex">
        <Logo href={app[0]!.href} className="px-2" />
        <nav aria-label="Main">
          <ul className="flex flex-col gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex h-12 items-center rounded-[14px] px-3 text-[15px] text-ink-soft hover:bg-row"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto flex flex-col gap-2 border-t border-line-subtle pt-4">
          <ThemeToggle variant="row" />
          <SignOut />
          {user.name && <p className="px-3 text-[13px] text-ink-subtle">Signed in as {user.name}</p>}
        </div>
      </aside>
      <div className="flex min-w-0 flex-col">
        <header className="relative flex h-16 items-center justify-between border-b border-line-subtle px-4 lg:hidden">
          <Logo href={app[0]!.href} />
          <MobileMenu items={items} />
        </header>
        <main id="main" className="flex-1 px-4 pt-6 pb-12 sm:px-8 sm:pt-8">
          {children}
        </main>
      </div>
    </div>
  )
}
