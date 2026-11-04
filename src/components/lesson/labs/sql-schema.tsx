'use client'
import { cn } from '@/lib/cn'
import { C, clampState, type LabProps } from './shared'
import { SCHEMA_STAGES } from './sql-schema-data'
import { pickIn, stepIn } from './sql-stage-view'
import { SqlSays } from './sql-table'

const step = (lab: string, state?: number) => stepIn(SCHEMA_STAGES[lab]!, state)
const pick = (lab: string, value?: string) => pickIn(SCHEMA_STAGES[lab]!, value)

/* A library's brief, read the way a designer reads it. Words are marked from the state they matter in:
   1 things (tables), 2 facts (columns), 3 events (tables that link things). */
const BRIEF: [string, number?][] = [
  ['We lend '],
  ['books', 1],
  [' to our '],
  ['members', 1],
  ['. For each member we keep a '],
  ['name', 2],
  [', an '],
  ['email', 2],
  [' and the '],
  ['date they joined', 2],
  ['. For each book we keep its '],
  ['title', 2],
  [' and the '],
  ['year it came out', 2],
  ['. We need to know which member '],
  ['borrowed', 3],
  [' which book, the '],
  ['day they borrowed it', 3],
  [', and the '],
  ['day it came back', 3],
  ['.'],
]

const TABLES: { name: string; from: number; columns: [string, number][] }[] = [
  { name: 'members', from: 1, columns: [['id', 2], ['name', 2], ['email', 2], ['joined_on', 2]] },
  { name: 'books', from: 1, columns: [['id', 2], ['title', 2], ['published', 2]] },
  { name: 'loans', from: 3, columns: [['id', 3], ['member_id', 3], ['book_id', 3], ['borrowed_on', 3], ['returned_on', 3]] },
]

const BRIEF_SAYS = [
  'A brief, in the library’s own words. Nothing here mentions tables: finding them is the designer’s job.',
  'The things the library keeps track of, members and books, become tables, one row for each member or book.',
  'Facts about each thing become its columns, with names that say what they hold. Each table also gets an id, so every row can be told apart.',
  'Borrowing is an event that links a member to a book, so it gets a table too: loans, with an id for the member and one for the book.',
]

