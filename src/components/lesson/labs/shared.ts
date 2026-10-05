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
} as const

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
