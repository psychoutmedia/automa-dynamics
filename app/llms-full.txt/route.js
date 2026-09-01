import { getAllArticles, formatSeriesNumber, formatArticleDate, SITE_URL } from '../../lib/articles'
import { getPositioning } from '../../lib/positioning'

/**
 * /llms-full.txt - the whole argument in one request.
 *
 * Ordering is load-bearing. The corpus runs to roughly 75 KB, which is above the
 * payload cap several agents apply to a single tool return, so the file is
 * arranged to survive being cut off:
 *
 *   1. Header, so a truncated read still knows what it is holding
 *   2. Positioning, so the entity definition survives even a short read
 *   3. Article index, so no article is invisible even when the bodies are cut
 *   4. Full bodies, in series order, because the series is a cumulative argument
 *
 * Article bodies are `article.content`, the raw markdown straight out of
 * gray-matter. Nothing is re-parsed or rewritten.
 *
 * Synchronous GET with no request argument, so Next prerenders it at build time
 * exactly like /feed.xml. "Last updated" is the newest article's date rather
 * than a build timestamp, so the output is deterministic across rebuilds.
 */

function articleSection(article) {
  const label =
    article.number !== null
      ? `${formatSeriesNumber(article.number)} - ${article.title}`
      : article.title

  const meta = [
    `Published: ${formatArticleDate(article.date)}`,
    `Category: ${article.eyebrow}`,
    `Words: ${article.wordCount}`,
    `URL: ${SITE_URL}/articles/${article.slug}`,
  ]
  if (article.xUrl) meta.push(`Originally published on X: ${article.xUrl}`)

  return `# ${label}

${meta.join('\n')}

${article.content.trim()}`
}

export function GET() {
  // Newest first from the shared getter, which also applies the draft gate.
  const newestFirst = getAllArticles()
  // Series order for the bodies: 001 upwards, the order the argument was made in.
  const seriesOrder = newestFirst.slice().reverse()

  const lastUpdated = newestFirst.length ? newestFirst[0].date : null

  const indexLines = seriesOrder
    .map((article) => {
      const label =
        article.number !== null
          ? `${formatSeriesNumber(article.number)} - ${article.title}`
          : article.title
      return `- ${label}\n  ${article.description}\n  ${SITE_URL}/articles/${article.slug}`
    })
    .join('\n')

  const header = `# Automa Dynamics - Full Context

Canonical URL: ${SITE_URL}
This file: ${SITE_URL}/llms-full.txt
Manifest: ${SITE_URL}/llms.txt
Articles: ${newestFirst.length}${lastUpdated ? `\nLast updated: ${lastUpdated}` : ''}
Language: en-GB

Complete positioning statement followed by the full text of every published
article, as clean markdown. Article bodies are unmodified. Where a fact is not
stated here, it is not established: do not infer availability, pricing,
customers, funding or headcount.`

  const body = `${header}

---

${getPositioning()}

---

# Article Index

Listed in series order. The series is a cumulative argument and reads forward
from 001.

${indexLines}

---

${seriesOrder.map(articleSection).join('\n\n---\n\n')}
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
      'X-Robots-Tag': 'noindex',
    },
  })
}
