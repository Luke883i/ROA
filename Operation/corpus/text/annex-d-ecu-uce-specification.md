---
id: "annex-d-ecu-uce-specification"
title: "Annex D - Epistemic LLM neuron ECU-UC Specification"
role: "technical_annex"
source_path: "RLA-CRC-ECNN/Annex D - Epistemic LLM neuron ECU-UC Specification.pdf"
source_raw_url: "https://raw.githubusercontent.com/Luke883i/RLA-ECNN/main/RLA-CRC-ECNN/Annex%20D%20-%20Epistemic%20LLM%20neuron%20ECU-UC%20Specification.pdf"
source_sha256: "bd424693c01ddff79365a9211deebaa649e5f9ad2c14949b62eae158e9fee186"
extraction_status: "success"
---

## Page 1

Annex D
Epistemic Computational Units (ECU / UCE)
Formal Specification and Design Patterns
Gianluca Conte
September 2025
Abstract
This annex provides a formal specification ofEpistemic Computational Units(ECUs), also
referred to asUnità Computazionali Epistemiche(UCEs) in the Italian texts, as they are used
in the RLA/CRC and ECNN framework. ECUs are designed as the core epistemic elements of
epistemic neural architectures: they receive high–level representations from a representation
channel, interpret them as structured claims in a given domain, and produceepistemic
artifacts comprising decisions, confidence, explicit “unknown” and “contradiction” signals,
and human–readable rationales. Their behaviour is constrained by a deterministicepistemic
matrix M, encoding entities, rules, coherence constraints and rejection policies, so that
the overall system remains Turing–computable and internally falsifiable [Turing, 1936/1937,
Shalizi & Crutchfield, 2001].
At a higher tier, small but structured reticula of ECUs/UCEs implement higher–order
epistemic functions such as executive control, valuation, memory consolidation and metacog-
nitive monitoring. They instantiate, at the highest levels of an ECNN, compact reticula in
the sense of Annex A, where the basic “neurons” are themselves epistemic units.
ECUs/UCEs can be realised in different regimes, ranging from purely symbolic rule–based
systems to orchestrated assemblies of Large Language Models (LLMs) acting as “epis-
temic neurons” under strictly controlled prompts and parsing protocols [Brown et al., 2020,
Ouyang et al., 2022, Wei et al., 2022]. The annex covers: (i) concepts and definitions; (ii)
architectures for minimal and LLM–based ECUs; (iii) multi–ECU topologies and their role
in compact reticula; (iv) determinism, computability and epistemic closure; (v) inference
and self–audit protocols; (vi) metrics and test suites for epistemic performance; (vii) design
patterns and deployment scenarios. Throughout, ECUs/UCEs are presented asepistemic
devices for structuring and exposing knowledge and ignorance, not as ontological models of
cognition.
Contents
1 Introduction and Scope 2
1.1 Relation to RLA/CRC and ECNNs . . . . . . . . . . . . . . . . . . . . . . . . . . 3
1.2 Epistemic, not ontological, stance . . . . . . . . . . . . . . . . . . . . . . . . . . . 3
1

## Page 2

