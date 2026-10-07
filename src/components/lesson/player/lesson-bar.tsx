'use client'
import type { Route } from 'next'
import Link from 'next/link'
import { LogoIcon } from '@/components/layout/logo'
import { LinkButton } from '@/components/ui'
import { Glyph } from '@/components/ui/glyph'
import { TutorSpark } from '@/components/learn/tutor-spark'
import { cn } from '@/lib/cn'
import { stageName } from '../parts/step-layout'

export type LessonChrome = {
  isGuest: boolean
  title: string
  /** The sub-line: guest "Front-End · Free lesson · No account needed", learner "Front-End · Module 1 · Lesson 1 of 7". */
  meta: string
  /** Where the exit control goes: the track page for guests, the dashboard for learners. */
  exitHref: Route
  signupHref: Route
}

/** The step pips, exactly as the canvas draws them: done, current, and still to come. */
function Pips({ index, total, stage }: { index: number; total: number; stage: string }) {
  return (
    <div className="order-3 flex basis-full flex-col gap-2 ph:order-none ph:max-w-[520px] ph:flex-[2_1_320px]">
      <div aria-hidden="true" className="flex gap-1">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn(
              'block h-1.5 flex-1 rounded-full',
              i < index ? 'bg-[#3D5AF5]' : i === index ? 'bg-[#8EA2FF]' : 'bg-divider',
            )}
          />
        ))}
      </div>
      <p className="text-xs text-ink-subtle">
        Step {index + 1} of {total} · {stageName(stage)}
      </p>
    </div>
  )
}

/**
 * The lesson header (PrismTryLesson / PrismLesson). A guest gets the logo, Ask AI (locked, to sign-up)
 * and Save Progress; a learner gets a way out, a Saved-offline note, Ask AI and a Hint. The Hint button
 * reveals the step's hints inline; it is hidden on steps that carry none.
 */
export function LessonBar({
  chrome,
  index,
  total,
  stage,
  hintsShown,
  hintsTotal,
  onHint,
}: {
  chrome: LessonChrome
  index: number
  total: number
  stage: string
  hintsShown: number
  hintsTotal: number
  onHint: () => void
}) {
  const { isGuest } = chrome
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-glass backdrop-blur-xl">
      <div className="flex w-full flex-wrap items-center gap-3 px-4 py-3 ph:h-[72px] ph:flex-nowrap ph:gap-5 ph:px-6 ph:py-0">
        {isGuest ? (
          <Link href={chrome.exitHref} prefetch={false} aria-label="PractiCode Learn home" className="flex shrink-0">
            <LogoIcon />
          </Link>
        ) : (
          <LinkButton
            href={chrome.exitHref}
            prefetch={false}
            variant="secondary"
            aria-label="Exit lesson"
            className="size-11 shrink-0 rounded-full px-0"
          >
            <Glyph name="close" size={20} />
          </LinkButton>
        )}

        <div className="min-w-0 flex-[1_1_200px]">
          <p className="truncate text-[15px] font-semibold text-ink">{chrome.title}</p>
          <p className="text-[13px] text-ink-subtle [&>b]:font-normal [&>b]:text-fe-text">
            <b>{chrome.meta.split(' · ')[0]}</b>
            {chrome.meta.includes(' · ') && ` · ${chrome.meta.split(' · ').slice(1).join(' · ')}`}
          </p>
        </div>

        <Pips index={index} total={total} stage={stage} />

        <div className="ml-auto flex items-center gap-2">
          {!isGuest && (
            <p className="pcl-hide-sm hidden items-center gap-1.5 px-1.5 text-xs text-ink-soft tab:flex">
              <span className="block size-[7px] rounded-full bg-da" />
              Saved offline
            </p>
          )}

          {isGuest ? (
            <LinkButton
              href={chrome.signupHref}
              variant="secondary"
              size="sm"
              className="hidden h-[42px] rounded-full ph:inline-flex"
            >
              <Glyph name="lock" size={15} />
              Ask AI
            </LinkButton>
          ) : (
            <AskAiButton />
          )}

          {hintsTotal > 0 && (
            <button
              type="button"
              onClick={onHint}
              disabled={hintsShown >= hintsTotal}
              aria-label={hintsShown >= hintsTotal ? 'All hints shown' : 'Show a hint'}
              className="press flex h-[42px] cursor-pointer items-center gap-2 rounded-full border border-line-control bg-transparent px-4 text-sm font-medium text-ink hover:border-line-strong hover:bg-hover disabled:cursor-default disabled:opacity-50"
            >
              <Glyph name="bulb" size={17} className="text-[#FF8A3D]" />
              Hint
            </button>
          )}

          {isGuest && (
            <LinkButton href={chrome.signupHref} size="sm" className="h-[42px] rounded-full">
              Save Progress
            </LinkButton>
          )}
        </div>
      </div>
    </header>
  )
}

/** Ask AI for learners: a small popover that says the tutor is on its way. No tokens are spent yet. */
function AskAiButton() {
  return (
    <details className="relative [&_summary::-webkit-details-marker]:hidden">
      <summary className="press flex h-[42px] cursor-pointer list-none items-center gap-2 rounded-full border border-line-control py-0 pr-4 pl-1.5 text-sm font-medium text-ink hover:border-line-strong">
        <TutorSpark size={30} />
        Ask AI
      </summary>
      <div
        role="status"
        className="surface absolute right-0 z-30 mt-2 w-72 rounded-2xl border border-line p-4 text-sm leading-6 text-ink-soft shadow-xl"
      >
        <p className="mb-1 font-display font-bold text-ink">AI tutor</p>
        The tutor that knows this lesson and your code is coming soon. It will answer right here.
      </div>
    </details>
  )
}
