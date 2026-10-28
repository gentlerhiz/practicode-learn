// A practice developer's terminal for Back-End Module 4: a bash-like shell on Ada's laptop, the cafe-api
// project, `node` for simple programs, and a real working model of Git (staging, commits, history,
// branches, merges with conflicts, .gitignore and a practice GitHub). Messages copy the real ones, so
// what learners see here is what they'll see on their own computer. Pure functions: every command
// returns a new state.

/** File contents by path from Ada's home folder, such as "cafe-api/app.js". */
export type Files = Record<string, string>

export type Commit = {
  id: string
  message: string
  /** Every tracked file at this commit, by path from the repository's folder. */
  snapshot: Files
  parents: string[]
  date: string
}

export type Repo = {
  /** The repository's folder, from home, such as "cafe-api". */
  root: string
  commits: Commit[]
  /** Each branch and the commit it points at (null before the first commit). */
  branches: Record<string, string | null>
  head: string
  /** The staging area: what the next commit will hold. */
  index: Files
  remote: { url: string; branches: Record<string, string> } | null
  upstream: string[]
  merging: { branch: string; theirs: string; conflicts: string[] } | null
}

export type Dev = {
  files: Files
  /** Folders, by path from home (home itself is ""). */
  dirs: string[]
  cwd: string
  repo: Repo | null
  /** Paths changed by the last command, for the file list to mark. */
  touched: string[]
}

export type DevResult = { dev: Dev; out: string; error: boolean; clear?: boolean }

const HOME = '/home/ada'

// ─── The practice project ────────────────────────────────────────────────────────────────────────────

const APP = `import { prices } from './prices.js'

const order = ['Flat white', 'Croissant']
let total = 0
for (const item of order) total += prices[item]

console.log('Order total: ' + total)
`
const PRICES = `export const prices = {
  'Espresso': 2.5,
  'Flat white': 3.2,
  'Croissant': 2.8,
}
`
const GREET = 'console.log(`Hello, ${process.argv[2]}. Welcome to Corner Café.`)\n'
const NOTES = 'Ideas: a loyalty card, and oat milk for 0.30 more.\n'
const ORDERS = '[\n  { "id": 1, "item": "Flat white", "paid": true }\n]\n'

const project = (): { files: Files; dirs: string[] } => ({
  files: {
    'cafe-api/app.js': APP,
    'cafe-api/prices.js': PRICES,
    'cafe-api/greet.js': GREET,
    'cafe-api/notes.txt': NOTES,
    'cafe-api/data/orders.json': ORDERS,
    'Desktop/todo.txt': 'Learn Git. Push cafe-api to GitHub.\n',
  },
  dirs: ['cafe-api', 'cafe-api/data', 'Desktop', 'Documents'],
})

/** A 40-character commit id that's always the same for the same commit, so lessons can describe it. */
function hashOf(text: string): string {
  let out = ''
  let h = 2166136261
  for (let round = 0; out.length < 40; round++) {
    for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619) >>> 0
    h = Math.imul(h ^ round, 2246822519) >>> 0
    out += h.toString(16).padStart(8, '0')
  }
  return out.slice(0, 40)
}

const DAY = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const dateFor = (n: number) => `${DAY[Math.floor(n / 4) % 7]} Oct ${String(26 + Math.floor(n / 4)).padStart(2, '0')} ${String(9 + (n % 4) * 2).padStart(2, '0')}:${String((n * 17) % 60).padStart(2, '0')}:00 2026 +0000`

/** The tracked files under the repository's folder, by path from that folder. */
function treeOf(files: Files, root: string): Files {
  const out: Files = {}
  for (const [path, text] of Object.entries(files)) if (path.startsWith(`${root}/`)) out[path.slice(root.length + 1)] = text
  return out
}

function makeCommit(repo: Repo, message: string, snapshot: Files, parents: string[]): Commit {
  const id = hashOf(`${message}|${parents.join(',')}|${JSON.stringify(snapshot)}|${repo.commits.length}`)
  return { id, message, snapshot: { ...snapshot }, parents, date: dateFor(repo.commits.length) }
}

function commitAll(dev: Dev, message: string): Dev {
  const repo = dev.repo!
  const snapshot = ignoreFilter(treeOf(dev.files, repo.root), ignoreRules(dev.files, repo.root))
  const parent = repo.branches[repo.head]
  const c = makeCommit(repo, message, snapshot, parent ? [parent] : [])
  return {
    ...dev,
    repo: { ...repo, commits: [...repo.commits, c], branches: { ...repo.branches, [repo.head]: c.id }, index: { ...snapshot } },
  }
}

/** The scenarios a lesson can start from. */
export const SCENARIOS = ['Home', 'Project', 'Repository', 'Branches', 'Conflict', 'Ignore', 'GitHub'] as const
export type Scenario = (typeof SCENARIOS)[number]

function withRepo(dev: Dev): Dev {
  return {
    ...dev,
    repo: { root: 'cafe-api', commits: [], branches: { main: null }, head: 'main', index: {}, remote: null, upstream: [], merging: null },
  }
}

const edit = (dev: Dev, path: string, text: string): Dev => ({ ...dev, files: { ...dev.files, [path]: text } })

export function newDev(scenario: Scenario = 'Home'): Dev {
  const { files, dirs } = project()
  const home: Dev = { files, dirs, cwd: '', repo: null, touched: [] }
  const inProject: Dev = { ...home, cwd: 'cafe-api' }
  switch (scenario) {
    case 'Home':
      return home
    case 'Project':
      return inProject
    case 'Repository': {
      let dev = withRepo(inProject)
      dev = commitAll(dev, 'Add the price list and order total')
      return dev
    }
    case 'Branches': {
      let dev = commitAll(withRepo(inProject), 'Add the price list and order total')
      dev = commitAll(edit(dev, 'cafe-api/prices.js', PRICES.replace("  'Croissant': 2.8,\n", "  'Croissant': 2.8,\n  'Banana bread': 3,\n")), 'Add banana bread')
      return dev
    }
    case 'Conflict': {
      let dev = commitAll(withRepo(inProject), 'Add the price list and order total')
      const repo = dev.repo!
      dev = { ...dev, repo: { ...repo, branches: { ...repo.branches, 'new-prices': repo.branches.main! } } }
      // main raises the espresso to 2.6; new-prices raises it to 2.7: the same line, changed two ways.
      dev = commitAll(edit(dev, 'cafe-api/prices.js', PRICES.replace("'Espresso': 2.5", "'Espresso': 2.6")), 'Espresso up to 2.60')
      dev = { ...dev, repo: { ...dev.repo!, head: 'new-prices' } }
      dev = { ...dev, files: { ...dev.files, 'cafe-api/prices.js': PRICES } }
      dev = commitAll(edit(dev, 'cafe-api/prices.js', PRICES.replace("'Espresso': 2.5", "'Espresso': 2.7")), 'Espresso up to 2.70')
      dev = { ...dev, repo: { ...dev.repo!, head: 'main', index: { ...commitOf(dev.repo!, dev.repo!.branches.main!)!.snapshot } } }
      return { ...dev, files: { ...dev.files, 'cafe-api/prices.js': PRICES.replace("'Espresso': 2.5", "'Espresso': 2.6") } }
    }
    case 'Ignore': {
      const dev = commitAll(withRepo(inProject), 'Add the price list and order total')
      return {
        ...dev,
        files: {
          ...dev.files,
          'cafe-api/.env': 'PAYMENT_KEY=sk_live_51Hc0rNeRcAfE\n',
          'cafe-api/node_modules/express/index.js': "module.exports = require('./lib/express')\n",
          'cafe-api/node_modules/express/package.json': '{ "name": "express", "version": "5.1.0" }\n',
          'cafe-api/server.log': 'GET /menu 200\nGET /menu 200\n',
        },
        dirs: [...dev.dirs, 'cafe-api/node_modules', 'cafe-api/node_modules/express'],
      }
    }
    case 'GitHub': {
      let dev = commitAll(withRepo(inProject), 'Add the price list and order total')
      dev = commitAll(edit(dev, 'cafe-api/README.md', '# cafe-api\n\nThe API behind Corner Café.\n'), 'Add a README')
      return dev
    }
  }
}

