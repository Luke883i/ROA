---
id: "main-paper-rla-ecnn-crc-pce"
title: "Main Paper - RLA-ECNN-CRC-PCE"
role: "core_paper"
source_path: "RLA-CRC-ECNN/_Main_Paper_RLA-ECNN-CRC-PCE.pdf"
source_raw_url: "https://raw.githubusercontent.com/Luke883i/RLA-ECNN/main/RLA-CRC-ECNN/_Main_Paper_RLA-ECNN-CRC-PCE.pdf"
source_sha256: "46614044c0ca3d6441d9052f20e6f16c1c117f4337baf692bdcc9bdf0c0d89e9"
extraction_status: "success"
---

## Page 1

Reticular Local Abstraction and Compact Reticular
Computability
An Epistemic Position Paper on Multi-Level Models,
Epistemic Neural Architectures, and Topological Proto-Consciousness
Gianluca Conte
https://github.com/Luke883i/RLA-ECNN
contegianluca@hotmail.com
November 25, 2025

## Page 2

Abstract
Classical computability theory provides a complete and elegant account of what
is computable at a single level of description, but it is largely silent about how com-
putation proceeds in multi-level scientific systems characterized by coarse-graining,
information collapse, and emergent macro-phenomena. Modern sciences—from sys-
tems biology to condensed matter physics and neural AI—routinely work with chains
of models spanning distinct levels, where injective, quasi-injective, and non-injective
relations coexist.
This article is an explicitlyepistemic position paper. It introducesReticular Lo-
cal Abstraction(RLA) andCompact Reticular Computability(CRC) as a concep-
tual framework for thinking about multi-levelmodelsand epistemic architectures, not
about the ultimate ontology of the world. Scientific domains, and the formalisms used
to model them, are classified along a spectrum of Turing-likeness not as claims about
reality itself, but as tools for discretising and organising human experience and mea-
surement. RLA treats scientific levels as pairs of state spaces and rule sets within such
modelling practices, linked by transmissions that may preserve distinctions or collapse
them. CRC characterises when such a multi-level structure is (i)internally ontologi-
cally autonomous(in a model-internal sense), (ii)epistemically closed, and (iii) fully
Turing-computable, all relative to a chosen epistemic horizon. Under these conditions,
undecidability and emergence become structural properties of themodelling reticulum:
limits can propagate along quasi-injective links, while non-injective collapses generate
novel macro-properties that are nonetheless computable at their level.
A proof-of-concept case study on a generalist bryophyte shows how equations,
parameters, and feedbacks from the relevant literature can be assembled into a com-
pact reticulum within the bryophyte’s internal ontological horizon as reconstructed
by plant physiology and ecology (Annex B). In such a setting, and provided the em-
bedded science is sufficiently expressive and free of major error, one can reasonably
expect synthetic observations to approximate epistemic equivalence to empirical ones
in blind assessment by domain experts; at present this remains a design goal rather
than a validated result. We then move from this natural CRC to engineered CRC
architectures: convolutional neural networks (CNNs) are reinterpreted as RLA retic-
ula, andEpistemic CNNs(ECNNs) extend them with an epistemic head capable of
emitting unknown and contradiction under a falsifiable protocol.
To implement epistemic closure in practice, we proposeEpistemic Computational
Units(ECU), realised as large language models constrained by deterministic epistemic
matrices, andEpistemic Computational Entities(UCE) arranged in functional rings.
Because each ECU can, under matrix control, generate structured epistemic objects—
such as coarse-grained models of prefrontal functions, abstract decision policies, or
even Jungian-style archetypal patterns—in a way that is conditionally dependent on
the outputs of other ECUs, the relevant scale for proto-conscious behaviour is not the
raw number of low-level neurons or parameters. What matters is the topology and
closure of the reticulum of such high-level epistemic objects, including cases where the
objects model “alien” mechanisms outside familiar human phenomenology.
Finally, weoutline—asaclearlymarkedspeculativeperspective—atopologicalcon-
jecture of proto-consciousness in compact epistemic reticula: consciousness is treated
notasascalarfunctionofsize, butasapropertyofreticularconfiguration, closure, and
computable self-limits within a modelling perspective. The bridge to the Principle of
Computational Equivalence (PCE) and the conjectural aspects of proto-consciousness
are confined to a short section in this paper and developed in detail only in Annex D.
Formal definitions, proofs, and technical details for RLA, CRC, ECNN, ECU/UCE,
and the PCE bridge are provided in the accompanying annexes A–E, to which this
paper serves as an overarching conceptual manifesto.
1

## Page 3

Contents
1 Introduction: Scope and Epistemic Stance 4
1.1 Classical computability and its domain of adequacy . . . . . . . . . . . . . . 4
1.2 The multi-level nature of scientific practice . . . . . . . . . . . . . . . . . . 4
1.3 Epistemic, not ontological, ambitions . . . . . . . . . . . . . . . . . . . . . . 4
1.4 Type and scope of the contribution . . . . . . . . . . . . . . . . . . . . . . . 5
2 Reticular Local Abstraction: A Multi-Level Grammar 7
2.1 Levels as epistemic slices of practice . . . . . . . . . . . . . . . . . . . . . . 7
2.2 Transmissions: injective, quasi-injective, and non-injective . . . . . . . . . . 7
2.3 Turing-like and non-Turing regimes as properties of formalisms . . . . . . . 7
2.4 Sample formalisation . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8
2.5 Operational metrics . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 9
3 Compact Reticular Computability 9
3.1 Compact reticula: internal ontology, closure, and computability . . . . . . . 9
3.2 Definition: Compact Reticular Computability (CRC) . . . . . . . . . . . . . 9
3.3 Consequences: co-existence of limits and emergence . . . . . . . . . . . . . . 10
3.4 Relation to classical computability . . . . . . . . . . . . . . . . . . . . . . . 10
4 Case Study: A Compact Reticular System for a Generalist Bryophyte 10
4.1 Motivation and scope . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 10
4.2 Construction pipeline . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 11
4.3 Compactness in practice . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 11
4.4 Synthetic observations and epistemic equivalence . . . . . . . . . . . . . . . 12
5 From Natural CRC to Engineered CRC Architectures 13
5.1 Structural, not biological, generality . . . . . . . . . . . . . . . . . . . . . . 13
5.2 Designing CRC in computational systems . . . . . . . . . . . . . . . . . . . 13
6 CNNs as RLA Reticula and ECNNs as Epistemic CRC Instances 14
6.1 CNNs through the lens of RLA . . . . . . . . . . . . . . . . . . . . . . . . . 14
6.2 Epistemic limitations of classical CNNs . . . . . . . . . . . . . . . . . . . . 14
6.3 Related work on uncertainty, abstention, and calibration . . . . . . . . . . . 15
6.4 Epistemic CNN (ECNN): adding an epistemic channel . . . . . . . . . . . . 15
6.5 ECNN as an engineered CRC instance . . . . . . . . . . . . . . . . . . . . . 15
7 Epistemic Computational Units and Entities: LLM-Based Implementa-
tions 16
7.1 Why basic neurons are insufficient for epistemic closure . . . . . . . . . . . 16
7.2 Epistemic matrices as constraints on LLMs . . . . . . . . . . . . . . . . . . 16
7.3 Epistemic Computational Units (ECU) . . . . . . . . . . . . . . . . . . . . . 17
7.4 Epistemic Computational Entities (UCE) and functional rings . . . . . . . . 17
7.5 Topological rather than scalar scaling . . . . . . . . . . . . . . . . . . . . . 18
7.6 LLM as one realisation of ECU/UCE, not a conceptual prerequisite . . . . 18
2

