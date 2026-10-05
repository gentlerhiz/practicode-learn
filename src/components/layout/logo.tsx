import Link from 'next/link'
import type { Route } from 'next'
import { cn } from '@/lib/cn'

/**
 * The interim PractiCode icon (brand/logo), drawn inline so it costs no request. It is yellow on dark
 * and black on light (--pc-logo). Replace the paths when the official logo pack arrives (founder task F9).
 */
export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="-10.4 -9.06 20.8 18.12"
      className={cn('h-[26px] w-[30px] shrink-0', className)}
      aria-hidden="true"
    >
      <g
        style={{
          fill: 'var(--pc-logo)',
          stroke: 'var(--pc-logo)',
          strokeWidth: 0.32,
          strokeLinejoin: 'round',
        }}
      >
        <polygon points="1.6,8.66 5,8.66 10,0 5,-8.66 -5,-8.66 -10,0 -5,8.66 -1,8.66 -3,5.196 -6,0 -3,-5.196 3,-5.196 6,0 3,5.196 -0.4,5.196" />
        <polygon points="-2.8,0 -1.4,2.425 1.4,2.425 2.8,0 1.4,-2.425 -1.4,-2.425" />
      </g>
    </svg>
  )
}

/** The wordmark: "Practi" Regular, "Code" Bold, " Learn" Regular, in Poppins. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('font-sans text-lg whitespace-nowrap text-ink', className)}>
      <span className="font-normal">Practi</span>
      <span className="font-bold">Code</span>
      <span className="font-normal"> Learn</span>
    </span>
  )
}

export function Logo({
  href = '/',
  className,
  prefetch,
}: {
  href?: Route
  className?: string
  prefetch?: boolean
}) {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      aria-label="PractiCode Learn home"
      className={cn('flex items-center gap-3', className)}
    >
      <LogoIcon />
      <Wordmark />
    </Link>
  )
}
