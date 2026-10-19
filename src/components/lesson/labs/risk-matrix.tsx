'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

const LEVELS = ['Low', 'Medium', 'High'] as const
type L = 0 | 1 | 2

const RISKS: Record<string, { likely: L; impact: L; why: string; fix: string }> = {
  'A reused password': {
    likely: 2,
    impact: 2,
    why: 'Leaked passwords are tried on other sites automatically, all day. One leak opens every account that shares it.',
    fix: 'A different password for every account, kept in a password manager.',
  },
  'No phone updates': {
    likely: 1,
    impact: 2,
    why: 'Attackers know the weaknesses old software has. An unpatched phone holds your banking and messages.',
    fix: 'Turn on automatic updates.',
  },
  'Banking on café Wi-Fi': {
    likely: 0,
    impact: 2,
    why: 'Banking apps encrypt what they send, so this is less likely than people think. A fake hotspot or someone watching your screen still could.',
    fix: 'Use mobile data for banking, and check you’re on the real network.',
  },
  'A unique password and two-factor': {
    likely: 0,
    impact: 1,
    why: 'Even if the password leaks, the attacker still needs your second step.',
    fix: 'Keep it up, and store your backup codes safely.',
  },
}

const cell = (likely: number, impact: number) => {
  const score = likely + impact
  return score >= 4
    ? 'bg-[rgba(255,154,162,0.30)]'
    : score >= 2
      ? 'bg-[rgba(255,170,60,0.22)]'
      : 'bg-success-fill/20'
}

/**
 * Likelihood against impact, with one situation placed on the grid (Explore lab: value = a situation).
 */
export function RiskMatrix({ value = 'A reused password' }: LabProps) {
  const r = RISKS[value] ?? RISKS['A reused password']!
  const level = r.likely + r.impact >= 4 ? 'High' : r.likely + r.impact >= 2 ? 'Medium' : 'Low'
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div
        role="img"
        aria-label={`${value}: likelihood ${LEVELS[r.likely]}, impact ${LEVELS[r.impact]}, so the risk is ${level}.`}
        className="grid grid-cols-[auto_repeat(3,minmax(0,1fr))] gap-1.5 text-[11px] text-ink-subtle"
      >
        {[2, 1, 0].map((impact) => (
          <div key={impact} className="contents">
            <span className="flex items-center pr-1">
              {impact === 2 ? 'High impact' : impact === 1 ? 'Medium' : 'Low impact'}
            </span>
            {[0, 1, 2].map((likely) => (
              <span
                key={likely}
                className={cn('flex h-12 items-center justify-center rounded-lg', cell(likely, impact))}
              >
                {likely === r.likely && impact === r.impact && (
                  <span className="size-5 rounded-full border-[3px] border-white bg-cy shadow-[0_0_0_2px_#0E7490]" />
                )}
              </span>
            ))}
          </div>
        ))}
        <span />
        <span className="text-center">Unlikely</span>
        <span className="text-center">Possible</span>
        <span className="text-center">Likely</span>
      </div>
      <figcaption className="flex flex-col gap-1.5 rounded-xl bg-row px-3 py-2.5 text-sm text-ink">
        <span className="font-semibold">
          {value}: {level.toLowerCase()} risk
        </span>
        <span className="text-ink-soft">{r.why}</span>
        <span className="text-cy-text">Fix: {r.fix}</span>
      </figcaption>
    </figure>
  )
}
