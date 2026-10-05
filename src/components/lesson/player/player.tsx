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
import { ProgressBar } from './progress-bar'
import { StepNav } from './step-nav'
import { fixedShuffle, useLessonPlayer, type LessonPlayerApi } from './use-lesson-player'

export type LessonEvent = {
  verb: 'lesson_started' | 'lesson_completed'
  stepsDone: number
  attempts: Record<string, number>
}

const STAGE: Record<string, string> = {
  hook: 'Hook',
  predict: 'Predict',
  run: 'Run',
  investigate: 'Investigate',
  modify: 'Modify',
  make: 'Make',
  apply: 'Apply',
  recap: 'Recap',
}
const TRACK: Record<string, string> = { 'front-end-web-development': 'Front-End', samples: 'Samples' }

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

/**
 * Plays a lesson pack one step at a time. Continue unlocks when a step is done (see isStepDone); Enter
 * continues too, unless the learner is typing or using a control. Reports when the lesson starts and
 * finishes, with the steps done and the attempts per step, for the progress record.
 */
export function LessonPlayer({
  pack,
  onEvent,
  onFinish,
  startAt,
  next,
}: {
  pack: LessonPack
  onEvent: (event: LessonEvent) => void
  onFinish: () => void
  startAt?: number
  next?: { href: Route; title: string }
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
      if (e.key !== 'Enter' || target?.closest?.('input, textarea, select, button, a, [data-lab]')) return
      if (!latest.current.api.canContinue || latest.current.api.finished) return
      e.preventDefault()
      latest.current.api.next()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const crumbs = (
    <p className="text-sm text-ink-muted">
      <span className="font-semibold text-fe-text">{TRACK[pack.track] ?? pack.track}</span> · Module{' '}
      {pack.module} · Lesson {pack.lesson} · {pack.minutes} min
    </p>
  )

  if (api.finished) {
    return (
      <section aria-labelledby="lesson-title" className="mx-auto flex max-w-3xl flex-col gap-5">
        {crumbs}
        <article ref={article} tabIndex={-1} className="flex flex-col gap-4 outline-none">
          <h1 id="lesson-title" className="font-display text-3xl font-bold text-ink">
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
    )
  }

  return (
    <section aria-labelledby="lesson-title" className="mx-auto flex max-w-3xl flex-col gap-5">
      <div className="flex flex-col gap-3">
        {crumbs}
        <h1
          id="lesson-title"
          className="font-display text-[28px] leading-9 font-bold tracking-[-0.02em] text-ink ph:text-[34px] ph:leading-10"
        >
          {pack.title}
        </h1>
        <ProgressBar index={api.index} total={api.total} />
        <p className="text-sm text-ink-muted">
          <span className="font-semibold text-ink">
            Step {api.index + 1} of {api.total}
          </span>{' '}
          · {STAGE[api.step.stage]}
        </p>
      </div>
      <article
        ref={article}
        key={api.index}
        tabIndex={-1}
        aria-label={`Step ${api.index + 1}, ${STAGE[api.step.stage]}`}
        className="outline-none"
      >
        <Step api={api} />
      </article>
      <StepNav
        canBack={api.index > 0}
        canContinue={api.canContinue}
        last={api.index === api.total - 1}
        onBack={api.back}
        onNext={api.next}
      />
    </section>
  )
}
