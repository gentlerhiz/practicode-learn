'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

type Rung = { test: string; min: number; grade: string }

const RIGHT: Rung[] = [
  { test: 'score >= 70', min: 70, grade: 'A' },
  { test: 'score >= 60', min: 60, grade: 'B' },
  { test: 'score >= 50', min: 50, grade: 'C' },
]
// The classic bug: the widest test first, so it catches every pass mark before the others are reached.
const WRONG: Rung[] = [...RIGHT].reverse()

/**
 * An if, elif and else ladder marking a test score (Explore lab: value = a score, such as 64, or
 * "85 (wrong order)" for the same ladder with its tests in the wrong order).
 */
export function ElifLadder({ value = '85' }: LabProps) {
  const wrong = value.includes('wrong')
  const score = Number.parseInt(value, 10)
  const s = Number.isFinite(score) ? score : 85
  const rungs = wrong ? WRONG : RIGHT
  const hit = rungs.findIndex((r) => s >= r.min)
  const grade = hit >= 0 ? rungs[hit]!.grade : 'Try again'
  const lines: { code: string; rung?: number; body?: number | 'else' }[] = []
  rungs.forEach((r, i) => {
    lines.push({ code: `${i === 0 ? 'if' : 'elif'} ${r.test}:`, rung: i })
    lines.push({ code: `    grade = "${r.grade}"`, body: i })
  })
  lines.push({ code: 'else:' })
  lines.push({ code: '    grade = "Try again"', body: 'else' })
  const ran = hit >= 0 ? hit : 'else'
  const says = wrong
    ? hit >= 0
      ? `The first test, score >= 50, is already True for ${s}, so it gives a C and Python never looks further. Put the strictest test first.`
      : `${s} fails every test, so else runs. Even so, no score could ever get an A or a B here.`
    : hit === 0
      ? 'The first test is True, so its block runs and the rest are skipped.'
      : hit > 0
        ? `Python checks each test in order. ${s} fails ${hit === 1 ? 'the first' : 'the first two'}, so the first True one wins.`
        : 'Every test is False, so the else block runs. else catches everything left over.'
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`score = ${s}. grade is ${grade}. ${says}`}>
      <div className="overflow-x-auto rounded-2xl border border-line bg-row py-2 font-mono text-[12.5px] leading-6 @min-[420px]:text-[13px]">
        <div className="px-3 text-ink-soft">score = {s}</div>
        {lines.map((l, i) => {
          const checked = l.rung !== undefined && (hit < 0 || l.rung <= hit)
          const result = l.rung !== undefined ? s >= rungs[l.rung]!.min : null
          const runs = l.body !== undefined && l.body === ran
          return (
            <div
              key={i}
              className={cn(
                'flex flex-wrap items-center justify-between gap-x-3 px-3',
                runs ? 'bg-success/15 font-bold text-ink' : l.body !== undefined ? 'text-ink-subtle' : l.rung !== undefined && !checked ? 'text-ink-subtle' : 'text-ink',
              )}
            >
              <span className="whitespace-pre">{l.code}</span>
              {l.rung !== undefined &&
                (checked ? (
                  <span className={cn('shrink-0 rounded-md px-1.5 font-sans text-[11.5px] font-semibold', result ? 'bg-success-fill text-on-success' : 'bg-error/15 text-error')}>
                    {String(result).replace(/^./, (c) => c.toUpperCase())}
                  </span>
                ) : (
                  <span className="shrink-0 font-sans text-[11.5px] text-ink-subtle">not checked</span>
                ))}
              {runs && <span className="shrink-0 font-sans text-[11.5px] font-semibold text-success">runs</span>}
            </div>
          )
        })}
      </div>
      <figcaption className={cn('flex flex-col gap-1 rounded-xl px-3 py-2.5 text-sm', wrong ? 'bg-error/10' : 'bg-row')}>
        <span className="text-ink">
          grade is <code className="font-mono font-bold text-fe-text">&quot;{grade}&quot;</code>
        </span>
        <span className="text-ink-soft">{says}</span>
      </figcaption>
    </figure>
  )
}
