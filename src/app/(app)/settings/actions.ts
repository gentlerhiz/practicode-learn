'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { requireUser } from '@/lib/auth/require-user'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export type SettingsState = { error?: string; saved?: boolean } | undefined

const Name = z
  .string()
  .trim()
  .min(1, { error: 'Enter the name you’d like us to use' })
  .max(80, { error: 'Keep your name to 80 characters or fewer' })

/** Changes the learner's name. Row-level security only lets them change their own display_name. */
export async function renameLearner(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const user = await requireUser()
  const parsed = Name.safeParse(formData.get('name') ?? '')
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check your name and try again.' }
  const supabase = await createClient()
  const { error } = await supabase.from('profiles').update({ display_name: parsed.data }).eq('id', user.id)
  if (error) return { error: 'We couldn’t save your name. Try again.' }
  // The form, the greeting and the menu's "Signed in as" all show the new name straight away.
  revalidatePath('/settings')
  revalidatePath('/home')
  return { saved: true }
}

/**
 * Deletes the learner's account once they type "delete". Every session is signed out first (deleting a
 * user doesn't end sessions that already exist), then the account goes, and with it the profile, progress
 * and learning events (on delete cascade). Monthly impact snapshots hold no personal data, so they stay.
 */
export async function deleteAccount(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const confirm = String(formData.get('confirm') ?? '')
    .trim()
    .toLowerCase()
  if (confirm !== 'delete') return { error: 'Type delete to confirm.' }
  const user = await requireUser()
  const supabase = await createClient()
  await supabase.auth.signOut({ scope: 'global' })
  const { error } = await createAdminClient().auth.admin.deleteUser(user.id)
  if (error) return { error: 'We couldn’t delete your account. Email us and we’ll do it for you.' }
  redirect('/?account=deleted')
}
