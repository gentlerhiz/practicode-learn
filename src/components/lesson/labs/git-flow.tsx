'use client'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

type FileState = 'untracked' | 'modified' | 'clean'
type Commit = { id: string; message: string }
type View = {
  command: string
  output: string
  folder: FileState
  staged: boolean
  commits: Commit[]
  /** Commits on GitHub; null when the folder isn't connected to GitHub yet. */
  remote: Commit[] | null
  live?: string
  says: string
}

const C1 = { id: '3f2a1c9', message: 'Add the menu page' }
const C2 = { id: '8d41b07', message: 'Add the soups' }
const REPO = 'https://github.com/ada/mama-nkechi.git'

const VIEWS = {
  init: {
    command: 'git init',
    output: 'Initialized empty Git repository in /home/ada/mama-nkechi/.git/',
    folder: 'untracked',
    staged: false,
    commits: [],
    remote: null,
    says: 'Git now watches this folder. Nothing is saved yet: index.html is untracked, so Git just notices it.',
  },
  untracked: {
    command: 'git status',
    output:
      'On branch main\n\nNo commits yet\n\nUntracked files:\n        index.html\n\nnothing added to commit but untracked files present',
    folder: 'untracked',
    staged: false,
    commits: [],
    remote: null,
    says: 'git status tells you what Git sees. It changes nothing, so run it whenever you are unsure.',
  },
  add: {
    command: 'git add index.html',
    output: '',
    folder: 'clean',
    staged: true,
    commits: [],
    remote: null,
    says: 'git add puts this version of index.html in the staging area: the list of changes for your next save. Git prints nothing when it works.',
  },
  commit1: {
    command: "git commit -m 'Add the menu page'",
    output:
      '[main (root-commit) 3f2a1c9] Add the menu page\n 1 file changed, 18 insertions(+)\n create mode 100644 index.html',
    folder: 'clean',
    staged: false,
    commits: [C1],
    remote: null,
    says: 'git commit saves everything in the staging area as a snapshot, with your message and a short id. You can always go back to it.',
  },
  modified: {
    command: 'git status',
    output: 'On branch main\nChanges not staged for commit:\n        modified:   index.html',
    folder: 'modified',
    staged: false,
    commits: [C1],
    remote: null,
    says: 'You added the soups to index.html. Git sees the file has changed since the last commit, but nothing is saved until you add and commit again.',
  },
  commit2: {
    command: "git add index.html && git commit -m 'Add the soups'",
    output: '[main 8d41b07] Add the soups\n 1 file changed, 6 insertions(+)',
    folder: 'clean',
    staged: false,
    commits: [C1, C2],
    remote: null,
    says: 'A second snapshot. Your history now tells the story of the page, one commit at a time.',
  },
  log: {
    command: 'git log --oneline',
    output: '8d41b07 (HEAD -> main) Add the soups\n3f2a1c9 Add the menu page',
    folder: 'clean',
    staged: false,
    commits: [C1, C2],
    remote: null,
    says: 'git log lists your commits, newest first. Each line is an id and a message, which is why good messages matter.',
  },
  remote: {
    command: `git remote add origin ${REPO}`,
    output: '',
    folder: 'clean',
    staged: false,
    commits: [C1, C2],
    remote: [],
    says: 'This connects your folder to the empty repository you made on GitHub, and names it origin. Nothing is sent yet.',
  },
  push: {
    command: 'git push -u origin main',
    output: `To ${REPO}\n * [new branch]      main -> main\nbranch 'main' set up to track 'origin/main'.`,
    folder: 'clean',
    staged: false,
    commits: [C1, C2],
    remote: [C1, C2],
    says: 'git push sends your commits to GitHub. Now your work is backed up, and anyone you share the link with can see it. Next time, plain git push is enough.',
  },
  pushTooSoon: {
    command: 'git push',
    output: 'Everything up-to-date',
    folder: 'modified',
    staged: false,
    commits: [C1, C2],
    remote: [C1, C2],
    says: 'You changed index.html but didn’t commit, so there is nothing new to send. git push only sends commits, never unsaved changes.',
  },
  pages: {
    command: 'git push',
    output: `To ${REPO}\n   3f2a1c9..8d41b07  main -> main`,
    folder: 'clean',
    staged: false,
    commits: [C1, C2],
    remote: [C1, C2],
    live: 'https://ada.github.io/mama-nkechi/',
    says: 'With GitHub Pages switched on, every push to main updates the live site within a minute or two.',
  },
} satisfies Record<string, View>

