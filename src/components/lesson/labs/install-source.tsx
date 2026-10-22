'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

type Source = { level: 0 | 1 | 2 | 3; verdict: string; why: string; checks: string[] }

const SOURCES: Record<string, Source> = {
  'The official app store': {
    level: 0,
    verdict: 'Safest',
    why: 'Apps are checked before they’re listed, and removed if they misbehave. Checks aren’t perfect, so look before you tap Install.',
    checks: ['The developer’s name is the company you expect', 'Lots of downloads and recent reviews', 'It only asks for permissions it needs'],
  },
  'The maker’s own website': {
    level: 1,
    verdict: 'Safe, if it’s the real site',
    why: 'Many good apps, like VLC or LibreOffice, come from their makers’ sites. Fake sites copy them, so make sure you’re on the real one.',
    checks: ['Type the address yourself, or find it from the maker’s name', 'Check the address carefully before you download', 'Download from the site’s own Download page, not an advert'],
  },
  'A link in a message': {
    level: 2,
    verdict: 'Risky',
    why: 'Scammers send links to fake download pages, often with a reason to hurry: “Your delivery needs this app”. The safe move is to ignore the link and find the app yourself.',
    checks: ['Don’t install from the link', 'Go to the app store, or type the maker’s address yourself', 'If unsure, ask the sender another way, such as a call'],
  },
  'A free copy of paid software': {
    level: 3,
    verdict: 'Dangerous',
    why: '“Cracked” copies of paid apps are a favourite way to spread malware. They’re also against the law, and they never get security updates.',
    checks: ['Don’t install it', 'Look for a free or open-source app that does the same job', 'Or use the free trial or a student discount'],
  },
}

const LEVELS = ['Safest', 'Safe, if it’s the real site', 'Risky', 'Dangerous']
const TONE = ['bg-success-fill', 'bg-success-fill', 'bg-badge', 'bg-error']

/** Four places to get an app, from safest to most dangerous, and what to check (Explore lab: value = a source). */
export function InstallSource({ value = 'The official app store' }: LabProps) {
  const name = SOURCES[value] ? value : 'The official app store'
  const s = SOURCES[name]!
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${name}: ${s.verdict}. ${s.why}`}>
      <div aria-hidden="true" className="flex flex-col gap-1.5">
        <div className="grid grid-cols-4 gap-1">
          {LEVELS.map((l, i) => (
            <span key={l} className={cn('h-2.5 rounded-full motion-safe:transition-colors motion-safe:duration-300', i <= s.level ? TONE[s.level] : 'bg-meter')} />
          ))}
        </div>
        <div className="flex justify-between text-[11px] text-ink-subtle">
          <span>Safer</span>
          <span>More dangerous</span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 rounded-2xl border border-line bg-row px-4 py-3">
        <p className="text-[12px] text-ink-subtle">{name}</p>
        <p className={cn('font-display text-lg font-bold', s.level >= 2 ? 'text-error' : 'text-success')}>{s.verdict}</p>
        <p className="text-[13px] leading-5 text-ink-soft">{s.why}</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-[13px] font-semibold text-ink">{s.level >= 2 ? 'What to do instead' : 'Check before you install'}</p>
        <ul className="flex flex-col gap-1.5">
          {s.checks.map((c) => (
            <li key={c} className="flex gap-2 text-[13px] leading-5 text-ink-soft">
              <span aria-hidden="true" className="font-bold text-it-text">
                ›
              </span>
              {c}
            </li>
          ))}
        </ul>
      </div>
    </figure>
  )
}
