'use client'
import { cn } from '@/lib/cn'
import { clampState } from './shared'
import type { Grid, Stage } from './sql-stage-data'
import { Null, SqlLine, SqlSays, SqlTable } from './sql-table'

function StageGrid({ grid, label }: { grid: Grid; label: string }) {
  const rows = grid.rows.map((cells, i) => ({ cells, i }))
  return (
    <SqlTable
      name={grid.name}
      rows={rows}
      rowKey={(r) => r.i}
      label={label}
      tone={(r) => (grid.on?.includes(r.i) ? 'on' : grid.off?.includes(r.i) ? 'off' : undefined)}
      columns={grid.columns.map((c, n) => ({ key: c + n, label: c, cell: (r: { cells: (string | null)[] }) => r.cells[n] ?? <Null /> }))}
    />
  )
}

/** One stage of an SQL lab: the statement, what PostgreSQL said if it refused it, its tables and what they show. */
export function StageView({ stage, diagram }: { stage: Stage; diagram?: boolean }) {
  const body = (
    <div className="flex flex-col gap-2">
      <SqlLine mark={stage.sql} />
      {stage.error && (
        <p className="m-0 rounded-xl border border-error/40 bg-error/10 px-3 py-2 font-mono text-[12.5px] [overflow-wrap:anywhere] text-ink">
          <span className="font-sans font-semibold">Refused: </span>
          {stage.error}
        </p>
      )}
      <div className={cn('grid gap-2', stage.grids.length > 1 && '@min-[520px]:grid-cols-2')}>
        {stage.grids.map((g, i) => (
          <div key={i} className={cn('min-w-0', stage.grids.length === 3 && i === 2 && '@min-[520px]:col-span-2')}>
            <StageGrid grid={g} label={`${g.name ?? 'Result'} for ${stage.key}`} />
          </div>
        ))}
      </div>
    </div>
  )
  return (
    <figure className="m-0 flex flex-col gap-3">
      {diagram ? (
        <div role="img" aria-label={`${stage.key}: ${stage.says}`}>
          {body}
        </div>
      ) : (
        body
      )}
      <SqlSays warn={Boolean(stage.error)}>{stage.says}</SqlSays>
    </figure>
  )
}

/** A Diagram lab's stage: the state's number picks it. */
export const stepIn = (all: Stage[], state?: number) => <StageView stage={all[clampState(state, all.length)]!} diagram />

/** An Explore lab's stage: the value picks it by key, falling back to the first. */
export const pickIn = (all: Stage[], value?: string) => <StageView stage={all.find((s) => s.key === value) ?? all[0]!} />
