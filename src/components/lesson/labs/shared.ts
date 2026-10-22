'use client'
import { useSyncExternalStore } from 'react'

/** Lab colours, from the site's tokens, so labs follow the light and dark themes. */
export const C = {
  text: 'var(--pc-text)',
  soft: 'var(--pc-text-soft)',
  muted: 'var(--pc-text-muted)',
  row: 'var(--pc-surface-row)',
  sunken: 'var(--pc-surface-sunken)',
  line: 'var(--pc-line)',
  lineControl: 'var(--pc-line-control)',
  track: '#3d5af5',
  trackText: 'var(--pc-fe-text)',
  trackTint: 'color-mix(in srgb, #3d5af5 18%, transparent)',
  ok: 'var(--pc-success)',
  okTint: 'color-mix(in srgb, var(--pc-success) 18%, transparent)',
  bad: 'var(--pc-error)',
  badTint: 'color-mix(in srgb, var(--pc-error) 16%, transparent)',
  sheet: 'var(--pc-sheet)',
  glass: 'var(--pc-glass)',
  subtle: 'var(--pc-text-subtle)',
  // IT Fundamentals amber: the fill is the same in both themes; the text colour deepens on light.
  it: '#a85a00',
  itText: 'var(--pc-it-text)',
  itTint: 'color-mix(in srgb, #ffa22e 18%, transparent)',
} as const

/** Clamps a diagram state to the drawing's range. */
export const clampState = (state: number | undefined, count: number) =>
  Math.min(Math.max(state ?? 0, 0), count - 1)

const QUERY = '(prefers-reduced-motion: reduce)'
const subscribe = (onChange: () => void) => {
  const media = matchMedia(QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

/** True when the learner asked their device for less motion. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => matchMedia(QUERY).matches,
    () => false,
  )
}

export type LabProps = { state?: number; value?: string }