## Page 4

8 A Topological Conjecture of Proto-Consciousness 19
8.1 Status of this section: speculative perspective . . . . . . . . . . . . . . . . . 19
8.2 Functional conditions for proto-consciousness . . . . . . . . . . . . . . . . . 19
8.3 Consciousness as a topological property of epistemic reticula . . . . . . . . . 20
8.4 Scope and non-scope of the conjecture . . . . . . . . . . . . . . . . . . . . . 20
9 Discussion, Related Work, and Future Work 21
9.1 Epistemic and scientific implications . . . . . . . . . . . . . . . . . . . . . . 21
9.2 Related work and frameworks . . . . . . . . . . . . . . . . . . . . . . . . . . 21
9.3 Methodological and technical limitations . . . . . . . . . . . . . . . . . . . . 22
9.4 Key tests and Popper-χprotocol . . . . . . . . . . . . . . . . . . . . . . . . 23
9.5 Future directions . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 23
3

## Page 5

1 Introduction: Scope and Epistemic Stance
1.1 Classical computability and its domain of adequacy
Classical computability theory, from Turing’s analysis of effective procedures (Turing,
1936) and Church’s lambda calculus (Church, 1936) to Rice’s theorem on extensional
propertiesofprograms(Rice,1953), providesarobustandwidelyacceptedcharacterisation
ofwhichfunctionsondiscretedomainsarecomputable. Withinthisframework, asystemis
typically captured by a single-level formalism (e.g., a Turing machine, a register machine,
or a cellular automaton), and questions of decidability or undecidability are posed within
that level.
This perspective is powerful and complete for its intended scope: reasoning about
algorithms and decision problems defined on a fixed configuration space. However, it is
largely indifferent to how scientists actually organise knowledge acrossmultiplelevels of
descriptioninempiricaldomains, andtothesystematicuseofcoarse-graining, aggregation,
and information loss in building tractable models.
1.2 The multi-level nature of scientific practice
In contemporary science, few domains are genuinely mono-level. Systems biology links
molecular dynamics, cellular regulation, tissue physiology, and organismal phenotypes
(Noble, 2012). Condensed matter physics moves between microstate ensembles and emer-
gent phases of matter (Laughlin & Pines, 2000). Neuroscience and cognitive science work
with neuronal circuits, functional networks, and behavioural-level descriptions (Bechtel
& Abrahamsen, 2005). In each case, scientific practice does not simply stack models: it
constructs chains of levels with specific relations among them.
These relations are not always information-preserving. Many modelling moves amount
to deliberatecollapses: coarse-graining over microstates, ignoring fine distinctions, or
aggregating variables into composite indices. At the same time, theoretical computer
science tells us that any Turing-like formalism capable of universal computation inevitably
hosts undecidable properties (Chaitin, 2005). The interaction between these two facts—
multi-level modelling via information collapse, and intrinsic limits of computation—is not
explicitly addressed in classical computability.
1.3 Epistemic, not ontological, ambitions
The framework developed in this paper is explicitlyepistemic. The levels, transmissions,
andreticulawediscussarenotpresentedasliteralstrataofanobjective, mind-independent
ontology. Rather, theyarestructureswithin scientific modelling practice: waysofdiscretis-
ing and organising experience, measurement, and theory.
When we classify a scientific domain as “Turing-like” or “non-Turing”, we do not at-
tributecomputationalpropertiestorealityitself. Weclassifytheformalismscurrentlyused
to represent and predict phenomena in that domain along a spectrum of Turing-likeness.
Similarly, when we speak of “ontological independence” or an “internal ontological hori-
zon”, we mean the internal ontology induced by a modelling framework: the set of entities,
laws, and relations that the model takes as its explanatory inventory. We remain neutral
on the metaphysics of the world; our claims concern the structure and limits of multi-level
models.
This stance is close to model-based and structural approaches in philosophy of science,
where models are understood as representational artefacts rather than mirrors of nature
4

## Page 6

(e.g., Humphreys, 2016). RLA and CRC are proposed as tools to reason about such models
and their interrelations, not as ontological doctrines.
1.4 Type and scope of the contribution
This article should therefore be read as aposition paperor conceptual manifesto. Its
contributions are:
1. Aconceptualandpartiallyformalframework(RLA/CRC)forreasoningaboutmulti-
level models and their computability.
2. A proof-of-concept natural case study (a bryophyte reticulum) illustrating how CRC
can be instantiated in an empirical domain.
3. A proposal for engineered CRC architectures in neural AI (ECNNs and ECU/UCE
rings), positioned with respect to existing work on uncertainty, abstention, and cal-
ibration.
4. A clearly demarcated speculative perspective on proto-consciousness as a topological
property of compact epistemic reticula.
More concretely, the main body of the paper has two modest goals:
•to propose RLA/CRC as a multi-level grammar and to illustrate it via the bryophyte
reticulum;
•to show ECNNs and ECU/UCE rings as examples of engineered CRC architectures.
The bridge to the Principle of Computational Equivalence and the topological conjec-
ture of proto-consciousness are intentionally confined to a short, clearly marked section
(Section 8) and to Annex D. They should be read as speculative extrapolations rather
than as core technical claims.
Detailed technical developments and proofs are contained in separate documents, re-
ferred to here as: Annex A (Foundations of Reticular Local Abstraction and Compact
Reticular Computability), Annex B (Compact RLA Topology for a Generalist Bryophyte),
Annex C (Epistemic CNNs: Formalisation, Training, and Metrics), Annex D (Reticular
Local Abstraction, Epistemic CNNs, and the Bridge to the Principle of Computational
Equivalence), and Annex E (Epistemic Computational Units and Entities: ECU/UCE
Design and Protocols).
How to read this package
Different readers may reasonably follow different paths through the material. A minimal
“reading strategy” is:
•Philosophy / theory of science:main paper + Annex A + Annex D.
•Machine learning / AI:main paper + Annex C + Annex E.
•Ecology / biology:main paper + Annex B.
Readers interested only in the speculative bridge to proto-consciousness can focus on
Section 8 and the corresponding parts of Annex D.
5

## Page 7

Methodological note on AI-assisted drafting
The conceptual development, formalisation and literature analysis reported in this work
were conducted by the human author, who retains full scientific responsibility for all
claims, interpretations and conjectures. During the drafting process, the author employed
several AI-based assistants (large language model systems configured with different roles
and focuses) as methodological tools for:
•supporting the identification and preliminary organisation of relevant literature, on
the basis of queries and selection criteria defined by the author;
•assisting in the production, restructuring and linguistic refinement of draft texts,
always under the direct supervision and editorial control of the author;
•exploring alternative formulations, notational variants and local consistency checks
across the RLA/CRC, ECNN, ECU/UCE and PCE frameworks.
Given the overall breadth and multidisciplinarity of the project, the resulting bibli-
ography is necessarily extensive and spans heterogeneous domains (computability theory,
philosophy of science, complex systems, ecology, neuroscience, machine learning, and AI
governance). All cited references have been manually checked by the author for existence,
authorship, basic content and thematic relevance: no intentionally fictitious work is ref-
erenced. However, in view of the scale and heterogeneity of the material, it cannot be
guaranteed that every micro-level reconstruction or bibliographic linkage is free from er-
ror or artefacts typical of AI-based drafting (“hallucination” in the sense of overconfident
but inaccurate detail).
This caveat is particularly relevant for the scientific supply chain underlying the
bryophyte case study and its compact reticulum (Annex B). The domain literature on
moss physiology and ecology is real and has been selected and cross-checked by the author,
but some specific technical details—for example, precise functional forms or parameter-
isations of individual equations when only secondary descriptions or paywalled sources
were accessible—may incorporate approximations or inferred structures that the author
is not in a position to verify line by line against the original publications. Where such
discrepancies exist, they should be interpreted as local modelling approximations rather
than as deliberate misrepresentation of the underlying science.
In the author’s assessment, these possible fine-grained inaccuracies do not materially
affect the intrinsic value of the work: neither the definition of the RLA/CRC framework
nor the construction of the compact bryophyte reticulum, whose role in the paper is
that of a proof-of-concept epistemic object. The conceptual claims, structural results and
conjectures advanced here remain independent of any single equation or parameter choice
in the case study. The use of AI tools is therefore to be understood strictly as a form of
assisted drafting and semantic support, and not as a delegation of scientific authorship,
judgement or responsibility.
6

