import { catalogue } from '@/content/catalogue'
import { backEnd } from './back-end-web-development'
import { frontEnd } from './front-end-web-development'
import { cybersecurity } from './introduction-to-cybersecurity'
import { itFundamentals } from './it-fundamentals'
import { python } from './python-programming'
import { sql } from './sql-and-databases'
import type { TrackContent } from './types'

export type { TrackContent, TrackLesson, TrackModule } from './types'

/** Courses with full content. Coming-soon courses only have catalogue cards until their content lands. */
const full: TrackContent[] = [itFundamentals, frontEnd, backEnd, cybersecurity, python, sql]

export type TrackSummary = { slug: string; title: string; status: 'live' | 'coming_soon' }

/** Every course, live or coming soon, in catalogue order. */
export const tracks: TrackSummary[] = catalogue.map((c) => ({ slug: c.slug, title: c.title, status: c.status }))

/** Live courses with full content, in catalogue order. */
export const liveTracks = (): TrackContent[] =>
  catalogue.flatMap((c) => full.filter((t) => t.slug === c.slug && t.status === 'live'))

export function getTrack(slug: string): TrackSummary | undefined {
  return tracks.find((t) => t.slug === slug)
}

export function getTrackContent(slug: string): TrackContent | undefined {
  return full.find((t) => t.slug === slug)
}

/** True once every module is published: only then can a learner finish the course. */
export const isComplete = (track: TrackContent) => track.modules.every((m) => !m.soon)
