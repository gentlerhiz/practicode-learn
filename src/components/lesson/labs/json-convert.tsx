'use client'
import { ArrowDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

// Every output here is what Node 24 prints.
const CASES: Record<string, { input: string; code: string; output: string; type: string; bad?: boolean; says: string }> = {
  'Object to JSON': {
    input: "{ id: 7, item: 'Flat white', paid: true }",
    code: 'JSON.stringify(order)',
    output: '{"id":7,"item":"Flat white","paid":true}',
    type: 'string',
    says: 'JSON.stringify turns an object into JSON text, ready to send in a response or save to a file. Keys gain double quotes.',
  },
  'Pretty JSON': {
    input: "{ id: 7, item: 'Flat white' }",
    code: 'JSON.stringify(order, null, 2)',
    output: '{\n  "id": 7,\n  "item": "Flat white"\n}',
    type: 'string',
    says: 'The third argument indents the text by 2 spaces, so people can read it. Machines don’t mind either way.',
  },
  'JSON to object': {
    input: '\'{"id":7,"item":"Flat white"}\'',
    code: 'JSON.parse(text)',
    output: "{ id: 7, item: 'Flat white' }",
    type: 'object',
    says: 'JSON.parse turns JSON text, such as a request body, back into an object you can use: order.item works again.',
  },
  'Broken JSON': {
    input: "'{\"item\": \"Latte\",}'",
    code: 'JSON.parse(text)',
    output: "SyntaxError: Expected double-quoted property name in JSON at position 17 (line 1 column 18)",
    type: 'error',
    bad: true,
    says: 'A comma after the last value isn’t allowed in JSON. JSON.parse throws, so wrap it in try...catch when the text comes from outside.',
  },
  'What JSON drops': {
    input: "{ a: 1, f() {}, u: undefined, d: new Date('2026-10-28T09:30:00Z') }",
    code: 'JSON.stringify(thing)',
    output: '{"a":1,"d":"2026-10-28T09:30:00.000Z"}',
    type: 'string',
    says: 'JSON has no functions or undefined, so they vanish. A date becomes a string, and stays a string when you parse it back.',
  },
}

/** Objects to JSON text and back (Explore lab: value = a conversion). */
export function JsonConvert({ value = 'Object to JSON' }: LabProps) {
  const c = CASES[value] ?? CASES['Object to JSON']!
  return (
    <figure className="m-0 flex flex-col gap-2" aria-label={`${c.code} on ${c.input} gives ${c.output}. ${c.says}`}>
      <div className="flex flex-col gap-1 rounded-xl border border-line bg-row px-3 py-2.5">
        <span className="text-[12px] text-ink-muted">{c.code.startsWith('JSON.parse') ? 'text' : 'the value'}</span>
        <code className="font-mono text-[13px] text-ink [overflow-wrap:anywhere]">{c.input}</code>
      </div>
      <div className="flex items-center gap-2 self-center text-[13px] font-semibold text-fe-text">
        <ArrowDown size={16} aria-hidden="true" />
        <code className="font-mono">{c.code}</code>
      </div>
      <div className={cn('flex flex-col gap-1 rounded-xl px-3 py-2.5', c.bad ? 'bg-error/12' : 'bg-[#15122a]')}>
        <span className={cn('text-[12px]', c.bad ? 'text-error' : 'text-[#a9a5c0]')}>{c.bad ? 'throws' : `gives a ${c.type}`}</span>
        <pre className={cn('m-0 font-mono text-[13px] whitespace-pre-wrap [overflow-wrap:anywhere]', c.bad ? 'text-error' : 'text-[#f4f1ff]')}>{c.output}</pre>
      </div>
      <figcaption className="rounded-xl bg-row px-3 py-2.5 text-sm text-ink-soft">{c.says}</figcaption>
    </figure>
  )
}
