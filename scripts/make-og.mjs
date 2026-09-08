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

// Open Graph and X both render large cards at 1.91:1, delivered here at 2400px
// wide so the image stays sharp on a retina timeline.
const RATIO = 1.905
const OUTPUT_W = 2400

const BASE = process.env.OG_BASE ?? 'http://localhost:3000'

/**
 * A target names the band of the page the card should show: `top` and `bottom`
 * are CSS pixel offsets down the document, and the viewport width follows from
 * them, because the frame has to be 1.91:1 whatever it contains.
 *
 * That is the whole trick, and it is worth stating plainly. The page's container
 * is a fixed 1152px however wide the window is, so a narrower viewport does not
 * enlarge the text, it only trims the margin. Fitting more of the page into a
 * short, wide frame therefore means capturing at a WIDER viewport, which shrinks
 * the content against the frame. Zooming out is done by asking for more width.
 *
 * /articles is framed from above the crest down to the first article's read
 * time: crest, series heading, standfirst, then the newest piece complete with
 * its cover art, number, title and description. Nothing is allowed to be cut in
 * half. A card with a sliced cover on its bottom edge looks like a broken image
 * rather than a page.
 */
const TARGETS = [
  { path: '/articles', out: 'public/articles/og.png', top: 140, bottom: 1440 },
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

for (const { path, out, top, bottom } of TARGETS) {
  const height = bottom - top
  const width = Math.round(height * RATIO)
  // Capture at whatever density lands the finished card on OUTPUT_W, so a wider
  // frame comes back at the same delivered size rather than a bigger file.
  const scale = OUTPUT_W / width

  const page = await browser.newPage()
  await page.setViewport({
    width,
    // A little past the crop, so nothing at the bottom edge is still being laid
    // out when the shot is taken.
    height: bottom + 80,
    deviceScaleFactor: scale,
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
  await page.screenshot({ path: out, clip: { x: 0, y: top, width, height } })
  await page.close()
  console.log(
    `${out}  <-  ${BASE}${path} y=${top}..${bottom}  ` +
      `(${width}x${height} @${scale.toFixed(2)}x -> ${OUTPUT_W}x${Math.round(height * scale)})`,
  )
}

await browser.close()
