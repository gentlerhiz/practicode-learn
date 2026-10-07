import type { Route } from 'next'

const signupFor = (lessonPath: string) => `/signup?next=${encodeURIComponent(lessonPath)}` as Route

/** The note guests see under the step: what happens to their progress, and how to keep it (PrismTryLesson). */
export function GuestNote({ lessonPath }: { lessonPath: string }) {
  return (
    <p className="text-[13px] leading-5 text-ink-subtle">
      You’re trying a free lesson. Your progress saves on this device.{' '}
      <a href={signupFor(lessonPath)} className="text-ink-soft underline underline-offset-2">
        Create a free account
      </a>{' '}
      to keep it everywhere and ask the AI tutor.
    </p>
  )
}
