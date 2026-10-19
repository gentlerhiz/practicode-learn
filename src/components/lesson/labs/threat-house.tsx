'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

const STEPS = [
  { name: 'Threat', line: 'Someone who might do harm: a burglar walking down the street' },
  { name: 'Vulnerability', line: 'A weakness they could use: a window left open' },
  {
    name: 'Risk',
    line: 'How likely harm is, and how bad it would be: high, with an open window and a laptop on the table',
  },
  {
    name: 'Control',
    line: 'What lowers the risk: close and lock the window. The burglar is still out there, but the risk drops',
  },
] as const

/**
 * Threat, vulnerability, risk and control, told as a house (Diagram lab, 4 states). The same ideas
 * apply to an account: an attacker, a reused password, the chance and harm, then a unique password.
 */
export function ThreatHouse({ state = 0 }: LabProps) {
  const at = Math.min(Math.max(state, 0), STEPS.length - 1)
  const open = at < 3
  const step = STEPS[at]!
  const risk = at === 2 ? 'High' : at === 3 ? 'Low' : null
  return (
    <figure className="m-0 flex flex-col gap-3">
      <svg
        viewBox="0 0 320 170"
        role="img"
        aria-label={`${step.name}. ${step.line}.`}
        className="mx-auto block h-auto w-full max-w-[440px]"
      >
        <path
          d="M60 80 140 24 220 80v80H60z"
          fill="var(--pc-surface-row)"
          stroke="var(--pc-text-muted)"
          strokeWidth="2"
        />
        <rect
          x="124"
          y="112"
          width="32"
          height="48"
          rx="3"
          fill="var(--pc-surface-sunken)"
          stroke="var(--pc-text-muted)"
          strokeWidth="2"
        />
        {/* The window: open (a gap) or shut with a lock */}
        <rect
          x="76"
          y="92"
          width="34"
          height="28"
          rx="3"
          fill={open ? 'var(--pc-surface-sunken)' : 'rgba(34,190,230,0.25)'}
          stroke={at === 1 ? '#ff9aa2' : open ? 'var(--pc-text-muted)' : '#0E7490'}
          strokeWidth={at === 1 ? 3 : 2}
          strokeDasharray={open ? '5 4' : undefined}
        />
        {!open && (
          <text x="93" y="111" textAnchor="middle" fontSize="13" fill="var(--pc-text)">
            🔒
          </text>
        )}
        <rect
          x="168"
          y="96"
          width="36"
          height="22"
          rx="3"
          fill="var(--pc-surface-sunken)"
          stroke="var(--pc-text-muted)"
          strokeWidth="2"
        />
        {/* The burglar */}
        <g opacity={at === 0 ? 1 : 0.55}>
          <circle cx="278" cy="98" r="10" fill={at === 0 ? '#ff9aa2' : 'var(--pc-text-muted)'} />
          <path d="M266 150v-26a12 12 0 0 1 24 0v26" fill={at === 0 ? '#ff9aa2' : 'var(--pc-text-muted)'} />
        </g>
        <line x1="10" y1="160" x2="310" y2="160" stroke="var(--pc-line-control)" strokeWidth="2" />
      </svg>
      <div className="flex flex-wrap gap-2" aria-hidden="true">
        {STEPS.map((s, i) => (
          <span
            key={s.name}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-semibold',
              i === at ? 'border-transparent bg-cy text-white' : 'border-line-control text-ink-muted',
            )}
          >
            {s.name}
          </span>
        ))}
        {risk && (
          <span
            className={cn(
              'rounded-full px-3 py-1 text-xs font-semibold',
              risk === 'High' ? 'bg-[rgba(255,154,162,0.2)] text-error' : 'bg-success-fill/20 text-ink',
            )}
          >
            Risk: {risk}
          </span>
        )}
      </div>
    </figure>
  )
}
