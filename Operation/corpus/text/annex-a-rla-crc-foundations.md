---
id: "annex-a-rla-crc-foundations"
title: "Annex A - RLA-CRC Foundations"
role: "technical_annex"
source_path: "RLA-CRC-ECNN/Annex A - RLA-CRC Foundations.pdf"
source_raw_url: "https://raw.githubusercontent.com/Luke883i/RLA-ECNN/main/RLA-CRC-ECNN/Annex%20A%20-%20RLA-CRC%20Foundations.pdf"
source_sha256: "bed516b6858f10722d102aae24103c9589bbd818f891248db47c9ebc6df3797e"
extraction_status: "success"
---

## Page 1

Annex A
Foundations of Reticular Local Abstraction
and Compact Reticular Computability
(with Hook to Epistemic CNNs)
Gianluca Conte
September 2025
Abstract
This annex provides the foundational definitions, axioms, and basic results forReticular
Local Abstraction(RLA) andCompact Reticular Computability(CRC), as used throughout
the main position paper and technical annexes B–E. The focus is strictly epistemic: RLA
and CRC are presented as tools for reasoning about the structure and limits ofmulti-level
modelsand epistemic architectures, not as ontological claims about the world.
An RLA system is a finite reticulum of levels of abstraction{Li}, each with its own state
space and rule set, connected by transmissionsτi→j that may be injective, quasi–injective,
or non–injective (information collapse). CRC characterises when such a reticulum is: (i)
internally ontologically autonomous (relative to a modelling horizon), (ii) epistemically closed,
and (iii) fully Turing–computable. Under these conditions, undecidability and emergence
become structural properties of themodelling reticulum: undecidable properties at Turing–like
levels can propagate along quasi–injective transmissions, while non–injective collapses can
generate macro properties that are not definable at lower levels, yet remain computable
within their own domain.
After introducing the core notions, we state and sketch a key theorem on propagation of
undecidability, and define operational metrics such as thecoefficient of collapse, anindex of
emergence, and areticular irreducibility index. A concrete toy example with three finite levels
and explicit numerical values is provided to illustrate how these indices are actually computed
in practice. We then provide a structural mapping from convolutional neural networks (CNNs)
to RLA reticula and outline howEpistemic CNNs(ECNNs) instantiate CRC in engineered
architectures. Technical details and domain–specific developments are deferred to: Annex B
(compact RLA topology and CRC for a generalist bryophyte), Annex C (ECNN formalisation
and training), Annex D (RLA–ECNN bridge to the Principle of Computational Equivalence
and dynamical diagnostics), and Annex E (Epistemic Computational Units / Entities and
protocols).
Contents
1 Introduction and Epistemic Stance 2
1.1 Multi-level models and classical computability . . . . . . . . . . . . . . . . . . . . 2
1

## Page 2

1.2 RLA and CRC as epistemic, not ontological, frameworks . . . . . . . . . . . . . . 3
2 Core Constructs of Reticular Local Abstraction 3
2.1 Levels of abstraction as epistemic slices . . . . . . . . . . . . . . . . . . . . . . . 3
2.2 Transmissions between levels . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4
2.3 RLA reticula and Turing–like levels . . . . . . . . . . . . . . . . . . . . . . . . . . 4
3 Compact Reticula and Compact Reticular Computability 5
3.1 Epistemic horizons . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
3.2 Compact reticula: IOA, EC, and TC . . . . . . . . . . . . . . . . . . . . . . . . . 5
3.3 Compact Reticular Computability (CRC) . . . . . . . . . . . . . . . . . . . . . . 6
3.4 Critical sets and propagation of undecidability . . . . . . . . . . . . . . . . . . . 6
3.5 Emergence via non–injective collapse . . . . . . . . . . . . . . . . . . . . . . . . . 7
4 Operational Diagnostics and Metrics 7
4.1 Coefficient of collapse . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
4.2 Index of emergence . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8
4.3 Reticular irreducibility index . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8
4.4 Toy numerical example: three-level finite reticulum . . . . . . . . . . . . . . . . . 8
5 From RLA to Neural Architectures 12
5.1 CNNs as RLA reticula . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 12
5.2 Compactness and CRC in CNN reticula . . . . . . . . . . . . . . . . . . . . . . . 13
6 Hook to Epistemic CNNs (ECNNs) 13
6.1 Limitations of standard CNN heads . . . . . . . . . . . . . . . . . . . . . . . . . 13
6.2 Epistemic heads and ECNNs as CRC instances . . . . . . . . . . . . . . . . . . . 14
6.3 Connection to ECU/UCE architectures . . . . . . . . . . . . . . . . . . . . . . . 14
7 Summary and Relation to Annexes B–E 15
1 Introduction and Epistemic Stance
1.1 Multi-level models and classical computability
Classical computability theory, from Turing’s analysis of effective procedures [Turing, 1936/1937]
and Church’sλ–calculus [Church, 1936] to Rice’s theorem on extensional properties of programs
[Rice, 1953], provides a complete account of which functions on discrete domains are computable.
In that framework, systems are typically represented bysingle–levelformalisms: Turing machines,
register machines, or other equivalent models. Questions of decidability and undecidability are
posed within this single configuration space.
By contrast, most scientific practice employsmulti–levelmodelling. Systems biology con-
nects molecular, cellular, tissue and organismal dynamics [Noble, 2012]; condensed matter physics
movesbetweenmicroscopicconfigurationsandemergentphasesofmatter[ Laughlin & Pines, 2000];
cognitive science and neuroscience relate neuronal circuits, network dynamics, and behavioural or
2

