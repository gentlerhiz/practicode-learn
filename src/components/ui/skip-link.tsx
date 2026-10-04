/** The first focusable element on every page: jumps keyboard users past the header. */
export function SkipLink({ href = '#main' }: { href?: `#${string}` }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:font-semibold focus:text-on-primary"
    >
      Skip to content
    </a>
  )
}
