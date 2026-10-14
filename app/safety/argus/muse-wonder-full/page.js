import { SITE_URL } from '../../../../lib/articles'
import Image from 'next/image'
import P4 from '../../../../lib/argusP4.data.json'

/* ARGUS Proof-4 findings: Meta / Muse Wonder Full / cybersecurity. Copy follows the filed research
   (proof4/ARGUS_P4_ASSURANCE_ASSESSMENT.md, the executive checklist and the evidence register); every figure
   keeps its own metric, setting and PDF page. Figures are read from lib/argusP4.data.json, where
   scripts/sync-argus-p4.py has checked each one against the graph's own evidence statements. Gap
   investigations and source provenance are the registers' own text, lifted verbatim (hash-guarded).
   Model-card results and launch-chart results are kept in separate blocks and never pooled. Static like
   the other ARGUS pages: a research page should be there on first paint. */

const PATH = '/safety/argus/muse-wonder-full'
const EXPLORER = `${PATH}/explore`
const GRAPH_JSON = '/safety/argus/files/ARGUS_P4_ASSURANCE_GRAPH.json'
const GRAPH_SHA = P4.graph_sha256
const INV = P4.inventory

const TITLE = 'Muse Wonder Full: What the Public Cybersecurity Assurance Record Establishes'
const DESCRIPTION =
  'ARGUS Proof-4 independently reconstructs the public cybersecurity assurance record for Meta’s Muse Wonder Full. Meta assesses the unmitigated model as “moderate or lower” for cybersecurity; ARGUS records seven open public-assurance gaps, requests for inspectable evidence, not findings that safeguards failed. Not affiliated with Meta.'

