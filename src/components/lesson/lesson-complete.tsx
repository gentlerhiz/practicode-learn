'use client'
import type { Route } from 'next'
import Link from 'next/link'
import { Button, LinkButton, SubmitButton } from '@/components/ui'
import { Glyph } from '@/components/ui/glyph'
import { LogoIcon } from '@/components/layout/logo'
import { signInWithGoogle } from '@/lib/auth/actions'
import { Prose } from './parts/prose'

export type NextLesson = { href: Route; title: string; lesson: number; minutes: number }

/**
 * The end of a lesson (ported from PrismTryDone): the time it took, what the learner can now explain, and
 * what's next. A guest also gets the save card — Google or email sign-up — to keep their progress; a
 * learner gets the next lesson and a way back.
 */
export function LessonComplete({
  eyebrow,
  lessonNumber,
  lead,
  minutes,
  points,
  nextLesson,
  isGuest,
  lessonPath,
  onRestart,
}: {
  eyebrow: string
  lessonNumber: number
  /** One line under the heading: the lesson's own description. */
  lead?: string
  minutes: number
  points: string[]
  nextLesson?: NextLesson
  isGuest: boolean
  lessonPath: string
  onRestart: () => void
}) {
  const signupHref = `/signup?next=${encodeURIComponent(lessonPath)}` as Route

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px]"
        style={{
          background:
            'radial-gradient(closest-side at 35% 20%, rgba(77,107,255,0.22), rgba(0,0,0,0) 72%), radial-gradient(closest-side at 68% 12%, rgba(47,230,176,0.12), rgba(0,0,0,0) 72%)',
        }}
      />
      <header className="relative border-b border-line">
        <div className="mx-auto flex h-[72px] w-full max-w-[1100px] items-center justify-between gap-4 px-4 ph:px-6">
          <Link href="/" aria-label="PractiCode Learn home" className="flex items-center gap-3">
            <LogoIcon />
            <span className="hidden text-lg text-ink ph:inline">
              <span className="font-normal">Practi</span>
              <span className="font-bold">Code</span>
              <span className="font-normal"> Learn</span>
            </span>
          </Link>
          {isGuest ? (
            <Link href="/login" className="text-sm text-ink-muted hover:text-ink">
              Already have an account? <span className="font-semibold text-ink">Log in</span>
            </Link>
          ) : (
            <LinkButton href={'/home' as Route} variant="secondary" size="sm">
              My Dashboard
            </LinkButton>
          )}
        </div>
      </header>

      <main
        id="main"
        className="relative mx-auto grid w-full max-w-[1100px] grid-cols-1 items-start gap-10 px-4 pt-10 pb-16 ph:gap-16 ph:px-6 tab:grid-cols-[minmax(0,1fr)_minmax(0,440px)]"
      >
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <span className="flex size-16 items-center justify-center rounded-2xl bg-da/15 text-da">
              <Glyph name="check" size={29} />
            </span>
            <p className="text-sm font-medium text-fe-text">{eyebrow}</p>
            <h1 className="font-display text-[30px] leading-9 font-extrabold tracking-[-0.04em] [text-wrap:wrap] text-ink ph:text-[48px] ph:leading-[52px]">
              Lesson {lessonNumber} done, in {minutes} {minutes === 1 ? 'minute' : 'minutes'}.
            </h1>
            {lead && <p className="text-lg leading-[30px] text-ink-soft">{lead}</p>}
          </div>

          <section aria-labelledby="explain-now" className="flex flex-col gap-4">
            <h2 id="explain-now" className="font-display text-xl font-bold text-ink">
              What you can explain now
            </h2>
            <ul className="flex flex-col gap-3">
              {points.map((point, i) => (
                <li key={i} className="flex gap-3 text-base leading-6 text-ink-soft">
                  <Glyph name="check" size={18} className="mt-0.5 shrink-0 text-fe-text" />
                  <Prose html={point} inline />
                </li>
              ))}
            </ul>
          </section>

          {nextLesson && (
            <Link
              href={nextLesson.href}
              className="flex items-center justify-between gap-4 rounded-[20px] border border-line bg-row px-6 py-5 hover:border-line-strong"
            >
              <span>
                <span className="block text-[13px] text-ink-muted">Up next</span>
                <span className="mt-1 block text-base font-semibold text-ink">
                  Lesson {nextLesson.lesson}: {nextLesson.title} · {nextLesson.minutes} min
                </span>
              </span>
              <Glyph name="arrowRight" size={20} className="shrink-0 text-ink" />
            </Link>
          )}

          {!isGuest && (
            <div className="flex flex-wrap gap-3">
              <LinkButton href={'/home' as Route}>Back to My Dashboard</LinkButton>
              <Button variant="secondary" onClick={onRestart}>
                Start This Lesson Again
              </Button>
            </div>
          )}
        </section>

        {isGuest && (
          <aside
            aria-labelledby="save-progress"
            className="rounded-[29px] p-[1.5px]"
            style={{ background: 'linear-gradient(160deg, #4D6BFF 0%, #7B5CFF 45%, #F0407F 100%)' }}
          >
            <div className="flex flex-col gap-6 rounded-[28px] bg-sheet p-6 ph:p-8">
              <div className="flex flex-col gap-2">
                <h2 id="save-progress" className="font-display text-[26px] leading-8 font-extrabold text-ink">
                  Save your progress. It’s free.
                </h2>
                <p className="text-[15px] leading-6 text-ink-muted">Keep this lesson and pick up on any device.</p>
              </div>
              <ul className="flex flex-col gap-3 text-[15px] leading-6 text-ink-soft">
                {['Module 1 of every track, free for good', 'A 4-minute daily review so it sticks', 'AI tutor, 5 questions a day'].map(
                  (line) => (
                    <li key={line} className="flex gap-3">
                      <Glyph name="check" size={18} className="mt-0.5 shrink-0 text-[#B9A2FF]" />
                      <span>{line}</span>
                    </li>
                  ),
                )}
              </ul>
              <div className="flex flex-col gap-3">
                <form action={signInWithGoogle}>
                  <input type="hidden" name="next" value={lessonPath} />
                  <SubmitButton size="form" pendingLabel="Opening Google…" className="w-full font-semibold">
                    Continue with Google
                  </SubmitButton>
                </form>
                <LinkButton href={signupHref} variant="secondary" size="form" className="w-full font-medium">
                  Sign Up with Email or Phone
                </LinkButton>
              </div>
              <p className="text-center text-[13px] leading-5 text-ink-subtle">
                <button type="button" onClick={onRestart} className="cursor-pointer text-ink-soft underline underline-offset-2">
                  Keep going without an account
                </button>
                . Your progress stays on this device only.
              </p>
            </div>
          </aside>
        )}
      </main>
    </div>
  )
}
