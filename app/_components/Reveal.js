'use client'

import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'

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
 * `prefers-reduced-motion` renders the final state with no animation at all.
 *
 * Uses `LazyMotion` + `m` rather than the full `motion` component: only opacity
 * and transform are needed, and the reduced feature bundle is roughly half the
 * size of the whole library on a site that is otherwise lean.
 */

const EASE = [0.16, 1, 0.3, 1]
const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' }

export function RevealGroup({ children, className, stagger = 0.09, delay = 0 }) {
  const reduced = useReducedMotion()

  if (reduced) return <div className={className}>{children}</div>

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className={className}
        initial="hidden"
        whileInView="shown"
        viewport={VIEWPORT}
        variants={{
          hidden: {},
          shown: { transition: { staggerChildren: stagger, delayChildren: delay } },
        }}
      >
        {children}
      </m.div>
    </LazyMotion>
  )
}

export function Reveal({ children, className, y = 0, duration = 0.7 }) {
  const reduced = useReducedMotion()

  if (reduced) return <div className={className}>{children}</div>

  return (
    <m.div
      // `reveal-block` exists so the page can undo the hidden start state in a
      // <noscript> rule. The server renders these with `opacity:0` inline, which
      // would otherwise leave the whole page blank when scripting is off.
      className={className ? `reveal-block ${className}` : 'reveal-block'}
      variants={{
        hidden: { opacity: 0, y },
        shown: { opacity: 1, y: 0, transition: { duration, ease: EASE } },
      }}
    >
      {children}
    </m.div>
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
  const reduced = useReducedMotion()
  const Tag = as

  // A newline in `text` is an explicit line break in the heading.
  const lines = text.split('\n')
  const label = lines.join(' ')

  if (reduced) {
    return (
      <Tag className={className}>
        {lines.map((line, i) => (
          <span key={i}>
            {i > 0 ? <br /> : null}
            {line}
          </span>
        ))}
      </Tag>
    )
  }

  const MotionTag = m[as] ?? m.h2

  // Long headings would otherwise crawl: hold the whole cascade to MAX_CASCADE
  // so a five-word heading feels brisk and a fifty-character one still lands
  // before the reader gets impatient.
  const step = Math.min(stagger, MAX_CASCADE / Math.max(label.length, 1))

  let index = 0

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionTag
        className={className}
        aria-label={label}
        initial="hidden"
        whileInView="shown"
        viewport={VIEWPORT}
        variants={{
          hidden: {},
          shown: { transition: { staggerChildren: step, delayChildren: delay } },
        }}
      >
        {lines.map((line, lineIndex) => (
          <span key={lineIndex} aria-hidden="true">
            {lineIndex > 0 ? <br /> : null}
            {Array.from(line).map((character) => {
              const key = index++
              // Spaces stay as plain text nodes so the browser can still break
              // lines wherever it likes.
              return character === ' ' ? (
                <span key={key}> </span>
              ) : (
                <m.span
                  key={key}
                  className="reveal-char inline"
                  variants={{
                    hidden: { opacity: 0 },
                    shown: { opacity: 1, transition: { duration, ease: 'easeOut' } },
                  }}
                >
                  {character}
                </m.span>
              )
            })}
          </span>
        ))}
      </MotionTag>
    </LazyMotion>
  )
}
