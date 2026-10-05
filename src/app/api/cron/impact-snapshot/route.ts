import { timingSafeEqual } from 'node:crypto'
import { serverEnv } from '@/lib/server-env'
import { createAdminClient } from '@/lib/supabase/admin'

/** Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`. Without a configured secret, nobody gets in. */
function authorised(header: string | null): boolean {
  let secret: string
  try {
    secret = serverEnv().CRON_SECRET
  } catch {
    return false
  }
  const expected = Buffer.from(`Bearer ${secret}`)
  const got = Buffer.from(header ?? '')
  return got.length === expected.length && timingSafeEqual(got, expected)
}

/**
 * Saves this month's impact figures (vercel.json runs it on the 1st). Snapshots hold no personal data,
 * so the evidence survives learners deleting their accounts.
 */
export async function GET(request: Request) {
  if (!authorised(request.headers.get('authorization'))) {
    return new Response('Unauthorised', { status: 401 })
  }
  const db = createAdminClient()
  const { data, error } = await db.rpc('impact_summary')
  if (error) return new Response('Could not measure', { status: 500 })
  const month = `${new Date().toISOString().slice(0, 7)}-01`
  const saved = await db.from('impact_snapshots').upsert({ month, metrics: data })
  if (saved.error) return new Response('Could not save', { status: 500 })
  return Response.json({ month })
}
