import 'server-only'
import fontkit from '@pdf-lib/fontkit'
import { PDFDocument, type PDFFont, rgb as pdfRgb } from 'pdf-lib'
import {
  blend,
  fontBytes,
  layoutCertificate,
  PAGE,
  rgb,
  type CertificateInput,
  type FontName,
} from './document.ts'

const colour = (hex: string) => pdfRgb(...rgb(hex))

/** A rounded rectangle as an SVG path, from the top left, for pdf-lib's drawSvgPath. */
const roundRect = (w: number, h: number, r: number) =>
  `M ${r} 0 H ${w - r} A ${r} ${r} 0 0 1 ${w} ${r} V ${h - r} A ${r} ${r} 0 0 1 ${w - r} ${h} H ${r} A ${r} ${r} 0 0 1 0 ${h - r} V ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`

/** The certificate as a one-page A4 landscape PDF, with its fonts embedded. */
export async function certificatePdf(input: CertificateInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  doc.registerFontkit(fontkit)
  doc.setTitle(`${input.name}: ${input.course}`)
  doc.setAuthor('PractiCode Learn')
  doc.setSubject(`Certificate of completion ${input.code}. Check it at ${input.url}`)
  doc.setCreator('learn.practicode.tech')
  const bytes = fontBytes()
  const fonts = Object.fromEntries(
    await Promise.all(
      (Object.keys(bytes) as FontName[]).map(
        async (f) => [f, await doc.embedFont(bytes[f], { subset: true })] as const,
      ),
    ),
  ) as Record<FontName, PDFFont>

  const page = doc.addPage([PAGE.width, PAGE.height])
  // pdf-lib measures y from the bottom; the layout measures it from the top.
  const Y = (y: number) => PAGE.height - y

  for (const s of layoutCertificate(input)) {
    if (s.kind === 'text') {
      const width = fonts[s.font].widthOfTextAtSize(s.text, s.size)
      const x = s.anchor === 'middle' ? s.x - width / 2 : s.anchor === 'end' ? s.x - width : s.x
      page.drawText(s.text, { x, y: Y(s.y), size: s.size, font: fonts[s.font], color: colour(s.color) })
    } else if (s.kind === 'polygon') {
      const path = `M ${s.points.map(([x, y]) => `${x} ${y}`).join(' L ')} Z`
      page.drawSvgPath(path, {
        x: 0,
        y: PAGE.height,
        color: s.fill ? colour(s.fill) : undefined,
        borderColor: s.stroke ? colour(s.stroke) : undefined,
        borderWidth: s.stroke ? (s.width ?? 1) : 0,
        borderLineCap: 1,
      })
    } else if (s.kind === 'line') {
      page.drawLine({
        start: { x: s.from[0], y: Y(s.from[1]) },
        end: { x: s.to[0], y: Y(s.to[1]) },
        thickness: s.width,
        color: colour(s.color),
      })
    } else if (s.kind === 'circle') {
      page.drawCircle({ x: s.cx, y: Y(s.cy), size: s.r, color: colour(s.color) })
    } else if (s.kind === 'rect') {
      page.drawSvgPath(roundRect(s.w, s.h, s.r ?? 0), {
        x: s.x,
        y: Y(s.y),
        color: s.fill ? colour(s.fill) : undefined,
        borderColor: s.stroke ? colour(s.stroke) : undefined,
        borderWidth: s.stroke ? (s.width ?? 1) : 0,
      })
    } else if (s.kind === 'gradient') {
      // PDF gradients need shading objects pdf-lib doesn't draw, so blend thin slices instead.
      const slices = 120
      for (let i = 0; i < slices; i++) {
        page.drawRectangle({
          x: s.x + (s.w * i) / slices,
          y: Y(s.y + s.h),
          width: s.w / slices + 0.5,
          height: s.h,
          color: pdfRgb(...blend(s.from, s.to, i / (slices - 1))),
        })
      }
    } else if (s.kind === 'qr') {
      const cell = s.size / s.grid
      for (const [col, row] of s.cells) {
        page.drawRectangle({
          x: s.x + col * cell,
          y: Y(s.y + (row + 1) * cell),
          width: cell + 0.05,
          height: cell + 0.05,
          color: colour(s.color),
        })
      }
    }
  }
  return doc.save()
}