## Page 3

cognitive states [Bechtel & Abrahamsen, 2005]. These modelling chains involve not only multiple
formalisms but also systematic use of coarse–graining, aggregation, and information collapse.
Classical computability is agnostic about this multi–level structure. It tells us what is
computable at a given level, but not how computability and undecidability behave across
chains of levels linked by information–losing or information–preserving transformations. In the
perspective developed here, classical single–level machines appear as degenerate RLA reticula
with one level and no transmissions; CRC leaves all standard results of computability theory
untouched and simply extends the analysis to explicitly multi-level architectures.
1.2 RLA and CRC as epistemic, not ontological, frameworks
The RLA/CRC framework introduced here is explicitlyepistemic. Levels, transmissions, and
reticula are not presented as literal layers of an objective ontology; they are abstractions of how
scientific communities carve up, represent, and reason about their domains.
When we say that a level is “Turing–like”, we mean that theformalismused to model that
slice of practice can, in principle, emulate universal computation. When we speak of an “internal
ontological horizon”, we refer to the ontology induced by a modelling framework—the entities
and laws it deems explanatory—rather than to an ultimate ontology of the world. Nothing in this
annex presupposes a particular metaphysics of nature; the focus is on the structure of models.
Within this stance:
•undecidability is understood as a property of the formalisms used at certain levels;
• emergence is treated as a property of the way lower–level models are collapsed into higher–
level ones;
•computability is extended from single machines to reticula of models.
The goal of Annex A is to define these ideas precisely enough to support the technical
constructions and case studies in Annexes B–E.
2 Core Constructs of Reticular Local Abstraction
2.1 Levels of abstraction as epistemic slices
Definition 2.1(Level of abstraction).Alevel of abstraction(or simplylevel) is a pair
L=⟨D(L),Σ(L)⟩,
whereD(L)is a set (or discretizable space) of admissible states andΣ(L)is a set of rules that
act onD(L). Rules may represent dynamical laws, update equations, inference rules, or any
effective procedures used at that level in the relevant scientific practice.
Examples include: ordinary differential equations governing population densities, Markov models
for gene expression, state machines for control logic, or neural network modules defined over
feature spaces.
3

## Page 4

2.2 Transmissions between levels
Definition 2.2(Transmission).Given two levels Li =⟨D(Li), Σ(Li)⟩and Lj =⟨D(Lj), Σ(Lj)⟩,
atransmissionfromL i toL j is a mapping
τi→j:D(L i)→P
(
D(Lj)
)
from states atLi to sets of possible states atLj. In many applications we restrict to single–valued
mapsτi→j:D(L i)→D(Lj)for simplicity.
Transmissions formalise how states at one level are translated, coarse–grained, or lifted to
another level. They can be:
•injective on a domain of interest,
•quasi–injective on a critical subset,
•or genuinely non–injective (many–to–one) on relevant states.
Definition 2.3(Injective, quasi–injective, non–injective).LetS⊆D(Li)be a subset of interest.
A transmissionτi→jis:
•injective onSifx 1,x 2∈Sandτi→j(x1) =τi→j(x2)implyx 1 =x 2;
• quasi–injective onS if there exists a partitionS =S′∪S′′such thatτi→jis injective onS′
andS ′′is declared irrelevant for a given analysis (e.g. below resolution);
• non–injective onS if there exist distinctx1,x 2∈Swith τi→j(x1) = τi→j(x2)and the
distinction betweenx 1,x 2 is relevant for at least one property of interest.
Non–injective transmissions implementinformation collapse: coarse–graining, saturations,
thresholds, or aggregation moves that merge distinct lower–level states into one macro–state.
2.3 RLA reticula and Turing–like levels
Definition 2.4(RLA reticulum).AReticular Local Abstraction(RLA) reticulum is a finite
sequence
R= (L 1,...,L n)
of levels of abstraction together with transmissionsτi→i+1:D(Li)→D(Li+1)for i = 1,...,n−1.
We sometimes writeL(R) ={L1,...,L n}andT(R) ={τi→i+1}.
Definition 2.5(Turing–like level).A levelLi =⟨D(Li), Σ(Li)⟩isTuring–likeif the formalism
represented byΣ(Li)can, up to a computable encoding of inputs and outputs, simulate a universal
Turing machine (or an equivalent model of computation).
The Turing–like label attaches to theformalismat the level, not to the underlying physical
system. For instance, a system of ODEs may be Turing–like if it encodes universal computation
under a suitable interpretation; similarly, a sufficiently flexible programming language or neural
net may be Turing–like.
4

