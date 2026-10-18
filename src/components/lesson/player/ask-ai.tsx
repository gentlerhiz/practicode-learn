'use client'
import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { TutorSpark } from '@/components/learn/tutor-spark'
import { Button, Spinner } from '@/components/ui'
import type { LessonFile } from '@/lib/lessons/schema'

/** What the tutor needs to know about where the learner is. */
export type TutorView = { lessonId: string; step: number; selected?: string; files?: LessonFile[] }

type Turn = { role: 'user' | 'assistant'; content: string }
type Quota = { used: number; cap: number }

// Below the ph breakpoint (600px) the panel is a sheet at the bottom of the screen.
const PHONE = '(max-width: 37.49rem)'
const onWidth = (change: () => void) => {
  const media = matchMedia(PHONE)
  media.addEventListener('change', change)
  return () => media.removeEventListener('change', change)
}

const field =
  'w-full resize-none rounded-xl border border-line-control bg-control px-3 py-2 text-sm leading-6 text-ink placeholder:text-ink-subtle focus:border-line-strong focus:outline-none'

/**
 * Ask AI in the lesson header: a panel where the learner asks about the step they're on. The talk is kept
 * per step and starts again on a new one. Shows the questions left today, and says the AI can be wrong.
 */
export function AskAi({ view }: { view: TutorView }) {
  const [open, setOpen] = useState(false)
  const [quota, setQuota] = useState<Quota | null>(null)
  // The talk belongs to one step; a new step starts with none.
  const here = `${view.lessonId}:${view.step}`
  const [talk, setTalk] = useState<{ at: string; turns: Turn[] }>({ at: here, turns: [] })
  const turns = talk.at === here ? talk.turns : []
  const setTurns = (update: (t: Turn[]) => Turn[]) => setTalk({ at: here, turns: update(turns) })
  const [question, setQuestion] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const panelId = useId()
  const input = useRef<HTMLTextAreaElement>(null)
  const panel = useRef<HTMLElement>(null)
  const end = useRef<HTMLDivElement>(null)
  const phone = useSyncExternalStore(
    onWidth,
    () => matchMedia(PHONE).matches,
    () => false,
  )

  useEffect(() => {
    if (!open) return
    // On a phone, focusing the question box would open the keyboard over the conversation straight away.
    if (matchMedia(PHONE).matches) panel.current?.focus()
    else input.current?.focus()
    fetch('/api/tutor')
      .then((r) => (r.ok ? r.json() : null))
      .then((q: Quota | null) => q && setQuota(q))
      .catch(() => {})
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    end.current?.scrollIntoView({ block: 'nearest' })
  }, [talk, busy])

  const left = quota ? Math.max(0, quota.cap - quota.used) : null

  async function send(e: React.FormEvent) {
    e.preventDefault()
    const q = question.trim()
    if (!q || busy) return
    setBusy(true)
    setNotice(null)
    try {
      const r = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...view, question: q, history: turns.slice(-6) }),
      })
      const body = (await r.json().catch(() => ({}))) as Partial<Quota> & { answer?: string; error?: string }
      if (typeof body.used === 'number' && typeof body.cap === 'number')
        setQuota({ used: body.used, cap: body.cap })
      if (r.ok && body.answer) {
        setTurns((t) => [...t, { role: 'user', content: q }, { role: 'assistant', content: body.answer! }])
        setQuestion('')
      } else if (r.status === 429) {
        setNotice(
          `You’ve used today’s ${body.cap} questions. They come back at midnight. The Hint button still works.`,
        )
      } else if (r.status === 503) {
        setNotice('The tutor is busy right now. Try again in a minute. That question wasn’t counted.')
      } else if (r.status === 401) {
        setNotice('Log in again to ask the tutor.')
      } else {
        setNotice('Something went wrong. Try again.')
      }
    } catch {
      setNotice(
        navigator.onLine
          ? 'Something went wrong. Try again.'
          : 'The tutor needs a connection. You’re offline.',
      )
    } finally {
      setBusy(false)
    }
  }

  const sheet = open && (
    <section
      ref={panel}
      id={panelId}
      aria-label="AI tutor"
      tabIndex={-1}
      className={
        phone
          ? 'fixed inset-x-2 bottom-2 z-50 flex max-h-[85dvh] flex-col rounded-2xl border border-line shadow-xl surface focus:outline-none'
          : 'absolute top-full right-0 z-40 mt-2 flex max-h-[70dvh] w-[380px] flex-col rounded-2xl border border-line shadow-xl surface focus:outline-none'
      }
    >
      <header className="flex items-center gap-3 border-b border-line px-4 py-3">
        <TutorSpark size={28} />
        <div className="min-w-0 flex-1">
          <p className="font-display font-bold text-ink">AI tutor</p>
          <p className="text-xs text-ink-muted" aria-live="polite">
            {left === null ? 'Asks about this step' : `${left} of ${quota!.cap} questions left today`}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
          Close
        </Button>
      </header>

      <div
        className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-3 text-sm leading-6"
        aria-live="polite"
      >
        {turns.length === 0 && !busy && (
          <p className="text-ink-muted">
            Stuck on this step? Ask about it. The tutor gives a hint first; ask again once you’ve had a go and
            it explains fully.
          </p>
        )}
        {turns.map((t, i) =>
          t.role === 'user' ? (
            <p
              key={i}
              className="ml-8 rounded-2xl rounded-tr-md bg-row px-3 py-2 break-words whitespace-pre-wrap text-ink"
            >
              {t.content}
            </p>
          ) : (
            <div key={i} className="mr-4 rounded-2xl rounded-tl-md border border-line bg-control px-3 py-2">
              <p className="break-words whitespace-pre-wrap text-ink-soft">{t.content}</p>
            </div>
          ),
        )}
        {busy && (
          <p className="flex items-center gap-2 text-ink-muted">
            <Spinner /> Thinking…
          </p>
        )}
        {notice && (
          <p role="alert" className="rounded-xl border border-line bg-row px-3 py-2 text-ink">
            {notice}
          </p>
        )}
        <div ref={end} />
      </div>

      <form onSubmit={send} className="border-t border-line px-4 py-3">
        <label htmlFor={`${panelId}-q`} className="sr-only">
          Your question about this step
        </label>
        <textarea
          id={`${panelId}-q`}
          ref={input}
          rows={2}
          maxLength={500}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              e.currentTarget.form?.requestSubmit()
            }
          }}
          placeholder="Why doesn’t my link work?"
          className={field}
        />
        <div className="mt-2 flex items-center gap-3">
          <p className="flex-1 text-xs text-ink-muted">AI can make mistakes. Check it against the lesson.</p>
          <Button type="submit" size="sm" pending={busy} disabled={!question.trim() || left === 0}>
            Ask
          </Button>
        </div>
      </form>
    </section>
  )

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex h-[42px] press cursor-pointer items-center gap-2 rounded-full border border-line-control py-0 pr-4 pl-1.5 text-sm font-medium text-ink hover:border-line-strong"
      >
        <TutorSpark size={30} />
        Ask AI
      </button>
      {phone && sheet
        ? createPortal(
            <>
              <div
                aria-hidden="true"
                className="fixed inset-0 z-50 bg-black/40"
                onClick={() => setOpen(false)}
              />
              {sheet}
            </>,
            document.body,
          )
        : sheet}
    </div>
  )
}
