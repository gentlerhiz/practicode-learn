'use client'
import { Check, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

// For each problem, fixes to try from quickest and most likely to slowest. The last step is to get help.
const PROBLEMS: Record<string, { fixes: { try: string; why: string }[]; help: string }> = {
  'A slow computer': {
    fixes: [
      { try: 'Restart it', why: 'Clears memory, stuck programs and half-finished updates.' },
      { try: 'Close apps and tabs you’re not using', why: 'Frees memory, so nothing has to wait in slow storage.' },
      { try: 'Check storage isn’t almost full', why: 'A nearly full drive slows everything. Clear Downloads and old videos.' },
      { try: 'Install waiting updates', why: 'Updates fix bugs that can slow things down.' },
      { try: 'Remove apps that start by themselves', why: 'Apps that launch at start-up use memory all day.' },
    ],
    help: 'Still slow? It may need more memory, an SSD, or a malware check by IT support.',
  },
  'No sound': {
    fixes: [
      { try: 'Check the volume and mute', why: 'The most common cause by far, on the device and in the app.' },
      { try: 'Check where the sound is going', why: 'It may be playing through headphones or a Bluetooth speaker.' },
      { try: 'Unplug and replug headphones, or reconnect Bluetooth', why: 'Resets the connection.' },
      { try: 'Restart the device', why: 'Restarts the sound driver.' },
    ],
    help: 'Still silent? Update the sound driver, or ask IT support to check the speakers.',
  },
  'The printer won’t print': {
    fixes: [
      { try: 'Check it’s on, with paper and ink', why: 'Obvious, and the cause more often than you’d think.' },
      { try: 'Check it’s on the same Wi-Fi as you', why: 'Printers drop off networks, especially after a router restart.' },
      { try: 'Clear the print queue', why: 'One stuck job can block every job behind it.' },
      { try: 'Restart the printer and the computer', why: 'Reconnects both, and restarts the print service.' },
    ],
    help: 'Still stuck? Remove and re-add the printer, or reinstall its driver.',
  },
  'An app keeps crashing': {
    fixes: [
      { try: 'Close it completely, and open it again', why: 'Clears whatever state it was stuck in.' },
      { try: 'Update the app', why: 'Crashes are bugs, and updates fix bugs.' },
      { try: 'Restart the device', why: 'Clears memory and stuck background tasks.' },
      { try: 'Clear its cache, or reinstall it', why: 'Damaged saved data is a common cause. Check your data is backed up first.' },
    ],
    help: 'Still crashing? Check the app’s support page, or report it to its makers.',
  },
}

function Troubleshooter({ value }: { value: string }) {
  const p = PROBLEMS[value] ?? PROBLEMS['A slow computer']!
  const [tried, setTried] = useState(0)
  const [fixed, setFixed] = useState<number | null>(null)
  const done = fixed !== null || tried >= p.fixes.length
  return (
    <div className="flex flex-col gap-3">
      <ol className="flex flex-col gap-1.5">
        {p.fixes.map((f, i) => {
          const state = fixed === i ? 'fixed' : i < tried ? 'tried' : i === tried && !done ? 'now' : 'later'
          return (
            <li
              key={f.try}
              className={cn(
                'flex min-w-0 flex-col gap-1 rounded-xl border-[1.5px] px-3 py-2 motion-safe:transition-colors',
                state === 'fixed' ? 'border-success-fill bg-row' : state === 'now' ? 'border-it bg-[rgba(255,170,60,0.12)]' : state === 'tried' ? 'border-line bg-row opacity-70' : 'border-line bg-sunken opacity-45',
              )}
            >
              <span className="flex items-baseline gap-2 text-[13px] font-semibold text-ink">
                <span className="font-mono text-[12px] text-ink-muted">{i + 1}</span>
                <span className={cn(state === 'tried' && 'line-through decoration-ink-subtle')}>{f.try}</span>
                {state === 'fixed' && <span className="ml-auto shrink-0 text-[12px] text-success">Fixed</span>}
              </span>
              {(state === 'now' || state === 'fixed') && <span className="pop-in text-[12.5px] leading-5 text-ink-soft">{f.why}</span>}
              {state === 'now' && (
                <span className="flex flex-wrap gap-1.5 pt-1">
                  <button type="button" onClick={() => setFixed(i)} className="press inline-flex h-9 cursor-pointer items-center gap-1 rounded-lg bg-success-fill px-3 text-[12.5px] font-semibold text-on-success">
                    <Check size={14} aria-hidden="true" />
                    That fixed it
                  </button>
                  <button type="button" onClick={() => setTried((t) => t + 1)} className="press h-9 cursor-pointer rounded-lg border border-line-control px-3 text-[12.5px] font-semibold text-ink hover:bg-hover">
                    Still broken: next
                  </button>
                </span>
              )}
            </li>
          )
        })}
      </ol>
      <div aria-live="polite" className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[13px] leading-5 text-ink-soft">
          {fixed !== null ? `Fixed at step ${fixed + 1}. Quick, likely fixes first saves time.` : done ? p.help : 'Try each fix in order: quickest and most likely first.'}
        </p>
        {(tried > 0 || fixed !== null) && (
          <button
            type="button"
            onClick={() => {
              setTried(0)
              setFixed(null)
            }}
            className="press inline-flex h-8 cursor-pointer items-center gap-1 rounded-full border border-line-control px-3 text-[12px] text-ink hover:bg-hover"
          >
            <RotateCcw size={12} aria-hidden="true" />
            Start again
          </button>
        )}
      </div>
    </div>
  )
}

/** A troubleshooter for four everyday problems: try each fix in order, and say whether it worked (Explore lab). */
export function FixFinder({ value = 'A slow computer' }: LabProps) {
  return <Troubleshooter key={value} value={value} />
}
