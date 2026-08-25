import Link from 'next/link'
import { SITE_URL } from '../../lib/articles'
import { Reveal, RevealGroup, SplitText } from '../_components/Reveal'

const DESCRIPTION =
  'Why Automa Dynamics exists. Enterprise software can describe a company beautifully and still not understand it. We build the model first, and put reasoning on top of it.'

export const metadata = {
  title: 'About',
  description: DESCRIPTION,
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About | Automa Dynamics',
    description: DESCRIPTION,
    url: '/about',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | Automa Dynamics',
    description: DESCRIPTION,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Automa Dynamics',
  url: `${SITE_URL}/about`,
  inLanguage: 'en-GB',
  mainEntity: {
    '@type': 'Organization',
    name: 'Automa Dynamics',
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    description: DESCRIPTION,
    email: 'hello@automadynamics.com',
    sameAs: ['https://x.com/automadynamics'],
  },
}

/* Type scale lives in globals.css so every page shares it. */
const DISPLAY = 'type-display'
const LEAD = 'type-lead'
const BODY = 'type-body'
const LABEL = 'type-label'
const MEASURE = 'type-measure'
const SECTION = 'px-6 md:px-12 lg:px-24 py-20 md:py-28'
const SHELL = 'max-w-6xl mx-auto'

/** What we saw. The three observations the whole argument rests on. */
const observations = [
  {
    n: '01',
    title: 'Systems that hold records, not relationships',
    body: 'Every major platform inside an organisation records objects accurately. Orders, inventory, shipments, contracts, customers. Each record can be perfectly correct while the company still cannot answer what depends on what, because the meaning lives in the connections and nothing owns them.',
  },
  {
    n: '02',
    title: 'Language models mistaken for systems of record',
    body: 'Give a model access to everything and it becomes tempting to let it hold the truth as well as interpret it. That is an architectural mistake. A model is an extraordinary interpreter of operational reality. The reality itself needs firmer foundations.',
  },
  {
    n: '03',
    title: 'Explanations standing in for evidence',
    body: 'Machines have become fluent at justifying their conclusions. Fluency is not proof. When software recommends spending money, changing a supplier or missing a commitment, the question is not whether it can tell a good story, but whether the decision resolves to the facts that made it necessary.',
  },
]

