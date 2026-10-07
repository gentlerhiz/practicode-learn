import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { footer, isExternal } from '@/content/navigation'
import { LogoIcon, Wordmark } from './logo'

const linkClass = 'text-ink-subtle transition-colors hover:text-ink'

export function SiteFooter() {
  return (
    <footer className="border-t border-line-subtle">
      <Container className="flex flex-col gap-12 pt-16 pb-8">
        <div className="grid grid-cols-1 gap-8 ph:grid-cols-2 tab:grid-cols-4">
          <div className="flex flex-col gap-4">
            <span className="flex items-center gap-3">
              <LogoIcon />
              <Wordmark />
            </span>
            <p className="text-sm leading-[22px] text-ink-subtle">
              Learn the skills employers are hiring for, by actually doing them.
            </p>
          </div>
          {footer.map((group) => (
            <nav key={group.heading} aria-label={group.heading} className="flex flex-col gap-3 text-sm">
              <h3 className="mb-1 text-sm font-semibold text-ink">{group.heading}</h3>
              {group.links.map((link) =>
                isExternal(link) ? (
                  <a key={link.label} href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.label} href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                ),
              )}
            </nav>
          ))}
        </div>
        <p className="border-t border-line-subtle pt-6 text-[13px] text-ink-subtle">
          © 2026 PractiCode. Frameworks are named to show alignment, not endorsement.
        </p>
      </Container>
    </footer>
  )
}
