# ARGUS Proof-1 External Review Packet

**Document ID:** ARGUS-P1-EXT-REVIEW-001  
**Version:** 0.1.0  
**Status:** EXTERNAL REVIEW REQUEST  
**Project:** ARGUS — Independent Frontier AI Assurance  
**Proof:** ARGUS Proof-1 — GPT-6 Astra Cybersecurity Release Assurance  
**Date:** 5 October 2026

---

## 1. Purpose of This Review

ARGUS is an exploratory project investigating whether frontier AI safety claims can be made more independently inspectable by reconstructing them as structured:

**CLAIM → ARGUMENT → EVIDENCE → DEPENDENCY → GAP**

Proof-1 applies this method to one bounded case:

- **Organisation:** OpenAI
- **System:** GPT-6 Astra
- **Risk domain:** Cybersecurity
- **Decision context:** Public release
- **Primary evidence cutoff:** 3 September 2026

The root claim examined is:

> **GPT-6 Astra's safeguards sufficiently minimize the risk of severe cyber harm for public release under OpenAI's Preparedness Framework.**

ARGUS Proof-1 has reached:

**PROOF-1 TECHNICAL COMPLETE — EXTERNAL REVIEW REQUIRED**

The purpose of this review is **not** to endorse ARGUS, OpenAI, GPT-6 Astra, or any safety conclusion.

The purpose is to determine whether the ARGUS representation is **useful for understanding, interrogating or challenging the assurance case more effectively than the underlying source material alone**.

---

## 2. What ARGUS Has Produced

The completed Proof-1 contains:

- a reconstructed assurance case;
- a Claims–Arguments–Evidence graph;
- explicit provenance for material evidence;
- assumptions and dependencies;
- public-evidence limitations;
- material gaps;
- a machine-readable JSON graph;
- source, claim, evidence and gap registers;
- a completion report.

The completed graph contains:

- **2 claims**
- **5 arguments**
- **23 evidence objects**
- **8 dependencies**
- **3 assumptions**
- **9 active material gaps**
- **50 active nodes**
- **125 active edges**

These counts describe the representation. They are **not safety scores** and do not imply evidence strength.

---

## 3. Suggested Reading Order

Please review the following in this order:

1. [`ARGUS_P1_ASTRA_ASSURANCE_CASE.md`](ARGUS_P1_ASTRA_ASSURANCE_CASE.md)  
   The primary human-readable reconstruction.

2. [`ARGUS_P1_ASTRA_GRAPH.json`](ARGUS_P1_ASTRA_GRAPH.json)  
   The machine-readable representation of the same assurance structure.

3. [`ARGUS_P1_COMPLETION_REPORT.md`](ARGUS_P1_COMPLETION_REPORT.md)  
   Technical completion status, findings, scope and limitations.

Optional supporting material:

- [`CLAIM_REGISTER.md`](CLAIM_REGISTER.md)
- [`EVIDENCE_REGISTER.md`](EVIDENCE_REGISTER.md)
- [`GAP_REGISTER.md`](GAP_REGISTER.md)
- [`sources/SOURCE_REGISTER.md`](sources/SOURCE_REGISTER.md)

A reviewer should not need to inspect the project history or development process to answer the review questions below.

---

## 4. Important Interpretation Boundary

ARGUS does **not** claim that GPT-6 Astra is safe or unsafe.

Proof-1 found that the public record was sufficient to reconstruct the controls, reported measurements and decision basis, but not sufficient for this external reconstruction to independently establish safeguard sufficiency or acceptable residual severe cyber risk.

That distinction matters.

ARGUS treats the following as different statements:

**The claim is unsupported.**

and

**The claim cannot be independently established from the public evidence available to ARGUS.**

Missing public evidence may exist privately.

Absence of public evidence is not treated as evidence that the underlying claim is false.

---

## 5. Findings Most Relevant to Review

The technical reconstruction surfaced several points that appear decision-relevant.

### 5.1 Residual-risk bridge

Reported favourable refusal, jailbreak, misuse-monitoring and adversarial-test results provide evidence for individual controls.

However, the public corpus does not provide an independently inspectable bridge from those individual control metrics to:

- deployment-level severe-harm risk;
- a defined launch-specific acceptance threshold;
- a public demonstration that residual risk falls below that threshold.

ARGUS therefore represents this as an assurance dependency/gap rather than inferring either safety or failure.

