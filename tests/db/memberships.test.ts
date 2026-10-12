// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { admin, anon, deleteTestUsers, signedInAs, testEnvReady } from './helpers'

const PACK = 'test/zz-pro.json'

describe.skipIf(!testEnvReady)('Pro membership', () => {
  let free: Awaited<ReturnType<typeof signedInAs>>
  let pro: Awaited<ReturnType<typeof signedInAs>>
  beforeAll(async () => {
    free = await signedInAs('free')
    pro = await signedInAs('pro')
    const grant = await admin().from('memberships').insert({ learner_id: pro.id, source: 'granted' })
    if (grant.error) throw grant.error
    const upload = await admin()
      .storage.from('lessons-pro')
      .upload(PACK, new Blob(['{"id":"zz-pro"}'], { type: 'application/json' }), { upsert: true })
    if (upload.error) throw upload.error
  })
  afterAll(async () => {
    await admin().storage.from('lessons-pro').remove([PACK])
    await deleteTestUsers()
  })

  it('a granted membership is Pro, and no membership is Free', async () => {
    expect((await pro.client.rpc('is_pro')).data).toBe(true)
    expect((await free.client.rpc('is_pro')).data).toBe(false)
  })

  it('learners cannot give themselves Pro', async () => {
    const insert = await free.client.from('memberships').insert({ learner_id: free.id, source: 'granted' })
    expect(insert.error).not.toBeNull()
    expect((await free.client.rpc('is_pro')).data).toBe(false)
  })

  it('learners see only their own membership', async () => {
    expect((await free.client.from('memberships').select('learner_id')).data).toEqual([])
    expect((await pro.client.from('memberships').select('learner_id')).data).toEqual([{ learner_id: pro.id }])
  })

  it('Pro ends with the paid period, and a cancelled subscription keeps it until then', async () => {
    const set = (values: { status: string; current_period_end: string | null }) =>
      admin().from('memberships').update(values).eq('learner_id', pro.id)
    const later = new Date(Date.now() + 86_400_000).toISOString()
    const earlier = new Date(Date.now() - 86_400_000).toISOString()

    await set({ status: 'cancelled', current_period_end: later })
    expect((await pro.client.rpc('is_pro')).data).toBe(true)
    await set({ status: 'active', current_period_end: earlier })
    expect((await pro.client.rpc('is_pro')).data).toBe(false)
    await set({ status: 'cancelled', current_period_end: null })
    expect((await pro.client.rpc('is_pro')).data).toBe(false)
    await set({ status: 'active', current_period_end: null })
    expect((await pro.client.rpc('is_pro')).data).toBe(true)
  })

  it('only Pro members can download Pro lesson packs', async () => {
    expect((await pro.client.storage.from('lessons-pro').download(PACK)).error).toBeNull()
    expect((await free.client.storage.from('lessons-pro').download(PACK)).error).not.toBeNull()
    expect((await anon().storage.from('lessons-pro').download(PACK)).error).not.toBeNull()
  })

  it('visitors who are not signed in cannot ask', async () => {
    expect((await anon().rpc('is_pro')).error).not.toBeNull()
  })
})
