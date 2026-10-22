'use client'
import type { LabProps } from './shared'

// The same tiny job in each language: say hello three times. Every example is real, working code.
const LANGS: Record<string, { code: string; used: string; runs: string; level: string }> = {
  Python: {
    code: 'for i in range(3):\n    print("Hello!")',
    used: 'Data, AI, automation, websites, teaching',
    runs: 'Interpreted: run line by line by the Python program',
    level: 'High-level: reads almost like English',
  },
  JavaScript: {
    code: 'for (let i = 0; i < 3; i++) {\n  console.log("Hello!")\n}',
    used: 'Every interactive website, and many servers and apps',
    runs: 'Run by the web browser (or Node.js), compiled as it goes',
    level: 'High-level',
  },
  Java: {
    code: 'public class Main {\n  public static void main(String[] args) {\n    for (int i = 0; i < 3; i++) {\n      System.out.println("Hello!");\n    }\n  }\n}',
    used: 'Banks, big business systems, Android apps',
    runs: 'Compiled first, then run by the Java virtual machine',
    level: 'High-level, with more structure to write',
  },
  C: {
    code: '#include <stdio.h>\n\nint main(void) {\n  for (int i = 0; i < 3; i++) {\n    printf("Hello!\\n");\n  }\n  return 0;\n}',
    used: 'Operating systems, devices, anything that must be very fast',
    runs: 'Compiled into the processor’s own instructions, before it runs',
    level: 'Lower-level: close to the hardware',
  },
  SQL: {
    code: "SELECT 'Hello!'\nFROM generate_series(1, 3);",
    used: 'Asking databases questions',
    runs: 'Run by a database, which decides how to answer',
    level: 'High-level: you say what you want, not how',
  },
}

/** The same small program in five languages, with what each is used for (Explore lab: value = a language). */
export function Languages({ value = 'Python' }: LabProps) {
  const name = LANGS[value] ? value : 'Python'
  const l = LANGS[name]!
  const rows = [
    ['Used for', l.used],
    ['How it runs', l.runs],
    ['Level', l.level],
  ] as const
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${name}. Used for ${l.used}.`}>
      <div className="overflow-hidden rounded-xl border border-line">
        <div className="flex items-center justify-between border-b border-[#2a2540] bg-[#15122a] px-3 py-1.5 text-[11px] text-[#a9a6bc]">
          <span>{name}</span>
          <span>Says hello three times</span>
        </div>
        <pre className="m-0 bg-[#0d0b16] p-3 font-mono text-[12.5px] leading-5 whitespace-pre-wrap text-[#e8e6f0] [overflow-wrap:anywhere]">{l.code}</pre>
        <pre className="m-0 border-t border-[#2a2540] bg-[#0d0b16] px-3 py-2 font-mono text-[12px] leading-5 text-[#7ee2b8]">{name === 'SQL' ? "?column?\n--------\nHello!\nHello!\nHello!" : 'Hello!\nHello!\nHello!'}</pre>
      </div>
      <dl className="flex flex-col divide-y divide-divider">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 py-1.5 text-[13px] leading-5">
            <dt className="text-ink-subtle">{k}</dt>
            <dd className="text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </figure>
  )
}
