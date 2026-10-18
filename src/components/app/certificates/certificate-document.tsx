import type { FontName, Shape } from '@/lib/certificates/document'

const FONT: Record<FontName, { fontFamily: string; fontWeight: number }> = {
  display: { fontFamily: 'var(--font-display)', fontWeight: 800 },
  regular: { fontFamily: 'var(--font-sans)', fontWeight: 400 },
  semibold: { fontFamily: 'var(--font-sans)', fontWeight: 600 },
}

const points = (p: [number, number][]) => p.map(([x, y]) => `${x},${y}`).join(' ')

/**
 * The certificate as a picture, drawn from the same layout as the PDF download, so the page shows exactly
 * what prints. It's paper: the same colours in the light and dark themes.
 */
export function CertificateDocument({ shapes, label, id }: { shapes: Shape[]; label: string; id: string }) {
  return (
    <svg
      viewBox="0 0 842 595"
      role="img"
      aria-label={label}
      className="block h-auto w-full rounded-[inherit] bg-white"
      style={{ textRendering: 'geometricPrecision' }}
    >
      {shapes.map((s, i) => {
        if (s.kind === 'text')
          return (
            <text
              key={i}
              x={s.x}
              y={s.y}
              fontSize={s.size}
              fill={s.color}
              textAnchor={s.anchor ?? 'start'}
              style={{ ...FONT[s.font], whiteSpace: 'pre' }}
              aria-hidden="true"
            >
              {s.text}
            </text>
          )
        if (s.kind === 'polygon')
          return (
            <polygon
              key={i}
              points={points(s.points)}
              fill={s.fill ?? 'none'}
              stroke={s.stroke}
              strokeWidth={s.stroke ? (s.width ?? 1) : undefined}
              strokeLinejoin="round"
            />
          )
        if (s.kind === 'line')
          return (
            <line
              key={i}
              x1={s.from[0]}
              y1={s.from[1]}
              x2={s.to[0]}
              y2={s.to[1]}
              stroke={s.color}
              strokeWidth={s.width}
            />
          )
        if (s.kind === 'circle') return <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={s.color} />
        if (s.kind === 'rect')
          return (
            <rect
              key={i}
              x={s.x}
              y={s.y}
              width={s.w}
              height={s.h}
              rx={s.r}
              fill={s.fill ?? 'none'}
              stroke={s.stroke}
              strokeWidth={s.stroke ? (s.width ?? 1) : undefined}
            />
          )
        if (s.kind === 'gradient')
          return (
            <g key={i}>
              <defs>
                <linearGradient id={`${id}-g${i}`} x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0" stopColor={s.from} />
                  <stop offset="1" stopColor={s.to} />
                </linearGradient>
              </defs>
              <rect x={s.x} y={s.y} width={s.w} height={s.h} fill={`url(#${id}-g${i})`} />
            </g>
          )
        const cell = s.size / s.grid
        return (
          <path
            key={i}
            fill={s.color}
            shapeRendering="crispEdges"
            d={s.cells
              .map(([c, r]) => `M${s.x + c * cell} ${s.y + r * cell}h${cell}v${cell}h-${cell}z`)
              .join('')}
          />
        )
      })}
    </svg>
  )
}
