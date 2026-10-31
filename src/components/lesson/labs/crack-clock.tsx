'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

// After a breach, attackers guess offline against the stolen list. How fast depends on how the site
// stored passwords: a careless fast hash allows about ten billion guesses a second on one gaming
// computer; a proper slow hash, such as bcrypt, brings that down to about ten thousand. You can't see
// which a site uses, so a password should survive the fast one. Guess counts are the average needed
// (half the possibilities), or how far down attackers' lists a common pattern sits.
const FAST = 1e10
const SLOW = 1e4

type Case = { guesses: number; how: string }

const WORDS = 7776 // the words in a dice-word list, as password generators use

const CASES: Record<string, Case> = {
  password1: { guesses: 50, how: 'It’s near the top of every list of leaked passwords, so it’s one of the first guesses.' },
  'P@ssw0rd!': { guesses: 5e4, how: 'A common word with letters swapped for look-alike symbols. Cracking tools try every swap automatically.' },
  Kofi1990: { guesses: 1e6, how: 'A name and a year. Attackers combine lists of names with every year.' },
  'Tr0ub4dor&3': { guesses: 1.4e8, how: 'One dictionary word, dressed up with swaps and a number. It looks complex, but it’s built from patterns.' },
  'Xq7#pL2v': { guesses: 95 ** 8 / 2, how: 'Eight truly random characters: strong for its length, and impossible to remember.' },
  'purple-mango-river': { guesses: WORDS ** 3 / 2, how: 'Three random words: easy to remember, but each word is only one of 7,776 choices.' },
  'tiger-kettle-orbit-velvet': { guesses: WORDS ** 4 / 2, how: 'Four random words. Each extra word multiplies the guesses by 7,776.' },
  'tiger-kettle-orbit-velvet-lagoon': { guesses: WORDS ** 5 / 2, how: 'Five random words: long, memorable, and out of reach even of the fastest cracking.' },
}

/** A duration in words, rounded the way people say it. */
export function inWords(seconds: number): string {
  if (seconds < 1) return 'instantly'
  const units: [number, string][] = [
    [31557600e6, 'million years'],
    [31557600e3, 'thousand years'],
    [31557600, 'year'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
    [1, 'second'],
  ]
  for (const [size, name] of units) {
    if (seconds >= size) {
      const n = seconds / size
      if (name.endsWith('years')) {
        // The universe is about 13.8 billion years old.
        return name === 'million years' && n >= 13800
          ? 'longer than the universe has existed'
          : `about ${Math.round(n).toLocaleString('en-GB')} ${name}`
      }
      const r = Math.round(n)
      return `about ${r.toLocaleString('en-GB')} ${name}${r === 1 ? '' : 's'}`
    }
  }
  return 'instantly'
}

const bar = (guesses: number) => Math.min(100, Math.max(4, (Math.log10(guesses) / 21) * 100))

/** How long a password lasts once a site's password list is stolen (Explore lab: value = an example password). */
export function CrackClock({ value = 'password1' }: LabProps) {
  const c = CASES[value] ?? CASES.password1!
  const fast = c.guesses / FAST
  const slow = c.guesses / SLOW
  const safe = fast >= 31557600
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${value}: ${c.how} After a breach, it lasts ${inWords(fast)} against fast cracking, and ${inWords(slow)} if the site stored it properly.`}>
      <div className="flex flex-col gap-1 rounded-2xl border border-line bg-row px-4 py-3">
        <span className="text-[12px] text-ink-muted">{value.length} characters</span>
        <span className="font-mono text-lg font-bold [overflow-wrap:anywhere] text-ink">{value}</span>
        <span className="text-[13px] leading-5 text-ink-soft">{c.how}</span>
      </div>
      <div className="flex flex-col gap-2.5 rounded-2xl bg-[#15122a] p-4 text-[#f4f1ff]">
        <span className="text-[12px] text-[#a9a5c0]">After a breach, a cracking computer guesses against the stolen list</span>
        {[
          ['If the site stored it carelessly', '10 billion guesses a second', fast],
          ['If the site stored it properly', '10 thousand guesses a second', slow],
        ].map(([label, speed, secs]) => (
          <div key={label as string} className="flex flex-col gap-1">
            <span className="flex flex-wrap items-baseline justify-between gap-x-2 text-[12.5px]">
              <span>{label as string}</span>
              <span className="text-[11px] text-[#a9a5c0]">{speed as string}</span>
            </span>
            <span className={cn('text-[17px] font-bold', (secs as number) < 86400 * 365 ? 'text-[#ff8f8f]' : 'text-[#7ee2b8]')}>{inWords(secs as number)}</span>
          </div>
        ))}
        <div aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-white/10">
          <div className={cn('h-2 rounded-full motion-safe:transition-[width] motion-safe:duration-500', safe ? 'bg-[#7ee2b8]' : 'bg-[#ff8f8f]')} style={{ width: `${bar(c.guesses)}%` }} />
        </div>
      </div>
      <figcaption className="rounded-xl bg-row px-3 py-2.5 text-[13px] leading-5 text-ink-soft">
        You can’t tell how a site stores passwords, so choose one that survives the careless case. Online, at the sign-in page, sites slow guessers down far more, so this is the worst case.
      </figcaption>
    </figure>
  )
}
