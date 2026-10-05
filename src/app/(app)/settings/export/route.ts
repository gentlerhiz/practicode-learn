import { requireUser } from '@/lib/auth/require-user'
import { createClient } from '@/lib/supabase/server'

/**
 * Everything we hold about the learner's learning, as a JSON file. Read with their own session, so
 * row-level security means it can only ever contain their own rows.
 */
export async function GET() {
  const user = await requireUser()
  const supabase = await createClient()
  const [profile, progress, events] = await Promise.all([
    supabase
      .from('profiles')
      .select('display_name, country_code, role, created_at')
      .eq('id', user.id)
      .maybeSingle(),
    supabase.from('lesson_progress').select('*').order('started_at'),
    supabase.from('learning_events').select('*').order('occurred_at'),
  ])
  if (profile.error || progress.error || events.error) {
    return new Response('We couldn’t gather your data. Try again in a moment.', { status: 500 })
  }
  const date = new Date().toISOString().slice(0, 10)
  const body = {
    exported_at: new Date().toISOString(),
    account: { id: user.id, email: user.email },
    profile: profile.data,
    lesson_progress: progress.data,
    learning_events: events.data,
  }
  return new Response(`${JSON.stringify(body, null, 2)}\n`, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="practicode-learn-data-${date}.json"`,
      'Cache-Control': 'no-store',
    },
  })
}
