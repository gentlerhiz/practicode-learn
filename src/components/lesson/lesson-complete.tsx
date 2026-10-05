'use client'
import type { Route } from 'next'
import Link from 'next/link'
import { ShareButtons } from '@/components/share/share-buttons'
import { Button, Card } from '@/components/ui'
import { GuestSavePrompt } from './guest-save-prompt'
import { Prose } from './parts/prose'

export type NextLesson = { href: Route; title: string; lesson: number; minutes: number }

/**
 * The end of a lesson (ported from PrismTryDone): the time it took, what the learner can now explain,
 * what's next, sharing, and, for guests, how to keep their progress.
 */
export function LessonComplete({
  eyebrow,
  lessonNumber,
  minutes,
  points,
  nextLesson,
  share,
  isGuest,
  lessonPath,
  onRestart,
}: {
  eyebrow: string
  lessonNumber: number
  minutes: number
  points: string[]
  nextLesson?: NextLesson
  share: { url: string; title: string }
  isGuest: boolean
  lessonPath: string
  onRestart: () => void
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-fe-text">{eyebrow}</p>
        <h2 className="font-display text-[30px] leading-9 font-bold tracking-[-0.02em] text-ink ph:text-[38px] ph:leading-[46px]">
          Lesson {lessonNumber} done, in {minutes} {minutes === 1 ? 'minute' : 'minutes'}.
        </h2>
      </div>
      <section aria-labelledby="explain-now" className="flex flex-col gap-3">
        <h3 id="explain-now" className="font-display text-xl font-bold text-ink">
          What you can explain now
        </h3>
        <ul className="flex flex-col gap-2.5">
          {points.map((point, i) => (
            <li key={i} className="flex gap-3 text-[15px] leading-6 text-ink">
              <span aria-hidden="true" className="font-semibold text-success">
                ✓
              </span>
              <Prose html={point} inline />
            </li>
          ))}
        </ul>
      </section>
      {nextLesson && (
        <Card className="flex flex-col gap-1">
          <span className="text-sm text-ink-muted">Up next</span>
          <Link
            href={nextLesson.href}
            className="text-base font-semibold text-ink underline underline-offset-2"
          >
            Lesson {nextLesson.lesson}: {nextLesson.title} · {nextLesson.minutes} min
          </Link>
        </Card>
      )}
      {isGuest && <GuestSavePrompt lessonPath={lessonPath} />}
      <ShareButtons
        url={share.url}
        title={share.title}
        text={`I just finished “${share.title}” on PractiCode Learn.`}
      />
      <div>
        <Button variant="secondary" onClick={onRestart}>
          Start This Lesson Again
        </Button>
      </div>
    </div>
  )
}
