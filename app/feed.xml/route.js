import { getAllArticles, formatArticleDate } from '../../lib/articles'

const BASE_URL = 'https://www.automadynamics.com'
const TITLE = 'Automa Dynamics'
const DESCRIPTION =
  'Writing from Automa Dynamics on operational intelligence, enterprise ontology, and the limits of AI over company data.'

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toRfc822(isoDate) {
  return new Date(`${isoDate}T00:00:00.000Z`).toUTCString()
}

export function GET() {
  const articles = getAllArticles()
  const lastBuild = articles.length ? toRfc822(articles[0].date) : new Date().toUTCString()

  const items = articles
    .map((article) => {
      const url = `${BASE_URL}/articles/${article.slug}`
      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${toRfc822(article.date)}</pubDate>
      <description>${escapeXml(article.description)}</description>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(TITLE)}</title>
    <link>${BASE_URL}</link>
    <description>${escapeXml(DESCRIPTION)}</description>
    <language>en-GB</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
