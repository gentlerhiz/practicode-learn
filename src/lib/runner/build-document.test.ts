import { expect, it } from 'vitest'
import { buildDocument } from './build-document'

const files = [
  { name: 'index.html', lang: 'html', code: '<p>Hi</p>' },
  { name: 'styles.css', lang: 'css', code: 'p { color: red }' },
]

it('puts CSS in the head and HTML in the body', () => {
  const doc = buildDocument(files)
  expect(doc).toMatch(/<style>p \{ color: red \}<\/style><\/head><body><p>Hi<\/p>/)
})
it('substitutes a live value wherever {{value}} appears', () => {
  expect(
    buildDocument([{ name: 'styles.css', lang: 'css', code: 'a { align-items: {{value}}; }' }], {
      value: 'center',
    }),
  ).toContain('align-items: center;')
})
it('cannot be broken out of with a closing script tag in learner code', () => {
  const doc = buildDocument([
    { name: 'script.js', lang: 'js', code: 'console.log("</script><img src=x onerror=alert(1)>")' },
  ])
  expect(doc.match(/<\/script>/g)).toHaveLength(1)
})
