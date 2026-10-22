// A practice file system and the everyday commands of a Linux or Mac terminal (bash) and the Windows
// Command Prompt (cmd), for the command-line lab. Messages copy the real ones, so what learners see here
// is what they'll see on a real computer. Pure functions: every command returns a new state.

export type Os = 'posix' | 'windows'

export type Entry = { name: string; dir: boolean; text?: string; children?: Entry[] }

export type Shell = {
  os: Os
  root: Entry
  /** Folder names from the root down to where you are. */
  cwd: string[]
  home: string[]
  /** Paths (as name lists joined by /) created or removed by the last command, for the tree to mark. */
  added: string[]
  removed: string[]
}

export type Result = { shell: Shell; out: string; error: boolean; clear?: boolean }

const file = (name: string, text = ''): Entry => ({ name, dir: false, text })
const dir = (name: string, children: Entry[] = []): Entry => ({ name, dir: true, children })

/** Ada's home folder: the same on both systems, under /home/ada or C:\Users\Ada. */
const homeFolder = (name: string) =>
  dir(name, [
    dir('Desktop', [file('notes.txt', 'Buy milk. Call Grandma. Back up photos.'), file('screenshot.png')]),
    dir('Documents', [dir('School', [file('essay.docx')]), file('budget.xlsx')]),
    dir('Downloads', [file('setup.exe'), file('photos.zip'), file('beach.jpg'), file('party.jpg')]),
    dir('Music'),
    dir('Pictures', [file('cat.jpg')]),
  ])

export function newShell(os: Os): Shell {
  const root = os === 'posix' ? dir('', [dir('home', [homeFolder('ada')])]) : dir('C:', [dir('Users', [homeFolder('Ada')])])
  const home = os === 'posix' ? ['home', 'ada'] : ['Users', 'Ada']
  return { os, root, cwd: home, home, added: [], removed: [] }
}

const same = (os: Os) => (a: string, b: string) => (os === 'windows' ? a.toLowerCase() === b.toLowerCase() : a === b)

function find(shell: Shell, path: string[]): Entry | null {
  let at: Entry = shell.root
  for (const part of path) {
    const next = at.children?.find((c) => same(shell.os)(c.name, part))
    if (!next) return null
    at = next
  }
  return at
}

/** The path as the system writes it. */
export function showPath(shell: Shell, path: string[] = shell.cwd): string {
  if (shell.os === 'windows') return path.length ? `C:\\${path.join('\\')}` : 'C:\\'
  return `/${path.join('/')}`
}

/** The prompt before each command, as bash and cmd show it. */
export function prompt(shell: Shell): string {
  if (shell.os === 'windows') return `${showPath(shell)}>`
  const inHome = shell.home.every((p, i) => shell.cwd[i] === p)
  const where = inHome ? `~${shell.cwd.slice(shell.home.length).map((p) => `/${p}`).join('')}` : showPath(shell)
  return `ada@laptop:${where}$`
}

/** Turns what the learner typed into a list of folder names from the root, or null if it climbs above it. */
function resolve(shell: Shell, raw: string): string[] {
  let text = raw
  const out = [...shell.cwd]
  if (shell.os === 'posix') {
    if (text === '~' || text.startsWith('~/')) {
      out.splice(0, out.length, ...shell.home)
      text = text.slice(1)
    }
    if (text.startsWith('/')) out.length = 0
  } else {
    text = text.replace(/\//g, '\\')
    if (/^c:/i.test(text)) {
      out.length = 0
      text = text.slice(2)
    }
    if (text.startsWith('\\')) out.length = 0
  }
  for (const part of text.split(shell.os === 'windows' ? '\\' : '/')) {
    if (!part || part === '.') continue
    if (part === '..') out.pop()
    else out.push(part)
  }
  // Use the names as they're stored, so Windows shows "Documents" even when you type "documents".
  const real: string[] = []
  let at: Entry | undefined = shell.root
  for (const part of out) {
    const next: Entry | undefined = at?.children?.find((c) => same(shell.os)(c.name, part))
    real.push(next ? next.name : part)
    at = next
  }
  return real
}

const clone = (e: Entry): Entry => ({ ...e, ...(e.children ? { children: e.children.map(clone) } : {}) })

function withChange(shell: Shell, change: (root: Entry) => void, added: string[][] = [], removed: string[][] = []): Shell {
  const root = clone(shell.root)
  change(root)
  return { ...shell, root, added: added.map((p) => p.join('/')), removed: removed.map((p) => p.join('/')) }
}

const parentAndName = (path: string[]) => ({ parent: path.slice(0, -1), name: path[path.length - 1] ?? '' })

function findIn(root: Entry, path: string[], os: Os): Entry | null {
  let at: Entry = root
  for (const part of path) {
    const next = at.children?.find((c) => same(os)(c.name, part))
    if (!next) return null
    at = next
  }
  return at
}

const sorted = (entries: Entry[]) => [...entries].sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }))

