import type { Route } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/layout/logo'
import { TutorSpark } from '@/components/learn/tutor-spark'
import { buttonClasses } from '@/components/ui/button'
import { Glyph } from '@/components/ui/glyph'

export type ResultData = {
  firstName: string
  module: number
  score: number
  right: number
  total: number
  summary: string
  next: { label: string; href: Route }
  reviewHref: Route
  skills: { name: string; right: number; of: number; map: string }[]
  missed: { where: string; said: React.ReactNode; why: string }[]
  calibration: { label: string; value: string }[]
  calibrationNote: string
  mastered: number
  modules: number
  project: { title: string; note: string; href: Route }
  homeHref: Route
}

const card = 'surface flex flex-col gap-4 rounded-3xl border border-line p-6'

/** PrismModuleResult: the score ring, skill by skill, the questions worth another look. */
export function ResultView({ data }: { data: ResultData }) {
  const length = 2 * Math.PI * 84
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[360px] left-1/2 h-[900px] w-[1400px] -translate-x-1/2 opacity-(--pc-glow-opacity)"
        style={{
          background:
            'radial-gradient(closest-side at 35% 50%, rgba(77,107,255,0.34), rgba(77,107,255,0) 72%), radial-gradient(closest-side at 65% 45%, rgba(123,92,255,0.28), rgba(123,92,255,0) 72%), radial-gradient(closest-side at 50% 80%, rgba(240,64,127,0.16), rgba(240,64,127,0) 72%)',
        }}
      />
      <header className="relative border-b border-line-subtle">
        <div className="mx-auto flex h-[72px] max-w-[1100px] items-center justify-between gap-4 px-4 ph:px-6">
          <Logo href={data.homeHref} compact />
          <Link href={data.homeHref} className="text-sm text-ink-muted underline underline-offset-2 hover:text-ink">
            Back to Home
          </Link>
        </div>
      </header>
      <main id="main" className="relative mx-auto box-border flex max-w-[1100px] flex-col gap-12 px-4 pt-10 pb-16 ph:px-6 ph:pt-14 ph:pb-20">
        <section aria-labelledby="result-title" className="grid grid-cols-1 items-center gap-12 tab:grid-cols-[260px_minmax(0,1fr)]">
          <div className="relative mx-auto size-[240px] ph:size-[260px]">
            <svg viewBox="0 0 200 200" aria-hidden="true" className="size-full -rotate-90">
              <defs>
                <linearGradient id="score-ring" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#4D6BFF" />
                  <stop offset="0.55" stopColor="#7B5CFF" />
                  <stop offset="1" stopColor="#F0407F" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="84" fill="none" stroke="var(--pc-line-subtle)" strokeWidth="18" />
              <circle cx="100" cy="100" r="84" fill="none" stroke="url(#score-ring)" strokeWidth="18" strokeLinecap="round" strokeDasharray={`${(data.score / 100) * length} ${length}`} />
            </svg>
            <p className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-[56px] leading-[56px] font-extrabold tracking-[-0.04em] text-ink ph:text-[64px] ph:leading-[64px]">{data.score}%</span>
              <span className="text-sm text-ink-muted">
                {data.right} of {data.total} right
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <p className="inline-flex items-center gap-2 self-start rounded-full bg-success-fill px-4 py-1.5 text-[13px] font-bold text-on-success">
              <Glyph name="check" size={15} strokeWidth={2.6} />
              Passed
            </p>
            <h1 id="result-title" className="font-display text-[34px] leading-10 font-extrabold tracking-[-0.04em] text-ink ph:text-[52px] ph:leading-[56px]">
              Module {data.module} is yours, {data.firstName}.
            </h1>
            <p className="max-w-[560px] text-[17px] leading-7 text-ink-soft">{data.summary}</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link href={data.next.href} className={buttonClasses({}, 'h-[54px] gap-3 px-6')}>
                {data.next.label}
                <Glyph name="arrowRight" size={18} />
              </Link>
              <Link href={data.reviewHref} className={buttonClasses({ variant: 'secondary' }, 'h-[54px] bg-transparent px-6 font-medium')}>
                Review My Answers
              </Link>
            </div>
          </div>
        </section>

        <section aria-labelledby="skills-title" className="flex flex-col gap-4">
          <h2 id="skills-title" className="font-display text-[26px] font-extrabold tracking-[-0.02em] text-ink">
            How you did, skill by skill
          </h2>
          <div className="grid grid-cols-1 gap-4 tab:grid-cols-3">
            {data.skills.map((s) => (
              <div key={s.name} className="surface flex flex-col gap-3 rounded-[22px] border border-line p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-lg font-bold text-ink">{s.name}</h3>
                  <span className="text-[15px] font-semibold text-ink">
                    {s.right} of {s.of}
                  </span>
                </div>
                <div aria-hidden="true" className="flex gap-1">
                  {Array.from({ length: s.of }, (_, k) => (
                    <span key={k} className="block h-2 flex-1 rounded" style={{ background: k < s.right ? '#3D5AF5' : 'var(--pc-meter)' }} />
                  ))}
                </div>
                <p className="text-xs text-ink-subtle">{s.map}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 items-start gap-6 tab:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <section aria-labelledby="missed-title" className="flex flex-col gap-4">
            <h2 id="missed-title" className="font-display text-[26px] font-extrabold tracking-[-0.02em] text-ink">
              {data.missed.length === 1 ? 'One worth another look' : `${['Two', 'Three', 'Four'][data.missed.length - 2] ?? data.missed.length} worth another look`}
            </h2>
            <ul className="flex flex-col gap-3">
              {data.missed.map((m) => (
                <li key={m.where} className="flex flex-col gap-3 rounded-[20px] border border-line bg-row px-5 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[13px] text-fe-text">{m.where}</p>
                    <p className="flex items-center gap-1.5 text-xs text-success">
                      <Glyph name="review" size={14} />
                      In your review tomorrow
                    </p>
                  </div>
                  <p className="text-[15px] leading-[23px] text-ink">{m.said}</p>
                  <p className="text-sm leading-[22px] text-ink-muted">{m.why}</p>
                </li>
              ))}
            </ul>
            <Link href={data.reviewHref} className="press inline-flex h-11 items-center gap-2 self-start rounded-full border border-line-control pr-4 pl-1.5 text-sm font-medium text-ink hover:bg-hover">
              <TutorSpark size={32} />
              Talk these through with the AI tutor
            </Link>
          </section>
          <div className="flex flex-col gap-4">
            <section aria-labelledby="calibration-title" className={card}>
              <h2 id="calibration-title" className="font-display text-lg font-bold text-ink">
                How well you knew what you knew
              </h2>
              <ul className="flex flex-col gap-3 text-sm">
                {data.calibration.map((c) => (
                  <li key={c.label} className="flex justify-between gap-3">
                    <span className="text-ink-soft">{c.label}</span>
                    <span className="text-ink">{c.value}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[13px] leading-5 text-ink-muted">{data.calibrationNote}</p>
            </section>
            <section
              aria-labelledby="next-title"
              className="flex flex-col gap-4 rounded-3xl border border-line p-6"
              style={{ background: 'linear-gradient(150deg, rgba(61,90,245,0.22), var(--pc-sheet) 70%)' }}
            >
              <h2 id="next-title" className="font-display text-lg font-bold text-ink">
                Toward your certificate
              </h2>
              <div aria-hidden="true" className="flex gap-1">
                {Array.from({ length: data.modules }, (_, k) => (
                  <span key={k} className="block h-2 flex-1 rounded" style={{ background: k < data.mastered ? '#3D5AF5' : 'var(--pc-meter)' }} />
                ))}
              </div>
              <p className="text-sm text-ink-soft">
                {data.mastered} of {data.modules} modules mastered
              </p>
              <Link href={data.project.href} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-row px-4 py-3 text-sm transition-colors hover:border-line-strong">
                <span>
                  <span className="block font-semibold text-ink">{data.project.title}</span>
                  <span className="block text-xs text-error">{data.project.note}</span>
                </span>
                <Glyph name="chevronRight" size={16} className="text-ink-subtle" />
              </Link>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
