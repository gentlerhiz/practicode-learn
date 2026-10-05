'use client'
import type { LessonTest } from '@/lib/lessons/schema'
import { TIMEOUT_MESSAGE, type TestResult } from '@/lib/runner/protocol'
import { cn } from '@/lib/cn'
import { Prose } from './prose'

/** Each test as Passed, Needs a fix (with the message that says what to fix) or Not run. */
export function TestsList({ tests, results }: { tests: LessonTest[]; results?: TestResult[] }) {
  const timedOut = results?.length === 1 && results[0]?.message === TIMEOUT_MESSAGE
  return (
    <div aria-live="polite" className="flex flex-col gap-2">
      {timedOut && (
        <p role="alert" className="rounded-2xl border border-error bg-error/10 p-3 text-sm text-ink">
          {TIMEOUT_MESSAGE}
        </p>
      )}
      <ul aria-label="Tests" className="flex flex-col gap-2">
        {tests.map((t, i) => {
          const r = timedOut ? { name: t.name, pass: false } : results?.[i]
          return (
            <li
              key={i}
              className={cn(
                'rounded-2xl border border-line bg-row p-3 text-sm text-ink',
                r?.pass && 'border-success',
                r && !r.pass && 'border-error',
              )}
            >
              <span
                className={cn(
                  'mr-2 font-semibold',
                  r ? (r.pass ? 'text-success' : 'text-error') : 'text-ink-muted',
                )}
              >
                {r ? (r.pass ? '✓ Passed' : '✕ Needs a fix') : '○ Not run'}
              </span>
              <Prose html={t.name} inline />
              {r && !r.pass && !timedOut && r.message && (
                <span className="mt-1 block text-ink-soft">{r.message}</span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
