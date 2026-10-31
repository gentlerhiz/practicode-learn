'use client'
import { cn } from '@/lib/cn'
import { clampState, type LabProps } from './shared'

type Path = { ticket: boolean | null; adult: boolean | null; who: string }

const NESTED = [
  'if has_ticket:',
  '    if age >= 18:',
  '        print("Enjoy the film")',
  '    else:',
  '        print("Come back with an adult")',
  'else:',
  '    print("Buy a ticket first")',
]
const FLAT = [
  'if has_ticket and age >= 18:',
  '    print("Enjoy the film")',
  'elif has_ticket:',
  '    print("Come back with an adult")',
  'else:',
  '    print("Buy a ticket first")',
]

const VIEWS: (Path & { lines: number[]; flat?: boolean })[] = [
  { ticket: null, adult: null, who: 'The whole decision', lines: [] },
  { ticket: true, adult: true, who: 'Ada: a ticket, age 25', lines: [0, 1, 2] },
  { ticket: true, adult: false, who: 'Ben: a ticket, age 15', lines: [0, 1, 3, 4] },
  { ticket: false, adult: null, who: 'Chi: no ticket, age 40', lines: [0, 5, 6] },
  { ticket: true, adult: false, who: 'The same, without nesting', lines: [2, 3], flat: true },
]

function Node({ text, on, off, leaf }: { text: string; on: boolean; off: boolean; leaf?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-xl border-[1.5px] px-2.5 py-2 text-center text-[12.5px] leading-[18px] motion-safe:transition-colors',
        leaf ? 'font-sans' : 'font-mono font-semibold',
        on ? 'border-fe bg-fe/15 text-ink' : off ? 'border-dashed border-line text-ink-subtle' : 'border-line bg-row text-ink',
      )}
    >
      {text}
    </div>
  )
}

const Edge = ({ label, on }: { label: string; on: boolean }) => (
  <span className={cn('self-center text-[11px] font-semibold', on ? 'text-fe-text' : 'text-ink-subtle')}>{label} ↓</span>
)

/** A decision inside a decision, walked by three people, then the same written flat with and (Diagram lab, 5 states). */
export function DecisionTree({ state }: LabProps) {
  const v = VIEWS[clampState(state, VIEWS.length)]!
  const code = v.flat ? FLAT : NESTED
  const all = v.ticket === null
  const yes = v.ticket === true
  const no = v.ticket === false
  return (
    <figure className="m-0 flex flex-col gap-3">
      <p className="m-0 text-[13px] font-semibold text-ink">{v.who}</p>
      <div role="img" aria-label={`${v.who}. ${v.ticket === null ? 'The outer question is has_ticket; only with a ticket does Python ask about age.' : `has_ticket is ${v.ticket ? 'True' : 'False'}${v.adult === null ? ', so the age question is never asked' : `, age >= 18 is ${v.adult ? 'True' : 'False'}`}.`}`} className="flex flex-col gap-2">
        <Node text="has_ticket?" on={!all} off={false} />
        <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-2">
          <div className="flex flex-col gap-2">
            <Edge label="True" on={yes} />
            <Node text="age >= 18?" on={yes} off={no} />
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-2">
                <Edge label="True" on={yes && v.adult === true} />
                <Node leaf text="Enjoy the film" on={yes && v.adult === true} off={!all && !(yes && v.adult === true)} />
              </div>
              <div className="flex flex-col gap-2">
                <Edge label="False" on={yes && v.adult === false} />
                <Node leaf text="Come back with an adult" on={yes && v.adult === false} off={!all && !(yes && v.adult === false)} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Edge label="False" on={no} />
            <Node leaf text="Buy a ticket first" on={no} off={!all && !no} />
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-line bg-row py-2 font-mono text-[12px] leading-6 @min-[420px]:text-[12.5px]">
        {code.map((c, i) => (
          <div key={`${v.flat}-${i}`} className={cn('px-3 whitespace-pre-wrap [overflow-wrap:anywhere]', v.lines.includes(i) ? 'bg-fe/15 font-semibold text-ink shadow-[inset_3px_0_0_#3d5af5]' : 'text-ink-soft')}>
            {c}
          </div>
        ))}
      </div>
    </figure>
  )
}
