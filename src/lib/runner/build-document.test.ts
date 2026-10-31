import { expect, it } from 'vitest'
import { buildDocument } from './build-document'
import { engineFor, PGLITE_URL, PYODIDE_URL } from './engines'

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
it('gives tests the printed lines, a wait and the step’s files, and lets them be async', () => {
  const doc = buildDocument(files, { tests: [{ name: 't', code: 'assert(logs.length === 0)' }] })
  expect(doc).toContain('async function ($, $$, css, box, textBox, near, assert, logs, wait, file)')
  expect(doc).toContain('window.__pclFiles = {"index.html":"\\u003cp>Hi\\u003c/p>"')
})
it('lets a page’s scripts read the step’s data files with pclFile, escaped like everything else', () => {
  const doc = buildDocument([
    { name: 'index.html', lang: 'html', code: '<ul></ul>' },
    { name: 'app.js', lang: 'js', code: 'pclFile("risks.txt")' },
    { name: 'risks.txt', lang: 'text', code: 'Phone | </script> |' },
  ])
  expect(doc).toContain('window.pclFile')
  // The data is the text file alone: code files aren't data. A page with no JavaScript gets no reader.
  expect(doc).toContain('})({"risks.txt":"Phone | \\u003c/script> |"});')
  expect(buildDocument(files)).not.toContain('pclFile')
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

it('runs Python files in Pyodide, from its pinned folder, and holds the tests until it has run', () => {
  const doc = buildDocument([{ name: 'main.py', lang: 'py', code: 'print("Hi")' }], { tests: [] })
  expect(doc).toContain(`${PYODIDE_URL}pyodide.js`)
  expect(doc).toContain('window.__pclEngine')
  expect(doc).toContain('"main":"main.py"')
})
it('runs SQL setup files first, wherever they sit, and escapes learner SQL that closes a script', () => {
  const doc = buildDocument([
    { name: 'query.sql', lang: 'sql', code: "SELECT '</script>' AS x;" },
    { name: 'setup.sql', lang: 'sql', code: 'CREATE TABLE t (x int);', readonly: true },
  ])
  expect(doc).toContain(PGLITE_URL)
  expect(doc.indexOf('CREATE TABLE t')).toBeLessThan(doc.indexOf("SELECT '"))
  expect(doc).not.toContain("SELECT '</script>'")
})
it('loads no engine for HTML, CSS and JavaScript pages', () => {
  expect(engineFor(files)).toBeNull()
  expect(buildDocument(files)).not.toContain('cdn.jsdelivr.net')
})
