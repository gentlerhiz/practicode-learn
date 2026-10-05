'use client'
import { Fragment, useState } from 'react'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

const PARTS = [
  {
    text: 'https',
    name: 'Scheme',
    about: 'How the browser and the server talk. https means the connection is encrypted.',
  },
  {
    text: 'learn',
    name: 'Subdomain',
    about: 'A part of a website with its own name. learn is PractiCode’s learning site.',
  },
  { text: 'practicode', name: 'Domain', about: 'The name the site’s owner registered.' },
  { text: 'tech', name: 'Top-level domain', about: 'The ending of the name. Others include com, ng and uk.' },
  { text: '/tracks', name: 'Path', about: 'Which page on the server: here, the tracks page.' },
  {
    text: '?ref=whatsapp',
    name: 'Query',
    about: 'Extra details for the page. ref=whatsapp says the visitor came from a WhatsApp link.',
  },
  {
    text: '#syllabus',
    name: 'Fragment',
    about: 'A place on the page to jump to. The browser handles it, and it isn’t sent to the server.',
  },
] as const
// What sits between each part and the next.
const AFTER = ['://', '.', '.', '', '', '', '']

/**
 * The parts of https://learn.practicode.tech/tracks?ref=whatsapp#syllabus (Diagram lab: state n
 * highlights part n, in the order above). Tapping any part highlights and names it too.
 */
export function UrlAnatomy({ state = 0 }: LabProps) {
  const fromState = Math.min(Math.max(state, 0), PARTS.length - 1)
  const [picked, setPicked] = useState<{ part: number; forState: number } | null>(null)
  // A tap holds until the diagram moves to another state.
  const active = picked && picked.forState === fromState ? picked.part : fromState
  const part = PARTS[active]!

  return (
    <figure className="m-0 flex flex-col gap-3">
      <div
        role="group"
        aria-label="The address https://learn.practicode.tech/tracks?ref=whatsapp#syllabus, split into its parts"
        className="flex flex-wrap items-center rounded-xl border border-line bg-row p-3 font-mono text-[15px] leading-8"
      >
        {PARTS.map((p, i) => (
          <Fragment key={p.name}>
            <button
              type="button"
              aria-pressed={i === active}
              aria-label={`${p.name}: ${p.text}`}
              onClick={() => setPicked({ part: i, forState: fromState })}
              className={cn(
                'rounded-md px-0.5',
                i === active ? 'bg-fe text-white' : 'text-ink hover:bg-fe/15',
              )}
            >
              {p.text}
            </button>
            {AFTER[i] && <span className="text-ink-muted">{AFTER[i]}</span>}
          </Fragment>
        ))}
      </div>
      <figcaption aria-live="polite" className="rounded-xl border border-line-subtle bg-row p-3">
        <p className="font-semibold text-ink">
          {part.name}: <code className="font-mono text-fe-text">{part.text}</code>
        </p>
        <p className="mt-1 text-sm text-ink-soft">{part.about}</p>
      </figcaption>
      <p className="text-[12px] text-ink-subtle">Tap any part of the address to name it.</p>
    </figure>
  )
}
