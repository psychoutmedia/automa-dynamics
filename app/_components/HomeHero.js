'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SplitText } from './Reveal'

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

  // Top padding clears the fixed nav: on a short phone screen the hero is
  // taller than the viewport and would otherwise start underneath it.
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16 sm:pb-24">
      <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-20" />

      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] animate-pulse-slow"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
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
          <p className="type-label mb-8">Operational Intelligence</p>
        </div>

        {/* The one heading on the site that types itself in on load rather than
            on scroll: it is already in view, so it gets a short delay instead of
            a viewport trigger. */}
        <SplitText
          as="h1"
          text={'Observe. Understand.\nDecide. Act.'}
          className="type-display text-chrome-light mb-10"
          delay={0.35}
        />

        <p
          className={`type-body type-measure mx-auto mb-12 transition-all duration-1000 delay-500 ${enter}`}
        >
          We build software that models an organisation as a living system, so the people
          responsible for it can see what is true, understand what a change affects, and act on
          evidence rather than assertion. We hold frontier AI to the same standard,
          reconstructing public safety claims so independent reviewers can inspect the evidence
          behind them.
        </p>

        <div
          className={`grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:flex-wrap sm:gap-4 justify-center transition-all duration-1000 delay-700 ${enter}`}
        >
          <Link href="/#platform" className="btn-primary col-span-2 inline-flex items-center justify-center gap-2">
            Explore HELIOS
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link href="/#argus" className="btn-secondary !px-3 sm:!px-8 text-center text-sm sm:text-base">
            Explore ARGUS
          </Link>
          <Link href="/articles" className="btn-secondary !px-3 sm:!px-8 text-center text-sm sm:text-base">
            Read the Articles
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
        <div className="w-6 h-10 border-2 border-chrome/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-chrome/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}
