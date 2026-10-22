'use client'
import { FileAudio, FileImage, Mail } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

type Kind = 'Structured' | 'Semi-structured' | 'Unstructured'

const ITEMS: Record<string, { kind: Kind; why: string }> = {
  'A table of orders': { kind: 'Structured', why: 'Every row has the same fields, of the same type. A computer can sort, count and search it instantly.' },
  'A form’s answers': { kind: 'Semi-structured', why: 'Labelled pieces, such as name and email, but not a fixed table: some answers are missing, and some are free text.' },
  'An email': { kind: 'Unstructured', why: 'Mostly free text. A sender, a date and a subject are labelled, but what the message says has no fixed shape.' },
  'A photo': { kind: 'Unstructured', why: 'Millions of pixels. A person sees a beach at once; a computer needs AI to tell what’s in it.' },
  'A voice note': { kind: 'Unstructured', why: 'Sound. To search it, it first has to be turned into text.' },
}

const KINDS: Kind[] = ['Structured', 'Semi-structured', 'Unstructured']

function Sample({ name }: { name: string }) {
  switch (name) {
    case 'A table of orders':
      return (
        <table className="w-full text-[11.5px]">
          <thead>
            <tr className="text-left text-ink-subtle">
              {['id', 'customer', 'item', 'qty'].map((h) => (
                <th key={h} className="pb-1 font-mono font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono text-ink">
            {[
              [101, 'Ada', 'Mango juice', 2],
              [102, 'Tunde', 'Orange juice', 1],
              [103, 'Grace', 'Mango juice', 3],
            ].map((r) => (
              <tr key={r[0]} className="border-t border-divider">
                {r.map((c, i) => (
                  <td key={i} className="py-1">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )
    case 'A form’s answers':
      return (
        <pre className="m-0 font-mono text-[11.5px] leading-5 whitespace-pre-wrap text-ink [overflow-wrap:anywhere]">
          {'{\n  "name": "Ada Obi",\n  "email": "ada@example.com",\n  "comments": "Can I bring my sister?"\n}'}
        </pre>
      )
    case 'An email':
      return (
        <div className="flex gap-2 text-[12px] leading-5 text-ink">
          <Mail size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-it-text" />
          <p>
            <span className="text-ink-subtle">From Grace · Re: Saturday</span>
            <br />
            Hi! The stall did really well last week, I think mango is the favourite. Shall we make more for the weekend? Also my cousin wants to help.
          </p>
        </div>
      )
    case 'A photo':
      return (
        <div className="flex items-center gap-3">
          <span className="grid h-16 w-24 place-items-center rounded-md" style={{ background: 'linear-gradient(180deg,#5fd8f2 0%,#5fd8f2 55%,#ffc15c 55%,#ffc15c 100%)' }}>
            <FileImage size={20} aria-hidden="true" className="text-white" />
          </span>
          <span className="font-mono text-[12px] text-ink-muted">beach.jpg · 4032 × 3024 pixels</span>
        </div>
      )
    default:
      return (
        <div className="flex items-center gap-3">
          <FileAudio size={22} aria-hidden="true" className="shrink-0 text-it-text" />
          <span aria-hidden="true" className="flex h-8 flex-1 items-center gap-0.5">
            {[4, 9, 14, 7, 18, 11, 5, 16, 20, 9, 6, 13, 17, 8, 4, 12, 15, 7].map((h, i) => (
              <span key={i} className="w-1 rounded-full bg-it" style={{ height: `${h + 4}px` }} />
            ))}
          </span>
          <span className="font-mono text-[12px] text-ink-muted">0:42</span>
        </div>
      )
  }
}

/** Five kinds of data, from a tidy table to a voice note (Explore lab: value = an item). */
export function DataKinds({ value = 'A table of orders' }: LabProps) {
  const name = ITEMS[value] ? value : 'A table of orders'
  const it = ITEMS[name]!
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${name}: ${it.kind}. ${it.why}`}>
      <div className="rounded-xl border border-line bg-row p-3">
        <Sample name={name} />
      </div>
      <ol className="grid grid-cols-3 gap-1.5" aria-hidden="true">
        {KINDS.map((k) => (
          <li
            key={k}
            className={cn(
              'rounded-lg border-[1.5px] px-1.5 py-1.5 text-center text-[11.5px] leading-4 font-semibold motion-safe:transition-colors motion-safe:duration-300',
              k === it.kind ? 'border-it bg-it text-white' : 'border-line bg-sunken text-ink-muted',
            )}
          >
            {k}
          </li>
        ))}
      </ol>
      <p aria-live="polite" className="text-[13px] leading-5 text-ink-soft">
        <span className="font-semibold text-ink">{it.kind}. </span>
        {it.why}
      </p>
    </figure>
  )
}
