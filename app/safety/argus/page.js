import Image from 'next/image'
import { SITE_URL } from '../../../lib/articles'

/* Deliberately static. The site's scroll reveals start every block at
   opacity 0 and fade it in after hydration; on a page this dense that read as
   a second of blank screen followed by a wave across all the text. A research
   page meant for inspection should simply be there on first paint. These keep
   the same layout markup as the animated components, without the motion. */
function RevealGroup({ children, className }) {
  return <div className={className}>{children}</div>
}
function Reveal({ children, className }) {
  return <div className={className}>{children}</div>
}
function SplitText({ text, className, as: Tag = 'h2' }) {
  return <Tag className={className}>{text}</Tag>
}

const DESCRIPTION =
  'ARGUS reconstructs frontier AI safety claims as inspectable assurance cases. Proof-1 maps the public evidence behind GPT-6 Astra’s cybersecurity release claim, and where that evidence stops. External review open.'

export const metadata = {
  title: 'ARGUS',
  description: DESCRIPTION,
  alternates: { canonical: '/safety/argus' },
  openGraph: {
    title: 'ARGUS | Automa Dynamics',
    description: DESCRIPTION,
    url: '/safety/argus',
    type: 'website',
    images: [
      {
        url: '/safety/argus/executive-graph.png',
        width: 1551,
        height: 1099,
        alt: 'ARGUS Proof-1 executive assurance graph',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ARGUS | Automa Dynamics',
    description: DESCRIPTION,
    images: ['/safety/argus/executive-graph.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'ARGUS: Independent assurance reconstruction for frontier AI',
  url: `${SITE_URL}/safety/argus`,
  inLanguage: 'en-GB',
  description: DESCRIPTION,
  publisher: { '@type': 'Organization', name: 'Automa Dynamics', url: SITE_URL },
}

/* Type scale lives in globals.css so every page shares it. */
const DISPLAY = 'type-display'
const DISPLAY_SM = 'type-display-sm'
const LEAD = 'type-lead'
const BODY = 'type-body'
const LABEL = 'type-label'
const MEASURE = 'type-measure'
const SECTION = 'px-6 md:px-12 lg:px-24 py-20 md:py-28'
const SHELL = 'max-w-6xl mx-auto'

/* Two accents, split by job: gold carries an idea, violet asks the reader to go
   and do something. */
const GOLD = 'text-[#d9b45e]'
const VIOLET_LINK = 'text-[#a78bfa] hover:text-[#c4b5fd] transition-colors'

const GRAPH = '/safety/argus/proof-1'
const FILES = '/safety/argus/files'

const chain = ['CLAIM', 'ARGUMENT', 'EVIDENCE', 'DEPENDENCY', 'GAP']

const scope = [
  ['Organisation', 'OpenAI'],
  ['System', 'GPT-6 Astra'],
  ['Risk domain', 'Cybersecurity'],
  ['Decision context', 'Public release'],
  ['Evidence cutoff', '3 September 2026'],
]

const counts = [
  ['2', 'claims'],
  ['5', 'arguments'],
  ['23', 'evidence objects'],
  ['8', 'dependencies'],
  ['3', 'explicit assumptions'],
  ['9', 'active material gaps'],
  ['125', 'relationships'],
]

const distinctions = [
  'evidence absent from the public record from evidence known not to exist;',
  'a control being described from its effectiveness being demonstrated;',
  'and a favourable evaluation result from a complete residual-risk argument.',
]

const questions = [
  'Does the Claims–Arguments–Evidence structure faithfully represent the public assurance argument?',
  'Does ARGUS make anything materially clearer than the original source material?',
  'Are any dependencies or evidence gaps overstated, understated or incorrectly characterised?',
  'What would need to change for this representation to be useful in real assurance work?',
  'Would you use a representation like this when reviewing or challenging a frontier-AI safety claim?',
]

const artifacts = [
  { verb: 'View', label: 'Interactive Assurance Graph', href: GRAPH },
  {
    verb: 'Read',
    label: 'Human-readable Assurance Case',
    href: `${FILES}/ARGUS_P1_ASTRA_ASSURANCE_CASE_REVIEW_v0.2.0.md`,
    file: true,
  },
  {
    verb: 'Inspect',
    label: 'Machine-readable Graph JSON',
    href: `${FILES}/ARGUS_P1_ASTRA_GRAPH.json`,
    file: true,
  },
  {
    verb: 'Method',
    label: 'Proof-1 Review Packet',
    href: `${FILES}/ARGUS_PROOF1_EXTERNAL_REVIEW_PACKET.md`,
    file: true,
  },
  { verb: 'Contact', label: 'hello@automadynamics.com', href: 'mailto:hello@automadynamics.com' },
]

export default function ArgusPage() {
  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* What ARGUS is. */}
      <section className="px-6 md:px-12 lg:px-24 pt-32 md:pt-44 pb-20 md:pb-28">
        <RevealGroup className={SHELL} stagger={0.12}>
          <Reveal>
            <p className={`${LABEL} mb-6`}>Safety</p>
          </Reveal>
          <SplitText as="h1" text="ARGUS" className={`${DISPLAY} mb-8`} />
          <Reveal>
            <p className={`${LEAD} ${MEASURE} mb-10`}>
              Independent assurance reconstruction for frontier AI
            </p>
          </Reveal>
          <Reveal>
            <p className={`${BODY} ${MEASURE} mb-6`}>
              Frontier AI developers increasingly publish safety frameworks, system cards,
              evaluations and safeguard claims.
            </p>
          </Reveal>
          <Reveal>
            <p className={`${BODY} ${MEASURE} mb-6`}>
              Those materials can contain a large amount of useful evidence, but an independent
              reader may still need to reconstruct the actual assurance argument: what claim is
              being made, what evidence supports it, what assumptions it depends on, and where the
              public evidence stops.
            </p>
          </Reveal>
          <Reveal>
            <p className={`${LEAD} ${MEASURE} mb-10`}>
              ARGUS is an experimental method for making that structure inspectable.
            </p>
          </Reveal>
          <Reveal>
            <p className={`${BODY} ${MEASURE} mb-5`}>It represents an assurance case as:</p>
          </Reveal>
          <Reveal>
            <p
              className={`font-mono text-sm md:text-base tracking-[0.12em] ${GOLD} mb-8 flex flex-wrap gap-x-3 gap-y-2`}
              aria-label={chain.join(', then ')}
            >
              {chain.map((step, i) => (
                <span key={step} aria-hidden="true">
                  {step}
                  {i < chain.length - 1 && <span className="text-chrome/40 ml-3">&rarr;</span>}
                </span>
              ))}
            </p>
          </Reveal>
          <Reveal>
            <p className={`${BODY} ${MEASURE} mb-6`}>
              Every element is linked to its provenance, scope, limitations and relationship to the
              assurance claim.
            </p>
          </Reveal>
          <Reveal>
            <p className={`${BODY} ${MEASURE}`}>
              ARGUS does not produce safety scores or certifications. It does not infer that missing
              public evidence does not exist. Its purpose is to make the public reasoning behind a
              safety claim easier for an independent third party to inspect, challenge and discuss.
            </p>
          </Reveal>
        </RevealGroup>
      </section>

      {/* Proof-1. */}
      <section className={`${SECTION} border-t border-white/5`}>
        <div className={SHELL}>
          <RevealGroup>
            <Reveal>
              <p className={`${LABEL} mb-6`}>Proof-1</p>
            </Reveal>
            <SplitText text="GPT-6 Astra" className={`${DISPLAY} mb-4`} />
            <Reveal>
              <p className={`${LEAD} ${MEASURE} mb-10`}>
                Cybersecurity public-release assurance
              </p>
            </Reveal>
            <Reveal>
              <p className={`${BODY} ${MEASURE} mb-8`}>
                The first ARGUS test reconstructs one bounded claim:
              </p>
            </Reveal>
            <Reveal>
              <blockquote className="card-glass p-8 md:p-10 max-w-[42rem] mb-12 border-l-2 border-l-[#d9b45e]">
                <p className="text-[1.25rem] md:text-[1.5rem] leading-snug text-chrome-light font-normal">
                  GPT-6 Astra&rsquo;s safeguards sufficiently minimize the risk of severe cyber harm
                  for public release under OpenAI&rsquo;s Preparedness Framework.
                </p>
              </blockquote>
            </Reveal>
            <Reveal>
              <dl className="grid grid-cols-1 sm:grid-cols-[11rem_1fr] gap-x-8 gap-y-3 max-w-[36rem] mb-12">
                {scope.map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className={`${LABEL} sm:pt-[0.35rem]`}>{k}</dt>
                    <dd className="text-chrome-light text-[1.0625rem] mb-3 sm:mb-0">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal>
              <p className={`${BODY} ${MEASURE} mb-12`}>
                The evidence cutoff matters. ARGUS attempts to reconstruct the assurance case that
                could have been supported by the public evidence available at the release decision,
                rather than silently incorporating later revisions.
              </p>
            </Reveal>
            <Reveal>
              <p className={`${BODY} ${MEASURE} mb-6`}>The resulting Proof-1 contains:</p>
            </Reveal>
          </RevealGroup>

          <RevealGroup
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden"
            stagger={0.05}
          >
            {counts.map(([n, label]) => (
              <Reveal key={label} className="bg-wayland-950 p-5 md:p-6">
                <div className="font-mono text-[1.75rem] md:text-[2rem] leading-none text-chrome-light mb-3">
                  {n}
                </div>
                <div className="text-sm text-chrome/65 leading-snug">{label}</div>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* The graph. A screenshot here; the real thing gets its own full-width page. */}
      <section className={`${SECTION} border-t border-white/5`}>
        <div className={SHELL}>
          <RevealGroup>
            <Reveal>
              <p className={`${LABEL} mb-6`}>Inspect</p>
            </Reveal>
            <SplitText text="Interactive assurance graph" className={`${DISPLAY_SM} mb-10`} />
            <Reveal>
              <a
                href={GRAPH}
                className="group block rounded-2xl overflow-hidden border border-white/10 hover:border-[#a78bfa]/50 transition-colors mb-10"
              >
                <Image
                  src="/safety/argus/executive-graph.png"
                  alt="ARGUS Proof-1 executive assurance graph: root claim C1 supported by arguments A1 to A5, with dependencies, an assumption, gaps G2, G3 and G10, and key evidence nodes."
                  width={1551}
                  height={1099}
                  className="w-full h-auto"
                  priority={false}
                />
              </a>
            </Reveal>
            <Reveal>
              <a href={GRAPH} className="btn-primary inline-flex items-center gap-2 mb-10">
                Open interactive assurance graph
                <span aria-hidden="true">&rarr;</span>
              </a>
            </Reveal>
            <Reveal>
              <p className={`${BODY} ${MEASURE} mb-6`}>
                Select any node to inspect its underlying register record, evidence status,
                limitations, provenance and relationships.
              </p>
            </Reveal>
            <Reveal>
              <p className={`${BODY} ${MEASURE}`}>
                The Executive view shows the main assurance structure. The Full Assurance Graph
                exposes the complete Proof-1 representation.
              </p>
            </Reveal>
          </RevealGroup>
        </div>
      </section>

      {/* Findings. */}
      <section className={`${SECTION} border-t border-white/5`}>
        <div className={SHELL}>
          <RevealGroup>
            <Reveal>
              <p className={`${LABEL} mb-6`}>Findings</p>
            </Reveal>
            <SplitText
              text="What the reconstruction shows"
              className={`${DISPLAY} mb-10 max-w-[14ch]`}
            />
            <Reveal>
              <p className={`${BODY} ${MEASURE} mb-6`}>
                The public record supports reconstruction of OpenAI&rsquo;s release argument, the
                major safeguard layers, reported evaluations and the stated decision basis.
              </p>
            </Reveal>
            <Reveal>
              <p className={`${BODY} ${MEASURE} mb-6`}>
                It also exposes several points where an independent observer cannot reconstruct the
                complete assurance bridge from public evidence alone.
              </p>
            </Reveal>
            <Reveal>
              <p className={`${BODY} ${MEASURE} mb-8`}>
                In particular, the public material does not independently establish how the combined
                safeguard results map to an acceptable level of residual severe cyber risk.
                Important dependencies also remain around deployment configuration, cross-surface
                monitoring, intervention timing, evaluation transfer, infrastructure assurance and
                the contents of non-public decision material.
              </p>
            </Reveal>
            <Reveal>
              <p className={`${LEAD} ${MEASURE} mb-12`}>
                These are assurance gaps, not findings that safeguards failed.
              </p>
            </Reveal>
            <Reveal>
              <p className={`${BODY} ${MEASURE} mb-6`}>ARGUS explicitly distinguishes:</p>
            </Reveal>
            <Reveal>
              <ul className={`${MEASURE} space-y-4 mb-14`}>
                {distinctions.map((d) => (
                  <li key={d} className={`${BODY} pl-6 relative`}>
                    <span className={`absolute left-0 top-0 ${GOLD}`} aria-hidden="true">
                      &ndash;
                    </span>
                    {d}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal>
              <p className={`${BODY} ${MEASURE} mb-6`}>
                The Proof-1 conclusion is therefore deliberately limited:
              </p>
            </Reveal>
            <Reveal>
              <div className="card-glass p-8 md:p-10 max-w-[42rem] border-l-2 border-l-[#d9b45e]">
                <div className="font-mono text-xs text-chrome/65 mb-6 tracking-wide">
                  {'// Proof-1 conclusion'}
                </div>
                <p className="text-[1.125rem] md:text-[1.25rem] leading-relaxed text-chrome-light font-normal">
                  The public case&rsquo;s structure, reported measurements and decision basis are
                  reconstructable. Safeguard sufficiency and acceptable residual severe cyber risk
                  cannot be independently established from the admitted public evidence. The
                  opposite claim is not established either.
                </p>
              </div>
            </Reveal>
          </RevealGroup>
        </div>
      </section>

      {/* Review. */}
      <section id="review" className={`${SECTION} border-t border-white/5`}>
        <div className={SHELL}>
          <RevealGroup>
            <Reveal>
              <p className={`${LABEL} mb-6`}>Review</p>
            </Reveal>
            <SplitText
              text="External review requested"
              className={`${DISPLAY} mb-10 max-w-[14ch]`}
            />
            <Reveal>
              <p className={`${BODY} ${MEASURE} mb-6`}>
                ARGUS Proof-1 is technically complete. The remaining question is whether this
                representation is genuinely useful to people who work on AI safety, evaluations,
                assurance or governance.
              </p>
            </Reveal>
            <Reveal>
              <p className={`${LEAD} ${MEASURE} mb-10`}>We are specifically looking for criticism.</p>
            </Reveal>
            <Reveal>
              <p className={`${BODY} ${MEASURE} mb-8`}>Reviewers are invited to consider:</p>
            </Reveal>
          </RevealGroup>

          <RevealGroup className="space-y-10 md:space-y-12 mb-14" stagger={0.1}>
            {questions.map((q, i) => (
              <Reveal key={q}>
                <div className="md:grid md:grid-cols-[5rem_1fr] md:gap-8">
                  <div className="font-mono text-sm text-steel-light mb-3 md:mb-0 md:pt-1">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <p className="text-[1.25rem] md:text-[1.375rem] font-normal leading-snug text-chrome-light tracking-[-0.01em] max-w-[40rem]">
                    {q}
                  </p>
                </div>
              </Reveal>
            ))}
          </RevealGroup>

          <RevealGroup>
            <Reveal>
              <p className={`${BODY} ${MEASURE} mb-6`}>
                Brief comments are welcome. A formal review is not required.
              </p>
            </Reveal>
            <Reveal>
              <p className={`${BODY} ${MEASURE} mb-10`}>
                Reviewer identity and affiliation will remain confidential by default. Participation
                does not constitute endorsement of ARGUS. Feedback will not be attributed or quoted
                without explicit permission.
              </p>
            </Reveal>
            <Reveal>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:hello@automadynamics.com?subject=ARGUS%20Proof-1%20review"
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  Send feedback
                  <span aria-hidden="true">&rarr;</span>
                </a>
                <a href={GRAPH} className="btn-secondary text-center">
                  Inspect the graph
                </a>
              </div>
            </Reveal>
          </RevealGroup>
        </div>
      </section>

      {/* Boundary and artifacts. */}
      <section className={`${SECTION} border-t border-white/5`}>
        <div className={`${SHELL} grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 [&>*]:min-w-0`}>
          <RevealGroup>
            <Reveal>
              <p className={`${LABEL} mb-6`}>Research boundary</p>
            </Reveal>
            <Reveal>
              <p className={`${BODY} mb-6`}>ARGUS is independent research by Automa Dynamics.</p>
            </Reveal>
            <Reveal>
              <p className={`${BODY} mb-6`}>
                It is not affiliated with, commissioned by, or endorsed by OpenAI.
              </p>
            </Reveal>
            <Reveal>
              <p className={`${BODY} mb-6`}>
                This Proof-1 is not a certification that GPT-6 Astra is safe or unsafe.
              </p>
            </Reveal>
            <Reveal>
              <p className={`${BODY} mb-6`}>
                It evaluates the inspectability of the public assurance case, not the private
                evidence or internal decision process that ARGUS cannot observe.
              </p>
            </Reveal>
            <Reveal>
              <p className={BODY}>
                Missing public evidence is never treated as proof that the corresponding evidence
                does not exist privately.
              </p>
            </Reveal>
          </RevealGroup>

          <RevealGroup>
            <Reveal>
              <p className={`${LABEL} mb-6`}>Proof-1 status</p>
            </Reveal>
            <Reveal>
              <p className={`font-mono text-sm tracking-[0.12em] ${GOLD} mb-10`}>
                TECHNICAL COMPLETE - EXTERNAL REVIEW OPEN
              </p>
            </Reveal>
            <Reveal>
              <ul className="divide-y divide-white/10 border-y border-white/10">
                {artifacts.map((a) => (
                  <li key={a.verb}>
                    <a
                      href={a.href}
                      className="group grid grid-cols-[5rem_minmax(0,1fr)_auto] sm:grid-cols-[6.5rem_minmax(0,1fr)_auto] items-baseline gap-4 py-4"
                    >
                      <span className={LABEL}>{a.verb}</span>
                      <span className={`text-[1.0625rem] [overflow-wrap:anywhere] ${VIOLET_LINK}`}>{a.label}</span>
                      <span
                        className="font-mono text-xs text-chrome/40 group-hover:text-chrome/70 transition-colors"
                        aria-hidden="true"
                      >
                        {a.file ? a.href.split('.').pop().toUpperCase() : '→'}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </RevealGroup>
        </div>
      </section>
    </main>
  )
}
