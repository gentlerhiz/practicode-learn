'use client'
import type { LabProps } from './shared'
import { STAGES } from './sql-stage-data'
import { pickIn, stepIn } from './sql-stage-view'

const step = (lab: string, state?: number) => stepIn(STAGES[lab]!, state)
const pick = (lab: string, value?: string) => pickIn(STAGES[lab]!, value)

/** A subquery's answer plugged into its outer query (Diagram lab, 3 states). */
export function SubquerySteps({ state }: LabProps) {
  return step('subquery-steps', state)
}

/** A query's result used as a table in FROM (Diagram lab, 3 states). */
export function FromSubquery({ state }: LabProps) {
  return step('from-subquery', state)
}

/** A WITH step named, then used once and used again (Diagram lab, 3 states). */
export function CteSteps({ state }: LabProps) {
  return step('cte-steps', state)
}

/** EXISTS and NOT IN asked of each customer, with the NULL trap (Explore lab: value = a question). */
export function ExistsCheck({ value }: LabProps) {
  return pick('exists-check', value)
}

/** Two lists through UNION, UNION ALL, INTERSECT and EXCEPT (Explore lab: value = the operator). */
export function SetOps({ value }: LabProps) {
  return pick('set-ops', value)
}

/** GROUP BY against window functions on the same eight sales (Explore lab: value = a function). */
export function WindowView({ value }: LabProps) {
  return pick('window-view', value)
}

/** INSERT in its shapes, with the row it added (Explore lab: value = a shape). */
export function InsertShapes({ value }: LabProps) {
  return pick('insert-shapes', value)
}

/** UPDATE with and without WHERE, with the rows it changed (Explore lab: value = a statement). */
export function UpdateWhere({ value }: LabProps) {
  return pick('update-where', value)
}

/** DELETE with and without WHERE, and the foreign key saying no (Explore lab: value = a statement). */
export function DeleteSafety({ value }: LabProps) {
  return pick('delete-safety', value)
}

/** Two changes with and without a transaction, sent one at a time (Explore lab: value = what happens). */
export function TransactionFlow({ value }: LabProps) {
  return pick('transaction-flow', value)
}

/** Each constraint refusing a bad change, and DEFAULT filling one in (Explore lab: value = a change). */
export function ConstraintGuard({ value }: LabProps) {
  return pick('constraint-guard', value)
}

/** INSERT, then the ways ON CONFLICT handles a row that's already there (Explore lab: value = a statement). */
export function UpsertFlow({ value }: LabProps) {
  return pick('upsert-flow', value)
}
