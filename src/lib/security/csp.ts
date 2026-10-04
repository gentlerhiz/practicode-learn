import { createHash } from 'node:crypto'
// Relative import: next.config.ts loads this file, and its loader doesn't resolve the @/ alias.
import { THEME_BOOT_SCRIPT } from '../theme'

export const themeScriptHash = () =>
  `'sha256-${createHash('sha256').update(THEME_BOOT_SCRIPT).digest('base64')}'`

// Measured in Task 5 Step 6 (see ADR 0008): '' if static pages run with no inline scripts beyond the
// theme script, otherwise "'unsafe-inline'".
export const STATIC_INLINE: '' | "'unsafe-inline'" = "'unsafe-inline'"

type CspInput = {
  mode: 'static' | 'nonce'
  nonce?: string
  dev: boolean
  supabaseUrl?: string
  themeScriptHash: string
}

export function buildCsp({ mode, nonce, dev, supabaseUrl, themeScriptHash }: CspInput): string {
  const evalSource = dev ? "'unsafe-eval'" : ''
  // Dynamic pages: a fresh nonce per request; 'strict-dynamic' lets nonce-loaded scripts load their
  // chunks. The theme script in the root layout has no nonce, so it is allowed by its hash.
  // Static pages can't carry a per-request nonce, so they rely on the theme script's hash, or on
  // 'unsafe-inline' when measurement shows Next.js needs inline scripts. A hash next to
  // 'unsafe-inline' would make browsers ignore 'unsafe-inline', so the two are never combined.
  const script =
    mode === 'nonce'
      ? ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'", themeScriptHash, evalSource]
      : ["'self'", STATIC_INLINE || themeScriptHash, evalSource]
  const supabase = supabaseUrl ? ` ${supabaseUrl}` : ''
  return [
    "default-src 'self'",
    `script-src ${script.filter(Boolean).join(' ')}`,
    // React style attributes and next/font need inline styles; style injection can't run code.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src 'self'${supabase} https://vitals.vercel-insights.com`,
    "frame-src 'self'",
    "worker-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    // Sign-in forms redirect to Supabase, then Google; Chrome applies form-action to those redirects.
    `form-action 'self'${supabase} https://accounts.google.com`,
    "frame-ancestors 'none'",
  ].join('; ')
}