## Page 5

3 Compact Reticula and Compact Reticular Computability
3.1 Epistemic horizons
Definition 3.1(Epistemic horizon).Anepistemic horizon H for a modelling practice is a
specified set of observables, questions, and explanatory tasks that the modeller is prepared to treat
as in-scope for a given reticulumR. Formally,H is a finite or countable family of predicates
and queries about the domain, together with a specification of which answers or explanations are
considered admissible.
The epistemic horizon is part of the modelling choice: different communities may choose
different horizons for the same underlying system, yielding different reticula and different
judgements of compactness.
3.2 Compact reticula: IOA, EC, and TC
To treat an RLA reticulum as a well–posed computational object, we require three conditions,
understood epistemically.
Definition 3.2(Internal Ontological Autonomy (IOA)).An RLA reticulumR satisfiesinternal
ontological autonomywith respect to a domain of discourse if all explanatory entities and laws
invoked for that domain are represented internally by:
•state spacesD(L i)and rule setsΣ(L i), and
•transmissionsτi→jbetween levels.
External inputs (e.g. environmental drivers) may appear as boundary conditions or exogenous
parameters but are not modelled as additional explanatory entities outsideL(R).
Definition 3.3(Epistemic Closure (EC)).An RLA reticulumR isepistemically closedwith
respect to an epistemic horizonH if, for each observable or question inH, there exists a level (or
finite subset of levels) whose state spaces and rules suffice to represent and explain it internally,
using onlyL(R)andT(R).
Definition3.4(Turing–Computability(TC)).An RLA reticulumR satisfiesTuring–computability
if:
•for eachL i, the rule setΣ(Li)is effectively computable by some Turing machine, and
• for each transmissionτi→j, the mapping is algorithmically implementable (up to any required
numerical precision).
Definition 3.5(Compact reticulum).An RLA reticulum R iscompact(in the epistemic sense)
if it satisfies IOA, EC, and TC with respect to a specified epistemic horizonH.
Compactness is therefore relative to the chosen horizon: a reticulum may be compact for one
family of questions and not for another.
5

## Page 6

3.3 Compact Reticular Computability (CRC)
Definition 3.6(Compact Reticular Computability (CRC)).A compact reticulumR iscompactly
reticularly computableif:
1. there exists a Turing machineT that simulates everyΣ(Li)and τi→jto arbitrary precision;
2. there exists at least one levelLk that is Turing–like;
3. there exist macro–properties at higher levelsLj, j > k, that are computable with respect
toΣ( Lj)but not definable, with respect to the formal language and rule sets used at those
levels, as predicates onD(Li)fori<j.
CRC is thus a property of multi–levelmodels: it says that the entire reticulum behaves as
a single computational object with internal logical limits and emergent properties. Classical
computability is recovered as the degenerate case whereR has a single level and no transmissions.
3.4 Critical sets and propagation of undecidability
We now formalise one key mechanism: how undecidability at a Turing–like level behaves under
quasi–injective transmissions.
Definition3.7(Criticalset).Let Li =⟨D(Li), Σ(Li)⟩be a Turing–like level. A subsetCi⊆D(Li)
iscriticalif the restriction ofΣ( Li)to Ci is Turing–complete: for any Turing machineM and
input w, there existsx∈Ci such that the behaviour ofΣ(Li)on x encodes the behaviour ofM
onw, up to a computable coding.
Definition 3.8(Extensional property).Let Li and Ci be as above. A subsetU⊆Ci is an
extensional property(in the sense of Rice) if membership ofx inU depends only on the observable
behaviour ofx underΣ( Li): wheneverx1,x 2∈Ci have identical behaviour underΣ(Li), either
both belong toUor both are outsideU.
Axiom 3.1(Undecidability at Turing–like levels).LetLi be Turing–like andCi be a critical set.
Then any non–trivial extensional propertyU⊆Ci is undecidable with respect toΣ(Li), in the
sense of Rice’s theorem [Rice, 1953].
Theorem 3.1(Propagation of undecidability along quasi–injective transmissions).LetR be a
compact reticulum andLi be a Turing–like level with critical setCi. Supposeτi→i+1is effectively
computable and injective onCi. Then for any non–trivial extensional propertyU⊆Ci that is
undecidable with respect toΣ(Li), the induced property
U′:={y∈τi→i+1(Ci)|∃x∈Ci :y=τi→i+1(x), x∈U}
is undecidable with respect to the induced dynamics onτi→i+1(Ci).
Sketch. If U′were decidable at the higher level, we could decideU at Li by: (i) mappingx to
y =τi→i+1(x), (ii) deciding whethery∈U′, and (iii) using injectivity onCi to inferx∈Uiff
y∈U′. This would contradict Axiom 3.1. The argument is a standard Rice–style reduction.
6