// ─── Paths ───────────────────────────────────────────────────────────────────────────────────────────

const join = (...parts: string[]) => parts.filter(Boolean).join('/')

/** Turns what the learner typed into a path from home, or null if it climbs above /. */
function resolve(dev: Dev, typed: string): string | null {
  let parts: string[]
  if (typed === '~' || typed.startsWith('~/')) parts = typed.slice(1).split('/')
  else if (typed.startsWith('/')) {
    const abs = typed.replace(/\/+$/, '')
    if (abs === HOME) return ''
    if (!abs.startsWith(`${HOME}/`)) return null
    parts = abs.slice(HOME.length + 1).split('/')
  } else parts = [...dev.cwd.split('/'), ...typed.split('/')]
  const out: string[] = []
  for (const p of parts) {
    if (!p || p === '.') continue
    if (p === '..') {
      if (!out.length) return null
      out.pop()
    } else out.push(p)
  }
  return out.join('/')
}

const isDir = (dev: Dev, path: string) => path === '' || dev.dirs.includes(path)
const isFile = (dev: Dev, path: string) => path in dev.files
const childrenOf = (dev: Dev, dir: string) => {
  const prefix = dir ? `${dir}/` : ''
  const names = new Set<string>()
  for (const p of [...Object.keys(dev.files), ...dev.dirs]) {
    if (!p.startsWith(prefix) || p === dir) continue
    const rest = p.slice(prefix.length)
    if (rest) names.add(rest.split('/')[0]!)
  }
  return [...names].sort((a, b) => a.replace(/^\./, '').localeCompare(b.replace(/^\./, ''), 'en', { sensitivity: 'base' }))
}

export const showPath = (path: string) => (path ? `${HOME}/${path}` : HOME)
const tilde = (path: string) => (path ? `~/${path}` : '~')

/** The prompt, with the branch in brackets inside a repository, as many developers set theirs up. */
export function prompt(dev: Dev): string {
  const repo = repoHere(dev)
  const branch = repo ? ` (${repo.merging ? `${repo.head}|MERGING` : repo.head})` : ''
  return `ada@laptop:${tilde(dev.cwd)}${branch}$`
}

/** The repository the current folder is inside, if any. */
function repoHere(dev: Dev): Repo | null {
  const r = dev.repo
  if (!r) return null
  return dev.cwd === r.root || dev.cwd.startsWith(`${r.root}/`) ? r : null
}

// ─── .gitignore ──────────────────────────────────────────────────────────────────────────────────────

function ignoreRules(files: Files, root: string): ((path: string) => boolean)[] {
  const text = files[`${root}/.gitignore`]
  if (!text) return []
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((rule) => {
      const dirOnly = rule.endsWith('/')
      const clean = rule.replace(/^\//, '').replace(/\/$/, '')
      const re = new RegExp(`^${clean.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*')}$`)
      return (path: string) => {
        const parts = path.split('/')
        // A rule with no slash matches a name at any depth; "dir/" matches a folder and all inside it.
        for (let i = 0; i < parts.length; i++) {
          const name = parts[i]!
          const isFolder = i < parts.length - 1
          if (dirOnly && !isFolder) continue
          if (clean.includes('/') ? re.test(parts.slice(0, i + 1).join('/')) : re.test(name)) return true
        }
        return false
      }
    })
}

/** Leaves out the files the repository's .gitignore names. */
function ignoreFilter(tree: Files, rules: ((path: string) => boolean)[]): Files {
  const out: Files = {}
  for (const [p, t] of Object.entries(tree)) if (!rules.some((r) => r(p))) out[p] = t
  return out
}

// ─── Diffs ───────────────────────────────────────────────────────────────────────────────────────────

const linesOf = (text: string) => (text === '' ? [] : text.replace(/\n$/, '').split('\n'))

/** A line-by-line diff (longest common subsequence): ' ' kept, '-' removed, '+' added. */
function diffLines(a: string[], b: string[]): [' ' | '-' | '+', string][] {
  const n = a.length
  const m = b.length
  const dp = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0))
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i]![j] = a[i] === b[j] ? dp[i + 1]![j + 1]! + 1 : Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!)
  const out: [' ' | '-' | '+', string][] = []
  let i = 0
  let j = 0
  while (i < n || j < m) {
    if (i < n && j < m && a[i] === b[j]) {
      out.push([' ', a[i]!])
      i++
      j++
    } else if (j < m && (i >= n || dp[i]![j + 1]! >= dp[i + 1]![j]!)) out.push(['+', b[j++]!])
    else out.push(['-', a[i++]!])
  }
  return out
}