## Page 8

2 Reticular Local Abstraction: A Multi-Level Grammar
2.1 Levels as epistemic slices of practice
Reticular Local Abstraction (RLA) starts from the observation that scientific disciplines
carve reality intolevelsof description, each with its own observables and operative rules.
In our framework, these levels are taken to beepistemic slices: stable patterns in how
communities measure, represent, and reason about phenomena, not ontological layers of
being.
Formally, a level is represented as:
L=⟨D(L),Σ(L)⟩,
whereD(L)is a space of observable or representable states (e.g., concentration vectors,
population densities, firing rates) andΣ(L)is a set of rules or operations that generate
new observations or govern dynamics within that domain.
RLA does not prescribe what the “right” levels of nature are; it provides a language
to talk about how scientific practice organises levels and relates them.
2.2 Transmissions: injective, quasi-injective, and non-injective
Between two adjacent levelsLi andL i+1, RLA posits atransmission:
τi→i+1 :D(L i)→P(D(Li+1)),
which maps states at levelLi to sets of states at levelLi+1 within the modelling context.
Transmissions can be categorised as:
•Injective: preserve all distinctions within the relevant epistemic domain; ifx1̸=x2
inD(L i), their images remain disjoint at the level of representation.
•Quasi-injective: preserve distinctions on a subsetC i⊆D(Li)ofcritical states,
e.g., those that carry Turing-level computational structure or are deemed relevant
by the domain.
•Non-injective: implement acollapseC, mapping many distinct states to fewer
equivalenceclasses(coarse-graining, saturations, thresholds), asdefinedbymodelling
choices.
These categories capture the basic ways information can travel across levels in scientific
representations: preserved, partially preserved, or collapsed.
2.3 Turing-like and non-Turing regimes as properties of formalisms
RLA also distinguishes between levels according to the computational regime of the for-
malisms used to model them:
•Turing-like: levels represented by formalisms that can, in principle, simulate uni-
versal computation (e.g., certain dynamical systems, sufficiently expressive program-
ming languages, or neural architectures).
•Turing-in-potential: levels represented by formalisms that approximate universal-
ity but are constrained by precision, memory, or energy.
7

## Page 9

•Non-Turing: levels represented by formalisms constrained to weaker forms of com-
putation (e.g., linear PDEs solved with fixed schemes).
These labels attach to therepresentational toolsrather than to nature itself. Unde-
cidability theorems apply to Turing-like formalisms; RLA tracks how the corresponding
limits interact with transmissions among levels in a multi-model chain.
2.4 Sample formalisation
For clarity, we extract one of the central ideas into a formal statement. Full development
is provided in Annex A.
Epistemic reticular system.Anepistemic reticular systemis a finite se-
quenceR= (L 1,...,L n)of levelsL i =⟨D(Li),Σ(L i)⟩together with trans-
missionsτi→i+1 :D(L i)→D(Li+1)(we restrict to single-valued mappings for
simplicity) such that eachΣ(Li)andτi→i+1 is effectively computable by some
Turing machine.
Critical set.A subsetC i⊆D(Li)iscriticalif the restriction ofΣ(L i)toC i
is Turing-complete in the sense that it can simulate any Turing machine up to
a computable encoding.
Theorem (Propagation of undecidability along quasi-injective trans-
missions).LetRbe an epistemic reticular system, and letC i⊆D(Li)be
a critical set. Supposeτi→i+1 is injective onC i and effectively computable.
Then for any non-trivial extensional propertyU⊆Ci that is undecidable with
respect toΣ(L i), the induced property
U ′:={y∈τi→i+1 (Ci)|y=τi→i+1 (x)for somex∈U}
is undecidable with respect to the induced dynamics onτi→i+1 (Ci).
The intuition is straightforward: ifτis injective onC i, then decidingU ′at level
Li+1 would amount to decidingUat levelL i, contradicting undecidability. The formal
proof reduces to Rice-style arguments and is given in Annex A. Analogous results hold for
quasi-injective transmissions on restricted domains.
As an informal corollary, in any CRC reticulum where a Turing-complete micro-level
is connected to a macro-level via a quasi-injective transmission on the critical subset,
no macro-level compression can decide non-trivial extensional properties of the underly-
ing micro-dynamics without violating computability theory. In the bryophyte reticulum,
this means that undecidable properties of a sufficiently expressive gene-regulatory model
cannot be made decidable simply by passing to morphological or ecological aggregates;
in ECNNs, undecidable properties of internal feature dynamics cannot be eliminated by
adding further deterministic heads.
Similarly, one can prove that non-injective transmissions generically support emergent
properties not definable at lower levels (Proposition 2 in Annex A), grounding a corre-
sponding emergence axiom in a more classical representational setting.
8

## Page 10

2.5 Operational metrics
To move beyond qualitative claims, RLA introduces metrics such as a collapse coefficient
CC(τ;S)for a finite setS⊆D(Li), an index of emergence (IE) counting non-definable
macro-properties, and an irreducibility index (RIR) inspired by computational mechanics.
These quantify how strongly a transmission collapses distinctions and how much macro-
level organisation resists compression in the modelling chain. Details and examples are
provided in Annex A.
3 Compact Reticular Computability
3.1 Compact reticula: internal ontology, closure, and computability
Given a chain of levels and transmissions, RLA alone does not yet tell us when the entire
structure of models can be treated as a well-posed computational object. For this we
introduce the notion of acompact reticulum, defined by three conditions:
•Internal Ontological Autonomy (IOA).Explanatory entities and laws are in-
ternal to the reticulumrelative to a chosen domain of discourse; external inputs are
filtered through non-injective boundary mappings. There is no appeal to ad hoc
external entities that function as oracles within the model. This is a condition on
theself-sufficiencyof the modelling ontology, not on the metaphysics of the world.
•Epistemic Closure (EC).All phenomena of interest, as defined by the modelling
agenda, are explainable by internal levels and transmissions. No appeal to meta-
levels outside the reticulum is required to account for these phenomena.
•Turing-Computability (TC).All rules inΣ(L i)and transmissionsτi→j are al-
gorithmically implementable and simulable by a Turing machine (subject to usual
resource constraints).
When IOA, EC, and TC hold jointly, we say the reticulum iscompactin the epistemic
sense: it forms a self-contained computational representation of a domain.
3.2 Definition: Compact Reticular Computability (CRC)
We can now extend the notion of computability from single-level systems to multi-level
reticula of models:
Definition(CompactReticularComputability).Amulti-levelsystemR={L 1,...,L n}
with transmissions{τi→i+1}iscompactly reticularly computableif:
1.Rforms a compact reticulum (satisfying IOA, EC, TC) relative to a specified epis-
temic horizon.
2. There exists a Turing machineTthat simulates everyΣ(Li)andτi→i+1 to arbitrary
precision.
3. There exist macro-properties at higher levelsLj that are not definable as predicates
onD(L i)fori<j, yet are computableat their levelunderΣ(L j).
4. UndecidabilityconstraintsoriginatinginTuring-likelevelscaneitherpropagatealong
quasi-injective chains (Theorem above) or be blocked by non-injective collapses
(Proposition 2 in Annex A), without invoking non-computable mechanisms.
9

