'use client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/cn'
import { useReducedMotion, type LabProps } from './shared'

// When each file starts and finishes arriving (ms), on a fast and a slow connection.
const FILES = [
  { name: 'index.html', kb: 6, fast: [0, 120], slow: [0, 900] },
  { name: 'styles.css', kb: 14, fast: [120, 230], slow: [900, 2100] },
  { name: 'logo.svg', kb: 3, fast: [120, 180], slow: [900, 1500] },
  { name: 'script.js', kb: 9, fast: [120, 260], slow: [900, 2600] },
  { name: 'jollof.webp', kb: 85, fast: [120, 420], slow: [900, 5600] },
] as const
type FileName = (typeof FILES)[number]['name']

const timing = (name: FileName, slow: boolean) => {
  const f = FILES.find((x) => x.name === name)!
  return slow ? f.slow : f.fast
}

/**
 * A restaurant page loading file by file, on a fast or a slow connection (Explore lab, values Fast and
 * Slow). Choosing a speed loads the page; with reduced motion it appears finished straight away.
 */
export function PageLoad({ value = 'Fast' }: LabProps) {
  const reduced = useReducedMotion()
  const [load, setLoad] = useState<{ speed: string; id: number } | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [lastValue, setLastValue] = useState(value)
  const start = (speed: string) => {
    setLoad((current) => ({ speed, id: (current?.id ?? 0) + 1 }))
    setElapsed(0)
  }
  // Choosing a speed loads the page with it.
  if (value !== lastValue) {
    setLastValue(value)
    start(value)
  }

  useEffect(() => {
    if (!load) return
    const slow = load.speed === 'Slow'
    const end = Math.max(...FILES.map((f) => (slow ? f.slow : f.fast)[1]))
    const began = performance.now()
    let frame = 0
    const tick = () => {
      const t = reduced ? end : Math.min(performance.now() - began, end)
      setElapsed(t)
      if (t < end) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [load, reduced])

  const slow = load?.speed === 'Slow'
  const arrived = (name: FileName) => load !== null && elapsed >= timing(name, slow)[1]
  const progress = (name: FileName) => {
    if (!load) return 0
    const [from, to] = timing(name, slow)
    return Math.min(Math.max((elapsed - from) / (to - from), 0), 1)
  }
  const styled = arrived('styles.css')
  const finished = arrived('jollof.webp')
  const speed = load?.speed.toLowerCase() ?? ''
  const status = !load
    ? ''
    : !arrived('index.html')
      ? 'Waiting for the server to send index.html…'
      : !styled
        ? 'The HTML has arrived. The browser asks for the CSS, logo, script and photo, and waits for the CSS before drawing.'
        : !finished
          ? 'The CSS has arrived, so the browser draws the page. The photo is still downloading.'
          : slow
            ? 'The photo arrived last. It is by far the biggest file.'
            : 'Done. On a fast connection it all seems to arrive at once. Try Slow.'

  return (
    <div className="flex flex-col gap-3">
      <div className="self-start">
        <Button variant="secondary" size="sm" onClick={() => start(value)}>
          Load the Page
        </Button>
      </div>
      <div className="overflow-hidden rounded-xl border border-line bg-white text-[#15122a]">
        <div className="flex items-center gap-2 border-b border-[#e4e1ed] bg-[#f2f0f8] px-3 py-2 text-[12px] text-[#5d5972]">
          <span
            aria-hidden="true"
            className={cn(
              'size-2.5 rounded-full border-2 border-[#d2cedf] border-t-[#3d5af5]',
              load && !finished && !reduced && 'animate-spin',
            )}
          />
          <span>
            {!load
              ? 'Tap “Load the Page” to start'
              : finished
                ? `Loaded on a ${speed} connection`
                : `Loading on a ${speed} connection…`}
          </span>
        </div>
        <div className={cn('min-h-[230px] p-4', styled ? 'font-sans' : 'font-serif')}>
          <div className={cn(!styled && 'invisible')} aria-hidden={!styled}>
            <h4
              className={cn(
                'mb-1 text-xl',
                styled && 'font-display text-[22px] tracking-[-0.02em] text-[#8f1745]',
              )}
            >
              Mama Nkechi’s Kitchen
            </h4>
            <p className="mb-2.5 text-[13px]">
              Jollof rice, fried plantain and pepper soup, cooked fresh every day.
            </p>
            <div
              role="img"
              aria-label={
                finished ? 'Photo of jollof rice, loaded' : 'Photo of jollof rice, still downloading'
              }
              className={cn(
                'mb-2.5 flex h-[92px] items-center justify-center text-[12px] text-[#66627a]',
                styled && 'rounded-[10px]',
                finished
                  ? 'bg-[radial-gradient(circle_at_35%_55%,#e8792f_0_22%,transparent_23%),radial-gradient(circle_at_62%_45%,#f2b33d_0_16%,transparent_17%),radial-gradient(circle_at_50%_50%,#ffffff_0_38%,#f4e9da_39%_44%,transparent_45%),linear-gradient(135deg,#7a3b12,#b45a1b)] text-transparent'
                  : 'bg-[#e9e7f1]',
              )}
            >
              Photo of jollof rice
            </div>
            <p className="mb-2.5 text-[13px]">Open every day, 10am to 9pm.</p>
            <span
              className={cn(
                'inline-block border border-[#15122a] px-3.5 py-1.5 text-[13px]',
                styled && 'rounded-full border-[#fed606] bg-[#fed606] font-semibold',
                styled && !arrived('script.js') && 'opacity-50',
              )}
            >
              Order Now
            </span>
          </div>
        </div>
      </div>
      <p aria-live="polite" className="min-h-[1.6em] text-[13px] text-ink-muted">
        {status}
      </p>
      <ul aria-label="Files the browser downloads" className="flex flex-col gap-1.5 font-mono text-[12px]">
        {FILES.map((f) => {
          const done = arrived(f.name)
          return (
            <li key={f.name} className="grid grid-cols-[minmax(0,1fr)_52px_80px] items-center gap-2.5">
              <span className="truncate text-ink-soft">
                {f.name}
                <span className="sr-only">{done ? ', downloaded' : load ? ', downloading' : ''}</span>
              </span>
              <span className="text-right text-ink-muted tabular-nums">{f.kb} KB</span>
              <span className="h-1.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
                <i
                  className={cn('block h-full', done ? 'bg-success' : 'bg-fe')}
                  style={{ width: `${progress(f.name) * 100}%` }}
                />
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
