'use client'
import { useState } from 'react'
import { LessonPlayer, type LessonEvent } from '@/components/lesson/player/player'
import type { LessonPack } from '@/lib/lessons/schema'

/** Shows the events the player reports, so the e2e test can check them. */
export function PlayerFixture({ pack, startAt }: { pack: LessonPack; startAt: number }) {
  const [events, setEvents] = useState<LessonEvent[]>([])
  return (
    <>
      <LessonPlayer
        pack={pack}
        startAt={startAt}
        onEvent={(e) => setEvents((list) => [...list, e])}
        onFinish={() => {}}
      />
      <p data-testid="events" className="mx-auto mt-8 max-w-3xl font-mono text-[12px] text-ink-muted">
        {events.map((e) => `${e.verb}:${e.stepsDone}`).join(' ')}
      </p>
    </>
  )
}
