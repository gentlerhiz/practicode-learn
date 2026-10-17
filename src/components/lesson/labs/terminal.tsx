'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

type Line = { cwd: string; cmd: string; out?: string; bad?: boolean }
type Scenario = {
  lines: Line[]
  tree: string[]
  cwd: string
  added?: string
  removed?: string
  says: string
  /** The project folder, when it isn't Mama Nkechi's website (Module 12 uses the dashboard). */
  root?: string
}

const HOME = '~/mama-nkechi'
const START = ['index.html', 'menu/', 'menu/drinks.html']

// Module 12: the currency dashboard, a Git repository, on its way to npm and Vite.
const DASH = '~/dashboard'
const ROOT = 'dashboard'
const FILES = ['index.html', 'script.js', 'styles.css']
const NPM = ['node_modules/', 'index.html', 'package-lock.json', 'package.json', 'script.js', 'styles.css']

/** Each command, as a short session in Mama Nkechi's website folder, with the folder afterwards. */
const SCENARIOS: Record<string, Scenario> = {
  pwd: {
    lines: [{ cwd: HOME, cmd: 'pwd', out: '/home/ada/mama-nkechi' }],
    tree: START,
    cwd: '',
    says: 'pwd (print working directory) shows the full path of the folder you are in. It changes nothing.',
  },
  ls: {
    lines: [{ cwd: HOME, cmd: 'ls', out: 'index.html  menu' }],
    tree: START,
    cwd: '',
    says: 'ls (list) shows what is in the folder you are in: one file and one folder here. It changes nothing.',
  },
  'cd menu': {
    lines: [
      { cwd: HOME, cmd: 'cd menu' },
      { cwd: `${HOME}/menu`, cmd: 'ls', out: 'drinks.html' },
    ],
    tree: START,
    cwd: 'menu/',
    says: 'cd (change directory) moves you into the menu folder. It prints nothing, but the prompt now ends in /menu.',
  },
  'cd ..': {
    lines: [
      { cwd: `${HOME}/menu`, cmd: 'cd ..' },
      { cwd: HOME, cmd: 'pwd', out: '/home/ada/mama-nkechi' },
    ],
    tree: START,
    cwd: '',
    says: 'cd .. moves you up one folder: from menu back to mama-nkechi. Two dots always mean the folder above.',
  },
  'mkdir images': {
    lines: [
      { cwd: HOME, cmd: 'mkdir images' },
      { cwd: HOME, cmd: 'ls', out: 'images  index.html  menu' },
    ],
    tree: ['images/', ...START],
    cwd: '',
    added: 'images/',
    says: 'mkdir (make directory) creates a new, empty folder called images.',
  },
  'touch about.html': {
    lines: [
      { cwd: HOME, cmd: 'touch about.html' },
      { cwd: HOME, cmd: 'ls', out: 'about.html  index.html  menu' },
    ],
    tree: ['about.html', ...START],
    cwd: '',
    added: 'about.html',
    says: 'touch creates a new, empty file called about.html. Open it in your editor to write in it.',
  },
  'mv about.html menu/': {
    lines: [
      { cwd: HOME, cmd: 'mv about.html menu/' },
      { cwd: HOME, cmd: 'ls menu', out: 'about.html  drinks.html' },
    ],
    tree: ['index.html', 'menu/', 'menu/about.html', 'menu/drinks.html'],
    cwd: '',
    added: 'menu/about.html',
    says: 'mv (move) moves about.html into the menu folder. The same command renames a file: mv old.html new.html.',
  },
  'rm about.html': {
    lines: [
      { cwd: HOME, cmd: 'rm about.html' },
      { cwd: HOME, cmd: 'ls', out: 'index.html  menu' },
    ],
    tree: ['about.html', ...START],
    cwd: '',
    removed: 'about.html',
    says: 'rm (remove) deletes about.html for good. There is no recycle bin in the terminal, so check before you press Enter.',
  },
  'git branch': {
    lines: [{ cwd: DASH, cmd: 'git branch', out: '  add-rates\n* main' }],
    tree: FILES,
    cwd: '',
    root: ROOT,
    says: 'git branch lists the branches. The star marks the one you are on: main. It changes nothing.',
  },
  'git switch -c add-rates': {
    lines: [
      { cwd: DASH, cmd: 'git switch -c add-rates', out: "Switched to a new branch 'add-rates'" },
      { cwd: DASH, cmd: 'git branch', out: '* add-rates\n  main' },
    ],
    tree: FILES,
    cwd: '',
    root: ROOT,
    says: 'git switch -c makes a new branch called add-rates and moves you onto it. The files don’t change: the branch starts as a copy of main.',
  },
  'git switch main': {
    lines: [{ cwd: DASH, cmd: 'git switch main', out: "Switched to branch 'main'" }],
    tree: FILES,
    cwd: '',
    root: ROOT,
    says: 'git switch moves you to another branch, and your files change to match it. Commit your work first, or Git may refuse to switch.',
  },
  'git merge add-rates': {
    lines: [
      {
        cwd: DASH,
        cmd: 'git merge add-rates',
        out: 'Updating 3f2a1c9..8d41b07\nFast-forward\n script.js | 12 ++++++++++++\n 1 file changed, 12 insertions(+)',
      },
    ],
    tree: FILES,
    cwd: '',
    root: ROOT,
    says: 'git merge brings the commits from add-rates into the branch you are on, main. Nobody else changed main, so Git just moved main forward: a fast-forward.',
  },
  'git merge fix-header': {
    lines: [
      {
        cwd: DASH,
        cmd: 'git merge fix-header',
        out: 'Auto-merging index.html\nCONFLICT (content): Merge conflict in index.html\nAutomatic merge failed; fix conflicts and then commit the result.',
        bad: true,
      },
    ],
    tree: FILES,
    cwd: '',
    root: ROOT,
    says: 'Both branches changed the same line of index.html, so Git can’t choose. It marks the conflict in the file and waits for you to fix it, add it and commit.',
  },
  'git push -u origin add-rates': {
    lines: [
      {
        cwd: DASH,
        cmd: 'git push -u origin add-rates',
        out: "To github.com:ada/dashboard.git\n * [new branch]      add-rates -> add-rates\nremote: Create a pull request for 'add-rates' on GitHub by visiting:\nremote:   https://github.com/ada/dashboard/pull/new/add-rates",
      },
    ],
    tree: FILES,
    cwd: '',
    root: ROOT,
    says: 'Pushing a branch sends it to GitHub without touching main. GitHub even prints the link for opening a pull request.',
  },
  'npm init -y': {
    lines: [{ cwd: DASH, cmd: 'npm init -y', out: 'Wrote to /home/ada/dashboard/package.json' }],
    tree: ['index.html', 'package.json', 'script.js', 'styles.css'],
    cwd: '',
    root: ROOT,
    added: 'package.json',
    says: 'npm init -y creates package.json, the file that names your project and lists its packages and scripts. -y accepts every default answer.',
  },
  'npm install': {
    lines: [
      {
        cwd: DASH,
        cmd: 'npm install',
        out: 'added 12 packages, and audited 13 packages in 3s\nfound 0 vulnerabilities',
      },
    ],
    tree: NPM,
    cwd: '',
    root: ROOT,
    added: 'node_modules/',
    says: 'npm install downloads every package listed in package.json into node_modules, and records the exact versions in package-lock.json. Never commit node_modules.',
  },
  'npm run dev': {
    lines: [
      {
        cwd: DASH,
        cmd: 'npm run dev',
        out: '> dashboard@1.0.0 dev\n> vite\n\n  VITE ready in 312 ms\n\n  ➜  Local:   http://localhost:5173/',
      },
    ],
    tree: NPM,
    cwd: '',
    root: ROOT,
    says: 'npm run dev runs the dev script from package.json: here, Vite’s development server. Open the Local address, and the page updates by itself every time you save.',
  },
  'npm run build': {
    lines: [
      {
        cwd: DASH,
        cmd: 'npm run build',
        out: '> dashboard@1.0.0 build\n> vite build\n\n✓ 4 modules transformed.\ndist/index.html                 0.46 kB\ndist/assets/index-Bx3f9a2c.js   1.21 kB\n✓ built in 410ms',
      },
    ],
    tree: ['dist/', ...NPM],
    cwd: '',
    root: ROOT,
    added: 'dist/',
    says: 'npm run build makes the finished site in dist: small, fast files ready to upload. dist is rebuilt every time, so leave it out of Git too.',
  },
  'npx prettier --write .': {
    lines: [
      {
        cwd: DASH,
        cmd: 'npx prettier --write .',
        out: 'index.html 31ms (unchanged)\nscript.js 18ms\nstyles.css 9ms (unchanged)',
      },
    ],
    tree: NPM,
    cwd: '',
    root: ROOT,
    says: 'Prettier rewrote script.js in the project’s agreed style: spacing, quotes and line breaks. It changes how code looks, never what it does.',
  },
  'npx eslint .': {
    lines: [
      {
        cwd: DASH,
        cmd: 'npx eslint .',
        out: "/home/ada/dashboard/script.js\n  4:7  error  'total' is assigned a value but never used  no-unused-vars\n\n✖ 1 problem (1 error, 0 warnings)",
        bad: true,
      },
    ],
    tree: NPM,
    cwd: '',
    root: ROOT,
    says: 'ESLint reads your code for likely mistakes. Here, line 4 makes a variable that is never used: often a sign of a typo or a half-finished change.',
  },
  'cd mneu': {
    lines: [{ cwd: HOME, cmd: 'cd mneu', out: 'bash: cd: mneu: No such file or directory' }],
    tree: START,
    cwd: '',
    says: 'A typo. The terminal does exactly what you type, so mneu is not menu. Read the error: it names the problem.',
  },
}

