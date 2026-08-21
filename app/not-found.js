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
          <p className="text-chrome/65 text-sm tracking-[0.2em] uppercase mb-4">Error 404</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            This page <span className="text-gradient">does not exist</span>
          </h1>
          <p className="text-chrome/70 text-lg leading-relaxed mb-10 max-w-xl">
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
