import type { TrackTone } from '@/content/catalogue'

/**
 * Each subject colour's utility classes, written out in full so Tailwind finds them, plus its RGB for
 * glows and tints in inline styles. Fills carry white text in both themes.
 */
export const toneClass: Record<TrackTone, { fill: string; soft: string; text: string; rgb: string }> = {
  fe: { fill: 'bg-fe', soft: 'bg-fe/15', text: 'text-fe-text', rgb: '77,107,255' },
  da: { fill: 'bg-da', soft: 'bg-da/15', text: 'text-da-text', rgb: '47,230,176' },
  ux: { fill: 'bg-ux', soft: 'bg-ux/15', text: 'text-ux-text', rgb: '240,64,127' },
  ai: { fill: 'bg-ai', soft: 'bg-ai/15', text: 'text-ai-text', rgb: '123,92,255' },
  it: { fill: 'bg-it', soft: 'bg-it/15', text: 'text-it-text', rgb: '255,170,60' },
  cy: { fill: 'bg-cy', soft: 'bg-cy/15', text: 'text-cy-text', rgb: '34,190,230' },
}
