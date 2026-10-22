'use client'
import { Volume2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

const MODES: Record<string, { helps: string; find: string }> = {
  Standard: { helps: 'The phone as it comes.', find: '' },
  'Larger text': { helps: 'Anyone who finds small text hard to read: most people, after their forties.', find: 'Display, or Accessibility, then Text size' },
  'High contrast': { helps: 'People with low vision, and anyone using a screen in bright sunlight.', find: 'Accessibility, then Display, then Increase contrast' },
  'Dark mode': { helps: 'Comfort in dim light, and some people with light sensitivity. It can save battery on some screens.', find: 'Display, then Dark mode (or Dark theme)' },
  'Screen reader': { helps: 'Blind and partially sighted people: the phone reads out whatever you touch. VoiceOver on Apple, TalkBack on Android, Narrator on Windows.', find: 'Accessibility, then VoiceOver or TalkBack' },
  Captions: { helps: 'Deaf and hard-of-hearing people, and anyone watching without sound, such as on a train.', find: 'Accessibility, then Live Captions or Caption preferences' },
}

/** A phone screen in each accessibility mode, with who it helps and where to find it (Explore lab). */
export function AccessibilityView({ value = 'Standard' }: LabProps) {
  const name = MODES[value] ? value : 'Standard'
  const m = MODES[name]!
  const big = name === 'Larger text'
  const contrast = name === 'High contrast'
  const dark = name === 'Dark mode' || contrast
  const reader = name === 'Screen reader'
  const captions = name === 'Captions'
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${name}. ${m.helps}`}>
      <div className="flex items-start justify-center gap-3">
        <div
          aria-hidden="true"
          className={cn(
            'relative flex w-[176px] shrink-0 flex-col gap-2 overflow-hidden rounded-[26px] border-4 p-3 motion-safe:transition-colors motion-safe:duration-300',
            dark ? 'border-[#26213b] bg-[#0b0a14]' : 'border-[#d2cedf] bg-white',
          )}
          style={{ minHeight: 300 }}
        >
          <p className={cn('font-bold', big ? 'text-[19px] leading-6' : 'text-[13px]', contrast ? 'text-[#ffff00]' : dark ? 'text-white' : 'text-[#15122a]')}>Messages</p>
          {[
            ['Grace', 'Running 10 minutes late!'],
            ['Tunde', 'See you at the market'],
          ].map(([who, msg], i) => (
            <div
              key={who}
              className={cn(
                'rounded-xl px-2 py-1.5',
                contrast ? 'border-2 border-white bg-black' : dark ? 'bg-[#1b1830]' : 'bg-[#f2f0f8]',
                reader && i === 0 && 'outline-[3px] outline-offset-1 outline-[#3d8bfd]',
              )}
            >
              <p className={cn('font-semibold', big ? 'text-[16px]' : 'text-[11px]', contrast ? 'text-[#ffff00]' : dark ? 'text-white' : 'text-[#15122a]')}>{who}</p>
              <p className={cn(big ? 'text-[15px] leading-5' : 'text-[10.5px]', contrast ? 'text-white' : dark ? 'text-[#dcd9ea]' : 'text-[#5d5972]')}>{msg}</p>
            </div>
          ))}
          <div className="relative mt-1 h-24 overflow-hidden rounded-xl" style={{ background: 'linear-gradient(160deg,#3d5af5,#6e4cf5)' }}>
            <span className="absolute inset-0 grid place-items-center text-2xl text-white/80">▶</span>
            {captions && <span className="pop-in absolute inset-x-1.5 bottom-1.5 rounded bg-black/80 px-1.5 py-1 text-center text-[10px] leading-3 text-white">“Welcome back to the cooking show!”</span>}
          </div>
          {reader && (
            <span className="pop-in absolute inset-x-2 bottom-2 flex gap-1 rounded-xl bg-[#15122a] px-2 py-1.5 text-[10px] leading-[14px] text-white">
              <Volume2 size={12} className="mt-px shrink-0" />
              “Grace. Running 10 minutes late. Double-tap to open.”
            </span>
          )}
        </div>
      </div>
      <div aria-live="polite" className="flex flex-col gap-1.5 rounded-2xl border border-line bg-row px-4 py-3 text-[13px] leading-5">
        <p className="font-display text-[15px] font-bold text-ink">{name}</p>
        <p className="text-ink-soft">{m.helps}</p>
        {m.find && (
          <p className="text-ink-muted">
            <span className="font-semibold text-ink-soft">Where: </span>Settings, then {m.find}. Names vary a little between phones.
          </p>
        )}
      </div>
    </figure>
  )
}
