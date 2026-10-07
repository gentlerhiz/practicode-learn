import type { Route } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/layout/logo'
import { site } from '@/lib/site'
import { cn } from '@/lib/cn'

/**
 * The canvas's focused page: a soft glow, a slim bar with the logo and one way out, and the page
 * below it. Sign-in, onboarding and the code pages all use it.
 */
export function AuthFrame({
  aside,
  glow = 'center',
  bordered = true,
  headerWidth = 'max-w-[1200px]',
  center,
  children,
}: {
  aside?: React.ReactNode
  glow?: 'center' | 'right'
  bordered?: boolean
  headerWidth?: string
  /** Something in the middle of the bar, such as onboarding's step meter. */
  center?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      {glow === 'center' ? (
        <div aria-hidden="true" className="glow -top-[360px] left-1/2 h-[860px] w-[1400px] -translate-x-1/2" />
      ) : (
        <div
          aria-hidden="true"
          className="glow -top-[200px] -right-[200px] h-[900px] w-[1100px]"
          style={{
            background:
              'radial-gradient(closest-side at 40% 45%, rgba(77,107,255,0.30), rgba(77,107,255,0) 72%), radial-gradient(closest-side at 70% 70%, rgba(123,92,255,0.22), rgba(123,92,255,0) 72%)',
          }}
        />
      )}
      <header className={cn('relative', bordered && 'border-b border-line-subtle')}>
        <div className={cn('mx-auto flex h-[72px] items-center justify-between gap-4 px-4 ph:px-6', headerWidth)}>
          <Logo compact />
          {center}
          {aside}
        </div>
      </header>
      {children}
    </div>
  )
}

/** The narrow column that holds one card, with the legal links under it. */
export function AuthMain({ children, legal = true }: { children: React.ReactNode; legal?: boolean }) {
  return (
    <main id="main" className="relative mx-auto box-border max-w-[488px] px-4 pt-8 pb-12 ph:px-6 ph:pt-16 ph:pb-20">
      {children}
      {legal && <LegalLinks />}
    </main>
  )
}

export function AuthCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('surface flex flex-col gap-6 rounded-[28px] border border-line p-6 ph:p-10', className)}>
      {children}
    </div>
  )
}

/** Optional icon tile, the title, and the line under it. */
export function AuthHeading({
  icon,
  iconTone = 'neutral',
  title,
  children,
}: {
  icon?: React.ReactNode
  iconTone?: 'neutral' | 'success'
  title: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      {icon && (
        <span
          className={cn(
            'flex size-[52px] shrink-0 items-center justify-center rounded-2xl',
            iconTone === 'success' ? 'bg-[rgba(47,230,176,0.16)] text-success' : 'bg-control text-ink-soft',
          )}
        >
          {icon}
        </span>
      )}
      <h1 className="font-display text-[30px] leading-9 font-extrabold tracking-[-0.03em] text-ink ph:text-[34px] ph:leading-10">
        {title}
      </h1>
      {children && <p className="text-base leading-[26px] text-ink-muted">{children}</p>}
    </div>
  )
}

export function LegalLinks() {
  const link = 'text-ink-muted underline underline-offset-2 hover:text-ink'
  return (
    <p className="mt-6 text-center text-[13px] text-ink-subtle">
      <Link href={'/legal/privacy' as Route} className={link}>
        Privacy
      </Link>
      {' · '}
      <Link href={'/legal/terms' as Route} className={link}>
        Terms
      </Link>
      {' · '}
      <a href={`mailto:${site.email}`} className={link}>
        Help
      </a>
    </p>
  )
}

/** "New here? Create an account" and friends, at the end of the bar. */
export function HeaderPrompt({ text, href, label }: { text?: string; href: Route; label: string }) {
  return text ? (
    <p className="text-sm text-ink-muted">
      {text}{' '}
      <Link href={href} className="font-semibold whitespace-nowrap text-ink underline underline-offset-2 hover:text-ink-soft">
        {label}
      </Link>
    </p>
  ) : (
    <Link href={href} className="text-sm text-ink-muted underline underline-offset-2 hover:text-ink">
      {label}
    </Link>
  )
}

export function OrDivider({ label }: { label: string }) {
  return (
    <div aria-hidden="true" className="flex items-center gap-4 text-[13px] text-ink-subtle">
      <span className="h-px flex-1 bg-divider" />
      {label}
      <span className="h-px flex-1 bg-divider" />
    </div>
  )
}

/** A link that looks like an inline text link: underlined, the soft ink colour. */
export const inlineLink = 'text-ink-soft underline underline-offset-2 hover:text-ink'
