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

  it('builds sort, match and type steps, and says what each one is missing', () => {
    const extra = `<Sort stage="apply" assesses="zz.sample.read" groups="Input,Output">

Sort these.

<Item group="Input" feedback="Keys go in.">Keyboard</Item>
<Item group="Output" feedback="Sound comes out.">Speaker</Item>
<Item group="Input" feedback="Your voice goes in.">Microphone</Item>
<Hint>a</Hint>
<Hint>b</Hint>
<Hint>c</Hint>

</Sort>

<Match stage="apply" assesses="zz.sample.read">

Match these.

<Pair term="CPU" match="Follows instructions" feedback="The CPU does the work." />
<Pair term="RAM" match="Holds work in progress" feedback="RAM is the desk." />
<Pair term="\`SSD\`" match="Keeps files" feedback="The SSD keeps them." />
<Hint>a</Hint>
<Hint>b</Hint>
<Hint>c</Hint>

</Match>

<Type stage="apply" assesses="zz.sample.read" accept="cd ..|cd.." correct="Up one." wrong="Two dots." mono case>

Type it.

<Miss answer="cd" feedback="Home." />
<Hint>a</Hint>
<Hint>b</Hint>
<Hint>c</Hint>

</Type>

<Recap>`
    buildLesson(SAMPLE.replace('<Recap>', extra))
    const pack = parsePack(JSON.parse(fs.readFileSync(path.join(dir, 'out', 'packs', 'zz-01-01.json'), 'utf8')))
    const [sort, match, type] = pack.steps.slice(-4)
    expect(sort).toMatchObject({ type: 'sort', groups: ['Input', 'Output'], items: [{ group: 0 }, { group: 1 }, { group: 0 }] })
    expect(match).toMatchObject({ type: 'match', pairs: [{ term: 'CPU' }, { term: 'RAM' }, { term: '<code>SSD</code>' }] })
    expect(type).toMatchObject({ type: 'type', accept: ['cd ..', 'cd..'], caseSensitive: true, mono: true, misses: [{ answers: ['cd'] }] })

    expect(problems(SAMPLE.replace('<Recap>', extra.replace('group="Output" feedback="Sound comes out."', 'group="Sideways"')))).toMatch(
      /names one of its groups[\s\S]*needs feedback/,
    )
    expect(problems(SAMPLE.replace('<Recap>', extra.replace('<Miss answer="cd"', '<Miss answer="cd.."')))).toMatch(
      /is also an accepted answer/,
    )
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
