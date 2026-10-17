// Builds the document that runs a learner's files, plus the test harness that checks them. The lesson
// player runs it in the sandboxed runner, and tools/content-build/check-code.ts runs it in a real
// browser, so a test that passes in the checks passes for learners too. Node runs this file directly in
// the content tools, so it uses only erasable syntax.
import type { LessonFile, LessonTest } from '../lessons/schema.ts'

// The test API inside every <Test> block: $, $$, css, box, textBox, near, assert and logs (the lines the
// learner's code printed with console.log, as text).
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
      try { t.run($, $$, css, box, textBox, near, assert, (window.__pclLogs || []).slice()); return { name: t.name, pass: true }; }
      catch (e) { return { name: t.name, pass: false, message: e && e.message ? e.message : String(e) }; }
    });
    window.__pclResults = results;
    try { parent.postMessage({ type: 'pcl-tests', results: results }, '*'); } catch (e) {}
  };
})();
`

// Pages with JavaScript get a console under the preview, because learners can't open DevTools inside
// the lesson. It shows what console.log prints, and any error, the way the browser's console would. It
// appears with the first line, so pages that print nothing look the same as before.
const CONSOLE = `
(function () {
  var logs = window.__pclLogs = [];
  var panel = null;
  var fmt = function (v, d) {
    if (typeof v === 'string') return d ? "'" + v + "'" : v;
    if (typeof v === 'function') return 'ƒ ' + (v.name || 'anonymous') + '()';
    if (v === null || typeof v !== 'object') return String(v);
    if (v instanceof Error) return v.name + ': ' + v.message;
    if (typeof Element !== 'undefined' && v instanceof Element) return '<' + v.tagName.toLowerCase() + '>';
    if (d > 2) return Array.isArray(v) ? '[…]' : '{…}';
    if (Array.isArray(v)) return '[' + v.map(function (x) { return fmt(x, d + 1); }).join(', ') + ']';
    return '{' + Object.keys(v).map(function (k) { return k + ': ' + fmt(v[k], d + 1); }).join(', ') + '}';
  };
  var show = function (text, error) {
    if (!panel) {
      panel = document.createElement('pcl-console');
      panel.setAttribute('role', 'log');
      panel.setAttribute('aria-label', 'Console');
      panel.style.cssText = 'display:block;margin:16px 0 0;padding:8px 12px;background:#15122A;color:#F4F1FF;font:13px/1.5 ui-monospace,Menlo,Consolas,monospace;white-space:pre-wrap;overflow-wrap:anywhere;text-align:left';
      (document.body || document.documentElement).appendChild(panel);
    }
    var line = document.createElement('pcl-line');
    line.style.cssText = 'display:block;padding:2px 0;border-top:1px solid rgba(244,241,255,0.12)' + (error ? ';color:#FCA5A5' : '');
    line.textContent = text;
    panel.appendChild(line);
  };
  ['log', 'info', 'warn', 'error'].forEach(function (k) {
    var original = console[k];
    console[k] = function () {
      var text = Array.prototype.map.call(arguments, function (a) { return fmt(a, 0); }).join(' ');
      logs.push(text);
      show(text, k === 'error');
      try { original.apply(console, arguments); } catch (e) {}
    };
  });
  window.addEventListener('error', function (e) {
    show((e.error && e.error.name ? e.error.name + ': ' + e.error.message : e.message), true);
  });
})();
`

// The runner's sandbox only allows inline scripts, so JavaScript files that import and export each other
// can't load one another. Instead they're linked here into one script: each file runs in its own scope, in
// dependency order, and a wrong path or a missing export stops everything with the browser's own error.
// Named imports and exports only. Exported names are also put on window, so tests can call them.
const NAME = String.raw`[A-Za-z_$][\w$]*`
const IMPORT_LINE = /^[ \t]*import\s*\{([^}]*)\}\s*from\s*(['"])([^'"]*)\2[ \t]*;?[ \t]*$/gm
const EXPORT_LIST = /^[ \t]*export\s*\{([^}]*)\}[ \t]*;?[ \t]*$/gm
const EXPORT_DECL = new RegExp(
  String.raw`^([ \t]*)export\s+((?:async\s+)?function\*?\s*(${NAME})|(?:const|let|var|class)\s+(${NAME}))`,
  'gm',
)
const isModule = (code: string) => /^[ \t]*(import\s*\{|export\s)/m.test(code)
const names = (list: string) =>
  list
    .split(',')
    .map((n) => n.trim())
    .filter(Boolean)

type ModuleFile = { name: string; code: string }

function linkModules(files: ModuleFile[]): string {
  const exports = new Map<string, string[]>()
  for (const f of files) {
    const found: string[] = []
    for (const m of f.code.matchAll(EXPORT_DECL)) found.push((m[3] ?? m[4])!)
    for (const m of f.code.matchAll(EXPORT_LIST)) found.push(...names(m[1]!))
    exports.set(f.name, found)
  }
  const fail = (type: string, message: string) => `throw new ${type}(${JSON.stringify(message)});`
  const imports = new Map<string, { names: string[]; spec: string; file: string }[]>()
  for (const f of files) {
    const list = []
    for (const m of f.code.matchAll(IMPORT_LINE)) {
      const spec = m[3]!
      if (!/^(\.\.?\/|\/)/.test(spec)) {
        return fail(
          'TypeError',
          `Failed to resolve module specifier "${spec}". Relative references must start with either "/", "./", or "../".`,
        )
      }
      const file = spec.replace(/^(\.\.?\/)+|^\//, '')
      if (!exports.has(file))
        return fail('TypeError', `Failed to fetch module '${spec}': there's no file called ${file}.`)
      for (const n of names(m[1]!)) {
        if (!exports.get(file)!.includes(n)) {
          return fail('SyntaxError', `The requested module '${spec}' does not provide an export named '${n}'`)
        }
      }
      list.push({ names: names(m[1]!), spec, file })
    }
    imports.set(f.name, list)
  }
  // Each file after the files it imports from.
  const order: ModuleFile[] = []
  const visit = (f: ModuleFile, seen: Set<string>) => {
    if (order.includes(f) || seen.has(f.name)) return
    seen.add(f.name)
    for (const i of imports.get(f.name)!)
      visit(
        files.find((x) => x.name === i.file)!,
        seen,
      )
    order.push(f)
  }
  for (const f of files) visit(f, new Set())
  const blocks = order.map((f) => {
    const take = imports
      .get(f.name)!
      .map((i) => `const { ${i.names.join(', ')} } = __pclModules[${JSON.stringify(i.file)}];`)
      .join(' ')
    const body = f.code
      .replace(IMPORT_LINE, '')
      .replace(EXPORT_LIST, '')
      .replace(EXPORT_DECL, (_m, indent: string, decl: string) => indent + decl)
    const give = exports.get(f.name)!.join(', ')
    return `{ ${take}\n${body}\n__pclModules[${JSON.stringify(f.name)}] = { ${give} }; }`
  })
  return `'use strict';\nvar __pclModules = {};\n${blocks.join('\n')}\nfor (var __pclFile in __pclModules) Object.assign(window, __pclModules[__pclFile]);`
}

