import { ImageResponse } from 'next/og'
import { brandCard, ogFonts } from '@/lib/og/brand-card'

export const alt = 'PractiCode Learn: learn the skills employers are hiring for'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    brandCard({
      eyebrow: 'Interactive lessons, real projects',
      title: 'Learn the skills employers are hiring for',
      footer: 'learn.practicode.tech',
    }),
    { ...size, fonts: await ogFonts() },
  )
}
