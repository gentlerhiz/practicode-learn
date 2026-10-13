'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

type Line = { cwd: string; cmd: string; out?: string }
type Scenario = { lines: Line[]; tree: string[]; cwd: string; added?: string; removed?: string; says: string }

const HOME = '~/mama-nkechi'
const START = ['index.html', 'menu/', 'menu/drinks.html']

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
              <p className={cn('whitespace-pre', /No such/.test(l.out) && 'text-[#ff8f8f]')}>{l.out}</p>
            )}
          </div>
        ))}
      </div>
      <ul
        aria-label="The mama-nkechi folder afterwards"
        className="rounded-xl border border-line bg-row p-3 font-mono text-[13px] leading-7"
      >
        <li className={cn('px-1', s.cwd === '' && 'font-semibold text-fe-text')}>
          mama-nkechi/{s.cwd === '' && <span className="ml-2 font-sans text-[11px]">you are here</span>}
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
