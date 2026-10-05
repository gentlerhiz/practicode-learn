import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'

// The licence table is what a fork reads, so every non-AGPL folder must be named in it.
it('LICENSING.md names every folder that is not under the code licence', () => {
  const doc = readFileSync('LICENSING.md', 'utf8')
  for (const path of [
    'src/assets/images/',
    'src/assets/fonts/',
    'public/brand/',
    'public/icons/',
    'src/content/tracks/',
  ]) {
    expect(doc, path).toContain(`\`${path}\``)
  }
})
