// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { getLesson, lessonsToPrebuild, listPublishedLessons } from './catalogue'
import { loadPack } from './packs'
import { PackError } from './schema'

// With NEXT_PUBLIC_CONTENT_SOURCE unset, lessons come from content/samples.
describe('lesson catalogue (samples)', () => {
  it('lists the published sample lessons, filtered by track', async () => {
    const all = await listPublishedLessons()
    expect(all.map((l) => l.id)).toContain('zz-01-01')
    expect(await listPublishedLessons('front-end-web-development')).toEqual([])
  })

  it('finds a lesson by track and slug, and loads its pack', async () => {
    const meta = await getLesson('samples', 'every-step')
    expect(meta).toMatchObject({ id: 'zz-01-01', title: 'Every step, once', free: true })
    const pack = await loadPack(meta!)
    expect(pack.steps.length).toBe(15)
    expect(await getLesson('samples', 'no-such-lesson')).toBeNull()
  })

  it('refuses a pack that is not the lesson the catalogue promised', async () => {
    const meta = (await getLesson('samples', 'every-step'))!
    await expect(loadPack({ ...meta, version: 2 })).rejects.toBeInstanceOf(PackError)
  })

  it('builds ahead only free lessons in tracks the site knows', async () => {
    const sample = (await getLesson('samples', 'every-step'))!
    const lessons = [
      sample,
      { ...sample, id: 'fe-01-01', track: 'front-end-web-development', slug: 'first' },
      { ...sample, id: 'fe-06-04', track: 'front-end-web-development', slug: 'pro', free: false },
      // A row the database tests leave on dev, whose pack doesn't exist: building it would stop the deploy.
      { ...sample, id: 'zz-01-01', track: 'test-track', slug: 'test-zz-01-01' },
    ]
    expect(lessonsToPrebuild(lessons).map((l) => `${l.track}/${l.slug}`)).toEqual([
      'samples/every-step',
      'front-end-web-development/first',
    ])
  })

  it('never reads a file outside the sample packs', async () => {
    const meta = (await getLesson('samples', 'every-step'))!
    await expect(loadPack({ ...meta, packUrl: '../../.env.local' })).rejects.toBeInstanceOf(PackError)
  })
})
