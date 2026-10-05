// Assembles the review preview: one self-contained HTML page that plays every built lesson.
//   <out>/lesson-review.html   page body for publishing as a private artifact (no <html>/<head> wrapper)
//   <out>/local.html           the same page with a document wrapper, for opening in a browser
// Usage: node tools/content-build/preview.ts --packs <dir> --catalogue <file> --out <dir>
import fs from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import type { CatalogueEntry } from '../../src/lib/lessons/types.ts'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const { values } = parseArgs({
  options: { packs: { type: 'string' }, catalogue: { type: 'string' }, out: { type: 'string' } },
})
if (!values.packs || !values.catalogue || !values.out) {
  console.error('Usage: node tools/content-build/preview.ts --packs <dir> --catalogue <file> --out <dir>')
  process.exit(2)
}
const packsDir = path.resolve(values.packs)
const read = (p: string) => fs.readFileSync(p, 'utf8')
const catalogue: CatalogueEntry[] = JSON.parse(read(values.catalogue))
const lessons = catalogue
  .sort((a, b) => a.track.localeCompare(b.track) || a.module - b.module || a.lesson - b.lesson)
  .map((c) => ({
    pack: JSON.parse(read(path.join(packsDir, `${c.id}.json`))),
    solutions: JSON.parse(read(path.join(packsDir, '..', 'solutions', `${c.id}.json`))),
  }))

const data = JSON.stringify({ lessons }).replace(/</g, '\\u003c')
// Inline scripts can't contain a literal closing script tag, or the HTML parser ends the element early.
const inlineJs = (s: string) => s.replace(/<\/script/gi, '<\\/script')
// The player calls buildDocument and mergeFiles as globals: the same builder the app uses, minus types.
const builder = path.join(HERE, '..', '..', 'src', 'lib', 'runner', 'build-document.ts')
const sandbox = inlineJs(stripTypeScriptTypes(read(builder)).replace(/^export /gm, ''))
const body = `<title>PractiCode Lesson Review</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=JetBrains+Mono:wght@400;500&family=Poppins:wght@400;500;600;700&display=swap">
<style>
${read(path.join(HERE, 'preview', 'player.css'))}
</style>
<div class="app" id="app"></div>
<script type="application/json" id="pcl-data">${data}</script>
<script>
${sandbox}
</script>
<script>
${inlineJs(read(path.join(HERE, 'preview', 'player.js')))}
</script>
`
const out = path.resolve(values.out)
fs.mkdirSync(out, { recursive: true })
fs.writeFileSync(path.join(out, 'lesson-review.html'), body)
fs.writeFileSync(
  path.join(out, 'local.html'),
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>[hidden]{display:none!important}body{margin:0}</style></head><body>\n${body}</body></html>\n`,
)
const kb = (Buffer.byteLength(body) / 1024).toFixed(0)
console.log(`✓ Preview with ${lessons.length} lesson${lessons.length === 1 ? '' : 's'}: ${out} (${kb} KB)`)
