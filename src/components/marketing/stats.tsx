import Link from 'next/link'
import type { Route } from 'next'
import { ArrowUpRight } from 'lucide-react'
import { Icon } from '@/components/ui/icon'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { landing } from '@/content/landing'
import { cn } from '@/lib/cn'
import { SectionHeading } from './section-heading'

const backgrounds = {
  fe: '[background:var(--pc-stat-fe)]',
  da: '[background:var(--pc-stat-da)]',
  ux: '[background:var(--pc-stat-ux)]',
  ai: '[background:var(--pc-card-ai)]',
} as const

const linkClass =
  'press inline-flex h-[42px] items-center rounded-full border border-white/30 px-5 text-sm font-medium text-white hover:border-white/60 hover:bg-white/10'

/** "Small numbers. Big difference.": three figures that are true today, each with where it comes from. */
export function Stats() {
  const { stats } = landing
  return (
    <Section labelledBy="stats-title">
      <Container className="flex flex-col gap-8 ph:gap-12">
        <SectionHeading id="stats-title" title={stats.title} intro={stats.intro} accentTone="da" />
        <div className="grid grid-cols-1 gap-4 ph:gap-6 tab:grid-cols-3">
          {stats.cards.map((card) => {
            const external = card.link.href.startsWith('http')
            return (
              <article
                key={card.label}
                className={cn(
                  'flex flex-col items-center gap-4 rounded-[30px] border border-line p-6 text-center text-white ph:p-8',
                  backgrounds[card.tone],
                )}
              >
                <p className="rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs font-medium">
                  {card.label}
                </p>
                <p className="flex items-center gap-1.5 font-display text-[64px] leading-[72px] font-extrabold tracking-[-0.045em] ph:text-[80px] ph:leading-[86px]">
                  {card.figure}
                  {external && <Icon as={ArrowUpRight} size={36} />}
                </p>
                <p className="text-[15px] text-white/90">{card.caption}</p>
                <span aria-hidden="true" className="block h-px w-full bg-white/15" />
                <p className="text-sm leading-[22px] text-white/80">{card.body}</p>
                {external ? (
                  <a
                    href={card.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(linkClass, 'mt-auto')}
                    aria-label={
                      'description' in card.link ? `${card.link.label}: ${card.link.description}` : undefined
                    }
                  >
                    {card.link.label}
                  </a>
                ) : (
                  <Link href={card.link.href as Route} className={cn(linkClass, 'mt-auto')}>
                    {card.link.label}
                  </Link>
                )}
              </article>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
