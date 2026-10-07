'use client'
import { useState } from 'react'
import { GuestNote } from '@/components/lesson/guest-save-prompt'
import { LessonPlayer, type LessonChrome, type LessonEvent } from '@/components/lesson/player/player'
import type { LessonPack } from '@/lib/lessons/schema'

/** Shows the events the player reports, so the e2e test can check them, in the real lesson frame. */
export function PlayerFixture({ pack, startAt }: { pack: LessonPack; startAt: number }) {
  const [events, setEvents] = useState<LessonEvent[]>([])
  const chrome: LessonChrome = {
    isGuest: true,
    title: pack.title,
    meta: 'Front-End · Free lesson · No account needed',
    exitHref: '/',
    signupHref: '/signup?next=%2Flearn%2Fsamples%2Fevery-step',
  }
  return (
    <>
      <LessonPlayer
        pack={pack}
        startAt={startAt}
        chrome={chrome}
        guestNote={<GuestNote lessonPath="/learn/samples/every-step" />}
        onEvent={(e) => setEvents((list) => [...list, e])}
        onFinish={() => {}}
      />
      <p data-testid="events" className="mx-auto mt-8 max-w-3xl px-6 font-mono text-[12px] text-ink-muted">
        {events.map((e) => `${e.verb}:${e.stepsDone}`).join(' ')}
      </p>
    </>
  )
}
