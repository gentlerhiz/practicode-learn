'use client'

import './globals.css'

/** Last resort when the root layout itself fails: no shared components, just enough to recover. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-GB" data-theme="dark">
      <body className="bg-bg font-sans text-ink">
        <main className="mx-auto flex min-h-dvh max-w-[520px] flex-col items-center justify-center gap-6 px-4 text-center">
          <h1 className="text-3xl font-bold">Something went wrong</h1>
          <p className="text-ink-muted">Please try again. Your progress is safe.</p>
          <button
            type="button"
            onClick={reset}
            className="h-12 rounded-full bg-primary px-6 font-semibold text-on-primary"
          >
            Try Again
          </button>
        </main>
      </body>
    </html>
  )
}