export const metadata = {
  title: 'ARGUS Proof-4: Muse Wonder Full',
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    title: `ARGUS Proof-4 | ${TITLE}`,
    description: DESCRIPTION,
    url: PATH,
    type: 'article',
    images: [
      {
        url: `${PATH}/executive-graph.png`,
        width: 1600,
        height: 1000,
        alt: 'ARGUS Proof-4 executive assurance graph for Muse Wonder Full',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `ARGUS Proof-4 | ${TITLE}`,
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
  datePublished: '2026-10-14',
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

const SRC = P4.sources
const CARD = 'P4-SRC-001'
const FW = 'P4-SRC-002'
const LAUNCH = 'P4-SRC-003'
const NEWS = 'P4-SRC-004'
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
function Web({ src, frag, children }) {
  return (
    <a
      className={VIOLET_LINK}
      href={SRC[src].url + (frag ? `#:~:text=${encodeURIComponent(frag)}` : '')}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  )
}

/* Figures, checked against the graph by the build. */
const [CYBERGYM, EXPLOITBENCH] = P4.figures.card_capability
const EG = P4.figures.exploitgym
const ASR = P4.figures.card_asr
const CHARTS = P4.figures.charts

const scope = [
  ['Organisation', 'Meta'],
  ['Tested system', 'Muse Wonder Full'],
  ['Family extension', 'Smaller Muse Wonder, by Meta’s inference'],
  ['Risk domain', 'Cybersecurity only'],
  ['Release', '12 October 2026'],
  ['Sources captured', '14 October 2026'],
  ['Claim', 'P4-C-001'],
]

const scopeCards = [
  {
    n: '1',
    head: 'Cybersecurity only',
    meta: 'The sentence covers both Cybersecurity and Loss of Control.',
    reads:
      'Only the cybersecurity component is reconstructed. Loss of Control stays in the quotation so Meta’s words are not edited, and is outside this analysis.',
  },
  {
    n: '2',
    head: 'The unmitigated baseline',
    meta: 'The category applies before mitigations. The next sentence reports the same category across all domains with safeguards in place, which supports the decision to deploy.',
    reads:
      'The root is the unmitigated cyber assessment. The mitigated all-domain judgement is context, not a second root, and this case never says cyber risk was reduced from high to moderate.',
  },
  {
    n: '3',
    head: 'Wonder Full, then the family',
    meta: 'Results are from Muse Wonder Full, the most capable variant, “which is why the assessment covers every model in the family.”',
    reads:
      'Wonder Full is the tested variant. Extending its results to the smaller Muse Wonder is Meta’s inference, not independently established equivalence.',
  },
]

const timeline = [
  ['2 Oct 2026', 'Scaling Framework v2.1 dated and explained', 'Framework p.51 and the explanation post agree on the date. General policy, not Wonder-specific fulfilment evidence.', 'P4-SRC-005'],
  ['12 Oct 2026', 'Muse Wonder and Muse Wonder Full released', 'Model card, launch research post and announcement (17:08 UTC). Both launch publications say a fuller safety report “will be available soon”.', LAUNCH],
  ['13 Oct 2026', 'Announcement modified', 'Its page metadata records a modification at 17:27 UTC. The exact 12 October wording is not presumed.', NEWS],
  ['14 Oct 2026', 'ARGUS captures the sources and checks for the report', 'Six documents captured 13:08 to 13:10 UTC; report-availability check 13:11 UTC; three launch charts captured 13:19 UTC. Hashes identify these bytes, not the release-day bytes or serving configuration.', null],
]

function P({ children, className = '' }) {
  return <p className={`${BODY} ${MEASURE} mb-6 ${className}`}>{children}</p>
}

function Heading({ label, text, id }) {
  return (
    <>
      <p className={`${LABEL} mb-6`}>{label}</p>
      <h2 id={id} className={`${DISPLAY_SM} mb-10 max-w-[24ch] scroll-mt-36`}>
        {text}
      </h2>
    </>
  )
}

function Reg({ html, className = '' }) {
  return <div className={`${REG} ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
}

function GapLink({ id, children }) {
  return (
    <a className={VIOLET_LINK} href={`#${id}`}>
      {children || id}
    </a>
  )
}

/* One stat with its qualifier and page link. */
function Stat({ value, what, limit, page }) {
  return (
    <li className="p-6 md:px-8 md:py-5 grid md:grid-cols-[9.5rem_minmax(0,1fr)] gap-x-8 gap-y-2">
      <p className="font-mono text-[1.5rem] leading-none text-chrome-light md:pt-1 whitespace-nowrap">{value}</p>
      <div className="min-w-0">
        <p className="text-[1.0625rem] text-chrome-light leading-snug mb-1">{what}</p>
        <p className="text-sm leading-relaxed text-chrome/65">
          {limit}{' '}
          <Pg src={CARD} page={page}>
            Card p.{page}
          </Pg>
        </p>
      </div>
    </li>
  )
}

export default function ArgusProof4Page() {
  const gapIds = Object.keys(P4.gaps)
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
                Proof-4 &middot; Muse Wonder Full
              </li>
            </ol>
          </nav>
          <p className={`${LABEL} mb-6`}>ARGUS Proof-4</p>
          <h1 className={`${DISPLAY} mb-6 max-w-[18ch]`}>Muse Wonder Full</h1>
          <p className={`${LEAD} max-w-[44rem] mb-6`}>
            What the public cybersecurity assurance record establishes
          </p>
          <p className={`font-mono text-xs md:text-sm tracking-[0.12em] ${GOLD} mb-10`}>
            INDEPENDENT RECONSTRUCTION &middot; META &middot; CYBERSECURITY &middot; RELEASED 12 OCTOBER 2026
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
              Meta&rsquo;s public record makes its baseline cybersecurity assessment of Muse Wonder Full
              inspectable, together with three capability results, a material ExploitGym scoring
              correction that Meta discloses itself, six guarded attack-success results and three
              separate launch-chart measures. It supports the statement that Meta assessed the
              unmitigated model as &ldquo;moderate or lower&rdquo; for cybersecurity and reviewed a
              mitigated assessment before deployment. It does not independently establish how those
              results map to the threat scenarios the category covers, whether the tested Full results
              transfer to the smaller Wonder or to the served product, the reasoning that accepted the
              remaining risk, or how well the controls keep working after launch.
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
            ARGUS takes one sentence from Meta&rsquo;s model card as the single root claim,{' '}
            <strong className={B}>P4-C-001</strong>, exactly as printed:
          </P>
          <figure className="max-w-[48rem] mb-6 border-l-2 border-l-[#8FA2F0] pl-6 md:pl-8">
            <blockquote>
              <p className="text-[1.25rem] md:text-[1.5rem] leading-snug text-chrome-light">
                &ldquo;Our evaluations put the unmitigated model at &lsquo;moderate or lower&rsquo; for
                both Cybersecurity and Loss of Control before applying our mitigations.&rdquo;
              </p>
            </blockquote>
            <figcaption className="mt-4 font-mono text-xs text-chrome/65 leading-relaxed">
              Meta, Muse Wonder Model Card, &sect;4 &ldquo;Risk assessments under the Meta
              Superintelligence Scaling Framework&rdquo;,{' '}
              <Pg src={CARD} page={7}>
                PDF p.7
              </Pg>
              , opening paragraph, penultimate sentence. Inner quotation marks as printed.
            </figcaption>
          </figure>
          <P>
            <strong className={B}>In plain English:</strong> Meta says its evaluations placed Wonder
            Full in the &lsquo;moderate or lower&rsquo; cybersecurity risk category before applying the
            additional mitigations described in its assessment. &ldquo;Moderate or lower&rdquo; is a category in Meta&rsquo;s Superintelligence
            Scaling Framework. It means the model cannot substantially contribute to the catastrophic
            cyber scenarios the framework defines, while still allowing that it has relevant cyber
            skills. It is not a promise that every harmful request is refused, and it is not a numerical
            safety score (
            <Pg src={FW} page={18}>
              framework pp.17&ndash;19
            </Pg>
            ).
          </P>
          <P className="mb-10">
            The sentence carries three scope decisions, and ARGUS keeps them apart. The same paragraph
            also says Meta does not rule out the high-risk threshold in the Chemical &amp; Biological
            domain, and applies safety post-training and system-level classifiers designed for that
            domain. That uncertainty and those safeguards are <strong className={B}>not</strong>{' '}
            transferred to cybersecurity.
          </P>

          <ol className="grid md:grid-cols-3 gap-6 mb-14">
            {scopeCards.map((c) => (
              <li key={c.n} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-7 flex flex-col">
                <p className={`font-mono text-xs tracking-[0.12em] ${GOLD} mb-3`}>SCOPE {c.n}</p>
                <h3 className="text-[1.1875rem] leading-snug text-chrome-light mb-4">{c.head}</h3>
                <p className="text-[0.9375rem] leading-relaxed text-chrome/80 mb-4">
                  <span className="font-mono text-[0.6875rem] tracking-[0.12em] text-chrome/65 block mb-1">META SAYS</span>
                  {c.meta}
                </p>
                <p className="text-[0.9375rem] leading-relaxed text-chrome-light mt-auto">
                  <span className="font-mono text-[0.6875rem] tracking-[0.12em] text-[#d9b45e] block mb-1">ARGUS READS</span>
                  {c.reads}
                </p>
              </li>
            ))}
          </ol>

          <P className="mb-8">
            The <a className={VIOLET_LINK} href={`${EXPLORER}#exec`}>Executive assurance graph</a> gives a
            readable route from the claim to each gap, with a branch reader built from the executive
            checklist. The <a className={VIOLET_LINK} href={`${EXPLORER}#full`}>Full graph</a> renders
            all {INV.nodes} nodes and {INV.edges} warranted relationships, with every evidence
            record&rsquo;s setup, limits, page-linked sources and provenance.
          </P>
          <a
            href={`${EXPLORER}#exec`}
            aria-label="Open the interactive assurance graph full-screen"
            className="block rounded-2xl overflow-hidden border border-white/10 hover:border-[#a78bfa]/50 transition-colors mb-6"
          >
            <Image
              src={`${PATH}/executive-graph.png`}
              alt="ARGUS Proof-4 executive assurance graph: root claim P4-C-001, its seven arguments (one defines scope, one supports, four qualify, one contextualizes), the seven open public-assurance gaps G-001 to G-007, and thirteen selected evidence nodes, two from launch charts."
              width={1600}
              height={1000}
              className="w-full h-auto"
            />
          </a>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-3">
            <p className="text-sm leading-relaxed text-chrome/65">
              Select any node to inspect its register record, setup, limits, provenance and
              relationships. Drag to pan, scroll or pinch to zoom.
            </p>
            <p className="text-sm leading-relaxed text-chrome/65">
              P4 uses eight relationship types: reports, supports, qualifies, defines scope,
              contextualizes, conditions, assumed by and limits. At the root, one argument supports, four
              qualify, one defines scope and one contextualizes.
            </p>
          </div>
        </div>
      </section>

      {/* Baseline classification */}
      <section className={`${SECTION} border-t border-white/5`} aria-labelledby="baseline">
        <div className={SHELL}>
          <Heading label="Baseline" text="What the cyber risk classification covers" id="baseline" />
          <P>
            The framework&rsquo;s cybersecurity category is about catastrophic outcomes, not everyday
            misuse. It names three outcome families (
            <Pg src={FW} page={20}>
              framework pp.20&ndash;22
            </Pg>
            ), all ending in large-scale casualties or significant financial loss:
          </P>
          <ol className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              ['Cyber 1', 'Lowered barriers or cost for attacks that produce large-scale casualties or significant financial loss.'],
              ['Cyber 2', 'Discovery and reliable exploitation of critical zero-day vulnerabilities in popular software.'],
              ['Cyber 3', 'Scaled, long-form fraud, extortion and scams.'],
            ].map(([k, v]) => (
              <li key={k} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <p className={`font-mono text-xs tracking-[0.12em] ${GOLD} mb-2`}>{k.toUpperCase()}</p>
                <p className="text-[0.9375rem] leading-relaxed text-chrome-light">{v}</p>
              </li>
            ))}
          </ol>
          <P>
            The framework sets no universal benchmark percentage. Its operational method (
            <Pg src={FW} page={30}>
              pp.30&ndash;32
            </Pg>
            ) starts with professional offensive tasks compared with human experts, escalates from
            simple to complex realistic challenges when results warrant it, and looks for reliable,
            consistent success before a high-risk call. Cyber 3 uses bottleneck analysis and
            deployment-specific evaluations.
          </P>
          <P className="mb-0">
            The card publishes three capability results, and they are relevant inputs. What is not
            public is the Full-specific audit trail connecting them to all three outcome families:
            human or cost baselines, the escalation decision, complex-challenge results, any Cyber 3
            evaluation, and the criterion-by-criterion judgement. A defensible qualitative rule would be
            enough; nobody needs a magic number. This is <GapLink id="G-001" />. It does not show those
            evaluations were not done.
          </P>
        </div>
      </section>

      {/* Capability */}
      <section className={`${SECTION} border-t border-white/5`} aria-labelledby="capability">
        <div className={SHELL}>
          <Heading label="Capability" text="Capability testing, with its qualifications" id="capability" />
          <P className="mb-12">
            The card&rsquo;s capability table reports Wonder Full on three offensive-security benchmarks.
            These measure what the model can do, not how well safeguards hold. None of the three comes
            with a task count, number of attempts, repeats, confidence interval, harness description or
            a record of which mitigations were removed for the run.
          </P>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] border-l-2 border-l-[#C995DA] overflow-hidden mb-12">
            <div className="p-6 md:p-8 border-b border-white/10">
              <h3 className="text-[1.25rem] text-chrome-light mb-2">Model card &middot; Wonder Full &middot; capability table</h3>
              <p className="text-sm leading-relaxed text-chrome/65 max-w-[46rem]">
                Placed under the unmitigated assessment. Developer-reported; ARGUS has not reproduced
                any result.
              </p>
            </div>
            <ul className="divide-y divide-white/10">
              <Stat value={CYBERGYM[2]} what="CyberGym" limit="No cyber-specific task count, pass@k, repeats or interval. Not a safeguard test." page={7} />
              <Stat value={EXPLOITBENCH[2]} what="ExploitBench" limit="Denominator and aggregation not stated. Another developer’s ExploitBench setup is not assumed." page={7} />
              <li className="p-6 md:px-8 md:py-6 grid md:grid-cols-[9.5rem_minmax(0,1fr)] gap-x-8 gap-y-3">
                <p className="font-mono text-[1.5rem] leading-none text-chrome-light md:pt-1 whitespace-nowrap">
                  {EG.intended}
                  <span className="text-chrome/65 text-[1rem]"> of {EG.total}</span>
                </p>
                <div className="min-w-0">
                  <p className="text-[1.0625rem] text-chrome-light leading-snug mb-3">
                    ExploitGym: {EG.total} flags captured, only {EG.intended} through the intended
                    vulnerability
                  </p>
                  <div className="mb-3" role="img" aria-label={`ExploitGym flags: ${EG.intended} via intended vulnerabilities and ${EG.unintended} via unintended vulnerabilities, ${EG.total} in total. These are counts of flags, not percentages.`}>
                    <div className="flex h-7 rounded-md overflow-hidden border border-white/10 font-mono text-xs">
                      <div className="bg-[#d9b45e] text-[#101318] flex items-center justify-center" style={{ width: `${(EG.intended / EG.total) * 100}%` }}>
                        {EG.intended}
                      </div>
                      <div
                        className="bg-white/[0.06] text-chrome-light flex items-center justify-center"
                        style={{ width: `${(EG.unintended / EG.total) * 100}%`, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.07) 0 6px, transparent 6px 12px)' }}
                      >
                        {EG.unintended} unintended
                      </div>
                    </div>
                    <div className="flex justify-between mt-1.5 text-xs text-chrome/65">
                      <span>intended route: comparable to the published ranking</span>
                      <span className="text-right">unintended routes: not intended-task successes</span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-chrome/65">
                    Meta&rsquo;s own footnote: a verification pass with a GPT-cyber verifier,
                    &ldquo;independently confirmed with Gemini 3.1 Pro&rdquo;, found {EG.intended} flags used
                    the intended vulnerability and {EG.unintended} came through unintended ones, so{' '}
                    {EG.intended} &ldquo;is the figure comparable to the published ranking.&rdquo; These are
                    counts of flags, not a percentage or task denominator.{' '}
                    <Pg src={CARD} page={7}>
                      Card p.7
                    </Pg>
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <h3 className={`${LEAD} text-chrome-light mb-6`}>Reading the ExploitGym correction both ways</h3>
          <P>
            Disclosing the split is useful: it stops the {EG.total}-flag headline being read as a count
            of intended exploits, and ARGUS never presents it as one. But the {EG.unintended} unintended routes are not nothing either. They raise a
            benchmark-validity question, and they may still show real exploitation capability. They do
            not, by themselves, show a production compromise, a safeguard bypass or a catastrophic
            outcome.
          </P>
          <P className="mb-0">
            Two model verifiers agreeing is developer-reported cross-checking, not an independent
            institutional audit; shared adjudication errors remain possible. The public record has no
            attempted-task total, no verifier confusion matrix and no sanitized flag-by-flag
            adjudication. This is <GapLink id="G-002" />.
          </P>
        </div>
      </section>

      {/* Guarded results */}
      <section className={`${SECTION} border-t border-white/5`} aria-labelledby="guarded">
        <div className={SHELL}>
          <Heading label="Guarded behaviour" text="Guarded results, including the attacks that succeeded" id="guarded" />
          <P>
            <strong className={B}>Attack success rate (ASR)</strong> is the share of attack attempts that
            succeeded under each test&rsquo;s own scoring. Lower is better for the defender. An ASR is
            not a refusal rate: an attack can fail without an explicit refusal. So ARGUS does not
            subtract these figures from 100, does not average them, and does not turn any row into a
            real-world probability of harm.
          </P>
          <P className="mb-10">
            The card&rsquo;s adversarial-refusal table reports six ASRs for Wonder Full, single-turn and
            multi-turn, on three separate setups (
            <Pg src={CARD} page={8}>
              card pp.7&ndash;8
            </Pg>
            ). Each setup keeps its own name: CyberBench is not treated as Cybench.
          </P>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] border-l-2 border-l-[#9CCB6A] overflow-hidden mb-6">
            <div className="p-6 md:p-8 border-b border-white/10">
              <h3 className="text-[1.25rem] text-chrome-light mb-2">Model card &middot; Wonder Full &middot; adversarial refusal table</h3>
              <p className="text-sm leading-relaxed text-chrome/65 max-w-[46rem]">
                Attack success rate, %, lower is better. No denominators, attempts, budgets, scoring rules
                or safeguard stack are published.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[30rem]">
                <caption className="sr-only">Muse Wonder Full attack success rates from the model card, page 8</caption>
                <thead>
                  <tr className="border-b border-white/10">
                    <th scope="col" className={`${LABEL} px-6 md:px-8 py-4 font-normal`}>Setup</th>
                    <th scope="col" className={`${LABEL} px-4 py-4 font-normal text-right`}>Single turn</th>
                    <th scope="col" className={`${LABEL} px-6 md:px-8 py-4 font-normal text-right`}>Multi turn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {ASR.map(([id, name, s, m]) => (
                    <tr key={id}>
                      <th scope="row" className="px-6 md:px-8 py-5 text-[1.0625rem] text-chrome-light font-normal">
                        {name}
                        <span className="block font-mono text-xs text-chrome/65 mt-1">{id.replace('P4-', '')}</span>
                      </th>
                      <td className="px-4 py-5 font-mono text-[1.25rem] text-chrome-light text-right">{s}</td>
                      <td className="px-6 md:px-8 py-5 font-mono text-[1.25rem] text-chrome-light text-right">{m}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <P className="mb-14">
            These are favourable results within their test conditions, and ARGUS reports them as such.
            They are also not zero. RedCode&rsquo;s {ASR[2][2]} and {ASR[2][3]} are a material qualification
            to Meta&rsquo;s summary that Wonder Full &ldquo;demonstrates strong robustness to adversarial
            attacks across all benchmarks&rdquo;. PolyGuard&rsquo;s multi-turn value is higher than its
            single-turn one and RedCode&rsquo;s is lower; without task and budget detail, neither shows
            that extra turns help or hurt in general.
          </P>

          <div className="rounded-2xl border border-dashed border-[#ABA6F2]/60 bg-[#ABA6F2]/[0.03] overflow-hidden mb-6">
            <div className="p-6 md:p-8 border-b border-white/10">
              <p className="font-mono text-xs tracking-[0.12em] text-[#ABA6F2] mb-3">SEPARATE SOURCE &middot; LAUNCH RESEARCH POST</p>
              <h3 className="text-[1.25rem] text-chrome-light mb-2">Launch charts &middot; Full and smaller Wonder at max reasoning effort</h3>
              <p className="text-sm leading-relaxed text-chrome/65 max-w-[46rem]">
                Three charts linked from Meta&rsquo;s launch post, separate from the model card. Each is
                its own setup with its own metric. They are not complements or averages of the six card
                ASRs, and none publishes a sample size, attack portfolio, scoring rule or control stack.
                Other models&rsquo; bars are left in the original charts; no ranking is made.
              </p>
            </div>
            <ul className="divide-y divide-white/10">
              {CHARTS.map(([id, sid, name, metric, better, full, wonder]) => (
                <li key={id} className="p-6 md:px-8 md:py-6 grid md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] gap-x-10 gap-y-4">
                  <div className="min-w-0">
                    <p className="text-[1.0625rem] text-chrome-light leading-snug mb-1">{name}</p>
                    <p className="text-sm text-chrome/65">
                      {metric}, {better} is better &middot;{' '}
                      <a className={VIOLET_LINK} href={SRC[sid].url} target="_blank" rel="noopener noreferrer">
                        original chart<span aria-hidden="true"> &#8599;</span>
                        <span className="sr-only"> (opens the publisher&rsquo;s image in a new tab)</span>
                      </a>
                    </p>
                    <p className="font-mono text-xs text-chrome/65 mt-1">{id.replace('P4-', '')}</p>
                  </div>
                  <div className="grid gap-2 content-center min-w-0" role="list" aria-label={`${name}: Wonder Full ${full}, smaller Wonder ${wonder}`}>
                    {[
                      ['Wonder Full (max)', full, 'bg-[#8FA2F0]'],
                      ['Muse Wonder (max)', wonder, 'bg-[#ABA6F2]/60'],
                    ].map(([who, val, col]) => (
                      <div key={who} role="listitem" className="grid grid-cols-[8.5rem_minmax(0,1fr)_3.5rem] items-center gap-3">
                        <span className="text-xs text-chrome/65">{who}</span>
                        <span className="h-3 rounded-sm bg-white/[0.04] overflow-hidden" aria-hidden="true">
                          <span className={`block h-full ${col}`} style={{ width: `${parseFloat(val)}%` }} />
                        </span>
                        <span className="font-mono text-sm text-chrome-light text-right">{val}</span>
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <P>
            The misuse-refusal result is a measured refusal rate in its own setup, and it is favourable.
            Defensive compliance is useful evidence that legitimate security work is not simply blocked,
            though compliance alone does not prove a successful defence. The unauthorized-code result
            is an adverse, adjacent system-security observation: about one attack in ten succeeded in
            that setup, for both models. The source does not say how those attacks were built, so ARGUS
            does not call it prompt injection or a production incident.
          </P>
          <P className="mb-0">
            Neither the card table nor the charts give the denominators, budgets, rubrics, uncertainty,
            severity classes or retest accounting needed to read the remaining successes as deployment
            risk. Nonzero ASR alone neither establishes catastrophic risk nor contradicts a
            moderate-or-lower call; an explicit risk argument has to explain why the successes matter
            or do not. This is <GapLink id="G-003" />.
          </P>
        </div>
      </section>

      {/* Family */}
      <section className={`${SECTION} border-t border-white/5`} aria-labelledby="family">
        <div className={SHELL}>
          <Heading label="Family inference" text="Wonder Full and the smaller Wonder" id="family" />
          <P className="mb-10">
            Muse Wonder Full is a separate named model, not a reasoning setting of the smaller Muse
            Wonder. The launch posts announce them through different routes (
            <Web src={LAUNCH} frag="Muse Wonder Full is available today for Muse Code subscribers">
              launch research
            </Web>
            ,{' '}
            <Web src={NEWS} frag="Muse Wonder Full is available today for Muse Code subscribers">
              announcement
            </Web>
            ).
          </P>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8 border-l-2 border-l-[#8FA2F0]">
              <p className="font-mono text-xs tracking-[0.12em] text-[#8FA2F0] mb-3">TESTED VARIANT</p>
              <h3 className="text-[1.25rem] text-chrome-light mb-4">Muse Wonder Full</h3>
              <p className="text-[0.9375rem] leading-relaxed text-chrome/80 mb-3">
                Announced for <strong className={B}>Muse Code subscribers</strong>. Every &sect;4 cyber
                result in the model card is for this model.
              </p>
              <p className="text-sm leading-relaxed text-chrome/65">
                API availability for Full is not established by the launch sources.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8 border-l-2 border-l-[#ABA6F2]">
              <p className="font-mono text-xs tracking-[0.12em] text-[#ABA6F2] mb-3">COVERED BY INFERENCE</p>
              <h3 className="text-[1.25rem] text-chrome-light mb-4">Muse Wonder</h3>
              <p className="text-[0.9375rem] leading-relaxed text-chrome/80 mb-3">
                Announced on the <strong className={B}>Meta Model API and Muse Code</strong>. Covered by
                Meta&rsquo;s statement that Full&rsquo;s results are &ldquo;why the assessment covers every
                model in the family&rdquo;.
              </p>
              <p className="text-sm leading-relaxed text-chrome/65">
                Wonder-powered Muse experiences are described as forthcoming, first for subscribers.
              </p>
            </div>
          </div>
          <P>
            Testing the most capable variant can be a sensible way to bound some offensive capabilities.
            It does not automatically bound every specialised capability or refusal behaviour, and the
            launch charts show why. On the same chart and setup, Full refuses more misuse ({CHARTS[0][5]}{' '}
            against {CHARTS[0][6]}), complies slightly less often with defensive requests ({CHARTS[1][5]}{' '}
            against {CHARTS[1][6]}) and has a fractionally higher unauthorized-code ASR ({CHARTS[2][5]}{' '}
            against {CHARTS[2][6]}). With no uncertainty or methods published, ARGUS draws no significance
            or general ordering from those small differences.
          </P>
          <P className="mb-0">
            The paired charts narrow the family gap; they do not close it. There are no paired
            catastrophic-capability evaluations, no matched-test manifest and no domain-specific argument
            that Full bounds the smaller Wonder across assessment and deployment. This is{' '}
            <GapLink id="G-004" />. It limits the family extension, not the identity of the Full root.
          </P>
        </div>
      </section>

      {/* Tested vs deployed */}
      <section className={`${SECTION} border-t border-white/5`} aria-labelledby="deployed">
        <div className={SHELL}>
          <Heading label="Deployment" text="The tested system and the served system" id="deployed" />
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              [
                'Recommended is not active',
                'The card recommends deploying Wonder “as part of a broader AI system, with additional guardrails suited to the use case”, and human-in-the-loop confirmation for irreversible actions in agentic use.',
                'Recommendations to deployers do not show which controls are switched on in Muse Code or on the API.',
                [11, 12],
              ],
              [
                'Results depend on configuration',
                'The card says performance can vary with quantization, serving configuration, prompts, tools and the agent harness, and that testing has not covered all scenarios.',
                'No dated matrix maps the tested checkpoint, tools and safeguards to each served route.',
                [11, 11],
              ],
              [
                'Policy options are not an inventory',
                'The framework lists classifiers, rate limits, abuse monitoring, identity controls and logging as examples for cyber.',
                'These are conditional policy options, not a documented cyber stack for Full. The chemical and biological classifiers do not fill this in.',
                [32, 33],
              ],
            ].map(([t, said, read, [a, b]]) => (
              <div key={t} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-7 flex flex-col">
                <h3 className="text-[1.1875rem] leading-snug text-chrome-light mb-4">{t}</h3>
                <p className="text-[0.9375rem] leading-relaxed text-chrome/80 mb-4">{said}</p>
                <p className="text-[0.9375rem] leading-relaxed text-chrome-light mb-4">
                  <span className="font-mono text-[0.6875rem] tracking-[0.12em] text-[#d9b45e] block mb-1">ARGUS READS</span>
                  {read}
                </p>
                <p className="mt-auto font-mono text-xs text-chrome/65">
                  {t === 'Policy options are not an inventory' ? (
                    <Pg src={FW} page={a}>
                      Framework pp.{a}&ndash;{b}
                    </Pg>
                  ) : a === b ? (
                    <Pg src={CARD} page={a}>
                      Card p.{a}
                    </Pg>
                  ) : (
                    <Pg src={CARD} page={a}>
                      Card pp.{a}&ndash;{b}
                    </Pg>
                  )}
                </p>
              </div>
            ))}
          </div>
          <P className="mb-0">
            Common infrastructure could make the tests representative of what users reach; the public
            documents do not establish it. ARGUS does not infer that the recommended guardrails were
            active, and does not carry chemical and biological safeguard details into cyber. The time
            boundary matters too: the sources were captured on 14 October, so the exact 12 October text
            and serving configuration remain unauthenticated. This is <GapLink id="G-005" />.
          </P>
        </div>
      </section>

      {/* Risk acceptance */}
      <section className={`${SECTION} border-t border-white/5`} aria-labelledby="bridge">
        <div className={SHELL}>
          <Heading label="The missing link" text="The reasoning that accepted the remaining risk" id="bridge" />
          <P className="mb-10">
            Steps 1 to 3 are on the public record, and step 5 is Meta&rsquo;s stated deployment
            judgement. Step 4 is what connects them. The framework expects preparedness reporting to
            explain the risk rationale, mitigation adequacy, adverse behaviours and governance (
            <Pg src={FW} page={10}>
              framework pp.9&ndash;11
            </Pg>
            ). The card says the review happened and gives the conclusion; it does not show that
            reasoning.
          </P>
          <ol className="grid lg:grid-cols-5 gap-3 mb-10" aria-label="Assurance chain">
            {[
              ['Baseline', 'Unmitigated cyber risk: “moderate or lower”', 'Meta’s assessment', 'border-white/10'],
              ['Capability', `CyberGym ${CYBERGYM[2]}; ExploitBench ${EXPLOITBENCH[2]}; ExploitGym ${EG.intended} intended of ${EG.total} flags`, 'Public, qualified', 'border-white/10'],
              ['Guarded tests', `Six card ASRs from ${ASR[0][2]} to ${ASR[2][2]}; three separate launch charts`, 'Public, mixed', 'border-white/10'],
              ['Acceptance', 'Criteria, treatment of remaining successes, dated accountable review, independent assessment', 'Not public · G-006', 'border-dashed border-[#F07E5E]/70 bg-[#F07E5E]/[0.06]'],
              ['Deployment', 'With safeguards: “moderate or lower” across all domains; internal governance review before the decision', 'Meta’s statement', 'border-white/10'],
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
            <Reg html={P4.gaps['P4-G-006'].missing} className={`${BODY} mb-6`} />
            <P>
              Meta also reports working with third parties to develop and license benchmarks, threat
              modelling with outside experts, and engagement with government and other stakeholders (
              <Pg src={CARD} page={11}>
                card p.11
              </Pg>
              ). Those are real inputs, but benchmark provenance, external execution and independent
              endorsement of the risk judgement are different things, and none stands in for another.
            </P>
            <P className="mb-0">
              The internal record may be complete and well supported. The public record is consistent
              with that; it cannot independently establish it. No breach of a publication deadline is
              inferred.{' '}
              <a className={VIOLET_LINK} href={`${EXPLORER}#exec/P4-G-006`}>
                Read G-006 in the graph
              </a>
              .
            </P>
          </div>
        </div>
      </section>

      {/* Seven gaps */}
      <section id="gaps" className={`${SECTION} border-t border-white/5 scroll-mt-16`} aria-labelledby="gaps-h">
        <div className={SHELL}>
          <Heading label="Open links" text="Seven open public-assurance gaps" id="gaps-h" />
          <Reg html={P4.gap_intro} className={`${BODY} ${MEASURE} mb-6`} />
          <P className="mb-10">
            Open each gap for its full investigation, quoted from the gap register: what is public, what
            is missing, the evidence that would narrow or close it, the alternative reading, and why the
            evidence is unavailable where a source says.
          </P>
          <div className="border-y border-white/10 divide-y divide-white/10 mb-10">
            {gapIds.map((gid) => {
              const g = P4.gaps[gid]
              const id = gid.replace('P4-', '')
              return (
                <details key={gid} id={id} className="group scroll-mt-36">
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
                      ['Observed public evidence', g.observed],
                      ['Missing inference or evidence', g.missing],
                      ['Evidence that would narrow or close it', g.closure],
                      ['Alternative interpretation', g.alternative],
                      ['Reason unavailable', g.reason],
                    ].map(([label, html]) => (
                      <div key={label}>
                        <p className={`${LABEL} mb-2`}>{label}</p>
                        <Reg html={html} className="text-[1rem] leading-relaxed text-chrome/85" />
                      </div>
                    ))}
                    <div>
                      <p className={`${LABEL} mb-2`}>Graph links and cited evidence</p>
                      <p className="text-sm leading-relaxed text-chrome/65 mb-3">
                        In the graph, {id} limits {g.targets.map((t) => t.replace('P4-', '')).join(' and ')}.
                        The gap register cites:
                      </p>
                      <ul className="flex flex-wrap gap-2" aria-label={`Evidence cited for ${id}`}>
                        {g.evidence_ids.map((e) => (
                          <li key={e}>
                            <a
                              href={`${EXPLORER}#full/${e}`}
                              title={P4.evidence[e].heading + (P4.evidence[e].chart ? ' (launch chart)' : '')}
                              className={`inline-flex items-center min-h-[36px] rounded border px-3 font-mono text-xs text-chrome-light hover:border-[#a78bfa]/60 hover:text-[#c4b5fd] transition-colors ${P4.evidence[e].chart ? 'border-dashed border-[#ABA6F2]/70' : 'border-white/15'}`}
                            >
                              {e.replace('P4-', '')}
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
            <p className={`${LABEL} mb-3`}>Grouping choices and limits</p>
            {P4.gap_grouping.map((html, i) => (
              <Reg key={i} html={html} className={`text-[1.0625rem] leading-relaxed text-chrome-light ${i ? 'mt-4' : ''}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Report availability and provenance */}
      <section id="sources" className={`${SECTION} border-t border-white/5 scroll-mt-16`} aria-labelledby="src">
        <div className={SHELL}>
          <Heading label="Provenance" text="The full report, the sources and their dates" id="src" />
          <div className="card-glass p-6 md:p-8 max-w-[48rem] border-l-2 border-l-[#d9b45e] mb-12">
            <p className={`${LABEL} mb-3`}>Separate full safety report</p>
            <p className="font-mono text-sm text-chrome-light mb-4">
              <code>NOT_LOCATED_IN_BOUNDED_PUBLIC_SEARCH</code> &middot; 14 October 2026, 13:11 UTC
            </p>
            <p className="text-[1.0625rem] leading-relaxed text-chrome-light mb-4">
              Both launch publications say &ldquo;A full report with additional safety evaluations will
              be available soon&rdquo; (
              <Web src={LAUNCH} frag="A full report with additional safety evaluations will be available soon">
                launch research
              </Web>
              ,{' '}
              <Web src={NEWS} frag="A full report with additional safety evaluations will be available soon">
                announcement
              </Web>
              ). The launch page&rsquo;s existing evaluation-report link points to the model card. The
              publisher&rsquo;s research index, launch links, framework links and targeted searches did
              not locate a separate report.
            </p>
            <p className="text-[1rem] leading-relaxed text-chrome/80">
              This is a dated public-evidence limitation. It does not show that no report exists, that
              Meta lacks internal evidence, or that anything was deliberately withheld. A report found
              later would need its own assessment, and would narrow the gaps only as far as it supplies
              the missing evidence.
            </p>
          </div>

          <h3 className={`${LEAD} text-chrome-light mb-8`}>Release, capture and the release-day bytes</h3>
          <ol className="relative border-l border-white/15 ml-2 mb-12 max-w-[48rem]">
            {timeline.map(([d, t, n, s]) => (
              <li key={d + t} className="pl-6 pb-8 last:pb-0 relative">
                <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-[#d9b45e]" aria-hidden="true" />
                <p className="font-mono text-xs tracking-[0.1em] text-chrome/65 mb-1">{d}</p>
                <p className="text-[1.0625rem] text-chrome-light mb-1">{s ? <Web src={s}>{t}</Web> : t}</p>
                <p className="text-sm leading-relaxed text-chrome/65">{n}</p>
              </li>
            ))}
          </ol>

          <P className="mb-10">
            Nine public publisher files: six documents and three chart images from the launch post, which
            are components of one publication, not three independent studies. ARGUS hashed the copies it
            retrieved on 14 October; the links below open the publisher&rsquo;s current copies, and each
            note says how they compare. PDF page numbers are one-based file pages.
          </P>
          <ul className="divide-y divide-white/10 border-y border-white/10 mb-8">
            {Object.entries(SRC).map(([id, s]) => (
              <li key={id} className="py-6 grid grid-cols-1 md:grid-cols-[8.5rem_minmax(0,1fr)] gap-x-8 gap-y-2">
                <span className="font-mono text-xs text-chrome/65 md:pt-1">
                  {id}
                  {s.chart && <span className="block text-[#ABA6F2] mt-1">LAUNCH CHART</span>}
                </span>
                <div className="min-w-0">
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className={`text-[1.0625rem] [overflow-wrap:anywhere] ${VIOLET_LINK}`}>
                    {s.chart ? s.title.replace(/ — launch chart$/, '') : s.title}
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
                        ['Revision', s.revision],
                        ['ARGUS capture (UTC)', s.retrieval],
                        [s.chart ? 'Parent publication' : 'Pages and case use', s.use],
                        ['Release-time limit', s.qualification],
                        ['SHA-256 of the capture', `<code>${s.sha256}</code>`],
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
            <p className={`${LABEL} mb-3`}>What the hashes do and do not prove</p>
            <p className="text-sm leading-relaxed text-chrome/65">
              Publisher-domain acquisition and the publisher&rsquo;s own cross-links establish where these
              copies came from. The hashes identify the retained bytes; they are not publisher signatures
              and do not authenticate the results. Exact 12 October bytes and serving configurations were
              not independently authenticated, and the charts&rsquo; 14 October Last-Modified dates do not
              show when their content first appeared. No change to the card is alleged, and current
              evidence is not backdated.
            </p>
          </div>
        </div>
      </section>

      {/* How to read */}
      <section id="reading" className={`${SECTION} border-t border-white/5 scroll-mt-16`} aria-labelledby="read">
        <div className={SHELL}>
          <Heading label="Method" text="How to read this work" id="read" />
          <P>
            ARGUS is an independent <strong className={B}>documentary reconstruction</strong> of public
            sources. No model was queried, no exploit was run and no confidential source was used. It is
            not a penetration test, a safety certification, a policy-compliance finding or a ranking of
            models. The typed graph separates Meta&rsquo;s statements from ARGUS interpretation and
            records every warrant, assumption and adverse result.
          </P>
          <P>
            The research was filed on <strong className={B}>14 October 2026</strong>, two days after the
            release. This presentation was checked against the filed registers by its author.{' '}
            <strong className={B}>
              It has not had an independent fidelity audit, and the study has not been externally peer
              reviewed.
            </strong>{' '}
            Findings may be revised with cited corrections.
          </P>
          <P className="mb-10">
            Challenges are welcome: a source locator, contrary evidence or a better argument against any
            edge or evidence record. Criticism that narrows or corrects a link is a useful outcome.
          </P>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href={`${EXPLORER}#exec`} className="btn-primary inline-flex items-center justify-center gap-2 !px-5 sm:!px-8">
              Open Executive and Full Assurance Graphs <span aria-hidden="true">&rarr;</span>
            </a>
            <a href="mailto:hello@automadynamics.com?subject=ARGUS%20Proof-4%20review" className="btn-secondary text-center">
              Send a challenge or correction
            </a>
          </div>
        </div>
      </section>

      {/* Boundary and artifacts */}
      <section className={`${SECTION} border-t border-white/5`}>
        <div className={`${SHELL} grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 [&>*]:min-w-0`}>
          <div>
            <p className={`${LABEL} mb-6`}>Research boundary</p>
            <p className={`${BODY} mb-6`}>
              Published by Automa Dynamics / ARGUS. Independent research; no affiliation, endorsement or
              certification by Meta.
            </p>
            <p className={`${BODY} mb-6`}>
              Gaps describe the inspected public record. They do not mean Meta lacks private evidence,
              that a control failed, that a policy was breached or that an incident occurred.
            </p>
            <p className={BODY}>
              Counts are link judgements, not safety scores, and no cross-model ranking is made.
            </p>
          </div>
          <div>
            <p className={`${LABEL} mb-6`}>Proof-4 artifacts</p>
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {[
                ['View', 'Executive assurance graph', `${EXPLORER}#exec`, '→'],
                ['View', 'Full assurance graph', `${EXPLORER}#full`, '→'],
                ['Read', 'The seven gap investigations', '#gaps', '→'],
                ['Inspect', 'Machine-readable Graph JSON', GRAPH_JSON, 'JSON'],
                ['About', 'ARGUS method and earlier proofs', '/safety/argus', '→'],
                ['Contact', 'hello@automadynamics.com', 'mailto:hello@automadynamics.com?subject=ARGUS%20Proof-4', '→'],
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
              {INV.nodes} nodes &middot; {INV.edges} warranted relationships &middot; {INV.EVIDENCE} evidence
              units &middot; {INV.GAP} open gaps &middot; Graph SHA-256 {GRAPH_SHA}
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
