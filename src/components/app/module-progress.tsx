import type { Route } from 'next'
import Link from 'next/link'
import { cn } from '@/lib/cn'

export type LessonStatus = 'completed' | 'started' | 'not_started'
export type ModuleLesson = {
  id: string
  number: number
  title: string
  minutes?: number
  description?: string
  href: Route | null
  status: LessonStatus
}

const label = (l: ModuleLesson) =>
  l.status === 'completed'
    ? 'Done'
    : l.status === 'started'
      ? 'In progress'
      : l.href
        ? 'Not started'
        : 'Opens soon'

/** One module's lessons, each with where the learner is: done, in progress, not started, or not open yet. */
export function ModuleProgress({
  number,
  title,
  lessons,
}: {
  number: number
  title: string
  lessons: ModuleLesson[]
}) {
  const done = lessons.filter((l) => l.status === 'completed').length
  return (
    <section aria-labelledby={`module-${number}`} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id={`module-${number}`} className="font-display text-xl font-bold text-ink">
          Module {number}: {title}
        </h2>
        <span className="text-sm text-ink-muted">
          {done} of {lessons.length} done
        </span>
      </div>
      <ol className="flex flex-col gap-2">
        {lessons.map((l) => (
          <li key={l.id} className="flex items-center gap-3 rounded-2xl border border-line bg-row px-4 py-3">
            <span
              aria-hidden="true"
              className={cn(
                'grid size-7 shrink-0 place-items-center rounded-full border text-[13px] font-semibold',
                l.status === 'completed' && 'border-success bg-success/15 text-success',
                l.status === 'started' && 'border-fe text-fe-text',
                l.status === 'not_started' && 'border-line-control text-ink-muted',
              )}
            >
              {l.status === 'completed' ? '✓' : l.number}
            </span>
            <div className="min-w-0 flex-1">
              {l.href ? (
                <Link href={l.href} className="font-semibold text-ink hover:underline">
                  Lesson {l.number}: {l.title}
                </Link>
              ) : (
                <span className="font-semibold text-ink">
                  Lesson {l.number}: {l.title}
                </span>
              )}
              <p className="text-[13px] text-ink-muted">
                {label(l)}
                {l.minutes ? ` · ${l.minutes} min` : ''}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
