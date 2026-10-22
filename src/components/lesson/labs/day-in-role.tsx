'use client'
import type { LabProps } from './shared'
import { ROLES } from './roles-data'

/** A typical day in one tech role, as a timeline, with tools and who'd enjoy it (Explore lab: value = a role). */
export function DayInRole({ value = 'IT support technician' }: LabProps) {
  const name = ROLES[value] ? value : 'IT support technician'
  const r = ROLES[name]!
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${name}: ${r.does} A typical day: ${r.day.map(([t, d]) => `${t}, ${d}`).join('; ')}.`}>
      <div className="flex flex-col gap-1 rounded-2xl border border-line bg-row px-4 py-3">
        <p className="text-[11px] text-ink-subtle">{r.family}</p>
        <p className="font-display text-lg font-bold text-ink">{name}</p>
        <p className="text-[13px] leading-5 text-ink-soft">{r.does}</p>
      </div>
      <ol className="relative flex flex-col gap-2 pl-5">
        <span aria-hidden="true" className="absolute top-2 bottom-2 left-[5px] w-0.5 bg-line-control" />
        {r.day.map(([time, what]) => (
          <li key={time} className="pop-in relative grid grid-cols-[44px_minmax(0,1fr)] gap-2 text-[13px] leading-5">
            <span aria-hidden="true" className="absolute top-1.5 -left-[19px] size-2.5 rounded-full bg-it" />
            <span className="font-mono text-[12px] text-it-text">{time}</span>
            <span className="text-ink">{what}</span>
          </li>
        ))}
      </ol>
      <dl className="flex flex-col gap-1.5 text-[12.5px] leading-5">
        <div>
          <dt className="inline font-semibold text-ink">You might enjoy it if: </dt>
          <dd className="inline text-ink-soft">{r.enjoy.replace(/^You /, 'you ')}</dd>
        </div>
        <div>
          <dt className="inline font-semibold text-ink">Tools: </dt>
          <dd className="inline text-ink-soft">{r.tools}</dd>
        </div>
      </dl>
      <p className="text-[11px] text-ink-subtle">A typical day. Every team works differently.</p>
    </figure>
  )
}