function counts(before: Files, after: Files) {
  let ins = 0
  let del = 0
  const changed: { path: string; ins: number; del: number }[] = []
  for (const path of [...new Set([...Object.keys(before), ...Object.keys(after)])].sort()) {
    if (before[path] === after[path]) continue
    const d = diffLines(linesOf(before[path] ?? ''), linesOf(after[path] ?? ''))
    const fi = d.filter((x) => x[0] === '+').length
    const fd = d.filter((x) => x[0] === '-').length
    ins += fi
    del += fd
    changed.push({ path, ins: fi, del: fd })
  }
  return { ins, del, changed }
}

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`

function summary(before: Files, after: Files): string {
  const { ins, del, changed } = counts(before, after)
  const parts = [` ${plural(changed.length, 'file')} changed`]
  if (ins) parts.push(`${plural(ins, 'insertion')}(+)`)
  if (del) parts.push(`${plural(del, 'deletion')}(-)`)
  return parts.join(', ')
}

function stat(before: Files, after: Files): string {
  const { changed } = counts(before, after)
  const width = Math.max(...changed.map((c) => c.path.length), 0)
  const rows = changed.map((c) => ` ${c.path.padEnd(width)} | ${String(c.ins + c.del).padStart(2)} ${'+'.repeat(c.ins)}${'-'.repeat(c.del)}`)
  return [...rows, summary(before, after)].join('\n')
}

function unifiedDiff(path: string, before: string | undefined, after: string | undefined): string {
  const a = linesOf(before ?? '')
  const b = linesOf(after ?? '')
  const head = [`diff --git a/${path} b/${path}`]
  if (before === undefined) head.push('new file mode 100644', '--- /dev/null', `+++ b/${path}`)
  else if (after === undefined) head.push('deleted file mode 100644', `--- a/${path}`, '+++ /dev/null')
  else head.push(`--- a/${path}`, `+++ b/${path}`)
  head.push(`@@ -${a.length ? 1 : 0},${a.length} +${b.length ? 1 : 0},${b.length} @@`)
  return [...head, ...diffLines(a, b).map(([k, l]) => `${k}${l}`)].join('\n')
}

// ─── Git ─────────────────────────────────────────────────────────────────────────────────────────────

const commitOf = (repo: Repo, id: string | null | undefined) => (id ? (repo.commits.find((c) => c.id === id) ?? null) : null)
const headCommit = (repo: Repo) => commitOf(repo, repo.branches[repo.head])
const headTree = (repo: Repo): Files => headCommit(repo)?.snapshot ?? {}
const short = (id: string) => id.slice(0, 7)

function ancestors(repo: Repo, id: string | null): Set<string> {
  const seen = new Set<string>()
  const stack = id ? [id] : []
  while (stack.length) {
    const at = stack.pop()!
    if (seen.has(at)) continue
    seen.add(at)
    stack.push(...(commitOf(repo, at)?.parents ?? []))
  }
  return seen
}

function mergeBase(repo: Repo, a: string, b: string): string | null {
  const mine = ancestors(repo, a)
  // Walk back from b, nearest first.
  const queue = [b]
  const seen = new Set<string>()
  while (queue.length) {
    const at = queue.shift()!
    if (mine.has(at)) return at
    if (seen.has(at)) continue
    seen.add(at)
    queue.push(...(commitOf(repo, at)?.parents ?? []))
  }
  return null
}

/** What's in the working folder that Git can see (not ignored), by path from the repository's folder. */
function working(dev: Dev, repo: Repo): Files {
  return ignoreFilter(treeOf(dev.files, repo.root), ignoreRules(dev.files, repo.root))
}

function statusLists(dev: Dev, repo: Repo) {
  const head = headTree(repo)
  const work = working(dev, repo)
  const staged: string[] = []
  const unstaged: string[] = []
  const untracked: string[] = []
  const conflicts = repo.merging?.conflicts ?? []
  for (const p of [...new Set([...Object.keys(head), ...Object.keys(repo.index)])].sort()) {
    if (conflicts.includes(p)) continue
    if (!(p in repo.index)) staged.push(`deleted:    ${p}`)
    else if (!(p in head)) staged.push(`new file:   ${p}`)
    else if (head[p] !== repo.index[p]) staged.push(`modified:   ${p}`)
  }
  for (const p of Object.keys(repo.index).sort()) {
    if (conflicts.includes(p)) continue
    if (!(p in work)) unstaged.push(`deleted:    ${p}`)
    else if (work[p] !== repo.index[p]) unstaged.push(`modified:   ${p}`)
  }
  const loose = Object.keys(work).filter((p) => !(p in repo.index)).sort()
  // A folder with nothing tracked in it shows once, as "folder/".
  const shown = new Set<string>()
  for (const p of loose) {
    const parts = p.split('/')
    let name = p
    for (let i = 1; i < parts.length; i++) {
      const folder = parts.slice(0, i).join('/')
      if (!Object.keys(repo.index).some((t) => t.startsWith(`${folder}/`))) {
        name = `${folder}/`
        break
      }
    }
    shown.add(name)
  }
  untracked.push(...[...shown].sort())
  return { staged, unstaged, untracked, conflicts }
}

const TAB = '        '

function status(dev: Dev, repo: Repo, shortForm: boolean): string {
  const { staged, unstaged, untracked, conflicts } = statusLists(dev, repo)
  if (shortForm) {
    const rows: string[] = []
    for (const c of conflicts) rows.push(`UU ${c}`)
    const code = (line: string) => ({ 'new file': 'A', modified: 'M', deleted: 'D' })[line.split(':')[0]!.trim()] ?? '?'
    const map = new Map<string, [string, string]>()
    for (const s of staged) map.set(s.split(/:\s+/)[1]!, [code(s), ' '])
    for (const u of unstaged) {
      const p = u.split(/:\s+/)[1]!
      map.set(p, [map.get(p)?.[0] ?? ' ', code(u)])
    }
    for (const [p, [x, y]] of [...map].sort()) rows.push(`${x}${y} ${p}`)
    for (const u of untracked) rows.push(`?? ${u}`)
    return rows.join('\n')
  }
  const out = [`On branch ${repo.head}`]
  const up = repo.upstream.includes(repo.head) && repo.remote?.branches[repo.head]
  if (up) {
    const ahead = [...ancestors(repo, repo.branches[repo.head] ?? null)].filter((id) => !ancestors(repo, repo.remote!.branches[repo.head]!).has(id)).length
    out.push(ahead ? `Your branch is ahead of 'origin/${repo.head}' by ${plural(ahead, 'commit')}.\n  (use "git push" to publish your local commits)` : `Your branch is up to date with 'origin/${repo.head}'.`)
  }
  if (!headCommit(repo)) out.push('', 'No commits yet')
  if (repo.merging) {
    out.push(
      '',
      conflicts.length ? 'You have unmerged paths.\n  (fix conflicts and run "git commit")\n  (use "git merge --abort" to abort the merge)' : 'All conflicts fixed but you are still merging.\n  (use "git commit" to conclude merge)',
    )
  }
  if (staged.length) out.push('', 'Changes to be committed:', '  (use "git restore --staged <file>..." to unstage)', ...staged.map((s) => `${TAB}${s}`))
  if (conflicts.length) out.push('', 'Unmerged paths:', '  (use "git add <file>..." to mark resolution)', ...conflicts.map((c) => `${TAB}both modified:   ${c}`))
  if (unstaged.length)
    out.push('', 'Changes not staged for commit:', '  (use "git add <file>..." to update what will be committed)', '  (use "git restore <file>..." to discard changes in working directory)', ...unstaged.map((s) => `${TAB}${s}`))
  if (untracked.length) out.push('', 'Untracked files:', '  (use "git add <file>..." to include in what will be committed)', ...untracked.map((s) => `${TAB}${s}`))
  if (!staged.length && !unstaged.length && !untracked.length && !conflicts.length) {
    out.push('', headCommit(repo) ? 'nothing to commit, working tree clean' : 'nothing to commit (create/copy files and use "git add" to track)')
  } else if (!staged.length && !conflicts.length && !repo.merging) {
    out.push('', unstaged.length ? 'no changes added to commit (use "git add" and/or "git commit -a")' : 'nothing added to commit but untracked files present (use "git add" to track)')
  }
  return out.join('\n')
}

function decorations(repo: Repo, id: string): string {
  const names: string[] = []
  for (const [b, at] of Object.entries(repo.branches)) if (at === id) names.push(b === repo.head ? `HEAD -> ${b}` : b)
  names.sort((a, b) => (a.startsWith('HEAD') ? -1 : b.startsWith('HEAD') ? 1 : a.localeCompare(b)))
  for (const [b, at] of Object.entries(repo.remote?.branches ?? {})) if (at === id) names.push(`origin/${b}`)
  return names.length ? ` (${names.join(', ')})` : ''
}

function log(repo: Repo, args: string[]): DevResult | string {
  if (!headCommit(repo)) return `fatal: your current branch '${repo.head}' does not have any commits yet`
  const oneline = args.includes('--oneline')
  const all = args.includes('--all')
  const nArg = args.find((a) => /^-\d+$/.test(a))
  const tips = all ? Object.values(repo.branches).filter((x): x is string => !!x) : [repo.branches[repo.head]!]
  let list = repo.commits.filter((c) => tips.some((t) => ancestors(repo, t).has(c.id))).reverse()
  if (nArg) list = list.slice(0, Number(nArg.slice(1)))
  if (oneline) return list.map((c) => `${short(c.id)}${decorations(repo, c.id)} ${c.message}`).join('\n')
  return list
    .map((c) => [`commit ${c.id}${decorations(repo, c.id)}`, ...(c.parents.length > 1 ? [`Merge: ${c.parents.map(short).join(' ')}`] : []), 'Author: Ada Obi <ada@example.com>', `Date:   ${c.date}`, '', `    ${c.message}`].join('\n'))
    .join('\n\n')
}

/** Copies a branch's files into the working folder, leaving untracked files alone. */
function checkoutTree(dev: Dev, repo: Repo, to: Files): Files {
  const files = { ...dev.files }
  for (const p of Object.keys(headTree(repo))) delete files[join(repo.root, p)]
  for (const [p, t] of Object.entries(to)) files[join(repo.root, p)] = t
  return files
}

function dirsFor(files: Files, dirs: string[]): string[] {
  const out = new Set(dirs)
  for (const p of Object.keys(files)) {
    const parts = p.split('/')
    for (let i = 1; i < parts.length; i++) out.add(parts.slice(0, i).join('/'))
  }
  return [...out]
}

function switchTo(dev: Dev, repo: Repo, branch: string): DevResult {
  const target = commitOf(repo, repo.branches[branch])?.snapshot ?? {}
  const head = headTree(repo)
  const work = working(dev, repo)
  const dirty = [...new Set([...Object.keys(head), ...Object.keys(repo.index), ...Object.keys(work).filter((p) => p in repo.index)])].filter(
    (p) => (work[p] !== head[p] || repo.index[p] !== head[p]) && target[p] !== head[p],
  )
  if (dirty.length)
    return bad(dev, `error: Your local changes to the following files would be overwritten by checkout:\n${dirty.map((p) => `${TAB}${p}`).join('\n')}\nPlease commit your changes or stash them before you switch branches.\nAborting`)
  // Uncommitted changes that don't clash come along, as in real Git.
  const files = checkoutTree(dev, repo, target)
  for (const p of Object.keys(work)) if (p in repo.index && work[p] !== head[p] && target[p] === head[p]) files[join(repo.root, p)] = work[p]!
  const index = { ...target }
  for (const p of Object.keys(repo.index)) if (repo.index[p] !== head[p] && target[p] === head[p]) index[p] = repo.index[p]!
  const next = { ...dev, files, dirs: dirsFor(files, dev.dirs), repo: { ...repo, head: branch, index }, touched: Object.keys(target).filter((p) => target[p] !== head[p]).map((p) => join(repo.root, p)) }
  return ok(next, `Switched to branch '${branch}'`)
}

function merge(dev: Dev, repo: Repo, branch: string): DevResult {
  if (repo.merging) return bad(dev, 'error: Merging is not possible because you have unmerged files.\nhint: Fix them up in the work tree, and then use \'git add <file>\'\nhint: as appropriate to mark resolution and make a commit.\nfatal: Exiting because of an unresolved conflict.')
  const theirs = repo.branches[branch]
  if (theirs === undefined) return bad(dev, `merge: ${branch} - not something we can merge`)
  const ours = repo.branches[repo.head]
  if (!theirs || !ours) return bad(dev, 'fatal: nothing to merge yet: make a commit first')
  if (ancestors(repo, ours).has(theirs)) return ok(dev, 'Already up to date.')
  const ourTree = headTree(repo)
  const theirTree = commitOf(repo, theirs)!.snapshot
  if (ancestors(repo, theirs).has(ours)) {
    const files = checkoutTree(dev, repo, theirTree)
    const next = { ...dev, files, dirs: dirsFor(files, dev.dirs), repo: { ...repo, branches: { ...repo.branches, [repo.head]: theirs }, index: { ...theirTree } }, touched: Object.keys(theirTree).filter((p) => theirTree[p] !== ourTree[p]).map((p) => join(repo.root, p)) }
    return ok(next, `Updating ${short(ours)}..${short(theirs)}\nFast-forward\n${stat(ourTree, theirTree)}`)
  }
  const baseTree = commitOf(repo, mergeBase(repo, ours, theirs))?.snapshot ?? {}
  const result: Files = {}
  const conflicts: string[] = []
  const notes: string[] = []
  for (const p of [...new Set([...Object.keys(ourTree), ...Object.keys(theirTree), ...Object.keys(baseTree)])].sort()) {
    const [o, t, b] = [ourTree[p], theirTree[p], baseTree[p]]
    if (o === t) {
      if (o !== undefined) result[p] = o
    } else if (o === b) {
      if (t !== undefined) result[p] = t
    } else if (t === b) {
      if (o !== undefined) result[p] = o
    } else {
      notes.push(`Auto-merging ${p}`)
      const merged = mergeText(b ?? '', o ?? '', t ?? '', branch)
      result[p] = merged.text
      if (merged.conflict) {
        conflicts.push(p)
        notes.push(`CONFLICT (content): Merge conflict in ${p}`)
      }
    }
  }
  const files = checkoutTree(dev, repo, result)
  const touched = Object.keys(result).filter((p) => result[p] !== ourTree[p]).map((p) => join(repo.root, p))
  if (conflicts.length) {
    const index = { ...result }
    for (const c of conflicts) index[c] = ourTree[c] ?? ''
    const next = { ...dev, files, dirs: dirsFor(files, dev.dirs), touched, repo: { ...repo, index, merging: { branch, theirs, conflicts } } }
    return bad(next, [...notes, 'Automatic merge failed; fix conflicts and then commit the result.'].join('\n'))
  }
  const c = makeCommit(repo, `Merge branch '${branch}'`, result, [ours, theirs])
  const next = { ...dev, files, dirs: dirsFor(files, dev.dirs), touched, repo: { ...repo, commits: [...repo.commits, c], branches: { ...repo.branches, [repo.head]: c.id }, index: { ...result } } }
  return ok(next, [...notes, "Merge made by the 'ort' strategy.", stat(ourTree, result)].join('\n'))
}

/** A line-by-line three-way merge of small files with the same number of lines; otherwise the whole file conflicts. */
function mergeText(base: string, ours: string, theirs: string, branch: string): { text: string; conflict: boolean } {
  const [b, o, t] = [linesOf(base), linesOf(ours), linesOf(theirs)]
  const block = (mine: string[], other: string[]) => ['<<<<<<< HEAD', ...mine, '=======', ...other, `>>>>>>> ${branch}`]
  if (b.length !== o.length || b.length !== t.length) return { text: `${block(o, t).join('\n')}\n`, conflict: true }
  const out: string[] = []
  let conflict = false
  let mine: string[] = []
  let other: string[] = []
  const flush = () => {
    if (mine.length || other.length) out.push(...block(mine, other))
    mine = []
    other = []
  }
  for (let i = 0; i < b.length; i++) {
    const [x, y, z] = [b[i]!, o[i]!, t[i]!]
    if (y === z || z === x) {
      flush()
      out.push(y)
    } else if (y === x) {
      flush()
      out.push(z)
    } else {
      conflict = true
      mine.push(y)
      other.push(z)
    }
  }
  flush()
  return { text: `${out.join('\n')}\n`, conflict }
}

function git(dev: Dev, args: string[]): DevResult {
  const [sub, ...rest] = args
  const repo = repoHere(dev)
  if (!sub || sub === 'help' || sub === '--help')
    return ok(dev, 'usage: git <command>\n\nThe commands this practice terminal knows:\n  init  status  add  commit  log  diff  restore  rm\n  branch  switch  checkout  merge  remote  push  pull  config')
  if (sub === '--version' || sub === 'version') return ok(dev, 'git version 2.51.0')
  if (sub === 'config') {
    if (rest.includes('user.name') && rest.length <= 2) return ok(dev, 'Ada Obi')
    if (rest.includes('user.email') && rest.length <= 2) return ok(dev, 'ada@example.com')
    return ok(dev)
  }
  if (sub === 'init') {
    if (dev.repo && dev.repo.root === dev.cwd) return ok(dev, `Reinitialized existing Git repository in ${showPath(dev.cwd)}/.git/`)
    if (dev.repo) return bad(dev, `This practice terminal keeps one repository, in ${showPath(dev.repo.root)}. Use Reset to start again.`)
    if (dev.cwd === '') return bad(dev, 'Make the repository inside a project folder, not your whole home folder: cd cafe-api first.')
    const next: Dev = { ...dev, repo: { root: dev.cwd, commits: [], branches: { main: null }, head: 'main', index: {}, remote: null, upstream: [], merging: null }, touched: [] }
    return ok(next, `Initialized empty Git repository in ${showPath(dev.cwd)}/.git/`)
  }
  if (!repo) return bad(dev, 'fatal: not a git repository (or any of the parent directories): .git')
  const rel = (typed: string) => {
    const p = resolve(dev, typed)
    if (p === null) return null
    if (p === repo.root) return ''
    return p.startsWith(`${repo.root}/`) ? p.slice(repo.root.length + 1) : null
  }

  switch (sub) {
    case 'status':
      return ok(dev, status(dev, repo, rest.includes('-s') || rest.includes('--short')))
    case 'add': {
      if (!rest.length) return bad(dev, 'Nothing specified, nothing added.\nhint: Maybe you wanted to say \'git add .\'?')
      const work = working(dev, repo)
      const all = treeOf(dev.files, repo.root)
      const index = { ...repo.index }
      const touched: string[] = []
      for (const typed of rest.filter((a) => !a.startsWith('-') || a === '-A')) {
        const p = typed === '-A' ? '' : rel(typed)
        if (p === null) return bad(dev, `fatal: ${typed}: '${typed}' is outside repository at '${showPath(repo.root)}'`)
        const matches = [...new Set([...Object.keys(work), ...Object.keys(index)])].filter((f) => p === '' || f === p || f.startsWith(`${p}/`))
        if (!matches.length) {
          if (Object.keys(all).some((f) => f === p || f.startsWith(`${p}/`)))
            return bad(dev, `The following paths are ignored by one of your .gitignore files:\n${p}\nhint: Use -f if you really want to add them.`)
          return bad(dev, `fatal: pathspec '${typed}' did not match any files`)
        }
        for (const f of matches) {
          if (f in work) index[f] = work[f]!
          else delete index[f]
          touched.push(join(repo.root, f))
        }
      }
      const conflicts = repo.merging ? repo.merging.conflicts.filter((c) => !touched.includes(join(repo.root, c))) : []
      return ok({ ...dev, touched, repo: { ...repo, index, merging: repo.merging ? { ...repo.merging, conflicts } : null } })
    }
    case 'commit': {
      if (repo.merging?.conflicts.length) return bad(dev, 'error: Committing is not possible because you have unmerged files.\nhint: Fix them up in the work tree, and then use \'git add <file>\'\nhint: as appropriate to mark resolution and make a commit.\nfatal: Exiting because of an unresolved conflict.')
      const at = rest.findIndex((a) => a === '-m' || a === '-am' || a === '-a')
      const all = rest.includes('-a') || rest.includes('-am')
      const message = rest[rest.findIndex((a) => a === '-m' || a === '-am') + 1]
      let index = repo.index
      if (all) {
        const work = working(dev, repo)
        index = { ...index }
        for (const p of Object.keys(index)) {
          if (p in work) index[p] = work[p]!
          else delete index[p]
        }
      }
      if (!repo.merging && (at === -1 || !message || !rest.some((a) => a === '-m' || a === '-am')))
        return bad(dev, "Real Git opens a text editor here for the commit message. This practice terminal can't, so give the message with -m:\n  git commit -m 'Add the menu route'")
      const head = headTree(repo)
      if (!repo.merging && JSON.stringify(Object.entries(index).sort()) === JSON.stringify(Object.entries(head).sort()))
        return bad(dev, status(dev, { ...repo, index }, false))
      const parent = repo.branches[repo.head]
      const parents = repo.merging ? [parent!, repo.merging.theirs] : parent ? [parent] : []
      const text = message ?? `Merge branch '${repo.merging!.branch}'`
      const c = makeCommit(repo, text, index, parents)
      const next = { ...dev, repo: { ...repo, commits: [...repo.commits, c], branches: { ...repo.branches, [repo.head]: c.id }, index: { ...index }, merging: null }, touched: [] }
      const created = Object.keys(index).filter((p) => !(p in head)).sort().map((p) => ` create mode 100644 ${p}`)
      return ok(next, [`[${repo.head}${parent ? '' : ' (root-commit)'} ${short(c.id)}] ${text}`, summary(head, index), ...created].join('\n'))
    }
    case 'log': {
      const r = log(repo, rest)
      return typeof r === 'string' ? (r.startsWith('fatal') ? bad(dev, r) : ok(dev, r)) : r
    }
    case 'diff': {
      const staged = rest.includes('--staged') || rest.includes('--cached')
      const work = working(dev, repo)
      const [from, to] = staged ? [headTree(repo), repo.index] : [repo.index, Object.fromEntries(Object.entries(work).filter(([p]) => p in repo.index))]
      const paths = [...new Set([...Object.keys(from), ...Object.keys(to)])].sort().filter((p) => from[p] !== to[p])
      return ok(dev, paths.map((p) => unifiedDiff(p, from[p], to[p])).join('\n'))
    }
    case 'restore': {
      const stagedOnly = rest.includes('--staged')
      const targets = rest.filter((a) => !a.startsWith('--'))
      if (!targets.length) return bad(dev, 'fatal: you must specify path(s) to restore')
      const head = headTree(repo)
      let next = dev
      for (const typed of targets) {
        const p = rel(typed)
        const paths = p === null ? [] : Object.keys({ ...head, ...repo.index }).filter((f) => p === '' || f === p || f.startsWith(`${p}/`))
        if (!paths.length) return bad(dev, `error: pathspec '${typed}' did not match any file(s) known to git`)
        for (const f of paths) {
          if (stagedOnly) {
            const index = { ...next.repo!.index }
            if (f in head) index[f] = head[f]!
            else delete index[f]
            next = { ...next, repo: { ...next.repo!, index } }
          } else if (f in next.repo!.index) next = { ...next, files: { ...next.files, [join(repo.root, f)]: next.repo!.index[f]! } }
        }
        next = { ...next, touched: paths.map((f) => join(repo.root, f)) }
      }
      return ok({ ...next, dirs: dirsFor(next.files, next.dirs) })
    }
    case 'rm': {
      const cached = rest.includes('--cached')
      const recursive = rest.includes('-r')
      const targets = rest.filter((a) => !a.startsWith('-'))
      const index = { ...repo.index }
      const files = { ...dev.files }
      const out: string[] = []
      for (const typed of targets) {
        const p = rel(typed)
        const hits = p === null ? [] : Object.keys(index).filter((f) => f === p || f.startsWith(`${p}/`))
        if (!hits.length) return bad(dev, `fatal: pathspec '${typed}' did not match any files`)
        if (hits.some((f) => f !== p) && !recursive) return bad(dev, `fatal: not removing '${typed}' recursively without -r`)
        for (const f of hits) {
          delete index[f]
          if (!cached) delete files[join(repo.root, f)]
          out.push(`rm '${f}'`)
        }
      }
      return ok({ ...dev, files, repo: { ...repo, index } }, out.join('\n'))
    }
    case 'branch': {
      const del = rest.find((a) => a === '-d' || a === '-D')
      const names = rest.filter((a) => !a.startsWith('-'))
      if (del) {
        const name = names[0]
        if (!name || !(name in repo.branches)) return bad(dev, `error: branch '${name ?? ''}' not found`)
        if (name === repo.head) return bad(dev, `error: cannot delete branch '${name}' used by worktree at '${showPath(repo.root)}'`)
        if (del === '-d' && !ancestors(repo, repo.branches[repo.head] ?? null).has(repo.branches[name]!))
          return bad(dev, `error: the branch '${name}' is not fully merged\nhint: If you are sure you want to delete it, run 'git branch -D ${name}'`)
        const branches = { ...repo.branches }
        delete branches[name]
        return ok({ ...dev, repo: { ...repo, branches } }, `Deleted branch ${name} (was ${short(repo.branches[name]!)}).`)
      }
      if (!names.length) return ok(dev, Object.keys(repo.branches).sort().map((b) => (b === repo.head ? `* ${b}` : `  ${b}`)).join('\n'))
      const name = names[0]!
      if (!headCommit(repo)) return bad(dev, `fatal: not a valid object name: '${repo.head}'`)
      if (!/^[\w./-]+$/.test(name)) return bad(dev, `fatal: '${name}' is not a valid branch name`)
      if (name in repo.branches) return bad(dev, `fatal: a branch named '${name}' already exists`)
      return ok({ ...dev, repo: { ...repo, branches: { ...repo.branches, [name]: repo.branches[repo.head]! } } })
    }
    case 'switch':
    case 'checkout': {
      const create = rest.includes('-c') || rest.includes('-b')
      const name = rest.find((a) => !a.startsWith('-'))
      if (!name) return bad(dev, 'fatal: missing branch or commit argument')
      if (sub === 'checkout' && !create && !(name in repo.branches)) {
        const p = rel(name)
        if (p !== null && p in repo.index) return git(dev, ['restore', name])
      }
      if (create) {
        if (name in repo.branches) return bad(dev, `fatal: a branch named '${name}' already exists`)
        if (!/^[\w./-]+$/.test(name)) return bad(dev, `fatal: '${name}' is not a valid branch name`)
        const next = { ...dev, repo: { ...repo, branches: { ...repo.branches, [name]: repo.branches[repo.head] ?? null }, head: name } }
        return ok(next, `Switched to a new branch '${name}'`)
      }
      if (!(name in repo.branches)) return bad(dev, sub === 'switch' ? `fatal: invalid reference: ${name}` : `error: pathspec '${name}' did not match any file(s) known to git`)
      if (name === repo.head) return ok(dev, `Already on '${name}'`)
      return switchTo(dev, repo, name)
    }
    case 'merge': {
      if (rest.includes('--abort')) {
        if (!repo.merging) return bad(dev, 'fatal: There is no merge to abort (MERGE_HEAD missing).')
        const files = checkoutTree(dev, repo, headTree(repo))
        return ok({ ...dev, files, repo: { ...repo, index: { ...headTree(repo) }, merging: null } })
      }
      const name = rest.find((a) => !a.startsWith('-'))
      if (!name) return bad(dev, 'fatal: No remote for the current branch.')
      return merge(dev, repo, name)
    }
    case 'remote': {
      if (rest[0] === 'add') {
        const [, name, url] = rest
        if (!name || !url) return bad(dev, 'usage: git remote add <name> <url>')
        if (repo.remote) return bad(dev, `error: remote ${name} already exists.`)
        return ok({ ...dev, repo: { ...repo, remote: { url, branches: {} } } })
      }
      if (rest[0] === '-v') return ok(dev, repo.remote ? `origin\t${repo.remote.url} (fetch)\norigin\t${repo.remote.url} (push)` : '')
      return ok(dev, repo.remote ? 'origin' : '')
    }
    case 'push': {
      if (!repo.remote)
        return bad(dev, "fatal: No configured push destination.\nEither specify the URL from the command-line or configure a remote repository using\n\n    git remote add <name> <url>\n\nand then push using the remote name\n\n    git push <name>")
      const setUp = rest.includes('-u') || rest.includes('--set-upstream')
      const named = rest.filter((a) => !a.startsWith('-'))
      const branch = named[1] ?? repo.head
      if (!named.length && !repo.upstream.includes(repo.head))
        return bad(dev, `fatal: The current branch ${repo.head} has no upstream branch.\nTo push the current branch and set the remote as upstream, use\n\n    git push --set-upstream origin ${repo.head}\n`)
      const tip = repo.branches[branch]
      if (!tip) return bad(dev, `error: src refspec ${branch} does not match any\nerror: failed to push some refs to '${repo.remote.url}'`)
      const before = repo.remote.branches[branch]
      const lines = [`To ${repo.remote.url}`]
      if (before === tip) lines.splice(0, 1, 'Everything up-to-date')
      else lines.push(before ? `   ${short(before)}..${short(tip)}  ${branch} -> ${branch}` : ` * [new branch]      ${branch} -> ${branch}`)
      const upstream = setUp && !repo.upstream.includes(branch) ? [...repo.upstream, branch] : repo.upstream
      if (setUp) lines.push(`branch '${branch}' set up to track 'origin/${branch}'.`)
      if (!before && branch !== 'main') lines.splice(1, 0, 'remote:', `remote: Create a pull request for '${branch}' on GitHub by visiting:`, `remote:      ${repo.remote.url.replace(/\.git$/, '')}/pull/new/${branch}`, 'remote:')
      return ok({ ...dev, repo: { ...repo, upstream, remote: { ...repo.remote, branches: { ...repo.remote.branches, [branch]: tip } } } }, lines.join('\n'))
    }
    case 'pull':
    case 'fetch':
      if (!repo.remote) return bad(dev, "fatal: 'origin' does not appear to be a git repository\nfatal: Could not read from remote repository.")
      return ok(dev, sub === 'pull' ? 'Already up to date.' : '')
    case 'clone':
      return bad(dev, 'This practice terminal has no internet, so it can’t clone. On your own computer, git clone <url> copies a repository from GitHub.')
    default:
      return bad(dev, `git: '${sub}' is not a git command. See 'git --help'.`)
  }
}

// ─── node ────────────────────────────────────────────────────────────────────────────────────────────

/** Works out + - * / and brackets on plain numbers, and nothing else. */
function arithmetic(text: string): number | null {
  if (!/^[\d.\s+\-*/()]+$/.test(text)) return null
  let i = 0
  const s = text.replace(/\s+/g, '')
  const num = (): number => {
    if (s[i] === '(') {
      i++
      const v = expr()
      i++
      return v
    }
    if (s[i] === '-') {
      i++
      return -num()
    }
    const m = /^\d+(\.\d+)?/.exec(s.slice(i))
    if (!m) throw new Error('bad')
    i += m[0].length
    return Number(m[0])
  }
  const term = (): number => {
    let v = num()
    while (s[i] === '*' || s[i] === '/') v = s[i++] === '*' ? v * num() : v / num()
    return v
  }
  const expr = (): number => {
    let v = term()
    while (s[i] === '+' || s[i] === '-') v = s[i++] === '+' ? v + term() : v - term()
    return v
  }
  try {
    const v = expr()
    return i === s.length ? v : null
  } catch {
    return null
  }
}

/** Runs a file's console.log lines: strings, numbers, sums and process.argv. Enough to practise running programs. */
function node(dev: Dev, args: string[]): DevResult {
  if (args[0] === '--version' || args[0] === '-v') return ok(dev, 'v24.11.0')
  if (!args.length) return bad(dev, 'Welcome to Node.js v24.11.0.\nThis practice terminal can’t open the interactive Node prompt. Give it a file to run: node app.js')
  const path = resolve(dev, args[0]!)
  if (path === null || !isFile(dev, path)) {
    const shown = path === null ? args[0] : showPath(path)
    return bad(dev, `node:internal/modules/cjs/loader:1386\n  throw err;\n  ^\n\nError: Cannot find module '${shown}'\n    at Module._resolveFilename (node:internal/modules/cjs/loader:1383:15)\n    at node:internal/main/run_main_module:36:49 {\n  code: 'MODULE_NOT_FOUND',\n  requireStack: []\n}\n\nNode.js v24.11.0`)
  }
  const argv = ['/usr/bin/node', showPath(path), ...args.slice(1)]
  const text = dev.files[path]!
  if (path.endsWith('/app.js') && text === APP) return ok(dev, 'Order total: 6')
  const out: string[] = []
  for (const line of text.split('\n')) {
    const m = /^\s*console\.log\((.*)\)\s*;?\s*$/.exec(line)
    if (!m) continue
    const arg = m[1]!.trim()
    const quoted = /^(['"`])(.*)\1$/.exec(arg)
    if (quoted) {
      out.push(quoted[2]!.replace(/\$\{\s*process\.argv\[(\d)\]\s*\}/g, (_, n: string) => argv[Number(n)] ?? 'undefined'))
      continue
    }
    const argvOnly = /^process\.argv\[(\d)\]$/.exec(arg)
    if (argvOnly) {
      out.push(argv[Number(argvOnly[1])] ?? 'undefined')
      continue
    }
    const n = arithmetic(arg)
    out.push(n === null ? `(This practice terminal only runs simple console.log lines. Try the code steps for the rest.)` : String(n))
  }
  return ok(dev, out.join('\n'))
}

