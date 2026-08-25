import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import {
  getArticleBySlug,
  getAllArticles,
  getSeriesNeighbours,
  formatArticleDate,
  formatSeriesNumber,
  SERIES_NAME,
  SITE_URL,
} from '../../../lib/articles'

export function generateStaticParams() {
  // Drafts are excluded in production, so no unpublished route is prerendered.
  return getAllArticles().map((article) => ({ slug: article.slug }))
}

function isVisible(article) {
  return Boolean(article) && (!article.draft || process.env.NODE_ENV === 'development')
}

export function generateMetadata({ params }) {
  const article = getArticleBySlug(params.slug)
  if (!isVisible(article)) return {}

  const url = `/articles/${article.slug}`
  const images = article.cover ? [{ url: article.cover, alt: article.coverAlt }] : undefined

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      type: 'article',
      publishedTime: `${article.date}T00:00:00.000Z`,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: article.cover ? [article.cover] : undefined,
    },
  }
}

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
  },
}

const PUBLISHER = {
  '@type': 'Organization',
  name: 'Automa Dynamics',
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
}

/**
 * schema.org `Article`, so the writing is machine-readable as a citable source
 * rather than only as page text. `isPartOf` plus `position` express the series
 * that until now existed solely as baked pixels in the cover art.
 */
function articleJsonLd(article) {
  const url = `${SITE_URL}/articles/${article.slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished: `${article.date}T00:00:00.000Z`,
    dateModified: `${article.date}T00:00:00.000Z`,
    inLanguage: 'en-GB',
    articleSection: article.eyebrow,
    wordCount: article.wordCount,
    image: article.cover ? [`${SITE_URL}${article.cover}`] : undefined,
    author: PUBLISHER,
    publisher: PUBLISHER,
    isPartOf: {
      '@type': 'CreativeWorkSeries',
      name: SERIES_NAME,
      url: `${SITE_URL}/articles`,
    },
    position: article.number ?? undefined,
  }
}

/** One end of the series navigation. `next` continues the argument. */
function SeriesLink({ article, direction }) {
  const isNext = direction === 'next'

  return (
    <Link
      href={`/articles/${article.slug}`}
      className={`group block rounded-xl border border-white/10 p-5 transition-colors hover:border-white/25 hover:bg-wayland-900/40 ${
        isNext ? 'sm:col-start-2 sm:text-right' : ''
      }`}
    >
      <p className="text-chrome/65 text-xs tracking-[0.2em] uppercase mb-3">
        {isNext ? 'Next in the series' : 'Earlier in the series'}
      </p>
      {article.number !== null ? (
        <p className="font-mono text-xs text-steel-light mb-2">
          {formatSeriesNumber(article.number)}
        </p>
      ) : null}
      <p className="text-chrome-light leading-snug transition-colors group-hover:text-white">
        {article.title}
      </p>
    </Link>
  )
}

export default function ArticlePage({ params }) {
  const article = getArticleBySlug(params.slug)
  if (!isVisible(article)) notFound()

  const { previous, next } = getSeriesNeighbours(params.slug)

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(article)) }}
      />
      <article className="px-6 md:px-12 lg:px-24 pt-32 md:pt-40 pb-24">
        <div className="max-w-[720px] mx-auto">
          <Link
            href="/articles"
            className="inline-block text-chrome/65 hover:text-chrome-light text-sm mb-10 transition-colors"
          >
            &larr; All articles
          </Link>

          <header className="mb-10">
            {/* The cover art reads "Operational Intelligence / Article 004". The
                series position belongs in the markup too, not only in pixels. */}
            <p className="text-xs tracking-[0.2em] uppercase mb-4">
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
            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 font-mono text-xs text-chrome/65 pb-8 border-b border-white/10">
              <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
              <span aria-hidden="true">/</span>
              <span>{article.readingTime} min read</span>
            </div>
          </header>

          {/* Rendered at its intrinsic ratio so baked-in cover typography is never
              cropped, and wider than the prose measure so it carries some weight. */}
        </div>

        {article.cover ? (
          <div className="max-w-[720px] mx-auto mb-12">
            <div className="overflow-hidden rounded-xl border border-white/10">
              <Image
                src={article.cover}
                alt={article.coverAlt}
                width={article.coverSize.width}
                height={article.coverSize.height}
                sizes="(max-width: 720px) 100vw, 720px"
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        ) : null}

        <div className="max-w-[720px] mx-auto">

          <div className="prose prose-automa prose-lg">
            <MDXRemote source={article.content} options={mdxOptions} />
          </div>

          {article.xUrl || next || previous ? (
            <footer className="mt-16 pt-10 border-t border-white/10 space-y-10">
              {article.xUrl ? (
                <a
                  href={article.xUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-chrome/70 hover:text-chrome-light transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span>Originally published on X</span>
                  <span aria-hidden="true">&rarr;</span>
                </a>
              ) : null}

              {/* The argument runs 001 -> 004, so a reader who finishes one piece
                  should be able to continue without going back via the index. */}
              {next || previous ? (
                <nav aria-label="Series navigation" className="grid gap-4 sm:grid-cols-2">
                  {previous ? <SeriesLink article={previous} direction="previous" /> : null}
                  {next ? <SeriesLink article={next} direction="next" /> : null}
                </nav>
              ) : null}
            </footer>
          ) : null}
        </div>
      </article>
    </main>
  )
}
