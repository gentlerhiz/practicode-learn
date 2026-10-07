import type { Metadata, Route } from 'next'
import { AuthFrame, HeaderPrompt } from '@/components/auth/auth-frame'
import { ScholarshipForm } from '@/components/marketing/scholarship-form'
import { metaFor } from '@/lib/seo/pages'

export const metadata: Metadata = metaFor('/scholarship' as Route)

const STEPS = [
  ['Apply in about five minutes', 'No documents and no essays. Just tell us honestly what’s going on.'],
  ['We read every application', 'A person decides, not a computer. We reply within 10 working days.'],
  ['Learn for free', 'If you qualify, Pro switches on straight away. Keep learning and it stays on.'],
]

/** PrismScholarship. */
export default function ScholarshipPage() {
  return (
    <AuthFrame aside={<HeaderPrompt href={'/pricing' as Route} label="See plans" />}>
      <main
        id="main"
        className="relative mx-auto box-border grid max-w-[1200px] grid-cols-1 items-start gap-10 px-4 pt-8 pb-12 ph:px-6 ph:pt-12 ph:pb-20 tab:grid-cols-[minmax(0,1fr)_minmax(0,560px)] tab:gap-16"
      >
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <p className="text-[15px] font-semibold text-ai-text">Scholarships</p>
            <h1 className="font-display text-[30px] leading-9 font-extrabold tracking-[-0.035em] text-ink ph:text-[46px] ph:leading-[50px]">
              Money shouldn’t decide who gets to learn
            </h1>
            <p className="text-[17px] leading-7 text-ink-muted">If paying for Pro is hard right now, apply here. If you qualify, Pro is free for 12 months.</p>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-xl font-bold text-ink">How it works</h2>
            <ol className="flex flex-col gap-4">
              {STEPS.map(([title, body], i) => (
                <li key={title} className="flex items-start gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-primary font-bold text-on-primary">{i + 1}</span>
                  <span>
                    <span className="block text-[15px] font-semibold text-ink">{title}</span>
                    <span className="mt-1 block text-sm leading-[22px] text-ink-muted">{body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <p className="text-sm leading-[22px] text-ink-subtle">
            Scholarships are paid for by sponsors and by learners on Pro, so there are a limited number each month. If we can’t offer one
            now, we’ll keep your application for next month. Pro launches with the full track; applications sent before then are read
            first.
          </p>
        </section>
        <div className="surface flex flex-col gap-6 rounded-[28px] border border-line p-6 ph:p-8">
          <ScholarshipForm />
        </div>
      </main>
    </AuthFrame>
  )
}
