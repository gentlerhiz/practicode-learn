import { supabaseConfigured } from '@/lib/public-config'
import { outcome } from './outcome'
import { createQueue } from './queue'
import type { ProgressEvent } from './types'

const toArgs = (e: ProgressEvent) => ({
  p_event_id: e.id,
  p_lesson_id: e.lessonId,
  p_lesson_version: e.lessonVersion,
  p_verb: e.verb,
  p_occurred_at: e.occurredAt,
  p_steps_done: e.stepsDone,
  p_active_seconds: e.activeSeconds,
  p_attempts: e.attempts,
  p_offline: e.offline,
})

let queue: ReturnType<typeof createQueue> | undefined
const getQueue = () => (queue ??= createQueue(localStorage))
let running: Promise<void> | null = null
const dropped = new Set<string>()

/** Saves an event on the device and tries to send it straight away. */
export function recordProgress(event: ProgressEvent): void {
  getQueue().enqueue(event)
  void syncProgress()
}

/**
 * Sends waiting events in order. One run at a time; signed-out learners keep their events for later.
 * The Supabase client (about 70 KB) is loaded only when there is something to send, so lesson pages
 * stay light. Without Supabase settings, events simply stay queued.
 */
export function syncProgress(): Promise<void> {
  if (!supabaseConfigured || getQueue().pending().length === 0) return Promise.resolve()
  running ??= (async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      await getQueue().flush(async (e) => {
        let response: { status: number; error: { code?: string } | null }
        try {
          response = await supabase.rpc('record_progress', toArgs(e))
        } catch {
          return 'retry' // offline, or the request never completed
        }
        const result = outcome(response)
        if (result !== 'drop') return result
        if (!dropped.has(e.id)) {
          dropped.add(e.id)
          console.warn('A progress event was refused and dropped', e.id, response.error)
        }
        return 'ok'
      })
    } catch {
      // Never throw from a background sync: the events stay queued for the next try.
    } finally {
      running = null
    }
  })()
  return running
}

/**
 * Keeps progress flowing while a lesson is open: when the connection comes back, every 30 seconds, and
 * once at the start (events from an earlier visit go out after the learner has signed in).
 */
export function startProgressSync(): () => void {
  const sync = () => void syncProgress()
  window.addEventListener('online', sync)
  const timer = setInterval(sync, 30_000)
  sync()
  return () => {
    window.removeEventListener('online', sync)
    clearInterval(timer)
  }
}
