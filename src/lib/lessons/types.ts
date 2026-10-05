/** One row of the catalogue the content build writes (and publishes to the `lessons` table). */
export type CatalogueEntry = {
  id: string
  version: number
  title: string
  slug: string
  description: string
  track: string
  module: number
  lesson: number
  minutes: number
  free: boolean
  steps: number
  /** Compressed size of the pack, in bytes. */
  bytes: number
  /** First 12 hex characters of the pack's SHA-256, so unchanged packs are skipped on publish. */
  hash: string
}

/** What the app knows about a published lesson before downloading its pack. */
export type LessonMeta = {
  id: string
  track: string
  module: number
  lesson: number
  slug: string
  title: string
  description: string
  minutes: number
  free: boolean
  version: number
  packUrl: string
}
