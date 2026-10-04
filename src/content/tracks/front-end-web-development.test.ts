import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'
import { frontEnd } from './front-end-web-development'
import { getTrack, tracks } from './index'

const md = readFileSync('docs/curriculum/tracks/front-end-web-development.md', 'utf8')

it('matches the module and lesson list in the published syllabus', () => {
  const section = md.split('## Lessons')[1]!.split('\n## ')[0]!
  const rows = [...section.matchAll(/^\d+\. \*\*(.+?)\*\* \((\d+)\): (.+)$/gm)]
  expect(rows).toHaveLength(15)
  rows.forEach((row, i) => {
    const mod = frontEnd.modules[i]!
    expect(mod.title).toBe(row[1])
    expect(mod.lessons.map((l) => l.title)).toEqual(row[3]!.split(' · '))
    expect(mod.lessons).toHaveLength(Number(row[2]))
  })
})

it('matches each module project in the syllabus table', () => {
  const table = md.split('## Modules')[1]!.split('\n## ')[0]!
  const projects = [...table.matchAll(/^\| (\d+) \| \*\*.+?\*\*.*?\| .+? \| .+? \| (.+?) \|$/gm)]
  expect(projects).toHaveLength(15)
  projects.forEach((p, i) => expect(frontEnd.modules[i]!.project).toBe(p[2]))
})

it('only Module 1 is free', () => {
  expect(frontEnd.modules.filter((m) => m.free).map((m) => m.number)).toEqual([1])
})

it('keeps the outcomes from the syllabus', () => {
  const section = md.split('## By the end, you can')[1]!.split('\n## ')[0]!
  const outcomes = [...section.matchAll(/^\d+\. (.+)$/gm)].map((m) => m[1])
  expect(frontEnd.outcomes).toEqual(outcomes)
})

it('finds live tracks by slug and nothing else', () => {
  expect(getTrack('front-end-web-development')?.status).toBe('live')
  expect(getTrack('data-analysis')?.status).toBe('coming_soon')
  expect(getTrack('nope')).toBeUndefined()
  expect(tracks.filter((t) => t.status === 'live')).toHaveLength(1)
})
