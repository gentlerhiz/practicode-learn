import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/auth/require-user', () => ({
  requireUser: async () => ({ id: 'u1', email: 'a@b.c', name: 'A', isAdmin: false, joinedAt: null, plan: null, country: null, prefs: { weeklyEmail: false, currency: null } }),
}))
const deleteUser = vi.fn(async () => ({ error: null }))
vi.mock('@/lib/supabase/admin', () => ({ createAdminClient: () => ({ auth: { admin: { deleteUser } } }) }))
const signOut = vi.fn(async () => ({ error: null }))
const updateUser = vi.fn(async () => ({ error: null }))
const update = vi.fn(() => ({ eq: async () => ({ error: null }) }))
vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({ auth: { signOut, updateUser }, from: () => ({ update }) }),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
const redirect = vi.fn()
vi.mock('next/navigation', () => ({ redirect }))

const { changeEmail, deleteAccount, renameLearner, savePreference } = await import('./actions')

describe('settings actions', () => {
  beforeEach(() => vi.clearAllMocks())

  it('rejects a name longer than 80 characters', async () => {
    const fd = new FormData()
    fd.set('name', 'x'.repeat(81))
    expect(await renameLearner(undefined, fd)).toMatchObject({ error: expect.stringMatching(/80/) })
    expect(update).not.toHaveBeenCalled()
  })

  it('saves a trimmed name', async () => {
    const fd = new FormData()
    fd.set('name', '  Ada Lantern  ')
    expect(await renameLearner(undefined, fd)).toMatchObject({ saved: true })
    expect(update).toHaveBeenCalledWith({ display_name: 'Ada Lantern' })
  })

  it('deletes only after the learner types "delete", signing out everywhere first', async () => {
    const fd = new FormData()
    fd.set('confirm', 'yes')
    expect(await deleteAccount(undefined, fd)).toMatchObject({ error: expect.any(String) })
    expect(deleteUser).not.toHaveBeenCalled()
    fd.set('confirm', 'delete')
    await deleteAccount(undefined, fd)
    expect(signOut).toHaveBeenCalledWith({ scope: 'global' })
    expect(deleteUser).toHaveBeenCalledWith('u1')
    expect(redirect).toHaveBeenCalledWith('/?account=deleted')
  })

  it('saves a known preference to the account', async () => {
    expect(await savePreference('weekly_email', true)).toMatchObject({ saved: true })
    expect(updateUser).toHaveBeenCalledWith({ data: { weekly_email: true } })
    expect(await savePreference('time', 't30')).toMatchObject({ saved: true })
    expect(updateUser).toHaveBeenLastCalledWith({ data: { plan: { goal: 'career', track: 'fe', time: 't30', level: 'l0' } } })
  })

  it('refuses preferences it does not know', async () => {
    expect(await savePreference('role' as never, 'admin')).toMatchObject({ error: expect.any(String) })
    expect(await savePreference('currency', 'BTC')).toMatchObject({ error: expect.any(String) })
    expect(updateUser).not.toHaveBeenCalled()
  })

  it('asks Supabase to confirm a new email address', async () => {
    const fd = new FormData()
    fd.set('email', 'not an email')
    expect(await changeEmail(undefined, fd)).toMatchObject({ error: expect.any(String) })
    fd.set('email', 'New@Example.com')
    expect(await changeEmail(undefined, fd)).toMatchObject({ saved: true })
    expect(updateUser).toHaveBeenCalledWith({ email: 'new@example.com' })
  })
})
