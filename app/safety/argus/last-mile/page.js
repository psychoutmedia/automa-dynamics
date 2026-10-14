import { SITE_URL } from '../../../../lib/articles'

/* ARGUS cross-case synthesis: the "last mile" shared by Proof-1 (GPT-6 Astra), Proof-2
   (Claude Opus 5.5) and Proof-3 (Gemini 4 Argon). The finding text is the owner's
   preliminary synthesis; every case-specific statement is quoted from that case's filed
   graph (public/safety/argus/files/*.json), and Proof-1's status is the Proof-1.1 delta.
   The chart is server-rendered SVG: a horizontal chain from lg up, a vertical one below. */

const PATH = '/safety/argus/last-mile'
const TITLE = 'The Last Mile of Public Frontier AI Assurance'
const DESCRIPTION =
  'ARGUS cross-case synthesis: across GPT-6 Astra, Claude Opus 5.5 and Gemini 4 Argon, published safety evidence can be inspected up to the risk-acceptance step, but the final connection to the release decision cannot be fully reconstructed. Preliminary; not a finding that any company lacked evidence or decided wrongly.'

export const metadata = {
  title: 'ARGUS: The Last Mile',
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: `ARGUS | ${TITLE}`, description: DESCRIPTION, url: PATH, type: 'article' },
  twitter: { card: 'summary', title: `ARGUS | ${TITLE}`, description: DESCRIPTION },
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

const LABEL = 'type-label'
const BODY = 'type-body'
const SECTION = 'px-6 md:px-12 lg:px-24 py-16 md:py-24'
const SHELL = 'max-w-6xl mx-auto'
const GOLD = 'text-[#d9b45e]'
const VIOLET_LINK = 'text-[#a78bfa] hover:text-[#c4b5fd] underline-offset-4 hover:underline transition-colors'

/* Chart palette: the ARGUS series colours as they appear on the site's case cards. */
const C = {
  ink: '#e8e8e8',
  muted: 'rgba(192,192,192,0.65)',
  faint: 'rgba(255,255,255,0.10)',
  trace: '#8FA2F0',
  traceSoft: 'rgba(143,162,240,0.12)',
  gap: '#F07E5E',
  gapSoft: 'rgba(240,126,94,0.10)',
  surface: '#020617',
}
const MONO = 'var(--font-jetbrains), monospace'

const STAGES = [
  ['Capability', 'assessments'],
  ['Safeguards', 'and testing'],
  ['Adverse findings', 'and remaining risk'],
  ['Risk-acceptance', 'reasoning'],
  ['Release', 'decision'],
]

const CASES = [
  {
    id: 'p1',
    proof: 'Proof-1',
    name: 'GPT-6 Astra',
    short: 'Astra',
    org: 'OpenAI',
    meta: 'Cybersecurity · public release · evidence cutoff 3 Sep 2026',
    gapLabel: 'G2 · G3',
    gaps: [
      ['G2', null, 'Public measurements are not connected to an inspectable deployment-level residual severe-harm assessment.'],
      ['G3', null, 'Critical-cyber safeguard/security acceptance standards and the launch-specific efficacy thresholds are not sufficiently public to replay the decision.'],
    ],
    status: <>Both <b className="text-chrome-light font-medium">unchanged</b> at the 9 Oct 2026 public re-check (Proof-1.1). <b className="text-chrome-light font-medium">9</b> open links in the case.</>,
    href: '/safety/argus/proof-1#exec',
    cta: 'Open the Proof-1 graph',
  },
  {
    id: 'p2',
    proof: 'Proof-2',
    name: 'Claude Opus 5.5',
    short: 'Opus 5.5',
    org: 'Anthropic',
    meta: 'Cybersecurity · release baseline 22 Sep 2026',
    gapLabel: 'G-007',
    gaps: [
      ['G-007', 'General FCF process to model-specific decision evidence', 'The inspected corpus does not disclose an Opus 5.5 cyber acceptance rationale connecting capability, adverse results, fallback and the temporary margin to that condition, or model-specific monitoring effectiveness.'],
    ],
    status: <>Open in the public record examined. <b className="text-chrome-light font-medium">8</b> open links in the case.</>,
    href: '/safety/argus/claude-opus-5-5#gaps',
    cta: 'Read the Proof-2 gaps',
  },
  {
    id: 'p3',
    proof: 'Proof-3',
    name: 'Gemini 4 Argon',
    short: 'Argon',
    org: 'Google DeepMind',
    meta: 'Cyberoffensive misuse · broad rollout 13 Oct 2026',
    gapLabel: 'G-002',
    gaps: [
      ['G-002', 'Safety-case and acceptance bridge', 'The complete model-specific cyber safety case, residual-risk calculation and governance acceptance decision linking unmitigated 16.7x uplift to below-CCL deployment risk are not publicly inspectable.'],
    ],
    status: <>Open in the public record examined. <b className="text-chrome-light font-medium">7</b> open links in the case.</>,
    href: '/safety/argus/gemini-4-argon#gaps',
    cta: 'Read the Proof-3 gaps',
  },
]