// ─── The shell ───────────────────────────────────────────────────────────────────────────────────────

const ok = (dev: Dev, out = ''): DevResult => ({ dev, out, error: false })
const bad = (dev: Dev, out: string): DevResult => ({ dev, out, error: true })

type Word = { text: string; quoted: boolean }

/** Splits a line into words, keeping quoted words together and > or >> as their own words. */
function split(line: string): Word[] {
  const out: Word[] = []
  const re = /"([^"]*)"|'([^']*)'|(>>|>)|([^\s'">]+)/g
  for (const m of line.matchAll(re)) {
    if (m[1] !== undefined || m[2] !== undefined) out.push({ text: m[1] ?? m[2] ?? '', quoted: true })
    else out.push({ text: m[3] ?? m[4] ?? '', quoted: false })
  }
  return out
}

const HELP = `The commands this practice terminal knows:
  pwd  ls  cd  mkdir  touch  cat  echo  rm  mv  clear
  node <file>   run a JavaScript file
  git ...       git status, add, commit, log, branch, switch, merge and more
Tab finishes a name. The up arrow brings back your last command.`

function runOne(dev: Dev, line: string): DevResult {
  const words = split(line)
  const redirect = words.findIndex((w) => !w.quoted && (w.text === '>' || w.text === '>>'))
  const plain = (redirect === -1 ? words : words.slice(0, redirect)).map((w) => w.text)
  const [cmd, ...args] = plain
  if (!cmd) return ok(dev)
  const fresh = { ...dev, touched: [] as string[] }

  if (cmd === 'echo') {
    const text = args.join(' ')
    if (redirect === -1) return ok(fresh, text)
    const target = words[redirect + 1]?.text
    if (!target) return bad(fresh, "bash: syntax error near unexpected token `newline'")
    const path = resolve(dev, target)
    if (path === null || isDir(dev, path)) return bad(fresh, `bash: ${target}: Is a directory`)
    const folder = path.split('/').slice(0, -1).join('/')
    if (!isDir(dev, folder)) return bad(fresh, `bash: ${target}: No such file or directory`)
    const before = words[redirect]!.text === '>>' ? (dev.files[path] ?? '') : ''
    return ok({ ...fresh, files: { ...dev.files, [path]: `${before}${text}\n` }, touched: [path] })
  }

  switch (cmd) {
    case 'help':
      return ok(fresh, HELP)
    case 'clear':
      return { ...ok(fresh), clear: true }
    case 'pwd':
      return ok(fresh, showPath(dev.cwd))
    case 'whoami':
      return ok(fresh, 'ada')
    case 'ls': {
      const all = args.includes('-a') || args.includes('-la') || args.includes('-al')
      const long = args.some((a) => /^-\w*l/.test(a))
      const target = args.find((a) => !a.startsWith('-'))
      const path = target === undefined ? dev.cwd : resolve(dev, target)
      if (path === null || (!isDir(dev, path) && !isFile(dev, path))) return bad(fresh, `ls: cannot access '${target}': No such file or directory`)
      if (isFile(dev, path)) return ok(fresh, target!)
      let names = childrenOf(dev, path).filter((n) => all || !n.startsWith('.'))
      if (all) names = ['.', '..', ...names.filter((n) => n !== '.git')]
      if (all && dev.repo?.root === path) names.splice(2, 0, '.git')
      if (long) return ok(fresh, names.map((n) => `${isDir(dev, join(path, n)) || n === '.' || n === '..' || n === '.git' ? 'drwxr-xr-x' : '-rw-r--r--'}  ada  ${n}`).join('\n'))
      return ok(fresh, names.join('  '))
    }
    case 'cd': {
      const target = args[0] ?? '~'
      const path = resolve(dev, target)
      if (path === null) return bad(fresh, 'This practice terminal only has Ada’s home folder, /home/ada.')
      if (isFile(dev, path)) return bad(fresh, `bash: cd: ${target}: Not a directory`)
      if (!isDir(dev, path)) return bad(fresh, `bash: cd: ${target}: No such file or directory`)
      return ok({ ...fresh, cwd: path })
    }
    case 'mkdir': {
      const names = args.filter((a) => !a.startsWith('-'))
      if (!names.length) return bad(fresh, 'mkdir: missing operand')
      let next = fresh
      for (const n of names) {
        const path = resolve(dev, n)
        if (path === null || isDir(next, path) || isFile(next, path)) return bad(fresh, `mkdir: cannot create directory ‘${n}’: File exists`)
        next = { ...next, dirs: [...next.dirs, path], touched: [...next.touched, path] }
      }
      return ok(next)
    }
    case 'touch': {
      if (!args.length) return bad(fresh, 'touch: missing file operand')
      let next = fresh
      for (const n of args) {
        const path = resolve(dev, n)
        if (path === null) return bad(fresh, `touch: cannot touch '${n}': Permission denied`)
        if (!isDir(next, path.split('/').slice(0, -1).join('/'))) return bad(fresh, `touch: cannot touch '${n}': No such file or directory`)
        if (!isFile(next, path)) next = { ...next, files: { ...next.files, [path]: '' }, touched: [...next.touched, path] }
      }
      return ok(next)
    }
    case 'cat': {
      if (!args.length) return bad(fresh, 'cat: missing file operand')
      const outs: string[] = []
      for (const n of args) {
        const path = resolve(dev, n)
        if (path !== null && isDir(dev, path)) return bad(fresh, `cat: ${n}: Is a directory`)
        if (path === null || !isFile(dev, path)) return bad(fresh, `cat: ${n}: No such file or directory`)
        outs.push(dev.files[path]!.replace(/\n$/, ''))
      }
      return ok(fresh, outs.join('\n'))
    }
    case 'rm': {
      const recursive = args.some((a) => /^-\w*r/i.test(a))
      const names = args.filter((a) => !a.startsWith('-'))
      if (!names.length) return bad(fresh, 'rm: missing operand')
      const files = { ...dev.files }
      let dirs = [...dev.dirs]
      for (const n of names) {
        const path = resolve(dev, n)
        if (path === null || path === '') return bad(fresh, `rm: refusing to remove '${n}'`)
        if (isDir(dev, path)) {
          if (!recursive) return bad(fresh, `rm: cannot remove '${n}': Is a directory`)
          for (const p of Object.keys(files)) if (p.startsWith(`${path}/`)) delete files[p]
          dirs = dirs.filter((d) => d !== path && !d.startsWith(`${path}/`))
        } else if (isFile(dev, path)) delete files[path]
        else return bad(fresh, `rm: cannot remove '${n}': No such file or directory`)
      }
      return ok({ ...fresh, files, dirs })
    }
    case 'mv': {
      const [from, to] = args
      if (!from || !to) return bad(fresh, 'mv: missing destination file operand')
      const a = resolve(dev, from)
      let b = resolve(dev, to)
      if (a === null || !isFile(dev, a)) return bad(fresh, `mv: cannot stat '${from}': No such file or directory`)
      if (b === null) return bad(fresh, `mv: cannot move '${from}' to '${to}': Permission denied`)
      if (isDir(dev, b)) b = join(b, a.split('/').pop()!)
      const files = { ...dev.files, [b]: dev.files[a]! }
      delete files[a]
      return ok({ ...fresh, files, touched: [b] })
    }
    case 'node':
      return node(fresh, args)
    case 'npm':
      return bad(fresh, 'npm needs the internet, which this practice terminal doesn’t have. Module 5 sets up npm on your own computer.')
    case 'git':
      return git(fresh, args)
    case 'nano':
    case 'vim':
    case 'vi':
    case 'code':
      return bad(fresh, `This practice terminal can't open an editor. Change a file with echo instead:\n  echo 'some text' > notes.txt    (replaces the file)\n  echo 'more text' >> notes.txt   (adds a line at the end)`)
    case 'dir':
    case 'cls':
      return bad(fresh, `bash: ${cmd}: command not found. That's a Windows command. On Linux and Mac, use ${cmd === 'dir' ? 'ls' : 'clear'}.`)
    default:
      return bad(fresh, `bash: ${cmd}: command not found`)
  }
}

