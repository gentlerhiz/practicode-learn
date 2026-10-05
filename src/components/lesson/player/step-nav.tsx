'use client'
import { Button } from '@/components/ui'

/** Back and Continue. Continue unlocks when the step is done, and says Finish Lesson on the last step. */
export function StepNav({
  canBack,
  canContinue,
  last,
  onBack,
  onNext,
}: {
  canBack: boolean
  canContinue: boolean
  last: boolean
  onBack: () => void
  onNext: () => void
}) {
  return (
    <nav
      aria-label="Lesson steps"
      className="flex items-center justify-between gap-3 border-t border-line-subtle pt-5"
    >
      <Button variant="secondary" disabled={!canBack} onClick={onBack}>
        Back
      </Button>
      <div className="flex items-center gap-3">
        {canContinue && (
          <span className="hidden text-sm text-ink-subtle tab:inline" aria-hidden="true">
            Press Enter to continue
          </span>
        )}
        <Button disabled={!canContinue} onClick={onNext}>
          {last ? 'Finish Lesson' : 'Continue'}
        </Button>
      </div>
    </nav>
  )
}
