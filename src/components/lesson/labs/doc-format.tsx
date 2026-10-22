'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

const LEVELS = ['Plain text', 'Headings', 'Lists', 'Spacing and emphasis'] as const

const NOTES: Record<(typeof LEVELS)[number], string> = {
  'Plain text': 'Every word is there, but it’s one block. Readers have to read all of it to find anything.',
  Headings: 'Headings, made with the Heading 1 and Heading 2 styles, give the page a shape, and build a table of contents for free.',
  Lists: 'Steps become a numbered list; things to bring become bullets. Each one is quick to scan.',
  'Spacing and emphasis': 'Space between sections, and bold on the one thing nobody must miss. Bold everything, and nothing stands out.',
}

const H1 = ({ children, on }: { children: string; on: boolean }) =>
  on ? <p className="pop-in font-display text-[17px] leading-6 font-bold text-[#15122a]">{children}</p> : <span>{children} </span>
const H2 = ({ children, on, space }: { children: string; on: boolean; space: boolean }) =>
  on ? <p className={cn('pop-in text-[13px] font-bold text-[#3550e6]', space && 'mt-2')}>{children}</p> : <span>{children}. </span>

/** The same notice, from plain text to well formatted, one change at a time (Explore lab: value = a level). */
export function DocFormat({ value = 'Plain text' }: LabProps) {
  const at = Math.max(0, LEVELS.indexOf(value as (typeof LEVELS)[number]))
  const h = at >= 1
  const list = at >= 2
  const space = at >= 3
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`The notice with ${LEVELS.slice(0, at + 1).join(', ').toLowerCase()}. ${NOTES[LEVELS[at]!]}`}>
      <div className="rounded-xl border border-line bg-white p-4 text-[12.5px] leading-5 text-[#3b3752] shadow-sm">
        <div className={cn(h ? 'flex flex-col gap-1' : '')}>
          <H1 on={h}>Community clean-up day</H1>
          <p className={cn(h ? '' : 'inline')}>
            Join us on Saturday 7 November to tidy the park and the riverbank. {space ? <strong className="text-[#15122a]">Meet at the main gate at 9 am.</strong> : 'Meet at the main gate at 9 am.'}
          </p>
          <H2 on={h} space={space}>How it works</H2>
          {list ? (
            <ol className="pop-in list-decimal pl-5">
              <li>Sign in at the gate</li>
              <li>Collect gloves and a bag</li>
              <li>Join a team leader</li>
            </ol>
          ) : (
            <p className={cn(h ? '' : 'inline')}>Sign in at the gate, collect gloves and a bag, then join a team leader. </p>
          )}
          <H2 on={h} space={space}>What to bring</H2>
          {list ? (
            <ul className="pop-in list-disc pl-5">
              <li>Water</li>
              <li>Sturdy shoes</li>
              <li>A hat</li>
            </ul>
          ) : (
            <p className={cn(h ? '' : 'inline')}>Bring water, sturdy shoes and a hat.</p>
          )}
        </div>
      </div>
      <p aria-live="polite" className="text-[13px] leading-5 text-ink-soft">
        {NOTES[LEVELS[at]!]}
      </p>
    </figure>
  )
}
