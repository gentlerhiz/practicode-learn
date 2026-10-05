// The lesson pack format (docs/curriculum/lesson-format.md, "Lesson pack"), checked strictly: unknown
// fields fail, so a solution or a field from a newer format can never slip through. Node runs this file
// directly in the content tools, so it imports with explicit .ts extensions and uses only erasable syntax.
import { z } from 'zod'
import { LAB_NAMES } from './labs.ts'

export const STAGES = ['hook', 'predict', 'run', 'investigate', 'modify', 'make', 'apply'] as const

const LessonFile = z
  .object({
    name: z.string().min(1),
    lang: z.string().min(1),
    code: z.string(),
    readonly: z.literal(true).optional(),
  })
  .strict()

const Option = z
  .object({
    id: z.string().min(1),
    html: z.string(),
    correct: z.boolean(),
    feedback: z.string().min(1),
    value: z.string().optional(),
  })
  .strict()

const Hints = z.array(z.string().min(1)).length(3)

const common = {
  stage: z.enum(STAGES),
  assesses: z.array(z.string().min(1)).optional(),
  body: z.string().optional(),
}

const choice = {
  files: z.array(LessonFile).optional(),
  run: z.literal(true).optional(),
  live: z.literal(true).optional(),
  options: z.array(Option).min(2),
  hints: Hints,
  reveal: z.string().optional(),
}

const Step = z.discriminatedUnion('type', [
  z.object({ type: z.literal('explain'), ...common }).strict(),
  z.object({ type: z.literal('predict'), ...common, ...choice }).strict(),
  z.object({ type: z.literal('question'), ...common, ...choice }).strict(),
  z
    .object({
      type: z.literal('explore'),
      ...common,
      control: z.string().min(1),
      values: z.array(z.string().min(1)).min(2),
      lab: z.enum(LAB_NAMES).optional(),
      files: z.array(LessonFile).optional(),
      ask: z.string().min(1),
      options: z.array(Option).min(2),
      hints: Hints,
      reveal: z.string().optional(),
    })
    .strict(),
  z
    .object({
      type: z.literal('diagram'),
      ...common,
      lab: z.enum(LAB_NAMES),
      states: z.array(z.object({ title: z.string().min(1), html: z.string() }).strict()).min(2),
    })
    .strict(),
  z
    .object({
      type: z.literal('order'),
      ...common,
      items: z.array(z.string().min(1)).min(3),
      wrong: z.string().min(1),
      hints: Hints,
    })
    .strict(),
  z
    .object({
      type: z.literal('code'),
      ...common,
      files: z.array(LessonFile).min(1),
      tests: z.array(z.object({ name: z.string().min(1), code: z.string() }).strict()).min(1),
      hints: Hints,
    })
    .strict(),
  z
    .object({
      type: z.literal('recap'),
      stage: z.literal('recap'),
      points: z.array(z.string().min(1)).min(2).max(4),
      cards: z.array(z.object({ front: z.string().min(1), back: z.string().min(1) }).strict()).min(1),
    })
    .strict(),
])

export const LessonPack = z
  .object({
    schema: z.literal(1),
    id: z.string().regex(/^[a-z]{2}-\d{2}-\d{2}$/),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    description: z.string().min(120).max(160),
    version: z.number().int().min(1),
    title: z.string().min(1),
    track: z.string().regex(/^[a-z0-9-]+$/),
    module: z.number().int().min(1).max(99),
    lesson: z.number().int().min(1).max(99),
    minutes: z.number().int().min(1).max(60),
    free: z.boolean(),
    outcomes: z.array(z.string().min(1)).min(1),
    prerequisites: z.array(z.string()),
    steps: z.array(Step).min(1),
  })
  .strict()

export type LessonPack = z.infer<typeof LessonPack>
export type LessonStep = z.infer<typeof Step>
export type LessonFile = z.infer<typeof LessonFile>
export type LessonOption = z.infer<typeof Option>
export type LessonTest = { name: string; code: string }

/** A lesson pack that doesn't match the format. Lesson pages turn it into their error state. */
export class PackError extends Error {
  override name = 'PackError'
}

export function parsePack(json: unknown): LessonPack {
  const result = LessonPack.safeParse(json)
  if (!result.success) throw new PackError(z.prettifyError(result.error))
  return result.data
}
