import Link from 'next/link'

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center">
      <section className="section-padding w-full">
        <div className="max-w-3xl mx-auto">
          <p className="type-label mb-8">Error 404</p>
          <h1 className="type-display text-chrome-light mb-10">This page does not exist</h1>
          <p className="type-body type-measure mb-10">
            The address may have changed, or the page may never have existed. Neither is a good
            reason to leave you without a next step.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/" className="btn-primary inline-flex items-center gap-2">
              Return home
            </Link>
            <Link href="/articles" className="btn-secondary">
              Read the articles
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
