// The engines that run Python and SQL in the learner's browser: Pyodide (CPython compiled to WebAssembly)
// and PGlite (PostgreSQL compiled to WebAssembly). Both are free and open source, and both load from
// jsDelivr at these exact versions. The runner's content security policy allows these two folders and
// nothing else, so learner code still can't reach the network. Node runs this file directly in the
// content tools, so it uses only erasable syntax.

export const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v314.0.7/full/'
export const PGLITE_URL = 'https://cdn.jsdelivr.net/npm/@electric-sql/pglite@0.5.8/dist/'

/** The folders the runner may load scripts and engine files from. */
export const ENGINE_SOURCES = [PYODIDE_URL, PGLITE_URL]

/** How long a run may take when an engine has to start first: the first download is around 10 MB. */
export const ENGINE_TIMEOUT_MS = 90000

const isPython = (lang: string) => lang === 'py' || lang === 'python'
const isSql = (lang: string) => lang === 'sql'

/** The engine a step's files need, if any. */
export function engineFor(files: { lang: string }[]): 'python' | 'sql' | null {
  if (files.some((f) => isPython(f.lang))) return 'python'
  if (files.some((f) => isSql(f.lang))) return 'sql'
  return null
}

// While an engine starts, the preview says so, because the first start takes a few seconds. On a slow or
// broken connection it can stall, so after 25 seconds the message says what to do.
const STATUS = (text: string) =>
  `<pcl-status id="pcl-status" role="status" style="display:block;padding:12px;font:14px/1.5 system-ui,sans-serif;color:#5b5675">${text}</pcl-status><script>setTimeout(function () { var s = document.getElementById('pcl-status'); if (s) s.textContent = 'This is taking longer than usual. Check your internet connection, then press Run again.'; }, 25000);</script>`

// Holds the tests until the engine has run the learner's code. The tests' harness waits for this promise.
const HOLD = `window.__pclPending = (window.__pclPending || 0) + 1;
window.__pclEngine = new Promise(function (r) { window.__pclEngineDone = function () { window.__pclPending--; r(); }; });`

// input() reads its answers from input.txt, one line per call, and shows the prompt and the answer in the
// console the way a terminal shows typing. With no answers left (or no input.txt) it stops with an
// EOFError that says what to add, rather than waiting for typing that can't happen in a preview.
const INPUT = `import builtins
def _pcl_make_input(text):
    answers = None if text is None else iter(text.splitlines())
    def input(prompt=''):
        if answers is None:
            raise EOFError('this program asks for input. Add an input.txt file with one answer on each line.')
        try:
            answer = next(answers)
        except StopIteration:
            raise EOFError('input() ran out of answers. Add another line to input.txt.') from None
        print(f'{prompt}{answer}')
        return answer
    return input
builtins.input = _pcl_make_input(__pcl_inputs)
del _pcl_make_input, __pcl_inputs, builtins`

/**
 * Python: the first .py file not marked readonly is the program (or main.py, if there is one); every
 * file is written to the engine's file system, so the program can import the others. print() goes to
 * the console under the preview, and an error shows as Python's own traceback, trimmed to the
 * learner's files. input() answers come from input.txt (see INPUT). Tests get python(expression),
 * which evaluates in the program's variables.
 */
export function pythonDocument(
  files: { name: string; lang: string; code: string; readonly?: boolean }[],
): { head: string; body: string } {
  const py = files.filter((f) => isPython(f.lang))
  const main = py.find((f) => f.name === 'main.py') ?? py.find((f) => !f.readonly) ?? py[0]!
  const inputs = files.find((f) => f.name === 'input.txt')?.code ?? null
  const data = JSON.stringify({
    files: py.map((f) => ({ name: f.name, code: f.code })),
    main: main.name,
    inputs,
    setup: INPUT,
  }).replace(
    /</g,
    '\\u003c',
  )
  return {
    head: `<script>${HOLD}</script><script src="${PYODIDE_URL}pyodide.js"></script>`,
    body: `${STATUS('Starting Python… The first time takes a few seconds.')}<script>
(function () {
  var job = ${data};
  var status = document.getElementById('pcl-status');
  var trim = function (message, name) {
    var lines = String(message).split('\\n');
    var from = lines.findIndex(function (l) { return /^  File "(<exec>|\\/home\\/pyodide\\/)/.test(l); });
    var kept = from < 0 ? lines.filter(Boolean).slice(-1) : ['Traceback (most recent call last):'].concat(lines.slice(from));
    // The runner's own input() is part of Python as far as the learner knows, so its frame is left out.
    kept = kept.filter(function (l, i) { return !/^  File "<pcl>"/.test(l) && !(i > 0 && /^  File "<pcl>"/.test(kept[i - 1]) && /^    /.test(l)); });
    return kept.join('\\n').split('<exec>').join(name).split('/home/pyodide/').join('').trim();
  };
  var toJs = function (v) {
    if (v && typeof v.toJs === 'function') { var out = v.toJs({ dict_converter: Object.fromEntries }); if (v.destroy) v.destroy(); return out; }
    return v;
  };
  (async function () {
    var engine;
    try {
      engine = await loadPyodide({ indexURL: '${PYODIDE_URL}', stdout: function (l) { console.log(l); }, stderr: function (l) { console.error(l); } });
    } catch (e) {
      status.textContent = 'Python couldn’t start. Check your internet connection, then run it again.';
      window.__pclEngineDone();
      return;
    }
    status.remove();
    window.python = function (expression) { return toJs(engine.runPython(String(expression), { globals: engine.globals })); };
    job.files.forEach(function (f) { engine.FS.writeFile(f.name, f.code); });
    // undefined, not null: Pyodide turns undefined into None, and null into a JavaScript object.
    engine.globals.set('__pcl_inputs', job.inputs === null ? undefined : job.inputs);
    var program = job.files.find(function (f) { return f.name === job.main; });
    try {
      engine.runPython(job.setup, { globals: engine.globals, filename: '<pcl>' });
      await engine.runPythonAsync(program.code, { filename: '<exec>' });
    }
    catch (e) { window.__pclShow(trim(e && e.message, job.main), 'error'); window.__pclError = trim(e && e.message, job.main); }
    window.__pclEngineDone();
  })();
})();
</script>`,
  }
}

