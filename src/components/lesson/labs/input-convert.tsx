'use client'
import { cn } from '@/lib/cn'
import { clampState, type LabProps } from './shared'

type View = { code: string; terminal: string[]; value?: { shown: string; type: string }; error?: string }

const VIEWS: View[] = [
  { code: 'age = input("How old are you? ")', terminal: ['How old are you? ▍'] },
  { code: 'age = input("How old are you? ")', terminal: ['How old are you? 17'], value: { shown: "'17'", type: 'str' } },
  { code: 'print(age + 1)', terminal: ['How old are you? 17'], value: { shown: "'17'", type: 'str' }, error: 'TypeError: can only concatenate str (not "int") to str' },
  { code: 'age = int(input("How old are you? "))\nprint(age + 1)', terminal: ['How old are you? 17', '18'], value: { shown: '17', type: 'int' } },
  { code: 'age = int(input("How old are you? "))', terminal: ['How old are you? seventeen'], error: "ValueError: invalid literal for int() with base 10: 'seventeen'" },
]

/** input() always hands back text, and int() turns it into a number (Diagram lab, 5 states). */
export function InputConvert({ state }: LabProps) {
  const v = VIEWS[clampState(state, VIEWS.length)]!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <pre className="m-0 rounded-2xl border border-line bg-row px-3 py-2 font-mono text-[12px] leading-6 whitespace-pre-wrap [overflow-wrap:anywhere] text-ink @min-[420px]:text-[12.5px]">{v.code}</pre>
      <div role="img" aria-label={`The terminal shows: ${v.terminal.join(', then ')}.${v.value ? ` age is ${v.value.shown}, a ${v.value.type}.` : ''}${v.error ? ` Python stops: ${v.error}` : ''}`} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1 rounded-2xl bg-[#15122a] p-4 font-mono text-[13px] text-[#f4f1ff]">
          <span className="font-sans text-[11px] text-[#a9a5c0]">Terminal</span>
          {v.terminal.map((t, i) => (
            <span key={i} className="whitespace-pre-wrap [overflow-wrap:anywhere]">
              {t}
            </span>
          ))}
          {v.error && <span className="whitespace-pre-wrap text-[#ff8f8f] [overflow-wrap:anywhere]">{v.error}</span>}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[12px] font-semibold text-ink-soft">age</span>
          {v.value ? (
            <span className={cn('pop-in flex items-center gap-2 rounded-xl border-[1.5px] px-3 py-1.5 font-mono text-[15px] font-bold text-ink', v.value.type === 'str' ? 'border-badge' : 'border-success-fill')}>
              {v.value.shown}
              <span className={cn('rounded-md px-1.5 text-[11px] font-semibold', v.value.type === 'str' ? 'bg-badge/20 text-badge-text' : 'bg-success/15 text-success')}>{v.value.type}</span>
            </span>
          ) : (
            <span className="rounded-xl border border-dashed border-line-strong px-3 py-1.5 text-[13px] text-ink-subtle">{v.error ? 'never stored' : 'waiting for typing'}</span>
          )}
        </div>
      </div>
    </figure>
  )
}
