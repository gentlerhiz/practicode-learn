'use client'
import { useEffect, useRef, useState } from 'react'
import type { LessonPack } from '@/lib/lessons/schema'
import { recordProgress, startProgressSync } from '@/lib/progress/sync'
import { createActiveTimer } from '@/lib/progress/tracker'
import type { ProgressEvent } from '@/lib/progress/types'
import { GuestNote } from './guest-save-prompt'
import { LessonComplete, type NextLesson } from './lesson-complete'
import { LessonPlayer, type LessonEvent } from './player/player'

type Timer = ReturnType<typeof createActiveTimer>

/**
 * The client side of a lesson page: plays the pack, measures active time, records lesson_started on the
 * first interaction and lesson_completed on finish (offline-safe, synced when possible), and shows the
 * completion screen. Guests keep their progress on the device until they sign up.
 */
export function LessonShell({
  pack,
  lessonPath,
  shareUrl,
  eyebrow,
  nextLesson,
}: {
  pack: LessonPack
  lessonPath: string
  shareUrl: string
  eyebrow: string
  nextLesson?: NextLesson
}) {
  const timer = useRef<Timer | null>(null)
  const started = useRef(false)
  const seconds = useRef(0)
  const [isGuest, setIsGuest] = useState(true)
  const [minutes, setMinutes] = useState(1)
  const points = pack.steps.flatMap((s) => (s.type === 'recap' ? s.points : []))

  const record = (verb: ProgressEvent['verb'], stepsDone: number, attempts: Record<string, number>) => {
    const active = timer.current?.take() ?? 0
    seconds.current += active
    recordProgress({
      id: crypto.randomUUID(),
      lessonId: pack.id,
      lessonVersion: pack.version,
      verb,
      occurredAt: new Date().toISOString(),
      stepsDone,
      activeSeconds: active,
      attempts,
      offline: !navigator.onLine,
    })
  }
  const latestRecord = useRef(record)
  useEffect(() => {
    latestRecord.current = record
  })

  useEffect(() => {
    const t = createActiveTimer({ now: () => performance.now(), idleAfterMs: 120_000 })
    timer.current = t
    const touch = () => {
      t.touch()
      if (!started.current) {
        started.current = true
        latestRecord.current('lesson_started', 0, {})
      }
    }
    const onVisibility = () => t.visible(document.visibilityState === 'visible')
    window.addEventListener('pointerdown', touch)
    window.addEventListener('keydown', touch)
    window.addEventListener('scroll', touch, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    const stopSync = startProgressSync()
    // Only decides whether to offer sign-up, so the session cookie's presence is enough; it saves loading
    // the Supabase client (about 70 KB) on every lesson page. Nothing about access depends on it.
    if (/(?:^|;\s*)sb-[^=]+-auth-token(?:\.\d+)?=/.test(document.cookie)) {
      queueMicrotask(() => setIsGuest(false))
    }
    return () => {
      window.removeEventListener('pointerdown', touch)
      window.removeEventListener('keydown', touch)
      window.removeEventListener('scroll', touch)
      document.removeEventListener('visibilitychange', onVisibility)
      stopSync()
    }
  }, [])

  const onEvent = (e: LessonEvent) => {
    // The player reports a start when it mounts; a lesson counts as started at the first interaction.
    if (e.verb !== 'lesson_completed') return
    if (!started.current) {
      started.current = true
      record('lesson_started', 0, {})
    }
    record('lesson_completed', e.stepsDone, e.attempts)
    setMinutes(Math.max(1, Math.round(seconds.current / 60)))
  }

  return (
    <div className="flex flex-col gap-5">
      {isGuest && <GuestNote lessonPath={lessonPath} />}
      <LessonPlayer
        pack={pack}
        hideTitle
        onEvent={onEvent}
        onFinish={() => {}}
        complete={({ restart }) => (
          <LessonComplete
            eyebrow={eyebrow}
            lessonNumber={pack.lesson}
            minutes={minutes}
            points={points}
            nextLesson={nextLesson}
            share={{ url: shareUrl, title: pack.title }}
            isGuest={isGuest}
            lessonPath={lessonPath}
            onRestart={() => {
              started.current = false
              seconds.current = 0
              restart()
            }}
          />
        )}
      />
    </div>
  )
}