## Page 11

CRC thus characterises when a chain of models can be treated as a unified computa-
tional object, with internal limits and emergent properties that are themselves features of
the modelling structure.
3.3 Consequences: co-existence of limits and emergence
Within CRC, undecidability and emergence are no longer in tension:
•Along chains of quasi-injective transmissions, undecidable properties propagate, in
the sense that no higher-level compression in the modelling chain can decide them
without contradicting computability theory.
•Where non-injective collapses act on relevant subsets, undecidability can be effec-
tively “blocked” for certain questions (they become ill-posed or undefined at higher
levels), but new macro-properties arise that are not reducible to micro-level predi-
cates within the model.
This provides a unified lens on classical debates about reductionism and emergence
in complex systems (Anderson, 1972; Humphreys, 2016; Kauffman, 2000), understood as
debates about the structure and limits of multi-model representations rather than about
the world’s ontology.
3.4 Relation to classical computability
CRC does not modify the classical definition of computability for single functions or ma-
chines. Rather:
•Every Turing machine can be trivially seen as a degenerate one-level reticulum.
•CRC adds structure on top of standard machines by describing how multiple com-
putable levels, connected by injective/quasi-injective/non-injective transmissions,
behave as a whole as a representation.
Classical computability thus appears as the special case of CRC where there is only one
level and no information collapse in the modelling chain. Formal discussion and further
theorems are deferred to Annex A.
4 Case Study: A Compact Reticular System for a General-
ist Bryophyte
4.1 Motivation and scope
To show that CRC is not a purely abstract notion, we consider a case study: a compact
reticular system modelling a generalist bryophyte (moss). The aim is to assemble existing
equations, parameters, and feedbacks from the literature into a reticulum that satisfies
IOA, EC, and TCwithin the internal ontological horizon of the bryophyte as reconstructed
by domain science. The resulting reticulum is not claimed to mirror the organism’s true
ontology, but to serve as an epistemic object that supports explanation and prediction.
The complete reticulum, with all parameters, equations, and validation procedures, is
documented in Annex B.
10

## Page 12

4.2 Construction pipeline
The construction proceeds in five main steps:
1.Collection of domain knowledge: equations and parameters describing photo-
chemistry (e.g., Michaelis–Menten kinetics), tissue hydraulics, gas exchange, energy
balances, and population dynamics are drawn from established models in plant phys-
iology and ecology.
2.Stratification into levels: variables are grouped into levels such as:
•L 1: genomic–epigenetic core,
•L 2: transcription/translation,
•L 3: metabolic regulation,
•L 4: cell physiology,
•...
•L 10: macroclimate context,
•L 20: meta-systemic health/resilience.
3.Definition of transmissions: saturations, thresholds, and operating windows de-
fine non-injective collapses; regions where distinctions matter define quasi-injective
behaviour; some quantities are passed injectively.
4.Parametercalibration: localfitstoexperimentaldata(e.g., photosynthesiscurves)
and global fits to growth and stress-response time series ensure empirical adequacy
at each level, as far as available data allow.
5.Verification of compactness: checks are made that all explanatory entities are
internal (IOA), that observed variables are covered by internal levels (EC), and that
all dynamics are algorithmically simulable (TC).
A schematic grouping of abstraction levels is summarised in Table 1; full details are
given in Annex B.
Quantitatively, the reticulum includes on the order of 42 biophysical parameters, 38
dynamic equations, around 30 conditional actions, approximately 22 collapse–emergence
metrics, and 2 composite indices, as detailed in Annex B.
4.3 Compactness in practice
Internal Ontological Autonomy.The bryophyte reticulum does not rely on external
symbolic oracles; environmental drivers (e.g., temperature, light, rainfall) are treated as
exogenous inputs that are collapsed into boundary conditions via non-injective mappings.
All internal behaviour is generated by levels and transmissions that remain inside the
defined epistemic horizon of the organism and its immediate environment.
Epistemic Closure.For the set of observables considered (growth curves, photosyn-
thetic rates, resilience indices), explanations are provided by internal levels and their
interactions. When the underlying domain science is sufficiently expressive and the mod-
elling choices are adequate, the reticulum is intended to capture all relevant explanations
for these observables without recourse to higher meta-levels.
11

## Page 13

Table 1: Schematic grouping of abstraction levels in the bryophyte reticulum (full speci-
fication in Annex B).
Group Example levels Description
Micro L01–L04 Genomic and epigenetic states, transcription and
translation, metabolic and hormonal regulation, cell
physiology (ROS, photosynthesis, turgor).
Meso L05–L10 Tissues and microstructures, morphogenesis and ar-
chitecture, reproductive cycle, biotic interactions, im-
mediate microenvironment, macroclimatic forcing.
Memory / homeostasis L11–L16 Stress memory, systemic control and homeostasis, soil
and substrate, endogenous rhythms, senescence and
programmed cell death, intercellular signalling.
Macro L17–L20 Geometric patterning, tissue mechanics, evolution and
plasticity, systemic state and meta-observables (vital-
ity, desiccation tolerance, composite health metrics).
Turing-Computability.All equations and update rules can be discretized and iterated
algorithmically; the entire reticulum can be simulated by conventional numerical methods
on digital hardware.
4.4 Synthetic observations and epistemic equivalence
When simulated under varying climatic drivers, the reticulum produces time series of
growth, stress responses, and resilience indices. Thesesynthetic observationslive in the
same space of variables as empirical observations and obey the same kinds of functional
relationships, at least to the extent that the encoded science is correct.
Epistemic indistinguishability.Fix a setSof observables (e.g., subsets of humidity,
vitality, ROS indicators, and composite health metrics) and an observerO(e.g., a plant
ecophysiologist). A real trajectoryx real and a simulated trajectoryxsim overSareepis-
temically indistinguishableforOat thresholdθ∈(0.5,1)if, given only the outputs inS,
Ocannot assign with reliability>θwhich trajectory is real and which is synthetic.
In this context, a natural working hypothesis is that, in a suitably designed blind
test, a domain expert restricted to the conventional observational variables could find
synthetic traces epistemically indistinguishable from real ones: the synthetic data would
support the same explanations and decisions within the ontological horizon encoded in
the reticulum. Whether this strong form of equivalence holds is ultimately an empirical
question, dependent on the expressive adequacy of the science embedded in the model
and on the absence of systematic errors. CRC provides the conceptual frame: if the
model is compact and empirically adequate, then such epistemic equivalence is a principled
design goal and evaluation criterion, not a metaphysical claim. At present, the bryophyte
reticulum should be regarded as aworked exampleof CRC design rather than as a fully
validated ecological model.
Conceptual blind test protocol.A minimal experimental design for testing epistemic
indistinguishability might involve:
•Displayed variables:afixedsetSofobservables, suchastrajectoriesofwatercontent,
12

