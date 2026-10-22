'use client'
import { File, Folder, FolderOpen, HardDrive } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

// The tree under the home folder. Each file's path is the folders above it.
const TREE: { name: string; depth: number; dir?: true }[] = [
  { name: 'Desktop', depth: 0, dir: true },
  { name: 'notes.txt', depth: 1 },
  { name: 'Documents', depth: 0, dir: true },
  { name: 'Money', depth: 1, dir: true },
  { name: 'budget.xlsx', depth: 2 },
  { name: 'School', depth: 1, dir: true },
  { name: 'essay.docx', depth: 2 },
  { name: 'Music', depth: 0, dir: true },
  { name: 'song.mp3', depth: 1 },
  { name: 'Pictures', depth: 0, dir: true },
  { name: 'Holiday', depth: 1, dir: true },
  { name: 'beach.jpg', depth: 2 },
]

/** The folders above each item, found by walking up the tree. */
function pathTo(name: string): string[] {
  const i = TREE.findIndex((t) => t.name === name)
  if (i < 0) return []
  const out = [TREE[i]!.name]
  let depth = TREE[i]!.depth
  for (let j = i - 1; j >= 0 && depth > 0; j--) {
    if (TREE[j]!.depth === depth - 1) {
      out.unshift(TREE[j]!.name)
      depth--
    }
  }
  return out
}

/** A file's place in the folder tree, and its path written three ways (Explore lab: value = a file name). */
export function PathFinder({ value = 'essay.docx' }: LabProps) {
  const target = TREE.some((t) => t.name === value && !t.dir) ? value : 'essay.docx'
  const path = pathTo(target)
  const onPath = (i: number) => {
    const p = pathTo(TREE[i]!.name)
    return p.length <= path.length && p.every((x, k) => x === path[k])
  }
  const ways = [
    { os: 'Windows', text: `C:\\Users\\Ada\\${path.join('\\')}`, sep: '\\' },
    { os: 'Mac', text: `/Users/ada/${path.join('/')}`, sep: '/' },
    { os: 'Linux', text: `/home/ada/${path.join('/')}`, sep: '/' },
  ]
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${target} is in ${path.slice(0, -1).join(', then ')}. On Windows its path is ${ways[0]!.text}.`}>
      <ul aria-hidden="true" className="flex flex-col rounded-xl border border-line bg-row p-3 font-mono text-[13px] leading-7">
        <li className="flex items-center gap-1.5 text-ink">
          <HardDrive size={14} className="shrink-0 text-ink-muted" />
          Ada’s home folder
        </li>
        {TREE.map((t, i) => {
          const lit = onPath(i)
          const Icon = t.dir ? (lit ? FolderOpen : Folder) : File
          return (
            <li
              key={t.name}
              style={{ paddingLeft: `${(t.depth + 1) * 16}px` }}
              className={cn('flex items-center gap-1.5 motion-safe:transition-colors motion-safe:duration-300', lit ? 'font-semibold text-it-text' : 'text-ink-muted')}
            >
              <Icon size={14} className="shrink-0" />
              {t.name}
              {t.name === target && <span className="font-sans text-[11px] font-normal text-ink">← this file</span>}
            </li>
          )
        })}
      </ul>
      <dl className="flex flex-col gap-1.5">
        {ways.map((w) => (
          <div key={w.os} className="grid grid-cols-[64px_minmax(0,1fr)] items-baseline gap-2 text-[13px]">
            <dt className="text-ink-subtle">{w.os}</dt>
            <dd className="font-mono text-[12.5px] [overflow-wrap:anywhere] text-ink">{w.text}</dd>
          </div>
        ))}
      </dl>
      <p className="text-[13px] leading-5 text-ink-muted">
        Windows starts at the drive letter, C:, and separates folders with backslashes (\). Mac and Linux start at the root, /, and use forward slashes.
      </p>
    </figure>
  )
}