## Page 7

A similar statement holds for quasi–injective transmissions on a restricted domainC′
i⊆Ci
where undecidable properties of interest are defined. The main message is that undecidability is
not automatically “washed out” by going up a modelling hierarchy; it persists whenever relevant
distinctions are preserved.
3.5 Emergence via non–injective collapse
Non–injective transmissions, by contrast, implement deliberate information loss. They can
block the propagation of certain undecidable properties and, at the same time, generate new
macro–properties not definable at lower levels.
Axiom 3.2(Emergence via collapse).Let τi→j:D(Li)→D(Lj)be non–injective on a subset
S⊆D(Li)that is relevant to property families of interest. Then, given the descriptive resources
of the modelling language atLi, there exists at least one macro–propertyQ of states inD(Lj)
that is not definable as a predicate onD(Li)alone.
Proposition 3.1(Emergent macro–properties).Under Axiom 3.2, at least one macro–property
Q at Lj qualifies asemergentwith respect to Li: it is computable atLj but not reducible to a
predicate onD(L i)without supplementing the language or rules.
Sketch. Intuitively, non–injective collapse identifies lower–level states that differ in ways that
matter for some candidate properties. Any property that depends only on the equivalence classes
induced byτi→jcan be defined atLj without reference to the collapsed distinctions. At least one
such property will not be definable without quotienting byτi→j, given reasonable assumptions on
the language. A detailed treatment is given in the extended technical development accompanying
this annex.
Together, Theorem 3.1 and Axiom 3.2 capture the coexistence of logical limits and emergent
structure in compact reticula.
4 Operational Diagnostics and Metrics
The following diagnostics are not axioms butoperational proxiesfor reticular phenomena. They
are intended for empirical and numerical studies of specific reticula, including the engineered
architectures of Annex C.
4.1 Coefficient of collapse
Definition 4.1(Coefficient of collapse).Let τi→j: D(Li)→D(Lj)be a transmission and
S⊆D(Li)a finite reference set. Thecoefficient of collapseonSis
CCi→j(S) := 1−
⏐⏐τi→j(S)
⏐⏐
|S|∈[0,1],
whereτi→j(S)denotes the image set (up to a chosen numerical tolerance).
7

## Page 8