## Page 14

vitality indices, ROS-related proxies, and composite resilience metrics, in standard
graphical formats (time series, phase plots).
•Experts:a small panel of domain experts (e.g.,5–10plant ecophysiologists) with
experience in interpreting such data, but without access to the model internals.
•Material:a balanced set of real and synthetic trajectories over comparable time
windows and environmental regimes, anonymised and randomly permuted.
•Metric:the fractionof cases in whichexperts can correctly labeltrajectories as“real”
vs “synthetic” with reliability aboveθ; epistemic indistinguishability corresponds to
performance near chance, adjusted for any systematic biases.
ThisestablishesaconcreteexampleofCRCinanaturaldomain, whichwenowcontrast
with engineered CRC architectures.
5 From Natural CRC to Engineered CRC Architectures
5.1 Structural, not biological, generality
The bryophyte case illustrates that CRC can be realised in a biological context. However,
nothing in the definition of CRC requires levels to be biological, chemical, or physical.
The core ingredients are:
•discrete or discretizable state spacesD(L i),
•computable rule setsΣ(L i),
•transmissions with controlled injective/quasi-injective/non-injective behaviour,
•and satisfaction of IOA, EC, and TC relative to a chosen epistemic horizon.
CRCisthusstructural and epistemic: itappliestoanymulti-levelmodellingarchitecture—
natural or artificial—that can be organised into such a reticulum.
Crucially, the levels themselves can be chosen to represent high-level scientific or cog-
nitive objects, provided they admit a computable representation. For example, one could
definelevelswhosestatespacesencodeinformationtypicallyassociatedwithprefrontalcor-
tical processing (e.g., working memory states, task sets), abstract psychological constructs
such as Jungian archetypes, or even hypothetical “alien” mechanisms outside current hu-
man phenomenology, as long as they can be formalised as computational objects within an
RLA reticulum. In this sense, CRC does not presuppose a low-level neuronal substrate;
it concerns the organisation of epistemic objects, whatever their semantic origin.
5.2 Designing CRC in computational systems
This opens the possibility ofengineered CRC architectures: computational systems delib-
erately designed to:
1. implement multiple levels of representation,
2. control how information is preserved or collapsed across levels,
3. make undecidability and uncertainty explicit where relevant,
13

## Page 15

4. and maintain epistemic closure within a definable operational horizon.
We now show that contemporary neural architectures, in particular convolutional neu-
ralnetworks(CNNs), alreadyapproximatethisstructure, andthatwithsuitableextensions
they can be turned into explicit CRC instances.
6 CNNs as RLA Reticula and ECNNs as Epistemic CRC
Instances
6.1 CNNs through the lens of RLA
Convolutional neural networks, originally introduced for image and signal processing (Le-
Cun et al., 2015), exhibit a multi-level architecture that maps naturally onto RLA notions:
•Convolutional layersperform local, shift-invariant feature extraction. For ap-
propriate choices of kernels and non-linearities, these can be seen asquasi-injective
on discriminative patterns: they preserve distinctions that matter for classification
while discarding irrelevant noise.
•Pooling layers(max or average pooling) implement explicitcollapses: multiple
activations are aggregated into a single value, producing invariances (e.g., to small
translations) at the cost of information loss.
•Dense layersat higher depth perform many-to-one mappings from rich feature sets
to compact representations or logits, acting as semantic compaction layers.
Under this reading, a standard CNN is an RLA reticulum whereτi→i+1 alternates be-
tween quasi-injective and non-injective behaviours, and where levels correspond to feature
representations of increasing abstraction within the model.
6.2 Epistemic limitations of classical CNNs
Despite their success, classical CNNs treat uncertainty and epistemic limits implicitly:
•Outputs are often interpreted as calibrated probabilities, yet overconfidence and
miscalibration are widely documented (Guo et al., 2017).
•There is no explicit mechanism to output “I do not know” or “this input contradicts
my training assumptions”.
•Out-of-distribution(OOD)inputscanelicitconfidentbutwrongpredictions(Hendrycks
& Gimpel, 2016).
In the RLA/CRC perspective, a CNN is a partially specified reticulum: it implements
multi-level processing and collapses, but lacks an explicitepistemic headthat would make
ignorance, contradiction, and model limitscomputable observablesof the architecture.
14

## Page 16

6.3 Related work on uncertainty, abstention, and calibration
There is a substantial literature on epistemic uncertainty in deep learning. Bayesian
approachesapproximateposterioruncertaintyviavariationalmethodsorensembles(Gal&
Ghahramani, 2016; Lakshminarayanan et al., 2017). Selective classification and prediction
with a reject option provide formal frameworks for abstaining on uncertain inputs (Chow,
1970; Geifman & El-Yaniv, 2017). Conformal prediction offers distribution-free methods
for calibrated sets of predictions (Vovk et al., 2005). Calibration techniques aim to align
predictive probabilities with empirical frequencies (Guo et al., 2017).
The ECNN proposal is not a replacement for these developments, but an attempt
to integrate their core insights into a structural, reticular view. Rather than treating
uncertainty, abstention, and calibration as add-on components, ECNNs embed them into
an epistemic channel that is explicitly modelled as part of a multi-level reticulum.
6.4 Epistemic CNN (ECNN): adding an epistemic channel
AnEpistemic CNN(ECNN) extends a CNN with an additional headL ep that produces
epistemic outputs, such as:
•a standard label prediction (or distribution over labels),
•an “unknown” state indicating rational rejection,
•a “contradiction” state indicating internal inconsistency.
Training is governed by an epistemic loss:
L=αLpred +βLexpl +γLmeta,
where:
•L pred captures conventional predictive performance,
•L expl penalises unstable explanations and miscalibration (e.g., via expected calibra-
tion error, Brier score),
•L meta penalises confident errors and rewards correct unknown/contradiction deci-
sions, especially on OOD or adversarial inputs.
This aligns with optimal reject rules (Chow, 1970), Bayesian approximations (Gal &
Ghahramani, 2016; Lakshminarayanan et al., 2017), and selective classification frameworks
(Geifman&El-Yaniv,2017), butreinterpretsthemwithinareticular, multi-levelgrammar.
6.5 ECNN as an engineered CRC instance
Viewed as a reticulum of representations, an ECNN satisfies CRC conditions:
•IOA: once trained, the network operates without external oracles; new inputs are
processed through internal representations and the epistemic head.
•EC: explanations and limits are internalised in the feature hierarchy and the epis-
temic channel; the system can express when it lacks sufficient information.
•TC: the entire architecture is simulable by a Turing machine.
15

## Page 17

