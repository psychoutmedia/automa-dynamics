import HomeHero from './_components/HomeHero'
import LatestArticles from './_components/LatestArticles'

const principles = [
  { verb: 'Observe', line: 'Canonical operational state, derived from source records rather than assembled by hand.' },
  { verb: 'Understand', line: 'Consequence traced through the model to the orders, deadlines and exposure it reaches.' },
  { verb: 'Decide', line: 'Response options that carry their cost, their assumptions and their evidence.' },
  { verb: 'Act', line: 'Authorised action, recorded with who decided, on what basis, and what changed.' },
]

const capabilities = [
  {
    n: '01',
    title: 'Operational State',
    description:
      'Suppliers, components, batches, shipments, production and customer commitments modelled as one connected system with stable identity.',
  },
  {
    n: '02',
    title: 'Consequence Tracing',
    description:
      'Follow a disruption through the model to the production orders, contractual deadlines and financial exposure it actually touches.',
  },
  {
    n: '03',
    title: 'Governed Decisions',
    description:
      'Every response option states its cost, its assumptions, its residual risk and the authority required to approve it.',
  },
  {
    n: '04',
    title: 'Complete Evidence',
    description:
      'Conclusions resolve to the records, relationships and rules that produced them. Decisions remain reconstructable after the fact.',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen">
      <HomeHero />

      {/* Operating principles. Replaces the previous statistics strip, whose
          figures were invented placeholders. */}
      <section className="py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {principles.map((principle, i) => (
              <div
                key={principle.verb}
                className="animate-in text-center md:text-left"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-2xl md:text-3xl font-bold text-gradient mb-3 font-mono uppercase tracking-tight">
                  {principle.verb}
                </div>
                <p className="text-sm text-chrome/65 leading-relaxed">{principle.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section id="mission" className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-chrome/65 text-sm tracking-[0.2em] uppercase mb-4">Our Mission</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Modelling the organisation as a <span className="text-gradient">living system</span>
              </h2>
              <p className="text-chrome/70 text-lg leading-relaxed mb-6">
                Most enterprise software can tell you what a document says. Very little of it can
                tell you what a delayed shipment costs, which commitments it breaks, or who is
                permitted to decide what happens next. The gap is not intelligence. It is that
                nothing in the stack holds an authoritative model of the business itself.
              </p>
              <p className="text-chrome/70 text-lg leading-relaxed">
                We build that model first, and put reasoning on top of it. Dependencies become
                visible, consequences become traceable, decisions become governable, and actions
                leave evidence behind them.
              </p>
            </div>
            <div className="relative">
              <div className="card-glass p-8">
                <div className="font-mono text-sm text-chrome/65 mb-4">{'// Core Principles'}</div>
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-steel-light">01.</span>
                    <span className="text-chrome-light">Ontology Before AI</span>
                  </div>
                  <div className="pl-8 text-chrome/70">
                    Models explain and invoke. They do not replace domain logic
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-steel-light">02.</span>
                    <span className="text-chrome-light">Evidence Before Assertion</span>
                  </div>
                  <div className="pl-8 text-chrome/70">
                    Every conclusion traces to records, relationships and rules
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-steel-light">03.</span>
                    <span className="text-chrome-light">Human Authority Is Explicit</span>
                  </div>
                  <div className="pl-8 text-chrome/70">
                    The system recommends. Authorised people decide
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-steel-light">04.</span>
                    <span className="text-chrome-light">One Coherent Model</span>
                  </div>
                  <div className="pl-8 text-chrome/70">
                    Object identity stays stable across the whole system
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform */}
      <section id="platform" className="section-padding bg-wayland-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-chrome/65 text-sm tracking-[0.2em] uppercase mb-4">Platform</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Project <span className="text-gradient">HELIOS</span>
            </h2>
            <p className="text-chrome/70 text-lg max-w-2xl mx-auto">
              An operational ontology platform and enterprise digital twin. HELIOS holds the
              canonical model of an operation, traces the consequences of change through it, and
              governs the decisions taken in response. In active development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((capability, i) => (
              <div
                key={capability.title}
                className="card-glass p-6 hover:bg-wayland-800/50 transition-colors duration-300 animate-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="font-mono text-sm text-steel-light mb-4">{capability.n}</div>
                <h3 className="text-xl font-semibold text-chrome-light mb-2">{capability.title}</h3>
                <p className="text-chrome/70 text-sm leading-relaxed">{capability.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LatestArticles />

      {/* Contact */}
      <section id="contact" className="section-padding bg-wayland-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-chrome/65 text-sm tracking-[0.2em] uppercase mb-4">Contact</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Start a <span className="text-gradient">Conversation</span>
          </h2>
          <p className="text-chrome/70 text-lg mb-12">
            If you are working on operational truth, enterprise ontology, or governed
            decision-making, we want to hear from you.
          </p>

          <div className="card-glass p-8 max-w-md mx-auto">
            <div className="space-y-4">
              <a
                href="mailto:hello@automadynamics.com"
                className="flex items-center justify-center gap-3 p-4 bg-wayland-800/50 rounded-lg hover:bg-wayland-800 transition-colors"
              >
                <svg className="w-5 h-5 text-chrome/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-chrome-light">hello@automadynamics.com</span>
              </a>
              <a
                href="https://x.com/automadynamics"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 p-4 bg-wayland-800/50 rounded-lg hover:bg-wayland-800 transition-colors"
              >
                <svg className="w-5 h-5 text-chrome/70" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span className="text-chrome-light">@automadynamics</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