/** Runs a line, including commands joined with && (each runs only if the one before worked). */
export function run(dev: Dev, line: string): DevResult {
  const parts = line.split(/\s*&&\s*/).filter(Boolean)
  let result: DevResult = ok(dev)
  const outs: string[] = []
  const touched: string[] = []
  for (const part of parts) {
    result = runOne(result.dev, part)
    if (result.out) outs.push(result.out)
    touched.push(...result.dev.touched)
    if (result.error || result.clear) break
  }
  return { ...result, out: outs.join('\n'), dev: { ...result.dev, touched } }
}

/** Finishes the last word of a command with the one file or folder name it can only be. */
export function complete(dev: Dev, draft: string): string | null {
  const m = /^(.*?)(\S*)$/.exec(draft)
  if (!m || !m[1]) return null
  const word = m[2]!
  const slash = word.lastIndexOf('/')
  const folderText = slash === -1 ? '' : word.slice(0, slash + 1)
  const start = word.slice(slash + 1)
  const folder = folderText ? resolve(dev, folderText) : dev.cwd
  if (folder === null) return null
  const hits = childrenOf(dev, folder).filter((n) => n.startsWith(start))
  if (hits.length !== 1) return null
  const name = hits[0]!
  return `${m[1]}${folderText}${name}${isDir(dev, join(folder, name)) ? '/' : ''}`
}

