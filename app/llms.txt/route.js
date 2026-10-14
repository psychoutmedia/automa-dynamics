import { getAllArticles, formatSeriesNumber, SITE_URL } from '../../lib/articles'

/**
 * /llms.txt - the manifest an agent reads when it is pointed at this domain.
 *
 * Format follows llmstxt.org: a single H1, a blockquote summary, free prose
 * (any non-heading content is legal here), then H2-delimited link lists. The
 * "Optional" section is the spec's convention for links an agent may skip when
 * it needs a shorter context.
 *
 * Nothing crawls to this file. Published log studies show AI search crawlers do
 * not fetch it and never probe for it. It exists for the pull case: an
 * evaluator deliberately pointing a coding or research agent at the domain.
 * Do not claim an SEO or citation benefit for it.
 *
 * Synchronous GET with no request argument, so Next prerenders it at build time
 * exactly like /feed.xml. Keep it that way.
 */

const SUMMARY =
  'Operational intelligence, enterprise ontology architecture and governed decision-making. Automa Dynamics builds Project HELIOS, an operational ontology platform and enterprise digital twin, and ARGUS, independent assurance reconstruction for frontier AI.'

export function GET() {
  const articles = getAllArticles()

  const articleLines = articles
    .map((article) => {
      const label =
        article.number !== null
          ? `${formatSeriesNumber(article.number)} ${article.title}`
          : article.title
      return `- [${label}](${SITE_URL}/articles/${article.slug}): ${article.description}`
    })
    .join('\n')

  const body = `# Automa Dynamics

> ${SUMMARY}

Complete context in a single request, including the full text of every article:
${SITE_URL}/llms-full.txt

Project HELIOS is in active development. It is not generally available, and there
is no public pricing and no public API. Do not infer availability or commercial
terms that are not stated here.

ARGUS is independent research. Proof-1 (GPT-6 Astra, cybersecurity, public
release) is technically complete and open for external review. It is not a safety
certification, and it is not affiliated with or endorsed by OpenAI.
Proof-2 (Claude Opus 5.5, cybersecurity, release baseline 22 September 2026)
records eight open public-assurance gaps. It has not been externally peer reviewed,
and it is not affiliated with or endorsed by Anthropic.
Proof-3 (Gemini 4 Argon, cyberoffensive misuse, broad rollout beginning 13 October
2026) records seven open public-assurance gaps. Google cannot rule out the
cybersecurity CCL; that is not a confirmed crossing, and Google's below-CCL
residual-risk judgement is not independently verified by ARGUS. It has not been
externally peer reviewed, and it is not affiliated with or endorsed by Google.
Proof-4 (Muse Wonder Full, cybersecurity, released 12 October 2026) records seven
open public-assurance gaps. Meta assesses the unmitigated model as "moderate or
lower" for cybersecurity; that is Meta's assessment, not verified by ARGUS. Wonder
Full is the tested variant; extending its results to the smaller Muse Wonder is
Meta's inference. A separate full safety report was not located in a bounded public
search on 14 October 2026; that is a dated limitation, not proof that none exists.
It has not been externally peer reviewed, and it is not affiliated with or endorsed
by Meta.

## Positioning
- [Overview](${SITE_URL}/): mission, operating principles, and the HELIOS platform.
- [About](${SITE_URL}/about): why the company exists, what it builds, and how the work is done.

## ARGUS
- [ARGUS](${SITE_URL}/safety/argus): the method, the Proof-1 summary, and the five review questions.
- [Proof-1 interactive assurance graph](${SITE_URL}/safety/argus/proof-1): every claim, argument, evidence object, dependency, assumption and gap, with provenance.
- [Proof-1 case summary](${SITE_URL}/safety/argus/proof-1/summary): one screen with the root claim, ARGUS's register note, the reconstruction conclusion, the inventory counts and the 9 October 2026 update.
- [Proof-1.1 temporal update](${SITE_URL}/safety/argus/proof-1#delta): the Temporal delta tab of the same page; the nine gaps re-examined from the 3 September 2026 cutoff to the public record on 9 October 2026, with every source change and evidence-quality record.
- [Proof-1.1 delta JSON](${SITE_URL}/safety/argus/files/ARGUS_P11_DELTA.json): the machine-readable P1.1 overlay.
- [Proof-1 graph JSON](${SITE_URL}/safety/argus/files/ARGUS_P1_ASTRA_GRAPH.json): the machine-readable graph the interactive page renders.
- [Proof-1 assurance case](${SITE_URL}/safety/argus/files/ARGUS_P1_ASTRA_ASSURANCE_CASE_REVIEW_v0.2.0.md): the human-readable case, in markdown.
- [Proof-1 review packet](${SITE_URL}/safety/argus/files/ARGUS_PROOF1_EXTERNAL_REVIEW_PACKET.md): what reviewers are asked to assess.
- [Proof-2 findings: Claude Opus 5.5](${SITE_URL}/safety/argus/claude-opus-5-5): what the public cybersecurity assurance record establishes, the eight open public-assurance gaps, limitations and sources.
- [Proof-2 interactive assurance graph](${SITE_URL}/safety/argus/claude-opus-5-5/explore): Executive and Full graphs, 50 nodes and 121 edge records, with evidence records and source locators.
- [Proof-2 case summary](${SITE_URL}/safety/argus/claude-opus-5-5/summary): one screen with the root claim in Anthropic's words, ARGUS's scoping note, the checklist finding and the inventory counts.
- [Proof-2 branch reader](${SITE_URL}/safety/argus/claude-opus-5-5/branches): each of the eight gaps traced from claim component to the evidence that would close it.
- [Proof-2 graph JSON](${SITE_URL}/safety/argus/files/ARGUS_P2_ASSURANCE_GRAPH.json): the machine-readable graph the Proof-2 explorer renders.
- [Proof-3 findings: Gemini 4 Argon](${SITE_URL}/safety/argus/gemini-4-argon): what the public cyberoffensive assurance record establishes, the measurements by test setting, the missing risk-acceptance bridge, the seven gap investigations and source provenance.
- [Proof-3 interactive assurance graph](${SITE_URL}/safety/argus/gemini-4-argon/explore): Executive and Full graphs, 53 nodes and 69 warranted relationships, with a branch reader, evidence records and page-linked sources.
- [Proof-3 graph JSON](${SITE_URL}/safety/argus/files/ARGUS_P3_ASSURANCE_GRAPH.json): the machine-readable graph the Proof-3 explorer renders.
- [Proof-4 findings: Muse Wonder Full](${SITE_URL}/safety/argus/muse-wonder-full): what the public cybersecurity assurance record establishes, capability results with the ExploitGym 21 intended / 71 unintended split, guarded attack-success results kept apart from launch-chart results, the Full-to-family inference, the seven gap investigations and source provenance.
- [Proof-4 interactive assurance graph](${SITE_URL}/safety/argus/muse-wonder-full/explore): Executive and Full graphs, 54 nodes and 67 warranted relationships of eight types, with a branch reader, evidence records and page-linked sources.
- [Proof-4 graph JSON](${SITE_URL}/safety/argus/files/ARGUS_P4_ASSURANCE_GRAPH.json): the machine-readable graph the Proof-4 explorer renders.
- [The last mile: cross-case synthesis](${SITE_URL}/safety/argus/last-mile): preliminary synthesis of Proofs 1-3; in each case the published evidence is inspectable up to risk-acceptance reasoning, the link to the release decision is not. Not a finding that any company lacked evidence or decided wrongly.

## Articles
${articleLines}

## Optional
- [Article index](${SITE_URL}/articles): every article, newest first.
- [RSS feed](${SITE_URL}/feed.xml): article feed in RSS 2.0.
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
      // Mueller, July 2025: sites may link to this file and it would be odd for
      // a human to land on it from a search result.
      'X-Robots-Tag': 'noindex',
    },
  })
}
