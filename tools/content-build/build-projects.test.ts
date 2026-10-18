// @vitest-environment node
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { parseProjectPack } from '../../src/lib/projects/schema'
import { LessonError } from './build'
import { buildProjects } from './build-projects'

const PROJECT = `---
id: fe-p01
title: A sample page
description: "A sample project for the build's own tests: a page with one heading, checked in the browser like a real one."
track: front-end-web-development
module: 1
client: A sample client
minutes: 30
free: true
version: 1
---

<Brief>

Build a page with a **heading**.

</Brief>

<Must>

- One h1

</Must>

\`\`\`html title="index.html"
<p>Start</p>
\`\`\`

<Check name="One h1">
\`\`\`js
assert($$('h1').length === 1, 'Add one h1.')
\`\`\`
</Check>

<Review>

- I read it out loud.

</Review>

<Solution>

\`\`\`html title="index.html"
<h1>Done</h1>
\`\`\`

</Solution>
`

let dir: string
beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pcl-projects-'))
})
afterEach(() => fs.rmSync(dir, { recursive: true, force: true }))

const run = (source: string, file = '01-sample-page.mdx') => {
  const folder = path.join(dir, 'projects', 'front-end-web-development')
  fs.mkdirSync(folder, { recursive: true })
  fs.writeFileSync(path.join(folder, file), source)
  return buildProjects({
    input: path.join(dir, 'projects'),
    out: path.join(dir, 'out', 'projects'),
    catalogue: path.join(dir, 'out', 'projects.json'),
    quiet: true,
  })
}
const problems = (source: string, file?: string) => {
  try {
    run(source, file)
  } catch (e) {
    if (e instanceof LessonError) return e.problems.join('\n')
    throw e
  }
  return ''
}

describe('project build', () => {
  it('builds a valid pack, with the solution kept out of it', () => {
    const [entry] = run(PROJECT)
    expect(entry).toMatchObject({
      id: 'fe-p01',
      slug: 'sample-page',
      module: 1,
      checks: 1,
      free: true,
      needsSite: false,
    })
    const pack = parseProjectPack(
      JSON.parse(fs.readFileSync(path.join(dir, 'out', 'projects', 'fe-p01.json'), 'utf8')),
    )
    expect(pack.brief).toContain('<strong>heading</strong>')
    expect(pack.must).toEqual(['One h1'])
    expect(pack.review).toEqual(['I read it out loud.'])
    expect(JSON.stringify(pack)).not.toContain('<h1>Done</h1>')
    const solution = JSON.parse(
      fs.readFileSync(path.join(dir, 'out', 'project-solutions', 'fe-p01.json'), 'utf8'),
    )
    expect(solution[0].code).toContain('<h1>Done</h1>')
  })

  it('names the id from the track and the file', () => {
    expect(problems(PROJECT, '02-sample-page.mdx')).toMatch(/id should be fe-p02/)
  })

  it('needs checks, a review and a solution', () => {
    const bare = PROJECT.replace(/<Check[\s\S]*?<\/Check>\n/, '')
      .replace(/<Review>[\s\S]*?<\/Review>\n/, '')
      .replace(/<Solution>[\s\S]*<\/Solution>\n/, '')
    const p = problems(bare)
    expect(p).toMatch(/at least one <Check>/)
    expect(p).toMatch(/needs <Review>/)
    expect(p).toMatch(/needs a <Solution>/)
  })

  it('keeps prose inside the brief', () => {
    expect(problems(PROJECT.replace('<Brief>', 'Loose text.\n\n<Brief>'))).toMatch(/inside <Brief>/)
  })
})
