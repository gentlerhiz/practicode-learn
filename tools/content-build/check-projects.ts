// Runs every project's checks in a real browser (Playwright's Chromium), the way the project workspace
// runs them for learners:
//   - the model solution passes every check: the brief's own, then accessibility (axe) and every screen
//     size for a page, or running without an error for a program (Python or SQL)
//   - the starter fails at least one of the brief's checks, or there's nothing to do
// Usage: node tools/content-build/check-projects.ts --packs <dir>   (solutions: <dir>/../project-solutions)
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { parseArgs } from 'node:util'
import { chromium } from '@playwright/test'
import type { LessonTest } from '../../src/lib/lessons/schema.ts'
import {
  accessibilityCheck,
  isProgram,
  runsCheck,
  SCREENS,
  screenCheck,
  type CheckResult,
} from '../../src/lib/projects/checks.ts'
import { parseProjectPack, type ProjectFile } from '../../src/lib/projects/schema.ts'
import { buildDocument, mergeFiles } from '../../src/lib/runner/build-document.ts'
import { ENGINE_TIMEOUT_MS } from '../../src/lib/runner/engines.ts'

const { values } = parseArgs({ options: { packs: { type: 'string' } } })
if (!values.packs) {
  console.error('Usage: node tools/content-build/check-projects.ts --packs <dir>')
  process.exit(2)
}
const packsDir = path.resolve(values.packs)
const solutionsDir = path.join(packsDir, '..', 'project-solutions')
const axe = fs.readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8')

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
const pageErrors: string[] = []
page.on('pageerror', (e) => pageErrors.push(e.message))

async function run(files: ProjectFile[], tests: LessonTest[], width: number, height = 800, helpers?: string) {
  // Python and SQL start an engine first, which can take a while on the first run.
  const timeout = isProgram(files) ? ENGINE_TIMEOUT_MS : 20000
  await page.setViewportSize({ width, height })
  await page.goto('about:blank')
  pageErrors.length = 0
  await page.setContent(buildDocument(files, { tests, helpers }), { waitUntil: 'load' })
  return page
    .waitForFunction(() => (window as unknown as { __pclResults?: CheckResult[] }).__pclResults, null, {
      timeout,
    })
    .then((h) => h.jsonValue() as Promise<CheckResult[]>)
    .catch(() => null)
}

const problems: string[] = []
let checked = 0
const packs = fs.existsSync(packsDir)
  ? fs
      .readdirSync(packsDir)
      .filter((n) => n.endsWith('.json'))
      .sort()
  : []
for (const f of packs) {
  const pack = parseProjectPack(JSON.parse(fs.readFileSync(path.join(packsDir, f), 'utf8')))
  const solution: ProjectFile[] = JSON.parse(fs.readFileSync(path.join(solutionsDir, f), 'utf8'))
  const solved = mergeFiles(pack.files, solution)
  const report = (label: string, results: CheckResult[] | null) => {
    if (!results) problems.push(`${pack.id}: ${label}: the checks didn't finish. ${pageErrors.join(' ')}`)
    else
      for (const r of results.filter((x) => !x.pass))
        problems.push(`${pack.id}: ${label} fails "${r.name}": ${r.message}`)
  }
  if (isProgram(pack.files)) {
    report('the solution', await run(solved, [...pack.checks, runsCheck], 1280))
    checked++
  } else {
    for (const width of [360, 1280]) {
      report(`the solution at ${width}px`, await run(solved, pack.checks, width))
      checked++
    }
    report('the solution', await run(solved, [accessibilityCheck], 1280, 800, axe))
    checked++
    for (const screen of SCREENS) {
      report('the solution', await run(solved, [screenCheck(screen)], screen.width, screen.height))
      checked++
    }
  }
  const starter = await run(pack.files, pack.checks, 1280)
  if (starter && starter.every((x) => x.pass))
    problems.push(`${pack.id}: the starter already passes every check.`)
  checked++
}
await browser.close()
if (problems.length) {
  console.error(`${problems.length} problem${problems.length > 1 ? 's' : ''}:\n  ${problems.join('\n  ')}`)
  process.exit(1)
}
console.log(
  `✓ Project checks passed (${packs.length} project${packs.length === 1 ? '' : 's'}, ${checked} runs).`,
)
