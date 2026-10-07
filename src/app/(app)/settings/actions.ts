'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { requireUser } from '@/lib/auth/require-user'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { parsePlan } from '@/lib/onboarding/plan'

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

const PREFERENCES = {
  weekly_email: z.boolean(),
  time: z.enum(['t10', 't20', 't30', 'tw']),
  currency: z.enum(['NGN', 'GHS', 'KES', 'GBP', 'USD']),
} as const

export type PreferenceKey = keyof typeof PREFERENCES

/**
 * Saves one setting to the learner's account (Supabase user metadata, which only they can change).
 * The daily goal lives inside the onboarding plan, so it updates that.
 */
export async function savePreference(key: PreferenceKey, value: unknown): Promise<SettingsState> {
  const schema = PREFERENCES[key]
  if (!schema) return { error: 'That setting can’t be changed here.' }
  const parsed = schema.safeParse(value)
  if (!parsed.success) return { error: 'That isn’t one of the options.' }
  const user = await requireUser()
  const data = key === 'time' ? { plan: { ...parsePlan(user.plan), time: parsed.data } } : { [key]: parsed.data }
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ data })
  if (error) return { error: 'We couldn’t save that. Try again.' }
  revalidatePath('/settings')
  return { saved: true }
}

const Email = z.email({ error: 'Enter a valid email address' }).max(254)

/** Starts an email change. Supabase emails a link to confirm the new address before it switches. */
export async function changeEmail(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const parsed = Email.safeParse(String(formData.get('email') ?? '').trim().toLowerCase())
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Enter a valid email address' }
  await requireUser()
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ email: parsed.data })
  if (error) return { error: error.status === 429 ? 'Too many attempts. Wait a minute and try again.' : 'We couldn’t change your email. Try again.' }
  return { saved: true }
}
