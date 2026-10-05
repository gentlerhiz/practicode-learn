import { existsSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Database tests run against the hosted dev project (there is no Docker here). The keys come from
// .env.local, which is git-ignored; they never appear in code.
if (existsSync('.env.local')) process.loadEnvFile('.env.local')

const url = process.env.SUPABASE_TEST_URL ?? ''
const publishableKey = process.env.SUPABASE_TEST_PUBLISHABLE_KEY ?? ''
const secretKey = process.env.SUPABASE_TEST_SECRET_KEY ?? ''

export const testEnvReady = Boolean(url && publishableKey && secretKey)

const options = { auth: { persistSession: false, autoRefreshToken: false } }

export const anon = () => createClient<Database>(url, publishableKey, options)
export const admin = () => createClient<Database>(url, secretKey, options)

export const TEST_TRACK = 'test-track'

/** Upserts a catalogue lesson in a test track. Rows are idempotent, so test files can share them. */
export async function seedLesson(lesson: { id: string; minutes: number; steps: number; version: number }) {
  const db = admin()
  const track = await db
    .from('tracks')
    .upsert({ slug: TEST_TRACK, title: 'Test track', status: 'coming_soon', position: 999 })
  if (track.error) throw track.error
  const [, module, number] = lesson.id.split('-').map(Number)
  const { error } = await db.from('lessons').upsert({
    id: lesson.id,
    track_slug: TEST_TRACK,
    module: module ?? 1,
    lesson: number ?? 1,
    slug: `test-${lesson.id}`,
    title: `Test lesson ${lesson.id}`,
    description: 'Seeded by the database tests.',
    minutes: lesson.minutes,
    free: true,
    version: lesson.version,
    steps: lesson.steps,
    bytes: 1,
    hash: 'test',
    pack_path: `test/${lesson.id}.json`,
  })
  if (error) throw error
}

// Each run gets its own users, so leftovers from an earlier run can't change the results.
const run = Date.now().toString(36)
const createdUsers: string[] = []

export async function signedInAs(name: string) {
  const email = `${name}-${run}@test.practicode.tech`
  const password = `${crypto.randomUUID()}-Aa1`
  const { data, error } = await admin().auth.admin.createUser({ email, password, email_confirm: true })
  if (error) throw error
  createdUsers.push(data.user.id)
  const client = anon()
  const signIn = await client.auth.signInWithPassword({ email, password })
  if (signIn.error) throw signIn.error
  return { id: data.user.id, email, client }
}

/** Registers a user created some other way, so deleteTestUsers removes it too. */
export const deleteAfterRun = (id: string) => createdUsers.push(id)

/** Deletes this run's users; their profiles, progress and events go with them (on delete cascade). */
export async function deleteTestUsers() {
  const db = admin()
  for (const id of createdUsers.splice(0)) await db.auth.admin.deleteUser(id)
}

/** The 6-digit sign-in code Supabase would email, generated without sending anything (Task 10's e2e test). */
export async function generateOtp(email: string) {
  const { data, error } = await admin().auth.admin.generateLink({ type: 'magiclink', email })
  if (error) throw error
  return data.properties.email_otp
}
