import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { parsePack } from '@/lib/lessons/schema'
import { SYSTEM_PROMPT, stepContext } from './context'

const pack = parsePack(JSON.parse(readFileSync('content/samples/packs/zz-01-01.json', 'utf8')))
const at = (type: string) => pack.steps.findIndex((s) => s.type === type)

describe('stepContext', () => {
  it('names the lesson and the step, so answers can say where they come from', () => {
    expect(stepContext(pack, 0)).toContain(`Step 1 of ${pack.steps.length}`)
    expect(stepContext(pack, 0)).toContain(pack.title)
  })

  it('marks the correct option for the tutor and says what the learner chose', () => {
    const i = pack.steps.findIndex((s) => 'options' in s)
    const step = pack.steps[i] as { options: { id: string; correct: boolean }[] }
    const wrong = step.options.find((o) => !o.correct)!
    const text = stepContext(pack, i, { selected: wrong.id })
    expect(text).toContain('[correct]')
    expect(text).toContain('The learner currently has chosen')
  })

  it("includes the learner's code on code steps, but only editable files", () => {
    const i = at('code')
    if (i < 0) return
    const step = pack.steps[i] as { files: { name: string; lang: string }[] }
    const text = stepContext(pack, i, {
      files: [{ name: step.files[0]!.name, lang: step.files[0]!.lang, code: 'MY CODE' }, { name: 'evil.js', lang: 'js', code: 'NOT MINE' }],
    })
    expect(text).toContain('Checks the code must pass')
    expect(text).not.toContain('NOT MINE')
  })

  it('outlines the whole lesson, so questions about other steps have an answer', () => {
    const text = stepContext(pack, 0)
    expect(text).toContain("The lesson's steps:")
    for (const [i, s] of pack.steps.entries()) expect(text).toContain(`${i + 1}. ${s.type}:`)
  })

  it('tells the model how to treat messages that are not about the course', () => {
    expect(SYSTEM_PROMPT).toMatch(/unrelated to learning this course/)
    expect(SYSTEM_PROMPT).toMatch(/greeting/)
    expect(SYSTEM_PROMPT).toMatch(/Frustration/)
  })

  it('refuses a step that does not exist', () => {
    expect(() => stepContext(pack, 99)).toThrow(RangeError)
  })
})
