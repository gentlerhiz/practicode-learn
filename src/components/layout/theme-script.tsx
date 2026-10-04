import { THEME_BOOT_SCRIPT } from '@/lib/theme'

/** Sets data-theme on <html> before first paint, so the page never flashes the wrong theme. */
export function ThemeScript({ nonce }: { nonce?: string }) {
  return <script nonce={nonce} dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
}
