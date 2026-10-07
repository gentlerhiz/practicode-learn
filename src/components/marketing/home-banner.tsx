'use client'

import { usePathname } from 'next/navigation'
import { TryBanner } from './landing-bands'

/** The "Try a real lesson" strip sits above the header on the landing page only, as on the canvas. */
export function HomeBanner() {
  return usePathname() === '/' ? <TryBanner /> : null
}
