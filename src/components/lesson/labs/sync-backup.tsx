'use client'
import { FileText, Lock } from 'lucide-react'
import { cn } from '@/lib/cn'
import { clampState, type LabProps } from './shared'

type File = { name: string; state: 'ok' | 'edited' | 'gone' | 'locked' }

const STATES: { name: string; line: string; laptop: File[]; cloud: File[]; backup?: File[]; restore?: boolean }[] = [
  {
    name: 'In sync',
    line: 'Sync keeps the laptop and the cloud the same. Two copies, always matching.',
    laptop: [{ name: 'thesis.docx', state: 'ok' }, { name: 'budget.xlsx', state: 'ok' }],
    cloud: [{ name: 'thesis.docx', state: 'ok' }, { name: 'budget.xlsx', state: 'ok' }],
  },
  {
    name: 'An edit',
    line: 'You change the thesis on the laptop. Seconds later, the cloud copy changes too. Handy.',
    laptop: [{ name: 'thesis.docx', state: 'edited' }, { name: 'budget.xlsx', state: 'ok' }],
    cloud: [{ name: 'thesis.docx', state: 'edited' }, { name: 'budget.xlsx', state: 'ok' }],
  },
  {
    name: 'A mistake',
    line: 'You delete the budget by mistake. Sync does its job, and deletes the cloud copy too.',
    laptop: [{ name: 'thesis.docx', state: 'edited' }, { name: 'budget.xlsx', state: 'gone' }],
    cloud: [{ name: 'thesis.docx', state: 'edited' }, { name: 'budget.xlsx', state: 'gone' }],
  },
  {
    name: 'Ransomware',
    line: 'Malware locks the laptop’s files and demands money. Sync faithfully copies the locked files to the cloud.',
    laptop: [{ name: 'thesis.docx', state: 'locked' }, { name: 'budget.xlsx', state: 'gone' }],
    cloud: [{ name: 'thesis.docx', state: 'locked' }, { name: 'budget.xlsx', state: 'gone' }],
  },
  {
    name: 'A backup',
    line: 'A backup is a separate copy, from before, that sync doesn’t touch. Last night’s backup still has both files, unlocked.',
    laptop: [{ name: 'thesis.docx', state: 'locked' }, { name: 'budget.xlsx', state: 'gone' }],
    cloud: [{ name: 'thesis.docx', state: 'locked' }, { name: 'budget.xlsx', state: 'gone' }],
    backup: [{ name: 'thesis.docx', state: 'ok' }, { name: 'budget.xlsx', state: 'ok' }],
  },
  {
    name: 'Restored',
    line: 'Restore from the backup, and both files are back. Only the edits since last night are lost.',
    laptop: [{ name: 'thesis.docx', state: 'ok' }, { name: 'budget.xlsx', state: 'ok' }],
    cloud: [{ name: 'thesis.docx', state: 'ok' }, { name: 'budget.xlsx', state: 'ok' }],
    backup: [{ name: 'thesis.docx', state: 'ok' }, { name: 'budget.xlsx', state: 'ok' }],
    restore: true,
  },
]

function Column({ title, files, tone }: { title: string; files: File[]; tone?: 'backup' }) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5 rounded-2xl border-[1.5px] p-2.5', tone ? 'border-success-fill bg-row' : 'border-line bg-row')}>
      <span className="text-[12px] font-semibold text-ink">{title}</span>
      <ul className="flex flex-col gap-1">
        {files.map((f) => (
          <li
            key={f.name}
            className={cn(
              'flex min-w-0 items-center gap-1 rounded-md px-1.5 py-1 text-[11.5px] motion-safe:transition-all motion-safe:duration-300',
              f.state === 'gone' ? 'text-ink-subtle line-through opacity-60' : f.state === 'locked' ? 'bg-error/15 text-error' : f.state === 'edited' ? 'bg-it/15 text-ink' : 'bg-sheet text-ink',
            )}
          >
            {f.state === 'locked' ? <Lock size={12} aria-hidden="true" className="shrink-0" /> : <FileText size={12} aria-hidden="true" className="shrink-0" />}
            <span className="min-w-0 [overflow-wrap:anywhere]">{f.name}</span>
            <span className="sr-only">{f.state === 'gone' ? ', deleted' : f.state === 'locked' ? ', locked by ransomware' : f.state === 'edited' ? ', just edited' : ''}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Why sync isn't backup: an edit, a mistake and ransomware, then a restore (Diagram lab, 6 states). */
export function SyncBackup({ state }: LabProps) {
  const at = clampState(state, STATES.length)
  const s = STATES[at]!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={`${s.name}. ${s.line}`} className="flex flex-col gap-2">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1.5">
          <Column title="Laptop" files={s.laptop} />
          <span aria-hidden="true" className="text-center text-[11px] text-it-text">
            ⇄<br />
            sync
          </span>
          <Column title="Cloud" files={s.cloud} />
        </div>
        {s.backup && (
          <div className="pop-in flex flex-col gap-1">
            <span aria-hidden="true" className="text-center text-[11px] text-success">
              {s.restore ? '↑ restored from' : 'separate, untouched by sync'}
            </span>
            <Column title="Backup from last night" files={s.backup} tone="backup" />
          </div>
        )}
      </div>
      <figcaption aria-live="polite" className="flex flex-col gap-1 rounded-2xl border border-line bg-row px-4 py-3">
        <span className="font-display text-[15px] font-bold text-ink">{s.name}</span>
        <span className="text-[13px] leading-5 text-ink-soft">{s.line}</span>
      </figcaption>
    </figure>
  )
}
