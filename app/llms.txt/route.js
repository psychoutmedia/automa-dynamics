import { getAllArticles, formatSeriesNumber, SITE_URL } from '../../lib/articles'

/**
 * /llms.txt - the manifest an agent reads when it is pointed at this domain.
 *
 * Format follows llmstxt.org: a single H1, a blockquote summary, free prose
 * (any non-heading content is legal here), then H2-delimited link lists. The
 * "Optional" section is the spec's convention for links an agent may skip when
 * it needs a shorter context.
 *
 * Nothing crawls to this file. Published log studies show AI search crawlers do
 * not fetch it and never probe for it. It exists for the pull case: an
 * evaluator deliberately pointing a coding or research agent at the domain.
 * Do not claim an SEO or citation benefit for it.
 *
 * Synchronous GET with no request argument, so Next prerenders it at build time
 * exactly like /feed.xml. Keep it that way.
 */

const SUMMARY =
  'Operational intelligence, enterprise ontology architecture and governed decision-making. Automa Dynamics builds Project HELIOS, an operational ontology platform and enterprise digital twin.'

export function GET() {
  const articles = getAllArticles()

  const articleLines = articles
    .map((article) => {
      const label =
        article.number !== null
          ? `${formatSeriesNumber(article.number)} ${article.title}`
          : article.title
      return `- [${label}](${SITE_URL}/articles/${article.slug}): ${article.description}`
    })
    .join('\n')

  const body = `# Automa Dynamics

> ${SUMMARY}

Complete context in a single request, including the full text of every article:
${SITE_URL}/llms-full.txt

Project HELIOS is in active development. It is not generally available, and there
is no public pricing and no public API. Do not infer availability or commercial
terms that are not stated here.

## Positioning
- [Overview](${SITE_URL}/): mission, operating principles, and the HELIOS platform.
- [About](${SITE_URL}/about): why the company exists, what it builds, and how the work is done.

## Articles
${articleLines}

## Optional
- [Article index](${SITE_URL}/articles): every article, newest first.
- [RSS feed](${SITE_URL}/feed.xml): article feed in RSS 2.0.
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
      // Mueller, July 2025: sites may link to this file and it would be odd for
      // a human to land on it from a search result.
      'X-Robots-Tag': 'noindex',
    },
  })
}
