import type { Route } from 'next'
import { Card, LinkButton } from '@/components/ui'

/** The one thing to do next: carry on with a lesson, or start the first one. */
export function ResumeCard({
  eyebrow,
  title,
  summary,
  href,
  action,
}: {
  eyebrow: string
  title: string
  summary: string
  href?: Route
  action?: string
}) {
  return (
    <Card padding="lg" className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-fe-text">{eyebrow}</p>
      <h2 className="font-display text-2xl leading-8 font-bold text-ink">{title}</h2>
      <p className="text-[15px] leading-6 text-ink-soft">{summary}</p>
      {href && action && (
        <div className="pt-1">
          <LinkButton href={href}>{action}</LinkButton>
        </div>
      )}
    </Card>
  )
}
