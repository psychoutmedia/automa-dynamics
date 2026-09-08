// Capture a real screenshot of a page and write it as that route's Open Graph
// card, so a link posted to X shows the page rather than the site logo.
//
//     npm run build && npm start          # in another shell
//     node scripts/make-og.mjs
//
// Why a screenshot and not a composed image: the articles index already carries
// the series crest, the heading and the cover art of the newest piece. A picture
// of it says more in a timeline than any generated card would, and it stays
// honest about what the reader lands on.
//
// Chrome is driven headless through puppeteer-core, which uses the browser
// already installed rather than downloading its own. Set CHROME_PATH if yours
// lives somewhere unusual.
import { existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import puppeteer from 'puppeteer-core'

// Open Graph and X both render large cards at 1.91:1. Captured at 2x so the
// image stays sharp on a retina timeline.
//
// Captured at 1600 CSS pixels rather than 1200 because the page's container
// tops out at 1152px: a narrower viewport does not make the text bigger, it
// only trims the margin, and 1600 fits the heading, the intro and the first
// cover inside one 1.91:1 frame.
const CARD_W = 1600
const CARD_H = Math.round(CARD_W / 1.905)
const SCALE = 1.5

const BASE = process.env.OG_BASE ?? 'http://localhost:3000'

/**
 * Each target frames a slice of its page. `top` is the CSS pixel offset the
 * 1.91:1 crop starts at, chosen so the shot lands on content rather than on
 * whatever happens to be at the top of the scroll.
 *
 * /articles is framed on the hero: the crest, the series heading, the standfirst,
 * and the cover art of the newest piece just breaking into the bottom of the
 * frame. That last part matters. It reads as a collection with something in it,
 * where a shot of the first article card alone would look like a link to that
 * one article, which is what an article's own card already does.
 */
const TARGETS = [
  { path: '/articles', out: 'public/articles/og.png', top: 130 },
]

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].filter(Boolean)

const executablePath = CHROME_CANDIDATES.find((p) => existsSync(p))
if (!executablePath) {
  console.error('error: no Chrome found. Set CHROME_PATH to the executable.')
  process.exit(1)
}

const browser = await puppeteer.launch({
  executablePath,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars'],
})

for (const { path, out, top } of TARGETS) {
  const page = await browser.newPage()
  await page.setViewport({
    width: CARD_W,
    height: CARD_H + top,
    deviceScaleFactor: SCALE,
  })

  // Headings type on one character at a time and blocks fade in on scroll, so a
  // screenshot taken while a cascade is running catches half a word at half
  // opacity. Reveal.js already renders the settled state outright under
  // `prefers-reduced-motion`, so ask for that rather than fighting the inline
  // opacities framer-motion writes: it is the component's own supported path.
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])

  // Belt and braces for anything animated in CSS rather than by the component.
  await page.evaluateOnNewDocument(() => {
    const css = document.createElement('style')
    css.textContent = `
      .reveal-block,.reveal-char{opacity:1!important;transform:none!important}
      *,*::before,*::after{animation:none!important;transition:none!important}
    `
    document.documentElement.appendChild(css)
  })

  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle0' })
  // Fonts settle after the network does, and a font swap moves every baseline.
  await page.evaluate(() => document.fonts.ready)

  mkdirSync(dirname(resolve(out)), { recursive: true })
  await page.screenshot({
    path: out,
    clip: { x: 0, y: top, width: CARD_W, height: CARD_H },
  })
  await page.close()
  console.log(`${out}  <-  ${BASE}${path} at y=${top}  (${CARD_W}x${CARD_H} @${SCALE}x)`)
}

await browser.close()
