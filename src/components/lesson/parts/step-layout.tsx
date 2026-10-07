import { cn } from '@/lib/cn'
import { Prose } from './prose'

/**
 * The canvas's lesson step: the question and answers on the left, the drawing, code or preview on the
 * right. On phones they stack, with the visual straight after the controls it answers to (`top`), and
 * anything that checks the learner (`bottom`) after it, as the canvas orders each step.
 */
export function StepGrid({ top, aside, bottom }: { top: React.ReactNode; aside?: React.ReactNode; bottom?: React.ReactNode }) {
  if (!aside) {
    return (
      <div className="mx-auto flex w-full max-w-[720px] flex-col gap-6">
        {top}
        {bottom}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 items-start gap-6 [grid-template-areas:'top'_'aside'_'bottom'] tab:grid-cols-2 tab:grid-rows-[auto_1fr] tab:gap-x-10 tab:[grid-template-areas:'top_aside'_'bottom_aside']">
      <div className="flex max-w-[600px] min-w-0 flex-col gap-6 [grid-area:top]">{top}</div>
      <div className="min-w-0 [grid-area:aside]">{aside}</div>
      {bottom && <div className="flex max-w-[600px] min-w-0 flex-col gap-6 [grid-area:bottom]">{bottom}</div>}
    </div>
  )
}

const STAGE: Record<string, string> = {
  hook: 'Start here',
  predict: 'Predict',
  run: 'Run',
  investigate: 'Investigate',
  modify: 'Modify',
  make: 'Make',
  apply: 'Apply',
  recap: 'Recap',
}
// The canvas numbers the five doing stages (PRIMM): 1 · Predict … 5 · Make.
const NUMBER: Record<string, number> = { predict: 1, run: 2, investigate: 3, modify: 4, make: 5 }

export const stageName = (stage: string) => STAGE[stage] ?? stage

/** Splits off the first paragraph when it's a short question, so it can be the step's headline. */
export function splitLead(html: string): { lead: string | null; rest: string } {
  const match = /^\s*<p>([\s\S]*?)<\/p>([\s\S]*)$/.exec(html)
  if (!match) return { lead: null, rest: html }
  const text = match[1]!.replace(/<[^>]+>/g, '')
  return text.length <= 170 ? { lead: match[1]!, rest: match[2]!.trim() } : { lead: null, rest: html }
}

/** The stage chip, the step's question as a large headline, and the rest of its text. */
export function StepHeading({ stage, body }: { stage: string; body?: string }) {
  const { lead, rest } = splitLead(body ?? '')
  const n = NUMBER[stage]
  return (
    <>
      <p className="self-start rounded-full border border-[rgba(77,107,255,0.45)] bg-[rgba(77,107,255,0.16)] px-3 py-1 text-xs font-semibold text-fe-text">
        {n ? `${n} · ${stageName(stage)}` : stageName(stage)}
      </p>
      {lead && (
        <h2
          className="font-display text-[28px] leading-[34px] font-extrabold tracking-[-0.035em] text-ink ph:text-[40px] ph:leading-[44px] [&_code]:rounded-lg [&_code]:bg-control [&_code]:px-2 [&_code]:font-mono [&_code]:text-[0.75em] [&_code]:font-semibold"
          dangerouslySetInnerHTML={{ __html: lead }}
        />
      )}
      {rest && <Prose html={rest} className={cn('text-[17px] leading-7 ph:text-lg ph:leading-[30px]', lead ? 'text-ink-soft' : 'text-ink')} />}
    </>
  )
}

/** The right-hand card that holds a drawing, or code and its preview. */
export function VisualCard({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <section aria-label={label} className={cn('surface overflow-hidden rounded-[28px] border border-line', className)}>
      {children}
    </section>
  )
}
