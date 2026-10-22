'use client'
import { cn } from '@/lib/cn'
import { clampState, type LabProps } from './shared'

// The same sign-ups, first as scribbled on paper, then tidied into a table.
const PAPER = ['Ada Obi – 0800 000 0001 – Lagos', 'tunde (Ibadan) 08000000002', 'Grace Mensah, Accra, +233 20 000 0003', 'Ada Obi – 0800 000 0001 – Lagos', 'Musa — Kano — ?']

const ROWS = [
  { id: 1, first: 'Ada', last: 'Obi', city: 'Lagos', phone: '+234 800 000 0001' },
  { id: 2, first: 'Tunde', last: '', city: 'Ibadan', phone: '+234 800 000 0002' },
  { id: 3, first: 'Grace', last: 'Mensah', city: 'Accra', phone: '+233 20 000 0003' },
  { id: 4, first: 'Musa', last: '', city: 'Kano', phone: '' },
]

const STATES = [
  { name: 'A paper sign-up sheet', line: 'Five people signed up for a course, each writing in their own way. One person signed twice, and one left a gap.' },
  { name: 'Fields', line: 'First, decide the fields: the columns, one for each kind of fact. Each field holds one thing.' },
  { name: 'Records', line: 'Each person becomes a record: a row, with one value in each field. The duplicate Ada is gone.' },
  { name: 'A unique ID', line: 'An id field gives every record its own number, so two people with the same name can never be mixed up.' },
  { name: 'Consistent values', line: 'Every phone number in the same format, every name split into first and last. Now it can be sorted, searched and counted.' },
  { name: 'Missing values', line: 'Tunde and Musa gave no surname, and Musa no phone number. Those cells stay empty, rather than “?” or a guess, so the table only holds what’s known.' },
]

/** A paper sign-up sheet turned into a tidy table, one idea at a time (Diagram lab, 6 states). */
export function SignupTable({ state }: LabProps) {
  const at = clampState(state, STATES.length)
  const s = STATES[at]!
  const showId = at >= 3
  const tidy = at >= 4
  const cols = [...(showId ? (['id'] as const) : []), 'first', 'last', 'city', 'phone'] as const
  const label = { id: 'id', first: 'first_name', last: 'last_name', city: 'city', phone: 'phone' }
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={`${s.name}. ${s.line}`}>
        {at === 0 ? (
          <ul className="flex flex-col gap-1.5 rounded-xl border border-line p-3" style={{ background: '#fffbea' }}>
            {PAPER.map((p, i) => (
              <li key={i} className="font-mono text-[12.5px] leading-5 text-[#3b3752] [overflow-wrap:anywhere]" style={{ transform: `rotate(${[-0.6, 0.8, -0.3, 0.5, -0.8][i]}deg)` }}>
                {p}
              </li>
            ))}
          </ul>
        ) : (
          <div className="overflow-hidden rounded-xl border border-line">
            <table className="w-full table-fixed text-[11px] @min-[420px]:text-[12px]">
              <thead>
                <tr className="bg-sunken">
                  {cols.map((c) => (
                    <th key={c} scope="col" className={cn('px-1 py-1.5 text-left font-mono text-[10px] font-semibold text-ink @min-[420px]:px-1.5 @min-[420px]:text-[11.5px]', c === 'id' && 'w-7 text-it-text @min-[420px]:w-9', c === 'phone' && 'w-[32%]', at === 1 && 'pop-in bg-[rgba(255,170,60,0.16)]')}>
                      {label[c].replace('_', '_\u200b')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {at >= 2 &&
                  ROWS.map((r, i) => (
                    <tr key={r.id} className={cn('border-t border-divider', at === 2 && 'pop-in bg-[rgba(255,170,60,0.10)]')}>
                      {cols.map((c) => (
                        <td
                          key={c}
                          className={cn(
                            'px-1 py-1.5 text-ink @min-[420px]:px-1.5',
                            c === 'id' && 'font-mono text-it-text',
                            c === 'phone' && 'font-mono text-[10px] [overflow-wrap:anywhere] @min-[420px]:text-[11.5px]',
                            at === 5 && (c === 'phone' || c === 'last') && !r[c] && 'bg-[rgba(255,170,60,0.18)] outline-1 outline-it outline-dashed -outline-offset-2',
                          )}
                        >
                          {c === 'phone' && !tidy ? (['0800 000 0001', '08000000002', '+233 20 000 0003', '?'][i] ?? '') : String(r[c])}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <figcaption aria-live="polite" className="flex flex-col gap-1 rounded-2xl border border-line bg-row px-4 py-3">
        <span className="font-display text-[15px] font-bold text-ink">{s.name}</span>
        <span className="text-[13px] leading-5 text-ink-soft">{s.line}</span>
      </figcaption>
    </figure>
  )
}