/**
 * Explore lab: a command run in a simulated terminal, with the folder it changes. The value is the
 * command, for example "cd menu".
 */
export function Terminal({ value = 'pwd' }: LabProps) {
  const s = SCENARIOS[value.trim()] ?? SCENARIOS.pwd!
  const tree = s.tree

  return (
    <div className="flex flex-col gap-3">
      <div
        role="log"
        aria-label="Terminal"
        tabIndex={0}
        className="overflow-x-auto rounded-xl border border-line bg-[#0d0b16] p-3 font-mono text-[13px] leading-6 text-[#e8e6f0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fe"
      >
        {s.lines.map((l, i) => (
          <div key={i}>
            <p className="whitespace-pre">
              <span className="text-[#7ee2b8]">ada@laptop</span>:
              <span className="text-[#9fb0ff]">{l.cwd}</span>$ {l.cmd}
            </p>
            {l.out && (
              <p className={cn('whitespace-pre', (l.bad || /No such/.test(l.out)) && 'text-[#ff8f8f]')}>
                {l.out}
              </p>
            )}
          </div>
        ))}
      </div>
      <ul
        aria-label={`The ${s.root ?? 'mama-nkechi'} folder afterwards`}
        className="rounded-xl border border-line bg-row p-3 font-mono text-[13px] leading-7"
      >
        <li className={cn('px-1', s.cwd === '' && 'font-semibold text-fe-text')}>
          {s.root ?? 'mama-nkechi'}/
          {s.cwd === '' && <span className="ml-2 font-sans text-[11px]">you are here</span>}
        </li>
        {tree.map((item) => {
          const depth = item.replace(/\/$/, '').split('/').length
          const name = item.replace(/\/$/, '').split('/').pop()
          const isFolder = item.endsWith('/')
          const here = item === s.cwd
          const added = item === s.added
          const removed = item === s.removed
          return (
            <li
              key={item}
              style={{ paddingLeft: depth * 18 }}
              className={cn(
                'flex items-center gap-2 rounded-md px-1',
                here && 'font-semibold text-fe-text',
                added && 'bg-success/15',
                removed && 'text-ink-muted line-through',
              )}
            >
              <span aria-hidden="true">{isFolder ? '📁' : '📄'}</span>
              {name}
              {isFolder ? '/' : ''}
              {here && <span className="font-sans text-[11px]">you are here</span>}
              {added && <span className="font-sans text-[11px] text-success">new</span>}
              {removed && <span className="font-sans text-[11px] text-error no-underline">deleted</span>}
            </li>
          )
        })}
      </ul>
      <p aria-live="polite" className="text-[13px] text-ink-muted">
        {s.says}
      </p>
    </div>
  )
}
