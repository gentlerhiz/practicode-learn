import 'server-only'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import fontkit from '@pdf-lib/fontkit'
import QRCode from 'qrcode'

/**
 * The certificate itself: one A4 landscape page (842 × 595 points), laid out once and drawn twice, as the
 * PDF download (pdf.ts) and as the picture on the certificate page (certificate-document.tsx). Both read
 * this model, so they always match. Coordinates start at the top left; a text's y is its baseline.
 */
export const PAGE = { width: 842, height: 595 } as const

export type FontName = 'display' | 'regular' | 'semibold'
export type Text = {
  kind: 'text'
  x: number
  y: number
  text: string
  font: FontName
  size: number
  color: string
  anchor?: 'start' | 'middle' | 'end'
}
export type Shape =
  | Text
  | { kind: 'polygon'; points: [number, number][]; fill?: string; stroke?: string; width?: number }
  | { kind: 'line'; from: [number, number]; to: [number, number]; color: string; width: number }
  | { kind: 'circle'; cx: number; cy: number; r: number; color: string }
  | {
      kind: 'rect'
      x: number
      y: number
      w: number
      h: number
      r?: number
      fill?: string
      stroke?: string
      width?: number
    }
  /** A left-to-right blend from the first colour to the second. */
  | { kind: 'gradient'; x: number; y: number; w: number; h: number; from: string; to: string }
  /** The dark modules of a QR code, as unit squares in a size × size grid drawn at x, y. */
  | { kind: 'qr'; x: number; y: number; size: number; grid: number; cells: [number, number][]; color: string }

export type CertificateInput = {
  name: string
  course: string
  /** The two lines on the badge, such as Front-End and Web Development. */
  badge: [string, string]
  detail: string
  issued: string
  code: string
  /** The address the QR code and the "Verify at" line point to. */
  url: string
}

const INK = '#15122A'
const MUTED = '#5D5972'
const SUBTLE = '#77738C'
const LINE = '#E4E1EE'
const BLUE = '#3D5AF5'
const VIOLET = '#7B5CFF'

const FONT_FILES: Record<FontName, string> = {
  display: 'BricolageGrotesque-ExtraBold.ttf',
  regular: 'Poppins-Regular.ttf',
  semibold: 'Poppins-SemiBold.ttf',
}
const fontDir = () => join(process.cwd(), 'src/assets/fonts')

let cache: Record<FontName, Uint8Array> | null = null
/** The three font files, read once per server instance. */
export function fontBytes(): Record<FontName, Uint8Array> {
  cache ??= {
    display: readFileSync(join(fontDir(), FONT_FILES.display)),
    regular: readFileSync(join(fontDir(), FONT_FILES.regular)),
    semibold: readFileSync(join(fontDir(), FONT_FILES.semibold)),
  }
  return cache
}

type Measurer = (text: string, font: FontName, size: number) => number
let measurer: Measurer | null = null
/** The width of a line of text in points, from the real font files, so long names can be fitted. */
export function measure(text: string, font: FontName, size: number): number {
  if (!measurer) {
    const fonts = Object.fromEntries(
      (Object.keys(FONT_FILES) as FontName[]).map((f) => [f, fontkit.create(fontBytes()[f] as Buffer)]),
    ) as Record<FontName, ReturnType<typeof fontkit.create>>
    measurer = (t, f, s) => (fonts[f].layout(t).advanceWidth / fonts[f].unitsPerEm) * s
  }
  return measurer(text, font, size)
}

/** The biggest size, from `max` down to `min`, at which the text fits `width`. */
function fit(text: string, font: FontName, max: number, min: number, width: number) {
  for (let size = max; size > min; size -= 1) if (measure(text, font, size) <= width) return size
  return min
}

const hexagon = (cx: number, cy: number, r: number): [number, number][] =>
  Array.from({ length: 6 }, (_, i) => {
    const a = ((-90 + 60 * i) * Math.PI) / 180
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  })

// The PractiCode mark (brand/logo), in its own units: 20.8 wide and 18.12 tall, centred on 0, 0.
const MARK: [number, number][][] = [
  [
    [1.6, 8.66],
    [5, 8.66],
    [10, 0],
    [5, -8.66],
    [-5, -8.66],
    [-10, 0],
    [-5, 8.66],
    [-1, 8.66],
    [-3, 5.196],
    [-6, 0],
    [-3, -5.196],
    [3, -5.196],
    [6, 0],
    [3, 5.196],
    [-0.4, 5.196],
  ],
  [
    [-2.8, 0],
    [-1.4, 2.425],
    [1.4, 2.425],
    [2.8, 0],
    [1.4, -2.425],
    [-1.4, -2.425],
  ],
]
const mark = (cx: number, cy: number, scale: number, color: string): Shape[] =>
  MARK.map((poly) => ({
    kind: 'polygon',
    points: poly.map(([x, y]) => [cx + x * scale, cy + y * scale] as [number, number]),
    fill: color,
  }))