function Diamond({ x, y, r }) {
  return <path d={`M${x} ${y - r} L${x + r} ${y} L${x} ${y + r} L${x - r} ${y}Z`} fill="#2a130d" stroke={C.gap} strokeWidth="2.5" />
}

/* Horizontal chain, shown from lg up. */
function ChartWide() {
  const W = 1000, X = [320, 475, 630, 785, 935], Y0 = 196, DY = 92, H = Y0 + DY * 2 + 70, PAD = 24
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="hidden lg:block w-full h-auto" role="img" aria-labelledby="chart-title chart-desc">
      <rect x={X[3] - 74} y={130} width={148} height={H - 140} rx="4" fill={C.gapSoft} />
      {STAGES.map((s, i) => (
        <g key={i}>
          <text x={X[i]} y={26} textAnchor="middle" fill={C.muted} style={{ font: `500 11px ${MONO}`, letterSpacing: '0.12em' }}>{`0${i + 1}`}</text>
          <text x={X[i]} y={50} textAnchor="middle" fill={i === 3 ? C.gap : C.ink} style={{ fontSize: 15 }}>{s[0]}</text>
          <text x={X[i]} y={70} textAnchor="middle" fill={i === 3 ? C.gap : C.ink} style={{ fontSize: 15 }}>{s[1]}</text>
          <line x1={X[i]} x2={X[i]} y1={140} y2={H - 20} stroke={C.faint} strokeDasharray="2 4" />
        </g>
      ))}
      <rect x={X[0] - 72} y={88} width={X[2] - X[0] + 144} height={34} rx="4" fill={C.traceSoft} />
      <text x={(X[0] + X[2]) / 2} y={109} textAnchor="middle" fill={C.muted} style={{ font: `500 10.5px ${MONO}`, letterSpacing: '0.12em' }}>SUBSTANTIAL PUBLISHED EVIDENCE</text>
      <rect x={X[3] - 74} y={88} width={148} height={34} rx="4" fill="rgba(240,126,94,0.16)" />
      <text x={X[3]} y={102} textAnchor="middle" fill={C.gap} style={{ font: `500 9.5px ${MONO}`, letterSpacing: '0.02em' }}>PARTLY OR NOT</text>
      <text x={X[3]} y={115} textAnchor="middle" fill={C.gap} style={{ font: `500 9.5px ${MONO}`, letterSpacing: '0.02em' }}>INDEPENDENTLY INSPECTABLE</text>
      <text x={X[4]} y={109} textAnchor="middle" fill={C.muted} style={{ font: `500 10.5px ${MONO}`, letterSpacing: '0.12em' }}>PUBLIC</text>
      {CASES.map((c, k) => {
        const y = Y0 + k * DY
        return (
          <a key={c.id} href={`#${c.id}`} className="group" aria-label={`${c.proof}, ${c.name}: open gap ${c.gapLabel} at risk-acceptance reasoning`}>
            <rect x={0} y={y - 40} width={W} height={80} rx="6" className="fill-transparent group-hover:fill-white/[0.03] group-focus-visible:fill-white/[0.05]" />
            <text x={PAD} y={y - 14} fill={C.muted} style={{ font: `500 11px ${MONO}`, letterSpacing: '0.12em' }}>{c.proof.toUpperCase()}</text>
            <text x={PAD} y={y + 8} fill={C.ink} style={{ fontSize: 19 }}>{c.name}</text>
            <text x={PAD} y={y + 27} fill={C.muted} style={{ fontSize: 12.5 }}>{c.org}</text>
            <path d={`M${X[0]} ${y} L${X[2]} ${y}`} stroke={C.trace} strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d={`M${X[2]} ${y} L${X[4]} ${y}`} stroke={C.gap} strokeWidth="3" strokeLinecap="round" strokeDasharray="2 7" fill="none" className="lastmile-drift" />
            {[0, 1, 2].map((i) => <circle key={i} cx={X[i]} cy={y} r="8" fill={C.trace} stroke={C.surface} strokeWidth="3" />)}
            <Diamond x={X[3]} y={y} r={13} />
            <text x={X[3]} y={y + 32} textAnchor="middle" fill={C.gap} stroke="#0d0b10" strokeWidth="6" paintOrder="stroke" style={{ font: `600 12px ${MONO}` }}>{c.gapLabel}</text>
            <circle cx={X[4]} cy={y} r="9" fill={C.surface} stroke={C.ink} strokeWidth="2.5" />
          </a>
        )
      })}
    </svg>
  )
}

