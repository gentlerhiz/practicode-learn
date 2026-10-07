import { describe, expect, it } from 'vitest'
import { activeDays, joinedLabel, minutesByDay, moduleShare, weekStart } from './stats'

// Wednesday 7 October 2026, mid-afternoon in Lagos (UTC+1).
const NOW = new Date('2026-10-07T14:00:00Z')

describe('weekStart', () => {
  it('starts the week on Monday', () => {
    expect(weekStart(NOW).toISOString()).toBe('2026-10-05T00:00:00.000Z')
  })
})

describe('activeDays', () => {
  it('marks Monday to Sunday by whether anything happened that day', () => {
    const events = ['2026-10-05T08:00:00Z', '2026-10-05T20:00:00Z', '2026-10-07T09:00:00Z', '2026-10-01T09:00:00Z']
    expect(activeDays(events, NOW)).toEqual([true, false, true, false, false, false, false])
  })
})

describe('minutesByDay', () => {
  it('adds each lesson’s active time to the day it was last worked on, this week only', () => {
    const rows = [
      { updated_at: '2026-10-05T10:00:00Z', active_seconds: 600 },
      { updated_at: '2026-10-05T18:00:00Z', active_seconds: 330 },
      { updated_at: '2026-10-06T10:00:00Z', active_seconds: 1200 },
      { updated_at: '2026-09-30T10:00:00Z', active_seconds: 9999 },
    ]
    expect(minutesByDay(rows, NOW)).toEqual([16, 20, 0, 0, 0, 0, 0])
  })
})

describe('moduleShare', () => {
  it('is the completed share of a module’s lessons, as a whole percentage', () => {
    expect(moduleShare(['completed', 'completed', 'started', 'not_started', 'not_started', 'not_started'])).toBe(33)
    expect(moduleShare([])).toBe(0)
  })
})

describe('joinedLabel', () => {
  it('says today, or the day and month', () => {
    expect(joinedLabel('2026-10-07T08:00:00Z', NOW)).toBe('Free · joined today')
    expect(joinedLabel('2026-10-03T08:00:00Z', NOW)).toBe('Free · joined 3 October')
    expect(joinedLabel(null, NOW)).toBe('Free plan')
  })
})
