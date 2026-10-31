// Draws every module's notes PDF from built packs, the same way the app's notes route does, so they can be
// checked before publishing: each must lay out without error, and the page counts are printed.
// Usage: node tools/content-build/notes.ts --packs <dir> [--projects <dir>] --out <dir> [--only <id prefix>]
import fs from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'
import { PDFDocument } from 'pdf-lib'
import { backEnd } from '../../src/content/tracks/back-end-web-development.ts'
import { frontEnd } from '../../src/content/tracks/front-end-web-development.ts'
import { cybersecurity } from '../../src/content/tracks/introduction-to-cybersecurity.ts'
import { itFundamentals } from '../../src/content/tracks/it-fundamentals.ts'
import { python } from '../../src/content/tracks/python-programming.ts'
import { sql } from '../../src/content/tracks/sql-and-databases.ts'
import { parsePack, type LessonPack } from '../../src/lib/lessons/schema.ts'
import { buildNotes } from '../../src/lib/notes/content.ts'
import { notesPdf } from '../../src/lib/notes/pdf.ts'
import { parseProjectPack, type ProjectPack } from '../../src/lib/projects/schema.ts'

const TRACKS = [backEnd, frontEnd, cybersecurity, itFundamentals, python, sql]

const { values } = parseArgs({
  options: {
    packs: { type: 'string' },
    projects: { type: 'string' },
    out: { type: 'string' },
    only: { type: 'string' },
  },
})
if (!values.packs || !values.out) {
  console.error(
    'Usage: node tools/content-build/notes.ts --packs <dir> [--projects <dir>] --out <dir> [--only <id prefix>]',
  )
  process.exit(2)
}

const packs: LessonPack[] = fs
  .readdirSync(values.packs)
  .filter((f) => f.endsWith('.json') && (!values.only || f.startsWith(values.only)))
  .map((f) => parsePack(JSON.parse(fs.readFileSync(path.join(values.packs!, f), 'utf8'))))
const projects: ProjectPack[] = values.projects
  ? fs
      .readdirSync(values.projects)
      .filter((f) => f.endsWith('.json'))
      .map((f) => parseProjectPack(JSON.parse(fs.readFileSync(path.join(values.projects!, f), 'utf8'))))
  : []

fs.mkdirSync(values.out, { recursive: true })
const modules = [...new Set(packs.map((p) => `${p.track}/${p.module}`))].sort()
let failed = 0
for (const key of modules) {
  const [slug, n] = key.split('/') as [string, string]
  const track = TRACKS.find((t) => t.slug === slug)
  const syllabus = track?.modules.find((m) => m.number === Number(n))
  if (!track || !syllabus) {
    console.error(`✗ ${key}: not in the course's syllabus`)
    failed++
    continue
  }
  try {
    const notes = buildNotes({
      course: track.title,
      module: syllabus,
      packs: packs.filter((p) => p.track === slug && p.module === syllabus.number),
      project: projects.find((p) => p.track === slug && p.module === syllabus.number) ?? null,
    })
    const missing = new Set<string>()
    const pdf = await notesPdf(notes, { onMissing: (c) => missing.add(c) })
    if (missing.size) {
      const list = [...missing].map((c) => `${c} (U+${c.codePointAt(0)!.toString(16).toUpperCase()})`)
      throw new Error(`no brand font has ${list.join(', ')}`)
    }
    const file = path.join(values.out, `${slug}-module-${String(syllabus.number).padStart(2, '0')}.pdf`)
    fs.writeFileSync(file, pdf)
    const pages = (await PDFDocument.load(pdf)).getPageCount()
    console.log(
      `✓ ${key}  ${notes.lessons.length} lessons · ${pages} pages · ${Math.round(pdf.length / 1024)} KB`,
    )
  } catch (error) {
    console.error(`✗ ${key}: ${(error as Error).message}`)
    failed++
  }
}
if (failed) process.exit(1)
