import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { BrowserExtensionSupport } from '@/components/BrowserExtensionSupport'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Emma & James - Wedding',
  description: 'Join us in celebrating our special day',
  keywords: ['wedding', 'Emma', 'James', 'celebration', 'marriage'],
  authors: [{ name: 'Emma & James' }],
  openGraph: {
    title: 'Emma & James - Wedding',
    description: 'Join us in celebrating our special day',
    type: 'website',
    locale: 'en_US',
    siteName: 'Emma & James Wedding',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emma & James - Wedding',
    description: 'Join us in celebrating our special day',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <BrowserExtensionSupport />
        {children}
      </body>
    </html>
  )
}