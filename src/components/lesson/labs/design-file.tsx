'use client'
import { cn } from '@/lib/cn'
import type { LabProps } from './shared'

type LayerId = 'card' | 'photo' | 'heading' | 'price' | 'button'

const LAYERS: { id: LayerId; label: string; kind: string; depth: number }[] = [
  { id: 'card', label: 'Menu card', kind: 'Frame', depth: 0 },
  { id: 'photo', label: 'jollof-photo', kind: 'Image', depth: 1 },
  { id: 'heading', label: 'Party jollof rice', kind: 'Text', depth: 1 },
  { id: 'price', label: '₦4,500', kind: 'Text', depth: 1 },
  { id: 'button', label: 'Add to order', kind: 'Frame', depth: 1 },
]

/** What the Properties panel shows for each layer, in the order a designer reads it. */
const PROPS: Record<LayerId, [string, string][]> = {
  card: [
    ['Size', '328 × 360'],
    ['Fill', '#FFFFFF'],
    ['Corner radius', '20'],
    ['Auto layout', 'Vertical, gap 12'],
    ['Padding', '16'],
    ['Stroke', '1, #E4E1EE'],
  ],
  photo: [
    ['Size', '296 × 180'],
    ['Corner radius', '12'],
    ['Fill', 'Image, cover'],
    ['Export', 'WebP, 1x and 2x'],
  ],
  heading: [
    ['Font', 'Bricolage Grotesque'],
    ['Weight', 'ExtraBold (800)'],
    ['Size', '24'],
    ['Line height', '32'],
    ['Letter spacing', '-2%'],
    ['Colour', '#15122A'],
  ],
  price: [
    ['Font', 'Poppins'],
    ['Weight', 'SemiBold (600)'],
    ['Size', '20'],
    ['Line height', '28'],
    ['Colour', '#9A3412'],
  ],
  button: [
    ['Size', 'Fill × 48'],
    ['Fill', '#3D5AF5'],
    ['Corner radius', '12'],
    ['Padding', '12, 24'],
    ['Text', 'Poppins 600, 16, #FFFFFF'],
  ],
}

type View = { selected?: LayerId; measure?: boolean; exporting?: boolean; say: string }

const DIAGRAM: View[] = [
  {
    say: 'A design file holds frames, one for each screen or part. The Layers panel lists what is inside the frame: a photo, two pieces of text and a button.',
  },
  {
    selected: 'heading',
    say: 'Select the heading, and the Properties panel shows its type: font, weight, size, line height, letter spacing and colour. Those become your CSS.',
  },
  {
    selected: 'button',
    say: 'Select the button: its fill, corner radius and padding. Auto layout with padding 12, 24 means padding: 12px 24px in CSS.',
  },
  {
    selected: 'card',
    measure: true,
    say: 'Select one layer, then hold Alt (Option on a Mac) and hover over another: the red lines show the distance. 16 inside the card, and 12 between items.',
  },
  {
    selected: 'photo',
    exporting: true,
    say: 'Select the photo, and the Export section lists its formats: WebP at 1x and 2x. Export turns layers into files you can put on the page.',
  },
]

const PICK: [RegExp, LayerId][] = [
  [/head|title/i, 'heading'],
  [/price/i, 'price'],
  [/button/i, 'button'],
  [/photo|image/i, 'photo'],
  [/card|frame/i, 'card'],
]

function Gap({ label, className }: { label: string; className: string }) {
  return (
    <span aria-hidden="true" className={cn('absolute flex items-center justify-center', className)}>
      <span className="rounded bg-[#e5484d] px-1 text-[10px] leading-4 font-semibold text-white">
        {label}
      </span>
    </span>
  )
}

/**
 * A design file, as a developer reads it: layers, the selected layer's properties, red-line measurements
 * and export settings. Diagram lab (5 states), or Explore lab whose value names a layer: heading, price,
 * button, photo or card.
 */
