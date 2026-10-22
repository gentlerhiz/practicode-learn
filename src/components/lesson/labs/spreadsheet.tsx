'use client'
import { RotateCcw } from 'lucide-react'
import { useId, useState } from 'react'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'
import { evaluate, show, type Cells } from './sheet-engine'

const COLS = ['A', 'B', 'C']
const ROWS = [1, 2, 3, 4, 5, 6, 7, 8]

/** A month's budget. The value of the lab goes in B8. */
const START: Cells = {
  A1: 'Item',
  B1: 'Monthly',
  C1: 'Yearly',
  A2: 'Rent',
  B2: '300',
  C2: '=B2*12',
  A3: 'Food',
  B3: '120',
  C3: '=B3*12',
  A4: 'Transport',
  B4: '45',
  C4: '=B4*12',
  A5: 'Phone',
  B5: '15',
  C5: '=B5*12',
  A6: 'Savings',
  B6: '50',
  C6: '=B6*12',
  A8: 'Answer',
}

const HEADS = new Set(['A1', 'B1', 'C1'])

function Sheet({ value }: { value: string }) {
  const first = value.startsWith('=') ? value : `=${value}`
  const [cells, setCells] = useState<Cells>(() => ({ ...START, B8: first }))
  const [sel, setSel] = useState('B8')
  const [draft, setDraft] = useState(first)
  const id = useId()
  const result = evaluate(cells, sel)
  const refs = new Set(result.refs)

  const pick = (cell: string) => {
    setSel(cell)
    setDraft(cells[cell] ?? '')
  }
  const commit = () => setCells((c) => ({ ...c, [sel]: draft }))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-stretch gap-2">
        <span className="grid w-12 shrink-0 place-items-center rounded-lg border border-line bg-sunken font-mono text-[13px] font-semibold text-ink">{sel}</span>
        <label htmlFor={id} className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-line bg-row px-2.5 focus-within:border-focus">
          <span aria-hidden="true" className="font-serif text-[13px] text-ink-subtle italic">
            fx
          </span>
          <span className="sr-only">{`Contents of ${sel}. Type a number or a formula starting with =, then press Enter.`}</span>
          <input
            id={id}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                commit()
              }
            }}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="characters"
            className="h-10 min-w-0 flex-1 bg-transparent font-mono text-[13px] text-ink outline-none"
          />
        </label>
        <button
          type="button"
          aria-label="Reset the sheet"
          onClick={() => {
            setCells({ ...START, B8: first })
            setSel('B8')
            setDraft(first)
          }}
          className="press grid w-10 shrink-0 cursor-pointer place-items-center rounded-lg border border-line-control text-ink hover:bg-hover"
        >
          <RotateCcw size={15} aria-hidden="true" />
        </button>
      </div>
      <div className="overflow-hidden rounded-xl border border-line">
        <table className="w-full table-fixed border-collapse text-[13px]">
          <caption className="sr-only">A budget spreadsheet. Choose a cell to see or change what’s in it.</caption>
          <thead>
            <tr className="bg-sunken text-[11px] text-ink-subtle">
              <th scope="col" className="w-7 border-r border-b border-line font-normal" />
              {COLS.map((c) => (
                <th key={c} scope="col" className={cn('border-r border-b border-line py-1 font-normal last:border-r-0', c === 'A' && 'w-[38%]')}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r}>
                <th scope="row" className="border-r border-b border-line bg-sunken text-[11px] font-normal text-ink-subtle">
                  {r}
                </th>
                {COLS.map((c) => {
                  const cell = `${c}${r}`
                  const v = evaluate(cells, cell)
                  const isSel = cell === sel
                  const isRef = refs.has(cell)
                  return (
                    <td key={cell} className="border-r border-b border-line p-0 last:border-r-0">
                      <button
                        type="button"
                        onClick={() => pick(cell)}
                        aria-label={`${cell}: ${show(v.value) || 'empty'}`}
                        aria-pressed={isSel}
                        className={cn(
                          'block h-8 w-full cursor-cell truncate px-1.5 text-left motion-safe:transition-colors',
                          typeof v.value === 'number' && 'text-right font-mono',
                          HEADS.has(cell) && 'font-semibold text-ink',
                          v.error ? 'text-error' : 'text-ink',
                          isSel ? 'outline-2 -outline-offset-2 outline-fe bg-[rgba(61,90,245,0.12)]' : isRef ? 'bg-[rgba(255,170,60,0.18)] outline-2 -outline-offset-2 outline-dashed outline-it' : 'bg-row hover:bg-hover',
                          r === 8 && !isSel && !isRef && 'bg-sunken',
                        )}
                      >
                        {show(v.value)}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p aria-live="polite" className="text-[13px] leading-5 text-ink-soft">
        {result.error ? (
          <>
            <span className="font-mono font-semibold text-error">{result.error}</span>{' '}
            {
              {
                '#DIV/0!': 'means dividing by zero, or averaging nothing.',
                '#NAME?': 'means the spreadsheet doesn’t know that function’s name. Check the spelling.',
                '#VALUE!': 'means doing maths with text.',
                '#REF!': 'means the formula points at a cell that can’t be used, such as itself.',
                '#ERROR!': 'means the formula isn’t finished, or has a typo.',
              }[result.error]
            }
          </>
        ) : (cells[sel] ?? '').startsWith('=') ? (
          <>
            <span className="font-mono text-ink">{cells[sel]}</span> gives <span className="font-semibold text-ink">{show(result.value)}</span>
            {result.refs.length > 0 && <span className="text-ink-muted">, using {result.refs.join(', ')} (dashed)</span>}.
          </>
        ) : (
          <>Choose a cell, or type a formula into B8, starting with =.</>
        )}
      </p>
    </div>
  )
}

/**
 * A practice spreadsheet: a month's budget, with a formula in B8 that the learner can change, and every
 * cell editable (Explore lab: value = the formula to start with, such as =SUM(B2:B6)).
 */
export function Spreadsheet({ value = '=B2+B3' }: LabProps) {
  return <Sheet key={value} value={value} />
}