CCi→j(S)≈0indicates near–injective behaviour onS; CCi→j(S)≈1indicates strong
many–to–one collapse. In Annex C this diagnostic is specialised to ECNN architectures as
CC (ECNN)
i→j (S), computed on activation tensors.
4.2 Index of emergence
Definition 4.2(Index of emergence).Let Q be a finite family of candidate macro–properties
defined overD(L j). For a given pair of levels(Li,L j), theindex of emergenceis defined as
IE i→j:= #{Q∈Q:Qis computable atLj and not definable onD(Li)}
|Q| ∈[0,1].
IE i→jquantifies, within the chosen family of candidate properties, how many are genuinely
emergent with respect toLi. In practice, definability tests will rely on the expressive resources
of the modelling language atLi and on approximations (e.g. linear probes, symbolic regression).
Annex C introducesIE (ECNN)
i→j as a concrete instantiation for ECNNs.
4.3 Reticular irreducibility index
Inspired by computational mechanics [Shalizi & Crutchfield, 2001], we introduce a structural
index for reticula.
Definition 4.3(Reticular irreducibility index).Consider a causal graphGt induced by levels and
transmissions in a reticulumR over a finite horizont, with vertex setV (Gt). Let MinCut(Gt)be
the size of a minimum vertex cut separating inputs from outputs over that horizon. Thereticular
irreducibility indexover a time horizonTis
RIR(R;T) := 1−1
T
T∑
t=1
MinCut(Gt)
|V(Gt)|∈[0,1].
LowRIR indicates that small cuts suffice to summarise dynamics, suggesting high compress-
ibility. HighRIR indicates that no small cut suffices, suggesting computational irreducibility
in the sense of [Shalizi & Crutchfield, 2001, Wolfram, 2002]. In Annex D,RIR is used in con-
junction with cellular automata mappings to connect CRC reticula to dynamical regimes in the
Principle of Computational Equivalence (PCE). Annex C outlines network–specific estimators of
RIRfor ECNNs.
4.4 Toy numerical example: three-level finite reticulum
To make the above diagnostics more concrete, we present a small toy RLA reticulum with three
finite levels and explicit numerical values forCC, IE, andRIR. The example is intentionally
simple and pedagogical rather than realistic.
Structure of the toy reticulum
Consider an RLA reticulum
Rtoy = (L1,L 2,L 3)
8

## Page 9

with three levels and finite state spaces:
•Micro–levelL 1 with
D(L1) ={s1,s 2,s 3,s 4};
•Meso–levelL 2 with
D(L2) ={u1,u 2,u 3};
•Macro–levelL 3 with
D(L3) ={v1,v 2}.
Transmissions are defined as follows. The first transmissionτ1→2:D(L 1)→D(L2)is
τ1→2:



s1↦→u1,
s2↦→u1,
s3↦→u2,
s4↦→u3,
and the second transmissionτ2→3:D(L 2)→D(L3)is
τ2→3:



u1↦→v1,
u2↦→v1,
u3↦→v2.
The composite transmissionτ1→3:=τ2→3◦τ1→2thus maps
s1,s 2,s 3↦→v1, s 4↦→v2.
Table 1 summarises the structure ofRtoy.
Table 1: Toy three–level reticulumRtoy: states and images under transmissions.
Level States Transmission images
L1 s1 τ1→2(s1) =u 1,τ1→3(s1) =v 1
s2 τ1→2(s2) =u 1,τ1→3(s2) =v 1
s3 τ1→2(s3) =u 2,τ1→3(s3) =v 1
s4 τ1→2(s4) =u 3,τ1→3(s4) =v 2
L2 u1 τ2→3(u1) =v 1
u2 τ2→3(u2) =v 1
u3 τ2→3(u3) =v 2
L3 v1 —
v2 —
9

## Page 10

Coefficient of collapse
LetS 1 =D(L 1) ={s1,s 2,s 3,s 4}. The image ofS1 underτ1→2is
τ1→2(S1) ={u1,u 2,u 3},
so|τ1→2(S1)|= 3and|S1|= 4. By definition,
CC1→2(S1) = 1−|τ1→2(S1)|
|S1|= 1−3
4 = 1
4 = 0.25.
Thusτ1→2identifies a single pair of micro–states (s1,s 2), producing a mild collapse.
For the second transmission we takeS2 =τ1→2(S1) ={u1,u 2,u 3}. Its image is
τ2→3(S2) ={v1,v 2},
so|τ2→3(S2)|= 2and|S2|= 3, and
CC2→3(S2) = 1−|τ2→3(S2)|
|S2|= 1−2
3 = 1
3≈0.33.
Collapse is already present betweenL1 andL2 and becomes slightly stronger betweenL2 andL3.
Index of emergence
We now introduce a small familyQ of candidate macro–properties onD(L3)and classify them
as emergent or non–emergent with respect toL1.
LetQ={Q1,Q 2,Q 3,Q 4}, where:
•Q 1: “the macro–state isv1”;
•Q 2: “the macro–state isv2”;
•Q 3: “the macro–state corresponds (underτ1→3) to more than one micro–state”;
•Q 4: “the macro–state corresponds to at least three micro–states underτ1→3”.
In this toy,
τ−1
1→3(v1) ={s1,s 2,s 3}, τ−1
1→3(v2) ={s4}.
We assume that the modelling language atL1 can refer to individual micro–states inD(L1)but
cannot explicitly quantify thecardinalityof their preimages underτ1→3(i.e. it cannot talk about
“how many” micros collapse onto a given macro).
Under this assumption:
•Q 1 and Q2 are non–emergent: they simply select one of the two macro–states and can be
defined atL 1 as the subsets{s1,s 2,s 3}and{s4}, respectively.
•Q 3 andQ4 are emergent: they depend on the multiplicity of the preimage of a macro–state
under τ1→3and cannot be expressed, by hypothesis, as predicates onD(L1)that ignore
the collapse structure.
10

