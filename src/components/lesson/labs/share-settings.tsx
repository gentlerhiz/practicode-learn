'use client'
import { Check, Globe, Lock, Users, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

type Who = 'you' | 'grace' | 'tunde' | 'stranger'
type Can = { view: boolean; comment: boolean; edit: boolean }

const PEOPLE: { id: Who; name: string; note: string }[] = [
  { id: 'you', name: 'You', note: 'Owner' },
  { id: 'grace', name: 'Grace', note: 'Added by email' },
  { id: 'tunde', name: 'Tunde', note: 'Added by email' },
  { id: 'stranger', name: 'Someone who finds the link', note: 'Not added' },
]

const SETTINGS: Record<string, { icon: typeof Lock; who: Record<Who, Can>; note: string; risk: boolean }> = {
  'Restricted': {
    icon: Lock,
    who: {
      you: { view: true, comment: true, edit: true },
      grace: { view: false, comment: false, edit: false },
      tunde: { view: false, comment: false, edit: false },
      stranger: { view: false, comment: false, edit: false },
    },
    note: 'Only you, and anyone you add by name. The safest place to start.',
    risk: false,
  },
  'Named people can view': {
    icon: Users,
    who: {
      you: { view: true, comment: true, edit: true },
      grace: { view: true, comment: false, edit: false },
      tunde: { view: true, comment: false, edit: false },
      stranger: { view: false, comment: false, edit: false },
    },
    note: 'Grace and Tunde can read it, but not change it. A forwarded link won’t work for anyone else.',
    risk: false,
  },
  'Named people can comment': {
    icon: Users,
    who: {
      you: { view: true, comment: true, edit: true },
      grace: { view: true, comment: true, edit: false },
      tunde: { view: true, comment: true, edit: false },
      stranger: { view: false, comment: false, edit: false },
    },
    note: 'They can add comments and suggestions, but the text only changes when you accept them. Good for reviews.',
    risk: false,
  },
  'Named people can edit': {
    icon: Users,
    who: {
      you: { view: true, comment: true, edit: true },
      grace: { view: true, comment: true, edit: true },
      tunde: { view: true, comment: true, edit: true },
      stranger: { view: false, comment: false, edit: false },
    },
    note: 'They can change anything. Version history keeps a record, so mistakes can be undone.',
    risk: false,
  },
  'Anyone with the link can view': {
    icon: Globe,
    who: {
      you: { view: true, comment: true, edit: true },
      grace: { view: true, comment: false, edit: false },
      tunde: { view: true, comment: false, edit: false },
      stranger: { view: true, comment: false, edit: false },
    },
    note: 'Anyone who gets the link, forwarded or posted anywhere, can read it, without signing in. Fine for a public flyer; never for anything private.',
    risk: true,
  },
}

/** Who can view, comment on and edit a shared document under each setting (Explore lab: value = a setting). */
export function ShareSettings({ value = 'Restricted' }: LabProps) {
  const name = SETTINGS[value] ? value : 'Restricted'
  const s = SETTINGS[name]!
  const Icon = s.icon
  const cols = [
    ['view', 'View'],
    ['comment', 'Comment'],
    ['edit', 'Edit'],
  ] as const
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${name}. ${s.note}`}>
      <div className={cn('flex items-center gap-2.5 rounded-2xl border-[1.5px] px-4 py-3', s.risk ? 'border-error bg-row' : 'border-line bg-row')}>
        <Icon size={20} aria-hidden="true" className={s.risk ? 'shrink-0 text-error' : 'shrink-0 text-it-text'} />
        <span className="text-[14px] font-semibold text-ink">{name}</span>
      </div>
      <table className="w-full table-fixed border-collapse text-[12.5px]">
        <thead>
          <tr className="text-[11px] text-ink-subtle">
            <th scope="col" className="w-[40%] pb-1 text-left font-normal">
              Person
            </th>
            {cols.map(([, label]) => (
              <th key={label} scope="col" className="pb-1 text-[10.5px] font-normal">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PEOPLE.map((p) => (
            <tr key={p.id} className="border-t border-divider">
              <th scope="row" className="py-1.5 pr-2 text-left font-normal">
                <span className="block font-semibold text-ink">{p.name}</span>
                <span className="block text-[11px] text-ink-muted">{p.note}</span>
              </th>
              {cols.map(([key, label]) => {
                const ok = s.who[p.id][key]
                return (
                  <td key={key} className="text-center">
                    <span className={cn('inline-grid size-6 place-items-center rounded-full motion-safe:transition-colors', ok ? (p.id === 'stranger' ? 'bg-error/20 text-error' : 'bg-success-fill text-on-success') : 'bg-meter text-ink-subtle')}>
                      {ok ? <Check size={13} aria-hidden="true" /> : <X size={13} aria-hidden="true" />}
                      <span className="sr-only">{`${label}: ${ok ? 'yes' : 'no'}`}</span>
                    </span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p aria-live="polite" className="text-[13px] leading-5 text-ink-soft">
        {s.note}
      </p>
    </figure>
  )
}