/** Splits a command line into words, keeping "quoted words" together. */
function words(line: string): string[] {
  return [...line.matchAll(/"([^"]*)"|'([^']*)'|(\S+)/g)].map((m) => m[1] ?? m[2] ?? m[3] ?? '')
}

/** Expands a * pattern in the last part of a path to the matching names, in order. */
function expand(shell: Shell, arg: string): string[] {
  if (!arg.includes('*')) return [arg]
  const sep = shell.os === 'windows' ? /[\\/]/ : /\//
  const parts = arg.split(sep)
  const pattern = parts.pop() ?? ''
  const folderText = parts.join(shell.os === 'windows' ? '\\' : '/')
  const folder = folderText ? resolve(shell, folderText) : shell.cwd
  const entry = find(shell, folder)
  const re = new RegExp(`^${pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`, shell.os === 'windows' ? 'i' : '')
  const hits = sorted(entry?.children ?? []).filter((c) => re.test(c.name))
  if (!hits.length) return [arg]
  return hits.map((c) => (folderText ? `${folderText}${shell.os === 'windows' ? '\\' : '/'}${c.name}` : c.name))
}

const ok = (shell: Shell, out = ''): Result => ({ shell, out, error: false })
const bad = (shell: Shell, out: string): Result => ({ shell, out, error: true })
const plain = (shell: Shell): Shell => ({ ...shell, added: [], removed: [] })

function posix(shell: Shell, cmd: string, args: string[]): Result {
  const flags = args.filter((a) => /^-[a-zA-Z]+$/.test(a)).join('')
  const rest = args.filter((a) => !/^-[a-zA-Z]+$/.test(a)).flatMap((a) => expand(shell, a))
  const recursive = /[rR]/.test(flags)
  switch (cmd) {
    case 'pwd':
      return ok(shell, showPath(shell))
    case 'ls': {
      const targets = rest.length ? rest : ['.']
      const blocks: string[] = []
      for (const t of targets) {
        const e = find(shell, resolve(shell, t))
        if (!e) return bad(shell, `ls: cannot access '${t}': No such file or directory`)
        const list = e.dir ? sorted(e.children ?? []).map((c) => c.name) : [e.name]
        blocks.push((targets.length > 1 && e.dir ? `${t}:\n` : '') + list.join('  '))
      }
      return ok(shell, blocks.join('\n\n'))
    }
    case 'cd': {
      const target = rest[0] ?? '~'
      const path = resolve(shell, target)
      const e = find(shell, path)
      if (!e) return bad(shell, `bash: cd: ${target}: No such file or directory`)
      if (!e.dir) return bad(shell, `bash: cd: ${target}: Not a directory`)
      return ok({ ...shell, cwd: path })
    }
    case 'mkdir': {
      if (!rest.length) return bad(shell, 'mkdir: missing operand')
      let next = shell
      const made: string[][] = []
      for (const t of rest) {
        const path = resolve(next, t)
        const { parent, name } = parentAndName(path)
        if (find(next, path)) return bad(next, `mkdir: cannot create directory '${t}': File exists`)
        if (!find(next, parent)) return bad(next, `mkdir: cannot create directory '${t}': No such file or directory`)
        next = withChange(next, (root) => findIn(root, parent, 'posix')!.children!.push(dir(name)), [...made, path])
        made.push(path)
      }
      return ok(next)
    }
    case 'touch': {
      if (!rest.length) return bad(shell, 'touch: missing file operand')
      let next = shell
      const made: string[][] = []
      for (const t of rest) {
        const path = resolve(next, t)
        const { parent, name } = parentAndName(path)
        if (find(next, path)) continue
        if (!find(next, parent)) return bad(next, `touch: cannot touch '${t}': No such file or directory`)
        next = withChange(next, (root) => findIn(root, parent, 'posix')!.children!.push(file(name)), [...made, path])
        made.push(path)
      }
      return ok(next)
    }
    case 'cat': {
      if (!rest.length) return bad(shell, 'cat: missing file operand')
      const e = find(shell, resolve(shell, rest[0]!))
      if (!e) return bad(shell, `cat: ${rest[0]}: No such file or directory`)
      if (e.dir) return bad(shell, `cat: ${rest[0]}: Is a directory`)
      return ok(plain(shell), e.text ?? '')
    }
    case 'cp':
    case 'mv':
      return copyOrMove(shell, cmd, rest, recursive)
    case 'rm': {
      if (flags.includes('i')) return bad(shell, 'In this practice lab, rm -i isn’t available. On a real computer it asks “remove regular file?” for each file, and waits for y or n.')
      if (!rest.length) return bad(shell, 'rm: missing operand')
      let next = shell
      const gone: string[][] = []
      for (const t of rest) {
        const path = resolve(next, t)
        const e = find(next, path)
        if (!e) return bad(next, `rm: cannot remove '${t}': No such file or directory`)
        if (e.dir && !recursive) return bad(next, `rm: cannot remove '${t}': Is a directory`)
        gone.push(path)
        next = withChange(next, (root) => remove(root, path, 'posix'), [], gone)
      }
      return ok(next)
    }
    case 'rmdir': {
      if (!rest.length) return bad(shell, 'rmdir: missing operand')
      const path = resolve(shell, rest[0]!)
      const e = find(shell, path)
      if (!e) return bad(shell, `rmdir: failed to remove '${rest[0]}': No such file or directory`)
      if (!e.dir) return bad(shell, `rmdir: failed to remove '${rest[0]}': Not a directory`)
      if (e.children?.length) return bad(shell, `rmdir: failed to remove '${rest[0]}': Directory not empty`)
      return ok(withChange(shell, (root) => remove(root, path, 'posix'), [], [path]))
    }
    default:
      return bad(shell, `${cmd}: command not found`)
  }
}

