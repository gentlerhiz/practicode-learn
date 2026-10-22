'use client'
import { Archive, Database, KeyRound, Link2, Search, ShieldCheck, Users } from 'lucide-react'
import { cn } from '@/lib/cn'
import { clampState, type LabProps } from './shared'

const JOBS = [
  { icon: Database, name: 'Stores the data', line: 'A database keeps data in tables, safely on disk, for years, and can hold millions of records.' },
  { icon: Search, name: 'Finds it fast', line: 'Ask a question, such as every member in Lagos, and it answers in a fraction of a second, even across millions of rows.' },
  { icon: Users, name: 'Many people at once', line: 'Hundreds of people and apps can read and change the data at the same moment, without overwriting each other.' },
  { icon: KeyRound, name: 'Enforces the rules', line: 'Rules stop bad data getting in: every member needs an email, no two members can share an id, a date must be a real date.' },
  { icon: Link2, name: 'Links tables', line: 'Bookings link to members by member id, so a member’s details are stored once and used everywhere.' },
  { icon: ShieldCheck, name: 'Controls access', line: 'Each person or app gets only the access it needs: the website can read the timetable; only staff can change it.' },
  { icon: Archive, name: 'Backs it up', line: 'Regular backups, and a log of every change, mean the data can be restored after a mistake or a failure.' },
]

/** What a database does that a spreadsheet file doesn't, one job at a time (Diagram lab, 7 states). */
export function DatabaseJobs({ state }: LabProps) {
  const at = clampState(state, JOBS.length)
  const job = JOBS[at]!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={`${job.name}. ${job.line}`} className="flex flex-col gap-3">
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-line bg-row py-4">
          <span className="grid size-14 place-items-center rounded-2xl bg-it text-white">
            <Database size={28} aria-hidden="true" />
          </span>
          <span className="flex flex-col">
            <span className="font-display text-[15px] font-bold text-ink">A database</span>
            <span className="text-[12px] text-ink-muted">PostgreSQL, MySQL, SQLite, SQL Server</span>
          </span>
        </div>
        <ol className="grid grid-cols-2 gap-1.5 @min-[460px]:grid-cols-4">
          {JOBS.map((j, i) => {
            const Icon = j.icon
            return (
              <li
                key={j.name}
                className={cn(
                  'flex min-w-0 items-center gap-1.5 rounded-xl border-[1.5px] px-2 py-1.5 text-[11.5px] leading-4 font-semibold motion-safe:transition-all motion-safe:duration-300',
                  i === at ? 'border-it bg-[rgba(255,170,60,0.16)] text-ink' : i < at ? 'border-line bg-row text-ink-soft' : 'border-line bg-sunken text-ink-subtle',
                )}
              >
                <Icon size={14} aria-hidden="true" className={cn('shrink-0', i <= at ? 'text-it-text' : '')} />
                <span className="min-w-0">{j.name}</span>
              </li>
            )
          })}
        </ol>
      </div>
      <figcaption aria-live="polite" className="flex flex-col gap-1 rounded-2xl border border-line bg-row px-4 py-3">
        <span className="font-display text-[15px] font-bold text-ink">{job.name}</span>
        <span className="text-[13px] leading-5 text-ink-soft">{job.line}</span>
      </figcaption>
    </figure>
  )
}
