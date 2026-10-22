'use client'
import { Cloud, Code2, Database, Headset, PenTool, Shield } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'
import { FAMILIES, ROLES } from './roles-data'

const ICONS: Record<string, typeof Cloud> = {
  'Support and networking': Headset,
  'Cloud and infrastructure': Cloud,
  Software: Code2,
  'Data and AI': Database,
  Security: Shield,
  'Design and product': PenTool,
}

const WORKS_ON: Record<string, string> = {
  'Support and networking': 'People’s devices, accounts and the networks that join them',
  'Cloud and infrastructure': 'The servers and systems that apps run on',
  Software: 'The websites and apps themselves',
  'Data and AI': 'Data: answers, predictions and AI models',
  Security: 'Keeping systems and people safe from attack',
  'Design and product': 'What gets built, and how easy it is to use',
}

/** The six families of tech roles, with the roles in each (Explore lab: value = a family). */
export function RoleMap({ value = 'Support and networking' }: LabProps) {
  const fam = FAMILIES.find((f) => f.name === value) ?? FAMILIES[0]!
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${fam.name}: ${WORKS_ON[fam.name]}. Roles: ${fam.roles.join(', ')}.`}>
      <ul aria-hidden="true" className="grid grid-cols-3 gap-1.5 @min-[460px]:grid-cols-6">
        {FAMILIES.map((f) => {
          const Icon = ICONS[f.name]!
          const on = f.name === fam.name
          return (
            <li
              key={f.name}
              className={cn(
                'flex min-w-0 flex-col items-center gap-1 rounded-xl border-[1.5px] px-1 py-2 text-center motion-safe:transition-colors',
                on ? 'border-it bg-[rgba(255,170,60,0.16)]' : 'border-line bg-row opacity-60',
              )}
            >
              <Icon size={18} aria-hidden="true" className={on ? 'text-it-text' : 'text-ink-muted'} />
              <span className="text-[10.5px] leading-[13px] font-semibold text-ink">{f.name}</span>
            </li>
          )
        })}
      </ul>
      <div className="flex flex-col gap-1 rounded-2xl border border-line bg-row px-4 py-3">
        <p className="font-display text-[15px] font-bold text-ink">{fam.name}</p>
        <p className="text-[13px] leading-5 text-ink-soft">Works on: {WORKS_ON[fam.name]}</p>
      </div>
      <ul className="flex flex-col gap-1.5">
        {fam.roles.map((r) => (
          <li key={r} className="pop-in rounded-xl border border-line px-3 py-2">
            <p className="text-[13px] font-semibold text-ink">{r}</p>
            <p className="text-[12.5px] leading-5 text-ink-muted">{ROLES[r]!.does}</p>
          </li>
        ))}
      </ul>
      <p className="text-[12.5px] leading-5 text-ink-soft">
        <span className="font-semibold text-ink">Where PractiCode goes next: </span>
        {fam.course ?? 'This course is your first step; we don’t yet have a course of our own for this family.'}
      </p>
    </figure>
  )
}