// The runner's sandbox has no storage of its own, so localStorage is a stand-in that keeps the same
// methods. It starts with what the page saved on its last run, and tells the player each time it changes,
// so saved data survives a re-run the way it survives a reload.
const storageScript = (saved: Record<string, string>) => `
(function () {
  var data = ${JSON.stringify(saved).replace(/</g, '\\u003c')};
  var has = function (k) { return Object.prototype.hasOwnProperty.call(data, k); };
  var sync = function () { try { parent.postMessage({ type: 'pcl-storage', data: data }, '*'); } catch (e) {} };
  var storage = {
    getItem: function (k) { k = String(k); return has(k) ? data[k] : null; },
    setItem: function (k, v) { data[String(k)] = String(v); sync(); },
    removeItem: function (k) { delete data[String(k)]; sync(); },
    clear: function () { data = {}; sync(); },
    key: function (i) { var keys = Object.keys(data); return i < keys.length ? keys[i] : null; },
  };
  Object.defineProperty(storage, 'length', { get: function () { return Object.keys(data).length; } });
  try { Object.defineProperty(window, 'localStorage', { value: storage, configurable: true }); } catch (e) {}
})();
`

// Inline scripts can't contain a literal closing script tag, or the HTML parser ends the element early.
const noScriptEnd = (s: string) => s.replace(/<\/script/gi, '<\\/script')

export function buildDocument(
  files: LessonFile[],
  opts: { value?: string | null; tests?: LessonTest[]; storage?: Record<string, string> } = {},
): string {
  const sub = (s: string) => (opts.value != null ? s.split('{{value}}').join(opts.value) : s)
  const of = (...langs: string[]) =>
    files
      .filter((f) => langs.includes(f.lang))
      .map((f) => sub(f.code))
      .join('\n')
  const html = of('html')
  const css = of('css')
  const scripts = files
    .filter((f) => f.lang === 'js' || f.lang === 'javascript')
    .map((f) => ({ name: f.name, code: sub(f.code) }))
  const js = scripts.some((f) => isModule(f.code))
    ? linkModules(scripts)
    : scripts.map((f) => f.code).join('\n')
  let tests = ''
  if (opts.tests) {
    // Tests are compiled into the page as functions, not eval'd, so a strict content security policy
    // still allows them.
    const list = opts.tests
      .map(
        (t) =>
          `{ name: ${JSON.stringify(t.name)}, run: function ($, $$, css, box, textBox, near, assert, logs) {\n${t.code}\n} }`,
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
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${css}</style>${js ? `<script>${CONSOLE}${storageScript(opts.storage ?? {})}</script>` : ''}</head><body>${html}${js ? `<script>${noScriptEnd(js)}</script>` : ''}${tests}</body></html>`
}

/** The starter files with some replaced, for example by a model solution. */
export function mergeFiles(files: LessonFile[], replacements: LessonFile[] = []): LessonFile[] {
  return files.map((f) => replacements.find((r) => r.name === f.name) ?? f)
}
