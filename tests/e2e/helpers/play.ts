import { readFileSync } from 'node:fs'
import { expect, type Page } from '@playwright/test'
import { waitForHydration } from '../hydration'

type Step = {
  type: string
  run?: boolean
  options?: { html: string; correct: boolean }[]
  items?: string[]
}
type File = { name: string; code: string }

const text = (html: string) =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .trim()

/**
 * Plays a built lesson from its first step to the end, the way a learner who knows the answers would:
 * the right option, Run It, the correct order and the model solution for code steps.
 */
export async function playWholeLesson(page: Page, packPath = 'content/samples/packs/zz-01-01.json') {
  const pack = JSON.parse(readFileSync(packPath, 'utf8')) as { steps: Step[] }
  const solutions = JSON.parse(readFileSync(packPath.replace('/packs/', '/solutions/'), 'utf8')) as Record<
    string,
    File[]
  >
  const next = page.getByRole('button', { name: /^(Continue|Finish Lesson)$/ })
  await waitForHydration(next)
  for (const [i, step] of pack.steps.entries()) {
    await expect(page.getByText(`Step ${i + 1} of ${pack.steps.length}`)).toBeVisible()
    if (step.options) {
      const right = step.options.find((o) => o.correct)!
      await page.getByRole('radio', { name: text(right.html), exact: true }).check()
      await page.getByRole('button', { name: 'Check My Answer' }).click()
      if (step.type === 'predict' && step.run) await page.getByRole('button', { name: 'Run It' }).click()
    }
    if (step.type === 'order') {
      const items = page.locator('article ol > li')
      const expected = (step.items ?? []).map(text)
      for (let position = 0; position < expected.length; position++) {
        let at = (await items.allInnerTexts()).findIndex((t) => t.includes(expected[position]!))
        while (at > position) {
          await items.nth(at).getByRole('button', { name: 'Move up' }).click()
          at--
        }
      }
      await page.getByRole('button', { name: 'Check the Order' }).click()
    }
    if (step.type === 'code') {
      for (const file of solutions[String(i)] ?? []) {
        await page.getByRole('tab', { name: new RegExp(`^${file.name}`) }).click()
        await page.getByRole('textbox', { name: `Edit ${file.name}` }).fill(file.code)
      }
      await page.getByRole('button', { name: 'Run Tests' }).click()
      await expect(page.getByText('All checks pass.')).toBeVisible({ timeout: 10_000 })
    }
    await expect(next).toBeEnabled()
    await next.click()
  }
}
