'use client'

import { useEffect, useRef } from 'react'

/**
 * Scroll-triggered reveals.
 *
 * Two behaviours, both driven by opacity rather than movement:
 *
 * `SplitText` animates a heading one character at a time, left to right. The
 * characters are laid out normally and only their opacity changes, so the text
 * materialises in place with no reflow and nothing sliding.
 *
 * `Reveal` fades a block in, inheriting a stagger from `RevealGroup` so a label
 * lands fractionally before the paragraph beneath it.
 *
 * `prefers-reduced-motion` renders the final state with no animation at all
 * (handled in globals.css).
 *
 * Plain CSS transitions, triggered by an IntersectionObserver setting
 * `data-shown`. This used to be framer-motion, which runs opacity as a Web
 * Animations API animation over an inline `opacity:0` and only commits the
 * final value after the animation finishes. In current Chromium that handover
 * leaves a frame at the inline 0, so every character blinked out the moment it
 * finished fading in: a dark sweep running left to right over text that was
 * already visible. A transition settles on its end value by definition, so
 * there is no handover to lose.
 */

/** easeOut-expo-ish, carried over from the framer config [0.16, 1, 0.3, 1]. */
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

/**
 * Fire when the element reaches the upper three quarters of the viewport, not
 * the moment its first pixel appears.
 *
 * At -12% two headings that happened to share a tall viewport typed at the same
 * time, which reads as the page loading rather than as the text being written.
 * -25% makes an element wait until it is genuinely in reading position, so each
 * heading gets its own moment however tall the screen is.
 */
const VIEWPORT_MARGIN = '0px 0px -25% 0px'

/**
 * Run `show` once, when `ref` scrolls into reading position.
 *
 * Errs toward SHOWING: no observer support, an unmeasurable viewport, or an
 * element already scrolled past (a reload restoring scroll position) all show
 * immediately. Guessing wrong the other way leaves invisible body text.
 */
function useOnView(ref, show) {
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (typeof IntersectionObserver === 'undefined' || !window.innerHeight) {
      show(el)
      return undefined
    }
    const io = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1]
      if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
        io.disconnect()
        show(el)
      }
    }, { rootMargin: VIEWPORT_MARGIN })
    io.observe(el)
    return () => io.disconnect()
    // `show` is derived from props that never change after mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export function RevealGroup({ children, className, stagger = 0.09, delay = 0 }) {
  const ref = useRef(null)

  useOnView(ref, (group) => {
    // Only this group's own blocks, in document order, take part in its stagger.
    const blocks = Array.from(group.querySelectorAll('.reveal-block')).filter(
      (block) => block.closest('[data-reveal-group]') === group,
    )
    blocks.forEach((block, i) => {
      block.style.transitionDelay = `${delay + i * stagger}s`
      block.setAttribute('data-shown', '')
    })
  })

  return (
    <div ref={ref} className={className} data-reveal-group="">
      {children}
    </div>
  )
}

export function Reveal({ children, className, y = 0, duration = 0.7 }) {
  const ref = useRef(null)

  // A block outside any group reveals itself rather than waiting forever.
  useOnView(ref, (block) => {
    if (!block.closest('[data-reveal-group]')) block.setAttribute('data-shown', '')
  })

  return (
    <div
      ref={ref}
      // `reveal-block` exists so the page can undo the hidden start state in a
      // <noscript> rule. It starts at `opacity:0` from the stylesheet, which
      // would otherwise leave the whole page blank when scripting is off.
      className={className ? `reveal-block ${className}` : 'reveal-block'}
      style={{
        transitionDuration: `${duration}s`,
        transitionTimingFunction: EASE,
        ...(y ? { '--reveal-y': `${y}px` } : null),
      }}
    >
      {children}
    </div>
  )
}

/**
 * Per-character opacity cascade for display headings.
 *
 * Spaces stay as ordinary text nodes between the spans so the browser can still
 * break lines wherever it likes. The spans are `aria-hidden` and the real string
 * is carried on the element's `aria-label`, otherwise assistive technology reads
 * the heading out one letter at a time.
 */
/** Longest the cascade may run, however many characters there are. */
const MAX_CASCADE = 0.7

export function SplitText({
  text,
  className,
  as = 'h2',
  stagger = 0.022,
  duration = 0.5,
  delay = 0,
}) {
  const ref = useRef(null)
  const Tag = as

  useOnView(ref, (heading) => heading.setAttribute('data-shown', ''))

  // A newline in `text` is an explicit line break in the heading.
  const lines = text.split('\n')
  const label = lines.join(' ')

  // Long headings would otherwise crawl: hold the whole cascade to MAX_CASCADE
  // so a five-word heading feels brisk and a fifty-character one still lands
  // before the reader gets impatient.
  const step = Math.min(stagger, MAX_CASCADE / Math.max(label.length, 1))

  // Delays are fixed at render, so server and client markup agree. Only real
  // characters advance the cascade, as only they did under framer's stagger.
  let index = 0
  let charIndex = 0

  return (
    <Tag
      ref={ref}
      className={className ? `reveal-split ${className}` : 'reveal-split'}
      aria-label={label}
    >
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} aria-hidden="true">
          {lineIndex > 0 ? <br /> : null}
          {Array.from(line).map((character) => {
            const key = index++
            return character === ' ' ? (
              <span key={key}> </span>
            ) : (
              <span
                key={key}
                className="reveal-char inline"
                style={{
                  transitionDelay: `${(delay + charIndex++ * step).toFixed(3)}s`,
                  transitionDuration: `${duration}s`,
                }}
              >
                {character}
              </span>
            )
          })}
        </span>
      ))}
    </Tag>
  )
}
