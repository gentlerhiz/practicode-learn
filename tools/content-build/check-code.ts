// Runs every code step in a real browser (Playwright's Chromium, headless) at phone and laptop widths:
//   - the model solution must pass every test
//   - the starter code must fail at least one test, or the task is already done
// It also renders every runnable example and every Explore value, and fails on any page error. It uses
// the same document builder as the lesson player, so a test that passes here passes for learners.
// Usage: node tools/content-build/check-code.ts --packs <dir>   (solutions are read from <dir>/../solutions)
import fs from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'
import { chromium } from '@playwright/test'
import { parsePack, type LessonFile } from '../../src/lib/lessons/schema.ts'
import { buildDocument, mergeFiles } from '../../src/lib/runner/build-document.ts'

type TestResult = { name: string; pass: boolean; message?: string }

const WIDTHS = [360, 960]
const { values } = parseArgs({ options: { packs: { type: 'string' } } })
if (!values.packs) {
  console.error('Usage: node tools/content-build/check-code.ts --packs <dir>')
  process.exit(2)
}
const packsDir = path.resolve(values.packs)
const solutionsDir = path.join(packsDir, '..', 'solutions')

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
const pageErrors: string[] = []
page.on('pageerror', (e) => pageErrors.push(e.message))

async function run(doc: string, width: number): Promise<TestResult[] | null> {
  await page.setViewportSize({ width, height: 800 })
  await page.goto('about:blank') // setContent reuses the window, so start fresh or old results leak through
  pageErrors.length = 0
  await page.setContent(doc, { waitUntil: 'load' })
  return page
    .waitForFunction(() => (window as unknown as { __pclResults?: TestResult[] }).__pclResults, null, {
      timeout: 5000,
    })
    .then((h) => h.jsonValue() as Promise<TestResult[]>)
    .catch(() => null)
}

const problems: string[] = []
let checked = 0
for (const f of fs
  .readdirSync(packsDir)
  .filter((n) => n.endsWith('.json'))
  .sort()) {
  const pack = parsePack(JSON.parse(fs.readFileSync(path.join(packsDir, f), 'utf8')))
  const solutions: Record<string, LessonFile[]> = JSON.parse(
    fs.readFileSync(path.join(solutionsDir, f), 'utf8'),
  )
  for (const [i, step] of pack.steps.entries()) {
    const where = `${pack.id} step ${i + 1} (${step.type})`
    if (step.type === 'code') {
      for (const width of WIDTHS) {
        const solved = await run(
          buildDocument(mergeFiles(step.files, solutions[i]), { tests: step.tests }),
          width,
        )
        if (!solved) {
          problems.push(`${where} @${width}px: the solution's tests didn't finish. ${pageErrors.join(' ')}`)
        } else {
          for (const r of solved.filter((x) => !x.pass)) {
            problems.push(`${where} @${width}px: the solution fails "${r.name}": ${r.message}`)
          }
        }
        const starter = await run(buildDocument(step.files, { tests: step.tests }), width)
        if (starter && starter.every((x) => x.pass)) {
          problems.push(`${where} @${width}px: the starter code already passes every test.`)
        }
        checked++
      }
      continue
    }
    if (step.type !== 'predict' && step.type !== 'question' && step.type !== 'explore') continue
    if (!step.files) continue
    let tries: (string | null)[] = []
    if (step.type === 'explore') tries = step.lab ? [null] : step.values
    else if (step.live) tries = step.options.map((o) => o.value ?? null)
    else if (step.run) tries = [null]
    for (const value of tries) {
      await run(buildDocument(step.files, { value }), 360)
      if (pageErrors.length) {
        problems.push(`${where}${value ? ` value ${value}` : ''}: page error: ${pageErrors.join(' ')}`)
      }
      checked++
    }
  }
}
await browser.close()
if (problems.length) {
  console.error(`${problems.length} problem${problems.length > 1 ? 's' : ''}:\n  ${problems.join('\n  ')}`)
  process.exit(1)
}
console.log(`✓ Code checks passed (${checked} runs).`)
