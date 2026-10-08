'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { highlight } from '@/components/lesson/parts/highlight'
import { buttonClasses } from '@/components/ui/button'
import { Glyph } from '@/components/ui/glyph'
import { cn } from '@/lib/cn'

export type CheckQuestion = { kind: string; title: string; code?: { lang: string; text: string }; options: string[] }

export type CheckData = {
  title: string
  module: number
  total: number
  /** The question number the first entry of `questions` is (the canvas shows questions 11 and 12). */
  startAt: number
  questions: CheckQuestion[]
  covers: { topic: string; count: string }[]
  finishHref: Route | null
  exitHref: Route
  closedNote?: string
}

const SURE = [
  { id: 'guess', label: 'Guessing' },
  { id: 'fair', label: 'Fairly sure' },
  { id: 'certain', label: 'Certain' },
]

/** PrismModuleCheck: one question at a time, how sure you are, and what the check covers. */
export function CheckView({ data }: { data: CheckData }) {
  const last = data.questions.length - 1
  const [i, setI] = useState(last)
  const [picks, setPicks] = useState<Record<number, number>>({ [last]: 1 })
  const [sure, setSure] = useState<Record<number, string>>({ [last]: 'fair' })
  const [flags, setFlags] = useState<Record<number, boolean>>({})
  const q = data.questions[i]
  const number = data.startAt + i
  const code = useMemo(() => (q?.code ? highlight(q.code.text, q.code.lang) : null), [q])

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 -right-[260px] h-[760px] w-[1000px] opacity-(--pc-glow-opacity)"
        style={{ background: 'radial-gradient(closest-side at 40% 40%, rgba(77,107,255,0.22), rgba(77,107,255,0) 75%)' }}
      />
      <header className="relative border-b border-line-subtle bg-[color-mix(in_srgb,var(--pc-sheet)_85%,transparent)]">
        <div className="flex min-h-[72px] flex-wrap items-center gap-x-5 gap-y-3 px-4 py-3 ph:px-6">
          <Link href={data.exitHref} aria-label="Leave the check" className="press flex size-11 shrink-0 items-center justify-center rounded-full border border-line text-ink hover:bg-hover">
            <Glyph name="x" size={18} />
          </Link>
          <div className="min-w-0 flex-[1_1_200px]">
            <p className="text-[15px] font-semibold text-ink">{data.title}</p>
            <p className="text-[13px] text-ink-subtle">
              <span className="text-fe-text">Front-End</span> · Module {data.module}
            </p>
          </div>
          {q && (
            <div className="flex max-w-[520px] flex-[2_1_320px] flex-col gap-1.5">
              <div aria-hidden="true" className="flex gap-1">
                {Array.from({ length: data.total }, (_, k) => (
                  <span
                    key={k}
                    className="block h-1.5 flex-1 rounded-[3px]"
                    style={{ background: k < number - 1 ? '#3D5AF5' : k === number - 1 ? '#8EA2FF' : 'var(--pc-divider)' }}
                  />
                ))}
              </div>
              <p className="text-xs text-ink-subtle">
                Question {number} of {data.total} · No time limit
              </p>
            </div>
          )}
        </div>
      </header>

      <main id="check" className="relative mx-auto box-border grid w-full max-w-[1180px] flex-1 grid-cols-1 items-start gap-12 px-4 pt-8 pb-10 ph:px-6 ph:pt-12 tab:grid-cols-[minmax(0,1fr)_320px]">
        {q ? (
          <section aria-labelledby="question" className="flex min-w-0 flex-col gap-6">
            <p className="self-start rounded-full bg-fe px-3 py-1 text-xs font-semibold text-white">{q.kind}</p>
            <h1 id="question" className="font-display text-[26px] leading-8 font-extrabold tracking-[-0.03em] text-ink ph:text-[34px] ph:leading-10">
              {q.title}
            </h1>
            {code && (
              <pre tabIndex={0} aria-label="Code" className="code-colours overflow-x-auto rounded-[18px] border border-divider bg-sunken py-4 font-mono text-[13px] leading-[26px] text-ink ph:text-[15px] ph:leading-7">
                {code.split('\n').map((line, n) => (
                  <div key={n} className="flex px-6 whitespace-pre">
                    <span aria-hidden="true" className="w-[30px] shrink-0 text-code-gutter select-none">{n + 1}</span>
                    <span dangerouslySetInnerHTML={{ __html: line || ' ' }} />
                  </div>
                ))}
              </pre>
            )}
            <div role="radiogroup" aria-labelledby="question" className="grid grid-cols-1 gap-3 ph:grid-cols-2">
              {q.options.map((o, k) => {
                const on = picks[i] === k
                return (
                  <button
                    key={o}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setPicks((p) => ({ ...p, [i]: k }))}
                    className={cn(
                      'press box-border flex min-h-[60px] cursor-pointer items-center gap-4 rounded-2xl border-[1.5px] px-4 py-3 text-left text-[15px] text-ink',
                      on ? 'border-[#8ea2ff] bg-[rgba(77,107,255,0.12)]' : 'border-line bg-row hover:border-line-strong',
                    )}
                  >
                    <span className={cn('flex size-7 shrink-0 items-center justify-center rounded-[9px] text-[13px] font-bold', on ? 'bg-fe text-white' : 'bg-divider text-ink')}>
                      {String.fromCharCode(65 + k)}
                    </span>
                    <span className="font-mono text-sm">{o}</span>
                  </button>
                )
              })}
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-ink">How sure are you?</p>
              <div role="group" aria-label="How sure are you?" className="flex flex-wrap gap-2">
                {SURE.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={sure[i] === s.id}
                    onClick={() => setSure((x) => ({ ...x, [i]: s.id }))}
                    className={cn(
                      'press h-10 cursor-pointer rounded-full border px-4 text-sm',
                      sure[i] === s.id ? 'border-primary bg-primary text-on-primary' : 'border-line-control text-ink-soft hover:border-line-strong hover:bg-hover',
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <p className="text-[13px] text-ink-subtle">
                This doesn’t change your score. It helps us spot lucky guesses, so we can bring those topics back in your daily review.
              </p>
            </div>
          </section>
        ) : (
          <section className="flex flex-col gap-4">
            <p className="self-start rounded-full bg-control px-3 py-1 text-xs font-semibold text-ink-muted">Opens soon</p>
            <h1 className="font-display text-[26px] leading-8 font-extrabold tracking-[-0.03em] text-ink ph:text-[34px] ph:leading-10">
              The Module {data.module} check isn’t open yet
            </h1>
            <p className="max-w-[560px] text-base leading-[26px] text-ink-muted">{data.closedNote}</p>
            <Link href={'/my-tracks' as Route} className={buttonClasses({}, 'h-12 self-start px-6')}>
              Back to My Tracks
            </Link>
          </section>
        )}
        <aside aria-labelledby="covers" className="surface flex flex-col gap-4 rounded-3xl border border-line p-6">
          <h2 id="covers" className="font-display text-lg font-bold text-ink">
            What this check covers
          </h2>
          <ul className="flex flex-col gap-3 text-sm text-ink">
            {data.covers.map((c) => (
              <li key={c.topic} className="flex justify-between gap-3">
                <span>{c.topic}</span>
                <span className="shrink-0 text-ink-subtle">{c.count}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 border-t border-divider pt-4 text-[13px] leading-5 text-ink-muted">
            <p className="flex gap-3">
              <Glyph name="target" size={18} className="shrink-0" />
              <span>You need 80% to pass. That’s {Math.ceil(data.total * 0.8)} out of {data.total}.</span>
            </p>
            <p className="flex gap-3">
              <Glyph name="review" size={18} className="shrink-0" />
              <span>Retake it as often as you like. You’ll get fresh questions each time.</span>
            </p>
            <p className="flex gap-3">
              <Glyph name="lock" size={18} className="shrink-0" />
              <span>The AI tutor is switched off during checks, so your result is all yours.</span>
            </p>
          </div>
        </aside>
      </main>

      {q && (
        <footer className="relative border-t border-line-subtle bg-[color-mix(in_srgb,var(--pc-sheet)_92%,transparent)]">
          <div className="mx-auto box-border flex max-w-[1180px] items-center justify-between gap-3 px-4 py-4 ph:px-6">
            <button
              type="button"
              disabled={i === 0}
              onClick={() => setI(i - 1)}
              className={buttonClasses({ variant: 'secondary' }, 'h-12 bg-transparent px-5 font-medium')}
            >
              <Glyph name="chevronRight" size={16} className="rotate-180" />
              Previous Question
            </button>
            <button
              type="button"
              aria-pressed={Boolean(flags[i])}
              onClick={() => setFlags((f) => ({ ...f, [i]: !f[i] }))}
              className={cn('press hidden h-[46px] cursor-pointer items-center gap-2 rounded-full px-4 text-sm hover:bg-hover ph:flex', flags[i] ? 'text-badge-text' : 'text-ink-muted')}
            >
              <Glyph name="target" size={16} />
              {flags[i] ? 'Flagged to check again' : 'Flag to check again'}
            </button>
            {i < last ? (
              <button type="button" onClick={() => setI(i + 1)} className={buttonClasses({}, 'h-[46px] px-6')}>
                Next Question
                <Glyph name="arrowRight" size={16} />
              </button>
            ) : data.finishHref ? (
              <Link href={data.finishHref} className={buttonClasses({}, 'h-[46px] px-6')}>
                Finish Check
                <Glyph name="arrowRight" size={16} />
              </Link>
            ) : null}
          </div>
        </footer>
      )}
    </div>
  )
}
