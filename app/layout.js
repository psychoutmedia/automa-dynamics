import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import SiteHeader from './_components/SiteHeader'
import SiteFooter from './_components/SiteFooter'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

const DESCRIPTION =
  'Automa Dynamics builds Project HELIOS, an operational ontology platform and enterprise digital twin. Observe. Understand. Decide. Act.'

export const metadata = {
  metadataBase: new URL('https://www.automadynamics.com'),
  title: {
    default: 'Automa Dynamics',
    template: '%s | Automa Dynamics',
  },
  description: DESCRIPTION,
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [{ url: '/feed.xml', title: 'Automa Dynamics Articles' }],
    },
  },
  openGraph: {
    title: 'Automa Dynamics',
    description: DESCRIPTION,
    url: 'https://www.automadynamics.com',
    siteName: 'Automa Dynamics',
    type: 'website',
    locale: 'en_GB',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1536,
        height: 1024,
        alt: 'Automa Dynamics - Operational Intelligence',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@automadynamics',
    creator: '@automadynamics',
    title: 'Automa Dynamics',
    description: DESCRIPTION,
    images: ['/opengraph-image.png'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-wayland-950 text-wayland-50">
        {/* Reveal blocks and typed heading characters are server-rendered at
            `opacity:0` and settled by script. Without this the site is blank
            when scripting is unavailable. It lives in the root layout because
            these classes now appear on every page, not just one. */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html: '.reveal-block,.reveal-char{opacity:1!important;transform:none!important}',
            }}
          />
        </noscript>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <SiteHeader />
        <div id="main-content">{children}</div>
        <SiteFooter />
        {/* Vercel Web Analytics. Cookieless and stores no identifier, so no
            consent banner is required, and the script is served first-party
            from /_vercel/insights - the site still makes no cross-origin
            request. Instrumented to answer one question: whether readers are
            arriving from anywhere other than X. */}
        <Analytics />
      </body>
    </html>
  )
}
