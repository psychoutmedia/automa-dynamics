import { SITE_URL } from '../../../../lib/articles'
import Image from 'next/image'
import P3 from '../../../../lib/argusP3.data.json'

/* ARGUS Proof-3 findings: Google DeepMind / Gemini 4 Argon / cyberoffensive misuse.
   Copy follows the filed research (proof3/ARGUS_P3_ASSURANCE_ASSESSMENT.md, the executive
   checklist and the evidence register); every figure keeps its own metric, setting and PDF
   page. Gap investigations and source provenance are the registers' own text, lifted verbatim
   into lib/argusP3.data.json by scripts/sync-argus-p3.py (hash-guarded). Static like the other
   ARGUS pages: a research page should be there on first paint. */

const PATH = '/safety/argus/gemini-4-argon'
const EXPLORER = `${PATH}/explore`
const GRAPH_JSON = '/safety/argus/files/ARGUS_P3_ASSURANCE_GRAPH.json'
const GRAPH_SHA = P3.graph_sha256

const TITLE = 'Gemini 4 Argon: What the Public Cyberoffensive Assurance Record Establishes'
const DESCRIPTION =
  'ARGUS Proof-3 independently reconstructs the public cyberoffensive assurance record for Google DeepMind’s Gemini 4 Argon. Google cannot rule out the cybersecurity CCL and assesses risk below it; ARGUS records seven open public-assurance gaps, requests for inspectable evidence, not findings that safeguards failed. Not affiliated with Google.'

