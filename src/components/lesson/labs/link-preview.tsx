'use client'
import type { LabProps } from './shared'

type Head = {
  code: string
  whatsapp: { title?: string; description?: string; image?: boolean } | null
  google: { title: string; description: string }
  says: string
}

const URL_TEXT = 'mamankechi.ng'
const DESC =
  'Jollof rice, pepper soup and fried plantain, cooked fresh every day in Ibadan. Order on WhatsApp.'

const HEADS: [RegExp, Head][] = [
  [
    /no head|nothing/i,
    {
      code: '<head>\n</head>',
      whatsapp: null,
      google: {
        title: 'mamankechi.ng',
        description: 'Mama Nkechi’s Kitchen Jollof rice · ₦2,500 Pepper soup · ₦1,800 Fried plantain…',
      },
      says: 'With nothing in the head, WhatsApp shows a bare link, and Google invents a title and a description from whatever text it finds on the page.',
    },
  ],
  [
    /description/i,
    {
      code: `<head>\n  <title>Mama Nkechi’s Kitchen | Jollof in Ibadan</title>\n  <meta name="description" content="${DESC}">\n</head>`,
      whatsapp: { title: 'Mama Nkechi’s Kitchen | Jollof in Ibadan', description: DESC },
      google: { title: 'Mama Nkechi’s Kitchen | Jollof in Ibadan', description: DESC },
      says: 'The meta description is the short summary under the title in search results. Google often uses it as written, so make it say why someone should click.',
    },
  ],
  [
    /open graph|og/i,
    {
      code: `<head>\n  <title>Mama Nkechi’s Kitchen | Jollof in Ibadan</title>\n  <meta name="description" content="${DESC}">\n  <meta property="og:title" content="Mama Nkechi’s Kitchen">\n  <meta property="og:description" content="Fresh jollof every day. Order on WhatsApp.">\n  <meta property="og:image" content="https://mamankechi.ng/share.jpg">\n</head>`,
      whatsapp: {
        title: 'Mama Nkechi’s Kitchen',
        description: 'Fresh jollof every day. Order on WhatsApp.',
        image: true,
      },
      google: { title: 'Mama Nkechi’s Kitchen | Jollof in Ibadan', description: DESC },
      says: 'Open Graph tags (og:) are what WhatsApp, Facebook and LinkedIn read for the preview card, including the picture. Search results still use the title and description.',
    },
  ],
  [
    /title/i,
    {
      code: '<head>\n  <title>Mama Nkechi’s Kitchen | Jollof in Ibadan</title>\n</head>',
      whatsapp: { title: 'Mama Nkechi’s Kitchen | Jollof in Ibadan' },
      google: {
        title: 'Mama Nkechi’s Kitchen | Jollof in Ibadan',
        description: 'Mama Nkechi’s Kitchen Jollof rice · ₦2,500 Pepper soup · ₦1,800 Fried plantain…',
      },
      says: 'The title fixes the blue link in search results and the bold line on WhatsApp. The description is still guessed from the page.',
    },
  ],
]

/**
 * Explore lab: what WhatsApp and Google show for a link, depending on the page's head. Values: no head
 * tags, a title, title and description, Open Graph tags.
 */
export function LinkPreview({ value = '' }: LabProps) {
  const head = HEADS.find(([re]) => re.test(value))?.[1] ?? HEADS[0]![1]
  const w = head.whatsapp

  return (
    <div className="flex flex-col gap-3">
      <pre className="overflow-x-auto rounded-xl border border-line bg-row p-3 font-mono text-[12px] leading-5 text-ink">
        {head.code}
      </pre>
      <div className="grid gap-3 tab:grid-cols-2">
        <section aria-label="Shared on WhatsApp" className="rounded-xl bg-[#e6ddd4] p-3">
          <h3 className="mb-2 text-[11px] font-semibold text-[#3b4a54]">Shared on WhatsApp</h3>
          <div className="ml-auto max-w-[260px] rounded-lg bg-[#d9fdd3] p-1.5 text-[#111b21] shadow-sm">
            {w && (
              <div className="mb-1 overflow-hidden rounded-md bg-[#f0f2f5]">
                {w.image && (
                  <div className="flex h-20 items-center justify-center bg-[#c2410c] text-[12px] font-semibold text-white">
                    [share.jpg: a plate of jollof]
                  </div>
                )}
                <div className="p-2">
                  <p className="text-[12px] font-semibold">{w.title}</p>
                  {w.description && <p className="mt-0.5 text-[11px] text-[#54656f]">{w.description}</p>}
                  <p className="mt-0.5 text-[11px] text-[#667781]">{URL_TEXT}</p>
                </div>
              </div>
            )}
            <p className="px-1 text-[12px] text-[#027eb5] underline">https://{URL_TEXT}</p>
          </div>
        </section>
        <section aria-label="In Google's results" className="rounded-xl bg-white p-3 text-[#202124]">
          <h3 className="mb-2 text-[11px] font-semibold text-[#5f6368]">In Google’s results</h3>
          <p className="text-[11px] text-[#4d5156]">{URL_TEXT}</p>
          <p className="text-[15px] leading-5 text-[#1a0dab]">{head.google.title}</p>
          <p className="mt-0.5 text-[12px] leading-4 text-[#4d5156]">{head.google.description}</p>
        </section>
      </div>
      <p aria-live="polite" className="text-[13px] text-ink-muted">
        {head.says}
      </p>
    </div>
  )
}
