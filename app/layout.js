import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrains = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

export const metadata = {
  metadataBase: new URL('https://www.automadynamics.com'),
  title: {
    default: 'Automa Dynamics',
    template: '%s | Automa Dynamics',
  },
  description: 'Pioneering the future of autonomous systems and intelligent automation.',
  openGraph: {
    title: 'Automa Dynamics',
    description: 'Pioneering the future of autonomous systems and intelligent automation.',
    url: 'https://www.automadynamics.com',
    siteName: 'Automa Dynamics',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Automa Dynamics - Autonomous Intelligence',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Automa Dynamics',
    description: 'Pioneering the future of autonomous systems and intelligent automation.',
    images: ['/opengraph-image.png'],
  },
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-wayland-950 text-wayland-50">
        {children}
      </body>
    </html>
  )
}