export function DesignFile({ state, value }: LabProps) {
  const v: View =
    value !== undefined
      ? { selected: PICK.find(([re]) => re.test(value))?.[1] ?? 'card', say: '' }
      : DIAGRAM[Math.min(Math.max(state ?? 0, 0), DIAGRAM.length - 1)]!
  const sel = v.selected
  const ring = (id: LayerId) => sel === id && 'outline-2 outline-offset-1 outline-[#3d5af5]'
  const props = sel ? PROPS[sel] : null
  const layer = LAYERS.find((l) => l.id === sel)
  const say =
    v.say ||
    (layer && props ? `${layer.label} selected. ${props.map(([k, val]) => `${k}: ${val}`).join('. ')}.` : '')

  return (
    <figure className="m-0">
      <div className="grid grid-cols-1 gap-2 rounded-xl border border-line-subtle bg-row p-2 @min-[540px]:grid-cols-[120px_minmax(0,1fr)_170px]">
        <div className="order-2 rounded-lg border border-line bg-sunken p-2 @min-[540px]:order-1">
          <p className="mb-1 text-[11px] font-semibold text-ink-muted">Layers</p>
          <ul className="flex flex-col gap-0.5 text-[12px]">
            {LAYERS.map((l) => (
              <li
                key={l.id}
                style={{ paddingLeft: 4 + l.depth * 12 }}
                className={cn(
                  'truncate rounded px-1 py-0.5',
                  sel === l.id ? 'bg-fe font-semibold text-white' : 'text-ink',
                )}
              >
                <span className="sr-only">{l.kind}: </span>
                <span aria-hidden="true" className="mr-1 opacity-70">
                  {l.kind === 'Text' ? 'T' : l.kind === 'Image' ? '▣' : '#'}
                </span>
                {l.label}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="order-1 flex justify-center rounded-lg bg-[#e9e7f0] p-3 @min-[540px]:order-2"
          aria-hidden="true"
        >
          <div
            className={cn(
              'relative w-[200px] rounded-[14px] border border-[#e4e1ee] bg-white p-2.5',
              ring('card'),
            )}
          >
            {v.measure && (
              <>
                <Gap label="16" className="top-0 left-0 h-2.5 w-full" />
                <Gap label="12" className="top-[86px] left-0 h-2 w-full" />
              </>
            )}
            <div
              className={cn('h-[76px] rounded-lg', ring('photo'))}
              style={{ background: 'linear-gradient(135deg, #e8742c, #b4531f 60%, #6b2f12)' }}
            />
            <p className={cn('mt-2 text-[15px] leading-5 font-extrabold text-[#15122a]', ring('heading'))}>
              Party jollof rice
            </p>
            <p className={cn('mt-2 text-[13px] font-semibold text-[#9a3412]', ring('price'))}>₦4,500</p>
            <p
              className={cn(
                'mt-2 rounded-lg bg-[#3d5af5] py-1.5 text-center text-[12px] font-semibold text-white',
                ring('button'),
              )}
            >
              Add to order
            </p>
          </div>
        </div>

        <div className="order-3 rounded-lg border border-line bg-sunken p-2">
          <p className="mb-1 text-[11px] font-semibold text-ink-muted">
            {layer ? `Properties · ${layer.kind}` : 'Properties'}
          </p>
          {props ? (
            <dl className="flex flex-col gap-1 text-[12px]">
              {props.map(([k, val]) => (
                <div key={k} className="flex justify-between gap-2">
                  <dt className="text-ink-muted">{k}</dt>
                  <dd className="text-right font-mono text-[11px] text-ink">{val}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-[12px] text-ink-muted">Select a layer to read its properties.</p>
          )}
          {v.exporting && (
            <div className="mt-2 border-t border-line pt-2 text-[12px]">
              <p className="font-semibold text-ink">Export</p>
              <p className="font-mono text-[11px] text-ink">1x · WebP · jollof.webp</p>
              <p className="font-mono text-[11px] text-ink">2x · WebP · jollof@2x.webp</p>
              <p className="mt-1 rounded bg-fe px-2 py-0.5 text-center text-[11px] font-semibold text-white">
                Export jollof-photo
              </p>
            </div>
          )}
        </div>
      </div>
      {v.say && <p className="mt-2.5 text-[13px] text-ink-muted">{v.say}</p>}
      <figcaption className="sr-only" aria-live="polite">
        {say}
      </figcaption>
    </figure>
  )
}
