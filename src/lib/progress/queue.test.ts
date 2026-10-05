import { beforeEach, describe, expect, it } from 'vitest'
import { createQueue } from './queue'
import type { ProgressEvent } from './types'

const ev = (id: string): ProgressEvent => ({
  id,
  lessonId: 'fe-01-01',
  lessonVersion: 1,
  verb: 'lesson_started',
  occurredAt: new Date().toISOString(),
  stepsDone: 1,
  activeSeconds: 30,
  attempts: {},
  offline: false,
})

describe('progress queue', () => {
  beforeEach(() => localStorage.clear())

  it('keeps events when the learner is signed out, and sends them after sign-in', async () => {
    const q = createQueue(localStorage)
    q.enqueue(ev('a'))
    q.enqueue(ev('b'))
    expect(await q.flush(async () => 'auth')).toMatchObject({ sent: 0, left: 2, needsAuth: true })
    expect(createQueue(localStorage).pending()).toHaveLength(2) // survives a reload
    expect(await q.flush(async () => 'ok')).toMatchObject({ sent: 2, left: 0, needsAuth: false })
  })

  it('never stores the same event twice', () => {
    const q = createQueue(localStorage)
    q.enqueue(ev('a'))
    q.enqueue(ev('a'))
    expect(q.pending()).toHaveLength(1)
  })

  it('stops at the first failure so events stay in order', async () => {
    const q = createQueue(localStorage)
    ;['a', 'b', 'c'].forEach((id) => q.enqueue(ev(id)))
    const sent: string[] = []
    await q.flush(async (e) => (e.id === 'b' ? 'retry' : (sent.push(e.id), 'ok')))
    expect(sent).toEqual(['a'])
    expect(q.pending().map((e) => e.id)).toEqual(['b', 'c'])
  })

  it('drops events older than 30 days, which the server would refuse', async () => {
    const q = createQueue(localStorage)
    q.enqueue({ ...ev('old'), occurredAt: new Date(Date.now() - 31 * 864e5).toISOString() })
    expect(q.pending()).toHaveLength(0)
  })

  it('keeps an event recorded while earlier ones are being sent', async () => {
    const q = createQueue(localStorage)
    q.enqueue(ev('a'))
    await q.flush(async () => {
      q.enqueue(ev('late')) // the lesson saves again while the network call is in flight
      return 'ok'
    })
    expect(q.pending().map((e) => e.id)).toEqual(['late'])
  })

  it('survives corrupted storage', () => {
    localStorage.setItem('pc-progress-v1', '{nope')
    expect(createQueue(localStorage).pending()).toEqual([])
  })
})
