// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { admin, deleteTestUsers, seedLesson, signedInAs, TEST_TRACK, testEnvReady } from './helpers'

const LESSONS = ['zz-91-01', 'zz-91-02']
const CARD = 'zz-91-01:0000aaaa'
const PROJECT = 'zz-p91'
const passing = [1, 2, 3, 4, 5].map((n) => ({ name: `check ${n}`, pass: true }))

describe.skipIf(!testEnvReady)('courses, review and projects', () => {
  let ada: Awaited<ReturnType<typeof signedInAs>>
  let bola: Awaited<ReturnType<typeof signedInAs>>
  const complete = async (learner: string, lesson: string) => {
    const { error } = await admin().from('lesson_progress').upsert({
      learner_id: learner,
      lesson_id: lesson,
      lesson_version: 1,
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    if (error) throw error
  }

  beforeAll(async () => {
    for (const id of LESSONS) await seedLesson({ id, minutes: 10, steps: 5, version: 1 })
    const db = admin()
    const card = await db
      .from('lesson_cards')
      .upsert({ id: CARD, lesson_id: LESSONS[0]!, position: 0, front: 'Front', back: 'Back' })
    if (card.error) throw card.error
    const project = await db.from('projects').upsert({
      id: PROJECT,
      track_slug: TEST_TRACK,
      module: 91,
      slug: 'test-project',
      title: 'Test project',
      description: 'Seeded by the database tests.',
      version: 1,
      checks: 1,
      bytes: 1,
      hash: 'test',
      pack_path: 'projects/zz-p91/v1.json',
    })
    if (project.error) throw project.error
    ada = await signedInAs('ada')
    bola = await signedInAs('bola')
  })
  afterAll(async () => {
    await deleteTestUsers()
    await admin().from('projects').delete().eq('id', PROJECT)
    await admin().from('lesson_cards').delete().eq('id', CARD)
  })

  it('starting a lesson joins its course', async () => {
    expect((await ada.client.from('enrollments').select('track_slug')).data).toEqual([])
    await complete(ada.id, LESSONS[0]!)
    expect((await ada.client.from('enrollments').select('track_slug')).data).toEqual([
      { track_slug: TEST_TRACK },
    ])
    expect((await bola.client.from('enrollments').select('track_slug')).data).toEqual([])
  })

  it('a review card shows only once its lesson is complete', async () => {
    expect((await ada.client.from('lesson_cards').select('id')).data).toEqual([{ id: CARD }])
    expect((await bola.client.from('lesson_cards').select('id')).data).toEqual([])
  })

  it('learners keep their own review state, and nobody else’s', async () => {
    const mine = await ada.client.from('review_cards').insert({ learner_id: ada.id, card_id: CARD, reps: 1 })
    expect(mine.error).toBeNull()
    const theirs = await ada.client.from('review_cards').insert({ learner_id: bola.id, card_id: CARD })
    expect(theirs.error).not.toBeNull()
    const locked = await bola.client.from('review_cards').insert({ learner_id: bola.id, card_id: CARD })
    expect(locked.error).not.toBeNull()
    expect((await bola.client.from('review_cards').select('card_id')).data).toEqual([])
  })

  it('learners save drafts, but can’t mark their own work passed', async () => {
    const draft = await ada.client.from('project_work').insert({
      learner_id: ada.id,
      project_id: PROJECT,
      project_version: 1,
      files: [{ name: 'index.html', lang: 'html', code: '<h1>Hi</h1>' }],
    })
    expect(draft.error).toBeNull()
    const cheat = await ada.client.from('project_work').update({ status: 'passed' }).eq('project_id', PROJECT)
    expect(cheat.error).not.toBeNull()
    expect((await bola.client.from('project_work').select('project_id')).data).toEqual([])
  })

  it('a project passes only with every check passing and the module’s lessons done', async () => {
    const pass = (results: unknown, review: unknown = [true]) =>
      ada.client.rpc('pass_project', {
        p_project: PROJECT,
        p_results: results as never,
        p_review: review as never,
      })
    expect((await pass([...passing.slice(0, 4), { name: 'x', pass: false }])).error?.message).toMatch(
      /every check/,
    )
    // At least the brief's checks plus one built-in check (a program's runs-without-errors check).
    expect((await pass(passing.slice(0, 1))).error?.message).toMatch(/every check/)
    expect((await pass(passing, [true, false])).error?.message).toMatch(/self-review/)
    expect((await pass(passing)).error?.message).toMatch(/lessons first/)
    await complete(ada.id, LESSONS[1]!)
    expect((await pass(passing)).error).toBeNull()
    const work = await ada.client
      .from('project_work')
      .select('status, passed_at')
      .eq('project_id', PROJECT)
      .single()
    expect(work.data?.status).toBe('passed')
    expect(work.data?.passed_at).not.toBeNull()
  })
})
