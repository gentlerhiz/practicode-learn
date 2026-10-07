'use client'

import { useEffect, useState } from 'react'
import { ChevronRight, Icon, Monitor, Moon, Smartphone, Sun } from '@/components/ui/icon'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { cn } from '@/lib/cn'
import {
  THEME_STORAGE_KEY,
  parsePreference,
  resolveTheme,
  type Theme,
  type ThemePreference,
} from '@/lib/theme'

const LIGHT_QUERY = '(prefers-color-scheme: light)'

function readState(): { pref: ThemePreference; theme: Theme } {
  const root = document.documentElement
  const pref = parsePreference(root.dataset.themePref ?? null)
  return { pref, theme: root.dataset.theme === 'light' ? 'light' : 'dark' }
}

function apply(pref: ThemePreference) {
  const theme = resolveTheme(pref, matchMedia(LIGHT_QUERY).matches)
  const root = document.documentElement
  root.dataset.theme = theme
  root.dataset.themePref = pref
  try {
    if (pref === 'system') localStorage.removeItem(THEME_STORAGE_KEY)
    else localStorage.setItem(THEME_STORAGE_KEY, pref)
  } catch {
    // Storage can be blocked (private mode, strict settings). The theme still applies for this page.
  }
  return theme
}

function useTheme() {
  // Server render and first client render agree on a neutral state; the real one is read after mount.
  const [state, setState] = useState<{ pref: ThemePreference; theme: Theme } | null>(null)

  useEffect(() => {
    // <html> is the source of truth: the boot script set it before first paint, and any switch on the
    // page (header, phone menu, Settings) changes it. Every switch follows it, so labels never go stale.
    const sync = () => setState(readState())
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-theme-pref'],
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (state?.pref !== 'system') return
    const media = matchMedia(LIGHT_QUERY)
    const onChange = () => setState({ pref: 'system', theme: apply('system') })
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [state?.pref])

  const choose = (pref: ThemePreference) => setState({ pref, theme: apply(pref) })
  // Decided from <html> at click time, so a click before the first sync still flips what is on screen.
  const flip = () => choose(readState().theme === 'light' ? 'dark' : 'light')
  return { state, choose, flip }
}

/**
 * The theme switch. "icon" is the round sun/moon button in the guest navbar; "row" is the full-width
 * row in phone menus; "segmented" is Settings → Appearance (Dark, Light, Match device).
 */
export function ThemeToggle({
  variant = 'icon',
  className,
}: {
  variant?: 'icon' | 'row' | 'item' | 'segmented' | 'pills'
  className?: string
}) {
  const { state, choose, flip } = useTheme()
  const isLight = state?.theme === 'light'

  if (variant === 'pills') {
    // Settings, Learning, Appearance (PrismSettings): three pills, the chosen one filled.
    const options = [
      { value: 'dark' as const, label: 'Dark', icon: Moon },
      { value: 'light' as const, label: 'Light', icon: Sun },
      { value: 'system' as const, label: 'Match device', icon: Smartphone },
    ]
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        <div role="radiogroup" aria-label="Appearance" className="flex flex-wrap gap-2">
          {options.map((o) => {
            const on = (state?.pref ?? 'system') === o.value
            return (
              <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => choose(o.value)}
                className={cn(
                  'press inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-medium',
                  on ? 'border-primary bg-primary text-on-primary' : 'border-line-control text-ink-soft hover:border-line-strong hover:bg-hover',
                )}
              >
                <Icon as={o.icon} size={16} />
                {o.label}
              </button>
            )
          })}
        </div>
        {state?.pref === 'system' && <p className="text-[13px] text-ink-muted">Following your device’s setting.</p>}
      </div>
    )
  }

  if (variant === 'segmented') {
    return (
      <SegmentedControl
        label="Appearance"
        value={state?.pref ?? 'system'}
        onChange={choose}
        className={className}
        options={[
          { value: 'dark', label: 'Dark', icon: Moon },
          { value: 'light', label: 'Light', icon: Sun },
          { value: 'system', label: 'Match device', icon: Monitor },
        ]}
      />
    )
  }

  const label = isLight ? 'Switch to dark mode' : 'Switch to light mode'

  if (variant === 'item') {
    // A sidebar row, like the links above it (PrismDashboard).
    return (
      <button
        type="button"
        onClick={flip}
        className={cn(
          'press flex h-12 w-full cursor-pointer items-center gap-3 rounded-[14px] px-3 text-left text-[15px] text-ink-soft hover:bg-hover hover:text-ink',
          className,
        )}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-control">
          <Icon as={isLight ? Moon : Sun} size={17} />
        </span>
        {isLight ? 'Dark mode' : 'Light mode'}
      </button>
    )
  }

  if (variant === 'row') {
    return (
      <button
        type="button"
        onClick={flip}
        className={cn(
          'press flex h-[52px] w-full cursor-pointer items-center gap-3 rounded-2xl border border-line bg-wash px-4 text-[15px] font-medium text-ink hover:border-line-control hover:bg-hover',
          className,
        )}
      >
        <Icon as={isLight ? Moon : Sun} />
        <span>{isLight ? 'Dark mode' : 'Light mode'}</span>
        <Icon as={ChevronRight} size={16} className="ml-auto text-ink-subtle" />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={flip}
      aria-label={label}
      title={label}
      className={cn(
        'press inline-flex size-[42px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-line-control text-ink hover:border-line-strong hover:bg-hover',
        className,
      )}
    >
      <Icon as={isLight ? Moon : Sun} />
    </button>
  )
}
