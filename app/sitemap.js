import { getAllArticles } from '../lib/articles'

const BASE_URL = 'https://www.automadynamics.com'

export default function sitemap() {
  const articles = getAllArticles().map((article) => ({
    url: `${BASE_URL}/articles/${article.slug}`,
    lastModified: new Date(`${article.date}T00:00:00.000Z`),
    changeFrequency: 'yearly',
    priority: 0.7,
  }))

  return [
    { url: BASE_URL, changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/articles`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/safety/argus`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/safety/argus/proof-1`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/safety/argus/proof-1/summary`, lastModified: new Date('2026-10-12T00:00:00.000Z'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/safety/argus/claude-opus-5-5`, lastModified: new Date('2026-10-12T00:00:00.000Z'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/safety/argus/claude-opus-5-5/explore`, lastModified: new Date('2026-10-12T00:00:00.000Z'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/safety/argus/claude-opus-5-5/summary`, lastModified: new Date('2026-10-12T00:00:00.000Z'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/safety/argus/claude-opus-5-5/branches`, lastModified: new Date('2026-10-12T00:00:00.000Z'), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/safety/argus/gemini-4-argon`, lastModified: new Date('2026-10-14T00:00:00.000Z'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/safety/argus/gemini-4-argon/explore`, lastModified: new Date('2026-10-14T00:00:00.000Z'), changeFrequency: 'monthly', priority: 0.6 },
    ...articles,
  ]
}