/** How the work is done. Method is the only proof available before the product. */
const method = [
  {
    title: 'Governed, not improvised',
    body: 'HELIOS is built against a written engineering specification that predates the code. It defines the ontology, the architecture, the security model and the acceptance criteria before implementation begins.',
  },
  {
    title: 'Evidence at every gate',
    body: 'No phase closes because the code exists. It closes when its acceptance criteria are met, its tests pass, its documentation is current and the decision is recorded in a board review that remains readable afterwards.',
  },
  {
    title: 'Determinism by default',
    body: 'Generation, fixtures, impact analysis and demonstrations run from fixed seeds. A result that cannot be reproduced is not a result.',
  },
  {
    title: 'The programme explains itself',
    body: 'Requirements, code, tests, architecture decisions and evidence are linked through stable identifiers, so any conclusion about the system can be traced the same way the system traces conclusions about an operation.',
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Why we're here. Given a full screen: the belief gets to stand alone. */}
      <section className="px-6 md:px-12 lg:px-24 pt-32 md:pt-44 pb-20 md:pb-28">
        <RevealGroup className={SHELL} stagger={0.12}>
          <Reveal>
            <p className={`${LABEL} mb-6`}>About</p>
          </Reveal>
          <SplitText
            as="h1"
            text="Why we’re here"
            className={`${DISPLAY} mb-10 max-w-[16ch]`}
          />
          <Reveal>
            <p className={`${LEAD} ${MEASURE} mb-8`}>
              We believe software should be able to tell an organisation the truth about itself.
            </p>
          </Reveal>
          <Reveal>
            <p className={`${BODY} ${MEASURE}`}>
              Not summarise it. Not describe it persuasively. Tell it what is actually true right
              now, what a change will reach, what it will cost, and who is permitted to decide what
              happens next.
            </p>
          </Reveal>
        </RevealGroup>
      </section>

      {/* Origin. What was broken, and therefore why this exists. */}
      <section className={`${SECTION} border-t border-white/5`}>
        <div className={SHELL}>
          <RevealGroup>
            <Reveal>
              <p className={`${LABEL} mb-6`}>Origin</p>
            </Reveal>
            <SplitText
              text="What we saw in 2026"
              className={`${DISPLAY} mb-10 max-w-[14ch]`}
            />
            <Reveal>
              <p className={`${BODY} ${MEASURE} mb-6`}>
                Artificial intelligence had become extraordinarily good at talking about companies.
                It could search their documents, summarise their quarters, explain their policies
                and draft their reports. Increasingly it could use tools and take actions.
              </p>
            </Reveal>
            <Reveal>
              <p className={`${LEAD} ${MEASURE}`}>
                And organisations holding more information than at any point in their history still
                could not reliably answer a question as ordinary as: this shipment is late, what
                does it break?
              </p>
            </Reveal>
          </RevealGroup>

          <RevealGroup className="mt-16 md:mt-20 space-y-12 md:space-y-14" stagger={0.12}>
            {observations.map((observation) => (
              <Reveal key={observation.n}>
                <div className="md:grid md:grid-cols-[5rem_1fr] md:gap-8">
                  <div className="font-mono text-sm text-steel-light mb-4 md:mb-0 md:pt-1">
                    {observation.n}
                  </div>
                  <div className={MEASURE}>
                    <h3 className="text-[1.5rem] font-normal leading-snug text-chrome-light mb-4 tracking-[-0.01em]">
                      {observation.title}
                    </h3>
                    <p className={BODY}>{observation.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </RevealGroup>

          <RevealGroup className="mt-16 md:mt-20">
            <Reveal>
              <p className={`${BODY} ${MEASURE} mb-6`}>
                None of that is an intelligence problem. The models are capable. The gap is that
                nothing in the stack holds an authoritative model of the business itself, so every
                system reasons over fragments and hopes the fragments agree.
              </p>
            </Reveal>
            <Reveal>
              <p className={`${LEAD} ${MEASURE}`}>
                We saw a need for the model to come first, and for the reasoning to sit on top of
                it. That is why Automa Dynamics exists.
              </p>
            </Reveal>
          </RevealGroup>
        </div>
      </section>

      {/* What we build */}
      <section className={`${SECTION} border-t border-white/5`}>
        <div className={SHELL}>
          <RevealGroup>
            <Reveal>
              <p className={`${LABEL} mb-6`}>What we build</p>
            </Reveal>
            <SplitText
              text="An organisation as a living system"
              className={`${DISPLAY} mb-10 max-w-[14ch]`}
            />
            <Reveal>
              <p className={`${BODY} ${MEASURE} mb-6`}>
                A company is not a hierarchy. Operationally it is a graph. A customer depends on an
                order, an order on production, production on materials and capacity and time,
                materials on suppliers and inventory and transport. The company keeps working
                because those dependencies keep holding, and serious problems begin when one of them
                stops.
              </p>
            </Reveal>
            <Reveal>
              <p className={`${BODY} ${MEASURE}`}>
                Project HELIOS is our attempt to hold that graph properly: an operational ontology
                platform and enterprise digital twin that carries the canonical model of an
                operation, traces the consequences of change through it, and governs the decisions
                taken in response. The question every part of it has to answer is whether it
                increases the ability to observe, understand, decide or act.
              </p>
            </Reveal>
          </RevealGroup>

          <RevealGroup className="mt-14 md:mt-20">
            <Reveal>
              <div className="card-glass p-8 md:p-10 max-w-[42rem]">
                <div className="font-mono text-xs text-chrome/65 mb-6 tracking-wide">
                  {'// The scenario it is built to answer'}
                </div>
                <p className={BODY}>
                  A shipment carrying critical component batches is disrupted. The system identifies
                  every dependent production commitment, customer order, contractual deadline and
                  pound of financial exposure. It proposes feasible responses. It names who is
                  permitted to approve them. It records the decision with the evidence that produced
                  it, in a form that can still be reconstructed a year later.
                </p>
              </div>
            </Reveal>
          </RevealGroup>
        </div>
      </section>

      {/* How we work */}
      <section className={`${SECTION} border-t border-white/5`}>
        <div className={SHELL}>
          <RevealGroup>
            <Reveal>
              <p className={`${LABEL} mb-6`}>How we work</p>
            </Reveal>
            <SplitText
              text="Built under the rules it argues for"
              className={`${DISPLAY} mb-10 max-w-[14ch]`}
            />
            <Reveal>
              <p className={`${LEAD} ${MEASURE}`}>
                It would be difficult to argue that operational decisions need evidence,
                traceability and explicit authority while building the software that makes that
                argument any other way.
              </p>
            </Reveal>
          </RevealGroup>

          <RevealGroup
            className="mt-14 md:mt-20 grid md:grid-cols-2 gap-x-16 gap-y-12 max-w-[52rem]"
            stagger={0.1}
          >
            {method.map((item) => (
              <Reveal key={item.title}>
                <h3 className="text-[1.25rem] font-normal leading-snug text-chrome-light mb-4 tracking-[-0.01em]">
                  {item.title}
                </h3>
                <p className={BODY}>{item.body}</p>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Where we're going, and the honest part. */}
      <section className={`${SECTION} border-t border-white/5`}>
        <div className={SHELL}>
          <RevealGroup>
            <Reveal>
              <p className={`${LABEL} mb-6`}>Where we&rsquo;re going</p>
            </Reveal>
            <SplitText
              text="The argument comes first"
              className={`${DISPLAY} mb-10 max-w-[12ch]`}
            />
            <Reveal>
              <p className={`${BODY} ${MEASURE} mb-6`}>
                HELIOS is in active development and is not finished. We are publishing the reasoning
                behind it while it is being built rather than waiting to present a completed product
                with a story attached afterwards.
              </p>
            </Reveal>
            <Reveal>
              <p className={`${BODY} ${MEASURE} mb-10`}>
                That order is deliberate. A position that has been written down in public can be
                examined, disagreed with and held to account. Anyone can eventually demonstrate
                software. Far fewer will show you the argument it rests on before it exists, when
                the argument is still capable of being wrong.
              </p>
            </Reveal>
            <Reveal>
              <p className={`${LEAD} ${MEASURE} mb-10`}>
                If the thinking does not stand up, the product built on it will not either. So the
                thinking goes out first.
              </p>
            </Reveal>
            <Reveal>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/articles" className="btn-primary inline-flex items-center gap-2">
                  Read the argument
                  <span aria-hidden="true">&rarr;</span>
                </Link>
                <Link href="/#platform" className="btn-secondary">
                  Project HELIOS
                </Link>
              </div>
            </Reveal>
          </RevealGroup>
        </div>
      </section>
    </main>
  )
}
