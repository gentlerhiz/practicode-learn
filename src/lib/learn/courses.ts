import 'server-only'
import { courseByCode } from '@/content/catalogue'
import { getTrackContent, liveTracks, type TrackContent } from '@/content/tracks'
import { parsePlan, planTrack } from '@/lib/onboarding/plan'
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

/**
 * The course the learner is on now: the one they last made progress in, else the open course they
 * chose in onboarding, else the default. `asked` (from ?course=) wins when it's a live course.
 */
export async function currentTrackSlug(plan: unknown, asked?: string | null): Promise<string> {
  if (asked && getTrackContent(asked)?.status === 'live') return asked
  const supabase = await createClient()
  const { data } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .order('updated_at', { ascending: false })
    .limit(1)
  const recent = data?.[0]?.lesson_id.slice(0, 2)
  const fromProgress = recent ? courseByCode(recent)?.slug : undefined
  if (fromProgress && getTrackContent(fromProgress)?.status === 'live') return fromProgress
  const chosen = planTrack(parsePlan(plan))
  if (chosen.open && getTrackContent(chosen.slug)) return chosen.slug
  return OPEN_TRACK
}
