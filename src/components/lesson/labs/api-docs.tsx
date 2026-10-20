'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

const PARTS = ['endpoint', 'parameters', 'response', 'errors'] as const
const LABEL = [
  'The endpoint: the method and the path',
  'The parameters: what you fill in',
  'An example response: what you get back',
  'The errors: what can go wrong, and what it looks like',
]

/** One page of API documentation, read a part at a time (Diagram lab, 4 states). */
export function ApiDocs({ state = 0 }: LabProps) {
  const step = Math.min(Math.max(state, 0), PARTS.length - 1)
  const box = (i: number) =>
    cn(
      'rounded-xl border-[1.5px] p-3 motion-safe:transition-colors motion-safe:duration-250',
      i === step ? 'border-fe bg-[rgba(77,107,255,0.12)]' : 'border-transparent bg-row',
    )
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={`${LABEL[step]}.`} className="flex flex-col gap-2 rounded-2xl border border-line p-3">
        <span className="text-xs font-semibold text-ink-subtle">Café API · Menu</span>
        <div className={box(0)}>
          <span className="mr-2 rounded-md bg-fe px-2 py-0.5 font-mono text-xs font-bold text-white">GET</span>
          <span className="font-mono text-sm text-ink">/menu/{'{id}'}</span>
          <p className="m-0 mt-1.5 text-[13px] text-ink-soft">Gets one item on the menu.</p>
        </div>
        <div className={box(1)}>
          <p className="m-0 text-[13px] text-ink">
            <code className="font-mono font-bold text-fe-text">id</code> · in the path · number · required
          </p>
          <p className="m-0 text-[13px] text-ink-soft">The item’s number, from GET /menu.</p>
        </div>
        <div className={box(2)}>
          <p className="m-0 mb-1 text-[13px] text-ink">200 OK</p>
          <pre className="m-0 font-mono text-[12.5px] text-ink-soft">
            {'{ "id": 2, "name": "Flat white", "price": 3.2 }'}
          </pre>
        </div>
        <div className={box(3)}>
          <p className="m-0 text-[13px] text-ink">404 Not Found: no item with that id</p>
          <pre className="m-0 font-mono text-[12.5px] text-ink-soft">{'{ "error": "No menu item 99" }'}</pre>
        </div>
      </div>
      <figcaption className="flex items-start gap-3 rounded-xl bg-row px-3 py-2.5 text-sm text-ink">
        <span
          aria-hidden="true"
          className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-fe text-xs font-bold text-white"
        >
          {step + 1}
        </span>
        {LABEL[step]}.
      </figcaption>
    </figure>
  )
}