/* Vertical chain for phones and tablets. */
function ChartNarrow() {
  const W = 360, LX = [168, 246, 324], top = 96, step = 104
  const Y = STAGES.map((_, i) => top + 22 + i * step)
  const H = Y[4] + 46
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="lg:hidden w-full max-w-[440px] h-auto mx-auto" role="img" aria-labelledby="chart-title chart-desc">
      <rect x={0} y={Y[3] - 44} width={W} height={88} rx="4" fill={C.gapSoft} />
      {CASES.map((c, k) => (
        <g key={c.id}>
          <text x={LX[k]} y={22} textAnchor="middle" fill={C.muted} style={{ font: `500 10px ${MONO}`, letterSpacing: '0.1em' }}>{c.proof.toUpperCase()}</text>
          <text x={LX[k]} y={44} textAnchor="middle" fill={C.ink} style={{ fontSize: 15 }}>{c.short}</text>
        </g>
      ))}
      {STAGES.map((s, i) => (
        <g key={i}>
          <text x={8} y={Y[i] - 16} fill={C.muted} style={{ font: `500 10px ${MONO}`, letterSpacing: '0.12em' }}>{`0${i + 1}`}</text>
          <text x={8} y={Y[i] + 2} fill={i === 3 ? C.gap : C.ink} style={{ fontSize: 13.5 }}>{s[0]}</text>
          <text x={8} y={Y[i] + 19} fill={i === 3 ? C.gap : C.ink} style={{ fontSize: 13.5 }}>{s[1]}</text>
          <text x={8} y={Y[i] + 36} fill={i === 3 ? C.gap : C.muted} style={{ font: `500 8.5px ${MONO}`, letterSpacing: '0.08em' }}>
            {i < 3 ? 'PUBLISHED EVIDENCE' : i === 3 ? 'NOT INSPECTABLE' : 'PUBLIC'}
          </text>
        </g>
      ))}
      {CASES.map((c, k) => {
        const x = LX[k]
        return (
          <a key={c.id} href={`#${c.id}`} className="group" aria-label={`${c.proof}, ${c.name}: open gap ${c.gapLabel} at risk-acceptance reasoning`}>
            <rect x={x - 38} y={0} width={76} height={H} rx="6" className="fill-transparent group-hover:fill-white/[0.03]" />
            <path d={`M${x} ${Y[0]} L${x} ${Y[2]}`} stroke={C.trace} strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d={`M${x} ${Y[2]} L${x} ${Y[4]}`} stroke={C.gap} strokeWidth="3" strokeLinecap="round" strokeDasharray="2 7" fill="none" className="lastmile-drift" />
            {[0, 1, 2].map((i) => <circle key={i} cx={x} cy={Y[i]} r="7" fill={C.trace} stroke={C.surface} strokeWidth="3" />)}
            <Diamond x={x} y={Y[3]} r={12} />
            <text x={x} y={Y[3] + 30} textAnchor="middle" fill={C.gap} stroke="#0d0b10" strokeWidth="6" paintOrder="stroke" style={{ font: `600 10.5px ${MONO}` }}>{c.gapLabel}</text>
            <circle cx={x} cy={Y[4]} r="8" fill={C.surface} stroke={C.ink} strokeWidth="2.5" />
          </a>
        )
      })}
    </svg>
  )
}

