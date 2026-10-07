import { notFound } from 'next/navigation'

/**
 * Design previews (/fixtures/screens/*) show each screen with the canvas's sample data, for review and
 * for side-by-side checks. They exist on your computer (next dev) and in test builds (PCL_FIXTURES=1),
 * never on a deployment.
 */
export function requirePreviews() {
  if (process.env.NODE_ENV !== 'development' && process.env.PCL_FIXTURES !== '1') notFound()
}
