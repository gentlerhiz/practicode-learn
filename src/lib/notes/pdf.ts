// Read by the app's notes route and directly by the content tools, so: explicit .ts extensions, erasable
// syntax only, and no server-only import (nothing secret is in here).
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import fontkit from '@pdf-lib/fontkit'
import { PDFDocument, rgb, type PDFFont } from 'pdf-lib'
import type { ModuleNotes } from './content.ts'
import { layoutNotes, PAGE, type FontName } from './layout.ts'

const FONT_FILES: Record<FontName, string> = {
  display: 'BricolageGrotesque-ExtraBold.ttf',
  regular: 'Poppins-Regular.ttf',
  semibold: 'Poppins-SemiBold.ttf',
  mono: 'JetBrainsMono-Regular.ttf',
}

let cache: Record<FontName, Uint8Array> | null = null
/** The four brand fonts, read once per server instance. */
function fontBytes(): Record<FontName, Uint8Array> {
  const read = (f: FontName) => readFileSync(join(process.cwd(), 'src/assets/fonts', FONT_FILES[f]))
  cache ??= {
    display: read('display'),
    regular: read('regular'),
    semibold: read('semibold'),
    mono: read('mono'),
  }
  return cache
}

const colour = (hex: string) =>
  rgb(
    parseInt(hex.slice(1, 3), 16) / 255,
    parseInt(hex.slice(3, 5), 16) / 255,
    parseInt(hex.slice(5, 7), 16) / 255,
  )

const roundRect = (w: number, h: number, r: number) =>
  `M ${r} 0 H ${w - r} A ${r} ${r} 0 0 1 ${w} ${r} V ${h - r} A ${r} ${r} 0 0 1 ${w - r} ${h} H ${r} A ${r} ${r} 0 0 1 0 ${h - r} V ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`

type Glyphs = { hasGlyphForCodePoint: (cp: number) => boolean }
// A character the text's own font lacks (Poppins has no ₦ or arrows) comes from the next font that has it.
const FALLBACK: FontName[] = ['mono', 'display']
// Characters no brand font has, drawn as the nearest one that one does.
const NEAREST: Record<string, string> = { '✔': '✓', '✖': '✗', '✅': '✓', '❌': '✗' }

/** Splits text into stretches, each in a font that has every character in it. */
function segments(
  text: string,
  font: FontName,
  has: Record<FontName, Glyphs>,
  onMissing?: (c: string) => void,
) {
  const out: { text: string; font: FontName }[] = []
  for (const original of text) {
    const char = NEAREST[original] ?? original
    const cp = char.codePointAt(0)!
    let use = [font, ...FALLBACK].find((f) => has[f].hasGlyphForCodePoint(cp))
    if (!use) {
      if (!/\s/.test(char)) onMissing?.(char)
      use = font
    }
    const last = out.at(-1)
    if (last?.font === use) last.text += char
    else out.push({ text: char, font: use })
  }
  return out
}

/**
 * A module's notes as an A4 PDF, with its fonts embedded. `onMissing` hears of any character no brand
 * font can draw, so the content tools can catch it before learners do.
 */
export async function notesPdf(
  notes: ModuleNotes,
  options: { onMissing?: (char: string) => void } = {},
): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  doc.registerFontkit(fontkit)
  doc.setTitle(`${notes.course}, Module ${notes.module}: ${notes.title}`)
  doc.setAuthor('PractiCode Learn')
  doc.setSubject(`Module notes for ${notes.course}, Module ${notes.module}`)
  doc.setCreator('learn.practicode.tech')
  doc.setLanguage('en-GB')
  const bytes = fontBytes()
  const fonts = Object.fromEntries(
    await Promise.all(
      (Object.keys(bytes) as FontName[]).map(
        async (f) => [f, await doc.embedFont(bytes[f], { subset: true })] as const,
      ),
    ),
  ) as Record<FontName, PDFFont>

  const has = Object.fromEntries(
    (Object.keys(bytes) as FontName[]).map((f) => [
      f,
      fontkit.create(bytes[f] as Buffer) as unknown as Glyphs,
    ]),
  ) as Record<FontName, Glyphs>
  const measure = (text: string, font: FontName, size: number) =>
    segments(text, font, has).reduce((w, s) => w + fonts[s.font].widthOfTextAtSize(s.text, size), 0)
  // pdf-lib measures y from the bottom; the layout measures it from the top.
  const Y = (y: number) => PAGE.height - y

  for (const shapes of layoutNotes(notes, measure)) {
    const page = doc.addPage([PAGE.width, PAGE.height])
    for (const s of shapes) {
      if (s.kind === 'text') {
        let x = s.x
        for (const seg of segments(s.text, s.font, has, options.onMissing)) {
          page.drawText(seg.text, {
            x,
            y: Y(s.y),
            size: s.size,
            font: fonts[seg.font],
            color: colour(s.color),
          })
          x += fonts[seg.font].widthOfTextAtSize(seg.text, s.size)
        }
      } else if (s.kind === 'rect') {
        page.drawSvgPath(roundRect(s.w, s.h, Math.min(s.r ?? 0, s.h / 2, s.w / 2)), {
          x: s.x,
          y: Y(s.y),
          color: s.fill ? colour(s.fill) : undefined,
          borderColor: s.stroke ? colour(s.stroke) : undefined,
          borderWidth: s.stroke ? 0.75 : 0,
        })
      } else if (s.kind === 'circle') {
        page.drawCircle({ x: s.cx, y: Y(s.cy), size: s.r, color: colour(s.color) })
      } else {
        page.drawSvgPath(`M ${s.points.map(([x, y]) => `${x} ${y}`).join(' L ')} Z`, {
          x: 0,
          y: PAGE.height,
          color: colour(s.fill),
        })
      }
    }
  }
  return doc.save()
}
