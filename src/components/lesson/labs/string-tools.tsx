'use client'
import type { LabProps } from './shared'

// What each tool does to name = "Amara Diallo", as Python would print it.
const TOOLS: Record<string, { result: string; says: string }> = {
  'len(name)': { result: '12', says: 'len counts the characters, including the space.' },
  'name.upper()': { result: 'AMARA DIALLO', says: 'upper gives back a copy in capitals. name itself doesn’t change.' },
  'name[0]': { result: 'A', says: 'Square brackets pick one character. Python counts from 0, so [0] is the first.' },
  "name + '!'": { result: 'Amara Diallo!', says: '+ joins two strings into one.' },
  "f'Hi {name}'": { result: 'Hi Amara Diallo', says: 'An f-string puts a variable’s value inside the text, wherever the curly braces are.' },
}

/** One string tool applied to a name (Explore lab: value = a tool). */
export function StringTools({ value = 'len(name)' }: LabProps) {
  const t = TOOLS[value] ?? TOOLS['len(name)']!
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${value} gives ${t.result}.`}>
      <div className="flex flex-col gap-1.5 rounded-2xl bg-[#15122a] p-4 font-mono text-[#f4f1ff]">
        <span className="text-sm text-[#c9c3e6]">name = &quot;Amara Diallo&quot;</span>
        <span className="text-base">
          <span className="text-[#9fb0ff]">&gt;&gt;&gt;</span> print({value})
        </span>
        <span className="text-xl font-bold">{t.result}</span>
      </div>
      <figcaption className="rounded-xl bg-row px-3 py-2.5 text-sm text-ink-soft">{t.says}</figcaption>
    </figure>
  )
}
