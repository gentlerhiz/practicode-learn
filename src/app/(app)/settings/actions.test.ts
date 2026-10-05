import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/auth/require-user', () => ({
  requireUser: async () => ({ id: 'u1', email: 'a@b.c', name: 'A', isAdmin: false }),
}))
const deleteUser = vi.fn(async () => ({ error: null }))
vi.mock('@/lib/supabase/admin', () => ({ createAdminClient: () => ({ auth: { admin: { deleteUser } } }) }))
const signOut = vi.fn(async () => ({ error: null }))
const update = vi.fn(() => ({ eq: async () => ({ error: null }) }))
vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({ auth: { signOut }, from: () => ({ update }) }),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
const redirect = vi.fn()
vi.mock('next/navigation', () => ({ redirect }))

const { deleteAccount, renameLearner } = await import('./actions')

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
})
