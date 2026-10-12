import { SITE_URL } from '../../../../lib/articles'
import ArgusEmbed from '../../../_components/ArgusEmbed'

/* ARGUS Proof-2 findings. Copy is the reviewed public findings text
   (ARGUS_P2_PUBLIC_FINDINGS_DRAFT.md); only layout and readability are
   adapted here, never the conclusions. Static like /safety/argus: a research
   page should be there on first paint, with no scroll reveals. */

const PATH = '/safety/argus/claude-opus-5-5'
const EXPLORER = `${PATH}/explore`
const GRAPH_JSON = '/safety/argus/files/ARGUS_P2_ASSURANCE_GRAPH.json'
const GRAPH_SHA = 'fd4bfcf389871d36a4466c5665442ac4ab0c2947c29c6b6b1c799a0c8790ac2a'

const TITLE = 'Claude Opus 5.5: What the Public Cybersecurity Assurance Record Establishes'
const DESCRIPTION =
  'ARGUS Proof-2 independently reconstructs the public cybersecurity assurance record for Claude Opus 5.5. It records eight open public-assurance gaps: requests for inspectable evidence, not findings that safeguards failed. No affiliation with or endorsement by Anthropic.'

export const metadata = {
  title: 'ARGUS Proof-2: Claude Opus 5.5',
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    title: `ARGUS Proof-2 | ${TITLE}`,
    description: DESCRIPTION,
    url: PATH,
    type: 'article',
    images: [
      {
        url: `${PATH}/executive-graph.png`,
        width: 1597,
        height: 928,
        alt: 'ARGUS Proof-2 executive assurance graph for Claude Opus 5.5',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `ARGUS Proof-2 | ${TITLE}`,
    description: DESCRIPTION,
    images: [`${PATH}/executive-graph.png`],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: TITLE,
  url: `${SITE_URL}${PATH}`,
  inLanguage: 'en-GB',
  description: DESCRIPTION,
  datePublished: '2026-10-12',
  author: { '@type': 'Organization', name: 'Automa Dynamics', url: SITE_URL },
  publisher: { '@type': 'Organization', name: 'Automa Dynamics', url: SITE_URL },
  isPartOf: { '@type': 'WebPage', name: 'ARGUS', url: `${SITE_URL}/safety/argus` },
}

const DISPLAY = 'type-display'
const DISPLAY_SM = 'type-display-sm'
const LEAD = 'type-lead'
const BODY = 'type-body'
const LABEL = 'type-label'
const MEASURE = 'type-measure'
const SECTION = 'px-6 md:px-12 lg:px-24 py-20 md:py-28'
const SHELL = 'max-w-6xl mx-auto'
const GOLD = 'text-[#d9b45e]'
const VIOLET_LINK = 'text-[#a78bfa] hover:text-[#c4b5fd] underline-offset-4 hover:underline transition-colors'
const B = 'text-chrome-light font-medium'

const scope = [
  ['Organisation', 'Anthropic'],
  ['System', 'Claude Opus 5.5'],
  ['Risk domain', 'Cybersecurity'],
  ['Release baseline', '22 September 2026'],
  ['Research filed', '11 October 2026'],
  ['Claim', 'P2-C-001'],
]

const counts = [
  ['50', 'typed nodes'],
  ['121', 'edge records'],
  ['23', 'evidence objects'],
  ['7', 'arguments'],
  ['6', 'dependencies'],
  ['5', 'assumptions'],
  ['8', 'open public-assurance gaps'],
]

const gaps = [
  [
    'G-001',
    'Coverage and release operation.',
    'A versioned, interface-specific record of deployed controls and audited coverage would connect the described architecture to the system users received.',
  ],
  [
    'G-002',
    'Severity and comparative robustness.',
    'Sanitised adjudications of candidate breaks, their four-axis severity assessments and matched-condition comparisons would make reported robustness more independently challengeable.',
  ],
  [
    'G-003',
    'Earlier-to-final snapshot transfer.',
    'A mapping of tested and released versions, with targeted final-snapshot checks or an auditable invariance argument, would strengthen the claimed transfer.',
  ],
  [
    'G-004',
    'Composite fallback and surface behaviour.',
    'Per-path outcomes and testing across application, API, coding, GUI, browser and pasted-text configurations would clarify end-to-end protection.',
  ],
  [
    'G-005',
    'Reproducibility and independent corroboration.',
    "Evaluation manifests, denominators, uncertainty and independently authored cyber findings would narrow reliance on publisher-mediated results. METR's separate work concerns AI R&D, not independent verification of the cyber-release case.",
  ],
  [
    'G-006',
    'Capability-to-tier mapping.',
    "A model-specific explanation of novelty, autonomy and operational criteria would clarify how observed capability relates to the framework's cyber tiers.",
  ],
  [
    'G-007',
    'Model-specific risk acceptance.',
    'A dated public or independently audited summary linking adverse results, safeguards, margins, fallback and monitoring to the relevant risk-owner decision would support a stronger release-acceptance interpretation.',
  ],
  [
    'G-008',
    'Historical framework custody.',
    'An authenticated release-day copy or credible unchanged-content attestation would clarify whether the reviewed Frontier Compliance Framework v2 text matches the exact version available on 22 September 2026.',
  ],
]

/* The six independently checked public destinations (ARGUS_P2_PUBLIC_SOURCE_LINK_QA.md).
   The FCF v2 row deliberately has no href. */
const sources = [
  {
    id: 'P2C-SRC-001',
    title: (
      <>
        Anthropic, <em>Claude Opus 5.5 System Card</em>
      </>
    ),
    href: 'https://www-cdn.anthropic.com/fc1b44717c85dc068bc6ba5024219938094694bd/Claude%20Opus%205.5%20System%20Card.pdf',
    note: 'Primary system-card release record. The separately archived 22 September copy has authenticated release-day custody; current PDF bytes were not compared with it.',
  },
  {
    id: 'P2C-SRC-002',
    title: (
      <>
        Anthropic, <em>Introducing Claude Opus 5.5</em>
      </>
    ),
    href: 'https://www.anthropic.com/claude-opus-5-5',
    note: 'Public release announcement. Current page content is not asserted byte-identical to the historical capture.',
  },
  {
    id: 'P2C-SRC-003',
    title: (
      <>
        Anthropic, <em>Responsible Scaling Policy v3.4</em>
      </>
    ),
    href: 'https://www-cdn.anthropic.com/files/4zrzovbb/website/0bacdc8440ea96e62a8766d99ebe1d4eea6d5f3a.pdf',
    note: 'Publisher policy chronology; exact historical bytes not authenticated.',
  },
  {
    id: 'P2C-SRC-004',
    title: 'Anthropic, Responsible Scaling Policy version history',
    href: 'https://www.anthropic.com/responsible-scaling-policy',
    note: 'Publisher policy chronology; exact historical bytes not authenticated.',
  },
  {
    id: 'P2C-SRC-005',
    title: (
      <>
        METR, <em>Summary of predeployment evaluation of Claude Opus 5.5</em>
      </>
    ),
    href: 'https://metr.org/blog/2026-09-22-claude-opus-5-5/',
    note: 'AI R&D evaluation context, not independent cyber-release validation.',
  },
  {
    id: 'P2C-SRC-006',
    title: 'Claude Help Center, automatic model switching FAQ',
    href: 'https://support.claude.com/en/articles/16049681-why-claude-switched-models-in-your-conversation-with-opus-5-or-opus-5-5',
    note: (
      <>
        Later, <strong className={B}>post-release</strong> context only.
      </>
    ),
  },
  {
    id: 'P2R-SRC-001',
    title: 'Anthropic, Frontier Compliance Framework v2',
    href: null,
    note: 'Publisher-dated 24 July 2026 framework; no independently verified direct public PDF link for this presentation; exact 22 September bytes unauthenticated.',
  },
]

function P({ children, className = '' }) {
  return <p className={`${BODY} ${MEASURE} mb-6 ${className}`}>{children}</p>
}

function Heading({ label, text, id }) {
  return (
    <>
      <p className={`${LABEL} mb-6`}>{label}</p>
      <h2 id={id} className={`${DISPLAY_SM} mb-10 max-w-[22ch]`}>
        {text}
      </h2>
    </>
  )
}

export default function ArgusProof2Page() {
  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero: the case, the status, the finding, the way into the graph. */}
      <section className="px-6 md:px-12 lg:px-24 pt-28 md:pt-36 pb-16 md:pb-20">
        <div className={SHELL}>
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-xs tracking-[0.08em] text-chrome/65">
              <li>
                <a href="/safety/argus" className="hover:text-chrome-light transition-colors">
                  ARGUS
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-chrome-light">
                Proof-2 &middot; Claude Opus 5.5
              </li>
            </ol>
          </nav>
          <p className={`${LABEL} mb-6`}>ARGUS Proof-2</p>
          <h1 className={`${DISPLAY} mb-6 max-w-[18ch]`}>Claude Opus 5.5</h1>
          <p className={`${LEAD} max-w-[44rem] mb-6`}>
            What the public cybersecurity assurance record establishes
          </p>
          <p className={`font-mono text-xs md:text-sm tracking-[0.12em] ${GOLD} mb-10`}>
            INDEPENDENT RECONSTRUCTION &middot; CYBERSECURITY &middot; RELEASE BASELINE 22 SEPTEMBER
            2026
          </p>

          <div className="card-glass p-8 md:p-10 max-w-[48rem] border-l-2 border-l-[#d9b45e] mb-10">
            <p className="font-mono text-xs text-chrome/65 mb-5 tracking-wide">{'// The finding'}</p>
            <p className="text-[1.0625rem] md:text-[1.1875rem] leading-relaxed text-chrome-light font-normal mb-5">
              Anthropic&rsquo;s public release materials describe a multi-stage cyber-safeguard
              system and extensive testing, including favourable results and disclosed adverse
              findings. They support a bounded account of what Anthropic said it deployed and what
              its evaluations reported. They do not, on their own, allow an outside reader to verify
              comprehensive coverage of the released system, the robustness of every fallback
              configuration, or the model-specific acceptance of residual cyber risk.
            </p>
            <p className="text-[1.0625rem] md:text-[1.1875rem] leading-relaxed text-chrome-light font-normal">
              ARGUS records eight open public-assurance gaps. Those gaps are requests for
              inspectable evidence, not findings that safeguards failed or that internal evidence
              does not exist.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <a
              href={`${EXPLORER}#exec`}
              className="btn-primary !px-5 sm:!px-8 text-center text-[0.9375rem] sm:text-base"
            >
              Explore the interactive assurance{' '}
              <span className="whitespace-nowrap">
                graph <span aria-hidden="true">&rarr;</span>
              </span>
            </a>
            <a href="/safety/argus" className="btn-secondary text-center">
              About ARGUS
            </a>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-[11rem_1fr] gap-x-8 gap-y-3 max-w-[40rem] mb-8">
            {scope.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className={`${LABEL} sm:pt-[0.35rem]`}>{k}</dt>
                <dd className="text-chrome-light text-[1.0625rem] mb-3 sm:mb-0">{v}</dd>
              </div>
            ))}
            <div className="contents">
              <dt className={`${LABEL} sm:pt-[0.35rem]`}>Status</dt>
              <dd className="text-chrome-light text-[1.0625rem]">
                Technical reconstruction complete. Targeted source-to-visual fidelity audit complete;
                presentation corrections applied.{' '}
                <span className={GOLD}>Not externally peer reviewed.</span>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* The claim. */}
      <section className={`${SECTION} border-t border-white/5`} aria-labelledby="claim">
        <div className={SHELL}>
          <Heading label="Scope" text="The claim under examination" id="claim" />
          <P>
            On 22 September 2026, Anthropic announced general access to Claude Opus 5.5 with cyber
            safeguards intended to enforce the same policy as Claude Opus 5. Its system card
            reported robustness comparable to Claude Fable 5 and Fable 5.1, and greater robustness
            than Opus 5. That comparative language is <strong className={B}>Anthropic&rsquo;s claim</strong>,
            not an independently reproduced ARGUS ranking.
          </P>
          <P>
            ARGUS reconstructed this one bounded claim, <strong className={B}>P2-C-001</strong>, from
            the published system card, release announcement, policy chronology and associated
            evaluation descriptions. The result contains{' '}
            <strong className={B}>
              50 typed nodes, 121 edge records, 23 evidence objects and eight unresolved
              public-assurance gaps
            </strong>
            . These figures describe the research artifact; they are not safety scores.
          </P>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden mt-10 mb-4">
            {counts.map(([n, label]) => (
              <div key={label} className="bg-wayland-950 p-5 md:p-6">
                <div className="font-mono text-[1.75rem] md:text-[2rem] leading-none text-chrome-light mb-3">
                  {n}
                </div>
                <div className="text-sm text-chrome/65 leading-snug">{label}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-chrome/65 mb-14">
            Inventory counts describing the shape of the reconstruction. Not safety scores, and not
            comparable across studies.
          </p>

          <P className="mb-8">
            The <a className={VIOLET_LINK} href={`${EXPLORER}#exec`}>Executive assurance graph</a>{' '}
            provides a readable claim-to-gap route. The{' '}
            <a className={VIOLET_LINK} href={`${EXPLORER}#full`}>Full graph</a> exposes each evidence
            record, dependency, assumption, source locator and ARGUS-written warrant.
          </P>

          <ArgusEmbed
            src={`${EXPLORER}?embed=exec&theme=dark`}
            title="ARGUS Proof-2 Executive assurance graph for Claude Opus 5.5, with branch reader and record panel"
          />
          <p className="text-sm text-chrome/65 mt-4">
            Select a gap, or use the branch reader beneath the graph, to read one branch from claim
            component to the evidence that would close its open link. Short labels are editorial;
            each panel gives the exact register text.{' '}
            <a className={VIOLET_LINK} href={`${EXPLORER}#exec`}>
              Open full-window
            </a>{' '}
            for the side-by-side panel and the Full graph.
          </p>
        </div>
      </section>

      {/* What the evidence supports. */}
      <section className={`${SECTION} border-t border-white/5`} aria-labelledby="supports">
        <div className={SHELL}>
          <Heading label="Findings" text="What the public evidence supports" id="supports" />

          <h3 className={`${LEAD} text-chrome-light mb-6`}>A described safeguard architecture</h3>
          <P className="mb-14">
            Anthropic describes an activation probe, a lightweight classifier running with Opus 5.5
            and a separate trained language-model classifier. It also describes a temporarily wider
            blocking margin, adversarial-training additions and a policy distinction between
            source-code vulnerability discovery and compiled-binary exploitation. These are
            substantive descriptions of the intended release controls. Published coverage summaries
            are useful evidence, though they do not provide an independently auditable matrix of
            every deployed classifier version, interface and error rate.
          </P>

          <h3 className={`${LEAD} text-chrome-light mb-6`}>
            Substantial testing, including uncomfortable results
          </h3>
          <P>
            The system card reports adversarial testing against production safeguards. Its
            no-critical-jailbreak observation is made under Anthropic&rsquo;s severity framework; it
            is not a guarantee that jailbreaks or harmful outputs cannot occur. In contracted
            testing, Trajectory Labs reportedly spent about <strong className={B}>95 hours</strong>{' '}
            and made <strong className={B}>more than 29,000 requests</strong>, identifying{' '}
            <strong className={B}>13 candidate breaks across seven tasks</strong> and producing a
            working exploit chain. Other reported campaigns had more favourable outcomes. The
            published material does not provide enough per-case severity adjudication for ARGUS to
            independently decide whether any finding met Anthropic&rsquo;s critical threshold.
          </P>
          <P className="mb-14">
            Section 3.5&rsquo;s robustness work used an{' '}
            <strong className={B}>earlier model snapshot</strong>. Anthropic says the safeguards and
            findings are representative of the released model. The public passages examined do not
            supply a paired mapping of tested and final model, classifier and fallback
            configurations. This qualification is specific to those evaluations; it should not be
            applied indiscriminately to every result in the system card.
          </P>

          <h3 className={`${LEAD} text-chrome-light mb-6`}>
            Fallback changes the system being assessed
          </h3>
          <P>
            When a cyber classifier blocks a request, Anthropic describes automatic fallback to{' '}
            <strong className={B}>Claude Opus 4.8</strong> in its own applications. On the API, model
            switching requires developer opt-in, and other providers may differ. The release&rsquo;s
            safety properties therefore depend partly on routing, interface and enabled protections,
            not only on the primary model.
          </P>
          <P>
            The system card reports{' '}
            <strong className={B}>zero successful attacks among 1,310 fallback-served rollouts</strong>{' '}
            in one static prompt-injection test. That is a narrow rollout-level result, separate from
            its overall <strong className={B}>1.0% attack-success probability at k=15</strong>. In
            adaptive coding experiments, reported attack-success rates were{' '}
            <strong className={B}>54.61% without prompt-injection probes</strong> and{' '}
            <strong className={B}>11.13% with probes</strong>. Those percentages are overall
            attempt-level rates among valid responses, across direct and fallback arms; they are{' '}
            <strong className={B}>not fallback-only rates</strong>. All observed successful attacks
            in those coding arms were served by the fallback model. The no-probe arm still retained
            cyber blocking and fallback; it did not disable every safeguard.
          </P>
          <P className="mb-0">
            GUI experiments also reported a small number of successful attacks served by the primary
            model, while separate protected browser tests reported no successes in their tested
            configuration. The card further documents a residual vulnerability to malicious text
            pasted by a user, alongside favourable product-mitigation tests. These experiments vary
            in setup, denominators and deployed protections. Their results cannot be pooled into a
            general incident probability or a claim that every interface is equally protected.
          </P>
        </div>
      </section>

      {/* The eight gaps. */}
      <section id="gaps" className={`${SECTION} border-t border-white/5`} aria-labelledby="gaps-h">
        <div className={SHELL}>
          <Heading label="Open links" text="The eight open public-assurance gaps" id="gaps-h" />
          <P className="mb-10">
            The gaps below are <strong className={B}>ARGUS analyst groupings</strong>. Each describes
            evidence that could close or narrow the relevant public link. Different groupings would
            be possible.
          </P>
          <ol className="divide-y divide-white/10 border-y border-white/10 mb-10">
            {gaps.map(([id, name, text], i) => (
              <li key={id} className="py-6 md:grid md:grid-cols-[7rem_1fr] md:gap-8">
                <div className="font-mono text-sm text-steel-light mb-2 md:mb-0 md:pt-1">
                  <span className="sr-only">{i + 1}. </span>
                  <a
                    className={VIOLET_LINK}
                    href={`${EXPLORER}#exec/P2-${id}`}
                    aria-label={`${id}: open this gap in the assurance graph`}
                  >
                    {id}
                  </a>
                </div>
                <p className={`${BODY} max-w-[46rem]`}>
                  <strong className={B}>{name}</strong> {text}
                </p>
              </li>
            ))}
          </ol>
          <div className="card-glass p-6 md:p-8 max-w-[46rem] border-l-2 border-l-[#d9b45e]">
            <p className="text-[1.0625rem] leading-relaxed text-chrome-light">
              <strong>Open means open in the bounded public record examined.</strong> It does not
              mean the information is absent inside Anthropic, nor does it establish a policy
              violation or model unsafety.
            </p>
          </div>
        </div>
      </section>

      {/* FCF limitation. */}
      <section className={`${SECTION} border-t border-white/5`} aria-labelledby="fcf">
        <div className={SHELL}>
          <Heading label="Limitation" text="The Frontier Compliance Framework limitation" id="fcf" />
          <P>
            The reviewed Frontier Compliance Framework identifies{' '}
            <strong className={B}>version 2, effective 24 July 2026</strong>. ARGUS verified the
            integrity of a retained October copy, but did <strong className={B}>not</strong>{' '}
            authenticate its exact byte identity on the September release date. An independently
            accessible, non-NDA direct PDF destination was not established for the public website.
            Consequently the interactive evidence presentation labels the framework as an{' '}
            <strong className={B}>access and historical-provenance limitation</strong>, without a
            misleading download action.
          </P>
          <P className="mb-0">
            The framework describes general cyber tiers and decision processes, but the public
            materials inspected do not establish a signed, Opus-5.5-specific risk-acceptance
            determination. This is a limit on what the present reconstruction can conclude, not a
            finding of noncompliance. No NDA-protected Trust Center information was used.
          </P>
        </div>
      </section>

      {/* How to read. */}
      <section id="reading" className={`${SECTION} border-t border-white/5`} aria-labelledby="read">
        <div className={SHELL}>
          <Heading label="Method" text="How to read this work" id="read" />
          <P>
            ARGUS is an independent <strong className={B}>documentary reconstruction</strong>, not a
            penetration test of the deployed service, a safety certification, or a comparison of
            frontier models. Its typed graph separates publisher statements from ARGUS
            interpretation, and shows assumptions, competing explanations, adverse findings and
            proposed evidence for closure.
          </P>
          <P>
            An independent-of-author{' '}
            <strong className={B}>source-to-visual fidelity audit</strong> found no material
            representation error and prompted presentation corrections. That check is not external
            scientific peer review;{' '}
            <strong className={B}>this Proof-2 study has not been externally peer reviewed</strong>.
            The research boundary is the 22 September 2026 release, with later context separately
            labelled. The research was filed on 11 October 2026.
          </P>
          <P className="mb-10">
            Readers are invited to examine particular edges or evidence records and challenge them
            with source locators, contrary evidence or a better argument. Criticism that narrows or
            corrects an assurance link is a useful outcome of the project.
          </P>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={`${EXPLORER}#exec`}
              className="btn-primary inline-flex items-center justify-center gap-2 !px-5 sm:!px-8"
            >
              Open Executive and Full Assurance Graphs <span aria-hidden="true">&rarr;</span>
            </a>
            <a
              href="mailto:hello@automadynamics.com?subject=ARGUS%20Proof-2%20review"
              className="btn-secondary text-center"
            >
              Send a challenge or correction
            </a>
          </div>
        </div>
      </section>

      {/* Sources. */}
      <section id="sources" className={`${SECTION} border-t border-white/5`} aria-labelledby="src">
        <div className={SHELL}>
          <Heading label="Provenance" text="Public sources and provenance" id="src" />
          <ul className="divide-y divide-white/10 border-y border-white/10 mb-8">
            {sources.map((s) => (
              <li
                key={s.id}
                className="py-5 grid grid-cols-1 md:grid-cols-[8.5rem_minmax(0,1fr)] gap-x-8 gap-y-2"
              >
                <span className="font-mono text-xs text-chrome/65 md:pt-1">{s.id}</span>
                <div className="min-w-0">
                  {s.href ? (
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-[1.0625rem] [overflow-wrap:anywhere] ${VIOLET_LINK}`}
                    >
                      {s.title}
                      <span aria-hidden="true"> &#8599;</span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    <p className="text-[1.0625rem] text-chrome-light">
                      {s.title}{' '}
                      <span className="ml-1 inline-block align-middle rounded border border-[#d9b45e]/50 px-2 py-0.5 font-mono text-[0.6875rem] tracking-[0.08em] text-[#d9b45e]">
                        NO PUBLIC LINK
                      </span>
                    </p>
                  )}
                  <p className="text-sm leading-relaxed text-chrome/65 mt-2 max-w-[46rem]">{s.note}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-sm leading-relaxed text-chrome/65 max-w-[46rem]">
            Current publisher URLs do not establish byte identity with the authenticated release-day
            captures. The Anthropic Trust Center, which is NDA-gated, was not used.
          </p>
        </div>
      </section>

      {/* Boundary and artifacts. */}
      <section className={`${SECTION} border-t border-white/5`}>
        <div className={`${SHELL} grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 [&>*]:min-w-0`}>
          <div>
            <p className={`${LABEL} mb-6`}>Research boundary</p>
            <p className={`${BODY} mb-6`}>
              Published by Automa Dynamics / ARGUS. Independent research; no affiliation,
              endorsement or certification by Anthropic.
            </p>
            <p className={`${BODY} mb-6`}>
              Findings concern the identified public-documentary boundary and may be revised with
              cited corrections.
            </p>
            <p className={BODY}>
              Missing public evidence is never treated as proof that the corresponding evidence does
              not exist privately.
            </p>
          </div>
          <div>
            <p className={`${LABEL} mb-6`}>Proof-2 artifacts</p>
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {[
                ['View', 'Executive assurance graph', `${EXPLORER}#exec`, '→'],
                ['View', 'Full assurance graph', `${EXPLORER}#full`, '→'],
                ['Inspect', 'Machine-readable Graph JSON', GRAPH_JSON, 'JSON'],
                ['About', 'ARGUS method and Proof-1', '/safety/argus', '→'],
                ['Contact', 'hello@automadynamics.com', 'mailto:hello@automadynamics.com?subject=ARGUS%20Proof-2', '→'],
              ].map(([verb, label, href, tail]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="group grid grid-cols-[5rem_minmax(0,1fr)_auto] sm:grid-cols-[6.5rem_minmax(0,1fr)_auto] items-baseline gap-4 py-4"
                  >
                    <span className={LABEL}>{verb}</span>
                    <span className={`text-[1.0625rem] [overflow-wrap:anywhere] ${VIOLET_LINK}`}>{label}</span>
                    <span
                      className="font-mono text-xs text-chrome/65 group-hover:text-chrome-light transition-colors"
                      aria-hidden="true"
                    >
                      {tail}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="font-mono text-[0.6875rem] leading-relaxed text-chrome/65 mt-6 [overflow-wrap:anywhere]">
              Graph SHA-256 {GRAPH_SHA}
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