## Page 11

We therefore classify
Q1,Q 2 as non–emergent, Q 3,Q 4 as emergent,
so that the empirical index of emergence for this toy reticulum is
IE 1→3= #{emergentQ∈Q}
|Q| = 2
4 = 0.5.
Reticular irreducibility index
We now construct a simple causal graphG1 for the toy reticulum over a single time step and
computeRIR.
Fort= 1, letG 1 be the directed acyclic graph with vertex set
V(G 1) =D(L 1)∪D(L2)∪D(L3) ={s1,s 2,s 3,s 4,u 1,u 2,u 3,v 1,v 2},
so|V(G1)|= 9, and with edges
•from eachs i toτ1→2(si),
•from eachu k toτ2→3(uk).
We are interested in separating the micro–level nodesD(L1)from the macro–level nodes
D(L3)via a vertex cut. In this three–layer DAG a natural minimal vertex cut is given by
removing all nodes at levelL2, i.e.{u1,u 2,u 3}: removing fewer than three vertices leaves at least
one directed path from somesi to somev j.
Thus we may take
MinCut(G1) = 3,|V(G 1)|= 9.
Restricting attention to a single time horizonT= 1, the reticular irreducibility index is
RIR(R toy; 1) = 1−MinCut(G1)
|V(G1)|= 1−3
9 = 2
3≈0.67.
Even in this minimal example, a non–negligible fraction of the reticular structure must be
retained to preserve the mapping from micro–states to macro–states: the intermediate level
cannot be collapsed to a single effective node without loss.
Summary
Table 2 summarises the values of the three diagnostics in this toy case.
This example is deliberately minimal, but it makes explicit how one can computeCC, IE,
andRIR by hand for a finite RLA reticulum. In realistic applications (e.g. the bryophyte case of
Annex B or ECNNs in Annex C), the same definitions apply, with indices estimated numerically
over sampled state sets and time horizons.
11

## Page 12

Table 2: Toy numerical values of collapse, emergence, and reticular irreducibility for the three–
level reticulumR toy.
Index Definition in toy case Value
CC1→2 1−|τ1→2(S1)|/|S1|withS1 =D(L 1) 0.25
CC2→3 1−|τ2→3(S2)|/|S2|withS2 =τ1→2(D(L1))≈0.33
IE 1→3 fraction of emergentQ∈{Q1,Q 2,Q 3,Q 4}wrtL1 0.5
RIR(R toy; 1) 1−MinCut(G1)/|V(G1)| ≈0.67
5 From RLA to Neural Architectures
5.1 CNNs as RLA reticula
Convolutional neural networks (CNNs) [LeCun et al., 2015, Goodfellow et al., 2016] exhibit a
multi–level architecture that maps naturally onto the RLA framework. We view their layers as
levels and their interconnections as transmissions.
Consider a standard CNN with:
•input layerL 0 (e.g. images),
•convolutional layersL 1,...,L k,
•pooling layers interleaved among them,
•dense (fully connected) layersL k+1,...,L m,
•output layerL m+1 producing logits or class probabilities.
We define:
Li =⟨D(Li),Σ(L i)⟩,
where D(Li)is the space of activation tensors at layeri andΣ( Li)consists of the forward
computation rules (linear transforms plus non–linearities) and, if applicable, recurrent or skip
connections.
Transmissionsτi→i+1are implemented by the layer transformations:
• convolutional layers are often approximately quasi–injective on discriminative patterns (up
to symmetries and numerical approximation);
• pooling layers (max or average pooling) are non–injective: they implement explicit collapses
over local neighbourhoods, generating invariances to small transformations at the cost of
information loss;
• dense layers are typically many–to–one mappings from rich feature spaces to compact
representations or logits.
Under this reading, a CNN is a particular RLA reticulum where non–injective transmissions
play a central role in generalisation and invariance creation.
12

## Page 13

