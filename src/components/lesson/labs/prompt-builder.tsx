'use client'
import { Bot, User } from 'lucide-react'
import type { LabProps } from './shared'

const STEPS = ['Vague', 'Add context', 'Ask for a format', 'Add an example'] as const

const PROMPTS: Record<(typeof STEPS)[number], { prompt: string; reply: string[]; note: string }> = {
  Vague: {
    prompt: 'Write about my shop.',
    reply: ['Shops are an important part of every community. A good shop offers quality products and friendly service…'],
    note: 'A vague question gets a vague answer. The assistant has to guess who you are and what you need.',
  },
  'Add context': {
    prompt: 'I run a small juice stall at a weekend market. Write a short message telling regular customers we now sell mango juice.',
    reply: ['Great news! Our juice stall now sells fresh mango juice, alongside your favourite orange. Come and try it this weekend!'],
    note: 'Who you are, who it’s for and what it’s for: now the answer fits.',
  },
  'Ask for a format': {
    prompt:
      'I run a small juice stall at a weekend market. Write a message telling regular customers we now sell mango juice. Make it under 30 words, friendly, for WhatsApp, ending with a question.',
    reply: ['New at the stall: fresh mango juice! Same great orange, now with a sweet new friend. Fancy a taste on Saturday?'],
    note: 'Length, tone and where it’s going: the reply is ready to use.',
  },
  'Add an example': {
    prompt:
      'I run a small juice stall at a weekend market. Write three WhatsApp messages, under 30 words, announcing mango juice. Match the style of this one we sent before: “Orange juice, squeezed this morning. Cold, fresh, ready. See you at stall 12!”',
    reply: ['1. Mango juice, blended this morning. Sweet, cold, ready. See you at stall 12!', '2. New: mango juice. Fresh fruit, nothing added. Stall 12, Saturday.', '3. Mango season is here. Cold mango juice at stall 12 this weekend!'],
    note: 'An example of what you like is the strongest clue of all. Three options let you pick, or mix.',
  },
}

/** The same request to an AI assistant, improved one clue at a time (Explore lab: value = a step). */
export function PromptBuilder({ value = 'Vague' }: LabProps) {
  const step = (STEPS as readonly string[]).includes(value) ? (value as (typeof STEPS)[number]) : 'Vague'
  const p = PROMPTS[step]
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${step}. You ask: ${p.prompt} ${p.note}`}>
      <div className="flex flex-col gap-2.5 rounded-2xl border border-line bg-sunken p-3">
        <div className="flex items-start gap-2 self-end">
          <p className="pop-in max-w-[90%] rounded-2xl rounded-tr-md bg-fe px-3 py-2 text-[13px] leading-5 text-white">{p.prompt}</p>
          <User size={18} aria-hidden="true" className="mt-1.5 shrink-0 text-ink-muted" />
        </div>
        <div className="flex items-start gap-2">
          <Bot size={18} aria-hidden="true" className="mt-1.5 shrink-0 text-ai-text" />
          <div className="pop-in flex max-w-[90%] flex-col gap-1 rounded-2xl rounded-tl-md border border-line bg-row px-3 py-2 text-[13px] leading-5 text-ink">
            {p.reply.map((r) => (
              <p key={r}>{r}</p>
            ))}
          </div>
        </div>
      </div>
      <p aria-live="polite" className="text-[13px] leading-5 text-ink-soft">
        {p.note} <span className="text-ink-subtle">(An example reply, written for this lesson.)</span>
      </p>
    </figure>
  )
}
