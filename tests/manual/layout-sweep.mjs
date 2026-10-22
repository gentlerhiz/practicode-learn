// Every lab step of every built lesson, at every state or value, at four widths: flags anything that spills
// out of its lab or sideways off the page, and saves a screenshot of each for review. Not part of CI.
// Needs a fixtures build started with PCL_FIXTURES=1 and PCL_PACKS_DIR=<content repo>/dist/packs.
// Run: node tests/manual/layout-sweep.mjs http://localhost:3300 ../practicode-learn-content/dist/packs out-dir [id-prefix]
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from '@playwright/test'

const [base, packsDir, outDir, prefix = ''] = process.argv.slice(2)
const WIDTHS = [360, 820, 1024, 1440]
fs.mkdirSync(outDir, { recursive: true })

const packs = fs
  .readdirSync(packsDir)
  .filter((f) => f.endsWith('.json') && f.startsWith(prefix))
  .sort()
  .map((f) => JSON.parse(fs.readFileSync(path.join(packsDir, f), 'utf8')))

const problems = []
const browser = await chromium.launch()
for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: 'dark', reducedMotion: 'reduce' })
  for (const pack of packs) {
    for (const [i, step] of pack.steps.entries()) {
      if (!step.lab) continue
      await page.goto(`${base}/fixtures/player?id=${pack.id}&step=${i}`, { waitUntil: 'networkidle' })
      const lab = page.locator('[data-lab]').first()
      try {
        await lab.waitFor({ timeout: 20000 })
      } catch {
        problems.push({ name: `${pack.id}-s${i + 1}-${width}`, lab: step.lab, value: '', found: ['the lab never appeared'] })
        continue
      }
      const states = step.type === 'diagram' ? step.states.map((_, n) => n) : step.values
      for (const [n, s] of states.entries()) {
        if (step.type === 'diagram' && n > 0) await page.getByRole('button', { name: 'Next', exact: true }).click()
        if (step.type === 'explore') await page.getByRole('button', { name: s, exact: true }).first().click()
        await page.waitForTimeout(120)
        const found = await lab.evaluate((root) => {
          const box = root.getBoundingClientRect()
          const out = []
          const inScroller = (el) => {
            for (let p = el.parentElement; p && p !== root; p = p.parentElement) {
              const o = getComputedStyle(p).overflowX
              if (o === 'auto' || o === 'scroll') return p
            }
            return null
          }
          for (const el of root.querySelectorAll('*')) {
            const r = el.getBoundingClientRect()
            if (!r.width || !r.height) continue
            const scroller = inScroller(el)
            if (scroller) continue
            // Shapes inside a drawing are clipped by the drawing itself; its labels are checked below.
            if (el instanceof SVGElement && !(el instanceof SVGSVGElement)) continue
            if (r.right > box.right + 1.5 || r.left < box.left - 1.5) {
              out.push(`spills ${Math.round(Math.max(r.right - box.right, box.left - r.left))}px: <${el.tagName.toLowerCase()} class="${String(el.className).slice(0, 50)}"> ${(el.textContent || '').trim().slice(0, 40)}`)
            }
          }
          const describe = (el) =>
            `<${el.tagName.toLowerCase()} class="${String(el.className?.baseVal ?? el.className).slice(0, 50)}"> ${(el.textContent || '').trim().slice(0, 40)}`
          for (const el of root.querySelectorAll('*')) {
            const style = getComputedStyle(el)
            const o = style.overflowX
            if ((o === 'auto' || o === 'scroll') && el.scrollWidth > el.clientWidth + 2)
              out.push(`scrolls sideways (${el.scrollWidth} in ${el.clientWidth}): <${el.tagName.toLowerCase()}>`)
            // A word wider than its box: it pokes out (visible) or is cut off (hidden), unless it's meant to truncate.
            // Skips screen-reader-only text (clipped to 1px on purpose) and empty decorative shapes.
            const hasText = (el.textContent || '').trim() !== ''
            if (el instanceof HTMLElement && el.clientWidth > 2 && hasText && style.display !== 'inline' && el.scrollWidth > el.clientWidth + 1) {
              if (o === 'visible') out.push(`text overflows its box by ${el.scrollWidth - el.clientWidth}px: ${describe(el)}`)
              else if ((o === 'hidden' || o === 'clip') && style.textOverflow !== 'ellipsis' && !inScroller(el))
                out.push(`text is cut off by ${el.scrollWidth - el.clientWidth}px: ${describe(el)}`)
            }
          }
          // Labels in drawings: SVG clips anything past its edge.
          for (const svg of root.querySelectorAll('svg')) {
            const s = svg.getBoundingClientRect()
            for (const t of svg.querySelectorAll('text')) {
              const r = t.getBoundingClientRect()
              if (!r.width) continue
              if (r.left < s.left - 1 || r.right > s.right + 1 || r.top < s.top - 1 || r.bottom > s.bottom + 1)
                out.push(`SVG label cut off at the drawing's edge: ${describe(t)}`)
            }
          }
          return [...new Set(out)].slice(0, 4)
        })
        const page_ = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
        if (page_ > 1) found.push(`page scrolls sideways by ${page_}px`)
        const name = `${pack.id}-s${i + 1}-${String(n + 1).padStart(2, '0')}-${width}`
        if (found.length) problems.push({ name, lab: step.lab, value: String(s), found })
        await page
          .locator('[data-lab]')
          .first()
          .screenshot({ path: path.join(outDir, `${name}.png`) })
      }
    }
  }
  await page.close()
}
await browser.close()
fs.writeFileSync(path.join(outDir, 'problems.json'), JSON.stringify(problems, null, 2))
console.log(`${problems.length} problem screens`)
for (const p of problems.slice(0, 80)) console.log(p.name, p.lab, '|', p.found.join(' / '))
