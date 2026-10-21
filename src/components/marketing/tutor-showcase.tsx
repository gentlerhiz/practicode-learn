'use client'

import { ArrowUp, Check } from 'lucide-react'
import { useState } from 'react'
import { TutorSpark } from '@/components/learn/tutor-spark'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Section } from '@/components/ui/section'

const POINTS = [
  'Explains the exercise you’re on in plain English',
  'Gives hints first, so you still do the thinking',
  'Points to the line or step that’s most likely causing trouble',
  '5 questions a day on Free, 50 on Pro',
]

const learner = 'max-w-[82%] self-end rounded-[18px_18px_6px_18px] bg-divider px-4 py-3 text-sm leading-[22px] text-ink'
const tutor = 'rounded-[6px_18px_18px_18px] border border-line bg-control px-4 py-3 text-sm leading-[22px] text-ink-soft'
const mono = 'font-mono'

function Line({ n, children, flagged }: { n: number; children: React.ReactNode; flagged?: boolean }) {
  return (
    <div
      className={flagged ? 'flex bg-[rgba(255,138,61,0.12)] px-4 whitespace-pre shadow-[inset_3px_0_0_#ff8a3d]' : 'flex px-4 whitespace-pre'}
    >
      <span aria-hidden="true" className={flagged ? 'w-6 shrink-0 text-[#ff8a3d]' : 'w-6 shrink-0 text-code-gutter'}>{n}</span>
      <span>{children}</span>
    </div>
  )
}

/** "Stuck? Ask your tutor." (anchor #tutor): the tutor beside a lesson, giving hints before answers. */
export function TutorShowcase() {
  const [more, setMore] = useState(false)
  const p = (s: string) => <span className="text-ink-subtle">{s}</span>
  const fn = (s: string) => <span className="text-fe-text">{s}</span>
  return (
    <Section id="tutor" labelledBy="tutor-title">
      <Container className="grid items-center gap-8 ph:gap-10 tab:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] tab:gap-16">
        <div className="flex flex-col gap-6">
          <p className="inline-flex items-center gap-2 self-start rounded-full border border-line bg-wash py-1.5 pr-4 pl-2 text-[13px] font-semibold text-ink">
            <TutorSpark size={22} />
            AI tutor
          </p>
          <Heading level={2} id="tutor-title">
            Stuck? Ask your tutor. It’s right there in the lesson.
          </Heading>
          <p className="text-[17px] leading-7 text-ink-muted">
            It knows which lesson you’re on and can see the work in front of you, so its answers are about{' '}
            <span className="text-ink">your</span> problem, not the internet in general.
          </p>
          <ul className="flex flex-col gap-4 text-base leading-6 text-ink">
            {POINTS.map((point) => (
              <li key={point} className="flex gap-3">
                <Check aria-hidden="true" size={22} strokeWidth={1.85} className="shrink-0 text-ai-text" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <p className="text-[13px] leading-[21px] text-ink-subtle">
            Like any AI, it can get things wrong, so every answer links back to the part of the lesson it’s based on.
          </p>
        </div>

        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-[70px] opacity-(--pc-glow-opacity)"
            style={{
              background:
                'radial-gradient(closest-side at 30% 35%, rgba(123,92,255,0.30), rgba(123,92,255,0) 75%), radial-gradient(closest-side at 75% 75%, rgba(240,64,127,0.18), rgba(240,64,127,0) 75%)',
            }}
          />
          <div className="relative rounded-[29px] bg-[linear-gradient(160deg,#4d6bff_0%,#7b5cff_45%,#f0407f_100%)] p-[1.5px]">
            <div className="surface flex flex-col gap-4 rounded-[28px] p-5 ph:p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[13px] text-ink-muted">
                  <span className="text-fe-text">Python Programming</span> · Module 1 · Strings and f-strings
                </p>
                <p className="hidden text-xs text-ink-subtle ph:block">main.py</p>
              </div>
              <div
                role="img"
                aria-label="main.py: line 3 joins the text Total: to price times quantity, a number, with a plus sign, and Python stops with a TypeError."
                className="overflow-hidden rounded-[14px] border border-divider bg-sunken py-3 font-mono text-[11.5px] leading-[22px] text-ink ph:text-[13px] ph:leading-6"
              >
                <Line n={1}>
                  price {p('=')} 2.5
                </Line>
                <Line n={2}>
                  quantity {p('=')} 4
                </Line>
                <Line n={3} flagged>
                  {fn('print')}
                  {p('(')}
                  <span className="text-da-text">&quot;Total: &quot;</span> {p('+')} price {p('*')} quantity{p(')')}
                </Line>
                <Line n={4}>
                  <span className="text-ink-subtle"># TypeError: can only concatenate str (not &quot;float&quot;) to str</span>
                </Line>
              </div>
              <div aria-live="polite" className="flex flex-col gap-3">
                <p className={learner}>Why do I get a TypeError? The maths is right.</p>
                <div className="flex max-w-[92%] items-start gap-3">
                  <TutorSpark size={28} />
                  <p className={tutor}>
                    The maths is fine. Read the error’s last line, then look at{' '}
                    <span className={`${mono} text-[#ff8a3d]`}>line 3</span>. What kind of value is price * quantity, and
                    what kind is “Total: ”? Can + join those two?
                  </p>
                </div>
                {more && (
                  <>
                    <p className={learner}>Oh. One is text and one is a number?</p>
                    <div className="flex max-w-[92%] items-start gap-3">
                      <TutorSpark size={28} />
                      <p className={tutor}>
                        Exactly. + can join two strings, but not a string and a number. Put the sum inside an f-string:{' '}
                        <span className={`${mono} text-da-text`}>{'f"Total: {price * quantity}"'}</span>. Run it again.
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setMore(true)}
                  className="press h-9 cursor-pointer rounded-full border border-line-control px-4 text-[13px] text-ink hover:border-line-strong hover:bg-hover"
                >
                  {more ? 'Show me the fixed code' : 'Give me another hint'}
                </button>
                <span className="inline-flex h-9 items-center rounded-full border border-line-control px-4 text-[13px] text-ink-muted">
                  Explain f-strings
                </span>
              </div>
              <div aria-hidden="true" className="flex items-center gap-3 rounded-full border border-line bg-sunken py-1.5 pr-1.5 pl-4">
                <span className="flex-1 truncate text-sm text-ink-subtle">Ask about this lesson…</span>
                <span className="hidden text-xs whitespace-nowrap text-ink-subtle ph:inline">
                  {more ? '3 of 5 left today' : '4 of 5 left today'}
                </span>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
                  <ArrowUp size={17} strokeWidth={1.85} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
