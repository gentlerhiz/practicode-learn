// Read by the app and directly by the content tools, so: explicit .ts extensions, erasable syntax only.
import { MARK } from '../brand/mark.ts'
import type { ModuleNotes, Para, Run, Snippet } from './content.ts'

/**
 * Module notes laid out on A4 portrait pages (595 × 842 points) in Prism light, with code on the dark
 * code panel. Pure: the caller passes a `measure` for its fonts, so this runs the same in tests and in the
 * PDF route. Coordinates start at the top left; a text's y is its baseline.
 */
export const PAGE = { width: 595.28, height: 841.89 } as const

export type FontName = 'display' | 'regular' | 'semibold' | 'mono'
export type Measure = (text: string, font: FontName, size: number) => number

export type Shape =
  | { kind: 'text'; x: number; y: number; text: string; font: FontName; size: number; color: string }
  | { kind: 'rect'; x: number; y: number; w: number; h: number; r?: number; fill?: string; stroke?: string }
  | { kind: 'circle'; cx: number; cy: number; r: number; color: string }
  | { kind: 'polygon'; points: [number, number][]; fill: string }

export type Page = Shape[]

// Prism light, and the code panel (the brand's colour tokens).
const C = {
  page: '#FFFFFF',
  surface: '#FAF9FD',
  sunken: '#F2F0F8',
  line: '#DFDCE9',
  lineSubtle: '#E9E7F1',
  ink: '#15122A',
  inkSoft: '#3B3752',
  muted: '#5D5972',
  subtle: '#66627A',
  blue: '#3D5AF5',
  blueText: '#3550E6',
  blueTint: '#EAEDFF',
  codeBg: '#0E0C1A',
  codeBar: '#13101F',
  codeText: '#DCD9EA',
  codeMuted: '#8B88A0',
} as const

const LEFT = 50
const RIGHT = PAGE.width - 50
const WIDTH = RIGHT - LEFT
const TOP = 54
// Content stops here; the footer sits below it.
const BOTTOM = PAGE.height - 62

type Style = { size: number; lead: number; color: string; font?: FontName }
const BODY: Style = { size: 10.5, lead: 16, color: C.inkSoft }

type Piece = { text: string; font: FontName; size: number; code: boolean; width: number }
type Line = { pieces: Piece[]; width: number }

/** Splits runs into words (with their spaces) and wraps them to `width`, breaking over-long words. */
export function wrapRuns(runs: Para, style: Style, width: number, measure: Measure): Line[] {
  const fontOf = (r: Run): FontName => (r.code ? 'mono' : r.bold ? 'semibold' : (style.font ?? 'regular'))
  const sizeOf = (r: Run) => (r.code ? style.size * 0.9 : style.size)
  const words: Piece[] = []
  for (const r of runs) {
    for (const part of r.text.split(/(\s+)/)) {
      if (!part) continue
      const font = fontOf(r)
      const size = sizeOf(r)
      const text = /^\s+$/.test(part) ? ' ' : part
      words.push({ text, font, size, code: Boolean(r.code), width: measure(text, font, size) })
    }
  }
  const lines: Line[] = []
  let line: Line = { pieces: [], width: 0 }
  const push = () => {
    // A line never starts or ends with a space.
    while (line.pieces.at(-1)?.text === ' ') line.width -= line.pieces.pop()!.width
    if (line.pieces.length) lines.push(line)
    line = { pieces: [], width: 0 }
  }
  for (const w of words) {
    if (w.text === ' ' && !line.pieces.length) continue
    if (line.width + w.width <= width) {
      line.pieces.push(w)
      line.width += w.width
      continue
    }
    if (w.text === ' ') {
      push()
      continue
    }
    if (line.pieces.length) push()
    // A word wider than the whole line (a long address or code) is broken by characters.
    let rest = w.text
    while (measure(rest, w.font, w.size) > width) {
      let n = rest.length - 1
      while (n > 1 && measure(rest.slice(0, n), w.font, w.size) > width) n--
      const head = rest.slice(0, n)
      lines.push({ pieces: [{ ...w, text: head, width: measure(head, w.font, w.size) }], width })
      rest = rest.slice(n)
    }
    const tail = { ...w, text: rest, width: measure(rest, w.font, w.size) }
    line = { pieces: [tail], width: tail.width }
  }
  push()
  return lines
}