function remove(root: Entry, path: string[], os: Os) {
  const { parent, name } = parentAndName(path)
  const p = findIn(root, parent, os)!
  p.children = p.children!.filter((c) => !same(os)(c.name, name))
}

function copyOrMove(shell: Shell, cmd: 'cp' | 'mv' | 'copy' | 'move', args: string[], recursive: boolean): Result {
  const win = shell.os === 'windows'
  const name = cmd
  if (args.length < 2) {
    if (win) return bad(shell, 'The syntax of the command is incorrect.')
    return bad(shell, args.length ? `${name}: missing destination file operand after '${args[0]}'` : `${name}: missing file operand`)
  }
  const dest = args[args.length - 1]!
  const sources = args.slice(0, -1)
  let next = shell
  const added: string[][] = []
  const removed: string[][] = []
  for (const s of sources) {
    const from = resolve(next, s)
    const e = find(next, from)
    if (!e) return bad(next, win ? 'The system cannot find the file specified.' : `${name}: cannot stat '${s}': No such file or directory`)
    if (e.dir && cmd === 'cp' && !recursive) return bad(next, `cp: -r not specified; omitting directory '${s}'`)
    if (e.dir && cmd === 'copy') {
      return bad(next, 'In this practice lab, copy copies files. (Real Windows copies the files inside a folder; robocopy copies a whole folder.)')
    }
    const destPath = resolve(next, dest)
    const target = find(next, destPath)
    const to = target?.dir ? [...destPath, e.name] : destPath
    const { parent, name: newName } = parentAndName(to)
    if (!find(next, parent)) return bad(next, win ? 'The system cannot find the path specified.' : `${name}: cannot create regular file '${dest}': No such file or directory`)
    if (from.join('/') === to.join('/')) return bad(next, win ? 'The file cannot be copied onto itself.' : `${name}: '${s}' and '${dest}' are the same file`)
    if (target && !target.dir && e.dir) return bad(next, win ? 'Access is denied.' : `${name}: cannot overwrite non-directory '${dest}' with directory '${s}'`)
    if (e.dir && to.join('/').startsWith(`${from.join('/')}/`)) return bad(next, `${name}: cannot ${cmd === 'mv' || cmd === 'move' ? 'move' : 'copy'} a directory, '${s}', into itself`)
    const moving = cmd === 'mv' || cmd === 'move'
    added.push(to)
    if (moving) removed.push(from)
    next = withChange(
      next,
      (root) => {
        const copy = { ...clone(e), name: newName }
        if (moving) remove(root, from, shell.os)
        const p = findIn(root, parent, shell.os)!
        p.children = p.children!.filter((c) => !same(shell.os)(c.name, newName)).concat(copy)
      },
      added,
      removed,
    )
  }
  return ok(next, win ? (cmd === 'copy' ? `        ${sources.length} file(s) copied.` : `        ${sources.length} file(s) moved.`) : '')
}

