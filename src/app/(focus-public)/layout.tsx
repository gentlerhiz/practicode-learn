import { SkipLink } from '@/components/ui/skip-link'

/** Public pages with the canvas's slim focused header instead of the full site header (scholarship). */
export default function FocusPublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      {children}
    </>
  )
}
