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
    ...articles,
  ]
}
