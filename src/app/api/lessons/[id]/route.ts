import { listPublishedLessons } from '@/lib/lessons/catalogue'
import { loadPack } from '@/lib/lessons/packs'
import { createClient } from '@/lib/supabase/server'

const ID = /^[a-z]{2}-\d{2}-\d{2}$/
const PRIVATE = { 'Cache-Control': 'private, no-store' }

/**
 * A Pro lesson's pack, for a signed-in Pro member's browser. Pro lesson pages stay static and public, so
 * nothing paid is ever in their HTML; the player asks here instead. 401 means sign in, 403 means not Pro.
 * Free lessons are answered with 404: their pack is already in the page.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!ID.test(id)) return new Response('Not found', { status: 404, headers: PRIVATE })
  const meta = (await listPublishedLessons()).find((l) => l.id === id)
  if (!meta || meta.free) return new Response('Not found', { status: 404, headers: PRIVATE })

  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims?.sub) return new Response('Sign in first', { status: 401, headers: PRIVATE })
  const { data: isPro } = await supabase.rpc('is_pro')
  if (isPro !== true) return new Response('This lesson is part of Pro', { status: 403, headers: PRIVATE })

  try {
    return Response.json(await loadPack(meta, supabase), { headers: PRIVATE })
  } catch (error) {
    console.error(`Pro lesson ${id} could not be loaded`, error)
    return new Response('The lesson could not be loaded', { status: 502, headers: PRIVATE })
  }
}
