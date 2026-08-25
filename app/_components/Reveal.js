'use client'

import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'

/**
 * Scroll-triggered fade and rise.
 *
 * Blocks start 32px low and transparent, then settle as they enter the
 * viewport. Once only: re-animating on the way back up is distracting when
 * re-reading.
 *
 * `Reveal` is always a child of `RevealGroup` and deliberately declares no
 * trigger of its own - in Framer Motion a child inherits the parent's variant
 * state only while it has no `initial`/`whileInView` of its own, and that
 * inheritance is what produces the stagger. A single-child group is the correct
 * way to reveal one element on its own.
 *
 * `prefers-reduced-motion` drops the movement and renders the final state.
 *
 * Uses `LazyMotion` + `m` rather than the full `motion` component: this page
 * only needs opacity and transform, and the reduced feature bundle is roughly
 * half the size of the whole library on a site that is otherwise lean.
 */

const EASE = [0.16, 1, 0.3, 1]

export function RevealGroup({ children, className, stagger = 0.09, delay = 0 }) {
  const reduced = useReducedMotion()

  if (reduced) return <div className={className}>{children}</div>

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className={className}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, margin: '0px 0px -12% 0px' }}
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

export function Reveal({ children, className, y = 32, duration = 0.75 }) {
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
