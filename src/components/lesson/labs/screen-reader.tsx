'use client'
import type { LabProps } from './shared'

type Reading = { code: string; says: string[]; landmarks?: string[]; note: string }

const READINGS: [RegExp, Reading][] = [
  [
    /no alt/i,
    {
      code: '<img src="images/IMG_2041.jpg">',
      says: ['“IMG underscore 2041 dot jpg, image”'],
      note: 'With no alt at all, many screen readers read out the file name. That tells a blind visitor nothing about the food.',
    },
  ],
  [
    /file name/i,
    {
      code: '<img src="images/jollof.jpg" alt="jollof.jpg">',
      says: ['“jollof dot jpg, image”'],
      note: 'Better than nothing, but a file name isn’t a description. Say what the picture shows.',
    },
  ],
  [
    /empty|decorative/i,
    {
      code: '<img src="images/divider.png" alt="">',
      says: ['(nothing: the image is skipped)'],
      note: 'An empty alt says the image is decoration, so screen readers skip it. Right for a divider line, wrong for a photo of the food.',
    },
  ],
  [
    /describe/i,
    {
      code: '<img src="images/jollof.jpg"\n     alt="Jollof rice with fried plantain in a clay pot">',
      says: ['“Jollof rice with fried plantain in a clay pot, image”'],
      note: 'Now a blind visitor gets the same information as everyone else. Describe what matters, in a sentence or less, and don’t start with “Image of”: the screen reader already says image.',
    },
  ],
  [
    /only div|divs/i,
    {
      code: '<div class="top">…</div>\n<div class="links">…</div>\n<div class="content">…</div>\n<div class="bottom">…</div>',
      says: ['“No landmarks”'],
      landmarks: [],
      note: 'To a screen reader, divs are just boxes. Its landmarks menu is empty, so the visitor has to listen to the page from the top every time.',
    },
  ],
  [
    /landmark|header/i,
    {
      code: '<header>…</header>\n<nav>…</nav>\n<main>…</main>\n<footer>…</footer>',
      says: ['“Landmarks: banner, navigation, main, content information”'],
      landmarks: ['banner (header)', 'navigation (nav)', 'main (main)', 'content information (footer)'],
      note: 'Each element becomes a landmark. A visitor can jump straight to the menu with one gesture, the way you’d glance at it.',
    },
  ],
]

/**
 * Explore lab: what a screen reader announces. Values cover alt text (no alt, the file name, empty,
 * describes the photo) and page landmarks (only divs, landmarks).
 */
export function ScreenReader({ value = '' }: LabProps) {
  const r = READINGS.find(([re]) => re.test(value))?.[1] ?? READINGS[0]![1]
  return (
    <div className="flex flex-col gap-3">
      <pre
        tabIndex={0}
        className="overflow-x-auto rounded-xl border border-line bg-row p-3 font-mono text-[12px] leading-5 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fe"
      >
        {r.code}
      </pre>
      <section
        aria-label="What the screen reader says"
        className="rounded-xl border border-line bg-[#0d0b16] p-3 text-[#e8e6f0]"
      >
        <h3 className="mb-1 text-[11px] font-semibold text-[#9b97ad]">🔊 The screen reader says</h3>
        {r.says.map((s) => (
          <p key={s} className="text-[14px]">
            {s}
          </p>
        ))}
        {r.landmarks && (
          <>
            <h3 className="mt-3 mb-1 text-[11px] font-semibold text-[#9b97ad]">Landmarks menu</h3>
            {r.landmarks.length ? (
              <ol className="list-inside list-decimal text-[13px]">
                {r.landmarks.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ol>
            ) : (
              <p className="text-[13px] text-[#9b97ad]">Empty</p>
            )}
          </>
        )}
      </section>
      <p aria-live="polite" className="text-[13px] text-ink-muted">
        {r.note}
      </p>
    </div>
  )
}