export const metadata = {
  title: 'ARGUS Proof-3: Gemini 4 Argon',
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    title: `ARGUS Proof-3 | ${TITLE}`,
    description: DESCRIPTION,
    url: PATH,
    type: 'article',
    images: [
      {
        url: `${PATH}/executive-graph.png`,
        width: 1600,
        height: 930,
        alt: 'ARGUS Proof-3 executive assurance graph for Gemini 4 Argon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `ARGUS Proof-3 | ${TITLE}`,
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
/* Register HTML (escaped at build time): links take the site's violet. */
const REG =
  '[&_a]:text-[#a78bfa] [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-[#c4b5fd] [&_strong]:text-chrome-light [&_strong]:font-medium [&_code]:font-mono [&_code]:text-[0.85em] [overflow-wrap:anywhere]'

const SRC = P3.sources
/* A public PDF page link: one-based file pages, as cited by the registers. */
function Pg({ src, page, children }) {
  const s = SRC[src]
  return (
    <a
      className={VIOLET_LINK}
      href={`${s.url}#page=${page}`}
      target="_blank"
      rel="noopener noreferrer"
      title={`${s.title}, PDF page ${page} (opens the publisher's copy)`}
    >
      {children}
    </a>
  )
}
const REPORT = 'P3-SRC-002'
const CARD = 'P3-SRC-001'
const FSF = 'P3-SRC-003'
function Web({ src, children }) {
  return (
    <a className={VIOLET_LINK} href={SRC[src].url} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}

const scope = [
  ['Organisation', 'Google DeepMind'],
  ['System', 'Gemini 4 Argon'],
  ['Risk domain', 'Cybersecurity / cyberoffensive misuse'],
  ['Release boundary', 'Broader public rollout beginning 13 October 2026'],
  ['Separate phase', 'Restricted Fairwind rollout, 30 September 2026'],
  ['Research filed', '14 October 2026'],
  ['Claim', 'P3-C-001'],
]

const clauses = [
  {
    n: '1',
    head: 'Potential inherent capability',
    google: 'Google cannot rule out that the unmitigated model has reached the cybersecurity CCL.',
    reads: 'A conservative modal determination. It is neither a confirmed threshold crossing nor a ruling-out.',
  },
  {
    n: '2',
    head: 'A developed safety case and safeguards',
    google: 'Google reports developing a cyberoffensive safety case before launch and deploying mitigations under it.',
    reads: 'The existence and described layers of the case are public assertions. The complete model-specific case is not separately inspectable.',
  },
  {
    n: '3',
    head: 'Residual risk below the CCL',
    google: 'Google assesses its mitigations as lowering cyber risk below the CCL level.',
    reads: 'This is Google’s risk judgement. ARGUS has not independently verified it, and it is not a measurement or a public certification.',
  },
]

/* Each group is one test setting. Values are never compared across groups. */
const groups = [
  {
    key: 'unmit',
    label: 'Unmitigated Model C',
    setting:
      'The model without out-of-model production safeguards: a capability test, not a test of the deployed system.',
    accent: 'border-l-[#C995DA]',
    rows: [
      ['12/12', 'end-to-end CyScenarioBench scenarios solved', 'A challenge count, not repeated trials. Two solves took unintended routes, which may overstate intended-task performance.', 37],
      ['77/82', 'scenario segments solved', 'Read from Figure 3.2. The benchmark is saturated, so it no longer upper-bounds capability.', 37],
      ['9x–100x', 'modeled unmitigated cost uplift across 22 historical attack chains', 'Geometric mean about 16.7x. A modeled multiplier, not observed harm; Google calls the quantitative scores substantially uncertain.', 37],
      ['TAC-4', 'no challenges at this tier', 'The cost model assumes TAC-4 performance from the measured time horizon and reliability.', 34],
    ],
  },
  {
    key: 'guard',
    label: 'Guarded endpoints, latest mitigations',
    setting: 'Google’s safeguarded evaluations in §3.3, run by Google.',
    accent: 'border-l-[#9CCB6A]',
    rows: [
      ['100%', 'of CyScenarioBench and ExploitBench milestones refused', 'The milestone denominator is not supplied.', 57],
      ['0.4%', 'malicious violation rate, cyber conversational set', 'About 1,000 examples over 1 to 5 turns; chart value from Figure 3.9.', 57],
      ['53.9%', 'benign cyber refusal rate, same set', 'The utility cost of a deliberately wider safety margin, which Google acknowledges; chart value from Figure 3.9.', 57],
      ['1% / <1%', 'query success rate (QSR), static / adaptive attacks', 'Per-query actionable breach. Figure 3.10, with 95% Jeffreys intervals whose endpoints are not printed.', 60],
      ['20%', 'objective success rate (OSR) in both chart groups', 'At least one breach per harmful seed objective across attempts. Prose separately reports adaptive OSR of 0% single-turn, 40% multi-turn and 20% combined.', 60],
    ],
  },
  {
    key: 'ext',
    label: 'External red teams, guarded endpoints',
    setting: 'Tests run by external parties and narrated in Google’s report. The graph marks both as adverse findings.',
    accent: 'border-l-[#FF5C8A]',
    adverse: true,
    rows: [
      ['10% QSR', 'Gray Swan, 25 high-severity cyber tasks, Shade attacker at high thinking', 'Google reports 10% per-query success, down from 14% on the cited predecessor.', 62],
      ['56% OSR', 'Gray Swan, objective-level success, same test', 'More than half of seed objectives reached at least one success (chart value, Figure 3.10; 76% on the predecessor). Retry budget and task-level results are not printed.', 60],
      ['12 breaks', 'Trajectory Labs: 9 technique families, 38 hours, over 4,000 requests', 'No new universal jailbreak in that window. One detailed success took about 7 hours, 900 turns and more than 160 sessions, plus substantial human planning.', 62],
    ],
  },
]

/* Same metric, same test, two models: the only comparisons drawn. */
const pairs = [
  { test: 'Internal adaptive attacks, combined', metric: 'OSR', argon: 20, prior: 70, page: 61 },
  { test: 'Internal adaptive attacks, multi-turn', metric: 'OSR', argon: 40, prior: 80, page: 61 },
  { test: 'Gray Swan cyber evaluation', metric: 'OSR', argon: 56, prior: 76, page: 60 },
  { test: 'Gray Swan cyber evaluation', metric: 'QSR', argon: 10, prior: 14, page: 62 },
]

const timeline = [
  ['17 Apr 2026', 'Frontier Safety Framework v3.1 published', 'General process, not Argon-specific fulfilment evidence.', FSF],
  ['30 Sep 2026', 'Restricted Fairwind rollout announced', 'Trusted defenders and internal teams, described as without cyber guardrails; broad release still to come. The retrieved post was modified on 1 October.', 'P3-SRC-005'],
  ['13 Oct 2026', 'Broad rollout begins; Fairwind expanded separately', 'Launch post 16:00 UTC, safety post 18:00 UTC. API and AI Studio, Antigravity, the Gemini app and AI Mode; the model card adds Gemini for business. Access may vary.', 'P3-SRC-006'],
  ['14 Oct 2026', 'ARGUS captures the six sources', '09:44 to 09:50 UTC. These bytes are hashed; the exact 13 October bytes and serving configuration are not authenticated.', null],
]

function P({ children, className = '' }) {
  return <p className={`${BODY} ${MEASURE} mb-6 ${className}`}>{children}</p>
}

function Heading({ label, text, id }) {
  return (
    <>
      <p className={`${LABEL} mb-6`}>{label}</p>
      <h2 id={id} className={`${DISPLAY_SM} mb-10 max-w-[24ch]`}>
        {text}
      </h2>
    </>
  )
}

function Reg({ html, className = '' }) {
  return <div className={`${REG} ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
}

export default function ArgusProof3Page() {
  const gapIds = Object.keys(P3.gaps)
  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
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
                Proof-3 &middot; Gemini 4 Argon
              </li>
            </ol>
          </nav>
          <p className={`${LABEL} mb-6`}>ARGUS Proof-3</p>
          <h1 className={`${DISPLAY} mb-6 max-w-[18ch]`}>Gemini 4 Argon</h1>
          <p className={`${LEAD} max-w-[44rem] mb-6`}>
            What the public cyberoffensive assurance record establishes
          </p>
          <p className={`font-mono text-xs md:text-sm tracking-[0.12em] ${GOLD} mb-10`}>
            INDEPENDENT RECONSTRUCTION &middot; GOOGLE DEEPMIND &middot; CYBEROFFENSIVE MISUSE &middot;
            BROAD ROLLOUT 13 OCTOBER 2026
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <a href={`${EXPLORER}#exec`} className="btn-primary !px-5 sm:!px-8 text-center text-[0.9375rem] sm:text-base">
              Explore the interactive assurance{' '}
              <span className="whitespace-nowrap">
                graph <span aria-hidden="true">&rarr;</span>
              </span>
            </a>
            <a href="#gaps" className="btn-secondary text-center">
              The seven gaps
            </a>
            <a href="/safety/argus" className="btn-secondary text-center">
              About ARGUS
            </a>
          </div>

          <div className="card-glass p-8 md:p-10 max-w-[48rem] border-l-2 border-l-[#d9b45e] mb-12">
            <p className="font-mono text-xs text-chrome/65 mb-5 tracking-wide">{'// The finding'}</p>
            <p className="text-[1.0625rem] md:text-[1.1875rem] leading-relaxed text-chrome-light font-normal mb-5">
              Google&rsquo;s public record makes its reason for mitigating inspectable, along with
              unusually concrete capability results, guarded test outcomes and adverse red-team
              findings. It supports the statement that Google made a pre-launch cyber safety case and
              a below-CCL residual-risk assessment. It does not independently establish the bridge
              from those results to that judgement, the full coverage of the 13 October deployment,
              or how well post-launch monitoring works against sustained misuse.
            </p>
            <p className="text-[1.0625rem] md:text-[1.1875rem] leading-relaxed text-chrome-light font-normal">
              ARGUS records seven open public-assurance gaps. They are requests for inspectable
              evidence, not findings that controls failed or that internal evidence does not exist.
            </p>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-[11rem_1fr] gap-x-8 gap-y-3 max-w-[44rem] mb-8">
            {scope.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className={`${LABEL} sm:pt-[0.35rem]`}>{k}</dt>
                <dd className="text-chrome-light text-[1.0625rem] mb-3 sm:mb-0">{v}</dd>
              </div>
            ))}
            <div className="contents">
              <dt className={`${LABEL} sm:pt-[0.35rem]`}>Status</dt>
              <dd className="text-chrome-light text-[1.0625rem]">
                Technical reconstruction complete. Presentation checked against the filed registers.{' '}
                <span className={GOLD}>No independent fidelity audit; not externally peer reviewed.</span>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* The claim */}
      <section className={`${SECTION} border-t border-white/5`} aria-labelledby="claim">
        <div className={SHELL}>
          <Heading label="Scope" text="The claim under examination" id="claim" />
          <P>
            ARGUS takes Google DeepMind&rsquo;s own words as the single root claim,{' '}
            <strong className={B}>P3-C-001</strong>, exactly as the Gemini 4 Argon model card prints
            them:
          </P>
          <figure className="max-w-[48rem] mb-6 border-l-2 border-l-[#8FA2F0] pl-6 md:pl-8">
            <blockquote>
              <p className="text-[1.25rem] md:text-[1.5rem] leading-snug text-chrome-light">
                &ldquo;Cybersecurity CCL: We cannot rule out that Gemini 4 Argon has reached this CCL,
                and we therefore developed a safety case for its cyberoffensive capabilities that we
                assess lower risk to below the cybersecurity CCL level.&rdquo;
              </p>
            </blockquote>
            <figcaption className="mt-4 font-mono text-xs text-chrome/65 leading-relaxed">
              Google DeepMind, Gemini 4 Argon Model Card, &ldquo;Frontier Safety Assessment&rdquo;,{' '}
              <Pg src={CARD} page={11}>
                PDF p.11
              </Pg>
              . The card&rsquo;s cyber table marks the CCL &ldquo;cannot be ruled out&rdquo; (
              <Pg src={CARD} page={12}>
                pp.12&ndash;13
              </Pg>
              ).
            </figcaption>
          </figure>
          <P className="mb-10">
            A CCL is a Critical Capability Level in Google&rsquo;s Frontier Safety Framework: here,
            enough uplift with high-impact cyber attacks to cause additional expected harm at severe
            scale, absent mitigation. The sentence makes three separate claims, and ARGUS keeps them
            apart. The full safety report (
            <Pg src={REPORT} page={34}>
              §3.2.2, pp.34&ndash;40
            </Pg>
            ) elaborates this position without displacing it; it describes the residual risk as{' '}
            &ldquo;substantially below&rdquo; the CCL.
          </P>

          <ol className="grid md:grid-cols-3 gap-6 mb-14">
            {clauses.map((c) => (
              <li key={c.n} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-7 flex flex-col">
                <p className={`font-mono text-xs tracking-[0.12em] ${GOLD} mb-3`}>CLAUSE {c.n}</p>
                <h3 className="text-[1.1875rem] leading-snug text-chrome-light mb-4">{c.head}</h3>
                <p className="text-[0.9375rem] leading-relaxed text-chrome/80 mb-4">
                  <span className="font-mono text-[0.6875rem] tracking-[0.12em] text-chrome/65 block mb-1">GOOGLE SAYS</span>
                  {c.google}
                </p>
                <p className="text-[0.9375rem] leading-relaxed text-chrome-light mt-auto">
                  <span className="font-mono text-[0.6875rem] tracking-[0.12em] text-[#d9b45e] block mb-1">ARGUS READS</span>
                  {c.reads}
                </p>
              </li>
            ))}
          </ol>

          <P className="mb-8">
            The <a className={VIOLET_LINK} href={`${EXPLORER}#exec`}>Executive assurance graph</a>{' '}
            gives a readable route from the claim to each gap, with a branch reader built from the
            executive checklist. The <a className={VIOLET_LINK} href={`${EXPLORER}#full`}>Full graph</a>{' '}
            renders all 53 nodes and 69 warranted relationships, with every evidence record&rsquo;s
            conditions, limits, page-linked sources and provenance.
          </P>
          <a
            href={`${EXPLORER}#exec`}
            aria-label="Open the interactive assurance graph full-screen"
            className="block rounded-2xl overflow-hidden border border-white/10 hover:border-[#a78bfa]/50 transition-colors mb-6"
          >
            <Image
              src={`${PATH}/executive-graph.png`}
              alt="ARGUS Proof-3 executive assurance graph: root claim P3-C-001, supported by arguments A-001 to A-003 and qualified by A-004 to A-007, the seven open public-assurance gaps G-001 to G-007, and eleven selected evidence nodes, two marked adverse."
              width={1600}
              height={930}
              className="w-full h-auto"
            />
          </a>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-3">
            <p className="text-sm leading-relaxed text-chrome/65">
              Select any node to inspect its register record, configuration, limitations, provenance
              and relationships. Drag to pan, scroll or pinch to zoom.
            </p>
            <p className="text-sm leading-relaxed text-chrome/65">
              P3 uses five relationship types: supports, qualifies, conditions, assumed_by and limits.
              Three arguments support the root; four qualify it.
            </p>
          </div>
        </div>
      </section>

      {/* Evidence */}
      <section className={`${SECTION} border-t border-white/5`} aria-labelledby="supports">
        <div className={SHELL}>
          <Heading label="Findings" text="What the public evidence supports" id="supports" />
          <P>
            Google&rsquo;s report gives concrete numbers. They come from three different settings and
            measure different things: scenarios, segments, modeled multipliers, per-query rates,
            per-objective rates, hours and requests.{' '}
            <strong className={B}>ARGUS never pools them</strong>, and none of them is a
            deployment-wide probability of harm. Each figure below links to its PDF page.
          </P>
          <P className="mb-12">
            <strong className={B}>QSR</strong> (query success rate) counts individual attack
            prompts that produce an actionable breach. <strong className={B}>OSR</strong> (objective
            success rate) counts harmful goals for which the attacker gets at least one breach across
            all attempts. A low QSR and a high OSR can both be true of the same test.
          </P>

          <div className="grid gap-8 mb-16">
            {groups.map((g) => (
              <div key={g.key} className={`rounded-2xl border border-white/10 bg-white/[0.02] border-l-2 ${g.accent} overflow-hidden`}>
                <div className="p-6 md:p-8 border-b border-white/10">
                  <h3 className="text-[1.25rem] text-chrome-light mb-2 flex flex-wrap items-center gap-3">
                    {g.label}
                    {g.adverse && (
                      <span className="rounded border border-[#FF5C8A]/60 px-2 py-0.5 font-mono text-[0.6875rem] tracking-[0.1em] text-[#FF8FB0]">
                        ADVERSE
                      </span>
                    )}
                  </h3>
                  <p className="text-sm leading-relaxed text-chrome/65 max-w-[46rem]">{g.setting}</p>
                </div>
                <ul className="divide-y divide-white/10">
                  {g.rows.map(([v, what, limit, page]) => (
                    <li key={what} className="p-6 md:px-8 md:py-5 grid md:grid-cols-[9.5rem_minmax(0,1fr)] gap-x-8 gap-y-2">
                      <p className="font-mono text-[1.5rem] leading-none text-chrome-light md:pt-1 whitespace-nowrap">{v}</p>
                      <div className="min-w-0">
                        <p className="text-[1.0625rem] text-chrome-light leading-snug mb-1">{what}</p>
                        <p className="text-sm leading-relaxed text-chrome/65">
                          {limit}{' '}
                          <Pg src={REPORT} page={page}>
                            Report p.{page}
                          </Pg>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h3 className={`${LEAD} text-chrome-light mb-6`}>Within one test, against the cited predecessor</h3>
          <P className="mb-8">
            Google compares Argon with an earlier Gemini model on the same test and metric. Those
            pairs are the only comparisons shown here; bars on different rows are different tests and
            are not comparable with each other. Lower is better for the defender.
          </P>
          <div className="grid gap-6 max-w-[46rem] mb-16" role="list">
            {pairs.map((p) => (
              <div key={p.test + p.metric} role="listitem" className="grid gap-2">
                <p className="text-sm text-chrome-light">
                  {p.test} &middot; <span className="font-mono">{p.metric}</span>{' '}
                  <span className="text-chrome/65">
                    (
                    <Pg src={REPORT} page={p.page}>
                      p.{p.page}
                    </Pg>
                    )
                  </span>
                </p>
                {[
                  ['Gemini 4 Argon', p.argon, 'bg-[#F07E5E]'],
                  ['Cited predecessor', p.prior, 'bg-white/25'],
                ].map(([who, val, col]) => (
                  <div key={who} className="grid grid-cols-[8.5rem_minmax(0,1fr)_3rem] items-center gap-3">
                    <span className="text-xs text-chrome/65">{who}</span>
                    <span className="h-3 rounded-sm bg-white/[0.04] overflow-hidden" aria-hidden="true">
                      <span className={`block h-full ${col}`} style={{ width: `${val}%` }} />
                    </span>
                    <span className="font-mono text-sm text-chrome-light text-right">{val}%</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <h3 className={`${LEAD} text-chrome-light mb-6`}>What the numbers support, and what they do not</h3>
          <P>
            The unmitigated results are substantial risk signals, and they make Google&rsquo;s
            decision to mitigate as if the CCL could be reached coherent. They do not confirm a
            crossing: the report labels its quantitative scores uncertain, has no TAC-4 challenges,
            and notes that novel attacks could exceed its historical reference class.
          </P>
          <P>
            The guarded results give meaningful, bounded support for safer responses and higher
            attacker friction, with a real cost to benign users. The external results show that
            &ldquo;near-zero per query&rdquo; is not &ldquo;no objective can be reached&rdquo;.
            Google says so itself: safeguards impose friction rather than eliminate risk, persistent
            actors may achieve partial bypasses, and reactive detection has discovery lag (
            <Pg src={REPORT} page={63}>
              p.63
            </Pg>
            ).
          </P>
          <P className="mb-0">
            Dual-use capability results elsewhere in the report (ExploitBench 87% best-of-three, 86%
            internal vulnerability discovery, 72% internal exploitation pass@1;{' '}
            <Pg src={REPORT} page={213}>
              pp.213&ndash;215
            </Pg>
            ) reinforce why safeguards matter. They are not guarded misuse tests.
          </P>
        </div>
      </section>

      {/* The bridge */}
      <section className={`${SECTION} border-t border-white/5`} aria-labelledby="bridge">
        <div className={SHELL}>
          <Heading label="The missing link" text="The bridge from results to the below-CCL judgement" id="bridge" />
          <P className="mb-10">
            Steps 1 to 3 are on the public record, and step 5 is Google&rsquo;s stated judgement that,
            with these safeguards, cyber risk sits below the CCL. Step 4 is what connects them. The
            Frontier Safety Framework calls for it to be an explicit residual-risk and governance
            determination (
            <Pg src={FSF} page={10}>
              FSF p.10
            </Pg>
            ). The public record says a case was developed and gives the conclusion; it does not show
            that reasoning.
          </P>
          <ol className="grid lg:grid-cols-5 gap-3 mb-10" aria-label="Assurance chain">
            {[
              ['Capability', 'Cannot rule out the CCL; 12/12 unmitigated scenarios; ~16.7x modeled uplift', 'Public', 'border-white/10'],
              ['Safety case', 'Developed before launch; layered classifiers, probes, monitoring, weight security', 'Described', 'border-white/10'],
              ['Guarded tests', 'Strong direct-request coverage; low QSR; 56% Gray Swan OSR; 12 Trajectory breaks', 'Public, mixed', 'border-white/10'],
              ['Acceptance', 'Criteria, residual-uplift calculation, adverse-result dispositions, decision record', 'Not public · G-002', 'border-dashed border-[#F07E5E]/70 bg-[#F07E5E]/[0.06]'],
              ['Below CCL', 'Google’s residual-risk assessment for the 13 October release', 'Google’s judgement', 'border-white/10'],
            ].map(([t, d, s, cls], i) => (
              <li key={t} className={`relative rounded-xl border ${cls} p-5 flex flex-col`}>
                <p className="font-mono text-[0.6875rem] tracking-[0.12em] text-chrome/65 mb-2">STEP {i + 1}</p>
                <p className="text-[1.0625rem] text-chrome-light mb-2">{t}</p>
                <p className="text-sm leading-relaxed text-chrome/65 mb-4">{d}</p>
                <p className={`mt-auto font-mono text-xs ${i === 3 ? 'text-[#F07E5E]' : GOLD}`}>{s}</p>
              </li>
            ))}
          </ol>
          <div className="max-w-[48rem]">
            <p className={`${LABEL} mb-3`}>What is missing, in the gap register&rsquo;s words</p>
            <Reg html={P3.gaps['P3-G-002'].missing} className={`${BODY} mb-6`} />
            <P className="mb-0">
              The internal case and decision may be complete and well supported. The public report is
              consistent with that; it cannot independently establish it.{' '}
              <a className={VIOLET_LINK} href={`${EXPLORER}#exec/P3-G-002`}>
                Read G-002 in the graph
              </a>
              .
            </P>
          </div>
        </div>
      </section>

      {/* Release phases and custody */}
      <section className={`${SECTION} border-t border-white/5`} aria-labelledby="phases">
        <div className={SHELL}>
          <Heading label="Release boundary" text="Two rollouts, two configurations" id="phases" />
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
              <p className={`font-mono text-xs tracking-[0.12em] text-[#6DB4E8] mb-3`}>30 SEPTEMBER &middot; RESTRICTED</p>
              <h3 className="text-[1.25rem] text-chrome-light mb-4">Fairwind trusted access</h3>
              <p className="text-[0.9375rem] leading-relaxed text-chrome/80 mb-4">
                Google announced Argon for trusted defenders and internal teams{' '}
                <strong className={B}>without cyber guardrails</strong>, with broad availability
                still to come (<Web src="P3-SRC-005">30 September post</Web>). The report describes
                Fairwind&rsquo;s tailored mitigations and continuous monitoring that permit specialised
                dual-use work (<Pg src={REPORT} page={12}>pp.12&ndash;13</Pg>).
              </p>
              <p className="text-sm leading-relaxed text-chrome/65">
                A distinct phase and configuration. Its access terms are never used as broad-release
                terms, and its evidence is not pooled with broad-release guardrail tests.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
              <p className={`font-mono text-xs tracking-[0.12em] ${GOLD} mb-3`}>13 OCTOBER &middot; BROAD</p>
              <h3 className="text-[1.25rem] text-chrome-light mb-4">The release this case examines</h3>
              <p className="text-[0.9375rem] leading-relaxed text-chrome/80 mb-4">
                Google began a broader rollout across API and AI Studio, Antigravity, the Gemini app
                and AI Mode (<Web src="P3-SRC-006">launch post</Web>), with Gemini for business on
                the <Pg src={CARD} page={4}>model card, p.4</Pg>, and separately expanded Fairwind (
                <Web src="P3-SRC-004">safety post</Web>).
              </p>
              <p className="text-sm leading-relaxed text-chrome/65">
                The report says inference safeguards may be used as appropriate and that intervention
                style depends on surface. No public per-surface configuration map exists (G-004).
              </p>
            </div>
          </div>

          <h3 className={`${LEAD} text-chrome-light mb-8`}>
            The 14 October capture and the release-day bytes
          </h3>
          <ol className="relative border-l border-white/15 ml-2 mb-10 max-w-[48rem]">
            {timeline.map(([d, t, n, s]) => (
              <li key={d + t} className="pl-6 pb-8 last:pb-0 relative">
                <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-[#d9b45e]" aria-hidden="true" />
                <p className="font-mono text-xs tracking-[0.1em] text-chrome/65 mb-1">{d}</p>
                <p className="text-[1.0625rem] text-chrome-light mb-1">
                  {s ? <Web src={s}>{t}</Web> : t}
                </p>
                <p className="text-sm leading-relaxed text-chrome/65">{n}</p>
              </li>
            ))}
          </ol>
          <P className="mb-0">
            The card and report carry only &ldquo;October 2026&rdquo; as their date, and the
            13 October posts link them. That strongly supports their availability on release day, but
            the next-day copies cannot by themselves prove the exact release-day wording or the
            served model and guardrail versions. Model C, the final release candidate, is the tested
            checkpoint (<Pg src={REPORT} page={161}>Table 3.8, pp.161&ndash;162</Pg>). No change is
            evidenced: this gap (G-007) concerns custody, not a claim that anything was edited.
          </P>
        </div>
      </section>

      {/* Seven gaps */}
      <section id="gaps" className={`${SECTION} border-t border-white/5`} aria-labelledby="gaps-h">
        <div className={SHELL}>
          <Heading label="Open links" text="Seven open public-assurance gaps" id="gaps-h" />
          <Reg html={P3.gap_scope} className={`${BODY} ${MEASURE} mb-6`} />
          <P className="mb-10">
            Open each gap for its full investigation, quoted from the gap register: why it matters,
            what is missing, what would close it, the alternative reading, and the evidence it cites.
          </P>
          <div className="border-y border-white/10 divide-y divide-white/10 mb-10">
            {gapIds.map((gid) => {
              const g = P3.gaps[gid]
              const id = gid.replace('P3-', '')
              return (
                <details key={gid} id={id} className="group">
                  <summary className="list-none cursor-pointer py-6 grid grid-cols-[4.5rem_minmax(0,1fr)_auto] md:grid-cols-[7rem_minmax(0,1fr)_auto] gap-x-4 md:gap-x-8 items-baseline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#a78bfa] [&::-webkit-details-marker]:hidden">
                    <span className="font-mono text-sm text-[#F07E5E]">{id}</span>
                    <span className="text-[1.0625rem] md:text-[1.1875rem] text-chrome-light leading-snug">{g.heading}</span>
                    <span className="font-mono text-xs text-chrome/65 whitespace-nowrap" aria-hidden="true">
                      <span className="group-open:hidden">Open +</span>
                      <span className="hidden group-open:inline">Close &minus;</span>
                    </span>
                  </summary>
                  <div className="pb-8 md:pl-[9rem] grid gap-6 max-w-[56rem]">
                    {[
                      ['Why it matters', g.why],
                      ['Missing public evidence', g.missing],
                      ['Evidence that would narrow or close it', g.closure],
                      ['Alternative interpretation', g.alternative],
                      ['Reason missing', g.reason],
                    ].map(([label, html]) => (
                      <div key={label}>
                        <p className={`${LABEL} mb-2`}>{label}</p>
                        <Reg html={html} className="text-[1rem] leading-relaxed text-chrome/85" />
                      </div>
                    ))}
                    <div>
                      <p className={`${LABEL} mb-2`}>Graph links and observed evidence</p>
                      <Reg html={g.links} className="text-sm leading-relaxed text-chrome/65 mb-3" />
                      <ul className="flex flex-wrap gap-2" aria-label={`Evidence cited for ${id}`}>
                        {g.evidence_ids.map((e) => (
                          <li key={e}>
                            <a
                              href={`${EXPLORER}#full/${e}`}
                              className="inline-flex items-center min-h-[36px] rounded border border-white/15 px-3 font-mono text-xs text-chrome-light hover:border-[#a78bfa]/60 hover:text-[#c4b5fd] transition-colors"
                            >
                              {e.replace('P3-', '')}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                      <a className={`text-sm ${VIOLET_LINK}`} href={`${EXPLORER}#exec/${gid}`}>
                        Read this branch in the Executive graph &rarr;
                      </a>
                      <a className={`text-sm ${VIOLET_LINK}`} href={`${EXPLORER}#full/${gid}/iso`}>
                        Isolate it in the Full graph &rarr;
                      </a>
                    </div>
                  </div>
                </details>
              )
            })}
          </div>
          <div className="card-glass p-6 md:p-8 max-w-[48rem] border-l-2 border-l-[#d9b45e]">
            <p className={`${LABEL} mb-3`}>Grouping and closure discipline</p>
            <Reg html={P3.gap_grouping} className="text-[1.0625rem] leading-relaxed text-chrome-light" />
          </div>
        </div>
      </section>

      {/* How to read */}
      <section id="reading" className={`${SECTION} border-t border-white/5`} aria-labelledby="read">
        <div className={SHELL}>
          <Heading label="Method" text="How to read this work" id="read" />
          <P>
            ARGUS is an independent <strong className={B}>documentary reconstruction</strong> of
            public sources. No live model was queried, no exploit was run and no confidential source
            was used. It is not a penetration test, a safety certification, a policy-compliance
            finding or a ranking of models. The typed graph separates Google&rsquo;s statements from
            ARGUS interpretation and records every warrant, assumption and adverse result.
          </P>
          <P>
            The research was filed on <strong className={B}>14 October 2026</strong>, the day after
            the release. This presentation was checked against the filed registers by its author.{' '}
            <strong className={B}>
              It has not had an independent fidelity audit, and the study has not been externally
              peer reviewed.
            </strong>{' '}
            Findings may be revised with cited corrections.
          </P>
          <P className="mb-10">
            Challenges are welcome: a source locator, contrary evidence or a better argument against
            any edge or evidence record. Criticism that narrows or corrects a link is a useful
            outcome.
          </P>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href={`${EXPLORER}#exec`} className="btn-primary inline-flex items-center justify-center gap-2 !px-5 sm:!px-8">
              Open Executive and Full Assurance Graphs <span aria-hidden="true">&rarr;</span>
            </a>
            <a href="mailto:hello@automadynamics.com?subject=ARGUS%20Proof-3%20review" className="btn-secondary text-center">
              Send a challenge or correction
            </a>
          </div>
        </div>
      </section>

      {/* Sources */}
      <section id="sources" className={`${SECTION} border-t border-white/5`} aria-labelledby="src">
        <div className={SHELL}>
          <Heading label="Provenance" text="Public sources and provenance" id="src" />
          <P className="mb-10">
            Six public publisher documents. ARGUS hashed the copies it retrieved on 14 October; the
            links below open the publisher&rsquo;s current copies, and each note says how they
            compare. PDF page numbers are one-based file pages; the safety report&rsquo;s printed page
            numbers are one lower.
          </P>
          <ul className="divide-y divide-white/10 border-y border-white/10 mb-8">
            {Object.entries(SRC).map(([id, s]) => (
              <li key={id} className="py-6 grid grid-cols-1 md:grid-cols-[8.5rem_minmax(0,1fr)] gap-x-8 gap-y-2">
                <span className="font-mono text-xs text-chrome/65 md:pt-1">{id}</span>
                <div className="min-w-0">
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className={`text-[1.0625rem] [overflow-wrap:anywhere] ${VIOLET_LINK}`}>
                    {s.title}
                    <span aria-hidden="true"> &#8599;</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  <p className="text-sm leading-relaxed text-chrome-light/90 mt-2 max-w-[48rem]">{s.note}</p>
                  <details className="mt-3 max-w-[48rem]">
                    <summary className="cursor-pointer font-mono text-xs text-chrome/65 hover:text-chrome-light min-h-[32px] inline-flex items-center">
                      Dates, capture hash and release-time limits
                    </summary>
                    <dl className="mt-3 grid gap-3 text-sm leading-relaxed text-chrome/65">
                      {[
                        ['Publisher date', s.date],
                        ['ARGUS capture', s.retrieval],
                        ['Pages and case use', s.use],
                        ['Release-time qualification', s.qualification],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <dt className="font-mono text-[0.6875rem] tracking-[0.12em] text-chrome/65 uppercase">{k}</dt>
                          <dd>
                            <Reg html={v} />
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </details>
                </div>
              </li>
            ))}
          </ul>
          <div className="max-w-[48rem]">
            <p className={`${LABEL} mb-3`}>Historical custody rule</p>
            <Reg html={P3.custody_rule} className="text-sm leading-relaxed text-chrome/65" />
          </div>
        </div>
      </section>

      {/* Boundary and artifacts */}
      <section className={`${SECTION} border-t border-white/5`}>
        <div className={`${SHELL} grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 [&>*]:min-w-0`}>
          <div>
            <p className={`${LABEL} mb-6`}>Research boundary</p>
            <p className={`${BODY} mb-6`}>
              Published by Automa Dynamics / ARGUS. Independent research; no affiliation,
              endorsement or certification by Google or Google DeepMind.
            </p>
            <p className={`${BODY} mb-6`}>
              Gaps describe the inspected public record. They do not mean Google lacks private
              evidence, that a control failed, that a policy was breached or that an incident
              occurred.
            </p>
            <p className={BODY}>
              Counts are link judgements, not safety scores, and no cross-model ranking is made.
            </p>
          </div>
          <div>
            <p className={`${LABEL} mb-6`}>Proof-3 artifacts</p>
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {[
                ['View', 'Executive assurance graph', `${EXPLORER}#exec`, '→'],
                ['View', 'Full assurance graph', `${EXPLORER}#full`, '→'],
                ['Read', 'The seven gap investigations', '#gaps', '→'],
                ['Inspect', 'Machine-readable Graph JSON', GRAPH_JSON, 'JSON'],
                ['About', 'ARGUS method and earlier proofs', '/safety/argus', '→'],
                ['Contact', 'hello@automadynamics.com', 'mailto:hello@automadynamics.com?subject=ARGUS%20Proof-3', '→'],
              ].map(([verb, label, href, tail]) => (
                <li key={label}>
                  <a href={href} className="group grid grid-cols-[5rem_minmax(0,1fr)_auto] sm:grid-cols-[6.5rem_minmax(0,1fr)_auto] items-baseline gap-4 py-4">
                    <span className={LABEL}>{verb}</span>
                    <span className={`text-[1.0625rem] [overflow-wrap:anywhere] ${VIOLET_LINK}`}>{label}</span>
                    <span className="font-mono text-xs text-chrome/65 group-hover:text-chrome-light transition-colors" aria-hidden="true">
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
