// A tiny spreadsheet formula engine for the spreadsheet lab: numbers, cell references (B2), ranges
// (B2:B5), + - * / and brackets, and SUM, AVERAGE, MIN, MAX and COUNT. Errors use the same codes as
// Excel, Google Sheets and LibreOffice, so learners meet the real ones.

export type Cells = Record<string, string>
export type Value = number | string
export type Result = { value: Value; error?: '#DIV/0!' | '#NAME?' | '#VALUE!' | '#REF!' | '#ERROR!'; refs: string[] }

const REF = /^([A-Z])([1-9][0-9]?)$/

/** Every cell in a range such as B2:C4, row by row. */
export function expandRange(from: string, to: string): string[] {
  const a = REF.exec(from)
  const b = REF.exec(to)
  if (!a || !b) return []
  const [c1, c2] = [a[1]!.charCodeAt(0), b[1]!.charCodeAt(0)].sort((x, y) => x - y)
  const [r1, r2] = [Number(a[2]), Number(b[2])].sort((x, y) => x - y)
  const out: string[] = []
  for (let r = r1!; r <= r2!; r++) for (let c = c1!; c <= c2!; c++) out.push(`${String.fromCharCode(c)}${r}`)
  return out
}

type Token = { t: 'num'; v: number } | { t: 'ref'; v: string } | { t: 'range'; v: [string, string] } | { t: 'fn'; v: string } | { t: 'op'; v: string }

function tokens(src: string): Token[] | null {
  const out: Token[] = []
  const re = /\s*(?:(\d+(?:\.\d+)?)|([A-Z][1-9][0-9]?):([A-Z][1-9][0-9]?)|([A-Z]+)\s*\(|([A-Z][1-9][0-9]?)|([-+*/(),]))/y
  let m: RegExpExecArray | null
  let at = 0
  const s = src.toUpperCase()
  while (at < s.length) {
    if (/^\s*$/.test(s.slice(at))) break
    re.lastIndex = at
    m = re.exec(s)
    if (!m) return null
    at = re.lastIndex
    if (m[1]) out.push({ t: 'num', v: Number(m[1]) })
    else if (m[2]) out.push({ t: 'range', v: [m[2], m[3]!] })
    else if (m[4]) {
      out.push({ t: 'fn', v: m[4] })
      out.push({ t: 'op', v: '(' })
    } else if (m[5]) out.push({ t: 'ref', v: m[5] })
    else out.push({ t: 'op', v: m[6]! })
  }
  return out
}

class Fail extends Error {
  constructor(public code: NonNullable<Result['error']>) {
    super(code)
  }
}

/** Works out one cell: a number, text, or a formula starting with =. */
export function evaluate(cells: Cells, cell: string, seen: string[] = []): Result {
  const raw = (cells[cell] ?? '').trim()
  if (!raw.startsWith('=')) {
    if (raw === '') return { value: '', refs: [] }
    const n = Number(raw.replace(/,/g, ''))
    return { value: Number.isFinite(n) ? n : raw, refs: [] }
  }
  return formula(cells, raw.slice(1), [...seen, cell])
}

/** Works out a formula (without its =) against the cells. */
export function formula(cells: Cells, src: string, seen: string[] = []): Result {
  const list = tokens(src)
  const refs: string[] = []
  if (!list || !list.length) return { value: '#ERROR!', error: '#ERROR!', refs }
  let i = 0
  const peek = () => list[i]
  const take = () => list[i++]

  const cellValue = (ref: string): Value => {
    if (!REF.test(ref) || ref.charCodeAt(0) > 'Z'.charCodeAt(0)) throw new Fail('#REF!')
    refs.push(ref)
    if (seen.includes(ref)) throw new Fail('#REF!')
    const r = evaluate(cells, ref, seen)
    if (r.error) throw new Fail(r.error)
    return r.value
  }
  const num = (v: Value): number => {
    if (v === '') return 0
    if (typeof v === 'number') return v
    throw new Fail('#VALUE!')
  }

  const FNS: Record<string, (xs: Value[]) => number> = {
    SUM: (xs) => xs.filter((x): x is number => typeof x === 'number').reduce((a, b) => a + b, 0),
    AVERAGE: (xs) => {
      const ns = xs.filter((x): x is number => typeof x === 'number')
      if (!ns.length) throw new Fail('#DIV/0!')
      return ns.reduce((a, b) => a + b, 0) / ns.length
    },
    MIN: (xs) => {
      const ns = xs.filter((x): x is number => typeof x === 'number')
      return ns.length ? Math.min(...ns) : 0
    },
    MAX: (xs) => {
      const ns = xs.filter((x): x is number => typeof x === 'number')
      return ns.length ? Math.max(...ns) : 0
    },
    COUNT: (xs) => xs.filter((x) => typeof x === 'number').length,
  }

  const args = (): Value[] => {
    const out: Value[] = []
    if (peek()?.t === 'op' && peek()!.v === ')') {
      take()
      return out
    }
    for (;;) {
      const t = peek()
      if (t?.t === 'range') {
        take()
        out.push(...expandRange(t.v[0], t.v[1]).map(cellValue))
      } else out.push(expr())
      const sep = take()
      if (sep?.t === 'op' && sep.v === ')') return out
      if (!(sep?.t === 'op' && sep.v === ',')) throw new Fail('#ERROR!')
    }
  }

  const atom = (): Value => {
    const t = take()
    if (!t) throw new Fail('#ERROR!')
    if (t.t === 'num') return t.v
    if (t.t === 'ref') return cellValue(t.v)
    if (t.t === 'fn') {
      take()
      const fn = FNS[t.v]
      const xs = args()
      if (!fn) throw new Fail('#NAME?')
      return fn(xs)
    }
    if (t.t === 'op' && t.v === '(') {
      const v = expr()
      const close = take()
      if (!(close?.t === 'op' && close.v === ')')) throw new Fail('#ERROR!')
      return v
    }
    if (t.t === 'op' && t.v === '-') return -num(atom())
    if (t.t === 'range') throw new Fail('#VALUE!')
    throw new Fail('#ERROR!')
  }
  const term = (): Value => {
    let v = atom()
    while (peek()?.t === 'op' && (peek()!.v === '*' || peek()!.v === '/')) {
      const op = take()!.v
      const r = num(atom())
      if (op === '/' && r === 0) throw new Fail('#DIV/0!')
      v = op === '*' ? num(v) * r : num(v) / r
    }
    return v
  }
  const expr = (): Value => {
    let v = term()
    while (peek()?.t === 'op' && (peek()!.v === '+' || peek()!.v === '-')) {
      const op = take()!.v
      const r = num(term())
      v = op === '+' ? num(v) + r : num(v) - r
    }
    return v
  }

  try {
    const value = expr()
    if (i < list.length) throw new Fail('#ERROR!')
    return { value: typeof value === 'number' ? Math.round(value * 1e9) / 1e9 : value, refs: [...new Set(refs)] }
  } catch (e) {
    if (e instanceof Fail) return { value: e.code, error: e.code, refs: [...new Set(refs)] }
    throw e
  }
}

/** A number as a spreadsheet shows it: up to two decimal places, with thousands separated. */
export function show(v: Value): string {
  if (typeof v !== 'number') return v
  return v.toLocaleString('en-GB', { maximumFractionDigits: 2 })
}
