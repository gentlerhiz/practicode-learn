'use client'
import { Bot, Cog } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

const THINGS: Record<string, { ai: boolean; how: string }> = {
  'A calculator': { ai: false, how: 'Fixed rules, written by a person: 2 + 2 is always 4. It never learns anything.' },
  'A spam filter': { ai: true, how: 'It learned what spam looks like from millions of emails people marked as spam, and keeps learning.' },
  'Face unlock': { ai: true, how: 'A model trained on many faces learned to recognise yours, from any angle, in any light.' },
  'An alarm clock': { ai: false, how: 'A timer: it rings at the time you set. No learning, no guessing.' },
  'A chat assistant': { ai: true, how: 'A large language model, trained on huge amounts of text, predicts a likely reply, word by word.' },
  'Film suggestions': { ai: true, how: 'It learned from what millions of people watched what you might like next.' },
}

/** Everyday tools, sorted into AI (learns from examples) and ordinary programs (follow fixed rules). */
export function AiOrNot({ value = 'A calculator' }: LabProps) {
  const name = THINGS[value] ? value : 'A calculator'
  const t = THINGS[name]!
  const Icon = t.ai ? Bot : Cog
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${name}: ${t.ai ? 'AI' : 'not AI'}. ${t.how}`}>
      <div className={cn('flex items-center gap-3 rounded-2xl border-[1.5px] px-4 py-3', t.ai ? 'border-ai bg-row' : 'border-line bg-row')}>
        <span className={cn('grid size-12 shrink-0 place-items-center rounded-xl', t.ai ? 'bg-ai text-white' : 'bg-sheet text-ink-muted')}>
          <Icon size={24} aria-hidden="true" />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="font-display text-lg font-bold text-ink">{name}</span>
          <span className={cn('text-[13px] font-semibold', t.ai ? 'text-ai-text' : 'text-ink-muted')}>{t.ai ? 'AI: learned from examples' : 'Not AI: follows fixed rules'}</span>
        </span>
      </div>
      <p aria-live="polite" className="text-[13px] leading-5 text-ink-soft">
        {t.how}
      </p>
      <div className="grid grid-cols-2 gap-2 text-[12px] leading-[18px]">
        <div className="rounded-xl border border-line p-2.5">
          <p className="font-semibold text-ink">Ordinary program</p>
          <p className="text-ink-muted">A person writes every rule. Same input, same answer, every time.</p>
        </div>
        <div className="rounded-xl border border-line p-2.5">
          <p className="font-semibold text-ink">AI</p>
          <p className="text-ink-muted">It learns patterns from examples, then guesses. Usually right, sometimes wrong.</p>
        </div>
      </div>
    </figure>
  )
}
