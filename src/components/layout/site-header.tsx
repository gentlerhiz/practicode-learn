import Link from 'next/link'
import { guest } from '@/content/navigation'
import { AccountActions } from './account-actions'
import { Logo } from './logo'
import { MobileMenu } from './mobile-menu'
import { ThemeToggle } from './theme-toggle'

/** PrismLanding's header: logo, five links, theme switch, Log In and Start Free (menu under 960 px). */
export function SiteHeader() {
  return (
    <header className="relative z-20">
      <div className="mx-auto flex h-[78px] max-w-[1240px] items-center justify-between gap-3 px-4 ph:gap-6 ph:px-6">
        <Logo />
        <nav aria-label="Main" className="hidden gap-8 text-[15px] tab:flex">
          {guest.map((item) => (
            <Link key={item.href} href={item.href} className="text-ink transition-colors hover:text-ink-muted">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 ph:gap-3">
          <ThemeToggle variant="icon" className="hidden tab:inline-flex" />
          <AccountActions />
          <MobileMenu items={guest} className="tab:hidden" />
        </div>
      </div>
    </header>
  )
}
