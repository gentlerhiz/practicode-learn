'use client'
import { FileImage, FileMusic, FileSpreadsheet, FileText, Folder, Monitor } from 'lucide-react'
import { cn } from '@/lib/cn'
import { clampState, type LabProps } from './shared'

type Item = { messy: string; tidy: string; kind: keyof typeof ICONS; folder: 'Documents' | 'Pictures' | 'Music'; sub?: 'School' | 'Money' }

const ITEMS: Item[] = [
  { messy: 'Document1.docx', tidy: 'history-essay.docx', kind: 'doc', folder: 'Documents', sub: 'School' },
  { messy: 'IMG_2041.jpg', tidy: '2026-08-beach.jpg', kind: 'image', folder: 'Pictures' },
  { messy: 'budget FINAL v2.xlsx', tidy: 'budget-2026.xlsx', kind: 'sheet', folder: 'Documents', sub: 'Money' },
  { messy: 'track01.mp3', tidy: 'track01.mp3', kind: 'music', folder: 'Music' },
  { messy: 'IMG_2042.jpg', tidy: '2026-08-sunset.jpg', kind: 'image', folder: 'Pictures' },
  { messy: 'notes.docx', tidy: 'maths-notes.docx', kind: 'doc', folder: 'Documents', sub: 'School' },
  { messy: 'bank.xlsx', tidy: 'bank-statements-2026.xlsx', kind: 'sheet', folder: 'Documents', sub: 'Money' },
  { messy: 'song.mp3', tidy: 'song.mp3', kind: 'music', folder: 'Music' },
]

const ICONS = { doc: FileText, sheet: FileSpreadsheet, image: FileImage, music: FileMusic }

const CAPTIONS = [
  'A desktop with everything saved straight onto it. Finding one file means reading every name.',
  'First, a few folders, one for each kind of thing.',
  'Each file goes into the folder it belongs in. The desktop is clear.',
  'Folders can hold folders. Documents now has School and Money inside it.',
  'Clear names finish the job: you can tell what each file is without opening it.',
]

function FileChip({ item, tidy }: { item: Item; tidy: boolean }) {
  const Icon = ICONS[item.kind]
  return (
    <li className="pop-in flex min-w-0 items-start gap-1.5 text-[12px] leading-4 text-ink">
      <Icon size={14} aria-hidden="true" className="mt-px shrink-0 text-ink-muted" />
      <span className="min-w-0 font-mono [overflow-wrap:anywhere]">{tidy ? item.tidy : item.messy}</span>
    </li>
  )
}

function Box({ name, children, small }: { name: string; children: React.ReactNode; small?: boolean }) {
  return (
    <div className={cn('pop-in flex min-w-0 flex-col gap-2 rounded-xl border border-line bg-row', small ? 'p-2' : 'p-3')}>
      <span className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
        <Folder size={small ? 14 : 16} aria-hidden="true" className="shrink-0 text-it-text" />
        {name}
      </span>
      {children}
    </div>
  )
}

/** A messy desktop tidied into folders, step by step (Diagram lab, 5 states). */
export function FolderTidy({ state }: LabProps) {
  const at = clampState(state, CAPTIONS.length)
  const tidy = at >= 4
  const inFolder = (folder: Item['folder'], sub?: Item['sub']) => ITEMS.filter((x) => x.folder === folder && (at >= 3 ? x.sub === sub : true))
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={CAPTIONS[at]} className="flex flex-col gap-3">
        {at >= 1 && (
          <div className="grid grid-cols-1 gap-2 @min-[480px]:grid-cols-3">
            {(['Documents', 'Pictures', 'Music'] as const).map((f) => (
              <Box key={f} name={f}>
                {at >= 2 && (
                  <ul className="flex flex-col gap-1.5">
                    {inFolder(f).map((x) => (
                      <FileChip key={x.messy} item={x} tidy={tidy} />
                    ))}
                  </ul>
                )}
                {at >= 3 && f === 'Documents' && (
                  <div className="grid grid-cols-1 gap-1.5">
                    {(['School', 'Money'] as const).map((s) => (
                      <Box key={s} name={s} small>
                        <ul className="flex flex-col gap-1.5">
                          {inFolder('Documents', s).map((x) => (
                            <FileChip key={x.messy} item={x} tidy={tidy} />
                          ))}
                        </ul>
                      </Box>
                    ))}
                  </div>
                )}
                {at === 1 && <span className="text-[12px] text-ink-subtle">Empty</span>}
              </Box>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-2 rounded-xl border border-dashed border-line-strong p-3" style={{ background: 'color-mix(in srgb, #3d5af5 10%, transparent)' }}>
          <span className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
            <Monitor size={16} aria-hidden="true" className="shrink-0 text-fe-text" />
            Desktop
          </span>
          {at < 2 ? (
            <ul className="grid grid-cols-1 gap-x-3 gap-y-1.5 @min-[360px]:grid-cols-2">
              {ITEMS.map((x) => (
                <FileChip key={x.messy} item={x} tidy={false} />
              ))}
            </ul>
          ) : (
            <span className="pop-in text-[12px] text-ink-subtle">Clear</span>
          )}
        </div>
      </div>
      <figcaption aria-live="polite" className="rounded-2xl border border-line bg-row px-4 py-3 text-[13px] leading-5 text-ink-soft">
        {CAPTIONS[at]}
      </figcaption>
    </figure>
  )
}