5.2 Compactness and CRC in CNN reticula
Proposition 5.1(Compactness of trained CNN reticula).Let RCNN be the RLA reticulum
induced by a trained CNN for a task with epistemic horizonH consisting of: inputs, labels, and a
fixed family of explanatory questions (e.g. class membership, confidence, feature attributions). If:
• all computations in the network are implementable by a Turing machine with finite precision
(TC);
• all explanatory entities and laws forH are internal to the network’s layers and transmissions
(IOA);
• every question inH can be answered or represented using only the network’s states and
rules (EC);
thenR CNN is a compact reticulum with respect toH.
Sketch. TC follows from the finite, algorithmic nature of forward passes and any recurrent com-
putations. IOA holds by hypothesis, since all explanatory entities (features, weights, activations)
are internal to the network. EC holds because, by assumption, all questions inH can be expressed
and answered using only network states and rules. Thus the definition of compact reticulum is
satisfied.
Proposition 5.2(CRC in CNN reticula).If, in addition, some level ofRCNN is Turing–like
and there exist macro–properties at higher levels that are computable there but not definable as
predicates on earlier levels (relative to their modelling languages), thenRCNN is an instance of
Compact Reticular Computability (CRC).
Sketch. The conditions of the CRC definition are satisfied: a global Turing machine can simulate
all levels; a Turing–like level exists; and emergent macro–properties at higher levels are not
definable on earlier levels. HenceRCNN is CRC.
In this reading, the non–injective pooling and dense layers of CNNs provide explicit examples
of collapse–induced emergence in engineered systems, while Turing–like substructures (e.g.
recurrent cores or architectures with sufficient memory) provide loci for undecidability in the
sense of Rice’s theorem.
6 Hook to Epistemic CNNs (ECNNs)
6.1 Limitations of standard CNN heads
Standard CNNs are typically trained with softmax outputs and cross–entropy loss. Their
limitations with respect to epistemic behaviour are well known:
•They often exhibit overconfident predictions and poor calibration [Guo et al., 2017].
• They lack explicit mechanisms to output “I do not know” or “this input contradicts my
training distribution”.
13

## Page 14

• Out–of–distribution (OOD) samples can elicit high–confidence but incorrect outputs
[Hendrycks & Gimpel, 2016].
In RLA terms, the final transmission to the output layer is not designed to make epistemic
limits visible as first–class objects. Undecidability, ignorance, and contradiction remain implicit,
if they appear at all.
6.2 Epistemic heads and ECNNs as CRC instances
Epistemic CNNs(ECNNs), developed in detail in Annex C, augment CNN architectures with an
epistemic channeland anepistemic headthat produce:
•standard predictions or distributions over labels;
•explicit “unknown” and “contradiction” states;
• additional artefacts such as confidence scores, rationales, and flags for OOD or adversarial
inputs.
The epistemic head is trained under a composite loss that balances prediction accuracy with:
•calibration (e.g. via Brier score or expected calibration error),
• robustabstentionunderuncertainty(e.g.followingoptimalreject–optiontheory[ Chow, 1970]),
•and detection of internal inconsistencies and challenge–set contradictions.
In the RLA/CRC framework, an ECNN becomes anengineered CRC instance:
•its levels and transmissions define a compact reticulum;
• its epistemic head makes ignorance and contradiction into computable observables at the
highest level;
• its behaviour can be evaluated against Popper–style challenge suites (Popper–χ) that test
epistemic and predictive performance (Annex C).
Annex C introduces ECNN–specific versions ofCC,IE, andRIR, and shows how to measure
emergence and falsifiability in concrete architectures. Annex D then connects these diagnostics
to dynamical regimes in the Principle of Computational Equivalence.
6.3 Connection to ECU/UCE architectures
The epistemic head of an ECNN can be realised with varying degrees of complexity. At one
extreme, it may be a small feed–forward network that maps final features to epistemic states. At
the other extreme, it may be implemented as a composition ofEpistemic Computational Units
(ECUs) andEpistemic Computational Entities(UCEs), described in Annex E:
• An ECU is a bounded large language model instance operating under a deterministic
epistemic matrixM, capable of generating structured epistemic artefacts from feature
representations.
14

## Page 15

