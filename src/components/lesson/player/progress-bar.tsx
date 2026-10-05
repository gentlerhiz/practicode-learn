import { cn } from '@/lib/cn'

/** One segment per step: done, current, or still to come. */
export function ProgressBar({ index, total }: { index: number; total: number }) {
  return (
    <div
      role="progressbar"
      aria-label="Lesson progress"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={index + 1}
      aria-valuetext={`Step ${index + 1} of ${total}`}
      className="flex gap-1"
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            'h-1.5 flex-1 rounded-full bg-line',
            i < index && 'bg-success',
            i === index && 'bg-fe',
          )}
        />
      ))}
    </div>
  )
}
