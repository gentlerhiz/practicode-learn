import { describe, expect, it } from 'vitest'
import { DEFAULT_PLAN, parsePlan, planSummary } from './plan'

describe('parsePlan', () => {
  it('reads a saved plan', () => {
    expect(parsePlan('{"goal":"build","track":"ux","time":"t30","level":"l2"}')).toEqual({ goal: 'build', track: 'ux', time: 't30', level: 'l2' })
  })

  it('keeps a plan saved before goals existed, with the default goal', () => {
    expect(parsePlan('{"track":"ux","time":"t30","level":"l2"}')).toEqual({ goal: DEFAULT_PLAN.goal, track: 'ux', time: 't30', level: 'l2' })
  })

  it('falls back to the default for anything it does not recognise', () => {
    expect(parsePlan('{"track":"rust","time":"t20","level":"l0"}')).toEqual(DEFAULT_PLAN)
    expect(parsePlan('not json')).toEqual(DEFAULT_PLAN)
    expect(parsePlan(null)).toEqual(DEFAULT_PLAN)
  })
})

describe('planSummary', () => {
  it('describes the default plan as the canvas does', () => {
    expect(planSummary(DEFAULT_PLAN)).toBe(
      'Front-End Web Development, about 2 hours a week. That gets Module 1 done in four or five days. We will start right at the beginning.',
    )
  })

  it('is honest that a track opens later', () => {
    expect(planSummary({ ...DEFAULT_PLAN, track: 'da', time: 't10', level: 'l1' })).toBe(
      'Data Analysis, about 70 minutes a week. Its lessons open soon. Front-End Web Development is ready to start today.',
    )
  })
})
