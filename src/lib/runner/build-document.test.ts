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
  // One for the console, one for the learner's code: the closing tag inside their string is escaped.
  expect(doc.match(/<\/script>/g)).toHaveLength(2)
})
it('adds the console before the learner code only when there is JavaScript', () => {
  const withJs = buildDocument([...files, { name: 'script.js', lang: 'js', code: 'console.log(1)' }])
  expect(withJs.indexOf('__pclLogs')).toBeGreaterThan(-1)
  expect(withJs.indexOf('__pclLogs')).toBeLessThan(withJs.indexOf('console.log(1)'))
  expect(buildDocument(files)).not.toContain('__pclLogs')
})
it('passes the printed lines to tests as logs', () => {
  const doc = buildDocument(files, { tests: [{ name: 't', code: 'assert(logs.length === 0)' }] })
  expect(doc).toContain('function ($, $$, css, box, textBox, near, assert, logs)')
})
it('links files that import and export each other, each in its own scope, imported files first', () => {
  const doc = buildDocument([
    { name: 'main.js', lang: 'js', code: "import { add } from './budget.js'\nconst total = add(2, 3)" },
    {
      name: 'budget.js',
      lang: 'js',
      code: 'const total = 0\nexport function add(a, b) {\n  return a + b\n}',
    },
  ])
  expect(doc).not.toMatch(/^\s*(import|export)\b/m)
  expect(doc.indexOf('function add')).toBeLessThan(doc.indexOf('add(2, 3)'))
  expect(doc).toContain('const { add } = __pclModules["budget.js"];')
})
it('stops with the browser’s error when an import is wrong', () => {
  const run = (spec: string, name = 'add') =>
    buildDocument([
      { name: 'main.js', lang: 'js', code: `import { ${name} } from '${spec}'` },
      { name: 'budget.js', lang: 'js', code: 'export function add() {}' },
    ])
  expect(run('./budget.js', 'total')).toContain("does not provide an export named 'total'")
  expect(run('budget.js')).toContain('Relative references must start with')
  expect(run('./budjet.js')).toContain("Failed to fetch module './budjet.js'")
})
it('starts localStorage with what the page saved last time, safely inside the script', () => {
  const doc = buildDocument([{ name: 'script.js', lang: 'js', code: 'localStorage.getItem("score")' }], {
    storage: { score: '3', note: '</script><b>' },
  })
  expect(doc).toContain('"score":"3"')
  expect(doc).not.toContain('</script><b>')
})
