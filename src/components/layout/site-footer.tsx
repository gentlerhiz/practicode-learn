import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { footer, isExternal } from '@/content/navigation'
import { LogoIcon, Wordmark } from './logo'

const trackDots = ['bg-[#4d6bff]', 'bg-[#2fe6b0]', 'bg-[#f0407f]', 'bg-[#7b5cff]']

export function SiteFooter() {
  return (
    <footer className="border-t border-line-subtle">
      <Container className="flex flex-col gap-12 pt-16 pb-8">
        <div className="grid grid-cols-2 gap-8 tab:grid-cols-4">
          <div className="col-span-2 flex flex-col gap-4 tab:col-span-1">
            <span className="flex items-center gap-3">
              <LogoIcon />
              <Wordmark />
            </span>
            <span aria-hidden="true" className="flex gap-1.5">
              {trackDots.map((dot) => (
                <span key={dot} className={`size-3.5 rounded-[5px] ${dot}`} />
              ))}
            </span>
            <p className="text-sm leading-[22px] text-ink-subtle">
              Learn the skills employers are hiring for, by actually doing them.
            </p>
          </div>
          {footer.map((group) => (
            <nav key={group.heading} aria-label={group.heading} className="flex flex-col gap-3 text-sm">
              <h2 className="mb-1 text-sm font-semibold text-ink">{group.heading}</h2>
              {group.links.map((link) =>
                isExternal(link) ? (
                  <a key={link.href} href={link.href} className="text-ink-subtle hover:text-ink">
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.href} href={link.href} className="text-ink-subtle hover:text-ink">
                    {link.label}
                  </Link>
                ),
              )}
            </nav>
          ))}
        </div>
        <p className="border-t border-line-subtle pt-6 text-[13px] text-ink-subtle">
          © 2026 Practicode Consult Limited. Frameworks are named to show alignment, not endorsement.
        </p>
      </Container>
    </footer>
  )
}
