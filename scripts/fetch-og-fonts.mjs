// Downloads the static TTF fonts the share images use (next/og needs TTF or OTF, not WOFF2).
// Google Fonts serves TTF to clients that don't declare WOFF2 support, so we send a plain user agent.
// Both families are licensed under the SIL Open Font License (see src/assets/fonts/OFL-*.txt).
import { mkdirSync, writeFileSync } from 'node:fs'

const fonts = [
  { family: 'Bricolage Grotesque', weight: 800, file: 'BricolageGrotesque-ExtraBold.ttf' },
  { family: 'Poppins', weight: 400, file: 'Poppins-Regular.ttf' },
  { family: 'Poppins', weight: 600, file: 'Poppins-SemiBold.ttf' },
]

mkdirSync('src/assets/fonts', { recursive: true })
for (const { family, weight, file } of fonts) {
  const css = await (
    await fetch(`https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })
  ).text()
  const url = css.match(/src: url\((https:[^)]+)\) format\('(truetype|opentype)'\)/)?.[1]
  if (!url) throw new Error(`No TTF URL for ${family} ${weight}:\n${css}`)
  const bytes = Buffer.from(await (await fetch(url)).arrayBuffer())
  writeFileSync(`src/assets/fonts/${file}`, bytes)
  console.log(`wrote ${file} (${Math.round(bytes.length / 1024)} KB)`)
}