const pad = (n: string, w: number) => (n.length >= w ? n : ' '.repeat(w - n.length) + n)

function windows(shell: Shell, cmd: string, args: string[]): Result {
  const switches = args.filter((a) => /^\/[a-z]$/i.test(a)).map((a) => a.toLowerCase())
  const rest = args.filter((a) => !/^\/[a-z]$/i.test(a)).flatMap((a) => expand(shell, a))
  switch (cmd.toLowerCase()) {
    case 'cd':
    case 'chdir': {
      if (!rest.length) return ok(shell, showPath(shell))
      const path = resolve(shell, rest.join(' '))
      const e = find(shell, path)
      if (!e) return bad(shell, 'The system cannot find the path specified.')
      if (!e.dir) return bad(shell, 'The directory name is invalid.')
      return ok({ ...plain(shell), cwd: path })
    }
    case 'dir': {
      const path = rest.length ? resolve(shell, rest[0]!) : shell.cwd
      const e = find(shell, path)
      if (!e) return bad(shell, 'File Not Found')
      const list = e.dir ? sorted(e.children ?? []) : [e]
      const lines = list.map((c) => `22/10/2026  09:15    ${c.dir ? '<DIR>         ' : pad(String(c.text?.length ?? 0), 14)} ${c.name}`)
      const files = list.filter((c) => !c.dir).length
      const dirs = list.filter((c) => c.dir).length
      return ok(
        shell,
        [` Directory of ${showPath(shell, e.dir ? path : path.slice(0, -1))}`, '', ...lines, pad(`${files} File(s)`, 16), pad(`${dirs} Dir(s)`, 15)].join('\n'),
      )
    }
    case 'mkdir':
    case 'md': {
      if (!rest.length) return bad(shell, 'The syntax of the command is incorrect.')
      const path = resolve(shell, rest[0]!)
      const { parent, name } = parentAndName(path)
      if (find(shell, path)) return bad(shell, `A subdirectory or file ${rest[0]} already exists.`)
      if (!find(shell, parent)) return bad(shell, 'The system cannot find the path specified.')
      return ok(withChange(shell, (root) => findIn(root, parent, 'windows')!.children!.push(dir(name)), [path]))
    }
    case 'type': {
      // type nul > name.txt makes an empty file, the Windows way.
      if (rest[0]?.toLowerCase() === 'nul' && rest[1] === '>' && rest[2]) {
        const path = resolve(shell, rest[2])
        const { parent, name } = parentAndName(path)
        if (!find(shell, parent)) return bad(shell, 'The system cannot find the path specified.')
        if (find(shell, path)) return ok(plain(shell))
        return ok(withChange(shell, (root) => findIn(root, parent, 'windows')!.children!.push(file(name)), [path]))
      }
      if (!rest.length) return bad(shell, 'The syntax of the command is incorrect.')
      const e = find(shell, resolve(shell, rest[0]!))
      if (!e) return bad(shell, 'The system cannot find the file specified.')
      if (e.dir) return bad(shell, 'Access is denied.')
      return ok(plain(shell), e.text ?? '')
    }
    case 'copy':
    case 'move':
      return copyOrMove(shell, cmd.toLowerCase() as 'copy' | 'move', rest, false)
    case 'ren':
    case 'rename': {
      if (rest.length !== 2) return bad(shell, 'The syntax of the command is incorrect.')
      const from = resolve(shell, rest[0]!)
      const e = find(shell, from)
      if (!e) return bad(shell, 'The system cannot find the file specified.')
      if (/[\\/]/.test(rest[1]!)) return bad(shell, 'The syntax of the command is incorrect.')
      const to = [...from.slice(0, -1), rest[1]!]
      if (find(shell, to)) return bad(shell, 'A duplicate file name exists, or the file cannot be found.')
      return ok(
        withChange(
          shell,
          (root) => {
            findIn(root, from, 'windows')!.name = rest[1]!
          },
          [to],
          [from],
        ),
      )
    }
    case 'del':
    case 'erase': {
      if (!rest.length) return bad(shell, 'The syntax of the command is incorrect.')
      let next = shell
      const gone: string[][] = []
      for (const t of rest) {
        const path = resolve(next, t)
        const e = find(next, path)
        if (!e) return bad(next, `Could Not Find ${showPath(next, path)}`)
        if (e.dir) return bad(next, 'In this practice lab, del deletes files. Use rmdir to remove a folder. (Real Windows would delete the files inside it, after asking.)')
        gone.push(path)
        next = withChange(next, (root) => remove(root, path, 'windows'), [], gone)
      }
      return ok(next)
    }
    case 'rmdir':
    case 'rd': {
      if (!rest.length) return bad(shell, 'The syntax of the command is incorrect.')
      const path = resolve(shell, rest[0]!)
      const e = find(shell, path)
      if (!e) return bad(shell, 'The system cannot find the file specified.')
      if (!e.dir) return bad(shell, 'The directory name is invalid.')
      if (e.children?.length && !switches.includes('/s')) return bad(shell, 'The directory is not empty.')
      return ok(withChange(shell, (root) => remove(root, path, 'windows'), [], [path]))
    }
    default:
      return bad(shell, `'${cmd}' is not recognized as an internal or external command,\noperable program or batch file.`)
  }
}

