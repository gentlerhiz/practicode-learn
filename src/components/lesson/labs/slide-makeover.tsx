'use client'
import type { LabProps } from './shared'

const SLIDES: Record<string, { good: boolean; note: string }> = {
  'A wall of text': { good: false, note: 'People read the slide instead of listening, and give up halfway. If it’s all written down, why are you there?' },
  'One clear point': { good: true, note: 'One idea, in a few big words. You say the detail; the slide backs you up.' },
  'A table of numbers': { good: false, note: 'Twelve numbers, and nobody can see the pattern from the back of the room.' },
  'A simple chart': { good: true, note: 'The same numbers as a chart: the rise jumps out in a second.' },
}

const SALES = [12, 14, 13, 17, 19, 24]

function Slide({ kind }: { kind: string }) {
  switch (kind) {
    case 'A wall of text':
      return (
        <div className="flex h-full flex-col gap-1 p-3">
          <p className="text-[9px] font-bold text-[#15122a]">Sales update</p>
          <p className="text-[6.5px] leading-[9px] text-[#3b3752]">
            This half-year our sales have increased steadily from January, when we sold 12 thousand units, through February and March, which were
            similar, to a strong April of 17 thousand, then May at 19 thousand and finally June at 24 thousand, which is our best month ever, mostly
            thanks to the new delivery service we launched in April, which customers have responded to very well, and we expect this growth to
            continue into the second half of the year if we keep investing in delivery and marketing in the same way as we have done so far.
          </p>
        </div>
      )
    case 'One clear point':
      return (
        <div className="flex h-full flex-col justify-center gap-1 p-4">
          <p className="font-display text-[22px] leading-6 font-extrabold text-[#15122a]">Sales doubled</p>
          <p className="text-[11px] text-[#5d5972]">January to June, thanks to delivery</p>
        </div>
      )
    case 'A table of numbers':
      return (
        <div className="flex h-full flex-col gap-1 p-3">
          <p className="text-[9px] font-bold text-[#15122a]">Sales (thousands)</p>
          <table className="text-[7px] text-[#3b3752]">
            <tbody>
              {[
                ['Month', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                ['Units', ...SALES.map(String)],
                ['Online', '5', '6', '6', '9', '11', '15'],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((c, i) => (
                    <td key={i} className="border border-[#dfdce9] px-0.5">
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    default:
      return (
        <div className="flex h-full flex-col gap-1 p-3">
          <p className="text-[10px] font-bold text-[#15122a]">Sales doubled in six months</p>
          <div className="flex flex-1 items-end gap-1.5 px-1">
            {SALES.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-0.5">
                <span className="w-full rounded-t-sm" style={{ height: `${(v / 24) * 60}px`, background: i === 5 ? '#a85a00' : '#b9b4c9' }} />
                <span className="text-[6.5px] text-[#5d5972]">{['J', 'F', 'M', 'A', 'M', 'J'][i]}</span>
              </div>
            ))}
          </div>
        </div>
      )
  }
}

/** Four versions of a slide about the same numbers (Explore lab: value = a version). */
export function SlideMakeover({ value = 'A wall of text' }: LabProps) {
  const kind = SLIDES[value] ? value : 'A wall of text'
  const s = SLIDES[kind]!
  return (
    <figure className="m-0 flex flex-col gap-3" aria-label={`${kind}. ${s.note}`}>
      <div className="mx-auto aspect-video w-full max-w-[360px] overflow-hidden rounded-lg border border-line bg-white shadow-sm">
        <Slide kind={kind} />
      </div>
      <p aria-live="polite" className="text-[13px] leading-5 text-ink-soft">
        <span className={s.good ? 'font-semibold text-success' : 'font-semibold text-error'}>{s.good ? 'Works. ' : 'Hard to follow. '}</span>
        {s.note}
      </p>
    </figure>
  )
}