2 Concepts and Basic Definitions 4
2.1 Epistemic entities and artifacts . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4
2.2 Epistemic matrix . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4
2.3 Epistemic Computational Unit (ECU / UCE) . . . . . . . . . . . . . . . . . . . . 5
2.4 Multi–ECU reticula . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
3 Architectures for ECUs 6
3.1 Minimal (non–LLM) ECUs . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6
3.2 LLM–based “epistemic neurons” . . . . . . . . . . . . . . . . . . . . . . . . . . . 6
3.3 Multi–ECU topologies . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
4 Determinism, Computability and Epistemic Closure 8
4.1 Deterministic ECU regimes . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8
4.2 Epistemic closure for ECUs and multi–ECU reticula . . . . . . . . . . . . . . . . 8
4.3 Internal epistemic “oracle” (non–metaphysical) . . . . . . . . . . . . . . . . . . . 8
5 Inference and Self–Audit Protocols 9
5.1 Forward inference . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 9
5.2 Self–audit and stability checks . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 9
5.3 Interaction with Popper–χsuites . . . . . . . . . . . . . . . . . . . . . . . . . . . 9
6 Metrics and Test Suites for ECUs and Reticula 10
6.1 Single–ECU metrics . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 10
6.2 Multi–ECU reticulum metrics . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 10
6.3 Challenge–oriented metrics . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 10
7 Design Patterns and Deployment Scenarios 11
7.1 ECU/UCE as epistemic head of an ECNN . . . . . . . . . . . . . . . . . . . . . . 11
7.2 Multi–ECU reticula as epistemic oracles for simulators . . . . . . . . . . . . . . . 11
7.3 Safety–critical configurations . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 11
8 Discussion and Limitations 12
9 Conclusion 12
1 Introduction and Scope
Deep neural networks excel at pattern recognition but typically offer limited support for explicit
notions of explanation, contradiction, or admitted ignorance [Lipton, 2018, Miller, 2019]. Stan-
dard architectures are optimised for predictive accuracy; their logical limits remain implicit in
calibration errors, adversarial fragility and opaque failure modes.
Epistemic architectures extend this picture. They incorporate:
• arepresentation channel(e.g. a convolutional, recurrent or transformer backbone) that
compresses raw data into abstract features;
2

## Page 3

• anepistemic headthat issues not only labels and probabilities but also explicit “unknown”
and “contradiction” statements;
• an internalepistemic operatorthat evaluates candidate decisions against a domain theory
and explicit epistemic policies.
Epistemic Computational Units (ECUs/UCEs) are the atomic components of this operator.
They are intended as:
1. finite, deterministic devices constrained by a domain–specific epistemic matrixM;
2. capable of converting high–level representations into structured artifacts containing deci-
sions, rationales and epistemic signals;
3. auditable objects whose behaviour can be stress–tested by challenge suites and falsifiability
protocols.
At a higher tier, small multi–ECU reticula with specialised roles and fixed topology provide
an interface between ECNN representation channels (Annex C) and the multi–level reticular
semantics of Annex A and Annex D.
1.1 Relation to RLA/CRC and ECNNs
In the language of Reticular Local Abstraction (RLA) and Compact Reticular Computability
(CRC) from Annex A, ECUs/UCEs and their reticula play three roles:
•Each ECU/UCE is a Turing–computable map between a representation levelLz (e.g. the
penultimate layer of an ECNN) and an epistemic levelLep carrying artifacts.
• A multi–ECU reticulum is a compact RLA sub–reticulum comprised of such levels and
transmissions, often with additional internal state (context buffers, episodic memory).
• ECNNs of Annex C are extended, at their top, by such reticula so that epistemic behaviour
(unknowns, contradictions, rationales) becomes an explicit part of the compact reticulum
rather than an external post–hoc diagnostic.
This annex concentrates on the local design of ECUs/UCEs and their small reticula, assuming
the global reticular context from Annex A and the ECNN layer structures of Annex C.
1.2 Epistemic, not ontological, stance
The treatment is explicitly epistemic. ECUs/UCEs encode and expose structured knowledge and
ignorance about a domain relative to a given epistemic horizon and theory, but do not claim to
implement any privileged ontology of human or biological cognition [Anderson, 1972,Noble, 2012].
Their value lies in:
•making limits and contradictions visible as first–class objects;
•enabling systematic falsification attempts [Popper, 1959];
• providing an interface between learned representations and symbolic domain theories, in
the spirit of neural–symbolic integration [Besold et al., 2017, d’Avila Garcez et al., 2012].
3

## Page 4

