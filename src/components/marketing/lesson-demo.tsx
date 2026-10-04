import { Check, Icon, X } from '@/components/ui/icon'
import { landing } from '@/content/landing'

const { step } = landing.demo

/**
 * A real Predict step from Lesson 6.4, drawn as a static page. The radio buttons drive the preview and
 * the feedback through CSS :has() (see globals.css, .lesson-demo), so it works with no JavaScript.
 */
export function LessonDemo() {
  return (
    <div className="lesson-demo flex flex-col gap-5 rounded-[30px] border border-line p-5 surface ph:p-8">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] text-ink-muted">
          <span className="text-fe-text">Front-End Web Development</span> · Module 6 · Flexbox
        </p>
        <span className="shrink-0 rounded-full bg-fe px-3 py-1 text-xs font-semibold text-white">
          {step.kind}
        </span>
      </div>
      <div aria-hidden="true" className="grid grid-cols-7 gap-1.5">
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <span key={n} className={n <= 2 ? 'h-1 rounded-full bg-fe' : 'h-1 rounded-full bg-line'} />
        ))}
      </div>
      <h3 className="font-display text-[21px] leading-7 font-bold tracking-[-0.02em] text-ink ph:text-2xl">
        {step.question}
      </h3>

      <div className="grid gap-4">
        <pre className="overflow-x-auto rounded-2xl border border-line bg-sunken p-4 font-mono text-[13px] leading-6 text-ink-soft">
          <code>
            {step.code.split('\n').map((line) => (
              <span key={line} className="block whitespace-pre">
                {line.includes('???') ? (
                  <>
                    {line.replace('???;', '')}
                    <span className="rounded bg-fe/25 px-1 text-fe-text">???</span>;
                  </>
                ) : (
                  line
                )}
              </span>
            ))}
          </code>
        </pre>
        <div className="flex flex-col gap-2">
          <p className="text-xs text-ink-subtle">Preview</p>
          <div
            aria-hidden="true"
            className="demo-row flex h-[104px] gap-2 overflow-hidden rounded-2xl border border-line bg-white p-2"
          >
            <span className="rounded-lg bg-[#15122a] px-3 py-2 text-xs font-semibold text-white">Logo</span>
            {['Home', 'Menu', 'Contact'].map((l) => (
              <span key={l} className="rounded-lg bg-[#dfe4ff] px-3 py-2 text-xs font-medium text-[#1f33a8]">
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="sr-only">Choose a value for align-items</legend>
        {step.options.map((option) => (
          <label
            key={option.id}
            className="demo-option flex cursor-pointer items-center gap-4 rounded-2xl border border-line bg-row px-4 py-3"
          >
            <input type="radio" name="lesson-demo" value={option.value} className="sr-only" />
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-sunken text-xs font-bold text-ink">
              {option.letter}
            </span>
            <span className="font-mono text-[15px] text-ink">{option.value}</span>
          </label>
        ))}
      </fieldset>

      <p className="demo-prompt text-sm text-ink-subtle">{step.prompt}</p>
      {step.options.map((option) => {
        const right = option.id === 'center'
        return (
          <p
            key={option.id}
            data-for={option.id}
            className={`demo-feedback items-start gap-2 text-sm leading-[22px] ${right ? 'text-success' : 'text-error'}`}
          >
            <Icon as={right ? Check : X} size={18} className="mt-0.5 shrink-0" />
            {option.feedback}
          </p>
        )
      })}
    </div>
  )
}
