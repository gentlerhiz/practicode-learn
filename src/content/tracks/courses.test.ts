import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { catalogue } from '@/content/catalogue'
import { backEnd } from './back-end-web-development'
import { frontEnd } from './front-end-web-development'
import { getTrack, getTrackContent, liveTracks, tracks } from './index'
import { cybersecurity } from './introduction-to-cybersecurity'
import { itFundamentals } from './it-fundamentals'
import { python } from './python-programming'
import { sql } from './sql-and-databases'

describe.each([frontEnd, itFundamentals, backEnd, cybersecurity, python, sql])('$title', (course) => {
  const md = readFileSync(`docs/curriculum/tracks/${course.slug}.md`, 'utf8')

  it('matches the module and lesson list in the published syllabus', () => {
    const section = md.split('## Lessons')[1]!.split('\n## ')[0]!
    const rows = [...section.matchAll(/^\d+\. \*\*(.+?)\*\* \((\d+)\): (.+)$/gm)]
    expect(rows).toHaveLength(course.modules.length)
    rows.forEach((row, i) => {
      const mod = course.modules[i]!
      expect(mod.number).toBe(i + 1)
      expect(mod.title).toBe(row[1])
      expect(mod.lessons.map((l) => l.title)).toEqual(row[3]!.split(' · '))
      expect(mod.lessons).toHaveLength(Number(row[2]))
    })
  })

  it('matches each module project in the syllabus table', () => {
    const table = md.split('## Modules')[1]!.split('\n## ')[0]!
    const projects = [...table.matchAll(/^\| (\d+) \| \*\*.+?\*\*.*?\| .+? \| .+? \| (.+?) \|$/gm)]
    expect(projects).toHaveLength(course.modules.length)
    projects.forEach((p, i) => expect(course.modules[i]!.project).toBe(p[2]))
  })

  it('only Module 1 is free, and it is never coming soon', () => {
    expect(course.modules.filter((m) => m.free).map((m) => m.number)).toEqual([1])
    expect(course.modules[0]!.soon).toBeFalsy()
  })

  it('keeps the outcomes from the syllabus', () => {
    const section = md.split('## By the end, you can')[1]!.split('\n## ')[0]!
    const outcomes = [...section.matchAll(/^\d+\. (.+)$/gm)].map((m) => m[1])
    expect(course.outcomes).toEqual(outcomes)
  })

  it('agrees with its catalogue card', () => {
    const card = catalogue.find((c) => c.slug === course.slug)!
    expect(card.status).toBe(course.status)
    expect(card.modules).toBe(course.modules.length)
    expect(card.firstModule).toBe(course.modules[0]!.title)
    expect(course.firstLesson.startsWith(`/learn/${course.slug}/`)).toBe(true)
  })
})

it('finds courses by slug and nothing else', () => {
  expect(getTrack('front-end-web-development')?.status).toBe('live')
  expect(getTrack('data-analysis')?.status).toBe('coming_soon')
  expect(getTrack('nope')).toBeUndefined()
  expect(getTrackContent('it-fundamentals')?.title).toBe('IT Fundamentals: Computers and Digital Skills')
  expect(liveTracks().map((t) => t.slug)).toEqual(
    tracks.filter((t) => t.status === 'live').map((t) => t.slug),
  )
})

it('gives every course a unique slug and code, and only names real prerequisites', () => {
  const slugs = catalogue.map((c) => c.slug)
  expect(new Set(slugs).size).toBe(slugs.length)
  expect(new Set(catalogue.map((c) => c.code)).size).toBe(catalogue.length)
  for (const c of catalogue) {
    expect(c.code).toMatch(/^[a-z]{2}$/)
    for (const p of c.prerequisites) expect(slugs).toContain(p)
  }
})
