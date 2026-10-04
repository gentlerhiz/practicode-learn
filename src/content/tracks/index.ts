import { landing } from '@/content/landing'
import { frontEnd } from './front-end-web-development'
import type { TrackContent } from './types'

export type { TrackContent, TrackLesson, TrackModule } from './types'

/** Tracks with full content. Coming-soon tracks only have landing cards until their content lands. */
const full: TrackContent[] = [frontEnd]

export type TrackSummary = Pick<TrackContent, 'slug' | 'title' | 'status'>

/** Every track, live or coming soon, in landing-page order. */
export const tracks: TrackSummary[] = landing.tracks.cards.map((card) => ({
  slug: card.slug,
  title: card.title,
  status: card.status,
}))

export const liveTracks = (): TrackContent[] => full.filter((t) => t.status === 'live')

export function getTrack(slug: string): TrackSummary | undefined {
  return tracks.find((t) => t.slug === slug)
}

export function getTrackContent(slug: string): TrackContent | undefined {
  return full.find((t) => t.slug === slug)
}