const HELP: Record<Os, string> = {
  posix: 'Try: pwd, ls, cd, mkdir, touch, cat, cp, mv, rm, rmdir, clear',
  windows: 'Try: cd, dir, mkdir, type, copy, move, ren, del, rmdir, cls',
}

/** Runs one command line. Two commands joined by && run in turn, stopping at the first error. */
export function run(shell: Shell, line: string): Result {
  const parts = line.split('&&').map((p) => p.trim())
  let state = plain(shell)
  const outs: string[] = []
  for (const part of parts) {
    if (!part) continue
    const [cmd = '', ...args] = words(part)
    let r: Result
    if (cmd === 'help') r = ok(state, HELP[state.os])
    else if ((state.os === 'posix' && cmd === 'clear') || (state.os === 'windows' && cmd.toLowerCase() === 'cls')) r = { shell: state, out: '', error: false, clear: true }
    else r = state.os === 'posix' ? posix(state, cmd, args) : windows(state, cmd, args)
    // A change made earlier in the line stays marked.
    state = { ...r.shell, added: [...new Set([...state.added, ...r.shell.added])], removed: [...new Set([...state.removed, ...r.shell.removed])] }
    if (r.out) outs.push(r.out)
    if (r.error || r.clear) return { shell: state, out: outs.join('\n'), error: r.error, clear: r.clear }
  }
  return { shell: state, out: outs.join('\n'), error: false }
}

/**
 * Tab completion: finishes the last word of a command line from the names in its folder, as far as
 * every match agrees. Returns null when there's nothing to add.
 */
export function complete(shell: Shell, draft: string): string | null {
  const m = /^(.*?)(\S*)$/.exec(draft)
  if (!m || !m[2] || !m[1]!.trim()) return null
  const word = m[2]
  const sepChar = shell.os === 'windows' ? '\\' : '/'
  const cut = Math.max(word.lastIndexOf('/'), shell.os === 'windows' ? word.lastIndexOf('\\') : -1)
  const folderText = cut >= 0 ? word.slice(0, cut + 1) : ''
  const prefix = word.slice(cut + 1)
  const folder = find(shell, folderText ? resolve(shell, folderText) : shell.cwd)
  const fold = (t: string) => (shell.os === 'windows' ? t.toLowerCase() : t)
  const hits = (folder?.children ?? []).filter((c) => fold(c.name).startsWith(fold(prefix)))
  if (!hits.length) return null
  let common = hits[0]!.name
  for (const h of hits) while (!fold(h.name).startsWith(fold(common))) common = common.slice(0, -1)
  const done = hits.length === 1 ? hits[0]!.name + (hits[0]!.dir ? sepChar : '') : common
  if (done.length <= prefix.length) return null
  return `${m[1]}${folderText}${done}`
}

/** Every folder and file, depth first, for drawing the tree. */
export function walk(shell: Shell): { path: string; name: string; depth: number; dir: boolean }[] {
  const out: { path: string; name: string; depth: number; dir: boolean }[] = []
  const visit = (e: Entry, path: string[], depth: number) => {
    for (const c of sorted(e.children ?? [])) {
      const p = [...path, c.name]
      out.push({ path: p.join('/'), name: c.name, depth, dir: c.dir })
      if (c.dir) visit(c, p, depth + 1)
    }
  }
  visit(shell.root, [], 0)
  return out
}
