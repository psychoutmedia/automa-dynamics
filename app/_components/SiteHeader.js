'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// "About" replaces the old "/#mission" anchor: the About page carries the
// mission at length, and two nav entries pointing at the same statement read as
// duplication. The homepage mission section itself is unchanged.
const links = [
  { href: '/about', label: 'About' },
  { href: '/#platform', label: 'Platform' },
  { href: '/articles', label: 'Articles' },
  { href: '/#contact', label: 'Contact' },
]

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-wayland-950/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/logo.png"
            alt="Automa Dynamics"
            width={40}
            height={40}
            className="object-contain w-8 h-8 md:w-10 md:h-10"
          />
          <span className="hidden sm:inline font-semibold text-lg tracking-wide">AUTOMA DYNAMICS</span>
        </Link>
        <div className="flex items-center gap-4 md:gap-8 text-xs md:text-sm text-chrome/70">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-chrome-light transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
