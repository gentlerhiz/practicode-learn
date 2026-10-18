// Read by the app and directly by the content tools, so: explicit .ts extensions, erasable syntax only.
import { z } from 'zod'
import { PackError } from '../lessons/schema.ts'

/**
 * A project pack: one module's project, briefed like a client job (docs/curriculum/project-format.md).
 * The content build writes these; the app accepts nothing else.
 */
const File = z.object({
  name: z.string().min(1).max(80),
  lang: z.string().min(1).max(20),
  code: z.string().max(60000),
  readonly: z.literal(true).optional(),
})

const Check = z.object({
  name: z.string().min(1).max(200),
  code: z.string().min(1).max(8000),
})

export const ProjectPackSchema = z.strictObject({
  schema: z.literal(1),
  id: z.string().regex(/^[a-z]{2}-p\d{2}$/),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  version: z.number().int().min(1),
  title: z.string().min(1).max(120),
  description: z.string().min(60).max(200),
  track: z.string().regex(/^[a-z0-9-]+$/),
  module: z.number().int().min(1).max(99),
  free: z.boolean(),
  /** Who the work is for, such as "Mama Nkechi's Kitchen". */
  client: z.string().min(1).max(80),
  minutes: z.number().int().min(15).max(600),
  /** The project has to be live on the web, at an address the learner gives, before it passes. */
  needsSite: z.boolean(),
  /** HTML, rendered at build time. */
  brief: z.string().min(1),
  must: z.array(z.string()).min(1).max(15),
  nice: z.array(z.string()).max(10),
  files: z.array(File).min(1).max(8),
  checks: z.array(Check).min(1).max(30),
  /** Questions the learner answers about their own work before submitting. */
  review: z.array(z.string()).min(1).max(8),
})

export type ProjectPack = z.infer<typeof ProjectPackSchema>
export type ProjectFile = z.infer<typeof File>

export function parseProjectPack(json: unknown): ProjectPack {
  const result = ProjectPackSchema.safeParse(json)
  if (!result.success) {
    throw new PackError(result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n'))
  }
  return result.data
}

/** One entry per project, for the projects table. */
export type ProjectEntry = {
  id: string
  version: number
  title: string
  slug: string
  description: string
  track: string
  module: number
  free: boolean
  checks: number
  needsSite: boolean
  bytes: number
  hash: string
}