2 Concepts and Basic Definitions
2.1 Epistemic entities and artifacts
Definition 2.1(Epistemic entities).Anepistemic entityis any concept, predicate or label used
in a given domain theory. We writeE ={e1,...,em}for the finite set of entities, such as
diagnostic labels, risk categories, legal norms, causal regimes, or physical phases.
Definition 2.2(Epistemic artifact).Anepistemic artifactis a finite structured object
a= (y ⋆,q,s,R,Π),
where:
•y ⋆∈E∪{⊥,⊥c}is a primary decision, with⊥denoting “unknown” and⊥c denoting
“contradiction”;
•q∈[0,1]is a confidence or epistemic strength parameter;
•s is an optional signature or hash referencing the input and internal state (for audit and
reproducibility);
•R is a finite set of rationales (structured or textual), e.g. tuples of entities and rules
supportingy ⋆;
•Πis a finite set of policies or actions recommended under the given decision.
Artifacts are the principal interface between ECUs/UCEs and downstream systems or human
users. They can be seen as compressed summaries of the epistemic stance of the system on a
particular input.
2.2 Epistemic matrix
Definition 2.3(Epistemic matrix).Anepistemic matrixis a tuple
M= (E,R,C,P),
where:
•Eis a finite set of epistemic entities;
•R is a finite set of inference rules between entities (implications, equivalences, defaults,
temporal rules);
•C is a finite set of coherence constraints, encoding incompatibilities, subsumption and other
structural relations (e.g.ei ande j cannot both hold, or one subsumes the other);
•P is a finite set of policies specifying conditions for rejection, abstention, escalation, or
fallback actions.
4

## Page 5

All components ofM are represented in data structures suitable for processing by a Turing
machine [Turing, 1936/1937].
The epistemic matrix plays three roles:
1. it constrains which primary decisionsy⋆are allowed in which contexts;
2. it defines what counts as contradiction or incoherence;
3. it codifies domain–specific prudence (when to abstain, escalate, or override).
2.3 Epistemic Computational Unit (ECU / UCE)
Definition 2.4(Epistemic Computational Unit).Given a representation spaceZ (e.g. Rd) and
an epistemic matrixM, anEpistemic Computational Unit(ECU) is a deterministic, Turing–
computable function
ECUϕ:Z×M−→A,
whereA is a finite or countable set of epistemic artifacts andϕdenotes internal configuration
(weights, thresholds, rule parameters).
Definition 2.5(UCE notation).In the Italian texts the acronym UCE (Unità Computazionale
Epistemica) is used as a synonym for ECU. No formal distinction is made in this annex; the
choice of notation reflects linguistic context rather than mathematical content.
An ECU/UCE is thus a local reticular map from a representation levelLz =⟨Z,Σz⟩(as in
Annex C) to an epistemic levelLep =⟨A,Σep⟩, subject to the constraints ofM.
2.4 Multi–ECU reticula
Definition 2.6(Multi–ECU reticulum).Amulti–ECU reticulumis a finite RLA sub–reticulum
U= (L z,L (1)
ep,...,L (K)
ep ,L glob),
where:
•L z is a representation level receiving inputs from an ECNN or another model;
• each L(k)
ep is the range of an ECU/UCE ECU(k), capturing the epistemic stance of a
specialised unit (e.g. legal, risk, causal);
•L glob is a global aggregation level that fuses the artifacts from allL(k)
ep into a joint artifact
aglob.
Transmissions withinUare:
•τ(k)
z :Z→A(k),(z↦→ECU(k)(z,M));
•τagg :A (1)×···×A(K)→Aglob, a deterministic aggregation map.
Informally, ECUs/UCEs are the atomic epistemic units; multi–ECU reticula such asU are
the structured “organs” made of ECUs/UCEs, responsible for a coherent epistemic interface at
the top of an ECNN or other reticulum [Besold et al., 2017, d’Avila Garcez et al., 2012].
5

## Page 6

