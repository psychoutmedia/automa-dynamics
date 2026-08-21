'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function HomeHero() {
  const [mounted, setMounted] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const enter = mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-20" />

      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] animate-pulse-slow"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div className={`mb-8 transition-all duration-1000 ${enter}`}>
          <Image
            src="/logo.png"
            alt="Automa Dynamics"
            width={200}
            height={200}
            className="mx-auto object-contain mb-6"
            priority
          />
        </div>

        <div className={`transition-all duration-1000 delay-200 ${enter}`}>
          <p className="text-chrome/70 text-sm tracking-[0.3em] uppercase mb-4">
            Operational Intelligence
          </p>
        </div>

        <h1
          className={`text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 transition-all duration-1000 delay-300 ${enter}`}
        >
          <span className="text-gradient">Observe. Understand.</span>
          <br />
          <span className="text-chrome-light">Decide. Act.</span>
        </h1>

        <p
          className={`text-lg md:text-xl text-chrome/70 max-w-2xl mx-auto mb-12 leading-relaxed transition-all duration-1000 delay-500 ${enter}`}
        >
          We build software that models an organisation as a living system, so the people
          responsible for it can see what is true, understand what a change affects, and act on
          evidence rather than assertion.
        </p>

        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-700 ${enter}`}
        >
          <Link href="/#platform" className="btn-primary inline-flex items-center gap-2">
            Explore the Platform
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link href="/articles" className="btn-secondary">
            Read the Articles
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-chrome/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-chrome/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}
