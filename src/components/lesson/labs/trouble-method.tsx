'use client'
import { cn } from '@/lib/cn'
import { clampState, type LabProps } from './shared'

const STEPS = [
  { name: 'Identify the problem', ex: 'Ask questions, and see it for yourself: Ada’s laptop says “Printer offline”. It printed fine yesterday. Nothing else is wrong.' },
  { name: 'Theorise a cause', ex: 'List likely causes, simplest first: the printer is off, out of paper, or no longer on the Wi-Fi.' },
  { name: 'Test the theory', ex: 'Check each one: it’s on, it has paper, but its screen shows no Wi-Fi. Theory confirmed. If not, go back and theorise again.' },
  { name: 'Plan the fix', ex: 'Reconnect the printer to the Wi-Fi from its own screen. Think about what else it could affect.' },
  { name: 'Fix it, and check', ex: 'Reconnect it, then print a test page, from Ada’s laptop and from another device, to check everything works.' },
  { name: 'Write it down', ex: 'Note the problem, the cause and the fix. Next time, it takes a minute, and anyone can do it.' },
]

/** A six-step troubleshooting method, worked through on one problem (Diagram lab, 6 states). */
export function TroubleMethod({ state }: LabProps) {
  const at = clampState(state, STEPS.length)
  return (
    <figure className="m-0 flex flex-col gap-3">
      <ol role="img" aria-label={`Step ${at + 1}: ${STEPS[at]!.name}. ${STEPS[at]!.ex}`} className="flex flex-col gap-1.5">
        {STEPS.map((s, i) => (
          <li
            key={s.name}
            className={cn(
              'flex min-w-0 gap-3 rounded-xl border-[1.5px] px-3 py-2 motion-safe:transition-all motion-safe:duration-300',
              i === at ? 'border-it bg-[rgba(255,170,60,0.14)]' : i < at ? 'border-line bg-row' : 'border-line bg-sunken opacity-55',
            )}
          >
            <span
              className={cn(
                'grid size-7 shrink-0 place-items-center rounded-full font-mono text-[13px] font-bold',
                i === at ? 'bg-it text-white' : i < at ? 'bg-success-fill text-on-success' : 'bg-meter text-ink-muted',
              )}
            >
              {i < at ? '✓' : i + 1}
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="text-[13px] font-semibold text-ink">{s.name}</span>
              {i === at && <span className="pop-in text-[12.5px] leading-5 text-ink-soft">{s.ex}</span>}
            </span>
          </li>
        ))}
      </ol>
    </figure>
  )
}
