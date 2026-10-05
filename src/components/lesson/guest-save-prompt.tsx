import type { Route } from 'next'
import { LinkButton } from '@/components/ui'

const signupFor = (lessonPath: string) => `/signup?next=${encodeURIComponent(lessonPath)}` as Route

/** For guests at the end of a lesson: their progress is on this device until they make an account. */
export function GuestSavePrompt({ lessonPath }: { lessonPath: string }) {
  return (
    <section
      aria-labelledby="save-progress"
      className="flex flex-col gap-3 rounded-3xl border border-fe/40 bg-fe/10 p-6"
    >
      <h3 id="save-progress" className="font-display text-xl font-bold text-ink">
        Save your progress. It’s free.
      </h3>
      <p className="text-[15px] leading-6 text-ink-soft">
        This lesson is saved on this device for now. Create a free account to keep it and pick up on any
        device.
      </p>
      <div>
        <LinkButton href={signupFor(lessonPath)}>Save My Progress</LinkButton>
      </div>
    </section>
  )
}

/** The note guests see while they play: what happens to their progress, and how to keep it. */
export function GuestNote({ lessonPath }: { lessonPath: string }) {
  return (
    <p className="rounded-2xl border border-line-subtle bg-row px-4 py-3 text-sm text-ink-soft">
      You’re trying a free lesson. Your progress is saved on this device.{' '}
      <a href={signupFor(lessonPath)} className="font-semibold text-ink underline underline-offset-2">
        Create a free account
      </a>{' '}
      to keep it.
    </p>
  )
}
