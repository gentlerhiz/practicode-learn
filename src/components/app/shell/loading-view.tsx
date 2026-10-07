'use client'
import type { Route } from 'next'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Glyph } from '@/components/ui/glyph'

const Bar = ({ className }: { className: string }) => <span className={`block rounded-full bg-meter ${className}`} />

/**
 * PrismLoading: the dashboard's shape in grey while a signed-in page loads, inside the app shell. If it
 * takes more than a few seconds, a note says so and points to what works offline.
 */
export function LoadingView() {
  const [slow, setSlow] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setSlow(true), 4000)
    return () => clearTimeout(t)
  }, [])
  return (
    <main id="main" aria-busy="true" className="box-border flex w-full max-w-[1180px] flex-1 flex-col gap-6 px-4 pt-6 pb-10 lg:p-8">
      <p className="sr-only" role="status">
        Loading…
      </p>
      <div aria-hidden="true" className="flex animate-pulse flex-col gap-6">
        <div className="flex flex-col gap-3">
          <span className="block h-10 w-full max-w-[420px] rounded-2xl bg-meter" />
          <Bar className="h-5 w-full max-w-[300px]" />
        </div>
        <div className="grid grid-cols-1 gap-6 tab:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-4 rounded-[28px] border border-line bg-row p-8">
            <Bar className="h-6 w-[180px]" />
            <span className="block h-9 w-full max-w-[460px] rounded-xl bg-meter" />
            <Bar className="h-4 w-[260px]" />
            <Bar className="h-1.5 w-full" />
            <span className="mt-2 block h-[52px] w-[180px] rounded-full bg-meter" />
          </div>
          <div className="flex flex-col items-center gap-4 rounded-[28px] border border-line bg-row p-6">
            <Bar className="h-5 w-[120px] self-start" />
            <span className="block size-[140px] rounded-full bg-meter" />
            <Bar className="h-7 w-full" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 tab:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-3 rounded-[28px] border border-line bg-row p-6">
              <span className="block size-11 rounded-xl bg-meter" />
              <Bar className="mt-1 h-5 w-[60%]" />
              <Bar className="h-3.5 w-full" />
              <Bar className="h-3.5 w-[80%]" />
            </div>
          ))}
        </div>
      </div>
      {slow && (
        <p className="flex items-center gap-3 text-[15px] text-ink-soft">
          <Glyph name="wifi" size={18} className="shrink-0 text-[#FF8A3D]" />
          <span>
            Taking a while? Your connection seems slow.{' '}
            <Link href={'/settings#set-data' as Route} className="text-ink underline underline-offset-2">
              Lessons you saved still work offline.
            </Link>
          </span>
        </p>
      )}
    </main>
  )
}
