import { SITE_URL } from '../../../../../lib/articles'
import ArgusCaseCard from '../../../../_components/ArgusCaseCard'

/* One shareable screen: the ARGUS Proof-2 case card, its status, and the three
   ways in (findings, full-screen graph, branch reader). */

const BASE_PATH = '/safety/argus/claude-opus-5-5'
const PATH = `${BASE_PATH}/summary`
const DESCRIPTION =
  'ARGUS Proof-2 at a glance: Anthropic’s Claude Opus 5.5 cyber-safeguard claim in its own words, what ARGUS scoped it to, the reconstruction finding, and the shape of the case. Eight open public-assurance gaps; not findings that safeguards failed.'

export const metadata = {
  title: 'ARGUS Proof-2 case summary: Claude Opus 5.5',
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    title: 'ARGUS Proof-2 case summary: Claude Opus 5.5',
    description: DESCRIPTION,
    url: PATH,
    type: 'article',
    images: [
      {
        url: `${BASE_PATH}/executive-graph.png`,
        width: 1597,
        height: 928,
        alt: 'ARGUS Proof-2 executive assurance graph for Claude Opus 5.5',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ARGUS Proof-2 case summary: Claude Opus 5.5',
    description: DESCRIPTION,
    images: [`${BASE_PATH}/executive-graph.png`],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'ARGUS Proof-2 case summary: Claude Opus 5.5',
  url: `${SITE_URL}${PATH}`,
  inLanguage: 'en-GB',
  description: DESCRIPTION,
  publisher: { '@type': 'Organization', name: 'Automa Dynamics', url: SITE_URL },
  isPartOf: { '@type': 'WebPage', name: 'ARGUS', url: `${SITE_URL}/safety/argus` },
}

const VIOLET_LINK = 'text-[#a78bfa] hover:text-[#c4b5fd] underline-offset-4 hover:underline transition-colors'

export default function ArgusP2Summary() {
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
                <a href={BASE_PATH} className="hover:text-chrome-light transition-colors">
                  Proof-2 &middot; Claude Opus 5.5
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-chrome-light">
                Case summary
              </li>
            </ol>
          </nav>

          <p className="type-label mb-6">ARGUS Proof-2 &middot; Case summary</p>
          <h1 className="type-display-sm mb-4 max-w-[24ch]">Claude Opus 5.5: the case at a glance</h1>
          <p className="font-mono text-xs md:text-sm tracking-[0.12em] text-[#d9b45e] mb-10">
            ANTHROPIC &middot; CYBERSECURITY &middot; RELEASE BASELINE 22 SEPTEMBER 2026 &middot; NOT
            EXTERNALLY PEER REVIEWED
          </p>

          <ArgusCaseCard className="mb-10" />

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <a
              href={`${BASE_PATH}/explore#exec`}
              className="btn-primary inline-flex items-center justify-center gap-2 !px-5 sm:!px-8"
            >
              Open the assurance graph <span aria-hidden="true">&rarr;</span>
            </a>
            <a href={BASE_PATH} className="btn-secondary text-center">
              Read the findings
            </a>
            <a href={`${BASE_PATH}/branches`} className="btn-secondary text-center">
              Read it branch by branch
            </a>
          </div>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-4 max-w-[60rem]">
            <p className="text-sm leading-relaxed text-chrome/65">
              Research filed 11 October 2026. A targeted source-to-visual fidelity audit is complete
              and its presentation corrections are applied. Independent external peer review has not
              been completed.
            </p>
            <p className="text-sm leading-relaxed text-chrome/65">
              Independent research by Automa Dynamics. Not affiliated with, commissioned by, or
              endorsed by Anthropic, and not a certification that Claude Opus 5.5 is safe or unsafe.{' '}
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
