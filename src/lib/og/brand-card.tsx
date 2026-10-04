import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const fontPath = (file: string) => join(process.cwd(), 'src/assets/fonts', file)

/** Fonts for next/og. Share images are rendered at build time, so these files are read once per build. */
export async function ogFonts() {
  const [display, regular, semibold] = await Promise.all([
    readFile(fontPath('BricolageGrotesque-ExtraBold.ttf')),
    readFile(fontPath('Poppins-Regular.ttf')),
    readFile(fontPath('Poppins-SemiBold.ttf')),
  ])
  return [
    { name: 'Bricolage Grotesque', data: display, weight: 800 as const, style: 'normal' as const },
    { name: 'Poppins', data: regular, weight: 400 as const, style: 'normal' as const },
    { name: 'Poppins', data: semibold, weight: 600 as const, style: 'normal' as const },
  ]
}

const ICON =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10.4 -9.06 20.8 18.12"><g fill="#FED606" stroke="#FED606" stroke-width="0.32" stroke-linejoin="round"><polygon points="1.6,8.66 5,8.66 10,0 5,-8.66 -5,-8.66 -10,0 -5,8.66 -1,8.66 -3,5.196 -6,0 -3,-5.196 3,-5.196 6,0 3,5.196 -0.4,5.196"/><polygon points="-2.8,0 -1.4,2.425 1.4,2.425 2.8,0 1.4,-2.425 -1.4,-2.425"/></g></svg>',
  )

/**
 * The share card used by every Open Graph and X image: the Prism dark ground, a blue-to-violet glow,
 * the logo, a short eyebrow, a big title and a footer line. Flexbox only (next/og supports no grid).
 */
export function brandCard({ eyebrow, title, footer }: { eyebrow: string; title: string; footer: string }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 72px',
        background: '#07060D',
        backgroundImage:
          'radial-gradient(circle at 85% 10%, rgba(77,107,255,0.45), rgba(77,107,255,0) 45%), radial-gradient(circle at 100% 80%, rgba(123,92,255,0.40), rgba(123,92,255,0) 45%)',
        color: '#FFFFFF',
        fontFamily: 'Poppins',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- next/og renders plain <img> only */}
        <img src={ICON} width={60} height={52} alt="" />
        <div style={{ display: 'flex', fontSize: 34 }}>
          <span style={{ fontWeight: 400 }}>Practi</span>
          <span style={{ fontWeight: 600 }}>Code</span>
          <span style={{ fontWeight: 400, marginLeft: 10 }}>Learn</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 960 }}>
        <div style={{ display: 'flex', fontSize: 30, fontWeight: 600, color: '#8EA2FF' }}>{eyebrow}</div>
        <div
          style={{
            display: 'flex',
            fontFamily: 'Bricolage Grotesque',
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
          }}
        >
          {title}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', fontSize: 28, color: '#A9A6BC' }}>{footer}</div>
        <div
          style={{
            display: 'flex',
            width: 220,
            height: 10,
            borderRadius: 999,
            background: 'linear-gradient(90deg, #3D5AF5, #6E4CF5)',
          }}
        />
      </div>
    </div>
  )
}