/** A brief turning into tables: things, then their facts, then the event that links them (Diagram lab, 4 states). */
export function BriefToTables({ state }: LabProps) {
  const at = clampState(state, BRIEF_SAYS.length)
  const shown = TABLES.filter((t) => t.from <= at)
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div role="img" aria-label={`${BRIEF_SAYS[at]} Tables so far: ${shown.map((t) => `${t.name} (${t.columns.filter(([, f]) => f <= at).map(([c]) => c).join(', ') || 'no columns yet'})`).join('; ') || 'none'}.`}>
        <p className="m-0 rounded-xl bg-row px-3 py-2.5 text-sm leading-relaxed text-ink">
          {BRIEF.map(([text, kind], i) => (
            <span key={i} className={cn(kind !== undefined && kind <= at && 'rounded bg-[rgba(47,230,176,0.18)] px-0.5 font-semibold text-da-text', kind === at && 'underline decoration-2 underline-offset-2')}>
              {text}
            </span>
          ))}
        </p>
        {shown.length > 0 && (
          <div className="mt-2 grid gap-2 @min-[420px]:grid-cols-3">
            {shown.map((t) => (
              <div key={t.name} className="min-w-0 rounded-2xl border border-line">
                <p className="m-0 border-b border-line bg-row px-3 py-1.5 font-mono text-xs font-semibold text-ink">{t.name}</p>
                <ul className="m-0 list-none px-3 py-1.5 font-mono text-[12.5px]">
                  {t.columns.filter(([, f]) => f <= at).map(([c, f]) => (
                    <li key={c} className={cn('py-0.5', f === at ? 'font-semibold text-da-text' : 'text-ink')}>
                      {c}
                    </li>
                  ))}
                  {t.columns.every(([, f]) => f > at) && <li className="py-0.5 text-ink-subtle italic">columns to come</li>}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
      <SqlSays>{BRIEF_SAYS[at]}</SqlSays>
    </figure>
  )
}

/** The data types labs: the same values through different types (Explore lab: value = a type choice). */
export function TypeChoice({ value }: LabProps) {
  return pick('type-choice', value)
}

/** One-to-many, one-to-one and many-to-many, and a key on the wrong side (Explore lab: value = a relationship). */
export function RelationshipKinds({ value }: LabProps) {
  return pick('relationship-kinds', value)
}

/** A list in a cell normalised to first, second and third normal form (Diagram lab, 5 states). */
export function NormalForms({ state }: LabProps) {
  return step('normal-forms', state)
}

/** A junction table read both ways, counted, guarded, and the list it replaces (Explore lab: value = a query). */
export function JunctionTable({ value }: LabProps) {
  return pick('junction-table', value)
}

/** Capitals, quotes, reserved words and spaces in names, and snake_case (Explore lab: value = a name). */
export function NamingRules({ value }: LabProps) {
  return pick('naming-rules', value)
}

/** CREATE TABLE in its shapes, as information_schema describes them (Explore lab: value = a statement). */
export function CreateTable({ value }: LabProps) {
  return pick('create-table', value)
}

/** ALTER TABLE adding, renaming, dropping and converting columns (Explore lab: value = a change). */
export function AlterTable({ value }: LabProps) {
  return pick('alter-table', value)
}

/** Query plans with and without an index, on 20,000 loans and on six (Explore lab: value = a search). */
export function IndexPlan({ value }: LabProps) {
  return pick('index-plan', value)
}

/** A view saved, queried, and keeping up with its table (Diagram lab, 4 states). */
export function ViewSteps({ state }: LabProps) {
  return step('view-steps', state)
}

/** Migrations applied in order and recorded, then run again (Diagram lab, 5 states). */
export function MigrationRun({ state }: LabProps) {
  return step('migration-run', state)
}

/** Seeds run twice, in the wrong order, with their own ids, and in bulk (Explore lab: value = a seed). */
export function SeedRun({ value }: LabProps) {
  return pick('seed-run', value)
}

/* The library's ERD in crow's foot notation. Boxes are tables; each line runs from a foreign key to the key it
   points at, and its ends say how many rows can sit on each side. */
type Box = { name: string; x: number; y: number; rows: [string, string?][] }
const W = 140
const HEAD = 22
const ROW = 17
const BOXES: Box[] = [
  { name: 'members', x: 8, y: 8, rows: [['id', 'PK'], ['name'], ['email'], ['joined_on']] },
  { name: 'loans', x: 212, y: 8, rows: [['id', 'PK'], ['member_id', 'FK'], ['book_id', 'FK'], ['borrowed_on'], ['returned_on']] },
  { name: 'books', x: 212, y: 180, rows: [['id', 'PK'], ['title'], ['published']] },
  { name: 'book_authors', x: 8, y: 180, rows: [['book_id', 'PK FK'], ['author_id', 'PK FK']] },
  { name: 'authors', x: 8, y: 290, rows: [['id', 'PK'], ['name']] },
]
const height = (b: Box) => HEAD + b.rows.length * ROW + 6

type End = 'one' | 'zero-many' | 'one-many'
type Line = { id: string; from: [number, number]; to: [number, number]; ends: [End, End]; boxes: string[] }
const LINES: Line[] = [
  { id: 'members-loans', from: [148, 39], to: [212, 39], ends: ['one', 'zero-many'], boxes: ['members', 'loans'] },
  { id: 'loans-books', from: [282, 180], to: [282, 121], ends: ['one', 'zero-many'], boxes: ['loans', 'books'] },
  { id: 'books-authors', from: [212, 210], to: [148, 210], ends: ['one', 'one-many'], boxes: ['books', 'book_authors'] },
  { id: 'authors-books', from: [78, 290], to: [78, 242], ends: ['one', 'zero-many'], boxes: ['authors', 'book_authors'] },
]

/** One end of a line: bars for one, a crow's foot for many, and a circle (zero) or bar (one) beside it. */
function LineEnd({ at, toward, kind }: { at: [number, number]; toward: [number, number]; kind: End }) {
  const [ex, ey] = at
  const len = Math.hypot(toward[0] - ex, toward[1] - ey)
  const dx = (toward[0] - ex) / len
  const dy = (toward[1] - ey) / len
  const px = -dy
  const py = dx
  const p = (k: number, s = 0): [number, number] => [ex + dx * k + px * s, ey + dy * k + py * s]
  const bar = (k: number) => {
    const [a, b] = [p(k, -6), p(k, 6)]
    return <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
  }
  if (kind === 'one') return <g>{bar(7)}{bar(12)}</g>
  const tip = p(13)
  const foot = [p(0, -7), p(0), p(0, 7)].map(([x, y], i) => <line key={i} x1={tip[0]} y1={tip[1]} x2={x} y2={y} />)
  const [cx, cy] = p(20)
  return (
    <g>
      {foot}
      {kind === 'zero-many' ? <circle cx={cx} cy={cy} r={4} fill={C.sheet} /> : bar(18)}
    </g>
  )
}

const ERD = [
  { key: 'The whole diagram', lines: LINES.map((l) => l.id), says: 'Each box is a table with its columns: PK marks the primary key and FK a foreign key. Each line is a relationship, drawn from a foreign key to the key it points at.' },
  { key: 'Members and loans', lines: ['members-loans'], says: 'Read each end of the line. Two bars at members: each loan belongs to exactly one member. A crow’s foot and a circle at loans: a member has zero or many loans.' },
  { key: 'Loans and books', lines: ['loans-books'], says: 'The same shape: each loan is for exactly one book, and a book can be in zero or many loans. The crow’s foot is always at the table that holds the foreign key.' },
  { key: 'Books and authors', lines: ['books-authors', 'authors-books'], says: 'Many-to-many is drawn as two one-to-many lines meeting at the junction table. A bar beside the crow’s foot means one or many: the design says every book has at least one author.' },
  { key: 'Optional or required', lines: ['members-loans'], row: 'member_id', says: 'A circle means zero, so that side is optional: a new member may have no loans yet. Two bars mean exactly one, so it’s required: member_id is NOT NULL, and no loan can exist without its member.' },
]

/** The library's ERD in crow's foot notation, one relationship at a time (Explore lab: value = a part to read). */
export function ErdView({ value }: LabProps) {
  const view = ERD.find((e) => e.key === value) ?? ERD[0]!
  const lit = new Set(LINES.filter((l) => view.lines.includes(l.id)).flatMap((l) => l.boxes))
  const all = view.key === ERD[0]!.key
  return (
    <figure className="m-0 flex flex-col gap-3">
      <svg
        viewBox="0 0 360 362"
        className="mx-auto block h-auto w-full max-w-[480px]"
        role="img"
        aria-label={`An entity relationship diagram of the library: members to loans, one to zero or many; books to loans, one to zero or many; books to book_authors, one to one or many; authors to book_authors, one to zero or many. ${view.says}`}
      >
        {LINES.map((l) => {
          const on = view.lines.includes(l.id)
          return (
            <g key={l.id} stroke={on && !all ? 'var(--pc-da-text)' : C.soft} strokeWidth={on && !all ? 2 : 1.4} opacity={on ? 1 : 0.35} fill="none">
              <line x1={l.from[0]} y1={l.from[1]} x2={l.to[0]} y2={l.to[1]} />
              <LineEnd at={l.from} toward={l.to} kind={l.ends[0]} />
              <LineEnd at={l.to} toward={l.from} kind={l.ends[1]} />
            </g>
          )
        })}
        {BOXES.map((b) => {
          const on = all || lit.has(b.name)
          return (
            <g key={b.name} opacity={on ? 1 : 0.35}>
              <rect x={b.x} y={b.y} width={W} height={height(b)} rx={8} fill={C.sheet} stroke={on && !all ? 'var(--pc-da-text)' : C.line} strokeWidth={1.4} />
              <rect x={b.x} y={b.y} width={W} height={HEAD} rx={8} fill={C.row} />
              <text x={b.x + 10} y={b.y + 15} fill={C.text} fontSize={12} fontWeight={700} fontFamily="var(--font-mono), monospace">
                {b.name}
              </text>
              {b.rows.map(([col, tag], i) => {
                const mark = view.row === col && b.name === 'loans'
                return (
                  <g key={col}>
                    {mark && <rect x={b.x + 4} y={b.y + HEAD + 3 + i * ROW} width={W - 8} height={ROW} rx={4} fill="rgba(47,230,176,0.18)" />}
                    <text x={b.x + 10} y={b.y + HEAD + 15 + i * ROW} fill={mark ? 'var(--pc-da-text)' : C.text} fontSize={11.5} fontWeight={mark ? 700 : 400} fontFamily="var(--font-mono), monospace">
                      {col}
                    </text>
                    {tag && (
                      <text x={b.x + W - 8} y={b.y + HEAD + 15 + i * ROW} fill={C.muted} fontSize={10} textAnchor="end" fontFamily="var(--font-mono), monospace">
                        {tag}
                      </text>
                    )}
                  </g>
                )
              })}
            </g>
          )
        })}
      </svg>
      <SqlSays>{view.says}</SqlSays>
    </figure>
  )
}