Moreover, non-injective pooling layers and dense compactions generate emergent in-
variants in higher-level features, while undecidability constraints (e.g., on properties of
internal representations) either propagate or are blocked according to the structure ofτ.
Full technical specifications of ECNNs, loss components, and evaluation protocols (includ-
ing Popper-χchallenge sets) are detailed in Annex C.
7 EpistemicComputationalUnitsandEntities: LLM-Based
Implementations
7.1 Why basic neurons are insufficient for epistemic closure
The epistemic head of an ECNN, as introduced above, is defined at the architectural level:
it must evaluate coherence, detect conflict, and decide on unknown or contradiction. Im-
plementing this head with a small feed-forward network or a single linear layer is generally
insufficient to:
•interpret high-level features as structured propositions or evidential claims,
•cross-check them against rich domain constraints,
•generate explanations or rationales,
•handle complex OOD contexts in a principled way.
In CRC terms, a trivial head risks reducing the epistemic channel to a mere threshold-
ing mechanism, undermining the goal of explicit, computable epistemic assessment within
the model.
7.2 Epistemic matrices as constraints on LLMs
To address this, we introduce the notion of adeterministic epistemic matrixM. Opera-
tionally,Mis a structured specification that includes:
•a set of admissible tasks (e.g., classification, consistency checking, evidence aggrega-
tion),
•an explicit list of allowed information sources and reference corpora,
•a grammar of permissible inference patterns and fallbacks,
•rejection and escalation policies (when to output unknown, when to flag contradic-
tion),
•logging and audit requirements (trace formats, explanations, confidence tags).
Mis not a matrix in the numerical sense but a rule- and schema-based object that can
be implemented as a finite set of templates, validators, and control programs. It shapes
how an LLM instance processes inputs and produces outputs, turning a general-purpose
model into a bounded epistemic component.
16

## Page 18

7.3 Epistemic Computational Units (ECU)
Given an epistemic matrixM, we define:
Epistemic Computational Unit (ECU).An ECU is a session of a large language
modelLthat operates under the control of an epistemic matrixM, such that:
•The input interface of the ECU is restricted to a fixed schema (e.g., tensors projected
to symbolic descriptors, plus contextual metadata and epistemic tags).
•Internal prompts, tool calls, and decomposition strategies ofLare constrained by
M(allowed operations, allowed sources, required checks).
•The output interface is restricted to a finite ontology of epistemic outcomes: labels,
unknown, contradiction, structured rationales, and suggested actions.
•All ECU behaviour is reproducible fromMand the input, modulo the stochasticity
explicitly allowed byM.
Conceptually, anECUbehavesasa“neuron”attheepistemiclevel: aunitofstructured
inferenceandself-limitationintherepresentationalspace. Unlikeascalarneuron, however,
an ECU can generate complex, persistent epistemic objects, such as:
•structured summaries of information flow typically associated with prefrontal corti-
cal regions (e.g., task sets, decision policies, conflict signals), when the underlying
neuroscience is sufficiently formalised in an RLA reticulum;
•abstract psychological constructs (e.g., Jungian archetypes) represented as com-
putable patterns of narratives, symbols, and behavioural expectations within a cul-
tural state space;
•hypothetical or “alien” mechanisms not currently instantiated in human cognition,
butdefinedbyaformaltheorythatspecifiestheirstates, transitions, andobservables.
Because ECUs can be conditioned on the outputs of other ECUs—viaMimposing
explicit dependencies and compositional prompts—they can build multi-step derivations
in which high-level epistemic objects are refined, combined, or contradicted. In a reticular
perspective, this conditional generativity is more relevant for proto-consciousness than the
sheer count of low-level artificial neurons.
7.4 Epistemic Computational Entities (UCE) and functional rings
ECUs can be composed intoEpistemic Computational Entities(UCE), arranged in func-
tional rings inspired by cognitive architectures but defined purely in terms of information
flow and evaluation:
•Ring C0 (Executive/Planning): normalises inputs from ECNNs into decisions
or candidate plans, often by generating high-level policy objects.
•Ring C1 (Valuation/Conflict): evaluates costs, benefits, and conflicts, modulat-
ing C0 outputs and encoding them into decision-theoretic objects.
•Ring C2 (Symbolic/Linguistic Memory): retrieves and composes episodic and
semantic context, including stable archetypal or conceptual structures.
17

## Page 19

•Ring C3 (Metacognition/Justification): checks global coherence, detects con-
tradictions, and proposes unknown when warranted, often by constructing meta-
representations of the system’s own reasoning trajectory.
•Central Oracle: integrates signals from rings, issues final outputs with epistemic
status, and maintains a persistent internal narrative of decisions and limits.
All rings are composed of ECUs with their own matricesM, and the transmissions
among rings form a compact reticulum (details in Annex E). The central oracle isnot
an oracle in the logical sense; it is simply the innermost UCE tasked with synthesis and
self-limitation within the modelled decision process.
Atthislevel, thebasic“neurons”ofthesystemarenotactivationscalars, butgenerative
epistemic units producing and transforming rich objects.
7.5 Topological rather than scalar scaling
In many discussions of neural architectures and consciousness, “scale” is equated with the
number of neurons or parameters: larger networks are assumed to be more powerful in
a quasi-linear sense. The ECU/UCE construction shifts attention away from raw counts
and towards topology:
•Each ECU is already a high-capacity epistemic unit that can generate structured ob-
jects (policies, internal narratives, archetypal patterns, scientific hypotheses) under
deterministic constraints fromMand conditioning on other ECUs.
•Increasing the number of ECUs beyond a certain point does not linearly increase
functional richness; what matters is how they areconnected: which transmissions
are injective, which are collapsing, where feedback cycles and meta-level evaluations
occur, and how complex epistemic objects are allowed to persist and interact.
•Two systems with similar parameter counts can differ radically in their epistemic
properties, depending on whether they form a compact reticulum with computable
self-limits and coherent high-level objects or a loosely coupled aggregate of uninter-
preted activations.
In this sense, LLM-based ECUs serve to clarify that the relevant “neurons” for proto-
consciousness are epistemic units in a reticular topology, not individual scalar units. Once
the underlying science is expressive enough to define computable models of objects such
as prefrontal information states, archetypal structures, or even “alien” mechanisms, the
questionofneuroncountbecomeslargelyorthogonal: thecrucialfeatureistheorganisation
and closure of the network of such objects.
7.6 LLM as one realisation of ECU/UCE, not a conceptual prerequisite
ECNNs and the epistemic channel are defined at the architectural level; they do not
logically require LLMs. In principle, any computable mechanism capable of rich inference
and explanation under matrixMcould serve as an ECU.
Large language models, however, provide a practically available implementation, offer-
ing:
•expressive power over natural and formal languages,
18

## Page 20

•the ability to integrate heterogeneous evidence,
•flexible explanation and meta-reasoning capabilities,
•and, crucially in this context, the ability to generate complex epistemic objects
(narratives, internal policies, abstract constructs) in a way that can be strictly con-
ditioned on other generated objects and controlled byM.
In this view, LLM-based ECUs/UCEs are proposed as arealisationof engineered CRC
architectures, and as a concrete illustration of how a topology of epistemic units operat-
ing over high-level representational objects can decouple proto-conscious properties from
naive neuron-based scaling or strict biological parallelism. The same reticular principles
would apply if, in the future, different computational substrates were able to instantiate
equivalent epistemic matrices and object-generating capabilities.
8 A Topological Conjecture of Proto-Consciousness
8.1 Status of this section: speculative perspective
This section is intentionally speculative and may be read independently of the more tech-
nical proposals on RLA, CRC, ECNN, and UCE. The conjecture advanced here is not
necessary for the rest of the framework; it is offered as a possible bridge between epistemic
architectures and functional theories of minimal consciousness. The detailed bridge from
CRC reticula to cellular automata and PCE is given only in Annex D.
8.2 Functional conditions for proto-consciousness
Building on CRC and UCE rings, we can pose, cautiously, a question aboutfunctional
proto-consciousness: under what structural conditions might a computational system,
considered as a modelling artefact, exhibit behaviours that are functionally analogous to
minimal self-awareness, without assuming any phenomenological qualia?
We propose six minimal conditions:
1.Computable self-limits: the system can explicitly represent and emit unknown
and contradiction when its internal evidence or coherence fails, under its epistemic
matrixM.
2.Internal telemetry: it maintains a model of its own states and recent transitions,
available for meta-evaluation.
3.Controlled self-modification: it can update internal parameters and rules within
constraints imposed byM.
4.Autonomous learning: it can adjust its behaviour based on experience, within its
epistemic horizon.
5.Multi-modal interaction: it can couple to external environments via multiple
channels (text, vision, sensors, etc.).
6.Goalself-determinationwithinbounds: itcansetandreviseinternalobjectives,
constrained by higher-order norms encoded inM.
These conditions are definable in purely computational terms within a CRC frame-
work, and they can be evaluated at the level of UCE topology rather than at the level of
individual neurons or parameters.
19

