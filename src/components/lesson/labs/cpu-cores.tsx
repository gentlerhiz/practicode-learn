'use client'
import type { LabProps } from './shared'

// Eight jobs a laptop might have on at once, in seconds of work for one core.
const JOBS = [
  { name: 'Photo export', t: 6, colour: '#3d5af5' },
  { name: 'Virus scan', t: 5, colour: '#0a7d5c' },
  { name: 'Video call', t: 4, colour: '#d9306f' },
  { name: 'Browser', t: 3, colour: '#6e4cf5' },
  { name: 'Updates', t: 3, colour: '#a85a00' },
  { name: 'Spreadsheet', t: 2, colour: '#0e7490' },
  { name: 'Music', t: 1, colour: '#8b88a0' },
  { name: 'Chat', t: 1, colour: '#c87533' },
]
const TOTAL = JOBS.reduce((n, j) => n + j.t, 0)

/** Hands each job, longest first, to whichever core will be free soonest. One job runs on one core. */
function share(cores: number) {
  const lanes = Array.from({ length: cores }, () => [] as (typeof JOBS)[number][])
  const load = lanes.map(() => 0)
  for (const job of JOBS) {
    const i = load.indexOf(Math.min(...load))
    lanes[i]!.push(job)
    load[i]! += job.t
  }
  return { lanes, load, finish: Math.max(...load) }
}

/** Eight jobs shared between 1, 2, 4 or 8 cores (Explore lab: value = "4 cores"). */
export function CpuCores({ value = '1 core' }: LabProps) {
  const cores = Math.max(1, Math.min(8, Number.parseInt(value, 10) || 1))
  const { lanes, load, finish } = share(cores)
  const faster = TOTAL / finish
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${cores} ${cores === 1 ? 'core' : 'cores'}: everything finishes in ${finish} seconds.`}>
      <ol className="flex flex-col gap-2">
        {lanes.map((jobs, i) => (
          <li key={i} className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between gap-2 text-[12px]">
              <span className="shrink-0 font-semibold whitespace-nowrap text-ink">Core {i + 1}</span>
              <span className="min-w-0 text-right text-ink-muted">
                {jobs.map((j) => j.name).join(', ')} · {load[i]} s
              </span>
            </div>
            <div aria-hidden="true" className="flex h-4 overflow-hidden rounded-md bg-sheet">
              {jobs.map((j) => (
                <span
                  key={j.name}
                  className="h-full border-r-2 border-sheet motion-safe:transition-all motion-safe:duration-300"
                  style={{ width: `${(j.t / TOTAL) * 100}%`, background: j.colour }}
                />
              ))}
            </div>
          </li>
        ))}
      </ol>
      <div className="flex flex-col gap-1 rounded-2xl border border-line bg-row px-4 py-3" aria-live="polite">
        <p className="text-sm text-ink">
          Everything is done in <span className="font-bold">{finish} seconds</span>
          {cores > 1 && <span className="text-ink-muted">, {faster.toFixed(1)} times as fast as one core</span>}.
        </p>
        <p className="text-[13px] leading-5 text-ink-muted">
          {cores === 1
            ? 'One core does one job at a time, so the jobs wait in a queue: 25 seconds of work takes 25 seconds.'
            : cores === 8
              ? 'Eight cores, but not eight times as fast: the photo export still takes 6 seconds, because one job runs on one core at a time.'
              : 'Each core works on its own job at the same time as the others, so the queue clears sooner.'}
        </p>
      </div>
    </figure>
  )
}
