'use client'
import { cn } from '@/lib/cn'
import { C, type LabProps } from './shared'

type Stop = 'laptop' | 'github' | 'build' | 'site'

const STOPS: { id: Stop; label: string; x: number }[] = [
  { id: 'laptop', label: 'Your laptop', x: 40 },
  { id: 'github', label: 'GitHub', x: 127 },
  { id: 'build', label: 'Netlify build', x: 214 },
  { id: 'site', label: 'Live site', x: 300 },
]

type View = {
  reached: Stop
  address: string
  padlock?: boolean
  preview?: boolean
  line: string
  say: string
}

const VIEWS: View[] = [
  {
    reached: 'github',
    address: '',
    line: '$ git push origin main',
    say: 'You push a commit to main. GitHub now has the newest code, and Netlify is connected to the repository.',
  },
  {
    reached: 'build',
    address: '',
    line: 'Netlify: $ npm run build',
    say: 'Netlify sees the push and starts a build on its own computer: it runs your build command, npm run build, which makes the dist folder.',
  },
  {
    reached: 'site',
    address: 'mama-nkechi.netlify.app',
    line: 'Netlify: published dist/ · Site is live',
    say: 'Netlify publishes the dist folder. The site is live at a free netlify.app address, and every push to main updates it.',
  },
  {
    reached: 'site',
    address: 'deploy-preview-7--mama-nkechi.netlify.app',
    preview: true,
    line: 'Pull request #7 · Deploy preview ready',
    say: 'A pull request gets a deploy preview: its own address to check the change on a real phone. The live site doesn’t change until you merge.',
  },
  {
    reached: 'site',
    address: 'mamankechi.ng',
    line: 'DNS: www CNAME mama-nkechi.netlify.app',
    say: 'Your own domain: add it in Netlify, then add DNS records at the company you bought it from, so the name points to Netlify.',
  },
  {
    reached: 'site',
    address: 'mamankechi.ng',
    padlock: true,
    line: 'HTTPS: certificate from Let’s Encrypt · http redirects to https',
    say: 'Netlify gets a free HTTPS certificate from Let’s Encrypt and renews it. Visitors see the padlock, and http:// addresses redirect to https://.',
  },
]

// Explore: the value names a stage, such as "Netlify app address", "Domain added" or "HTTPS on".
const STAGES: [RegExp, number][] = [
  [/https|padlock|certificate/i, 5],
  [/domain|dns/i, 4],
  [/preview|pull/i, 3],
  [/live|netlify\.app|app address|publish/i, 2],
  [/build/i, 1],
]

/**
 * From git push to a live site on your own domain with HTTPS. Diagram lab (6 states), or Explore lab
 * whose value names a stage.
 */
export function DeployPipeline({ state = 0, value }: LabProps) {
  const at = value === undefined ? state : (STAGES.find(([re]) => re.test(value))?.[1] ?? 0)
  const v = VIEWS[Math.min(Math.max(at, 0), VIEWS.length - 1)]!
  const upTo = STOPS.findIndex((s) => s.id === v.reached)

  return (
    <figure className="m-0">
      <div className="rounded-xl border border-line-subtle bg-row p-3">
        <svg role="img" aria-label={v.say} viewBox="0 0 340 92" className="w-full">
          {STOPS.slice(0, -1).map((s, i) => (
            <line
              key={s.id}
              x1={s.x + 24}
              y1={34}
              x2={STOPS[i + 1]!.x - 24}
              y2={34}
              stroke={i < upTo ? C.track : C.lineControl}
              strokeWidth={3}
              strokeDasharray={i < upTo ? undefined : '4 4'}
            />
          ))}
          {STOPS.map((s, i) => (
            <g key={s.id}>
              <rect
                x={s.x - 22}
                y={14}
                width={44}
                height={40}
                rx={10}
                fill={i <= upTo ? C.trackTint : 'transparent'}
                stroke={i <= upTo ? C.track : C.lineControl}
                strokeWidth={2}
              />
              <text x={s.x} y={39} textAnchor="middle" fontSize="15" aria-hidden="true">
                {['💻', '🐙', '⚙️', '🌐'][i]}
              </text>
              <text x={s.x} y={74} textAnchor="middle" fontSize="10" fill={i <= upTo ? C.text : C.muted}>
                {s.label}
              </text>
            </g>
          ))}
        </svg>
        {v.address && (
          <p
            className={cn(
              'mt-2 flex items-center gap-2 overflow-hidden rounded-full border border-line bg-sunken px-3 py-1.5 font-mono text-[12px] text-ink',
              v.preview && 'border-dashed',
            )}
          >
            <span aria-hidden="true">{v.padlock ? '🔒' : 'ⓘ'}</span>
            <span className="truncate">
              {v.padlock ? 'https://' : ''}
              {v.address}
            </span>
            {v.padlock && <span className="sr-only">, secure</span>}
          </p>
        )}
      </div>
      <p className="mt-2.5 font-mono text-[13px] break-words text-ink-muted">{v.line}</p>
      {value !== undefined && <p className="mt-1.5 text-[13px] text-ink-muted">{v.say}</p>}
      <figcaption className="sr-only">{v.say}</figcaption>
    </figure>
  )
}
