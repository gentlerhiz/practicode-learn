import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, JetBrains_Mono, Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { RegisterServiceWorker } from '@/components/pwa/register-sw'
import { JsonLd } from '@/components/seo/json-ld'
import { publicEnv } from '@/lib/env'
import { organizationLd, websiteLd } from '@/lib/seo/jsonld'
import { site } from '@/lib/site'
import { ThemeScript } from '@/components/layout/theme-script'
import './globals.css'

// The variable font with its optical-size axis, as the canvas loads it: large headings get the
// tighter display cut, so they set exactly as designed.
const display = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz'],
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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'PractiCode Learn: learn the skills employers are hiring for',
    template: '%s · PractiCode Learn',
  },
  description: site.description,
  applicationName: site.name,
  publisher: site.publisher,
  formatDetection: { telephone: false, email: false, address: false },
  verification: {
    google: publicEnv.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: publicEnv.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { 'msvalidate.01': publicEnv.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#07060D' },
    { media: '(prefers-color-scheme: light)', color: '#F5F4FA' },
  ],
  colorScheme: 'dark light',
}

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
      <body className="bg-bg font-sans text-ink antialiased">
        {children}
        <RegisterServiceWorker />
        <JsonLd data={[organizationLd(), websiteLd()]} />
        {/*
          Cookieless: counts visits and page speed without identifying anyone (named in the privacy notice).
          The scripts are served only by Vercel, so local and CI builds leave them out.
        */}
        {process.env.VERCEL && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  )
}
