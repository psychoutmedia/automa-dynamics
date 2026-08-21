import Link from 'next/link'
import Image from 'next/image'
import { getAllArticles, formatArticleDate } from '../../lib/articles'

const MAX = 2

export default function LatestArticles() {
  const articles = getAllArticles().slice(0, MAX)
  if (articles.length === 0) return null

  return (
    <section className="section-padding">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-chrome/65 text-sm tracking-[0.2em] uppercase mb-4">Writing</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The <span className="text-gradient">argument</span>, in full
          </h2>
          <p className="text-chrome/70 text-lg max-w-2xl mx-auto">
            What it takes for software to understand an organisation well enough to be trusted with
            a decision.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group block"
            >
              {article.cover ? (
                <div className="overflow-hidden rounded-xl border border-white/10 mb-6">
                  <Image
                    src={article.cover}
                    alt={article.coverAlt}
                    width={article.coverSize.width}
                    height={article.coverSize.height}
                    sizes="(max-width: 768px) 100vw, 480px"
                    className="w-full h-auto transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                </div>
              ) : null}
              <p className="text-chrome/65 text-xs tracking-[0.2em] uppercase mb-3">
                {article.eyebrow}
              </p>
              <h3 className="text-2xl font-semibold text-chrome-light mb-3 leading-tight group-hover:text-white transition-colors">
                {article.title}
              </h3>
              <p className="text-chrome/70 leading-relaxed mb-4">{article.description}</p>
              <div className="flex items-center gap-4 font-mono text-xs text-chrome/65">
                <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
                <span aria-hidden="true">/</span>
                <span>{article.readingTime} min read</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/articles" className="btn-secondary">
            All articles
          </Link>
        </div>
      </div>
    </section>
  )
}
