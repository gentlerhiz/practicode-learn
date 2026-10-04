import Link from 'next/link'
import { LinkButton } from '@/components/ui/link-button'
import { Container } from '@/components/ui/container'
import { LESSONS_OPEN, guest, primaryCta } from '@/content/navigation'
import { cn } from '@/lib/cn'
import { Logo } from './logo'
import { MobileMenu } from './mobile-menu'
import { ThemeToggle } from './theme-toggle'

/** The guest header: logo, main links, theme switch and the one primary action. */
export function SiteHeader() {
  return (
    <header className="relative z-20">
      <Container className="flex h-[78px] items-center justify-between gap-3 ph:gap-6">
        <Logo />
        <nav aria-label="Main" className="hidden gap-8 text-[15px] tab:flex">
          {guest.map((item) => (
            <Link key={item.href} href={item.href} className="text-ink hover:text-ink-soft">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 ph:gap-3">
          <ThemeToggle variant="icon" className="hidden tab:inline-flex" />
          <LinkButton
            href={primaryCta.href}
            // "Start Free" fits beside the logo on a phone; the longer pre-launch label moves into the menu.
            className={cn('px-3.5 text-sm ph:px-5 ph:text-[15px]', !LESSONS_OPEN && 'hidden ph:inline-flex')}
          >
            {primaryCta.label}
          </LinkButton>
          <MobileMenu items={guest} cta={LESSONS_OPEN ? undefined : primaryCta} className="tab:hidden" />
        </div>
      </Container>
    </header>
  )
}
