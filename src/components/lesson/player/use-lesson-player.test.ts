import { readFileSync } from 'node:fs'
import { act, renderHook } from '@testing-library/react'
import { expect, it } from 'vitest'
import { parsePack } from '@/lib/lessons/schema'
import { useLessonPlayer } from './use-lesson-player'

const pack = parsePack(JSON.parse(readFileSync('content/samples/packs/zz-01-01.json', 'utf8')))
const go = (type: string) => pack.steps.findIndex((s) => s.type === type)
type Choice = { options: { id: string; correct: boolean }[] }

it('a predict step needs a check and a run, but not a right answer', () => {
  const { result } = renderHook(() => useLessonPlayer(pack, { startAt: go('predict') }))
  const wrong = (result.current.step as unknown as Choice).options.find((o) => !o.correct)!
  act(() => result.current.check(wrong.id))
  expect(result.current.canContinue).toBe(false)
  act(() => result.current.run())
  expect(result.current.canContinue).toBe(true)
})

it('a question step needs the right answer', () => {
  const { result } = renderHook(() => useLessonPlayer(pack, { startAt: go('question') }))
  const opts = (result.current.step as unknown as Choice).options
  act(() => result.current.check(opts.find((o) => !o.correct)!.id))
  expect(result.current.canContinue).toBe(false)
  act(() => result.current.check(opts.find((o) => o.correct)!.id))
  expect(result.current.canContinue).toBe(true)
})

it('counts attempts per step for the progress record', () => {
  const { result } = renderHook(() => useLessonPlayer(pack, { startAt: go('question') }))
  const opts = (result.current.step as unknown as Choice).options
  act(() => result.current.check(opts[0]!.id))
  act(() => result.current.check(opts[1]!.id))
  expect(result.current.attempts[String(go('question'))]).toBe(2)
})

it('a code step is done only when every test passes', () => {
  const { result } = renderHook(() => useLessonPlayer(pack, { startAt: go('code') }))
  act(() =>
    result.current.recordTests([
      { name: 'a', pass: true },
      { name: 'b', pass: false },
    ]),
  )
  expect(result.current.canContinue).toBe(false)
  act(() =>
    result.current.recordTests([
      { name: 'a', pass: true },
      { name: 'b', pass: true },
    ]),
  )
  expect(result.current.canContinue).toBe(true)
})

it('explain, diagram and recap steps are done on view; next and back move between steps', () => {
  const { result } = renderHook(() => useLessonPlayer(pack))
  expect(result.current.step.type).toBe('explain')
  expect(result.current.canContinue).toBe(true)
  act(() => result.current.next())
  expect(result.current.index).toBe(1)
  act(() => result.current.back())
  expect(result.current.index).toBe(0)
})

it('will not move past a step that is not done', () => {
  const { result } = renderHook(() => useLessonPlayer(pack, { startAt: go('question') }))
  act(() => result.current.next())
  expect(result.current.index).toBe(go('question'))
})