### 5.2 Deployment-surface and intervention timing

The disclosed unauthorized-action monitoring system does not operate identically across all released interfaces.

The assurance value of monitoring therefore depends on:

- the deployment surface;
- whether full trajectory context is available;
- intervention timing;
- the possibility of harmful action occurring before intervention.

ARGUS makes these dependencies explicit rather than treating the existence of monitoring as equivalent to successful containment.

### 5.3 Transfer limits

Some alignment and adversarial findings arise from:

- simulated environments;
- near-final checkpoints;
- finite testing;
- evaluations where model awareness may affect behaviour.

These factors qualify how strongly results can be transferred to external deployment conditions.

### 5.4 Public inspectability versus external participation

External evaluators participated in parts of the process, but this does not mean every underlying safeguard result is independently inspectable.

ARGUS distinguishes:

- publicly inspectable external evidence;
- OpenAI summaries of external work;
- nonpublic evidence;
- capability evidence;
- evidence directly relevant to safeguard sufficiency.

---

## 6. Review Questions

Please answer these five questions as directly as possible.

### Q1 — Faithfulness

**Does the ARGUS Claims–Arguments–Evidence structure appear to represent the public assurance argument accurately and fairly?**

If not, please identify any claim, argument, dependency or gap that is materially misrepresented.

---

### Q2 — Added clarity

**Did ARGUS make any important part of the assurance case materially clearer than the original source documents alone?**

If yes, which part?

If no, what is missing from the representation?

---

### Q3 — Gap quality

**Are any of the identified gaps, assumptions or dependencies overstated, understated or incorrectly characterised?**

Please distinguish between:

- evidence that is genuinely missing;
- evidence that is merely nonpublic;
- a reasonable inference;
- an unnecessary ARGUS requirement.

---

### Q4 — Real-world usefulness

**What additional information, structure or functionality would you need before using a representation like this in real frontier-AI assurance or governance work?**

Please focus on practical usefulness rather than product polish.

---

### Q5 — Core validation question

**Would you use this kind of representation when reviewing, challenging or communicating a frontier-AI safety claim?**

Please answer:

- **Yes**
- **Possibly, with changes**
- **No**

and briefly explain why.

---

## 7. Optional Reviewer Observations

If useful, please also comment on:

- whether the chosen abstraction level is appropriate;
- whether any important argument is missing;
- whether provenance is sufficient;
- whether the distinction between public, private and independently produced evidence is useful;
- whether the graph introduces unnecessary complexity;
- whether another assurance methodology would represent the case more effectively;
- whether this approach could transfer to other frontier-AI risk domains.

---

## 8. Suggested Response Template

```text
Reviewer:
Role / relevant expertise:
Organisation (optional):
Date:

Q1 — Faithfulness:
[response]

Q2 — Added clarity:
[response]

Q3 — Gap quality:
[response]

Q4 — Real-world usefulness:
[response]

Q5 — Core validation question:
[Yes / Possibly, with changes / No]

Reason:
[response]

Additional observations:
[response]

Permission to quote this feedback in future ARGUS documentation:
[Yes / Yes anonymously / No]
```

---

## 9. What Counts as Proof-1 Success

ARGUS has already technically demonstrated that:

1. a real frontier AI safety claim can be decomposed into a coherent assurance structure;
2. public evidence can be connected to individual arguments with explicit provenance;
3. meaningful dependencies, limitations and gaps can be made clearer in the representation;
4. the resulting case can be independently inspected without treating ARGUS itself as an authority.

The remaining North Star condition is:

> **At least one credible external reviewer finds the representation useful for understanding or interrogating the safety claim.**

This review is intended to test that condition.

A positive review does **not** validate OpenAI's safety conclusion.

A critical or negative review does **not** constitute failure of the reviewer or of the underlying safety work.

The value of this stage is external evidence about whether ARGUS itself solves a genuine assurance problem.

---

## 10. Review Request

Please approach the artifact as a critic, not an endorser.

We are specifically looking for:

- errors;
- unjustified assumptions;
- misleading structure;
- missing argumentation;
- unnecessary complexity;
- evidence that the representation adds real assurance value;
- evidence that it does not.

The strongest possible review is one that helps determine whether ARGUS should become a larger governed project at all.

---

## Review Objective

> **Does ARGUS make a frontier AI safety claim meaningfully easier for an independent third party to inspect, understand and challenge?**
