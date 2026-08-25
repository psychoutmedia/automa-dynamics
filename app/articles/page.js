import Link from 'next/link'
import Image from 'next/image'
import { SplitText } from '../_components/Reveal'
import {
  getAllArticles,
  formatArticleDate,
  formatSeriesNumber,
  SERIES_NAME,
  SITE_URL,
} from '../../lib/articles'

export const metadata = {
  title: 'Articles',
  description:
    'Writing from Automa Dynamics on operational intelligence, enterprise ontology, and the limits of AI over company data.',
  alternates: { canonical: '/articles' },
  openGraph: {
    title: 'Articles | Automa Dynamics',
    description:
      'Writing from Automa Dynamics on operational intelligence, enterprise ontology, and the limits of AI over company data.',
    url: '/articles',
    type: 'website',
  },
}

/**
 * The series as an ordered list, so the sequence is legible to crawlers and not
 * just to a reader looking at the cover art.
 */
function seriesJsonLd(articles) {
  const inReadingOrder = [...articles].sort((a, b) => (a.number ?? 0) - (b.number ?? 0))

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWorkSeries',
    name: SERIES_NAME,
    url: `${SITE_URL}/articles`,
    inLanguage: 'en-GB',
    hasPart: inReadingOrder.map((article) => ({
      '@type': 'Article',
      position: article.number ?? undefined,
      headline: article.title,
      url: `${SITE_URL}/articles/${article.slug}`,
      datePublished: `${article.date}T00:00:00.000Z`,
    })),
  }
}

export default function ArticlesIndex() {
  const articles = getAllArticles()

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(seriesJsonLd(articles)) }}
      />
      <section className="section-padding pt-32 md:pt-40 pb-0">
        <div className="max-w-6xl mx-auto">
          <p className="type-label mb-8">Articles</p>
          <SplitText
            as="h1"
            text="Notes on Operational Intelligence"
            className="type-display text-chrome-light mb-10"
          />
          <p className="type-body type-measure">
            What it takes for software to understand an organisation well enough to be trusted with
            a decision. Published first on X, collected here. Numbered in the order the argument is
            built, newest first below.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-24 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          {articles.length === 0 ? (
            <div className="border-t border-white/10 py-16 text-center">
              <p className="text-chrome/65">No articles published yet.</p>
            </div>
          ) : (
            <div className="border-t border-white/10">
              {articles.map((article) => (
                <article key={article.slug} className="border-b border-white/10">
                  <Link href={`/articles/${article.slug}`} className="block group py-12 md:py-16">
                    {/* Cover art carries baked-in typography, so it is rendered at its
                        intrinsic ratio and never cropped. */}
                    {article.cover ? (
                      <div className="max-w-3xl overflow-hidden rounded-xl border border-white/10 mb-8 md:mb-10">
                        <Image
                          src={article.cover}
                          alt={article.coverAlt}
                          width={article.coverSize.width}
                          height={article.coverSize.height}
                          sizes="(max-width: 768px) 100vw, 768px"
                          className="w-full h-auto transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                          priority
                        />
                      </div>
                    ) : null}

                    <div className="max-w-3xl">
                      <p className="type-label mb-4">
                        {article.number !== null ? (
                          <>
                            <span className="font-mono text-steel-light">
                              {formatSeriesNumber(article.number)}
                            </span>
                            <span className="text-chrome/65"> / </span>
                          </>
                        ) : null}
                        <span className="text-chrome/65">{article.eyebrow}</span>
                      </p>
                      <h2 className="type-display-sm text-chrome-light mb-5 group-hover:text-white transition-colors">
                        {article.title}
                      </h2>
                      <p className="type-body type-measure mb-6">{article.description}</p>
                      <div className="flex items-center gap-4 font-mono text-xs text-chrome/65">
                        <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
                        <span aria-hidden="true">/</span>
                        <span>{article.readingTime} min read</span>
                        <span aria-hidden="true">/</span>
                        <span className="text-steel-light group-hover:text-chrome-light transition-colors">
                          Read
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            <a
              href="https://x.com/automadynamics"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center gap-2"
            >
              Follow @automadynamics
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
