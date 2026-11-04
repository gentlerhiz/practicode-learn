'use client'
import type { LabProps } from './shared'
import { ANALYSIS_STAGES } from './sql-analysis-data'
import { pickIn, stepIn } from './sql-stage-view'
import { SqlSays, SqlTable } from './sql-table'

const step = (lab: string, state?: number) => stepIn(ANALYSIS_STAGES[lab]!, state)
const pick = (lab: string, value?: string) => pickIn(ANALYSIS_STAGES[lab]!, value)

/** A join's query plan read from the deepest line out, then with an index (Diagram lab, 5 states). */
export function PlanReader({ state }: LabProps) {
  return step('plan-reader', state)
}

/** Queries an index can and can't help, on 20,000 loans (Explore lab: value = a search). */
export function IndexHelp({ value }: LabProps) {
  return pick('index-help', value)
}

/** What a login form's input does to SQL glued together, and to a prepared statement (Explore lab: value = an input). */
export function InjectionDemo({ value }: LabProps) {
  return pick('injection-demo', value)
}

/** Roles granted, refused, grouped and revoked (Explore lab: value = what a role tries). */
export function RoleCheck({ value }: LabProps) {
  return pick('role-check', value)
}

/** A backup written, a table lost, and the restore checked (Diagram lab, 5 states). */
export function BackupRestore({ state }: LabProps) {
  return step('backup-restore', state)
}

/** Personal data shown in full, cut down, coded, erased and expired (Explore lab: value = a choice). */
export function PrivacyView({ value }: LabProps) {
  return pick('privacy-view', value)
}

/** LAG, LEAD and shares of a total on the bookshop's sales (Explore lab: value = a window). */
export function LagLead({ value }: LabProps) {
  return pick('lag-lead', value)
}

/** ROW_NUMBER, RANK and DENSE_RANK, top N per group, running totals and a moving average (Explore lab). */
export function RankKinds({ value }: LabProps) {
  return pick('rank-kinds', value)
}

/** Long grouped rows pivoted into one column per month (Diagram lab, 5 states). */
export function PivotBuild({ state }: LabProps) {
  return step('pivot-build', state)
}

/** Messy sign-ups trimmed, nulled, converted and de-duplicated (Explore lab: value = a step). */
export function CleanSteps({ value }: LabProps) {
  return pick('clean-steps', value)
}

/** A cohort grid built from orders, then a funnel from visits (Diagram lab, 5 states). */
export function CohortFunnel({ state }: LabProps) {
  return step('cohort-funnel', state)
}

/** A monthly report built from named steps, and a ROLLUP total (Diagram lab, 4 states). */
export function ReportBuild({ state }: LabProps) {
  return step('report-build', state)
}

/* The same jobs in four databases. Only PostgreSQL runs here, so this one is written by hand, from each
   database's documentation. */
const DIALECTS: { key: string; rows: [string, string][]; says: string }[] = [
  {
    key: 'The first rows',
    rows: [
      ['PostgreSQL', 'LIMIT 3, or FETCH FIRST 3 ROWS ONLY'],
      ['MySQL', 'LIMIT 3'],
      ['SQLite', 'LIMIT 3'],
      ['SQL Server', 'SELECT TOP 3 …'],
    ],
    says: 'Most databases say LIMIT. SQL Server puts TOP after SELECT instead. FETCH FIRST is the SQL standard, and PostgreSQL understands it too.',
  },
  {
    key: 'Numbered ids',
    rows: [
      ['PostgreSQL', 'id integer GENERATED ALWAYS AS IDENTITY'],
      ['MySQL', 'id INT AUTO_INCREMENT'],
      ['SQLite', 'id INTEGER PRIMARY KEY'],
      ['SQL Server', 'id INT IDENTITY(1, 1)'],
    ],
    says: 'Every database can number rows for you, with its own words for it. The idea, a key the database fills in, is the same.',
  },
  {
    key: 'Joining text',
    rows: [
      ['PostgreSQL', "'Member ' || n, or CONCAT('Member ', n)"],
      ['MySQL', "CONCAT('Member ', n)"],
      ['SQLite', "'Member ' || n"],
      ['SQL Server', "CONCAT('Member ', n)"],
    ],
    says: 'CONCAT works in all four. In MySQL, || means OR unless a setting changes it, and SQL Server’s + won’t join text to a number, so CONCAT is the safe choice.',
  },
  {
    key: 'Ignoring capitals',
    rows: [
      ['PostgreSQL', "title ILIKE 'dune%'"],
      ['MySQL', "title LIKE 'dune%'"],
      ['SQLite', "title LIKE 'dune%'"],
      ['SQL Server', "title LIKE 'dune%'"],
    ],
    says: 'PostgreSQL’s LIKE cares about capitals, so it adds ILIKE. The others usually ignore capitals in LIKE already, depending on how the database is set up.',
  },
]

/** One job written for PostgreSQL, MySQL, SQLite and SQL Server (Explore lab: value = a job). */
export function SqlDialects({ value }: LabProps) {
  const view = DIALECTS.find((d) => d.key === value) ?? DIALECTS[0]!
  return (
    <figure className="m-0 flex flex-col gap-3">
      <SqlTable
        rows={view.rows}
        rowKey={(r) => r[0]}
        label={`${view.key} in four databases`}
        tone={(r) => (r[0] === 'PostgreSQL' ? 'on' : undefined)}
        columns={[
          { key: 'db', label: 'database', cell: (r) => <span className="font-sans font-semibold whitespace-nowrap">{r[0]}</span> },
          { key: 'sql', label: 'how it’s written', cell: (r) => <code className="font-mono">{r[1]}</code> },
        ]}
      />
      <SqlSays>{view.says}</SqlSays>
    </figure>
  )
}