/** Draws one wrapped line at a baseline. Inline code sits on a soft well, as in the app. */
function drawLine(line: Line, x: number, y: number, style: Style): Shape[] {
  const shapes: Shape[] = []
  // Words in the same style are drawn as one stretch of text, so copying from the PDF keeps its spaces.
  const merged: Piece[] = []
  for (const p of line.pieces) {
    const last = merged.at(-1)
    if (last && last.font === p.font && last.size === p.size && last.code === p.code) {
      last.text += p.text
      last.width += p.width
    } else merged.push({ ...p })
  }
  let at = x
  for (const p of merged) {
    if (p.code) {
      shapes.push({
        kind: 'rect',
        x: at - 1.5,
        y: y - p.size * 0.95,
        w: p.width + 3,
        h: p.size * 1.35,
        r: 2.5,
        fill: C.sunken,
      })
    }
    shapes.push({ kind: 'text', x: at, y, text: p.text, font: p.font, size: p.size, color: style.color })
    at += p.width
  }
  return shapes
}

const mark = (cx: number, cy: number, scale: number, color: string): Shape[] =>
  MARK.map((poly) => ({
    kind: 'polygon',
    points: poly.map(([x, y]) => [cx + x * scale, cy + y * scale] as [number, number]),
    fill: color,
  }))

/** Pages that fill top to bottom: a block that doesn't fit the rest of the page starts the next one. */
class Flow {
  pages: Page[] = [[]]
  y = TOP
  readonly measure: Measure
  constructor(measure: Measure) {
    this.measure = measure
  }

  get page() {
    return this.pages.at(-1)!
  }
  newPage() {
    this.pages.push([])
    this.y = TOP
  }
  /** Makes room for `h` points, starting a page if needed (unless this page is still empty). */
  need(h: number) {
    if (this.y + h > BOTTOM && this.y > TOP) this.newPage()
  }
  gap(h: number) {
    if (this.y > TOP) this.y += h
  }
  /** A paragraph, line by line, so a long one can carry on over the page. */
  text(runs: Para, style: Style = BODY, x = LEFT, width = WIDTH) {
    for (const line of wrapRuns(runs, style, width, this.measure)) {
      this.need(style.lead)
      this.page.push(...drawLine(line, x, this.y + style.lead * 0.72, style))
      this.y += style.lead
    }
  }
  /** Wrapped lines measured but not yet placed, for blocks that must stay together. */
  lines(runs: Para, style: Style, width: number) {
    return wrapRuns(runs, style, width, this.measure)
  }
}

const plainRun = (text: string): Para => [{ text }]

const H2: Style = { size: 19, lead: 24, color: C.ink, font: 'display' }
const H3: Style = { size: 11.5, lead: 18, color: C.ink, font: 'semibold' }
const LABEL: Style = { size: 9.5, lead: 14, color: C.blueText, font: 'semibold' }
const MUTED: Style = { size: 10, lead: 15, color: C.muted }

function heading(flow: Flow, text: string, style: Style, keep: number) {
  const lines = flow.lines(plainRun(text), style, WIDTH)
  // Keep a heading with the start of what follows it.
  flow.need(lines.length * style.lead + keep)
  flow.text(plainRun(text), style)
}

function bullets(flow: Flow, items: Para[]) {
  for (const item of items) {
    const lines = flow.lines(item, BODY, WIDTH - 16)
    flow.need(Math.min(lines.length, 2) * BODY.lead)
    flow.page.push({
      kind: 'circle',
      cx: LEFT + 3.5,
      cy: flow.y + BODY.lead * 0.72 - 3.4,
      r: 2.4,
      color: C.blue,
    })
    flow.text(item, BODY, LEFT + 16, WIDTH - 16)
    flow.y += 3
  }
}

const CODE = { size: 8.6, lead: 12.4, pad: 12, bar: 20 }

/** A code panel: a file bar with the label, then the code, wrapped to the panel. */
function codePanel(flow: Flow, s: Snippet) {
  const inner = WIDTH - CODE.pad * 2
  const charW = flow.measure('M', 'mono', CODE.size)
  const perLine = Math.max(20, Math.floor(inner / charW))
  const rows = s.code.split('\n').flatMap((l) => {
    if (l.length <= perLine) return [l]
    const indent = l.match(/^\s*/)![0] + '  '
    const out = [l.slice(0, perLine)]
    for (let i = perLine; i < l.length; i += perLine - indent.length)
      out.push(indent + l.slice(i, i + perLine - indent.length))
    return out
  })
  const h = CODE.bar + CODE.pad + rows.length * CODE.lead + CODE.pad - 4
  flow.need(h)
  const y = flow.y
  flow.page.push({ kind: 'rect', x: LEFT, y, w: WIDTH, h, r: 8, fill: C.codeBg })
  flow.page.push({ kind: 'rect', x: LEFT, y, w: WIDTH, h: CODE.bar, r: 8, fill: C.codeBar })
  // Square off the bar's bottom corners where it meets the code.
  flow.page.push({ kind: 'rect', x: LEFT, y: y + CODE.bar - 8, w: WIDTH, h: 8, fill: C.codeBar })
  flow.page.push({
    kind: 'text',
    x: LEFT + CODE.pad,
    y: y + 13.5,
    text: s.label,
    font: 'mono',
    size: 8,
    color: C.codeMuted,
  })
  rows.forEach((row, i) => {
    if (!row.trim()) return
    flow.page.push({
      kind: 'text',
      x: LEFT + CODE.pad,
      y: y + CODE.bar + CODE.pad + i * CODE.lead + 5,
      text: row,
      font: 'mono',
      size: CODE.size,
      color: C.codeText,
    })
  })
  flow.y += h + 10
}