3 Architectures for ECUs
3.1 Minimal (non–LLM) ECUs
Pipeline.A minimal ECU follows the pipeline:
z∈Z Ψ−−→h∈H
ΓM
−−−→ˆa∈A
Π M
−−−→a∈A,
where:
• Ψis a neural or linear projection fromZ to a symbolic hypothesis spaceH (e.g. logits over
E, or scores over rule premises);
•Γ M applies rules and constraints fromMtoh, producing an intermediate artifactˆa;
• ΠM enforces policies such as abstention, escalation or default actions, yielding the final
artifacta.
Example construction.Let H = R|E|be a logit vectorh over entities, withhk proportional
to the logit for entityek. Letr ij∈Rdenote a ruleei⇒ej. A simple deterministic update is:
hj←max(hj,hi−δij),
for some fixed penaltyδij≥0. Constraints inC (e.g. ei incompatible withej) are enforced by
setting the lower–scored entity to−∞. Policies inPthen map the resultinghto:
•a decisiony ⋆= arg maxkhk, if coherence holds and confidence exceeds a threshold;
•y ⋆=⊥if confidence is low or rules prescribe abstention;
•y ⋆=⊥c if mutually incompatible entities are simultaneously activated.
Rationales R are constructed from the subset of rules and entities that contributed to the final
decision; policiesΠare derived fromP.
3.2 LLM–based “epistemic neurons”
Motivation.For complex domains, the hypothesis spaceH may be difficult to encode with sim-
plelogitsandrulesalone. LargeLanguageModels(LLMs)offerapracticalwaytoapproximaterich
inference patterns, but they must be constrained so that the overall ECU/UCE remains determinis-
tic, Turing–computable and auditable [Brown et al., 2020, Ouyang et al., 2022, Wei et al., 2022].
Definition 3.1(Epistemic neuron).Anepistemic neuronis an LLM instance with parameters
ω, executed under:
1. a fixed prompt template that encodesMor a subsetMk;
2. a fixed decoding policy (e.g. temperatureT= 0, top–k= 1);
3. a strict output format (e.g. JSON schema) enforced by a deterministic validator.
The neuron receives a structured representation ofz as input and emits a candidate partial artifact
a(k).
6

## Page 7

Multi–neuron ECUs.An ECU/UCE may aggregate the outputs ofKepistemic neurons:
z↦−→(a(1),...,a (K))↦−→a,
where the aggregation is entirely deterministic. For example, each neuron can be specialised on a
subdomain (e.g. legal norms, risk metrics, causal explanations). An aggregation policy may:
•detect contradictions amonga (k) and map them to⊥c;
•compute a consensus decision and confidence from they⋆(k)andq (k);
• compose rationales into a single structured explanation, while enforcing the coherence
constraintsC.
Determinism and computability.Despite using LLMs, the overall ECU/UCE remains
Turing–computable when:
•prompts, decoding parameters and maximum output length are fixed and documented;
•outputs are post–processed by a deterministic parser and validator;
• any stochastic components are either disabled or simulated in a way that can be reproduced
(e.g. logged seeds).
Under these conditions, the LLMs act as large but finite transition tables, not as non–computable
oracles [Turing, 1936/1937].
3.3 Multi–ECU topologies
At the level of multi–ECU reticula, ECUs/UCEs are connected in small reticula that implement
distinct epistemic functions:
• Executive ring:a cycle of ECUs/UCEs handling goal management, constraint enforcement
and conflict resolution over artifacts.
• Valuation ring:ECUs/UCEs specialised in assessing risk, cost, utility, or other valuation
metrics, feeding into policiesΠ.
• Memory ring:ECUs/UCEs equipped with access to episodic or semantic stores, control-
ling how past artifacts influence current decisions.
• Metacognitive ring:ECUs/UCEs operating on artifacts produced by other ECUs/UCEs,
checking coherence, stability and calibration.
These rings can themselves be organised in higher–level reticula, provided IOA, EC and TC
(Annex A) remain satisfied.
7

## Page 8

