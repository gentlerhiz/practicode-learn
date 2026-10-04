import type { TrackTone } from '@/content/landing'

export type TrackLesson = { title: string; minutes?: number }

export type TrackModule = {
  number: number
  title: string
  summary: string
  /** The MDN Curriculum module(s) this module covers. */
  mdn: string
  project: string
  free: boolean
  lessons: TrackLesson[]
}

export type TrackContent = {
  slug: string
  title: string
  status: 'live' | 'coming_soon'
  tone: TrackTone
  tagline: string
  summary: string
  level: 'Beginner' | 'Intermediate'
  audience: string
  prerequisites: string
  hours: number
  pace: string
  tools: string[]
  alignment: string[]
  credential: string
  deviceNotes: string[]
  outcomes: string[]
  capstone: { title: string; summary: string; project: string }
  modules: TrackModule[]
}
