import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { parsePack, type LessonPack } from '@/lib/lessons/schema'
import { blockParas, buildNotes, inlineRuns } from './content'
import { layoutNotes, PAGE, wrapRuns, type Measure } from './layout'

const sample = parsePack(JSON.parse(readFileSync('content/samples/packs/zz-01-01.json', 'utf8')))

// Every character half as wide as the font size: close enough to real fonts to test the flow.
const measure: Measure = (text, _font, size) => text.length * size * 0.5

/** A pack built on the sample, with its own recap and code. */
function pack(lesson: number, extra: Partial<LessonPack> = {}): LessonPack {
  return { ...sample, id: `zz-01-0${lesson}`, lesson, title: `Lesson ${lesson}`, ...extra }
}
const recap = (points: string[], cards = [{ front: 'Q?', back: 'A.' }]) =>
  ({ type: 'recap', stage: 'recap', points, cards }) as const
const explain = (body: string) => ({ type: 'explain', stage: 'hook', body }) as const

describe('inlineRuns', () => {
  it('keeps code and bold apart, decodes entities and trims the ends', () => {
    expect(inlineRuns(' Use <code>&#x26;&#x26;</code> for <strong>and</strong>. ')).toEqual([
      { text: 'Use ' },
      { text: '&&', code: true },
      { text: ' for ' },
      { text: 'and', bold: true },
      { text: '.' },
    ])
  })

  it('keeps a stray < as text', () => {
    expect(inlineRuns('2 < 3')).toEqual([{ text: '2 < 3' }])
  })
})

describe('blockParas', () => {
  it('makes a paragraph of each block and leaves code blocks out', () => {
    const paras = blockParas(
      '<p>One</p><pre><code>x = 1</code></pre><ul><li>Two</li><li><code>three</code></li></ul>',
    )
    expect(paras).toEqual([[{ text: 'One' }], [{ text: 'Two' }], [{ text: 'three', code: true }]])
  })
})

describe('buildNotes', () => {
  const syllabus = { number: 1, title: 'Basics', summary: 'From zero.', project: 'A calculator' }

  it('takes recap points, cards and the code each lesson showed, in lesson order', () => {
    const long = Array.from({ length: 30 }, (_, i) => `line ${i}`).join('\n')
    const notes = buildNotes({
      course: 'Course',
      module: syllabus,
      packs: [
        pack(2, { steps: [recap(['<code>b</code> two', 'Second'])] }),
        pack(1, {
          steps: [
            explain('<p>Hi</p><pre><code class="language-js">let a = 1\n</code></pre>'),
            explain(`<pre><code class="language-js">${long}</code></pre>`),
            explain('<pre><code class="language-js">let a = 1</code></pre>'),
            {
              type: 'predict',
              stage: 'predict',
              run: true,
              files: [{ name: 'main.js', lang: 'js', code: 'console.log(a &lt; 2)' }],
              options: [
                { id: 'a', html: 'true', correct: true, feedback: 'Yes.' },
                { id: 'b', html: 'false', correct: false, feedback: 'No.' },
              ],
              hints: ['1', '2', '3'],
            },
            recap(['First', 'Then'], [{ front: 'Is <code>=</code> a compare?', back: 'No.' }]),
          ],
        }),
      ],
    })
    expect(notes.lessons.map((l) => l.number)).toEqual(['1.1', '1.2'])
    const [one] = notes.lessons
    // The 30-line block is too long for paper, and the repeat is dropped. File code is taken as written.
    expect(one!.code).toEqual([
      { label: 'JavaScript', code: 'let a = 1' },
      { label: 'main.js', code: 'console.log(a &lt; 2)' },
    ])
    expect(one!.points).toEqual([[{ text: 'First' }], [{ text: 'Then' }]])
    expect(one!.cards[0]!.front).toEqual([
      { text: 'Is ' },
      { text: '=', code: true },
      { text: ' a compare?' },
    ])
    expect(notes.projectLine).toBe('A calculator')
    expect(notes.project).toBeNull()
  })
})

describe('wrapRuns', () => {
  it('wraps at the width and breaks a word too long for any line', () => {
    const lines = wrapRuns(
      [{ text: `short words then ${'x'.repeat(60)}` }],
      { size: 10, lead: 14, color: '#000' },
      100,
      measure,
    )
    for (const line of lines) expect(line.width).toBeLessThanOrEqual(100)
    const text = lines.map((l) => l.pieces.map((p) => p.text).join('')).join('|')
    expect(text).toMatch(/^short words then(\|x+){2,}$/)
    expect(text.replace(/[^x]/g, '')).toHaveLength(60)
  })
})

describe('layoutNotes', () => {
  const notes = buildNotes({
    course: 'Course',
    module: { number: 3, title: 'A module', summary: 'Summary.' },
    packs: Array.from({ length: 6 }, (_, i) =>
      pack(i + 1, {
        module: 3,
        steps: [
          explain(
            `<pre><code class="language-js">${Array.from({ length: 20 }, (_, n) => `const v${n} = ${n}`).join('\n')}</code></pre>`,
          ),
          recap(
            [
              'A point that goes on for a while, so that it wraps over more than one line of the page.',
              'Short',
            ],
            Array.from({ length: 4 }, (_, n) => ({ front: `Question ${n}?`, back: `Answer ${n}.` })),
          ),
        ],
      }),
    ),
  })
  const pages = layoutNotes(notes, measure)

  it('starts the lessons on page 2 and numbers every page', () => {
    expect(pages.length).toBeGreaterThan(2)
    pages.forEach((page, i) => {
      expect(page.some((s) => s.kind === 'text' && s.text === `${i + 1} of ${pages.length}`)).toBe(true)
    })
    expect(pages[1]!.some((s) => s.kind === 'text' && /^Lesson 3\.1 · \d+ min$/.test(s.text))).toBe(true)
  })

  it('keeps everything inside the margins and above the footer', () => {
    for (const page of pages) {
      for (const s of page) {
        if (s.kind !== 'text') continue
        expect(s.x).toBeGreaterThanOrEqual(49)
        expect(s.x + measure(s.text, s.font, s.size)).toBeLessThanOrEqual(PAGE.width - 49)
        expect(s.y).toBeLessThanOrEqual(PAGE.height - 30)
      }
      const body = page.filter((s) => s.kind === 'rect' && s.h > 1)
      for (const r of body) if (r.kind === 'rect') expect(r.y + r.h).toBeLessThanOrEqual(PAGE.height - 62)
    }
  })
})
