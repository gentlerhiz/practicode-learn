'use client'
import { Bot, Check, CircleHelp, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

type Claim = { text: string; verdict: 'true' | 'false' | 'unsure'; check: string }

// Each answer is written for this lesson, in the style an AI assistant might use, with real facts and planted mistakes.
const ANSWERS: Record<string, { question: string; claims: Claim[] }> = {
  'A history question': {
    question: 'When did the first person walk on the Moon?',
    claims: [
      { text: 'Apollo 11 landed on the Moon on 20 July 1969.', verdict: 'true', check: 'NASA’s Apollo 11 pages: true (it was already 21 July in parts of Asia).' },
      { text: 'Neil Armstrong was the first person to step onto it,', verdict: 'true', check: 'NASA: true.' },
      { text: 'followed minutes later by Michael Collins.', verdict: 'false', check: 'False. Buzz Aldrin followed Armstrong. Michael Collins stayed in orbit, in the command module.' },
    ],
  },
  'A health question': {
    question: 'How much water should an adult drink a day?',
    claims: [
      { text: 'Many health services suggest about 6 to 8 glasses of fluid a day,', verdict: 'true', check: 'Several national health services give advice close to this. True, as general advice.' },
      { text: 'and you need more in hot weather or when exercising.', verdict: 'true', check: 'Health services agree. True.' },
      { text: 'Drinking 5 litres a day is recommended for everyone.', verdict: 'false', check: 'False. No health service recommends this for everyone, and too much water too fast can be dangerous. For your own health, ask a doctor or pharmacist.' },
    ],
  },
  'A source it quotes': {
    question: 'Give me a study showing sugar causes hyperactivity in children.',
    claims: [
      { text: 'A 2019 study by Dr A. Marsh at Northgate University found sugar doubled hyperactivity,', verdict: 'unsure', check: 'No such study can be found: the author, year and finding don’t match anything published. AI can invent sources that sound real.' },
      { text: 'published in the International Review of Child Diet.', verdict: 'unsure', check: 'No such journal or article can be found. Treat any source an AI gives you as a lead to check, not a fact.' },
      { text: 'Many reviews have found no clear link between sugar and hyperactivity.', verdict: 'true', check: 'Reviews of the research, including a well-known 1995 analysis in JAMA, found no clear effect. True.' },
    ],
  },
}

function Answer({ value }: { value: string }) {
  const a = ANSWERS[value] ?? ANSWERS['A history question']!
  const [checked, setChecked] = useState<number[]>([])
  return (
    <div className="flex flex-col gap-3">
      <p className="self-end rounded-2xl rounded-tr-md bg-fe px-3 py-2 text-[13px] leading-5 text-white">{a.question}</p>
      <div className="flex items-start gap-2">
        <Bot size={18} aria-hidden="true" className="mt-1 shrink-0 text-ai-text" />
        <p className="text-[12px] text-ink-muted">The assistant’s answer. Tap each part to check it against a good source.</p>
      </div>
      <ul className="flex flex-col gap-1.5">
        {a.claims.map((c, i) => {
          const done = checked.includes(i)
          const Icon = c.verdict === 'true' ? Check : c.verdict === 'false' ? X : CircleHelp
          return (
            <li key={i}>
              <button
                type="button"
                aria-expanded={done}
                onClick={() => setChecked((d) => (d.includes(i) ? d : [...d, i]))}
                className={cn(
                  'press flex w-full cursor-pointer flex-col items-start gap-1 rounded-xl border-[1.5px] px-3 py-2 text-left',
                  !done ? 'border-line-control bg-row hover:border-line-strong' : c.verdict === 'true' ? 'border-success-fill bg-row' : 'border-error bg-row',
                )}
              >
                <span className="text-[13px] leading-5 text-ink">{c.text}</span>
                {done && (
                  <span className={cn('pop-in flex gap-1.5 text-[12.5px] leading-5', c.verdict === 'true' ? 'text-success' : 'text-error')}>
                    <Icon size={15} aria-hidden="true" className="mt-0.5 shrink-0" />
                    <span className="text-ink-soft">{c.check}</span>
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
      <p aria-live="polite" className="text-[13px] leading-5 text-ink-soft">
        {checked.length < a.claims.length
          ? `Checked ${checked.length} of ${a.claims.length}.`
          : 'All checked. It sounded equally sure about every part, right and wrong. That’s why every claim that matters gets checked.'}
      </p>
    </div>
  )
}

/** An AI assistant's answer, split into claims the learner checks one by one (Explore lab: value = a question). */
export function FactCheck({ value = 'A history question' }: LabProps) {
  return <Answer key={value} value={value} />
}
