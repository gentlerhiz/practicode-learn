import './globals.css'

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  )
}
