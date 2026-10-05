// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { admin, anon, deleteTestUsers, seedLesson, signedInAs, testEnvReady } from './helpers'

describe.skipIf(!testEnvReady)('row-level security', () => {
  let a: Awaited<ReturnType<typeof signedInAs>>
  let b: Awaited<ReturnType<typeof signedInAs>>
  beforeAll(async () => {
    await seedLesson({ id: 'zz-01-01', minutes: 10, steps: 9, version: 1 })
    a = await signedInAs('learner-a')
    b = await signedInAs('learner-b')
  })
  afterAll(deleteTestUsers)

  it('anyone can read the catalogue', async () => {
    const { data, error } = await anon().from('lessons').select('id').eq('id', 'zz-01-01')
    expect(error).toBeNull()
    expect(data).toHaveLength(1)
  })

  it('learners cannot write progress directly', async () => {
    const { error } = await a.client
      .from('lesson_progress')
      .insert({ learner_id: a.id, lesson_id: 'zz-01-01', lesson_version: 1, status: 'completed' })
    expect(error).not.toBeNull()
  })

  it('a repeated event changes nothing', async () => {
    const args = {
      p_event_id: crypto.randomUUID(),
      p_lesson_id: 'zz-01-01',
      p_lesson_version: 1,
      p_verb: 'lesson_started',
      p_occurred_at: new Date().toISOString(),
      p_steps_done: 2,
      p_active_seconds: 60,
      p_attempts: {},
    }
    await a.client.rpc('record_progress', args)
    await a.client.rpc('record_progress', args)
    const { data } = await a.client
      .from('lesson_progress')
      .select('active_seconds')
      .eq('lesson_id', 'zz-01-01')
      .single()
    expect(data?.active_seconds).toBe(60)
  })

  it('caps time so nobody can claim hours they did not spend', async () => {
    await a.client.rpc('record_progress', {
      p_event_id: crypto.randomUUID(),
      p_lesson_id: 'zz-01-01',
      p_lesson_version: 1,
      p_verb: 'lesson_completed',
      p_occurred_at: new Date().toISOString(),
      p_steps_done: 99,
      p_active_seconds: 999_999,
      p_attempts: {},
    })
    const { data } = await a.client
      .from('lesson_progress')
      .select('active_seconds, steps_done, status')
      .eq('lesson_id', 'zz-01-01')
      .single()
    expect(data?.active_seconds).toBeLessThanOrEqual(10 * 60 * 10)
    expect(data?.steps_done).toBe(9)
    expect(data?.status).toBe('completed')
  })

  it('learners only ever see their own progress', async () => {
    const { data } = await b.client.from('lesson_progress').select('learner_id')
    expect(data?.every((r) => r.learner_id === b.id)).toBe(true)
  })

  it('learners cannot make themselves admins', async () => {
    await a.client
      .from('profiles')
      .update({ role: 'admin' } as never)
      .eq('id', a.id)
    const { data } = await admin().from('profiles').select('role').eq('id', a.id).single()
    expect(data?.role).toBe('learner')
  })

  it('impact figures are for admins only', async () => {
    const { error } = await a.client.rpc('impact_summary')
    expect(error?.code).toBe('42501')
  })

  it('visitors who are not signed in cannot call the privileged functions', async () => {
    const visitor = anon()
    expect((await visitor.rpc('is_admin')).error).not.toBeNull()
    expect((await visitor.rpc('impact_summary')).error).not.toBeNull()
    const progress = await visitor.rpc('record_progress', {
      p_event_id: crypto.randomUUID(),
      p_lesson_id: 'zz-01-01',
      p_lesson_version: 1,
      p_verb: 'lesson_started',
      p_occurred_at: new Date().toISOString(),
      p_steps_done: 1,
      p_active_seconds: 10,
      p_attempts: {},
    })
    expect(progress.error).not.toBeNull()
  })
})
