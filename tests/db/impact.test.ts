// @vitest-environment node
import { afterAll, describe, expect, it } from 'vitest'
import { admin, deleteAfterRun, deleteTestUsers, signedInAs, testEnvReady } from './helpers'

describe.skipIf(!testEnvReady)('impact figures', () => {
  afterAll(deleteTestUsers)

  it('counts a learner only once they confirm their email, not when they ask for a code', async () => {
    const db = admin()
    const { data, error } = await db.auth.admin.createUser({
      email: `unconfirmed-${Date.now()}@test.practicode.tech`,
      email_confirm: false,
    })
    if (error) throw error
    deleteAfterRun(data.user.id)
    const before = await db.from('profiles').select('id').eq('id', data.user.id)
    expect(before.data).toHaveLength(0)

    await db.auth.admin.updateUserById(data.user.id, { email_confirm: true })
    const after = await db.from('profiles').select('id').eq('id', data.user.id)
    expect(after.data).toHaveLength(1)
  })

  it('admins can read the impact figures and the countries table', async () => {
    const lead = await signedInAs('impact-admin')
    await admin().from('profiles').update({ role: 'admin' }).eq('id', lead.id)
    const summary = await lead.client.rpc('impact_summary')
    expect(summary.error).toBeNull()
    expect(summary.data).toMatchObject({ registered_learners: expect.any(Number) })
    const countries = await lead.client.rpc('impact_countries')
    expect(countries.error).toBeNull()
  })
})
