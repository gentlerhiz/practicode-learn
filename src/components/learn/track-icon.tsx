import type { TrackTone } from '@/content/catalogue'

/** Each subject's glyph, drawn with the canvas's stroke style (code brackets, a chart, a pen, a chip, a screen, a shield). */
const paths: Record<TrackTone, string[]> = {
  fe: ['m16 18 6-6-6-6', 'm8 6-6 6 6 6'],
  da: ['M3 3v18h18', 'M8 17v-4', 'M13 17V8', 'M18 17v-7'],
  ux: ['m12 19 7-7 3 3-7 7z', 'M18 13l-1.5-7.5L2 2l3.5 14.5L13 18z', 'M2 2l7.6 7.6'],
  ai: [
    'M5 7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z',
    'M9 9h6v6H9z',
    'M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3',
  ],
  it: ['M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'M8 21h8', 'M12 17v4'],
  cy: [
    'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
    'm9 12 2 2 4-4',
  ],
}

export function TrackIcon({ track, size = 22, className }: { track: TrackTone; size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.85}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[track].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}

/** Solid track tiles (same in both modes) and their pale tints. */
export const trackFill: Record<TrackTone, string> = {
  fe: 'bg-fe text-white',
  da: 'bg-success-fill text-on-success',
  ux: 'bg-ux text-white',
  ai: 'bg-ai text-white',
  it: 'bg-it text-white',
  cy: 'bg-cy text-white',
}
export const trackTint: Record<TrackTone, string> = {
  fe: 'bg-[rgba(77,107,255,0.16)] text-fe-text',
  da: 'bg-[rgba(47,230,176,0.14)] text-da-text',
  ux: 'bg-[rgba(240,64,127,0.14)] text-ux-text',
  ai: 'bg-[rgba(123,92,255,0.16)] text-ai-text',
  it: 'bg-[rgba(255,170,60,0.16)] text-it-text',
  cy: 'bg-[rgba(34,190,230,0.16)] text-cy-text',
}
export const trackText: Record<TrackTone, string> = {
  fe: 'text-fe-text',
  da: 'text-da-text',
  ux: 'text-ux-text',
  ai: 'text-ai-text',
  it: 'text-it-text',
  cy: 'text-cy-text',
}
