'use client'
import type { LabProps } from './shared'

// What a learner enjoys, the role families that suit it, and the open PractiCode course to try next.
const INTERESTS: Record<string, { families: string; roles: string; next: string; why: string }> = {
  'Helping people with tech': {
    families: 'Support and networking',
    roles: 'IT support technician, help desk analyst',
    next: 'Finish this course well, then Introduction to Cybersecurity, since keeping people safe is half of support.',
    why: 'Support is about people as much as computers: patience, clear explanations and a method.',
  },
  'Making things people see': {
    families: 'Software; Design and product',
    roles: 'Front-end developer, UX designer',
    next: 'Front-End Web Development: you build a real web page in the first module.',
    why: 'Front-end work turns ideas into pages and apps people use every day.',
  },
  'Building what runs behind apps': {
    families: 'Software; Cloud and infrastructure',
    roles: 'Back-end developer, cloud engineer',
    next: 'Back-End Web Development: servers, APIs, databases and sign-in.',
    why: 'Behind every app are servers, data and rules that have to work every time.',
  },
  'Finding answers in data': {
    families: 'Data and AI',
    roles: 'Data analyst, data scientist',
    next: 'SQL and Databases, then Python Programming.',
    why: 'Data work is asking good questions, and proving the answers.',
  },
  'Keeping people safe': {
    families: 'Security',
    roles: 'Security analyst, penetration tester',
    next: 'Introduction to Cybersecurity.',
    why: 'Security people protect accounts, money and data, and think like attackers to stay ahead.',
  },
}

/** From what you enjoy to role families and a next course (Explore lab: value = an interest). */
export function InterestMatch({ value = 'Helping people with tech' }: LabProps) {
  const name = INTERESTS[value] ? value : 'Helping people with tech'
  const it = INTERESTS[name]!
  const rows = [
    ['Role families', it.families],
    ['Roles to read about', it.roles],
    ['Your next course', it.next],
  ] as const
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${name}. ${it.why} Next: ${it.next}`}>
      <div className="flex flex-col gap-1 rounded-2xl border border-it bg-row px-4 py-3">
        <p className="text-[11px] text-ink-subtle">You enjoy</p>
        <p className="font-display text-lg font-bold text-ink">{name}</p>
        <p className="text-[13px] leading-5 text-ink-soft">{it.why}</p>
      </div>
      <dl className="flex flex-col divide-y divide-divider">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 py-2 text-[13px] leading-5">
            <dt className="text-ink-subtle">{k}</dt>
            <dd className={k === 'Your next course' ? 'font-semibold text-ink' : 'text-ink'}>{v}</dd>
          </div>
        ))}
      </dl>
      <p className="text-[12px] leading-[18px] text-ink-muted">Interests change as you learn. Try a first module before you decide: they’re free.</p>
    </figure>
  )
}