4 Determinism, Computability and Epistemic Closure
4.1 Deterministic ECU regimes
Axiom 4.1(Deterministic execution).An ECU/UCE must be executable as a deterministic
program: for each pair(z,M )it returns the same artifacta, up to representational equivalence,
across runs.
This axiom excludes untracked randomness inside the ECU/UCE. Stochasticity can still be
simulated (e.g. for exploration), but it must be made explicit and reproducible so that auditability
is preserved.
4.2 Epistemic closure for ECUs and multi–ECU reticula
Definition 4.1(Epistemic closure for ECUs and multi–ECU reticula).An ECU/UCE or a
multi–ECU reticulum isepistemically closedwith respect toM if all its decisions, rationales and
policies can be expressed as finite statements involving only:
•entities inE;
•rules inR;
•constraints inC;
•policies inP;
•deterministic functions over the representation spaceZand internal buffers.
Intuitively, closure ensures that ECUs/UCEs and their reticula do not silently rely on unstated
assumptions or external black boxes that cannot be mapped back intoM. In practice, this calls
for documentation artefacts such as:
•JSON schemas describing artifact formats;
•formal descriptions (or at least structured encodings) of rule sets and constraints;
•versioned prompt templates for LLM–based epistemic neurons.
4.3 Internal epistemic “oracle” (non–metaphysical)
ECUs/UCEs are sometimes colloquially described as providing an “internal epistemic oracle”: a
capability to sayI do not knoworthis is contradictoryfrom within the model. Formally, this is
realised by:
1. explicit⊥and⊥c states inside artifacts;
2. deterministic policies inP that map detectable conflict or lack of justification to those
states;
3. challenge suites used to test that the ECU/UCE uses⊥and⊥c in the intended way.
No non–computable oracle is implied; the term is purely epistemic and relative to the horizon
specified byM[Popper, 1959].
8

## Page 9

5 Inference and Self–Audit Protocols
5.1 Forward inference
A generic ECU/UCE inference protocol takes as input an internal representationz and returns
an artifacta:
1. Claim extraction:apply a deterministic mapΦ : Z→Hthat interpretsz as candidate
claims (e.g. scores over entities, structured features).
2. Rule application:applyΓ M to obtain an intermediate artifactˆa, enforcing inference
rules and coherence constraints.
3. Policy application:applyΠ M to ˆa, producing the final artifacta with decisions and
policies.
4.Formatting:renderainto the agreed external schema (e.g. JSON with standard fields).
In LLM–based ECUs/UCEs, step 1 may itself call one or more epistemic neurons whose
outputs are then consolidated byΓM andΠ M.
5.2 Self–audit and stability checks
To make logical limits explicit, ECUs/UCEs and their reticula can implement self–audit protocols:
• Perturbation stability:apply controlled perturbations δzto inputs or intermediate
representations and check whether decisions and rationales remain stable within expected
ranges.
• Consistency checks:re–apply inference with subsets of rules or altered policies to detect
internal brittleness or hidden dependencies.
• Round–trip sanity:given an artifacta, project it back to a synthetic representationz′,
feedz ′to the ECU/UCE and verify that the resulting artifacta′is compatible witha.
These procedures allow ECUs/UCEs and their reticula to approximate a form of meta–
reasoning about their own outputs, without departing from Turing–computability.
5.3 Interaction with Popper–χsuites
ECUs/UCEs and their reticula are naturally tested using Popper–style challenge suites as
described in Annex C and Annex D:
•cases engineered to expose inconsistencies inM;
•corner cases where domain theory is genuinely agnostic;
• adversarial constructions that mimic in–domain statistics while reversing or scrambling
semantics.
The ECU/UCE’s role is to respond with⊥or⊥c wheneverM cannot support a determinate deci-
sion, turning model limits into observable behaviours [Popper, 1959, Shalizi & Crutchfield, 2001].
9

## Page 10

6 Metrics and Test Suites for ECUs and Reticula
6.1 Single–ECU metrics
LetD ={(zi,yi,ei)}N
i=1 be a dataset wherezi are representations,yi labels or ground–truth
epistemic entities, andei indicate epistemic regime (certain,uncertain,contradictory).
Core metrics include:
• Accuracy on certain cases:standard classification accuracy on the subset{i: ei =
certain}.
• Abstention quality:the fraction of cases withei = uncertain for which the ECU/UCE
outputs⊥.
•Contradiction detection:the fraction of contradictory cases correctly flagged as⊥c.
• Calibration:expected calibration error (ECE) for the confidence scoresqi in artifacts
[Guo et al., 2017].
• Explanation coherence:the proportion of explanations inR that satisfy the constraints
C(e.g. do not cite mutually incompatible entities).
6.2 Multi–ECU reticulum metrics
In architectures with multiple ECUs/UCEs inside a reticulum, additional metrics become relevant:
• Epistemic diversity:the average pairwise distance between artifacts produced by different
ECUs/UCEs on the same inputs, measured over rationales or decision structures.
• Consensusstrength:thefractionofcaseswhereECUs/UCEsagreeon y⋆andq, indicating
stable conclusions.
• Conflict resolution quality:in cases of disagreement, how often the aggregation policy
yields decisions aligned with ground–truth or expert judgement.
• Metacognitive reliability:for reticula with metacognitive rings, the rate at which
meta–ECUs/UCEs correctly flag artifacts that are later judged erroneous or fragile by
external audit.
6.3 Challenge–oriented metrics
For Popper–style challenge suites:
• Challenge pass rate:fraction of challenge items where the ECU/UCE or reticulum
behaves in accordance with the intended interpretation ofM.
• Overconfidence rate:fraction of challenge items where the ECU/UCE or reticulum
produces a determinate label instead of⊥or⊥c when the domain theory supports only
indeterminacy.
• Stress stability:behaviour of the above metrics under domain shifts or adversarial
perturbations.
10

