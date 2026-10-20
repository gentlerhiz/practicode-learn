import type { TrackTone } from '@/content/catalogue'
import { cn } from '@/lib/cn'

/**
 * Each subject's illustration, drawn from the canvas (decorative). A course that shares its subject with
 * another (Python, SQL, JavaScript in Depth, Cybersecurity and Linux) passes its code for its own.
 */
export function Illustration({ tone, code, className }: { tone: TrackTone; code?: string; className?: string }) {
  const cls = cn(
    'pointer-events-none absolute -right-3 -bottom-3 h-[133px] w-[160px] ph:-right-6 ph:-bottom-4 ph:h-[216px] ph:w-[260px]',
    className,
  )
  if (code === 'be')
    return (
      <svg viewBox="0 0 240 200" aria-hidden="true" className={cls}>
        <rect x="120" y="30" width="104" height="44" rx="12" fill="rgba(255,255,255,0.14)" stroke="rgba(142,162,255,0.6)" strokeWidth="1.5" />
        <rect x="120" y="84" width="104" height="44" rx="12" fill="rgba(255,255,255,0.14)" stroke="rgba(142,162,255,0.6)" strokeWidth="1.5" />
        <rect x="120" y="138" width="104" height="44" rx="12" fill="rgba(255,255,255,0.14)" stroke="rgba(142,162,255,0.6)" strokeWidth="1.5" />
        <circle cx="140" cy="52" r="6" fill="#2FE6B0" />
        <circle cx="140" cy="106" r="6" fill="#2FE6B0" />
        <circle cx="140" cy="160" r="6" fill="#FFD66B" />
        <path d="M156 52h50M156 106h50M156 160h50" stroke="rgba(255,255,255,0.5)" strokeWidth="6" strokeLinecap="round" />
        <rect x="14" y="60" width="78" height="26" rx="8" fill="#FFFFFF" />
        <text x="24" y="78" fontSize="13" fontWeight="700" fill="#1c2785" fontFamily="var(--font-mono)">GET /</text>
        <path d="M92 73h20m-7-7 7 7-7 7" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="14" y="112" width="78" height="26" rx="8" fill="#2FE6B0" />
        <text x="24" y="130" fontSize="13" fontWeight="700" fill="#0a4e3d" fontFamily="var(--font-mono)">200 OK</text>
        <path d="M112 125H96m7-7-7 7 7 7" fill="none" stroke="#2FE6B0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  if (code === 'py')
    return (
      <svg viewBox="0 0 240 200" aria-hidden="true" className={cls}>
        <rect x="14" y="22" width="212" height="168" rx="20" fill="rgba(255,255,255,0.08)" stroke="rgba(142,162,255,0.5)" strokeWidth="1.5" />
        <text x="32" y="66" fontSize="20" fontWeight="700" fill="#FFD66B" fontFamily="var(--font-mono)">&gt;&gt;&gt;</text>
        <rect x="84" y="52" width="104" height="12" rx="6" fill="#FFFFFF" />
        <rect x="32" y="84" width="150" height="10" rx="5" fill="rgba(255,255,255,0.35)" />
        <rect x="52" y="106" width="110" height="10" rx="5" fill="rgba(255,255,255,0.35)" />
        <path d="M150 176c0-22 34-18 34-40s-34-20-34-40" fill="none" stroke="#FFD66B" strokeWidth="9" strokeLinecap="round" />
        <circle cx="150" cy="96" r="9" fill="#FFD66B" />
        <circle cx="147" cy="94" r="2.5" fill="#1c2785" />
      </svg>
    )
  if (code === 'sq')
    return (
      <svg viewBox="0 0 240 200" aria-hidden="true" className={cls}>
        <rect x="18" y="34" width="130" height="130" rx="14" fill="rgba(255,255,255,0.08)" stroke="rgba(47,230,176,0.5)" strokeWidth="1.5" />
        <path d="M18 70h130M18 106h130M62 34v130" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        <rect x="74" y="80" width="62" height="16" rx="5" fill="#2FE6B0" />
        <ellipse cx="180" cy="84" rx="40" ry="14" fill="#FFFFFF" />
        <path d="M140 84v70c0 8 18 14 40 14s40-6 40-14V84" fill="rgba(255,255,255,0.2)" stroke="#FFFFFF" strokeWidth="2" />
        <path d="M140 118c0 8 18 14 40 14s40-6 40-14" fill="none" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="100" cy="118" r="20" fill="rgba(10,78,61,0.85)" stroke="#2FE6B0" strokeWidth="6" />
        <path d="m114 132 16 16" stroke="#2FE6B0" strokeWidth="8" strokeLinecap="round" />
      </svg>
    )
  if (code === 'js')
    return (
      <svg viewBox="0 0 240 200" aria-hidden="true" className={cls}>
        <path d="M70 30H58a14 14 0 0 0-14 14v34a14 14 0 0 1-14 14 14 14 0 0 1 14 14v34a14 14 0 0 0 14 14h12" fill="none" stroke="#8EA2FF" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M170 30h12a14 14 0 0 1 14 14v34a14 14 0 0 0 14 14 14 14 0 0 0-14 14v34a14 14 0 0 1-14 14h-12" fill="none" stroke="#8EA2FF" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="84" y="62" width="72" height="12" rx="6" fill="#FFFFFF" />
        <rect x="96" y="86" width="60" height="12" rx="6" fill="rgba(255,255,255,0.4)" />
        <rect x="96" y="110" width="44" height="12" rx="6" fill="rgba(255,255,255,0.4)" />
        <rect x="84" y="134" width="30" height="12" rx="6" fill="#FFD66B" />
      </svg>
    )
  if (code === 'cl')
    return (
      <svg viewBox="0 0 240 200" aria-hidden="true" className={cls}>
        <rect x="14" y="26" width="190" height="140" rx="16" fill="rgba(0,0,0,0.3)" stroke="rgba(95,216,242,0.6)" strokeWidth="1.5" />
        <path d="M14 52h190" stroke="rgba(95,216,242,0.4)" strokeWidth="1.5" />
        <path d="m34 76 16 14-16 14" fill="none" stroke="#5FD8F2" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="60" y="98" width="56" height="8" rx="4" fill="#FFFFFF" />
        <rect x="34" y="122" width="96" height="8" rx="4" fill="rgba(255,255,255,0.35)" />
        <path d="M184 104 222 118v26c0 24-17 38-38 46-21-8-38-22-38-46v-26z" fill="#0E7490" stroke="#FFFFFF" strokeWidth="2.5" />
        <path d="m172 146 9 9 17-18" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  if (tone === 'it')
    return (
      <svg viewBox="0 0 240 200" aria-hidden="true" className={cls}>
        <rect x="20" y="24" width="170" height="112" rx="14" fill="rgba(255,255,255,0.1)" stroke="rgba(255,193,92,0.6)" strokeWidth="1.5" />
        <rect x="34" y="40" width="64" height="44" rx="8" fill="rgba(255,255,255,0.22)" />
        <path d="M34 98h52M34 112h86" stroke="rgba(255,255,255,0.45)" strokeWidth="8" strokeLinecap="round" />
        <path d="M112 48h18l6 6h40v34h-64z" fill="#FFC15C" />
        <path d="M82 136h46l8 22H74z" fill="rgba(255,255,255,0.18)" />
        <rect x="150" y="96" width="70" height="92" rx="14" fill="rgba(255,255,255,0.16)" stroke="#FFFFFF" strokeWidth="2" />
        <text x="162" y="134" fontSize="18" fill="#FFFFFF" fontFamily="var(--font-mono)">&gt;_</text>
        <circle cx="185" cy="172" r="5" fill="#FFFFFF" />
      </svg>
    )
  if (tone === 'cy')
    return (
      <svg viewBox="0 0 240 200" aria-hidden="true" className={cls}>
        <path d="M120 16 196 44v52c0 46-32 78-76 92-44-14-76-46-76-92V44z" fill="rgba(255,255,255,0.1)" stroke="rgba(95,216,242,0.6)" strokeWidth="2" />
        <path d="M120 40 174 60v38c0 32-22 56-54 66-32-10-54-34-54-66V60z" fill="rgba(255,255,255,0.16)" />
        <rect x="94" y="92" width="52" height="42" rx="9" fill="#FFFFFF" />
        <path d="M104 92V80a16 16 0 0 1 32 0v12" fill="none" stroke="#FFFFFF" strokeWidth="7" />
        <circle cx="120" cy="110" r="6" fill="#0E7490" />
        <path d="M120 114v9" stroke="#0E7490" strokeWidth="5" strokeLinecap="round" />
        <circle cx="206" cy="150" r="10" fill="#5FD8F2" />
      </svg>
    )
  if (tone === 'fe')
    return (
      <svg viewBox="0 0 240 200" aria-hidden="true" className={cls}>
        <rect
          x="10"
          y="20"
          width="220"
          height="170"
          rx="20"
          fill="rgba(255,255,255,0.08)"
          stroke="rgba(142,162,255,0.5)"
          strokeWidth="1.5"
        />
        <circle cx="34" cy="42" r="5" fill="#F0407F" />
        <circle cx="50" cy="42" r="5" fill="#FF8A3D" />
        <circle cx="66" cy="42" r="5" fill="#2FE6B0" />
        <rect x="30" y="66" width="120" height="10" rx="5" fill="#8EA2FF" />
        <rect x="30" y="88" width="170" height="10" rx="5" fill="rgba(255,255,255,0.35)" />
        <rect x="30" y="110" width="90" height="10" rx="5" fill="rgba(255,255,255,0.35)" />
        <rect x="30" y="138" width="80" height="30" rx="10" fill="#FFFFFF" />
      </svg>
    )
  if (tone === 'da')
    return (
      <svg viewBox="0 0 240 200" aria-hidden="true" className={cls}>
        <rect x="20" y="110" width="34" height="80" rx="8" fill="rgba(255,255,255,0.18)" />
        <rect x="66" y="80" width="34" height="110" rx="8" fill="rgba(255,255,255,0.28)" />
        <rect x="112" y="96" width="34" height="94" rx="8" fill="rgba(255,255,255,0.18)" />
        <rect x="158" y="44" width="34" height="146" rx="8" fill="#2FE6B0" />
        <path
          d="M20 80 C60 70 80 40 120 56 S 180 20 220 16"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="220" cy="16" r="8" fill="#FFFFFF" />
      </svg>
    )
  if (tone === 'ux')
    return (
      <svg viewBox="0 0 240 200" aria-hidden="true" className={cls}>
        <rect x="40" y="30" width="120" height="150" rx="18" fill="rgba(255,255,255,0.1)" />
        <rect x="90" y="56" width="120" height="130" rx="18" fill="rgba(255,255,255,0.2)" />
        <rect x="108" y="76" width="84" height="40" rx="10" fill="#FFFFFF" />
        <rect x="108" y="126" width="60" height="8" rx="4" fill="#FFFFFF" />
        <rect x="108" y="142" width="44" height="8" rx="4" fill="rgba(255,255,255,0.6)" />
        <path
          d="M176 132 l0 34 l9 -8 l7 15 l7 -3 l-7 -15 l12 0 z"
          fill="#07060D"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
    )
  return (
    <svg viewBox="0 0 240 200" aria-hidden="true" className={cls}>
      <g stroke="rgba(255,255,255,0.35)" strokeWidth="2">
        <path d="M40 40 120 70M40 40 120 130M40 100 120 70M40 100 120 130M40 160 120 70M40 160 120 130M120 70 200 100M120 130 200 100" />
      </g>
      <g fill="rgba(255,255,255,0.85)">
        <circle cx="40" cy="40" r="12" />
        <circle cx="40" cy="100" r="12" />
        <circle cx="40" cy="160" r="12" />
        <circle cx="120" cy="70" r="14" />
        <circle cx="120" cy="130" r="14" />
      </g>
      <circle cx="200" cy="100" r="18" fill="#2FE6B0" />
    </svg>
  )
}
