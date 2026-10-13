'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

type Panel = 'elements' | 'console' | 'network' | 'device'

const PANELS: [RegExp, Panel][] = [
  [/console/i, 'console'],
  [/network/i, 'network'],
  [/device|phone|toggle/i, 'device'],
  [/element|inspect/i, 'elements'],
]

const SAYS: Record<Panel, string> = {
  elements:
    'Elements shows the page’s HTML as the browser built it. Pick an element and Styles shows every CSS rule that applies to it, and the file and line it came from.',
  console:
    'Console shows errors and messages. Red lines are errors: here the browser couldn’t load jolof.jpg. It’s also where you can try JavaScript.',
  network:
    'Network lists every file the page asked for, with its status code. Everything arrived with 200 except the photo: 404, because the file is jollof.jpg, not jolof.jpg.',
  device:
    'The device toolbar shows the page at a phone’s size, so you can check your layout without a phone. Pick a phone or type a width.',
}

/** A tiny version of Mama Nkechi's menu page, as the lab's "page". */
function Page({ narrow, highlight }: { narrow?: boolean; highlight?: boolean }) {
  return (
    <div className={cn('bg-white p-3 text-[#15122a]', highlight && 'pt-8', narrow ? 'w-[150px]' : 'w-full')}>
      <div className="relative">
        <p className={cn('font-bold', narrow ? 'text-[13px]' : 'text-[16px]')}>Mama Nkechi’s Kitchen</p>
        {highlight && (
          <span aria-hidden="true" className="absolute inset-0 rounded-sm bg-fe/25 outline outline-fe">
            <span className="absolute -top-5 left-0 rounded bg-[#15122a] px-1 font-mono text-[10px] text-white">
              h1 · 343×37
            </span>
          </span>
        )}
      </div>
      <div className="mt-2 flex h-14 items-center justify-center border border-dashed border-[#b8b3c9] text-center text-[10px] text-[#5d5972]">
        Jollof rice in a clay pot
      </div>
      <p className="mt-2 text-[11px]">Jollof rice · ₦2,500</p>
    </div>
  )
}

function Elements() {
  return (
    <div className="grid gap-2 font-mono text-[11px] leading-5 tab:grid-cols-2">
      <div className="text-[#d6d3e3]">
        <p>{'<body>'}</p>
        <p className="rounded bg-fe/40 pl-3 text-white">{'<h1>Mama Nkechi’s Kitchen</h1>'}</p>
        <p className="pl-3">{'<img src="images/jolof.jpg" alt="Jollof rice in a clay pot">'}</p>
        <p className="pl-3">{'<p>Jollof rice · ₦2,500</p>'}</p>
        <p>{'</body>'}</p>
      </div>
      <div className="border-t border-[#3a3650] pt-2 text-[#d6d3e3] tab:border-t-0 tab:border-l tab:pt-0 tab:pl-2">
        <p className="text-[#9b97ad]">Styles</p>
        <p>
          h1 {'{'} <span className="text-[#7ee2b8]">color</span>: #9a3412; {'}'}{' '}
          <span className="text-[#9b97ad]">styles.css:3</span>
        </p>
        <p>
          h1 {'{'} <span className="text-[#7ee2b8]">font-size</span>: 2em; {'}'}{' '}
          <span className="text-[#9b97ad]">user agent stylesheet</span>
        </p>
      </div>
    </div>
  )
}

function Console() {
  return (
    <div className="font-mono text-[11px] leading-5">
      <p className="border-b border-[#3a3650] bg-[#4a1d24] px-1 text-[#ffb4b4]">
        ✕ GET https://ada.github.io/mama-nkechi/images/jolof.jpg 404 (Not Found)
      </p>
      <p className="border-b border-[#3a3650] px-1 text-[#d6d3e3]">Menu loaded: 12 dishes</p>
      <p className="px-1 text-[#9fb0ff]">
        &gt; <span className="text-[#d6d3e3]">document.title</span>
      </p>
      <p className="px-1 text-[#d6d3e3]">&lt; ’Mama Nkechi’s Kitchen’</p>
    </div>
  )
}

function Network() {
  const rows = [
    ['index.html', '200', 'document', '2.1 kB'],
    ['styles.css', '200', 'stylesheet', '1.3 kB'],
    ['jolof.jpg', '404', 'jpeg', '0.3 kB'],
    ['logo.svg', '200', 'svg+xml', '0.8 kB'],
  ]
  return (
    <table className="w-full font-mono text-[11px] leading-5 text-[#d6d3e3]">
      <thead className="text-left text-[#9b97ad]">
        <tr>
          <th className="font-normal">Name</th>
          <th className="font-normal">Status</th>
          <th className="font-normal">Type</th>
          <th className="font-normal">Size</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([name, status, type, size]) => (
          <tr key={name} className={cn('border-t border-[#3a3650]', status !== '200' && 'text-[#ffb4b4]')}>
            <td>{name}</td>
            <td>{status}</td>
            <td>{type}</td>
            <td>{size}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/**
 * Explore lab: the browser's developer tools on Mama Nkechi's menu page. The value names a panel:
 * Elements, Console, Network or the device toolbar.
 */
export function DevTools({ value = 'Elements' }: LabProps) {
  const panel = PANELS.find(([re]) => re.test(value))?.[1] ?? 'elements'
  const tabs: [Panel, string][] = [
    ['elements', 'Elements'],
    ['console', 'Console'],
    ['network', 'Network'],
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-xl border border-line">
        <div className={cn('flex justify-center bg-[#e9e7f0] p-2', panel !== 'device' && 'block p-0')}>
          {panel === 'device' ? (
            <div className="flex flex-col items-center gap-1">
              <p className="font-mono text-[10px] text-[#5d5972]">Responsive · 360 × 740</p>
              <div className="overflow-hidden rounded-[14px] border-4 border-[#15122a]">
                <Page narrow />
              </div>
            </div>
          ) : (
            <Page highlight={panel === 'elements'} />
          )}
        </div>
        <div className="bg-[#1d1a29] p-2">
          <div className="mb-2 flex gap-3 border-b border-[#3a3650] text-[11px]">
            <span
              aria-current={panel === 'device' ? 'true' : undefined}
              className={cn(
                'pb-1',
                panel === 'device' ? 'border-b-2 border-[#9fb0ff] text-white' : 'text-[#9b97ad]',
              )}
            >
              <span aria-hidden="true">📱</span>
              <span className="sr-only">Device toolbar</span>
            </span>
            {tabs.map(([id, label]) => (
              <span
                key={id}
                aria-current={panel === id ? 'true' : undefined}
                className={cn(
                  'pb-1',
                  panel === id ? 'border-b-2 border-[#9fb0ff] text-white' : 'text-[#9b97ad]',
                )}
              >
                {label}
              </span>
            ))}
          </div>
          {panel === 'elements' && <Elements />}
          {panel === 'console' && <Console />}
          {panel === 'network' && <Network />}
          {panel === 'device' && (
            <p className="font-mono text-[11px] text-[#d6d3e3]">Dimensions: Responsive · 360 × 740 · 100%</p>
          )}
        </div>
      </div>
      <p aria-live="polite" className="text-[13px] text-ink-muted">
        {SAYS[panel]}
      </p>
    </div>
  )
}
