// @vitest-environment node
import { expect, it } from 'vitest'
import { pagesToRefresh, planPublish } from './publish'

const e = (id: string, hash: string, version = 1) => ({
  id,
  version,
  hash,
  track: 'front-end-web-development',
  module: 1,
  lesson: 1,
  slug: id,
  title: id,
  description: 'd'.repeat(130),
  minutes: 10,
  free: true,
  steps: 9,
  bytes: 3000,
})

it('uploads only lessons whose content changed', () => {
  const plan = planPublish([e('fe-01-01', 'aaa'), e('fe-01-02', 'bbb')], [e('fe-01-01', 'aaa')])
  expect(plan.upload.map((x) => x.id)).toEqual(['fe-01-02'])
  expect(plan.unchanged).toEqual(['fe-01-01'])
})

it('uploads a lesson again when its content or its version changes', () => {
  const plan = planPublish(
    [e('fe-01-01', 'new'), e('fe-01-02', 'bbb', 2)],
    [e('fe-01-01', 'old'), e('fe-01-02', 'bbb')],
  )
  expect(plan.upload.map((x) => x.id)).toEqual(['fe-01-01', 'fe-01-02'])
})

it('refreshes each changed lesson page, its track page and the sitemap, once each', () => {
  expect(pagesToRefresh([e('fe-01-01', 'a'), e('fe-01-02', 'b')])).toEqual([
    '/learn/front-end-web-development/fe-01-01',
    '/learn/front-end-web-development/fe-01-02',
    '/tracks/front-end-web-development',
    '/sitemap.xml',
  ])
  expect(pagesToRefresh([])).toEqual([])
})
