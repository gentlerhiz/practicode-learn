// zod/mini: the same validation, in a fraction of the bytes, because this runs in every lesson page.
import * as z from 'zod/mini'

export type TestResult = { name: string; pass: boolean; message?: string }
export type RunnerMessage = { type: 'ready' } | { type: 'pcl-tests'; results: TestResult[] }

/** What the lesson player shows when the learner's code never reports back. */
export const TIMEOUT_MESSAGE =
  'Your code didn’t finish. Check for a loop that never ends, or an error in the console.'
export const RUN_TIMEOUT_MS = 4000

const TestResultSchema = z.object({
  name: z.string().check(z.maxLength(500)),
  pass: z.boolean(),
  message: z.optional(z.string().check(z.maxLength(2000))),
})

const RunnerMessageSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('ready') }),
  z.object({ type: z.literal('pcl-tests'), results: z.array(TestResultSchema).check(z.maxLength(50)) }),
])

/**
 * Messages come from the runner frame, which runs learner code, so anything can arrive. Only the two
 * shapes the player understands get through; everything else is ignored.
 */
export function parseRunnerMessage(data: unknown): RunnerMessage | null {
  const result = RunnerMessageSchema.safeParse(data)
  return result.success ? (result.data as RunnerMessage) : null
}
