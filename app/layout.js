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
  title: 'Automa Dynamics',
  description: 'Pioneering the future of autonomous systems and intelligent automation.',
  openGraph: {
    title: 'Automa Dynamics',
    description: 'Pioneering the future of autonomous systems and intelligent automation.',
    type: 'website',
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