/**
 * SQL: every .sql file runs on a fresh PostgreSQL database, files whose names start with setup first
 * (such as a readonly setup.sql that creates and fills the tables), then the rest in order. Each result with columns is drawn as a table,
 * and an error shows in the console with the file it came from. Tests get query(sql), which resolves
 * to the rows, and lastResult(), the last table the learner's files produced.
 */
export function sqlDocument(files: { name: string; lang: string; code: string }[]): { head: string; body: string } {
  // Setup files run first wherever they sit, so lessons can show the learner's query.sql as the first tab.
  const all = files.filter((f) => isSql(f.lang))
  const setup = (f: { name: string }) => f.name.startsWith('setup')
  const sql = [...all.filter(setup), ...all.filter((f) => !setup(f))].map((f) => ({ name: f.name, code: f.code }))
  const data = JSON.stringify(sql).replace(/</g, '\\u003c')
  return {
    head: `<script>${HOLD}</script><style>
pcl-results table{border-collapse:collapse;margin:12px;font:14px/1.4 system-ui,sans-serif;color:#15122a;min-width:50%}
pcl-results th,pcl-results td{border:1px solid #dcd8ea;padding:6px 10px;text-align:left}
pcl-results th{background:#f1eefb;font-weight:600}
pcl-results caption{caption-side:top;text-align:left;padding:0 0 6px;color:#5b5675;font-size:13px}
pcl-results .null{color:#8a85a3;font-style:italic}
</style>`,
    body: `${STATUS('Starting the database… The first time takes a few seconds.')}<pcl-results id="pcl-results" style="display:block"></pcl-results><script type="module">
const files = ${data};
const status = document.getElementById('pcl-status');
const out = document.getElementById('pcl-results');
const results = [];
let db;
try {
  const { PGlite } = await import('${PGLITE_URL}index.js');
  db = new PGlite();
  await db.waitReady;
} catch (e) {
  status.textContent = 'The database couldn’t start. Check your internet connection, then run it again.';
  window.__pclEngineDone();
}
if (db) {
  status.remove();
  const cell = (v) => {
    const td = document.createElement('td');
    if (v === null || v === undefined) { td.textContent = 'NULL'; td.className = 'null'; }
    else td.textContent = v instanceof Date ? v.toISOString().slice(0, 10) : typeof v === 'object' ? JSON.stringify(v) : String(v);
    return td;
  };
  const draw = (r) => {
    const table = document.createElement('table');
    const caption = document.createElement('caption');
    caption.textContent = r.rows.length === 1 ? '1 row' : r.rows.length + ' rows';
    const head = document.createElement('tr');
    r.columns.forEach((c) => { const th = document.createElement('th'); th.textContent = c; head.appendChild(th); });
    table.append(caption, head);
    r.rows.forEach((row) => { const tr = document.createElement('tr'); r.columns.forEach((c) => tr.appendChild(cell(row[c]))); table.appendChild(tr); });
    out.appendChild(table);
  };
  for (const f of files) {
    try {
      for (const r of await db.exec(f.code)) {
        if (!r.fields || !r.fields.length) continue;
        const shaped = { columns: r.fields.map((x) => x.name), rows: r.rows };
        results.push(shaped);
        draw(shaped);
      }
    } catch (e) {
      const message = 'ERROR in ' + f.name + ': ' + (e && e.message ? e.message : String(e));
      window.__pclShow(message, 'error');
      window.__pclError = message;
      break;
    }
  }
  window.query = async (text) => (await db.query(String(text))).rows;
  window.lastResult = () => results[results.length - 1] || { columns: [], rows: [] };
  window.allResults = () => results.slice();
  window.__pclEngineDone();
}
</script>`,
  }
}
