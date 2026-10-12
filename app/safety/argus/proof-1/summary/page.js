import { SITE_URL } from '../../../../../lib/articles'
import ArgusCaseCard from '../../../../_components/ArgusCaseCard'
import ArgusUpdate from '../../../../_components/ArgusUpdate'

/* One shareable screen for ARGUS Proof-1, the twin of the Proof-2 summary: the
   case card, the Proof-1.1 update, and the ways in. The graph itself stays at
   /safety/argus/proof-1 (a static page served by a rewrite in next.config.js). */

const GRAPH = '/safety/argus/proof-1'
const PATH = `${GRAPH}/summary`
const DESCRIPTION =
  'ARGUS Proof-1 at a glance: the GPT-6 Astra cybersecurity release claim, ARGUS’s register note on it, the reconstruction conclusion and the shape of the case, with the 9 October 2026 update. Assurance gaps, not findings that safeguards failed.'

export const metadata = {
  title: 'ARGUS Proof-1 case summary: GPT-6 Astra',
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    title: 'ARGUS Proof-1 case summary: GPT-6 Astra',
    description: DESCRIPTION,
    url: PATH,
    type: 'article',
    images: [
      {
        url: '/safety/argus/executive-graph.png',
        width: 1551,
        height: 1099,
        alt: 'ARGUS Proof-1 executive assurance graph for GPT-6 Astra',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ARGUS Proof-1 case summary: GPT-6 Astra',
    description: DESCRIPTION,
    images: ['/safety/argus/executive-graph.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'ARGUS Proof-1 case summary: GPT-6 Astra',
  url: `${SITE_URL}${PATH}`,
  inLanguage: 'en-GB',
  description: DESCRIPTION,
  publisher: { '@type': 'Organization', name: 'Automa Dynamics', url: SITE_URL },
  isPartOf: { '@type': 'WebPage', name: 'ARGUS', url: `${SITE_URL}/safety/argus` },
}

const VIOLET_LINK = 'text-[#a78bfa] hover:text-[#c4b5fd] underline-offset-4 hover:underline transition-colors'

export default function ArgusP1Summary() {
  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="px-6 md:px-12 lg:px-24 pt-28 md:pt-36 pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-xs tracking-[0.08em] text-chrome/65">
              <li>
                <a href="/safety/argus" className="hover:text-chrome-light transition-colors">
                  ARGUS
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <a href="/safety/argus#proof-1" className="hover:text-chrome-light transition-colors">
                  Proof-1 &middot; GPT-6 Astra
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-chrome-light">
                Case summary
              </li>
            </ol>
          </nav>

          <p className="type-label mb-6">ARGUS Proof-1 &middot; Case summary</p>
          <h1 className="type-display-sm mb-4 max-w-[24ch]">GPT-6 Astra: the case at a glance</h1>
          <p className="font-mono text-xs md:text-sm tracking-[0.12em] text-[#d9b45e] mb-10">
            OPENAI &middot; CYBERSECURITY &middot; EVIDENCE CUTOFF 3 SEPTEMBER 2026 &middot; EXTERNAL
            REVIEW OPEN
          </p>

          <ArgusCaseCard proof="p1" className="mb-10" />

          <div className="flex flex-col sm:flex-row gap-4 mb-14">
            <a
              href={`${GRAPH}#exec`}
              className="btn-primary inline-flex items-center justify-center gap-2 !px-5 sm:!px-8"
            >
              Open the assurance graph <span aria-hidden="true">&rarr;</span>
            </a>
            <a href="/safety/argus#proof-1" className="btn-secondary text-center">
              Read the Proof-1 summary
            </a>
            <a
              href="mailto:hello@automadynamics.com?subject=ARGUS%20Proof-1%20review"
              className="btn-secondary text-center"
            >
              Send review feedback
            </a>
          </div>

          <ArgusUpdate className="mb-12" />

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-4 max-w-[60rem]">
            <p className="text-sm leading-relaxed text-chrome/65">
              Technically complete 5 October 2026, updated 9 October 2026. External review is open:
              criticism of the representation is specifically invited.
            </p>
            <p className="text-sm leading-relaxed text-chrome/65">
              Independent research by Automa Dynamics. Not affiliated with, commissioned by, or
              endorsed by OpenAI, and not a certification that GPT-6 Astra is safe or unsafe.{' '}
              <a className={VIOLET_LINK} href="/safety/argus">
                About ARGUS
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
