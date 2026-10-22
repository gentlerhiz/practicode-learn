'use client'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

type Disaster = 'fail' | 'delete' | 'stolen' | 'fire' | 'ransomware'

const DISASTERS: { id: Disaster; name: string }[] = [
  { id: 'fail', name: 'The laptop’s drive fails' },
  { id: 'delete', name: 'You delete a folder by mistake' },
  { id: 'stolen', name: 'The laptop is stolen' },
  { id: 'fire', name: 'A fire or flood at home' },
  { id: 'ransomware', name: 'Ransomware locks your files' },
]

const PLANS: Record<string, { copies: string[]; survives: Disaster[]; says: string }> = {
  'Laptop only': {
    copies: ['Laptop'],
    survives: [],
    says: 'One copy: any one thing going wrong loses everything.',
  },
  'Laptop + USB drive': {
    copies: ['Laptop', 'USB drive, kept at home'],
    survives: ['fail', 'delete', 'stolen'],
    says: 'Two copies on two kinds of storage. But both are in the same house, and a drive left plugged in can be locked by ransomware too.',
  },
  'Laptop + cloud sync': {
    copies: ['Laptop', 'Cloud sync'],
    survives: ['fail', 'stolen', 'fire'],
    says: 'Off-site, but sync copies mistakes and ransomware straight to the cloud. Version history can help, but sync alone isn’t a backup.',
  },
  '3-2-1 backup': {
    copies: ['Laptop', 'USB drive, unplugged after each backup', 'Cloud backup with old versions kept'],
    survives: ['fail', 'delete', 'stolen', 'fire', 'ransomware'],
    says: '3 copies, on 2 kinds of storage, with 1 kept somewhere else. Every disaster leaves at least one good copy.',
  },
}

/** Four backup plans against five disasters, showing which plan survives each (Explore lab: value = a plan). */
export function BackupPlan({ value = 'Laptop only' }: LabProps) {
  const name = PLANS[value] ? value : 'Laptop only'
  const p = PLANS[name]!
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${name}. Survives ${p.survives.length} of ${DISASTERS.length} disasters. ${p.says}`}>
      <div className="flex flex-col gap-1.5 rounded-2xl border border-line bg-row px-4 py-3">
        <p className="text-[12px] font-semibold text-ink-subtle">Copies of your files</p>
        <ul className="flex flex-wrap gap-1.5">
          {p.copies.map((c) => (
            <li key={c} className="pop-in rounded-lg bg-[rgba(255,170,60,0.16)] px-2 py-1 text-[12px] font-semibold text-ink">
              {c}
            </li>
          ))}
        </ul>
      </div>
      <ul className="flex flex-col gap-1.5">
        {DISASTERS.map((d) => {
          const ok = p.survives.includes(d.id)
          return (
            <li key={d.id} className={cn('flex items-center gap-2.5 rounded-xl border-[1.5px] px-3 py-2 text-[13px] motion-safe:transition-colors motion-safe:duration-300', ok ? 'border-success-fill bg-row' : 'border-error/60 bg-row')}>
              <span aria-hidden="true" className={cn('grid size-6 shrink-0 place-items-center rounded-full', ok ? 'bg-success-fill text-on-success' : 'bg-error/20 text-error')}>
                {ok ? <Check size={14} /> : <X size={14} />}
              </span>
              <span className="min-w-0 text-ink">
                {d.name}
                <span className="sr-only">{ok ? ': your files survive' : ': files lost'}</span>
              </span>
            </li>
          )
        })}
      </ul>
      <p aria-live="polite" className="text-[13px] leading-5 text-ink-soft">
        <span className="font-semibold text-ink">
          Survives {p.survives.length} of {DISASTERS.length}.{' '}
        </span>
        {p.says}
      </p>
    </figure>
  )
}