export type Row = { path: string; name: string; depth: number; dir: boolean; mark?: 'untracked' | 'modified' | 'staged' | 'conflict' | 'ignored' }

/** Every file and folder under home, in order, with its Git state inside the repository. */
export function tree(dev: Dev): Row[] {
  const repo = dev.repo
  const marks = new Map<string, Row['mark']>()
  if (repo) {
    const { staged, unstaged, untracked, conflicts } = statusLists(dev, repo)
    const pathOf = (l: string) => join(repo.root, l.split(/:\s+/)[1]!)
    for (const s of staged) marks.set(pathOf(s), 'staged')
    for (const u of unstaged) marks.set(pathOf(u), 'modified')
    for (const u of untracked) marks.set(join(repo.root, u.replace(/\/$/, '')), 'untracked')
    for (const c of conflicts) marks.set(join(repo.root, c), 'conflict')
    const all = treeOf(dev.files, repo.root)
    const seen = working(dev, repo)
    for (const p of Object.keys(all)) if (!(p in seen)) {
      const top = p.split('/')[0]!
      marks.set(join(repo.root, p.includes('/') && !Object.keys(seen).some((s) => s.startsWith(`${top}/`)) ? top : p), 'ignored')
    }
  }
  const rows: Row[] = []
  const walk = (dir: string, depth: number) => {
    for (const name of childrenOf(dev, dir)) {
      const path = join(dir, name)
      const isFolder = isDir(dev, path)
      rows.push({ path, name, depth, dir: isFolder, mark: marks.get(path) })
      if (isFolder && marks.get(path) !== 'ignored') walk(path, depth + 1)
    }
  }
  walk('', 0)
  return rows
}

/** The repository's commits, newest first, with the branch names on each, for the history panel. */
export function graph(dev: Dev): { id: string; message: string; labels: string[]; merge: boolean }[] {
  const repo = dev.repo
  if (!repo) return []
  const tips = Object.values(repo.branches).filter((x): x is string => !!x)
  const keep = new Set(tips.flatMap((t) => [...ancestors(repo, t)]))
  return repo.commits
    .filter((c) => keep.has(c.id))
    .reverse()
    .map((c) => ({
      id: short(c.id),
      message: c.message,
      merge: c.parents.length > 1,
      labels: [
        ...Object.entries(repo.branches).filter(([, at]) => at === c.id).map(([b]) => (b === repo.head ? `HEAD → ${b}` : b)),
        ...Object.entries(repo.remote?.branches ?? {}).filter(([, at]) => at === c.id).map(([b]) => `origin/${b}`),
      ],
    }))
}

/** Saves a file from the lab's editor, as a code editor would. */
export function saveFile(dev: Dev, path: string, text: string): Dev {
  const saved = text === '' || text.endsWith('\n') ? text : `${text}\n`
  return { ...dev, files: { ...dev.files, [path]: saved }, touched: [path] }
}
