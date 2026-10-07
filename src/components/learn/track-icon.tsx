import type { PlanTrackId } from '@/lib/onboarding/plan'

/** Each track's glyph, drawn with the canvas's stroke style (code brackets, a chart, a pen, a chip). */
const paths: Record<PlanTrackId, string[]> = {
  fe: ['m16 18 6-6-6-6', 'm8 6-6 6 6 6'],
  da: ['M3 3v18h18', 'M8 17v-4', 'M13 17V8', 'M18 17v-7'],
  ux: ['m12 19 7-7 3 3-7 7z', 'M18 13l-1.5-7.5L2 2l3.5 14.5L13 18z', 'M2 2l7.6 7.6'],
  ai: [
    'M5 7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z',
    'M9 9h6v6H9z',
    'M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3',
  ],
}

export function TrackIcon({ track, size = 22, className }: { track: PlanTrackId; size?: number; className?: string }) {
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
export const trackFill: Record<PlanTrackId, string> = {
  fe: 'bg-fe text-white',
  da: 'bg-success-fill text-on-success',
  ux: 'bg-ux text-white',
  ai: 'bg-ai text-white',
}
export const trackTint: Record<PlanTrackId, string> = {
  fe: 'bg-[rgba(77,107,255,0.16)] text-fe-text',
  da: 'bg-[rgba(47,230,176,0.14)] text-da-text',
  ux: 'bg-[rgba(240,64,127,0.14)] text-ux-text',
  ai: 'bg-[rgba(123,92,255,0.16)] text-ai-text',
}
export const trackText: Record<PlanTrackId, string> = {
  fe: 'text-fe-text',
  da: 'text-da-text',
  ux: 'text-ux-text',
  ai: 'text-ai-text',
}