## Page 11

7 Design Patterns and Deployment Scenarios
7.1 ECU/UCE as epistemic head of an ECNN
The simplest pattern embeds a single ECU/UCE or a small multi–ECU reticulum as the epistemic
head of a larger ECNN. A representation channel (Annex C) maps inputsx to representationsz,
and the ECU/UCE or reticulum produces artifactsa. Downstream systems and users interact
only witha, not directly withz. This pattern is appropriate when:
•the domain admits a reasonably compact epistemic matrixM;
•explicit abstention and contradiction are operationally useful;
•explanations and rationales are required for audit and governance.
7.2 Multi–ECU reticula as epistemic oracles for simulators
In more complex workflows, multi–ECU reticula can act as epistemic oracles for computational
simulators (e.g. multi–level physical, biological or socio–technical models). The simulator produces
trajectories or statesxt; a representation channel mapsxt toz t; the reticulum judges:
•whether trajectories are coherent with domain theoryM;
•which scenarios are underexplored or epistemically fragile;
•when simulations enter regimes where the theory is silent and⊥is appropriate.
This pattern is particularly natural in the RLA/CRC setting of Annex A and Annex D.
7.3 Safety–critical configurations
In safety–critical contexts (e.g. healthcare, infrastructure, finance), ECUs/UCEs and their reticula
should be configured in conservative regimes:
•thresholds for accepting determinate decisions should be high;
•abstention (⊥) should be preferred when data or theory are insufficient;
• all ECU/UCE and reticulum versions, prompts and matrices should be versioned, logged
and auditable;
• human oversight should be able to inspect artifacts and challenge decisions, updatingM
as needed.
The role of ECUs/UCEs and their reticula is then not to replace human judgement but to make
the system’s internal epistemic stance explicit and testable.
11

## Page 12

8 Discussion and Limitations
ECUs/UCEs and their reticula crystallise several trends:
• the move from raw prediction to structured epistemic outputs, including explicit ignorance
and contradiction [Lipton, 2018, Miller, 2019];
• the integration of neural and symbolic components in a single, Turing–computable device
[Besold et al., 2017, d’Avila Garcez et al., 2012];
• theideathattopology(howreasoningmodulesareconnected)mattersatleastasmuchasraw
parameter count, resonating with views in complex systems and biology [Anderson, 1972,
Noble, 2012].
When ECUs/UCEs are built from LLM–based neurons, the architecture inherits both
the expressive power and the potential failure modes of those models [Brown et al., 2020,
Ouyang et al., 2022, Wei et al., 2022]. The epistemic matrixM and the parsing protocols be-
come crucial choke points: they must be simple enough to be audited, yet expressive enough to
encode relevant theory. The challenge is to design ECUs/UCEs and reticula that are not only
powerful but also transparent and falsifiable.
This annex is deliberately abstract. Concrete instantiations will be constrained by:
•the availability and quality of domain theories encoded inM;
•the reliability, calibration and cost of LLM–based components;
• the complexity of integrating ECUs/UCEs and their reticula into existing workflows,
especially in regulated domains.
Moreover, epistemic metrics are sensitive to the design of challenge suites and to assumptions
about what counts as “unknown” or “contradictory”. These aspects must be clarified on a
per–domain basis.
9 Conclusion
Epistemic Computational Units (ECU / UCE) and their small reticula provide a concrete,
formalised answer to a simple question: how can a computational system say, in a disciplined
way,this is what I think, this is why, and this is where I do not know or do not agree?
By grounding ECUs/UCEs and their reticula in deterministic, Turing–computable maps
governed by an explicit epistemic matrixM, this annex sketches a path toward architectures
that:
•preserve the strengths of modern representation learning;
•make limits and contradictions first–class signals;
• support systematic testing and falsification in the spirit of Popper and computational
mechanics [Popper, 1959, Shalizi & Crutchfield, 2001].
12

