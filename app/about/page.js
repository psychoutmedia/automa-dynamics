import Link from 'next/link'
import { SITE_URL } from '../../lib/articles'

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

      {/* Why we're here */}
      <section className="section-padding pt-32 md:pt-40">
        <div className="max-w-3xl mx-auto">
          <p className="text-chrome/65 text-sm tracking-[0.2em] uppercase mb-4">About</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-8">
            Why we&rsquo;re <span className="text-gradient">here</span>
          </h1>
          <p className="text-chrome-light text-xl md:text-2xl leading-relaxed mb-8">
            We believe software should be able to tell an organisation the truth about itself.
          </p>
          <p className="text-chrome/70 text-lg leading-relaxed">
            Not summarise it. Not describe it persuasively. Tell it what is actually true right now,
            what a change will reach, what it will cost, and who is permitted to decide what happens
            next.
          </p>
        </div>
      </section>

      {/* Origin. What was broken, and therefore why this exists. */}
      <section className="section-padding border-y border-white/5 bg-wayland-900/30">
        <div className="max-w-3xl mx-auto">
          <p className="text-chrome/65 text-sm tracking-[0.2em] uppercase mb-4">Origin</p>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-8">
            What we saw in <span className="text-gradient">2026</span>
          </h2>

          <p className="text-chrome/70 text-lg leading-relaxed mb-6">
            Artificial intelligence had become extraordinarily good at talking about companies. It
            could search their documents, summarise their quarters, explain their policies and draft
            their reports. Increasingly it could use tools and take actions.
          </p>
          <p className="text-chrome/70 text-lg leading-relaxed mb-12">
            And organisations holding more information than at any point in their history still
            could not reliably answer a question as ordinary as: this shipment is late, what does it
            break?
          </p>

          <div className="space-y-10 mb-12">
            {observations.map((observation) => (
              <div key={observation.n} className="border-l border-white/10 pl-6">
                <div className="font-mono text-sm text-steel-light mb-2">{observation.n}</div>
                <h3 className="text-xl font-semibold text-chrome-light mb-3 leading-snug">
                  {observation.title}
                </h3>
                <p className="text-chrome/70 leading-relaxed">{observation.body}</p>
              </div>
            ))}
          </div>

          <p className="text-chrome/70 text-lg leading-relaxed mb-6">
            None of that is an intelligence problem. The models are capable. The gap is that nothing
            in the stack holds an authoritative model of the business itself, so every system reasons
            over fragments and hopes the fragments agree.
          </p>
          <p className="text-chrome-light text-lg leading-relaxed">
            We saw a need for the model to come first, and for the reasoning to sit on top of it.
            That is why Automa Dynamics exists.
          </p>
        </div>
      </section>

      {/* What we build */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto">
          <p className="text-chrome/65 text-sm tracking-[0.2em] uppercase mb-4">What we build</p>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-8">
            An organisation as a <span className="text-gradient">living system</span>
          </h2>

          <p className="text-chrome/70 text-lg leading-relaxed mb-6">
            A company is not a hierarchy. Operationally it is a graph. A customer depends on an
            order, an order on production, production on materials and capacity and time, materials
            on suppliers and inventory and transport. The company keeps working because those
            dependencies keep holding, and serious problems begin when one of them stops.
          </p>
          <p className="text-chrome/70 text-lg leading-relaxed mb-12">
            Project HELIOS is our attempt to hold that graph properly: an operational ontology
            platform and enterprise digital twin that carries the canonical model of an operation,
            traces the consequences of change through it, and governs the decisions taken in
            response. The question every part of it has to answer is whether it increases the
            ability to observe, understand, decide or act.
          </p>

          <div className="card-glass p-8">
            <div className="font-mono text-sm text-chrome/65 mb-4">{'// The scenario it is built to answer'}</div>
            <p className="text-chrome/70 leading-relaxed">
              A shipment carrying critical component batches is disrupted. The system identifies
              every dependent production commitment, customer order, contractual deadline and pound
              of financial exposure. It proposes feasible responses. It names who is permitted to
              approve them. It records the decision with the evidence that produced it, in a form
              that can still be reconstructed a year later.
            </p>
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="section-padding border-y border-white/5 bg-wayland-900/30">
        <div className="max-w-3xl mx-auto">
          <p className="text-chrome/65 text-sm tracking-[0.2em] uppercase mb-4">How we work</p>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-8">
            Built under the rules it <span className="text-gradient">argues for</span>
          </h2>

          <p className="text-chrome/70 text-lg leading-relaxed mb-12">
            It would be difficult to argue that operational decisions need evidence, traceability and
            explicit authority while building the software that makes that argument any other way.
            HELIOS is developed as a governed engineering programme.
          </p>

          <div className="grid sm:grid-cols-2 gap-8">
            {method.map((item) => (
              <div key={item.title}>
                <h3 className="text-lg font-semibold text-chrome-light mb-3 leading-snug">
                  {item.title}
                </h3>
                <p className="text-chrome/70 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where we're going, and the honest part. */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto">
          <p className="text-chrome/65 text-sm tracking-[0.2em] uppercase mb-4">Where we&rsquo;re going</p>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-8">
            The argument comes <span className="text-gradient">first</span>
          </h2>

          <p className="text-chrome/70 text-lg leading-relaxed mb-6">
            HELIOS is in active development and is not finished. We are publishing the reasoning
            behind it while it is being built rather than waiting to present a completed product with
            a story attached afterwards.
          </p>
          <p className="text-chrome/70 text-lg leading-relaxed mb-6">
            That order is deliberate. A position that has been written down in public can be
            examined, disagreed with and held to account. Anyone can eventually demonstrate software.
            Far fewer will show you the argument it rests on before it exists, when the argument is
            still capable of being wrong.
          </p>
          <p className="text-chrome-light text-lg leading-relaxed mb-12">
            If the thinking does not stand up, the product built on it will not either. So the
            thinking goes out first.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/articles" className="btn-primary inline-flex items-center gap-2">
              Read the argument
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link href="/#platform" className="btn-secondary">
              Project HELIOS
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
