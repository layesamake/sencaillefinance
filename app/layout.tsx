import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sencaille Finance',
  description: 'Gestion de trésorerie',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
