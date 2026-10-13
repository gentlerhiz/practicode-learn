'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

type Area = 'explorer' | 'editor' | 'terminal' | 'extensions' | 'palette' | 'source'

/** The order a Diagram steps through, one area of VS Code at a time. */
const ORDER: Area[] = ['explorer', 'editor', 'terminal', 'extensions', 'palette', 'source']

const ring = (on: boolean) => (on ? 'outline-2 -outline-offset-2 outline-[#ffd43b] bg-[#ffd43b]/10' : '')

/**
 * Diagram lab: VS Code's window, with one area highlighted per state: the Explorer, the editor and its
 * tabs, the terminal, Extensions, the Command Palette and Source Control.
 */
export function EditorTour({ state = 0 }: LabProps) {
  const area = ORDER[Math.min(Math.max(state, 0), ORDER.length - 1)]!

  return (
    <figure
      aria-label="The Visual Studio Code window"
      className="relative m-0 overflow-hidden rounded-xl border border-line bg-[#1f1d2b] font-mono text-[11px] leading-5 text-[#d6d3e3]"
    >
      <div className="flex">
        <div
          aria-label="Activity bar"
          className="flex w-9 shrink-0 flex-col items-center gap-2 bg-[#17151f] py-2"
        >
          <span className={cn('rounded px-1', ring(area === 'explorer'))} title="Explorer">
            📄
          </span>
          <span className="rounded px-1" title="Search">
            🔍
          </span>
          <span className={cn('rounded px-1', ring(area === 'source'))} title="Source Control">
            ⑂
          </span>
          <span className={cn('rounded px-1', ring(area === 'extensions'))} title="Extensions">
            ⧉
          </span>
        </div>
        <div
          className={cn(
            'w-[118px] shrink-0 border-r border-[#2f2c3d] p-2',
            ring(['explorer', 'extensions', 'source'].includes(area)),
          )}
        >
          {area === 'extensions' ? (
            <>
              <p className="text-[#9b97ad]">EXTENSIONS</p>
              <p className="mt-1 truncate text-white">Live Preview</p>
              <p className="truncate text-[#9b97ad]">Microsoft</p>
              <p className="mt-1 truncate text-white">Prettier</p>
            </>
          ) : area === 'source' ? (
            <>
              <p className="text-[#9b97ad]">SOURCE CONTROL</p>
              <p className="mt-1 text-white">Changes 1</p>
              <p className="truncate pl-2 text-[#ffb86b]">index.html M</p>
            </>
          ) : (
            <>
              <p className="text-[#9b97ad]">MAMA-NKECHI</p>
              <p className="pl-1">▸ images</p>
              <p className="rounded bg-[#2f2c3d] pl-1 text-white">index.html</p>
              <p className="pl-1">styles.css</p>
            </>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className={cn('flex border-b border-[#2f2c3d]', ring(area === 'editor'))}>
            <span className="border-r border-[#2f2c3d] bg-[#1f1d2b] px-2 text-white">index.html ●</span>
            <span className="px-2 text-[#9b97ad]">styles.css</span>
          </div>
          <div className={cn('min-h-[92px] p-2', ring(area === 'editor'))}>
            <p>
              <span className="text-[#9b97ad]">1</span> {'<h1>'}Mama Nkechi’s Kitchen{'</h1>'}
            </p>
            <p>
              <span className="text-[#9b97ad]">2</span> {'<p>'}Jollof rice, fried plantain{'</p>'}
            </p>
          </div>
          <div className={cn('border-t border-[#2f2c3d] p-2', ring(area === 'terminal'))}>
            <p className="text-[#9b97ad]">TERMINAL</p>
            <p>
              <span className="text-[#7ee2b8]">~/mama-nkechi</span>$ git status
            </p>
          </div>
        </div>
      </div>
      {area === 'palette' && (
        <div
          className={cn(
            'absolute top-2 left-1/2 w-[220px] -translate-x-1/2 rounded-lg border border-[#3a3650] bg-[#2a2738] p-2 shadow-lg',
            ring(true),
          )}
        >
          <p className="rounded bg-[#17151f] px-1 text-white">&gt; format doc</p>
          <p className="mt-1 px-1">Format Document</p>
          <p className="px-1 text-[#9b97ad]">Format Selection</p>
        </div>
      )}
      <div className="flex justify-between bg-[#3d5af5] px-2 text-[10px] text-white">
        <span>⑂ main</span>
        <span>HTML · UTF-8</span>
      </div>
    </figure>
  )
}
