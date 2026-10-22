'use client'
import { cn } from '@/lib/cn'
import { clampState, type LabProps } from './shared'

type Part = 'prompt' | 'command' | 'option' | 'argument' | 'output' | 'next'

const STATES: { part: Part | 'all'; name: string; line: string }[] = [
  { part: 'all', name: 'One command', line: 'Every command line has the same parts, on Linux, Mac and Windows.' },
  { part: 'prompt', name: 'The prompt', line: 'Written by the computer: who you are, the computer’s name, and the folder you’re in. ~ means your home folder. It waits for you after the $.' },
  { part: 'command', name: 'The command', line: 'The first word is the command: what to do. ls means list.' },
  { part: 'option', name: 'An option', line: 'Options change how a command works. They start with a dash: -l asks for the long list, with details.' },
  { part: 'argument', name: 'An argument', line: 'Arguments say what to work on: here, the Documents folder. Spaces separate each part.' },
  { part: 'output', name: 'The output', line: 'Press Enter, and the command runs. What it prints is its output.' },
  { part: 'next', name: 'The next prompt', line: 'A new prompt means it has finished and is ready for the next command. No news is often good news.' },
]

/** One command line taken apart: prompt, command, option, argument, output (Diagram lab, 7 states). */
export function TerminalAnatomy({ state }: LabProps) {
  const at = clampState(state, STATES.length)
  const s = STATES[at]!
  const tone = (p: Part) =>
    cn(
      'rounded px-0.5 motion-safe:transition-all motion-safe:duration-300',
      s.part === p ? 'bg-[#ffa22e]/25 text-[#ffd08a] outline-2 outline-[#ffa22e]' : s.part === 'all' ? '' : 'opacity-35',
    )
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={`${s.name}. ${s.line}`} className="rounded-xl border border-line bg-[#0d0b16] p-3 font-mono text-[13px] leading-7 text-[#e8e6f0]">
        <p className="[overflow-wrap:anywhere]">
          <span className={cn(tone('prompt'), 'text-[#7ee2b8]')}>ada@laptop:~$</span> <span className={tone('command')}>ls</span>{' '}
          <span className={tone('option')}>-l</span> <span className={tone('argument')}>Documents</span>
        </p>
        <div className={cn(tone('output'), 'block')}>
          <p className="whitespace-pre-wrap [overflow-wrap:anywhere]">-rw-r--r-- 1 ada ada 18432 Oct 21 budget.xlsx</p>
          <p className="whitespace-pre-wrap [overflow-wrap:anywhere]">drwxr-xr-x 2 ada ada  4096 Oct 18 School</p>
        </div>
        <p>
          <span className={cn(tone('next'), 'text-[#7ee2b8]')}>ada@laptop:~$</span>
          <span aria-hidden="true" className="ml-1 inline-block h-4 w-2 translate-y-0.5 bg-[#e8e6f0]" />
        </p>
      </div>
      <ol aria-hidden="true" className="flex flex-wrap gap-1.5">
        {STATES.slice(1).map((x, i) => (
          <li key={x.part} className={cn('rounded-lg px-2 py-1 text-[12px] font-semibold', at === i + 1 ? 'bg-it text-white' : 'bg-sheet text-ink-muted')}>
            {x.name.replace(/^The |^An? /, '')}
          </li>
        ))}
      </ol>
      <figcaption aria-live="polite" className="flex flex-col gap-1 rounded-2xl border border-line bg-row px-4 py-3">
        <span className="font-display text-[15px] font-bold text-ink">{s.name}</span>
        <span className="text-[13px] leading-5 text-ink-soft">{s.line}</span>
      </figcaption>
    </figure>
  )
}