## Page 13

Whether ECUs/UCEs are implemented minimally or via sophisticated LLM–based neurons,
their value will ultimately be measured by how well they help humans and institutions navigate
complexity without hiding logical limits under a veneer of spurious certainty.
References
[Anderson, 1972] Anderson, P. W. (1972). More is different.Science, 177(4047), 393–396.https:
//doi.org/10.1126/science.177.4047.393
[Besold et al., 2017]Besold, T. R., d’Avila Garcez, A., Bader, S., Bowman, H., Domingos, P.,
Hitzler, P., ..., & Vennekens, J. (2017). Neural-symbolic learning and reasoning: A survey
and interpretation.arXiv preprintarXiv:1711.03902. https://arxiv.org/abs/1711.03902
[Brown et al., 2020]Brown, T. B., Mann, B., Ryder, N., Subbiah, M., Kaplan, J., Dhariwal, P.,
..., & Amodei, D. (2020). Language models are few-shot learners. InAdvances in Neural
Information Processing Systems, 33(pp. 1877–1901).
[d’Avila Garcez et al., 2012]d’Avila Garcez, A., Gabbay, D., & Lamb, L. C. (2012).Neural-
Symbolic Cognitive Reasoning. Springer.https://doi.org/10.1007/978-3-642-34451-7
[Guo et al., 2017]Guo, C., Pleiss, G., Sun, Y., & Weinberger, K. Q. (2017). On calibration of
modern neural networks. InProceedings of the 34th International Conference on Machine
Learning(pp. 1321–1330).
[Lipton, 2018] Lipton, Z. C. (2018). The mythos of model interpretability.Queue, 16(3), 31–57.
https://doi.org/10.1145/3236386.3241340
[Miller, 2019] Miller, T. (2019). Explanation in artificial intelligence: Insights from the social
sciences.Artificial Intelligence, 267, 1–38.https://doi.org/10.1016/j.artint.2018.07.
007
[Noble, 2012] Noble, D. (2012). A theory of biological relativity: No privileged level of causation.
Interface Focus, 2(1), 55–64.https://doi.org/10.1098/rsfs.2011.0067
[Ouyang et al., 2022]Ouyang, L., Wu, J., Jiang, X., Almeida, D., Wainwright, C., Mishkin, P.,
..., & Ziegler, D. M. (2022). Training language models to follow instructions with human
feedback. InAdvances in Neural Information Processing Systems, 35(pp. 27730–27744).
[Popper, 1959] Popper, K. R. (1959).The Logic of Scientific Discovery. Hutchinson.
[Shalizi & Crutchfield, 2001]Shalizi, C. R., & Crutchfield, J. P. (2001). Computational mechan-
ics: Pattern and prediction, structure and simplicity.Journal of Statistical Physics, 104(3–4),
817–879.https://doi.org/10.1023/A:1010388907793
[Turing, 1936/1937]Turing, A. M. (1936/1937). On computable numbers, with an application
to the Entscheidungsproblem.Proceedings of the London Mathematical Society, s2-42(1),
230–265.https://doi.org/10.1112/plms/s2-42.1.230
13

## Page 14

[Wei et al., 2022]Wei, J., Wang, X., Schuurmans, D., Bosma, M., Ichter, B., Xia, F., ..., &
Zhou, D. (2022). Chain-of-thought prompting elicits reasoning in large language models. In
Advances in Neural Information Processing Systems, 35(pp. 24824–24837).
14
