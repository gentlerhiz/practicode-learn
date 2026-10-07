'use client'
import type { Route } from 'next'
import { useEffect, useRef } from 'react'
import { Button, LinkButton } from '@/components/ui'
import type { LessonPack } from '@/lib/lessons/schema'
import { ChoiceStep } from '../steps/choice'
import { CodeStep } from '../steps/code'
import { DiagramStep } from '../steps/diagram'
import { ExplainStep } from '../steps/explain'
import { ExploreStep } from '../steps/explore'
import { OrderStep } from '../steps/order'
import { RecapStep } from '../steps/recap'
import { stageName } from '../parts/step-layout'
import { LessonBar, type LessonChrome } from './lesson-bar'
import { LessonFooter } from './lesson-footer'
import { fixedShuffle, useLessonPlayer, type LessonPlayerApi } from './use-lesson-player'

export type { LessonChrome }

export type LessonEvent = {
  verb: 'lesson_started' | 'lesson_completed'
  stepsDone: number
  attempts: Record<string, number>
}

function Step({ api }: { api: LessonPlayerApi }) {
  const { step, index } = api
  switch (step.type) {
    case 'explain':
      return <ExplainStep step={step} />
    case 'predict':
    case 'question':
      return <ChoiceStep step={step} index={index} api={api} />
    case 'explore':
      return <ExploreStep step={step} index={index} api={api} />
    case 'diagram':
      return <DiagramStep step={step} api={api} />
    case 'order':
      return (
        <OrderStep
          step={step}
          initialOrder={api.state.order ?? fixedShuffle(step.items.length)}
          initiallySolved={api.state.solved}
          hintsShown={api.state.hints}
          onSolved={() => {}}
          onCheck={api.checkOrder}
        />
      )
    case 'code':
      return <CodeStep step={step} api={api} />
    case 'recap':
      return <RecapStep step={step} api={api} />
  }
}

// Steps without a drawing or code card are one centred column (see StepGrid); the guest note follows it.
const singleColumn = (step: LessonPack['steps'][number]) =>
  step.type === 'explain' || step.type === 'recap' || step.type === 'order' || ((step.type === 'predict' || step.type === 'question') && !step.files)

const hintsIn = (step: LessonPack['steps'][number]) => ('hints' in step ? step.hints.length : 0)

/**
 * Plays a lesson pack inside the canvas frame (PrismTryLesson / PrismLesson): a header with the step
 * pips and Hint, the step itself in the two-column layout, and a sticky footer. Continue unlocks when a
 * step is done (see isStepDone); Enter continues too, unless the learner is typing or using a control.
 * Reports when the lesson starts and finishes, with the steps done and the attempts per step.
 */
export function LessonPlayer({
  pack,
  onEvent,
  onFinish,
  startAt,
  next,
  chrome,
  guestNote,
  complete,
}: {
  pack: LessonPack
  onEvent: (event: LessonEvent) => void
  onFinish: () => void
  startAt?: number
  next?: { href: Route; title: string }
  /** The lesson header's details (guest or learner). Omitted in unit tests, which skip the header. */
  chrome?: LessonChrome
  /** A note shown under the step for guests (their progress is on this device). */
  guestNote?: React.ReactNode
  /** A finish screen to show instead of the default one. It owns its own full-page frame. */
  complete?: (actions: { restart: () => void }) => React.ReactNode
}) {
  const api = useLessonPlayer(pack, { startAt })
  const article = useRef<HTMLElement>(null)
  const latest = useRef({ api, onEvent, onFinish })
  useEffect(() => {
    latest.current = { api, onEvent, onFinish }
  })

  useEffect(() => {
    const { api: a, onEvent: report } = latest.current
    report({ verb: 'lesson_started', stepsDone: a.stepsDone, attempts: a.attempts })
  }, [])

  useEffect(() => {
    if (!api.finished) return
    const { api: a, onEvent: report, onFinish: finish } = latest.current
    report({ verb: 'lesson_completed', stepsDone: a.total, attempts: a.attempts })
    finish()
  }, [api.finished])

  // A new step takes focus, so keyboard and screen-reader users start at its top. Not on first load.
  const firstStep = useRef(true)
  useEffect(() => {
    if (firstStep.current) {
      firstStep.current = false
      return
    }
    article.current?.focus({ preventScroll: true })
    window.scrollTo({ top: 0 })
  }, [api.index, api.finished])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as Element | null
      if (e.key !== 'Enter' || target?.closest?.('input, textarea, select, button, a, [data-lab], summary')) return
      if (!latest.current.api.canContinue || latest.current.api.finished) return
      e.preventDefault()
      latest.current.api.next()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  if (api.finished && complete) return <>{complete({ restart: api.restart })}</>

  return (
    <div className="relative flex min-h-dvh flex-col">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px]"
        style={{
          background:
            'radial-gradient(closest-side at 35% 20%, rgba(77,107,255,0.18), rgba(0,0,0,0) 72%), radial-gradient(closest-side at 70% 10%, rgba(47,230,176,0.10), rgba(0,0,0,0) 72%)',
        }}
      />
      {chrome && !api.finished && (
        <LessonBar
          chrome={chrome}
          index={api.index}
          total={api.total}
          stage={api.step.stage}
          hintsShown={api.state.hints}
          hintsTotal={hintsIn(api.step)}
          onHint={api.reveal}
        />
      )}

      <main id="main" className="relative flex-1">
        <div className="mx-auto w-full max-w-[1280px] px-4 pt-6 pb-10 ph:px-6 ph:pt-8 ph:pb-12">
          {api.finished ? (
            <section aria-labelledby="done-title" className="mx-auto flex max-w-2xl flex-col gap-5">
              <article ref={article} tabIndex={-1} className="flex flex-col gap-4 outline-none">
                <h1 id="done-title" className="font-display text-3xl font-bold text-ink">
                  Lesson complete
                </h1>
                <p className="text-base leading-[26px] text-ink-soft">
                  You finished <strong className="font-semibold text-ink">{pack.title}</strong>.
                </p>
                <div className="flex flex-wrap gap-3">
                  {next && <LinkButton href={next.href}>Next: {next.title}</LinkButton>}
                  <Button variant="secondary" onClick={api.restart}>
                    Start This Lesson Again
                  </Button>
                </div>
              </article>
            </section>
          ) : (
            <>
              <h1 className="sr-only">{pack.title}</h1>
              <article
                ref={article}
                key={api.index}
                tabIndex={-1}
                aria-label={`Step ${api.index + 1}, ${stageName(api.step.stage)}`}
                className="outline-none"
              >
                <Step api={api} />
              </article>
              {guestNote && (
                <div className={singleColumn(api.step) ? 'mx-auto mt-8 w-full max-w-[720px]' : 'mt-8'}>{guestNote}</div>
              )}
            </>
          )}
        </div>
      </main>

      {!api.finished && (
        <LessonFooter
          canBack={api.index > 0}
          canContinue={api.canContinue}
          last={api.index === api.total - 1}
          onBack={api.back}
          onNext={api.next}
        />
      )}
    </div>
  )
}
