import { z } from 'zod'

export type TestResult = { name: string; pass: boolean; message?: string }
export type RunnerMessage = { type: 'ready' } | { type: 'pcl-tests'; results: TestResult[] }

/** What the lesson player shows when the learner's code never reports back. */
export const TIMEOUT_MESSAGE =
  'Your code didn’t finish. Check for a loop that never ends, or an error in the console.'
export const RUN_TIMEOUT_MS = 4000

const TestResultSchema = z
  .object({ name: z.string().max(500), pass: z.boolean(), message: z.string().max(2000).optional() })
  .strip()

const RunnerMessageSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('ready') }).strip(),
  z.object({ type: z.literal('pcl-tests'), results: z.array(TestResultSchema).max(50) }).strip(),
])

/**
 * Messages come from the runner frame, which runs learner code, so anything can arrive. Only the two
 * shapes the player understands get through; everything else is ignored.
 */
export function parseRunnerMessage(data: unknown): RunnerMessage | null {
  const result = RunnerMessageSchema.safeParse(data)
  return result.success ? result.data : null
}
