import { expect, it } from 'vitest'
import { shareUrls } from './share-buttons'

it('encodes share links for each network', () => {
  const s = shareUrls({ url: 'https://learn.practicode.tech/about', text: 'Learn by doing & keep it' })
  expect(s.whatsapp).toBe(
    'https://wa.me/?text=Learn%20by%20doing%20%26%20keep%20it%20https%3A%2F%2Flearn.practicode.tech%2Fabout',
  )
  expect(s.linkedin).toBe(
    'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Flearn.practicode.tech%2Fabout',
  )
  expect(s.x).toContain('https://x.com/intent/post?')
  expect(s.facebook).toContain('https://www.facebook.com/sharer/sharer.php?u=')
})