function Legend() {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-chrome/65" aria-hidden="true">
      <li className="inline-flex items-center gap-2">
        <svg width="30" height="10"><line x1="2" y1="5" x2="28" y2="5" stroke={C.trace} strokeWidth="3" strokeLinecap="round" /></svg>
        Substantial published evidence
      </li>
      <li className="inline-flex items-center gap-2">
        <svg width="30" height="10"><line x1="2" y1="5" x2="28" y2="5" stroke={C.gap} strokeWidth="3" strokeDasharray="2 7" strokeLinecap="round" /></svg>
        Partly or not independently inspectable
      </li>
      <li className="inline-flex items-center gap-2">
        <svg width="16" height="16"><path d="M8 1.5 14.5 8 8 14.5 1.5 8Z" fill="#2a130d" stroke={C.gap} strokeWidth="2" /></svg>
        ARGUS gap at this link
      </li>
      <li className="inline-flex items-center gap-2">
        <svg width="16" height="16"><circle cx="8" cy="8" r="5.5" fill="none" stroke={C.ink} strokeWidth="2" /></svg>
        Release decision, publicly made
      </li>
    </ul>
  )
}

export default function ArgusLastMilePage() {
  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .lastmile-drift { animation: lastmile-drift 1.6s linear infinite; }
          @keyframes lastmile-drift { to { stroke-dashoffset: -18; } }
        }
      `}</style>

      {/* Hero */}
      <section className="px-6 md:px-12 lg:px-24 pt-28 md:pt-36 pb-12 md:pb-16">
        <div className={SHELL}>
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap gap-x-2 gap-y-1 font-mono text-xs tracking-[0.08em] text-chrome/65">
              <li><a href="/safety/argus" className="hover:text-chrome-light transition-colors">ARGUS</a></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-chrome-light">Cross-case synthesis</li>
            </ol>
          </nav>
          <p className={`${LABEL} mb-6`}>ARGUS &middot; Cross-case synthesis &middot; Preliminary</p>
          <h1 className="font-normal tracking-[-0.03em] leading-[1.06] text-[clamp(2.25rem,6vw,4.75rem)] max-w-[20ch] mb-8 text-balance">
            Public assurance stops one link short of the <span className="text-[#F07E5E]">release decision</span>
          </h1>
          <p className="type-lead max-w-[44rem] mb-8">
            Across three frontier developers, we can inspect substantial published safety evidence, but we
            cannot fully reconstruct the final connection between that evidence and the decision to release.
          </p>
          <p className={`font-mono text-xs md:text-sm tracking-[0.12em] ${GOLD}`}>
            3 DEVELOPERS &middot; 3 CYBERSECURITY RELEASES &middot; SEPT&ndash;OCT 2026 &middot; NOT EXTERNALLY PEER REVIEWED
          </p>
        </div>
      </section>

      {/* Chart */}
      <section className="px-6 md:px-12 lg:px-24 pb-16 md:pb-24">
        <figure className={`${SHELL} rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden`}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4 px-6 md:px-8 pt-6 md:pt-8 pb-6 border-b border-white/10">
            <h2 id="chart-title" className="text-[1.375rem] md:text-[1.625rem] font-normal tracking-[-0.01em] text-chrome-light">
              The assurance chain, traced through each case
            </h2>
            <Legend />
          </div>
          <p id="chart-desc" className="sr-only">
            Five stages: capability assessments, safeguards and testing, adverse findings and remaining risk,
            risk-acceptance reasoning, release decision. For GPT-6 Astra, Claude Opus 5.5 and Gemini 4 Argon the
            published evidence carries through the first three stages; at risk-acceptance reasoning each case
            records an open gap (Proof-1 G2 and G3, Proof-2 G-007, Proof-3 G-002), so the connection to the
            release decision is partly or not independently inspectable.
          </p>
          <div className="px-6 md:px-8 py-8">
            <ChartWide />
            <ChartNarrow />
          </div>
          <figcaption className="px-6 md:px-8 py-6 border-t border-white/10 grid gap-2 text-sm leading-relaxed text-chrome/65">
            <span>
              <span className="text-chrome-light">Conceptual synthesis of the three assurance cases, not a literal shared decision procedure.</span>{' '}
              Each case keeps its own boundary, vocabulary and date; the stage placement of its gaps is ARGUS&rsquo;s synthesis.
            </span>
            <span>Stages 1 to 3 are not gap-free: every case records other open links there. The chart isolates the one link all three share.</span>
          </figcaption>
        </figure>
      </section>

      {/* Cases */}
      <section className={`${SECTION} border-t border-white/5`} aria-labelledby="cases-h">
        <div className={SHELL}>
          <p className={`${LABEL} mb-6`}>The break, case by case</p>
          <h2 id="cases-h" className="type-display-sm mb-6 max-w-[22ch]">Where each reconstruction loses the thread</h2>
          <p className={`${BODY} type-measure mb-12`}>
            Gap statements are quoted from each case&rsquo;s filed graph. Select a trace in the chart to jump to its case.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {CASES.map((c) => (
              <article
                key={c.id}
                id={c.id}
                className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8 flex flex-col gap-5 min-w-0 target:border-[#F07E5E]/70 target:shadow-[0_0_0_1px_rgba(240,126,94,0.5)] transition-colors"
              >
                <div>
                  <p className={`font-mono text-xs tracking-[0.12em] ${GOLD} mb-3`}>
                    {c.proof.toUpperCase()} &middot; {c.org.toUpperCase()}
                  </p>
                  <h3 className="text-[1.75rem] leading-tight tracking-[-0.01em] text-chrome-light font-normal">{c.name}</h3>
                  <p className="text-sm text-chrome/65 mt-1">{c.meta}</p>
                </div>
                {c.gaps.map(([id, title, text]) => (
                  <div key={id} className="border-t border-white/10 pt-5 grid gap-3">
                    <p className="inline-flex items-center gap-2 font-mono text-sm text-[#F07E5E]">
                      <svg width="14" height="14" aria-hidden="true"><path d="M7 1.5 12.5 7 7 12.5 1.5 7Z" fill="#2a130d" stroke="#F07E5E" strokeWidth="2" /></svg>
                      {id}
                    </p>
                    {title && <p className="text-chrome-light font-medium leading-snug">{title}</p>}
                    <blockquote className="border-l-2 border-white/15 pl-4 text-[0.9875rem] leading-relaxed text-chrome/80">{text}</blockquote>
                  </div>
                ))}
                <p className="text-sm leading-relaxed text-chrome/65">{c.status}</p>
                <a href={c.href} className={`mt-auto text-[0.9375rem] ${VIOLET_LINK}`}>
                  {c.cta} <span aria-hidden="true">&rarr;</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Reading */}
      <section className={`${SECTION} border-t border-white/5`} aria-labelledby="reading-h">
        <div className={`${SHELL} grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-12 lg:gap-20 items-start`}>
          <h2 id="reading-h" className="type-display-sm max-w-[18ch]">
            That is the recurring <span className="text-[#F07E5E]">last-mile problem</span> in public frontier AI assurance.
          </h2>
          <div className="card-glass p-6 md:p-8 border-l-2 border-l-[#d9b45e] grid gap-4">
            <p className={LABEL}>What this does not show</p>
            <p className="text-[1.0625rem] leading-relaxed text-chrome-light">
              It does not establish that these companies lacked internal evidence, concealed failures or made
              incorrect decisions. Nor have three cases established an industry-wide prevalence rate.
            </p>
            <ul className="list-disc pl-5 grid gap-1.5 text-sm leading-relaxed text-chrome/65">
              <li>Gap counts are link judgements within each case, not safety scores, and are not comparable across cases.</li>
              <li>All three are documentary reconstructions of public sources in one risk domain, cybersecurity.</li>
              <li>None has been externally peer reviewed.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Boundary */}
      <section className={`${SECTION} border-t border-white/5`}>
        <div className={`${SHELL} flex flex-col md:flex-row md:items-center justify-between gap-6`}>
          <p className={`${BODY} max-w-[40rem]`}>
            Preliminary synthesis, 14 October 2026. Independent research by Automa Dynamics; not affiliated with or
            endorsed by OpenAI, Anthropic or Google.
          </p>
          <a href="/safety/argus" className="btn-secondary text-center">About ARGUS</a>
        </div>
      </section>
    </main>
  )
}
