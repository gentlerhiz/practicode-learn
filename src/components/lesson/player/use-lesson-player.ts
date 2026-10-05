'use client'
import { useReducer } from 'react'
import type { LessonFile, LessonPack, LessonStep } from '@/lib/lessons/schema'
import type { TestResult } from '@/lib/runner/protocol'

/** What a learner has done on one step. Kept per step, so Back and Continue never lose work. */
export type StepState = {
  hints: number
  selected?: string
  checkedId?: string
  correct?: boolean
  ran?: boolean
  order?: number[]
  orderChecked?: boolean
  solved?: boolean
  results?: TestResult[]
  value?: string
  at?: number
  files?: LessonFile[]
  flipped?: number[]
}

type State = {
  index: number
  furthest: number
  finished: boolean
  steps: Record<number, StepState>
  attempts: Record<string, number>
}

type Action =
  | { type: 'patch'; index: number; patch: Partial<StepState>; attempt?: boolean }
  | { type: 'go'; index: number }
  | { type: 'finish' }
  | { type: 'restart' }

const EMPTY: StepState = { hints: 0 }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'patch': {
      const key = String(action.index)
      return {
        ...state,
        steps: {
          ...state.steps,
          [action.index]: { ...EMPTY, ...state.steps[action.index], ...action.patch },
        },
        attempts: action.attempt
          ? { ...state.attempts, [key]: (state.attempts[key] ?? 0) + 1 }
          : state.attempts,
      }
    }
    case 'go':
      return {
        ...state,
        index: action.index,
        furthest: Math.max(state.furthest, action.index),
        finished: false,
      }
    case 'finish':
      return { ...state, finished: true }
    case 'restart':
      return { index: 0, furthest: 0, finished: false, steps: {}, attempts: {} }
  }
}

/**
 * Completion rules (approved in the review preview): Explain, Diagram and Recap are done on view. Predict
 * is done after Check, plus Run It when it has `run`; being wrong is fine. Question and Explore need the
 * correct option. Order needs the correct order. Code needs every test to pass.
 */
export function isStepDone(step: LessonStep, s: StepState): boolean {
  switch (step.type) {
    case 'explain':
    case 'diagram':
    case 'recap':
      return true
    case 'predict':
      return Boolean(s.checkedId) && (!(step.run && step.files) || Boolean(s.ran))
    case 'question':
    case 'explore':
      return Boolean(s.checkedId) && Boolean(s.correct)
    case 'order':
      return Boolean(s.solved)
    case 'code':
      return Boolean(s.results?.length) && (s.results ?? []).every((r) => r.pass)
  }
}

/** A fixed shuffle, so everyone starts from the same order and it is never already solved. */
export function fixedShuffle(n: number): number[] {
  const order = Array.from({ length: n }, (_, i) => i)
  const shuffled = [...order.slice(1), order[0]!].reverse()
  return shuffled.every((v, i) => v === i) ? shuffled.reverse() : shuffled
}

export function useLessonPlayer(pack: LessonPack, opts: { startAt?: number } = {}) {
  const start = Math.min(Math.max(opts.startAt ?? 0, 0), pack.steps.length - 1)
  const [state, dispatch] = useReducer(reducer, {
    index: start,
    furthest: start,
    finished: false,
    steps: {},
    attempts: {},
  })
  const { index } = state
  const step = pack.steps[index]!
  const current = { ...EMPTY, ...state.steps[index] }
  const canContinue = isStepDone(step, current)
  const patch = (p: Partial<StepState>, attempt = false) =>
    dispatch({ type: 'patch', index, patch: p, attempt })

  const options = 'options' in step ? step.options : []
  // A predict step locks after its first check (the answer is revealed); a question or explore step
  // locks once it is right.
  const locked =
    Boolean(current.checkedId) &&
    (step.type === 'predict' || ((step.type === 'question' || step.type === 'explore') && current.correct))

  return {
    index,
    step,
    total: pack.steps.length,
    state: current,
    canContinue,
    finished: state.finished,
    attempts: state.attempts,
    /** Steps the learner has got past, for the progress record. */
    stepsDone: state.finished ? pack.steps.length : state.furthest,
    select(optionId: string) {
      if (locked) return
      patch({ selected: optionId })
    },
    check(optionId?: string) {
      const id = optionId ?? current.selected
      if (!id || locked) return
      const option = options.find((o) => o.id === id)
      if (!option) return
      patch({ selected: id, checkedId: id, correct: option.correct }, true)
    },
    run() {
      patch({ ran: true })
    },
    /** Shows the next hint: a nudge, then the concept, then a worked example. */
    reveal() {
      const total = 'hints' in step ? step.hints.length : 0
      patch({ hints: Math.min(current.hints + 1, total) })
    },
    setValue(value: string) {
      patch({ value })
    },
    setAt(at: number) {
      patch({ at })
    },
    setFiles(files: LessonFile[]) {
      patch({ files })
    },
    flipCard(card: number) {
      const flipped = current.flipped ?? []
      patch({ flipped: flipped.includes(card) ? flipped.filter((c) => c !== card) : [...flipped, card] })
    },
    moveItem(from: number, to: number) {
      if (step.type !== 'order') return
      const order = [...(current.order ?? fixedShuffle(step.items.length))]
      if (to < 0 || to >= order.length) return
      ;[order[from], order[to]] = [order[to]!, order[from]!]
      patch({ order, orderChecked: false })
    },
    checkOrder(order?: number[]) {
      if (step.type !== 'order') return
      const final = order ?? current.order ?? fixedShuffle(step.items.length)
      patch({ order: final, orderChecked: true, solved: final.every((v, i) => v === i) }, true)
    },
    recordTests(results: TestResult[]) {
      patch({ results }, true)
    },
    next() {
      if (!canContinue) return
      if (index === pack.steps.length - 1) dispatch({ type: 'finish' })
      else dispatch({ type: 'go', index: index + 1 })
    },
    back() {
      if (index > 0) dispatch({ type: 'go', index: index - 1 })
    },
    restart() {
      dispatch({ type: 'restart' })
    },
  }
}

export type LessonPlayerApi = ReturnType<typeof useLessonPlayer>