/** Lays out one certificate. */
export function layoutCertificate(c: CertificateInput): Shape[] {
  const left = 58
  const right = PAGE.width - 58
  const text = (t: Omit<Text, 'kind'>): Text => ({ kind: 'text', ...t })
  const shapes: Shape[] = []

  // Paper: a blue-to-violet strip across the top, and a hairline frame.
  shapes.push({ kind: 'gradient', x: 0, y: 0, w: PAGE.width, h: 8, from: BLUE, to: VIOLET })
  shapes.push({
    kind: 'rect',
    x: 22,
    y: 30,
    w: PAGE.width - 44,
    h: PAGE.height - 52,
    r: 18,
    stroke: LINE,
    width: 1,
  })

  // Header: the logo and wordmark, and what this is.
  shapes.push(...mark(left + 15, 66, 1.45, INK))
  let x = left + 40
  for (const [part, font] of [
    ['Practi', 'regular'],
    ['Code', 'semibold'],
    [' Learn', 'regular'],
  ] as [string, FontName][]) {
    shapes.push(text({ x, y: 72, text: part, font, size: 16, color: INK }))
    x += measure(part, font, 16)
  }
  const label = 'Certificate of completion'
  const labelWidth = measure(label, 'semibold', 11) + 28
  shapes.push({ kind: 'rect', x: right - labelWidth, y: 51, w: labelWidth, h: 28, r: 14, fill: '#EEF1FF' })
  shapes.push(
    text({
      x: right - labelWidth / 2,
      y: 69,
      text: label,
      font: 'semibold',
      size: 11,
      color: BLUE,
      anchor: 'middle',
    }),
  )

  // The badge, with faint hexagons behind it.
  const bx = 682
  const by = 250
  shapes.push({ kind: 'polygon', points: hexagon(bx, by, 132), stroke: '#EDEBF6', width: 1.5 })
  shapes.push({ kind: 'polygon', points: hexagon(bx, by, 96), fill: '#F6F7FF', stroke: BLUE, width: 5 })
  shapes.push({ kind: 'polygon', points: hexagon(bx, by, 80), stroke: LINE, width: 1 })
  shapes.push({ kind: 'circle', cx: bx - 48, cy: by - 70, r: 5, color: '#8EA2FF' })
  shapes.push({ kind: 'circle', cx: bx + 64, cy: by - 38, r: 4, color: '#A9B7FF' })
  shapes.push({ kind: 'circle', cx: bx - 56, cy: by + 52, r: 4, color: '#6F86FF' })
  shapes.push(...mark(bx, by - 20, 2.6, INK))
  shapes.push(
    text({ x: bx, y: by + 34, text: c.badge[0], font: 'display', size: 15, color: INK, anchor: 'middle' }),
  )
  shapes.push(
    text({ x: bx, y: by + 50, text: c.badge[1], font: 'regular', size: 10, color: MUTED, anchor: 'middle' }),
  )

  // Who, and what they completed.
  // The name gets one line when it fits at 30 points or more, else two lines, split at the middle space.
  const width = 500
  shapes.push(text({ x: left, y: 190, text: 'This certifies that', font: 'regular', size: 14, color: MUTED }))
  const oneLine = fit(c.name, 'display', 50, 30, width)
  if (measure(c.name, 'display', oneLine) <= width || !c.name.includes(' ')) {
    const size = fit(c.name, 'display', 50, 16, width)
    shapes.push(
      text({ x: left, y: 198 + Math.min(size, 50), text: c.name, font: 'display', size, color: INK }),
    )
  } else {
    const words = c.name.split(' ')
    let split = 1
    for (let i = 1; i < words.length; i++) {
      const a = measure(words.slice(0, i).join(' '), 'display', 10)
      const b = measure(words.slice(i).join(' '), 'display', 10)
      const best = Math.max(
        measure(words.slice(0, split).join(' '), 'display', 10),
        measure(words.slice(split).join(' '), 'display', 10),
      )
      if (Math.max(a, b) < best) split = i
    }
    const lines = [words.slice(0, split).join(' '), words.slice(split).join(' ')]
    const size = Math.min(...lines.map((l) => fit(l, 'display', 34, 16, width)))
    lines.forEach((l, i) =>
      shapes.push(
        text({ x: left, y: 196 + size * (1 + i * 1.12), text: l, font: 'display', size, color: INK }),
      ),
    )
  }
  const courseSize = fit(c.course, 'display', 30, 18, width)
  shapes.push(
    text({
      x: left,
      y: 304,
      text: 'has completed every lesson and exercise in',
      font: 'regular',
      size: 14,
      color: MUTED,
    }),
  )
  shapes.push(
    text({ x: left, y: 310 + courseSize, text: c.course, font: 'display', size: courseSize, color: BLUE }),
  )
  shapes.push(text({ x: left, y: 374, text: c.detail, font: 'regular', size: 12, color: SUBTLE }))

  // The facts, and how to check them.
  shapes.push({ kind: 'line', from: [left, 436], to: [right, 436], color: LINE, width: 1 })
  const facts: [number, string, string, number][] = [
    [left, 'Issued', c.issued, 13],
    [left + 164, 'Credential ID', c.code, 13],
    [left + 330, 'Verify at', c.url.replace(/^https?:\/\//, ''), 10.5],
  ]
  for (const [fx, k, v, size] of facts) {
    shapes.push(text({ x: fx, y: 468, text: k, font: 'regular', size: 10, color: SUBTLE }))
    shapes.push(text({ x: fx, y: 488, text: v, font: 'semibold', size, color: INK }))
  }
  shapes.push(
    text({
      x: left,
      y: 530,
      text: 'Issued by PractiCode Learn. Scan the code, or visit the address, to check this certificate is real.',
      font: 'regular',
      size: 9.5,
      color: SUBTLE,
    }),
  )

  const qr = QRCode.create(c.url, { errorCorrectionLevel: 'M' }).modules
  const cells: [number, number][] = []
  for (let row = 0; row < qr.size; row++)
    for (let col = 0; col < qr.size; col++) if (qr.get(row, col)) cells.push([col, row])
  shapes.push({ kind: 'qr', x: right - 84, y: 452, size: 84, grid: qr.size, cells, color: INK })

  return shapes
}

/** Splits a hex colour into 0–1 channels, and blends two of them. */
export const rgb = (hex: string) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number]
export const blend = (a: string, b: string, t: number) => {
  const [x, y] = [rgb(a), rgb(b)]
  return x.map((v, i) => v + (y[i]! - v) * t) as [number, number, number]
}
