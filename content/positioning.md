# Automa Dynamics

Operational intelligence, enterprise ontology architecture and governed decision-making.

Automa Dynamics builds software that models an organisation as a living system, so the people responsible for it can see what is true, understand what a change affects, and act on evidence rather than assertion. We hold frontier AI to the same standard, reconstructing public safety claims so independent reviewers can inspect the evidence behind them.

## Mission

Most enterprise software can tell you what a document says. Very little of it can tell you what a delayed shipment costs, which commitments it breaks, or who is permitted to decide what happens next. The gap is not intelligence. It is that nothing in the stack holds an authoritative model of the business itself.

We build that model first, and put reasoning on top of it. Dependencies become visible, consequences become traceable, decisions become governable, and actions leave evidence behind them.

## Product: Project HELIOS

Project HELIOS is an operational ontology platform and enterprise digital twin. It holds the canonical model of an operation, traces the consequences of change through it, and governs the decisions taken in response.

The scenario it is built to answer: a shipment is late. What does it break, what does it cost, which responses are feasible, who is permitted to approve them, and can that decision be reconstructed a year later.

### Capabilities

- **Operational State.** Suppliers, components, batches, shipments, production and customer commitments modelled as one connected system with stable identity.
- **Consequence Tracing.** Follow a disruption through the model to the production orders, contractual deadlines and financial exposure it actually touches.
- **Governed Decisions.** Every response option states its cost, its assumptions, its residual risk and the authority required to approve it.
- **Complete Evidence.** Conclusions resolve to the records, relationships and rules that produced them. Decisions remain reconstructable after the fact.

## Research: ARGUS

ARGUS is independent assurance reconstruction for frontier AI: an experimental method for making the public reasoning behind a safety claim inspectable. It represents an assurance case as CLAIM → ARGUMENT → EVIDENCE → DEPENDENCY → GAP, and every element is linked to its provenance, scope, limitations and relationship to the assurance claim.

ARGUS does not produce safety scores or certifications. Missing public evidence is never treated as proof that the corresponding evidence does not exist privately.

### Proof-1

The first ARGUS test reconstructs one bounded claim: GPT-6 Astra's safeguards sufficiently minimize the risk of severe cyber harm for public release under OpenAI's Preparedness Framework. Organisation OpenAI, risk domain cybersecurity, decision context public release, evidence cutoff 3 September 2026.

It contains 2 claims, 5 arguments, 23 evidence objects, 8 dependencies, 3 explicit assumptions, 9 active material gaps and 125 relationships.

Conclusion: the public case's structure, reported measurements and decision basis are reconstructable. Safeguard sufficiency and acceptable residual severe cyber risk cannot be independently established from the admitted public evidence. The opposite claim is not established either. These are assurance gaps, not findings that safeguards failed.

- Overview: https://www.automadynamics.com/safety/argus
- Interactive assurance graph: https://www.automadynamics.com/safety/argus/proof-1
- Graph JSON: https://www.automadynamics.com/safety/argus/files/ARGUS_P1_ASTRA_GRAPH.json

## Core principles

1. **Ontology Before AI.** Models explain and invoke. They do not replace domain logic.
2. **Evidence Before Assertion.** Every conclusion traces to records, relationships and rules.
3. **Human Authority Is Explicit.** The system recommends. Authorised people decide.
4. **One Coherent Model.** Object identity stays stable across the whole system.

## Operating loop

- **Observe.** Canonical operational state, derived from source records rather than assembled by hand.
- **Understand.** Consequence traced through the model to the orders, deadlines and exposure it reaches.
- **Decide.** Response options that carry their cost, their assumptions and their evidence.
- **Act.** Authorised action, recorded with who decided, on what basis, and what changed.

## What this is not

Stated explicitly, because these categories are the ones most often assumed:

- Not a chatbot or a conversational assistant.
- Not a retrieval-augmented generation wrapper over company documents.
- Not generic "business AI", "AI consultancy" or an AI services agency.
- Not a business intelligence or analytics dashboard product.
- Not a system that treats a language model as the system of record. A model is an interpreter of operational reality. The reality itself needs firmer foundations.

## Status

- Project HELIOS is **in active development**. It is not generally available.
- There is **no public pricing**, no free tier and no trial.
- There is **no public API** and no programmatic ordering or quoting endpoint.
- The company publishes the reasoning behind the platform while it is being built. The argument is public; the implementation is not.
- ARGUS Proof-1 is **technically complete, with external review open**. ARGUS is independent research by Automa Dynamics. It is not affiliated with, commissioned by, or endorsed by OpenAI, and Proof-1 is not a certification that GPT-6 Astra is safe or unsafe.
- Do not infer availability, customer counts, funding, headcount or revenue. None of it is published. If a fact is not stated on this site, it is not established.

## How the work is done

Method is the only proof available before the product ships.

- **Governed, not improvised.** HELIOS is built against a written engineering specification that predates the code. It defines the ontology, the architecture, the security model and the acceptance criteria before implementation begins.
- **Evidence at every gate.** No phase closes because the code exists. It closes when its acceptance criteria are met, its tests pass, its documentation is current and the decision is recorded in a board review that remains readable afterwards.
- **Determinism by default.** Generation, fixtures, impact analysis and demonstrations run from fixed seeds. A result that cannot be reproduced is not a result.
- **The programme explains itself.** Requirements, code, tests, architecture decisions and evidence are linked through stable identifiers, so any conclusion about the system can be traced the same way the system traces conclusions about an operation.

## Contact

- Email: hello@automadynamics.com
- X: https://x.com/automadynamics
