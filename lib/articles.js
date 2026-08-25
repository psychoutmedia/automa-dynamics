import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles')

const WORDS_PER_MINUTE = 220

/** The name printed on every cover: "Operational Intelligence / Article 001". */
export const SERIES_NAME = 'Operational Intelligence'

/**
 * Absolute origin, for the places that cannot use a relative URL.
 *
 * Next resolves relative metadata against `metadataBase` in the root layout, but
 * JSON-LD is hand-built and schema.org consumers need fully qualified URLs.
 */
export const SITE_URL = 'https://www.automadynamics.com'

/** Series position as it appears on the cover art: 4 -> "004". */
export function formatSeriesNumber(number) {
  return String(number).padStart(3, '0')
}

/**
 * Read intrinsic pixel dimensions straight from the file header.
 *
 * Cover art carries baked-in typography, so it must never be cropped. Knowing
 * the real aspect ratio lets the pages render `w-full h-auto` at whatever shape
 * the image actually is, instead of forcing it into a fixed box. No dependency:
 * JPEG SOF and PNG IHDR are both trivial to parse.
 */
function readImageSize(publicRelPath) {
  try {
    const file = path.join(process.cwd(), 'public', publicRelPath.replace(/^\//, ''))
    const buf = fs.readFileSync(file)

    // PNG: IHDR width/height are big-endian uint32 at bytes 16 and 20.
    if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
    }

    // JPEG: walk the marker segments to the first Start-Of-Frame.
    if (buf.length > 4 && buf.readUInt16BE(0) === 0xffd8) {
      let offset = 2
      while (offset < buf.length - 9) {
        if (buf[offset] !== 0xff) { offset += 1; continue }
        const marker = buf[offset + 1]
        const isSOF = marker >= 0xc0 && marker <= 0xcf &&
          marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc
        if (isSOF) {
          return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) }
        }
        offset += 2 + buf.readUInt16BE(offset + 2)
      }
    }
  } catch {
    // Fall through to the default below.
  }
  return null
}

/** gray-matter turns an unquoted YAML `date:` into a Date. Normalise to `YYYY-MM-DD`. */
function toISODate(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value).slice(0, 10)
}

function countWords(body) {
  return body.trim().split(/\s+/).filter(Boolean).length
}

function readingTimeMinutes(body) {
  return Math.max(1, Math.round(countWords(body) / WORDS_PER_MINUTE))
}

export function formatArticleDate(isoDate) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`))
}

export function getArticleSlugs() {
  if (!fs.existsSync(ARTICLES_DIR)) return []
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''))
}

export function getArticleBySlug(slug) {
  const fullPath = path.join(ARTICLES_DIR, `${slug}.mdx`)
  if (!fs.existsSync(fullPath)) return null

  const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'))

  return {
    slug,
    title: data.title ?? slug,
    // Series position, printed on the cover art. Null for anything standalone.
    number: Number.isFinite(Number(data.number)) && data.number != null ? Number(data.number) : null,
    date: toISODate(data.date),
    description: data.description ?? '',
    eyebrow: data.eyebrow ?? 'ARTICLE',
    cover: data.cover ?? null,
    coverSize: data.cover ? readImageSize(data.cover) ?? { width: 1600, height: 640 } : null,
    coverAlt: data.coverAlt ?? data.title ?? '',
    draft: data.draft === true,
    tweetId: data.tweetId ? String(data.tweetId) : null,
    xUrl: data.xUrl ?? null,
    readingTime: readingTimeMinutes(content),
    wordCount: countWords(content),
    content,
  }
}

/**
 * Newest first.
 *
 * Drafts are visible in `next dev` so work in progress can be previewed, and
 * excluded from production builds so an unfinished article cannot ship by
 * accident. Flip `draft: false` in the frontmatter to publish.
 */
export function getAllArticles({ includeDrafts = process.env.NODE_ENV === 'development' } = {}) {
  return getArticleSlugs()
    .map(getArticleBySlug)
    .filter(Boolean)
    .filter((article) => includeDrafts || !article.draft)
    .sort(compareNewestFirst)
}

/**
 * Newest first.
 *
 * `number` wins when both articles carry one: the series position is the order
 * the argument is actually built in, and two pieces can share a publish date
 * (002 and 003 both went out on 21 August). Date then slug remain the fallback
 * so anything unnumbered still sorts stably rather than by read order.
 */
function compareNewestFirst(a, b) {
  if (a.number !== null && b.number !== null && a.number !== b.number) return b.number - a.number
  if (a.date !== b.date) return a.date < b.date ? 1 : -1
  return a.slug.localeCompare(b.slug)
}

/**
 * The articles either side of `slug` in reading order.
 *
 * `next` is the continuation of the argument, which carries the *higher* series
 * number and therefore sits *earlier* in the newest-first list. Both are null at
 * the ends of the series.
 */
export function getSeriesNeighbours(slug, options) {
  const articles = getAllArticles(options)
  const index = articles.findIndex((article) => article.slug === slug)
  if (index === -1) return { previous: null, next: null }

  return {
    next: articles[index - 1] ?? null,
    previous: articles[index + 1] ?? null,
  }
}
