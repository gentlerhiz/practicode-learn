'use client'
import type { LabProps } from './shared'

const SHAPES: Record<string, { json: string; parts: [string, string][]; ok: boolean }> = {
  'An object': {
    json: '{\n  "name": "Flat white",\n  "price": 3.2,\n  "inStock": true\n}',
    parts: [
      ['{ }', 'An object: named values, like one row of a form'],
      ['"name"', 'A key, always in double quotes'],
      ['"Flat white"', 'A string'],
      ['3.2', 'A number, with no quotes'],
      ['true', 'A boolean: true or false'],
    ],
    ok: true,
  },
  'A list': {
    json: '[\n  "Espresso",\n  "Flat white",\n  "Croissant"\n]',
    parts: [
      ['[ ]', 'An array: a list, in order'],
      ['"Espresso"', 'The first item. Items are separated by commas'],
    ],
    ok: true,
  },
  'Nested data': {
    json: '{\n  "id": 1042,\n  "customer": { "name": "Amara" },\n  "items": [\n    { "name": "Flat white", "quantity": 2 }\n  ],\n  "note": null\n}',
    parts: [
      ['"customer"', 'An object inside an object'],
      ['"items"', 'An array of objects: one for each line of the order'],
      ['null', 'Nothing here, on purpose'],
    ],
    ok: true,
  },
  'A mistake': {
    json: "{\n  'name': 'Flat white',\n  \"price\": 3.2,\n}",
    parts: [
      ["'name'", 'JSON only allows double quotes'],
      ['3.2,', 'No comma after the last value'],
    ],
    ok: false,
  },
}

/** JSON's building blocks, with one piece of data taken apart (Explore lab: value = a shape). */
export function JsonShape({ value = 'An object' }: LabProps) {
  const s = SHAPES[value] ?? SHAPES['An object']!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div className="flex flex-col gap-2 @min-[540px]:flex-row">
        <pre className="m-0 min-w-0 flex-1 overflow-x-auto rounded-2xl border border-line bg-row p-3 font-mono text-[13px] leading-5 whitespace-pre-wrap text-ink [overflow-wrap:anywhere]">
          {s.json}
        </pre>
        <ul className="m-0 flex flex-1 list-none flex-col gap-1.5 p-0">
          {s.parts.map(([code, line]) => (
            <li key={code} className="flex items-baseline gap-2 rounded-lg bg-row px-2.5 py-1.5 text-[13px]">
              <code className="shrink-0 font-mono font-bold text-fe-text">{code}</code>
              <span className="text-ink-soft">{line}</span>
            </li>
          ))}
        </ul>
      </div>
      <figcaption
        className={
          s.ok
            ? 'rounded-xl bg-success-fill/15 px-3 py-2.5 text-sm text-ink'
            : 'rounded-xl bg-[rgba(255,154,162,0.18)] px-3 py-2.5 text-sm text-ink'
        }
      >
        {s.ok
          ? 'Valid JSON: any program, in any language, can read this.'
          : 'Not valid JSON. A program reading it stops with an error such as “Unexpected token”.'}
      </figcaption>
    </figure>
  )
}
