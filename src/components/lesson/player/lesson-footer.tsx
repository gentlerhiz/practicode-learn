'use client'
import { Button } from '@/components/ui'
import { Glyph } from '@/components/ui/glyph'

/**
 * The lesson's sticky footer (PrismLesson / PrismTryLesson): Back on the left (empty space on the first
 * step), "Press Enter to continue" in the middle, and Continue — "Finish Lesson" on the last step — on
 * the right. Continue unlocks once the step is done.
 */
export function LessonFooter({
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
    <footer className="sticky bottom-0 z-20 border-t border-line bg-glass backdrop-blur-xl">
      <nav
        aria-label="Lesson steps"
        className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-3 px-4 py-4 ph:px-6"
      >
        {canBack ? (
          <Button variant="secondary" onClick={onBack} className="h-[46px] bg-transparent font-medium">
            <Glyph name="arrowLeft" size={18} />
            Back
          </Button>
        ) : (
          <span />
        )}
        <p className="hidden text-xs text-ink-subtle tab:block" aria-hidden="true">
          Press Enter to continue
        </p>
        <Button disabled={!canContinue} onClick={onNext} className="h-[48px]">
          {last ? 'Finish Lesson' : 'Continue'}
          {!last && <Glyph name="arrowRight" size={18} />}
        </Button>
      </nav>
    </footer>
  )
}
