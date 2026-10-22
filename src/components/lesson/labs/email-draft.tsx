'use client'
import { Paperclip } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

const DRAFTS = ['First draft', 'A clear subject', 'The ask first', 'Short and friendly'] as const

/** The same email improved one step at a time, from vague to ready to send (Explore lab: value = a draft). */
export function EmailDraft({ value = 'First draft' }: LabProps) {
  const at = Math.max(0, DRAFTS.indexOf(value as (typeof DRAFTS)[number]))
  const subject = at >= 1 ? 'Can you approve the November budget by Friday?' : 'Hi'
  const notes = [
    'A subject of “Hi” and a long story first. The reader has to dig for what you want, so it waits.',
    'The subject now says what it’s about, and what’s needed. People decide from the subject whether to open it now.',
    'The request comes first, with the deadline. The background follows, for anyone who wants it.',
    'Shorter, with a clear sign-off. It can be read and answered in a minute.',
  ]
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${DRAFTS[at]}. Subject: ${subject}. ${notes[at]}`}>
      <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-row text-[13px]">
        {[
          ['To', 'Grace Okafor'],
          ['Subject', subject],
        ].map(([k, v]) => (
          <div key={k} className="flex gap-2 border-b border-divider px-3 py-2">
            <span className="w-14 shrink-0 text-ink-subtle">{k}</span>
            <span className={cn('min-w-0 text-ink', k === 'Subject' && at >= 1 && 'font-semibold')}>{v}</span>
          </div>
        ))}
        <div className="flex flex-col gap-2 px-3 py-3 leading-5 text-ink-soft">
          {at === 0 && (
            <>
              <p>Hi Grace,</p>
              <p>
                Hope you’re well! So I’ve been looking at the numbers for next month, and the venue has gone up a bit, and we also had the printing,
                and Tunde said we might need more chairs, so I’ve put together a budget, which is attached. Let me know what you think when you get a
                chance.
              </p>
              <p>Thanks</p>
            </>
          )}
          {at >= 2 && (
            <>
              <p>Hi Grace,</p>
              <p className="pop-in">
                <span className="font-semibold text-ink">Could you approve the attached November budget by Friday?</span> The venue needs our
                booking by then.
              </p>
              {at === 2 ? (
                <p>
                  So I’ve been looking at the numbers for next month, and the venue has gone up a bit, and we also had the printing, and Tunde said we
                  might need more chairs.
                </p>
              ) : (
                <p className="pop-in">It’s $1,240, up $90 on October: the venue’s new price, extra printing and 20 more chairs.</p>
              )}
              <p>{at === 3 ? 'Thanks, Ada' : 'Thanks'}</p>
            </>
          )}
          {at === 1 && (
            <>
              <p>Hi Grace,</p>
              <p>
                Hope you’re well! So I’ve been looking at the numbers for next month, and the venue has gone up a bit, and we also had the printing,
                and Tunde said we might need more chairs, so I’ve put together a budget, which is attached. Let me know what you think when you get a
                chance.
              </p>
              <p>Thanks</p>
            </>
          )}
          <span className="flex items-center gap-1 self-start rounded-md bg-sheet px-2 py-0.5 text-[12px] text-ink-muted">
            <Paperclip size={12} aria-hidden="true" />
            november-budget.xlsx
          </span>
        </div>
      </div>
      <p aria-live="polite" className="text-[13px] leading-5 text-ink-soft">
        {notes[at]}
      </p>
    </figure>
  )
}
