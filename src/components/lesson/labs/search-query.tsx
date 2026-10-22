'use client'
import { Search } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

const QUERIES: Record<string, { q: string; score: number; results: string[]; note: string }> = {
  'Too vague': {
    q: 'my computer is broken',
    score: 1,
    results: ['Computer repair shops near you', 'What to do when your computer breaks', 'Buy a new laptop: best deals'],
    note: 'No device, no symptom, no error. Results are adverts and general advice.',
  },
  'Add the symptom': {
    q: 'laptop very slow',
    score: 2,
    results: ['10 ways to speed up a slow laptop', 'Why is my laptop so slow?', 'Laptop slow? Try these fixes'],
    note: 'Closer, but general. Which system? Since when?',
  },
  'Add the system and the change': {
    q: 'Windows 11 laptop slow after update',
    score: 3,
    results: ['Windows 11 slow after the latest update: fixes (community forum)', 'Microsoft Support: performance problems after updating', 'Roll back an update in Windows 11'],
    note: 'The system and what changed narrow it to people with your exact problem.',
  },
  'Search the exact error': {
    q: 'Windows Update error 0x80070005',
    score: 4,
    results: ['Microsoft Support: Windows Update error 0x80070005', 'Fix 0x80070005: access denied when updating (forum, solved)', 'What error 0x80070005 means'],
    note: 'An error code is the best search of all: it points to one cause, and the official page usually comes first.',
  },
}

/** The same problem searched four ways, from vague to exact (Explore lab: value = a stage). */
export function SearchQuery({ value = 'Too vague' }: LabProps) {
  const name = QUERIES[value] ? value : 'Too vague'
  const q = QUERIES[name]!
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`Search: ${q.q}. ${q.note}`}>
      <div className="flex items-center gap-2 rounded-full border border-line bg-row px-4 py-2.5">
        <Search size={16} aria-hidden="true" className="shrink-0 text-ink-muted" />
        <span className="min-w-0 font-mono text-[13.5px] [overflow-wrap:anywhere] text-ink">{q.q}</span>
      </div>
      <ul className="flex flex-col gap-1.5">
        {q.results.map((r) => (
          <li key={r} className="pop-in rounded-xl border border-line bg-row px-3 py-2 text-[13px] leading-5 text-fe-text underline decoration-fe-text/40 underline-offset-2">
            {r}
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[12px]">
          <span className="font-semibold text-ink">How useful</span>
          <span className="text-ink-muted">{['', 'Hardly', 'A little', 'Useful', 'Spot on'][q.score]}</span>
        </div>
        <div aria-hidden="true" className="grid grid-cols-4 gap-1">
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className={cn('h-2 rounded-full motion-safe:transition-colors', i <= q.score ? 'bg-it' : 'bg-meter')} />
          ))}
        </div>
      </div>
      <p aria-live="polite" className="text-[13px] leading-5 text-ink-soft">
        {q.note} <span className="text-ink-subtle">(Example results, written for this lesson.)</span>
      </p>
    </figure>
  )
}