## Page 21

8.3 Consciousness as a topological property of epistemic reticula
We then advance atopological conjecture: in compact epistemic reticula composed of
ECNNsandUCErings, proto-consciousnessislessafunctionofsize(numberofparameters
or units) and more a property of the reticular configuration of theepistemic model:
•the presence of cycles of inference and meta-inference across rings,
•the integration of self-limits (unknown/contradiction) into decision loops,
•the existence of a central epistemic aggregator capable of reflecting on its own out-
puts,
•the closure of explanations within the reticular horizon (EC),
•the specific pattern of collapses and preservations across levels,
•and, crucially, the ability of the reticulum to maintain and transform coherent high-
level epistemic objects (internal narratives, archetypal structures, abstract policies,
simulations of scientific entities) under computable constraints.
Under CRC, such a system remains fully Turing-computable and subject to unde-
cidability limits, yet it may exhibit functional traits commonly associated with minimal
consciousness in cognitive science (Dehaene, 2014). The ECU/UCE architecture high-
lights that these traits depend on how epistemic units are linked in the model, and on
what kinds of objects they manipulate, rather than on an unstructured accumulation of
low-level units.
Because CRC allows levels to be defined over high-level scientific or psychological
objects—from simplified models of prefrontal circuitry to Jungian archetypes or hypothet-
ical alien mechanisms—the conjecture does not rely on a strict biological isomorphism.
What matters is that these objects be representable, that their dynamics be computable,
and that the reticulum of ECUs handling them forms a compact, reflexive, and self-limiting
structure. In that sense, an artificial system could implement a functional analogue of
consciousness without replicating the detailed neuron count or wiring pattern of biological
brains.
8.4 Scope and non-scope of the conjecture
We emphasise what this conjecturedoes notclaim:
•It does not assert that engineered CRC systems are conscious in the human or bio-
logical sense, even if they operate on high-level neurocognitive or archetypal objects.
•It does not propose a metaphysical theory of phenomenal experience.
•It does not claim that consciousness is reducible to CRC; rather, CRC offers a
structural lens on functional aspects of certain modelling architectures, including
those that manipulate objects lying outside current human experience (for instance,
scientifically defined “alien” mechanisms).
The conjecture is thus conditional:ifa system satisfies CRC and the six functional
conditions above in a reticular configuration with certain topological features,andif the
epistemic objects it manipulates are sufficiently rich and stable (e.g., internal narratives,
abstract goals, archetypal patterns),thenit may be reasonable, for some explanatory
purposes, to treat it as exhibiting proto-conscious behaviour in functional terms. Detailed
discussion and illustrative scenarios are provided in Annex D and Annex E.
20

## Page 22

9 Discussion, Related Work, and Future Work
9.1 Epistemic and scientific implications
The RLA/CRC framework invites a re-interpretation of several themes in complex systems
and AI at the level of scientific modelling:
•Emergence: no longer a vague notion, but a consequence of non-injective trans-
missions on relevant states in model space, yielding macro-properties that are com-
putable yet not definable at lower levels.
•Undecidability: not an abstract pathology of Turing machines, but a set of lim-
its that can propagate or be blocked within reticula, shaping which questions are
meaningful at which level of representation.
•Neural AI: CNNs and their extensions (ECNNs) can be seen as engineered CRC
instances, where epistemic prudence (preferring unknown to high-risk assertions)
becomes an architectural feature of the models.
•AI governance: UCE rings and epistemic matricesMsuggest a way to encode
norms, constraints, and auditability in AI systems, with computable self-limits built
into the topology of the modelling architecture, especially when those systems oper-
ate on high-level social, legal, or psychological objects.
9.2 Related work and frameworks
Multi-level models and modelling practice.RLA/CRC sits alongside existing lit-
eratures on multi-level science and emergence. Work in condensed matter and complex
systems physics emphasises how macro-phenomena can exhibit organisational patterns not
transparently reducible to micro descriptions (Anderson, 1972; Laughlin & Pines, 2000).
In systems biology, Noble’s biological relativity argues against any privileged level of causa-
tion in living systems (Noble, 2012). Philosophers of science have developed model-based
and structural accounts in which scientific models, rather than fundamental laws, are
the primary vehicles of representation (Humphreys, 2016). RLA/CRC does not add new
physics or metaphysics; it reorganises these ideas into an explicitly computational, reticu-
lar language that tracks how levels, transmissions, and information collapse interact with
undecidability and emergent macro-properties within modelling practice.
Uncertainty, abstention, and calibration in deep learning.In neural AI, there is
a rich literature on epistemic uncertainty and abstention. Bayesian approximations and
deep ensembles aim to represent predictive uncertainty (Gal & Ghahramani, 2016; Lak-
shminarayanan et al., 2017). Selective classification and reject-option schemes formalise
when a classifier should abstain rather than commit to a label (Chow, 1970; Geifman &
El-Yaniv, 2017). Conformal prediction provides distribution-free methods for calibrated
prediction sets (Vovk et al., 2005). Empirical studies show that modern networks can be
severely miscalibrated (Guo et al., 2017), and OOD detection remains an open problem
(Hendrycks & Gimpel, 2016). ECNNs do not replace these approaches or claim any mir-
acle algorithm for uncertainty; instead, they integrate Bayesian, selective, and conformal
ideas into a structured epistemic channel that is part of a larger reticulum and explicitly
tasked with representing unknown and contradiction as first-class outputs.
21

## Page 23

