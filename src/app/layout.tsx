import { Bricolage_Grotesque, JetBrains_Mono, Poppins } from 'next/font/google'
import { ThemeScript } from '@/components/layout/theme-script'
import './globals.css'

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-bricolage',
  display: 'swap',
})
const sans = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})
const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    // The boot script changes data-theme before React hydrates, hence suppressHydrationWarning.
    <html
      lang="en-GB"
      data-theme="dark"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="bg-bg font-sans text-ink antialiased">{children}</body>
    </html>
  )
}
