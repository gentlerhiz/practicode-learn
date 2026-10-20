import type { TrackTone } from '@/content/catalogue'

export type TrackLesson = { title: string; minutes?: number }

export type TrackModule = {
  number: number
  title: string
  summary: string
  /** The part of the course's main standard this module covers, such as an MDN Curriculum module. */
  standard: string
  project: string
  free: boolean
  /** Written but not published yet: the course page and the app say "Coming soon". */
  soon?: boolean
  lessons: TrackLesson[]
}

export type TrackContent = {
  slug: string
  title: string
  status: 'live' | 'coming_soon'
  tone: TrackTone
  tagline: string
  summary: string
  /** The course page's heading: the words before the highlighted one, the highlight, the rest, and an optional smaller line. */
  heading: { before: string; mark: string; after?: string; sub?: string }
  /** The paragraph under the course page's heading. */
  intro: string
  level: 'Beginner' | 'Intermediate'
  audience: string
  prerequisites: string
  hours: number
  pace: string
  tools: string[]
  alignment: string[]
  /** One line under the course page's buttons, such as "Aligned to the MDN Curriculum and SFIA 9". */
  alignmentShort: string
  credential: string
  deviceNotes: string[]
  outcomes: string[]
  capstone: { title: string; summary: string; project: string }
  /** Where "Start Module 1 Free" goes. */
  firstLesson: string
  /** Three module numbers whose projects show the course's range on its page. */
  showcase: [number, number, number]
  /** The drawing beside the course page's heading. */
  preview: 'portfolio' | 'devices' | 'shield' | 'server' | 'terminal' | 'table'
  modules: TrackModule[]
}
