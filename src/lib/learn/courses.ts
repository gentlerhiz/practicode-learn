import 'server-only'
import { liveTracks, type TrackContent } from '@/content/tracks'
import { createClient } from '@/lib/supabase/server'
import { OPEN_TRACK } from './progress'

/**
 * The courses this learner has joined (starting a lesson joins its course), in catalogue order. A learner
 * who hasn't started anything yet sees the open course, so pages are never empty for no reason.
 */
export async function enrolledTracks(): Promise<TrackContent[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('enrollments').select('track_slug')
  const joined = new Set((data ?? []).map((e) => e.track_slug))
  const live = liveTracks()
  const mine = live.filter((t) => joined.has(t.slug))
  return mine.length ? mine : live.filter((t) => t.slug === OPEN_TRACK)
}
