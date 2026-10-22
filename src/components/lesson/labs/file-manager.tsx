'use client'
import { ArrowDownUp, ChevronRight, Download, FileImage, FileSpreadsheet, FileText, Folder, Home, LayoutGrid, Search, Trash2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import { clampState, type LabProps } from './shared'

type Area = 'all' | 'sidebar' | 'address' | 'list' | 'sort' | 'search' | 'bin'

const STATES: { area: Area; name: string; line: string }[] = [
  { area: 'all', name: 'A file manager', line: 'File Explorer on Windows, Finder on a Mac and Files on Linux all have the same parts.' },
  { area: 'sidebar', name: 'The sidebar', line: 'Shortcuts to the places you use most: Home, Desktop, Documents, Downloads.' },
  { area: 'address', name: 'The address bar', line: 'Where you are, as a path. Tap any folder in it to jump back up.' },
  { area: 'list', name: 'The file list', line: 'What’s in this folder, with each item’s date, type and size.' },
  { area: 'sort', name: 'Sort and view', line: 'Sort by name, date or size, and switch between a list and big icons.' },
  { area: 'search', name: 'Search', line: 'Type part of a name to find a file in this folder and every folder inside it.' },
  { area: 'bin', name: 'The Recycle Bin', line: 'Deleted files wait here (the Bin on a Mac), so you can put them back, until it’s emptied.' },
]

const FILES = [
  { name: 'School', icon: Folder, date: '18 Oct', type: 'Folder', size: '', bytes: 0 },
  { name: 'budget.xlsx', icon: FileSpreadsheet, date: '21 Oct', type: 'Spreadsheet', size: '18 KB', bytes: 18e3 },
  { name: 'cv.docx', icon: FileText, date: '2 Oct', type: 'Document', size: '42 KB', bytes: 42e3 },
  { name: 'scan.jpg', icon: FileImage, date: '22 Oct', type: 'Image', size: '3.1 MB', bytes: 3.1e6 },
]
const BY_SIZE = [...FILES].sort((a, b) => b.bytes - a.bytes)

/** A file manager window, one part at a time (Diagram lab, 7 states). */
export function FileManager({ state }: LabProps) {
  const at = clampState(state, STATES.length)
  const s = STATES[at]!
  const lit = (a: Area) => s.area === 'all' || s.area === a
  const ring = (a: Area) =>
    cn('rounded-lg motion-safe:transition-all motion-safe:duration-300', s.area === a ? 'outline-2 outline-offset-2 outline-it bg-[rgba(255,170,60,0.12)]' : '', !lit(a) && 'opacity-40')
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={`${s.name}. ${s.line}`} className="flex flex-col gap-2 rounded-xl border border-line bg-sunken p-2.5 text-[12px]">
        <div className="flex items-center gap-2">
          <div className={cn('flex min-w-0 flex-1 items-center gap-1 px-2 py-1.5', ring('address'), 'border border-line bg-row')}>
            <Home size={13} aria-hidden="true" className="shrink-0 text-ink-muted" />
            {['Ada', 'Documents'].map((p) => (
              <span key={p} className="flex min-w-0 items-center gap-1 text-ink">
                <ChevronRight size={12} aria-hidden="true" className="shrink-0 text-ink-subtle" />
                <span className="truncate">{p}</span>
              </span>
            ))}
          </div>
          <div className={cn('flex w-[34%] max-w-[150px] items-center gap-1.5 border border-line bg-row px-2 py-1.5', ring('search'))}>
            <Search size={13} aria-hidden="true" className="shrink-0 text-ink-muted" />
            <span className="truncate text-ink-subtle">{s.area === 'search' ? 'bud' : 'Search'}</span>
          </div>
        </div>
        <div className="grid grid-cols-[108px_minmax(0,1fr)] gap-2">
          <ul className={cn('flex flex-col gap-1 p-1.5', ring('sidebar'))}>
            {[
              [Home, 'Home'],
              [Folder, 'Desktop'],
              [Folder, 'Documents'],
              [Download, 'Downloads'],
            ].map(([Icon, label]) => {
              const I = Icon as typeof Home
              return (
                <li key={label as string} className={cn('flex items-center gap-1.5 rounded-md px-1 py-0.5 text-[11.5px] text-ink', label === 'Documents' && 'bg-row font-semibold')}>
                  <I size={13} aria-hidden="true" className="shrink-0 text-it-text" />
                  <span className="min-w-0 leading-4 [overflow-wrap:anywhere]">{label as string}</span>
                </li>
              )
            })}
            <li className={cn('mt-2 flex items-center gap-1.5 rounded-md px-1 py-0.5 text-[11.5px] text-ink', ring('bin'))}>
              <Trash2 size={13} aria-hidden="true" className="shrink-0 text-ink-muted" />
              <span className="min-w-0 leading-4">Recycle Bin</span>
            </li>
          </ul>
          <div className="flex min-w-0 flex-col gap-1.5">
            <div className={cn('flex items-center justify-end gap-2 px-1 py-0.5 text-ink-muted', ring('sort'))}>
              <span className="flex items-center gap-1">
                <ArrowDownUp size={12} aria-hidden="true" />
                {s.area === 'sort' ? 'Size' : 'Name'}
              </span>
              <LayoutGrid size={13} aria-hidden="true" />
            </div>
            <ul className={cn('flex flex-col', ring('list'))}>
              <li className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 border-b border-divider px-1.5 pb-1 text-[11px] text-ink-subtle @min-[420px]:grid-cols-[minmax(0,1fr)_52px_72px_48px]">
                <span>Name</span>
                <span className="hidden @min-[420px]:block">Date</span>
                <span className="hidden @min-[420px]:block">Type</span>
                <span className="text-right">Size</span>
              </li>
              {(s.area === 'search' ? FILES.filter((f) => f.name.startsWith('bud')) : s.area === 'sort' ? BY_SIZE : FILES).map(
                (f) => (
                  <li key={f.name} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-1.5 py-1 text-ink @min-[420px]:grid-cols-[minmax(0,1fr)_52px_72px_48px]">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <f.icon size={13} aria-hidden="true" className="shrink-0 text-ink-muted" />
                      <span className="truncate">{f.name}</span>
                    </span>
                    <span className="hidden text-ink-muted @min-[420px]:block">{f.date}</span>
                    <span className="hidden truncate text-ink-muted @min-[420px]:block">{f.type}</span>
                    <span className="text-right text-ink-muted">{f.size}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </div>
      <figcaption aria-live="polite" className="flex flex-col gap-1 rounded-2xl border border-line bg-row px-4 py-3">
        <span className="font-display text-[15px] font-bold text-ink">{s.name}</span>
        <span className="text-[13px] leading-5 text-ink-soft">{s.line}</span>
      </figcaption>
    </figure>
  )
}
