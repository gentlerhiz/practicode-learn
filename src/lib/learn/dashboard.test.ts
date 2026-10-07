import { describe, expect, it } from 'vitest'
import { buildDashboard, isNewLearner } from './dashboard'
import type { LearnerTrackData } from './dashboard'

const NOW = new Date('2026-10-07T14:00:00Z')

function track(statuses: string[][], published = 2): LearnerTrackData {
  return {
    trackTitle: 'Front-End Web Development',
    modules: statuses.map((lessons, m) => ({
      number: m + 1,
      title: `Module ${m + 1} title`,
      summary: '',
      free: m === 0,
      project: m === 0 ? 'An "About me" page' : undefined,
      lessons: lessons.map((status, l) => ({
        id: `fe-0${m + 1}-0${l + 1}`,
        number: l + 1,
        title: `Lesson ${m + 1}.${l + 1}`,
        minutes: 10,
        href: m === 0 && l < published ? (`/learn/front-end-web-development/l${l + 1}` as never) : null,
        status: status as never,
      })),
    })),
    progress: [],
    events: [],
  }
}

describe('isNewLearner', () => {
  it('is true until the learner has started a lesson', () => {
    expect(isNewLearner(track([['not_started', 'not_started']]))).toBe(true)
    expect(isNewLearner(track([['started', 'not_started']]))).toBe(false)
  })
})

describe('buildDashboard', () => {
  it('resumes the lesson in progress and counts this week’s active days', () => {
    const data = track([['completed', 'started', 'not_started'], ['not_started']])
    data.progress = [
      { lesson_id: 'fe-01-02', status: 'started', updated_at: '2026-10-06T09:00:00Z', active_seconds: 420, steps_done: 3 },
      { lesson_id: 'fe-01-01', status: 'completed', updated_at: '2026-10-05T09:00:00Z', active_seconds: 600, steps_done: 9 },
    ]
    data.events = ['2026-10-05T09:00:00Z', '2026-10-06T09:00:00Z']
    const view = buildDashboard(data, 'Tolu Adebayo', NOW)
    expect(view.firstName).toBe('Tolu')
    expect(view.resume?.title).toBe('Lesson 1.2')
    expect(view.resume?.action).toBe('Jump Back In')
    expect(view.resume?.modulePct).toBe(33)
    expect(view.week.count).toBe(2)
    expect(view.week.days.slice(0, 3)).toEqual(['fe', 'fe', 'today'])
    expect(view.minutes[0]).toEqual({ day: 'Mon', fe: 10, da: 0 })
  })

  it('never claims a module is mastered while its lessons are unfinished', () => {
    const view = buildDashboard(track([['completed', 'started'], ['not_started']]), null, NOW)
    expect(view.path.nodes[0]).toEqual({ name: 'Module 1 title', state: 'progress', pct: 50 })
    expect(view.path.mastered).toBe(0)
    expect(view.review.due).toBe(0)
  })
})