/** A review card: the question, then its answer, on a bordered card kept in one piece. */
function card(flow: Flow, front: Para, back: Para) {
  const pad = 11
  const width = WIDTH - pad * 2
  const q = flow.lines(front, { ...BODY, font: 'semibold', color: C.ink }, width)
  const a = flow.lines(back, MUTED, width)
  const h = pad + q.length * BODY.lead + 3 + a.length * MUTED.lead + pad - 4
  flow.need(h)
  const y = flow.y
  flow.page.push({ kind: 'rect', x: LEFT, y, w: WIDTH, h, r: 10, fill: C.surface, stroke: C.line })
  let at = y + pad
  for (const line of q) {
    flow.page.push(...drawLine(line, LEFT + pad, at + BODY.lead * 0.72, { ...BODY, color: C.ink }))
    at += BODY.lead
  }
  at += 3
  for (const line of a) {
    flow.page.push(...drawLine(line, LEFT + pad, at + MUTED.lead * 0.72, MUTED))
    at += MUTED.lead
  }
  flow.y += h + 8
}

/** The wordmark: Practi in Regular, Code in SemiBold, then Learn. */
function wordmark(flow: Flow, x: number, y: number) {
  let at = x
  for (const [part, font] of [
    ['Practi', 'regular'],
    ['Code', 'semibold'],
    [' Learn', 'regular'],
  ] as [string, FontName][]) {
    flow.page.push({ kind: 'text', x: at, y, text: part, font, size: 13, color: C.ink })
    at += flow.measure(part, font, 13)
  }
}

/** The first page's top: the brand, the module, and what's in it. */
function cover(flow: Flow, notes: ModuleNotes) {
  flow.page.push(...mark(LEFT + 11, TOP + 9, 1.05, C.ink))
  wordmark(flow, LEFT + 28, TOP + 13.5)
  const tag = 'Module Notes'
  const tagW = flow.measure(tag, 'semibold', 9.5) + 20
  flow.page.push({ kind: 'rect', x: RIGHT - tagW, y: TOP - 1, w: tagW, h: 21, r: 10.5, fill: C.blueTint })
  flow.page.push({
    kind: 'text',
    x: RIGHT - tagW + 10,
    y: TOP + 13.2,
    text: tag,
    font: 'semibold',
    size: 9.5,
    color: C.blueText,
  })
  flow.y = TOP + 58

  flow.text(plainRun(`${notes.course} · Module ${notes.module}`), { ...LABEL, size: 11, lead: 16 })
  flow.y += 4
  flow.text(plainRun(notes.title), { size: 30, lead: 35, color: C.ink, font: 'display' })
  flow.y += 6
  flow.text(plainRun(notes.summary), { ...BODY, size: 11.5, lead: 17.5 })
  flow.y += 18

  // What's in the module, as a card listing each lesson.
  const rows = notes.lessons.map((l) => ({ ...l, lines: flow.lines(plainRun(l.title), BODY, WIDTH - 96) }))
  const project = notes.projectLine ? flow.lines(plainRun(notes.projectLine), BODY, WIDTH - 96) : []
  const rowH = (n: number) => n * BODY.lead + 12
  const h =
    16 +
    22 +
    rows.reduce((t, r) => t + rowH(r.lines.length), 0) +
    (project.length ? rowH(project.length) : 0) +
    6
  flow.need(h)
  const y = flow.y
  flow.page.push({ kind: 'rect', x: LEFT, y, w: WIDTH, h, r: 14, fill: C.page, stroke: C.line })
  flow.page.push({
    kind: 'text',
    x: LEFT + 16,
    y: y + 26,
    text: 'In this module',
    font: 'semibold',
    size: 11.5,
    color: C.ink,
  })
  let at = y + 38
  const row = (label: string, lines: ReturnType<Flow['lines']>, right: string | null, first: boolean) => {
    if (!first)
      flow.page.push({ kind: 'rect', x: LEFT + 16, y: at, w: WIDTH - 32, h: 0.75, fill: C.lineSubtle })
    flow.page.push({
      kind: 'text',
      x: LEFT + 16,
      y: at + 6 + BODY.lead * 0.72,
      text: label,
      font: 'semibold',
      size: 9.5,
      color: C.subtle,
    })
    lines.forEach((line, i) =>
      flow.page.push(
        ...drawLine(line, LEFT + 56, at + 6 + i * BODY.lead + BODY.lead * 0.72, { ...BODY, color: C.ink }),
      ),
    )
    if (right) {
      const w = flow.measure(right, 'regular', 9.5)
      flow.page.push({
        kind: 'text',
        x: RIGHT - 16 - w,
        y: at + 6 + BODY.lead * 0.72,
        text: right,
        font: 'regular',
        size: 9.5,
        color: C.subtle,
      })
    }
    at += rowH(lines.length)
  }
  rows.forEach((r, i) => row(r.number, r.lines, `${r.minutes} min`, i === 0))
  if (project.length) row('Project', project, null, false)
  flow.y = y + h + 16

  flow.text(
    plainRun(
      'These notes go with the lessons, not instead of them: take each lesson first, then use its page here to look back over what you learned and test yourself with the review cards.',
    ),
    MUTED,
  )
}

