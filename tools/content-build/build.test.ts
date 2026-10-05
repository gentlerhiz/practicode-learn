// @vitest-environment node
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { parsePack } from '../../src/lib/lessons/schema'
import { build, LessonError } from './build'

const SAMPLE = fs.readFileSync('content/samples/01-samples/01-every-step.mdx', 'utf8')
let dir: string

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pcl-build-'))
})
afterEach(() => fs.rmSync(dir, { recursive: true, force: true }))

// Writes one lesson at lessons/01-samples/01-every-step.mdx and builds it into dir/out.
const buildLesson = (source: string) => {
  const lessons = path.join(dir, 'lessons', '01-samples')
  fs.mkdirSync(lessons, { recursive: true })
  fs.writeFileSync(path.join(lessons, '01-every-step.mdx'), source)
  return build({
    input: path.join(dir, 'lessons'),
    out: path.join(dir, 'out', 'packs'),
    catalogue: path.join(dir, 'out', 'catalogue.json'),
    quiet: true,
  })
}
const problems = (source: string) => {
  try {
    buildLesson(source)
  } catch (e) {
    if (e instanceof LessonError) return e.problems.join('\n')
    throw e
  }
  return ''
}

describe('content build', () => {
  it('builds a valid pack, with the slug from the file name and solutions kept out of it', () => {
    const [entry] = buildLesson(SAMPLE)
    expect(entry).toMatchObject({ id: 'zz-01-01', slug: 'every-step', track: 'samples', steps: 15 })
    const pack = parsePack(
      JSON.parse(fs.readFileSync(path.join(dir, 'out', 'packs', 'zz-01-01.json'), 'utf8')),
    )
    const code = pack.steps.find((s) => s.type === 'code')
    expect(code?.type === 'code' && code.files.find((f) => f.name === 'styles.css')?.code).toBe(
      '.lantern { color: black; }',
    )
    const solutions = fs.readFileSync(path.join(dir, 'out', 'solutions', 'zz-01-01.json'), 'utf8')
    expect(solutions).toContain('color: #E8792F')
  })

  it('names a lab the player does not know', () => {
    expect(problems(SAMPLE.replace('lab="flex-axes"', 'lab="warp-drive"'))).toMatch(
      /Unknown lab "warp-drive"/,
    )
  })

  it('needs a description long enough for search results, and short enough to show in full', () => {
    expect(problems(SAMPLE.replace(/^description: .*$/m, 'description: Too short.'))).toMatch(
      /description should be 120 to 160 characters/,
    )
  })

  it('explains frontmatter that is not valid YAML instead of crashing', () => {
    const broken = SAMPLE.replace(/^description: .*$/m, `description: ${'Lanterns: '.repeat(14)}`)
    expect(problems(broken)).toMatch(/Frontmatter isn't valid YAML/)
  })

  it('refuses to build into the folder that holds the lessons', () => {
    expect(() =>
      build({
        input: path.join(dir, 'out', 'packs'),
        out: path.join(dir, 'out'),
        catalogue: path.join(dir, 'c.json'),
      }),
    ).toThrow(/Refusing to build/)
  })
})
