import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'
import { parsePack } from './schema'

const sample = () => JSON.parse(readFileSync('content/samples/packs/zz-01-01.json', 'utf8'))

it('accepts a built sample pack', () => {
  expect(parsePack(sample()).steps.length).toBeGreaterThan(5)
})
it('rejects a pack from a newer schema', () => {
  expect(() => parsePack({ ...sample(), schema: 2 })).toThrow()
})
it('rejects a lab the player does not know', () => {
  const pack = sample()
  pack.steps.push({
    type: 'diagram',
    stage: 'investigate',
    lab: 'warp-drive',
    states: [
      { title: 'a', html: 'b' },
      { title: 'c', html: 'd' },
    ],
  })
  expect(() => parsePack(pack)).toThrow()
})
it('rejects fields the format does not define', () => {
  expect(() => parsePack({ ...sample(), solution: 'leaked' })).toThrow()
})
