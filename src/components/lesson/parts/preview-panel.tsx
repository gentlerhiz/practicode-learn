import { Prose } from './prose'

/** The canvas's preview area under the code: a caption, then the running page in a sunken box. */
export function PreviewPanel({ label, children, note }: { label: string; children: React.ReactNode; note?: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-3 px-4 pb-5 ph:px-6 ph:pb-6">
      <p className="text-xs text-ink-subtle">{label}</p>
      <div className="min-h-[160px] overflow-hidden rounded-[20px] border border-divider bg-white">{children}</div>
      {note && <p className="text-[13px] text-ink-subtle">{note}</p>}
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