function lesson(flow: Flow, l: ModuleNotes['lessons'][number], first: boolean) {
  if (first) flow.newPage()
  else {
    flow.need(120)
    // A rule between lessons, unless this lesson starts a fresh page.
    if (flow.y > TOP) {
      flow.y += 14
      flow.page.push({ kind: 'rect', x: LEFT, y: flow.y, w: WIDTH, h: 0.75, fill: C.line })
      flow.y += 22
    }
  }
  const titleLines = flow.lines(plainRun(l.title), H2, WIDTH)
  flow.need(LABEL.lead + titleLines.length * H2.lead + 60)
  flow.text(plainRun(`Lesson ${l.number} · ${l.minutes} min`), LABEL)
  flow.y += 2
  flow.text(plainRun(l.title), H2)
  flow.y += 2
  flow.text(plainRun(l.description), MUTED)

  if (l.points.length) {
    flow.gap(12)
    heading(flow, 'Key points', H3, BODY.lead * 2)
    flow.y += 2
    bullets(flow, l.points)
  }
  if (l.code.length) {
    flow.gap(8)
    heading(flow, 'Key code', H3, 70)
    flow.y += 4
    for (const s of l.code) codePanel(flow, s)
  }
  if (l.cards.length) {
    flow.gap(6)
    heading(flow, 'Test yourself', H3, 50)
    flow.text(plainRun('Cover the answer, say yours out loud, then check.'), {
      ...MUTED,
      size: 9.5,
      lead: 14,
    })
    flow.y += 6
    for (const c of l.cards) card(flow, c.front, c.back)
  }
}

function project(flow: Flow, notes: ModuleNotes) {
  if (!notes.projectLine && !notes.project) return
  flow.newPage()
  flow.text(plainRun(`Module ${notes.module} project`), LABEL)
  flow.y += 2
  const p = notes.project
  flow.text(plainRun(p?.title ?? notes.projectLine!), H2)
  flow.y += 2
  if (!p) {
    flow.text(plainRun('The full brief arrives here when this project opens in the app.'), MUTED)
    return
  }
  flow.text(plainRun(`For ${p.client} · about ${p.minutes} minutes`), MUTED)
  flow.gap(12)
  heading(flow, 'The brief', H3, BODY.lead * 2)
  for (const para of p.brief) {
    flow.text(para)
    flow.y += 6
  }
  flow.gap(6)
  heading(flow, 'It must', H3, BODY.lead * 2)
  bullets(flow, p.must)
  if (p.nice.length) {
    flow.gap(8)
    heading(flow, 'If you have time', H3, BODY.lead * 2)
    bullets(flow, p.nice)
  }
  flow.gap(10)
  flow.text(
    plainRun('Build it in the project workspace in the app, where its checks run as you work.'),
    MUTED,
  )
}

/** Lays out the whole document, then adds each page's footer once the page count is known. */
export function layoutNotes(notes: ModuleNotes, measure: Measure): Page[] {
  const flow = new Flow(measure)
  cover(flow, notes)
  notes.lessons.forEach((l, i) => lesson(flow, l, i === 0))
  project(flow, notes)
  const total = flow.pages.length
  const left = `${notes.course} · Module ${notes.module} notes · learn.practicode.tech`
  return flow.pages.map((page, i) => {
    const right = `${i + 1} of ${total}`
    const y = PAGE.height - 34
    return [
      ...page,
      { kind: 'rect', x: LEFT, y: y - 16, w: WIDTH, h: 0.75, fill: C.lineSubtle },
      { kind: 'text', x: LEFT, y, text: left, font: 'regular', size: 8, color: C.subtle },
      {
        kind: 'text',
        x: RIGHT - measure(right, 'regular', 8),
        y,
        text: right,
        font: 'regular',
        size: 8,
        color: C.subtle,
      },
    ]
  })
}
