'use client'
import { STAFF } from './bookshop'
import type { LabProps } from './shared'
import { Null, SqlSays, SqlTable } from './sql-table'

/** One table read twice, e for the employee and m for the manager (Explore lab: value = a person's name). */
export function SelfJoin({ value = 'Kofi Mensah' }: LabProps) {
  const person = STAFF.find((s) => s.name === value) ?? STAFF[3]!
  const manager = STAFF.find((s) => s.id === person.managerId)
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div className="grid gap-2 @min-[480px]:grid-cols-2">
        <SqlTable
          name="staff AS e"
          rows={STAFF}
          rowKey={(s) => s.id}
          label="The staff table, read as employees"
          tone={(s) => (s.id === person.id ? 'on' : undefined)}
          columns={[
            { key: 'name', label: 'name', cell: (s) => s.name },
            { key: 'manager_id', label: 'manager_id', cell: (s) => s.managerId ?? <Null />, strong: true },
          ]}
        />
        <SqlTable
          name="staff AS m"
          rows={STAFF}
          rowKey={(s) => s.id}
          label="The staff table, read as managers"
          tone={(s) => (s.id === manager?.id ? 'on' : undefined)}
          columns={[
            { key: 'id', label: 'id', cell: (s) => s.id, strong: true },
            { key: 'name', label: 'name', cell: (s) => s.name },
          ]}
        />
      </div>
      <SqlSays>
        {manager
          ? `${person.name}’s manager_id is ${manager.id}, so m finds the row with id ${manager.id}: ${manager.name}. Same table, read a second time.`
          : `${person.name}’s manager_id is NULL, so nothing in m matches. An inner join leaves this row out; a LEFT JOIN keeps it.`}
      </SqlSays>
    </figure>
  )
}
