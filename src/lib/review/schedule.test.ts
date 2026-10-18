import { describe, expect, it } from 'vitest'
import { daysReviewed, DAILY_CAP, pickSession, previews, rate, untilLabel, type CardState } from './schedule'

const now = new Date('2026-10-19T10:00:00Z')

describe('review scheduling', () => {
  it('brings a forgotten card back within minutes, and a known one days later', () => {
    const again = rate(null, 1, now)
    const easy = rate(null, 4, now)
    expect(new Date(again.due).getTime() - now.getTime()).toBeLessThan(10 * 60_000)
    expect(new Date(easy.due).getTime() - now.getTime()).toBeGreaterThan(2 * 86_400_000)
    expect(easy.reps).toBe(1)
    expect(easy.last_review).toBe(now.toISOString())
  })

  it('stretches the gap each time a card is remembered', () => {
    let state: CardState | null = null
    let at = now
    const gaps: number[] = []
    for (let i = 0; i < 4; i++) {
      state = rate(state, 3, at)
      const due = new Date(state.due)
      gaps.push(due.getTime() - at.getTime())
      at = due
    }
    expect(gaps[3]).toBeGreaterThan(gaps[1]!)
  })

  it('labels each rating with when the card comes back', () => {
    const [again, , , easy] = previews(null, now)
    expect(again).toBe('in 1 min')
    expect(easy).toMatch(/days?$/)
    expect(untilLabel(new Date(now.getTime() + 3 * 86_400_000), now)).toBe('in 3 days')
    expect(untilLabel(new Date(now.getTime() + 90 * 60_000), now)).toBe('in 2 hours')
  })

  it('serves overdue cards first, then new ones in lesson order, up to the daily cap', () => {
    const state = (due: string): CardState => ({ ...rate(null, 3, now), due })
    const cards = [
      { id: 'new-late', order: 30 },
      { id: 'due-recent', order: 1 },
      { id: 'new-early', order: 5 },
      { id: 'due-old', order: 2 },
      { id: 'later', order: 3 },
    ]
    const states = new Map([
      ['due-recent', state('2026-10-19T09:00:00.000Z')],
      ['due-old', state('2026-10-10T09:00:00.000Z')],
      ['later', state('2026-10-25T09:00:00.000Z')],
    ])
    expect(pickSession(cards, states, now).map((c) => c.id)).toEqual([
      'due-old',
      'due-recent',
      'new-early',
      'new-late',
    ])
    const many = Array.from({ length: 50 }, (_, i) => ({ id: `c${i}`, order: i }))
    expect(pickSession(many, new Map(), now)).toHaveLength(DAILY_CAP)
  })

  it('counts the days with a review in the last week', () => {
    expect(
      daysReviewed(
        ['2026-10-19T08:00:00Z', '2026-10-19T09:00:00Z', '2026-10-17T20:00:00Z', '2026-10-01T10:00:00Z'],
        now,
      ),
    ).toBe(2)
  })
})
