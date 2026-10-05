import { Prose } from './prose'

/** A labelled browser panel around a PreviewFrame. */
export function PreviewPanel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-line">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-row px-3 py-2 text-[12px] text-ink-muted">
        <span>{label}</span>
        <span aria-hidden="true">Browser</span>
      </div>
      {children}
    </div>
  )
}

/** The "here's why" note a step shows once it is done. */
export function Reveal({ html }: { html: string }) {
  return (
    <div className="rounded-2xl border border-fe/40 bg-fe/10 p-4">
      <Prose html={html} />
    </div>
  )
}
