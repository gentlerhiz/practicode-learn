// Builds the document that runs a learner's files, plus the test harness that checks them. The lesson
// player runs it in the sandboxed runner, and tools/content-build/check-code.ts runs it in a real
// browser, so a test that passes in the checks passes for learners too. Node runs this file directly in
// the content tools, so it uses only erasable syntax.
import type { LessonFile, LessonTest } from '../lessons/schema.ts'

// The test API inside every <Test> block: $, $$, css, box, textBox, near and assert.
const HARNESS = `
(function () {
  var q = function (s) { return typeof s === 'string' ? document.querySelector(s) : s; };
  var $ = function (s) { var el = q(s); if (!el) throw new Error("Couldn't find " + s + ' on the page.'); return el; };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var css = function (s, p) { return getComputedStyle($(s)).getPropertyValue(p).trim(); };
  var rect = function (r) { return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height, centerX: r.left + r.width / 2, centerY: r.top + r.height / 2 }; };
  var box = function (s) { return rect($(s).getBoundingClientRect()); };
  var textBox = function (s) { var r = document.createRange(); r.selectNodeContents($(s)); return rect(r.getBoundingClientRect()); };
  var near = function (a, b, tol) { return Math.abs(a - b) <= (tol == null ? 1 : tol); };
  var assert = function (c, m) { if (!c) throw new Error(m || 'Check failed.'); };
  window.__pclRun = function (tests) {
    var results = tests.map(function (t) {
      try { t.run($, $$, css, box, textBox, near, assert); return { name: t.name, pass: true }; }
      catch (e) { return { name: t.name, pass: false, message: e && e.message ? e.message : String(e) }; }
    });
    window.__pclResults = results;
    try { parent.postMessage({ type: 'pcl-tests', results: results }, '*'); } catch (e) {}
  };
})();
`

// Inline scripts can't contain a literal closing script tag, or the HTML parser ends the element early.
const noScriptEnd = (s: string) => s.replace(/<\/script/gi, '<\\/script')

export function buildDocument(
  files: LessonFile[],
  opts: { value?: string | null; tests?: LessonTest[] } = {},
): string {
  const sub = (s: string) => (opts.value != null ? s.split('{{value}}').join(opts.value) : s)
  const of = (...langs: string[]) =>
    files
      .filter((f) => langs.includes(f.lang))
      .map((f) => sub(f.code))
      .join('\n')
  const html = of('html')
  const css = of('css')
  const js = of('js', 'javascript')
  let tests = ''
  if (opts.tests) {
    // Tests are compiled into the page as functions, not eval'd, so a strict content security policy
    // still allows them.
    const list = opts.tests
      .map(
        (t) =>
          `{ name: ${JSON.stringify(t.name)}, run: function ($, $$, css, box, textBox, near, assert) {\n${t.code}\n} }`,
      )
      .join(',\n')
    tests = `<script>${HARNESS}
window.addEventListener('load', function () {
  // A timer, not requestAnimationFrame: browsers pause animation frames in sandboxed frames that are scrolled off screen.
  var go = function () { setTimeout(function () { window.__pclRun([${noScriptEnd(list)}]); }, 30); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(go); else go();
});
</script>`
  }
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${css}</style></head><body>${html}${js ? `<script>${noScriptEnd(js)}</script>` : ''}${tests}</body></html>`
}

/** The starter files with some replaced, for example by a model solution. */
export function mergeFiles(files: LessonFile[], replacements: LessonFile[] = []): LessonFile[] {
  return files.map((f) => replacements.find((r) => r.name === f.name) ?? f)
}
