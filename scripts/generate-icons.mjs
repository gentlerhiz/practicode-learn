// Renders the app icon into every size browsers and phones ask for.
// Source: brand/logo/app-icon.svg (interim). When the official logo pack arrives, replace that file
// and run `node scripts/generate-icons.mjs` again; every output below is regenerated.
import { chromium } from '@playwright/test'
import { readFileSync, writeFileSync } from 'node:fs'

const svg = readFileSync('brand/logo/app-icon.svg', 'utf8')
// The icon geometry inside the tile, reused to draw full-bleed and maskable versions.
const glyph = svg.match(/<g[\s\S]*<\/g>/)[0]

const tile = (rx) => svg.replace(/rx="\d+"/, `rx="${rx}"`)
const fullBleed = (scale) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="#FED606"/>${glyph.replace(/scale\([\d.]+\)/, `scale(${scale})`)}</svg>`

const outputs = [
  { file: 'public/icons/icon-192.png', size: 192, svg: tile(112) },
  { file: 'public/icons/icon-512.png', size: 512, svg: tile(112) },
  // Maskable icons keep the logo inside the central safe zone (80% circle), so it is drawn smaller.
  { file: 'public/icons/icon-512-maskable.png', size: 512, svg: fullBleed(12) },
  // iOS rounds the corners itself.
  { file: 'src/app/apple-icon.png', size: 180, svg: fullBleed(15.8) },
  { file: 'public/icons/favicon-16.png', size: 16, svg: tile(96) },
  { file: 'public/icons/favicon-32.png', size: 32, svg: tile(96) },
  { file: 'public/icons/favicon-48.png', size: 48, svg: tile(96) },
]

const browser = await chromium.launch()
const page = await browser.newPage()
for (const { file, size, svg: source } of outputs) {
  await page.setViewportSize({ width: size, height: size })
  await page.setContent(
    `<html><body style="margin:0;background:transparent">${source.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`,
  )
  const png = await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } })
  writeFileSync(file, png)
  console.log('wrote', file)
}
await browser.close()

// favicon.ico: an ICO header followed by PNG-compressed 16, 32 and 48 px images.
const entries = [16, 32, 48].map((s) => ({ size: s, data: readFileSync(`public/icons/favicon-${s}.png`) }))
const header = Buffer.alloc(6 + 16 * entries.length)
header.writeUInt16LE(0, 0)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(entries.length, 4)
let offset = header.length
entries.forEach(({ size, data }, i) => {
  const at = 6 + i * 16
  header.writeUInt8(size, at)
  header.writeUInt8(size, at + 1)
  header.writeUInt8(0, at + 2)
  header.writeUInt8(0, at + 3)
  header.writeUInt16LE(1, at + 4)
  header.writeUInt16LE(32, at + 6)
  header.writeUInt32LE(data.length, at + 8)
  header.writeUInt32LE(offset, at + 12)
  offset += data.length
})
writeFileSync('src/app/favicon.ico', Buffer.concat([header, ...entries.map((e) => e.data)]))
console.log('wrote src/app/favicon.ico')

// The SVG favicon for modern browsers: the same yellow tile.
writeFileSync(
  'src/app/icon.svg',
  svg
    .replace(/ role="img" aria-labelledby="t"/, '')
    .replace(/<title[^>]*>.*<\/title>\n?\s*/, '')
    .replace(/<!--.*-->\n?\s*/, ''),
)
console.log('wrote src/app/icon.svg')