type Key = keyof typeof VIEWS

/** The order a Diagram steps through. */
const DIAGRAM: Key[] = ['untracked', 'add', 'commit1', 'modified', 'commit2', 'push', 'pages']

/** Explore values, matched in this order. */
const BY_VALUE: [RegExp, Key][] = [
  [/before committing|too soon/i, 'pushTooSoon'],
  [/^git init/, 'init'],
  [/^git status.*(change|edit)|after editing/i, 'modified'],
  [/^git status/, 'untracked'],
  [/soups/i, 'commit2'],
  [/^git add/, 'add'],
  [/^git commit/, 'commit1'],
  [/^git log/, 'log'],
  [/^git remote/, 'remote'],
  [/pages/i, 'pages'],
  [/^git push/, 'push'],
]

const STATE_LABEL: Record<FileState, string> = {
  untracked: 'untracked',
  modified: 'changed, not saved',
  clean: 'saved',
}

function Column({ title, children, empty }: { title: string; children?: ReactNode; empty: string }) {
  return (
    <section
      aria-label={title}
      className="flex min-w-0 flex-col gap-2 rounded-xl border border-line bg-row p-3"
    >
      <h3 className="text-[12px] font-semibold text-ink-muted">{title}</h3>
      {children ?? <p className="text-[12px] text-ink-subtle">{empty}</p>}
    </section>
  )
}

function Commits({ list }: { list: Commit[] }) {
  return (
    <ol className="flex flex-col-reverse gap-1.5">
      {list.map((c) => (
        <li key={c.id} className="rounded-lg border border-line-subtle bg-sheet px-2 py-1 text-[12px]">
          <span className="font-mono text-fe-text">{c.id}</span> <span className="text-ink">{c.message}</span>
        </li>
      ))}
    </ol>
  )
}

/**
 * Git's places for your work: your folder, the staging area, your commits and GitHub. A Diagram steps
 * through DIAGRAM by `state`; an Explore names a command as its `value`.
 */
export function GitFlow({ state, value }: LabProps) {
  const key: Key = value
    ? (BY_VALUE.find(([re]) => re.test(value.trim()))?.[1] ?? 'untracked')
    : DIAGRAM[Math.min(Math.max(state ?? 0, 0), DIAGRAM.length - 1)]!
  const v: View = VIEWS[key]

  return (
    <div className="flex flex-col gap-3">
      <div
        role="log"
        aria-label="Terminal"
        tabIndex={0}
        className="overflow-x-auto rounded-xl border border-line bg-[#0d0b16] p-3 font-mono text-[12px] leading-5 text-[#e8e6f0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fe"
      >
        <p className="whitespace-pre-wrap [overflow-wrap:anywhere]">
          <span className="text-[#7ee2b8]">ada@laptop</span>:
          <span className="text-[#9fb0ff]">~/mama-nkechi</span>$ {v.command}
        </p>
        {v.output && <p className="whitespace-pre-wrap [overflow-wrap:anywhere]">{v.output}</p>}
      </div>
      <div className="grid grid-cols-2 gap-2 @min-[600px]:grid-cols-4">
        <Column title="Your folder" empty="">
          <p
            className={cn(
              'rounded-lg border px-2 py-1 font-mono text-[12px]',
              v.folder === 'clean' ? 'border-line-subtle text-ink' : 'border-error text-error',
            )}
          >
            index.html
            <span className="block font-sans text-[11px]">{STATE_LABEL[v.folder]}</span>
          </p>
        </Column>
        <Column title="Staging area" empty="Empty">
          {v.staged ? (
            <p className="rounded-lg border border-success px-2 py-1 font-mono text-[12px] text-success">
              index.html<span className="block font-sans text-[11px]">ready to commit</span>
            </p>
          ) : undefined}
        </Column>
        <Column title="Commits on your computer" empty="No commits yet">
          {v.commits.length ? <Commits list={v.commits} /> : undefined}
        </Column>
        <Column title="GitHub" empty={v.remote ? 'Connected, empty' : 'Not connected'}>
          {v.remote?.length ? <Commits list={v.remote} /> : undefined}
        </Column>
      </div>
      {v.live && (
        <p className="rounded-xl border border-success p-3 text-[13px] text-ink">
          <span className="font-semibold text-success">Live: </span>
          <span className="font-mono">{v.live}</span>
        </p>
      )}
      <p aria-live="polite" className="text-[13px] text-ink-muted">
        {v.says}
      </p>
    </div>
  )
}