•UCEs are topologically organised rings of ECUs that can implement executive, valuation,
memory, and metacognitive functions in an epistemically closed, Turing–computable way.
From the perspective of Annex A, this shows that:
•the highest levels of a CRC reticulum need not be limited to scalar activations;
• they can instead encode high–level epistemic objects, as long as these admit computable
representations;
• the crucial structural features are the reticular organisation, the injective vs non–injective
transmissions, and the satisfaction of IOA, EC, and TC.
In this sense, Annex A provides the general language in which ECNNs, ECUs, and UCEs can
be treated as specific, engineered instances of reticular, compact, and epistemically expressive
computational systems.
7 Summary and Relation to Annexes B–E
Annex A has defined:
•RLA reticula as chains of levels linked by transmissions;
•compact reticula via IOA, EC, and TC, relative to an epistemic horizon;
•CRC as the extension of computability to such reticula;
•axioms and basic results on undecidability and emergence;
•operational indicesCC,IE, andRIR, illustrated by a fully worked toy example;
•and a structural mapping from CNNs to RLA reticula, with an explicit hook to ECNNs.
The subsequent annexes build on this foundation:
• Annex B instantiates RLA and CRC in a natural domain: a compact reticular lattice for
a generalist bryophyte, built from plant physiology and ecology, providing an empirical
reference case.
• Annex C develops ECNNs as engineered CRC instances with epistemic heads, reticular
diagnostics, and Popper–χevaluation protocols.
• Annex D (RLA–ECNN bridge to PCE) leveragesCC, IE, and RIR to connect CRC
reticula to cellular automata and to discuss dynamical regimes in the sense of the Principle
of Computational Equivalence.
• Annex E specifies ECU/UCE architectures as implementations of epistemic heads and
higher–level reticula where the basic “neurons” are LLM–based epistemic units operating
over high–level objects constrained by epistemic matrices.
Together, these annexes provide a layered technical background for the main position paper.
Annex A should be read as the minimal, self–contained foundation on which the other, more
specialised constructions rest.
15

## Page 16

References
[Anderson, 1972] Anderson, P. W. (1972). More is different.Science, 177(4047), 393–396.
https://doi.org/10.1126/science.177.4047.393
[Bechtel & Abrahamsen, 2005]Bechtel, W., & Abrahamsen, A. (2005). Explanation: A mecha-
nist alternative.Studies in History and Philosophy of Biological and Biomedical Sciences,
36(2), 421–441. https://doi.org/10.1016/j.shpsc.2005.03.010
[Chaitin, 2005] Chaitin, G. (2005).Meta Math!: The Quest for Omega. Pantheon.
[Chow, 1970] Chow, C. K. (1970). On optimum recognition error and reject tradeoff.IEEE Trans-
actions on Information Theory, 16(1), 41–46. https://doi.org/10.1109/TIT.1970.1054406
[Church, 1936] Church, A. (1936). An unsolvable problem of elementary number theory.American
Journal of Mathematics, 58(2), 345–363. https://doi.org/10.2307/2371045
[Goodfellow et al., 2016]Goodfellow, I., Bengio, Y., & Courville, A. (2016).Deep Learning. MIT
Press.
[Guo et al., 2017]Guo, C., Pleiss, G., Sun, Y., & Weinberger, K. Q. (2017). On calibration of
modern neural networks. InProceedings of the 34th International Conference on Machine
Learning(pp. 1321–1330).
[Hendrycks & Gimpel, 2016]Hendrycks, D., & Gimpel, K. (2016). A baseline for detect-
ing misclassified and out-of-distribution examples in neural networks.arXiv preprint
arXiv:1610.02136.
[Lakshminarayanan et al., 2017]Lakshminarayanan, B., Pritzel, A., & Blundell, C. (2017). Sim-
ple and scalable predictive uncertainty estimation using deep ensembles. InAdvances in
Neural Information Processing Systems(pp. 6402–6413).
[Laughlin & Pines, 2000]Laughlin, R. B., & Pines, D. (2000). The theory of everything.Proceed-
ings of the National Academy of Sciences, 97(1), 28–31. https://doi.org/10.1073/pnas.97.1.28
[LeCun et al., 2015]LeCun, Y., Bengio, Y., & Hinton, G. (2015). Deep learning.Nature,
521(7553), 436–444. https://doi.org/10.1038/nature14539
[Noble, 2012] Noble, D. (2012). A theory of biological relativity: No privileged level of causation.
Interface Focus, 2(1), 55–64. https://doi.org/10.1098/rsfs.2011.0067
[Rice, 1953] Rice, H. G. (1953). Classes of recursively enumerable sets and their deci-
sion problems.Transactions of the American Mathematical Society, 74(2), 358–366.
https://doi.org/10.1090/S0002-9947-1953-0053041-6
[Shalizi & Crutchfield, 2001]Shalizi, C. R., & Crutchfield, J. P. (2001). Computational mechan-
ics: Pattern and prediction, structure and simplicity.Journal of Statistical Physics, 104(3–4),
817–879. https://doi.org/10.1023/A:1010388907793
16

## Page 17

[Turing, 1936/1937]Turing, A. M. (1936/1937). On computable numbers, with an application
to the Entscheidungsproblem.Proceedings of the London Mathematical Society, s2-42(1),
230–265. https://doi.org/10.1112/plms/s2-42.1.230
[Wolfram, 2002] Wolfram, S. (2002).A New Kind of Science. Wolfram Media.
17