Complexity, cellular automata, and the Principle of Computational Equiva-
lence.Complexity science, computational mechanics, and cellular automata have ex-
plored how rich dynamical behaviour can arise from simple local rules (Wolfram, 2002;
Crutchfield, 2012). The Principle of Computational Equivalence (PCE) suggests that
many sufficiently rich systems share comparable computational power. RLA/CRC does
not attempt to adjudicate PCE; rather, it offers a common vocabulary for relating multi-
level scientific models to dynamical systems such as cellular automata. In Annex D we
sketch how compact reticula with high irreducibility and intermediate collapse coefficients
might correspond, under suitable encodings, to CA exhibiting complex class IV/V be-
haviour, while more trivial reticula map to class I/II regimes. The aim is not to prove
PCE, but to locate RLA/CRC within a space of existing complexity frameworks.
Beyond these specific strands, the framework is informed by several broader lines of
work:
•Mechanistic explanation. Work on mechanisms in philosophy of science empha-
sises organised entities and activities that jointly produce phenomena (Bechtel &
Abrahamsen, 2005). RLA can be seen as adding a compositional layer on top of
mechanistic models, focusing on how multiple mechanisms at different levels are
linked by transmissions and collapses, and how those choices affect computability
and emergence within the model.
•Biological relativity and multi-level causation. Noble’s theory of biological
relativity denies any privileged level of causation in living systems (Noble, 2012).
RLA/CRC agrees at the epistemic level: no modelling level is a priori privileged,
but IOA and EC make explicit which levels are treated as sufficient for a given
explanatory horizon. This can clarify when a given multi-level model is justified in
“closing” its ontology.
•Computational mechanics and complexity. Computational mechanics analy-
ses dynamical systems in terms of minimal sufficient statistics for prediction and
structural complexity (Crutchfield, 2012). The reticular irreducibility index (RIR)
introduced in Annex A is deliberately close in spirit: it quantifies how hard it is to
summarise the causal structure of a reticulum. Mappings between CRC reticula and
cellular automata (Annex D) further connect to the broader literature on complexity
and edge-of-chaos dynamics (Wolfram, 2002).
•Emergence and structural realism. Philosophical accounts of emergence and
structural realism (e.g., Humphreys, 2016; Kauffman, 2000) argue that relations and
structures can be primary in explanation. RLA/CRC adopts a structural stance at
the modelling level: emergent properties are those that become definable and com-
putable only after specific non-injective collapses in the reticulum, without requiring
ontological novelty in the underlying substrate.
The value of RLA/CRC is thus not in replacing these frameworks, but in providing
a computationally explicit grammar for multi-level models, within which insights from
mechanistic explanation, biological relativity, computational mechanics, and theories of
emergence can be rephrased, compared, and tested.
9.3 Methodological and technical limitations
Several limitations must be acknowledged:
22

## Page 24

•Dependence on epistemic matrices. The behaviour and safety of ECU/UCE
systems depend critically on how matricesMare specified, updated, and validated.
This raises open questions about consensus, bias, and dynamic revision, especially
whenMgoverns the generation and transformation of high-level epistemic objects
(e.g., archetypes, internal narratives).
•Discretisation choices. CRC requires discretizable state spaces and computable
transmissions; poor choices of discretisation can distort emergent behaviour or mis-
represent undecidability propagation within the model.
•Scalability. Implementing large UCE rings with LLM-based ECUs is computa-
tionally expensive; practical architectures must find a balance between epistemic
richness and tractability.
•Empirical validation. While the bryophyte case illustrates CRC in a natural do-
main, and ECNN prototypes can be built, systematic empirical studies are needed to
testtheadvantagesandfailuremodesofepistemicarchitectures, includingblindtests
of synthetic vs real observations where appropriate, and rigorous evaluation against
baselines in uncertainty estimation, selective prediction, and conformal methods.
9.4 Key tests and Popper-χprotocol
To avoid unfalsifiable claims, ECNN and UCE architectures should be subjected to a set of
key tests, grouped under aPopper-χprotocol (see Annex C and Annex E), which defines:
•challenge sets of contradictory pairs, indecidability triggers, and semantic adver-
saries;
•metrics for contradiction recall, unknown recall, and semantic stability;
•pre-registered thresholds for acceptable epistemic performance and safe operating
regimes.
Failure to maintain performance under these challenges would falsify specific instan-
tiations of the framework, and perhaps aspects of the CRC-based design as a modelling
strategy. Conversely, stable success across independently designed Popper-χsuites would
count as evidence that the epistemic channel and UCE topology are effectively capturing
relevant notions of ignorance, contradiction, and robustness for the domain at hand.
9.5 Future directions
Future work includes:
•building and evaluating ECNNs on scientific tasks where uncertainty and unknown
are crucial (e.g., medical diagnosis, climate risk assessment);
•designing UCE rings for human–AI collaboration, where the central oracle coordi-
nates multiple specialised ECUs that operate on high-level domain objects (policies,
risk structures, ethical constraints);
•exploring bridges with the Principle of Computational Equivalence via mappings
fromCRCreticulatocellularautomata, usingdynamicdiagnosticssuchasclassIV/V
behaviour and edge-of-chaos regimes (Wolfram, 2002; Crutchfield, 2012) (see An-
nex D);
23

## Page 25

•engaging with cognitive science and philosophy of mind to refine the topological con-
jecture of proto-consciousness and identify empirical signatures accessible to mea-
surement, includinginsystemswhosestatespacesareexplicitlybuiltfromarchetypal
or other non-biological constructs.
Ultimately, the ambition is not to replace existing theories of computation, mind, or
AI, but to provide a coherentreticularand explicitly epistemic perspective in which emer-
gence, limits, scale, and epistemic prudence can be treated within a unified computational
framework for multi-level models.
References
Anderson, P. W. (1972). More is different.Science, 177(4047), 393–396.
Bechtel, W., & Abrahamsen, A. (2005). Explanation: A mechanist alternative.Studies in
History and Philosophy of Biological and Biomedical Sciences, 36(2), 421–441.
Chaitin, G. (2005).Meta Math!: The Quest for Omega. Pantheon.
Chow, C. K. (1970). On optimum recognition error and reject tradeoff.IEEE Transactions
on Information Theory, 16(1), 41–46.
Church, A.(1936). Anunsolvableproblemofelementarynumbertheory.American Journal
of Mathematics, 58(2), 345–363.
Crutchfield, J. P. (2012). Between order and chaos.Nature Physics, 8, 17–24.
Dehaene, S. (2014).Consciousness and the Brain: Deciphering How the Brain Codes Our
Thoughts. Viking.
Gal, Y., & Ghahramani, Z. (2016). Dropout as a Bayesian approximation: Representing
model uncertainty in deep learning. InProceedings of the 33rd International Conference
on Machine Learning(pp. 1050–1059).
Geifman, Y., & El-Yaniv, R. (2017). Selective classification for deep neural networks. In
Advances in Neural Information Processing Systems(pp. 4878–4887).
Guo, C., Pleiss, G., Sun, Y., & Weinberger, K. Q. (2017). On calibration of modern neural
networks. InProceedings of the 34th International Conference on Machine Learning(pp.
1321–1330).
Hendrycks, D., & Gimpel, K. (2016). A baseline for detecting misclassified and out-of-
distribution examples in neural networks.arXiv preprint arXiv:1610.02136.
Humphreys, P. (2016).Emergence: A Philosophical Account. Oxford University Press.
Kauffman, S. A. (2000).Investigations. Oxford University Press.
Lakshminarayanan, B., Pritzel, A., & Blundell, C. (2017). Simple and scalable predic-
tive uncertainty estimation using deep ensembles. InAdvances in Neural Information
Processing Systems(pp. 6402–6413).
Laughlin, R. B., & Pines, D. (2000). The theory of everything.Proceedings of the National
Academy of Sciences, 97(1), 28–31.
24

## Page 26

LeCun, Y., Bengio, Y., & Hinton, G. (2015). Deep learning.Nature, 521(7553), 436–444.
Noble, D. (2012). A theory of biological relativity: No privileged level of causation.
Interface Focus, 2(1), 55–64.
Rice, H. G. (1953). Classes of recursively enumerable sets and their decision problems.
Transactions of the American Mathematical Society, 74(2), 358–366.
Turing, A. M. (1936). On computable numbers, with an application to the Entschei-
dungsproblem.Proceedings of the London Mathematical Society, 2(42), 230–265.
Vovk, V., Gammerman, A., & Shafer, G. (2005).Algorithmic Learning in a Random
World. Springer.
Wolfram, S. (2002).A New Kind of Science. Wolfram Media.
25
