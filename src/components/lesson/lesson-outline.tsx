import type { LessonPack, LessonStep } from '@/lib/lessons/schema'
import { Prose } from './parts/prose'

const STAGE: Record<string, string> = {
  hook: 'Hook',
  predict: 'Predict',
  run: 'Run',
  investigate: 'Investigate',
  modify: 'Modify',
  make: 'Make',
  apply: 'Apply',
  recap: 'Recap',
}
const ACTIVITY: Record<LessonStep['type'], string> = {
  explain: 'read a short explanation',
  diagram: 'step through a drawing',
  predict: 'predict what happens',
  question: 'answer a question',
  explore: 'try it live',
  order: 'put steps in order',
  code: 'write code',
  recap: 'review what you learned',
}

/**
 * What's in the lesson, rendered on the server: readable before any JavaScript runs, and by search
 * engines. Collapsed by default, so the lesson itself stays near the top on a phone.
 */
export function LessonOutline({ pack }: { pack: LessonPack }) {
  const recap = pack.steps.find((s) => s.type === 'recap')
  return (
    <section aria-labelledby="lesson-outline" className="rounded-3xl border border-line bg-row">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
          <h2 id="lesson-outline" className="font-display text-lg font-bold text-ink">
            What’s in this lesson
          </h2>
          <span className="text-sm text-ink-muted">
            {pack.steps.length} steps · about {pack.minutes} min{' '}
            <span aria-hidden="true" className="inline-block group-open:rotate-180">
              ⌄
            </span>
          </span>
        </summary>
        <div className="flex flex-col gap-4 border-t border-line-subtle px-5 py-4">
          <ol className="flex flex-col gap-1.5 text-[15px] text-ink-soft">
            {pack.steps.map((step, i) => (
              <li key={i}>
                <span className="font-semibold text-ink">
                  {i + 1}. {STAGE[step.stage]}
                </span>
                : {ACTIVITY[step.type]}
              </li>
            ))}
          </ol>
          {recap?.type === 'recap' && (
            <div className="flex flex-col gap-2">
              <p className="text-[15px] font-semibold text-ink">By the end, you can explain:</p>
              <ul className="flex list-disc flex-col gap-1 pl-5 text-[15px] text-ink-soft">
                {recap.points.map((point, i) => (
                  <li key={i}>
                    <Prose html={point} inline />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </details>
    </section>
  )
}
