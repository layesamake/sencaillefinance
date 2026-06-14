import { Outfit, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

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
    <html lang="fr" className={`${outfit.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans bg-slate-950 text-slate-50 antialiased selection:bg-emerald-500/30" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
