---
id: "annex-e-rla-ecnn-pce-bridge"
title: "Annex E - RLA-ECNN bridge PCE"
role: "technical_annex"
source_path: "RLA-CRC-ECNN/Annex E - RLA-ECNN bridge PCE.pdf"
source_raw_url: "https://raw.githubusercontent.com/Luke883i/ROA/main/RLA-CRC-ECNN/Annex%20E%20-%20RLA-ECNN%20bridge%20PCE.pdf"
source_sha256: "9b60fcd0ff6a269404208d991478dd794cc5f48b7a7e0d9686a6adfc5ec6be35"
extraction_status: "success"
---

## Page 1

Annex E
Reticular Local Abstraction, Epistemic CNNs,
and the Bridge to the Principle of Computational Equivalence
Gianluca Conte
September 2025
Abstract
This annex develops the “bridge layer” between the general framework ofReticular Local
Abstraction (RLA) andCompact Reticular Computability(CRC) introduced in Annex A,
the engineeredEpistemic Convolutional Neural Networks(ECNN) formalised in Annex C,
and Wolfram’sPrinciple of Computational Equivalence(PCE) as explored through one–
dimensional Cellular Automata (CA) [Wolfram, 1984, Wolfram, 2002]. The structural gaps
addressed here are: (i) an explicit alignment of terminology and axioms with Annex A (IOA,
EC, TC and CRC), (ii) a precise reticular reading of ECNN architectures and their epistemic
heads, and (iii) a clearer, diagnostics–driven mapping from compact reticula to CA dynamics,
with falsifiable conjectures rather than ontological claims.
RLA represents systems as finite reticula of levels of abstraction linked by transmissions
that may be injective, quasi–injective (on Turing–critical sets), or non–injective (information
collapse). CRC characterises when such reticula are internally ontologically autonomous,
epistemically closed and fully Turing–computable [Church, 1936, Turing, 1936/1937]. EC-
NNs re–interpret CNN stacks as reticula and add an epistemic channel that outputs struc-
tured unknown and contradiction signals, evaluated through Popper–style challenge sets
[Popper, 1959, Goodfellow et al., 2016]. This annex introduces a systematic dictionary be-
tween compact reticula and one–dimensional CA, and proposes that reticula which are both
Turing–like and empirically irreducible, with non–trivial emergence, correspond (under an
explicit encoding) to complex (class IV/V) CA regimes, and conversely [Li & Packard, 1990,
Cook, 2004, Wolfram, 2002, Shalizi & Crutchfield, 2001].
The bridge is deliberately epistemic rather than ontological: it provides a shared compu-
tational vocabulary and falsifiable diagnostics for relating layered computation, logical limits
and canonical models of complexity, without committing to claims about “what the universe
really is”.
Contents
1 Introduction 2
2 Background and Alignment with Annex A & C 3
2.1 Reticular Local Abstraction and CRC (from Annex A) . . . . . . . . . . . . . . . 3
2.2 Working axioms (specialised form) . . . . . . . . . . . . . . . . . . . . . . . . . . 4
1

## Page 2

2.3 Epistemic CNNs as compact reticula (from Annex C) . . . . . . . . . . . . . . . 5
3 Reticular View of ECNN Architectures 5
3.1 Representation channel and transmissions . . . . . . . . . . . . . . . . . . . . . . 5
3.2 Epistemic head and Popper–χchallenge suites . . . . . . . . . . . . . . . . . . . 6
3.3 Reticular diagnostics for ECNNs . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
4 Cellular Automata and the RLA–CA Bridge 7
4.1 One–dimensional cellular automata . . . . . . . . . . . . . . . . . . . . . . . . . . 7
4.2 Dictionary between reticula and CA . . . . . . . . . . . . . . . . . . . . . . . . . 8
4.3 Constructive encodingΦ: RLA→CA . . . . . . . . . . . . . . . . . . . . . . . . 8
4.4 Reverse encodingΨ: CA→RLA . . . . . . . . . . . . . . . . . . . . . . . . . . . 8
5 Conceptual Results and Conjectures 9
5.1 Propagation versus blocking in ECNN reticula . . . . . . . . . . . . . . . . . . . 9
5.2 Design regimes for ECNN reticula . . . . . . . . . . . . . . . . . . . . . . . . . . 9
5.3 Reticular–CA correspondence and PCE . . . . . . . . . . . . . . . . . . . . . . . 10
5.4 Illustrative scenario (conceptual) . . . . . . . . . . . . . . . . . . . . . . . . . . . 10
6 Roadmap, Threats to Validity and Ethical Note 11
6.1 Roadmap for empirical and mathematical work . . . . . . . . . . . . . . . . . . . 11
6.2 Threats to validity . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 11
6.3 Ethical note . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 12
7 Conclusion 12
1 Introduction
Scientific practice across physics, biology and machine learning recurrently encounters two
stubborn motifs:
1. persistent macro–regularitiesthat resist transparent reduction to micro–level predicates,
even when micro–dynamics are well understood [Anderson, 1972, Noble, 2012];
2. logical limitsthat emerge as soon as a substrate attains Turing–equivalent computational
power [Turing, 1936/1937, Rice, 1953, Chaitin, 2005].
Reticular Local Abstraction (RLA) and Compact Reticular Computability (CRC), introduced
in Annex A, offer a unified vocabulary for both issues by describing models as lattices of levels
linked by transmissions whose injectivity controls how information, undecidability and emergent
properties flow across scales.
Epistemic Convolutional Neural Networks (ECNN), formalised in Annex C, instantiate this
viewpoint on contemporary deep architectures [Goodfellow et al., 2016]. Convolutional and
pooling layers are reinterpreted as levels and transmissions; non–injective pooling implements
2

## Page 3

controlled information collapse; and an epistemic head produces explicitunknownandcontra-
dictionoutputs. These outputs are evaluated with Popper–style challenge suites that target
epistemic behaviour, not just predictive accuracy [Popper, 1959]).
Wolfram’s Principle of Computational Equivalence (PCE) suggests that, beyond a low
threshold, many natural and artificial systems achieve a form of computational universality and
irreducible behaviour [Wolfram, 1984, Wolfram, 2002]. One–dimensional cellular automata (CA)
are central to this proposal: simple local rules give rise to a spectrum of dynamics, from fixed
patterns (class I) to complex structures (class IV/V) [Li & Packard, 1990, Cook, 2004].
This annex has three aims:
1. to summarise and specialise the RLA/CRC axioms of Annex A to the neural and epistemic
architectures of Annex C;
2. to articulate ECNNs as compact reticula with an epistemic interface and falsification
protocol;
3. to construct a bridge between compact reticula and one–dimensional CA, and to formulate
conjectures linking structural diagnostics to CA dynamical classes in the spirit of PCE
[Wolfram, 1984, Wolfram, 2002].
The treatment is intentionally conceptual and methodological. No empirical dataset is
assumed, and no claim is made about the actual dynamical class of any particular trained
network. All constructions areepistemic: they formalise how we model and reason about systems,
not an ultimate ontology of the systems themselves.
2 Background and Alignment with Annex A & C
2.1 Reticular Local Abstraction and CRC (from Annex A)
We briefly recall and specialise the core notions of Annex A (cf. [Church, 1936, Turing, 1936/1937,
Rice, 1953]).
Definition 2.1(Level of abstraction and RLA reticulum).Alevel of abstraction(or simply
level) is a pairL=⟨D(L),Σ(L)⟩, where:
•D(L)is a set (or discretisable space) of admissible states;
• Σ(L)is a set of effective rules acting onD(L)(dynamical laws, update equations, inference
rules, programs).
AnRLA reticulumis a finite sequence
R= (L 1,...,Ln)
together withtransmissionsτi→i+1:D(L i)→D(Li+1)fori= 1,...,n−1.
Definition 2.2(Transmission classes).Let S⊆D(Li)be a subset of interest. A transmission
τi→jis:
3

## Page 4

•injective onSifx 1,x 2∈Sandτi→j(x1) =τi→j(x2)implyx 1 =x 2;
• quasi–injective onS if there exists a partitionS =S′∪S′′such thatτi→jis injective onS′
andS ′′is declared irrelevant for a given analysis (e.g. below resolution);
• non–injective onS if there exist distinctx1,x 2∈Swith τi→j(x1) = τi→j(x2)and the
distinction betweenx 1,x 2 is relevant for at least one family of properties.
Definition 2.3(Turing–like level).A levelLi =⟨D(Li), Σ(Li)⟩isTuring–likeif the formalism
represented byΣ(Li)can, up to a computable encoding of inputs and outputs, simulate a universal
Turing machine (or an equivalent model of computation) [Church, 1936, Turing, 1936/1937].
Definition 2.4(Epistemic horizon).Anepistemic horizon H for a modelling practice is a
specified set of observables, questions and explanatory tasks that are considered in scope for a
given reticulumR. Formally,H is a finite or countable family of predicates and queries about
the domain, together with a specification of which answers or explanations are admissible.
Definition 2.5(IOA, EC, TC and compact reticulum).An RLA reticulumRis:
• internally ontologically autonomous (IOA)if all explanatory entities and laws for the
domain under horizonHare represented internally by levels and transmissions;
• epistemically closed (EC)with respect toH if every observable or question inH can be
represented and explained using only the states and rules ofR;
• Turing–computable (TC)if allΣ(Li)and τi→jare effectively realisable by Turing machines.
Ris acompact reticulumif it satisfies IOA, EC and TC for some specified horizonH.
Definition 2.6(Compact Reticular Computability (CRC)).A compact reticulumR exhibits
Compact Reticular Computabilityif:
1. a Turing machineTcan simulate everyΣ(L i)andτi→jto arbitrary precision;
2. at least one levelLk is Turing–like;
3. there exist macro–properties at some higher levelLj, j >k, that are computable with respect
toΣ( Lj)but not definable, in the languages of lower levels, as predicates onD(Li)for
i<j.
CRC thus extends classical computability from single machines to multi–level epistemic archi-
tectures, without altering any existing result of computability theory [Rice, 1953, Chaitin, 2005].
2.2 Working axioms (specialised form)
We specialise the Annex A axioms to the setting where at least one level is Turing–like and we
care about how limits and macro–structure propagate [Rice, 1953].
Axiom 2.1(Undecidability at Turing–like levels).LetLi be Turing–like andCi⊆D(Li)a
critical set on whichΣ(Li)is Turing–complete. Then any non–trivial extensional propertyU⊆Ci
is undecidable with respect toΣ(Li), in the sense of Rice’s theorem [Rice, 1953].
4

## Page 5

Axiom 2.2(Propagation of limits through quasi–injective maps).Ifτi→jis effectively computable
and quasi–injective on a critical subsetCi⊆D(Li), then undecidable properties onCi cannot
become decidable onτi→j(Ci)by post–processing.
Axiom 2.3(Emergencevianon–injectivecollapse).If τi→jis non–injective on a subsetS⊆D(Li)
relevant for a family of properties of interest, then there exists at least one macro–property on
D(Lj)that is not definable as a predicate onD(Li)alone. Such a property is calledemergent
relative toLi [Anderson, 1972, Noble, 2012].
These axioms make explicit the two key structural tensions: quasi–injective links preserve
logical limits, while non–injective links trade away micro–information to gain new macro–structure.
2.3 Epistemic CNNs as compact reticula (from Annex C)
Annex C defines ECNNs as engineered instances of compact reticula leveraging standard deep
learning [Goodfellow et al., 2016].
Definition 2.7(ECNN (informal recap)).AnEpistemic Convolutional Neural Network(ECNN)
is a tuple
E=
(
L0,...,Ln,L ep,Σ,M
)
where:
•L 0,...,Ln are levels corresponding to input, convolution, pooling, dense and representation
blocks of a CNN;
•L ep is an epistemic level carrying structured epistemic states;
•Σis a finite set of Turing–computable update rules and transmissions;
•Mis an epistemic matrix encoding concepts, rules, coherence constraints and policies.
The representation channelBθ:X→Rd maps inputs to high–level embeddings. An Epistemic
Computational Unit (ECU) and an epistemic headHψmap( z,M )into epistemic artefacts and
final distributions over labels and epistemic statesY∪{⊥,⊥c}(label, unknown, contradiction).
Under the IOA/EC/TC conditions of Annex A and the explicit design constraints of Annex C,
an ECNN becomes a compact reticulum, and—if it contains a Turing–like level with emergent
macro–properties—an instance of CRC.
3 Reticular View of ECNN Architectures
3.1 Representation channel and transmissions
LetX be the input space andBθ:X→Rd the CNN–based representation channel. We view
each layer as a levelLi =⟨D(Li), Σ(Li)⟩, whereD(Li)is the activation space andΣ(Li)is the
rule that computes activations from predecessors [Goodfellow et al., 2016].
5

## Page 6

• Convolutional levels:D(Lc) = RH×W×C; transmissionsτc→c+1are local linear operators
followed by non–linearities. On discriminative subsets and up to symmetries, they are
quasi–injective.
• Pooling levels:D(Lp)share shape with their inputs; transmissionsτp→p+1implement
max or average pooling over neighbourhoods, and are non–injective on relevant states.
• Dense levels: D(Ld) = Rm; transmissions are affine maps plus non–linearities, often
many–to–one in practice.
Residual or skip connections can be encoded as additional transmissions that bypass collapse,
thereby preserving quasi–injective paths on Turing–critical subsets.
3.2 Epistemic head and Popper–χchallenge suites
On top of the representation channel we place the ECU and epistemic head (Annex C). Given
z=B θ(x)and epistemic matrixM, the ECU produces an epistemic artefactacontaining:
•a primary decisiony ⋆∈Y∪{⊥,⊥c};
•optional confidence scores and auxiliary flags;
•a structured explanation or rationale constrained byM.
The epistemic headHψmapsato a distribution overY∪{⊥,⊥c}.
Definition 3.1(Popper–χchallenge suites).APopper–χchallenge suiteχfor an ECNN consists
of three families of test cases:
• Contradictory pairsΩ CP: pairs(x,x′)such that assigning labels(y,y′)with y =y′would
violate constraints inM(e.g. mutual exclusivity, temporal incoherence);
• Undecidability triggersΩ UT: inputs for which, relative toM, no label inY is justifiable;
the epistemically correct response is⊥[Popper, 1959];
• Semantic adversariesΩ SA: inputs that preserve low–level statistics but invert or scramble
semantic content, testing robustness and invariances [Goodfellow et al., 2016].
Definition 3.2(Core epistemic metrics).Given an ECNNFand a challenge suiteχ, define:
CR = #{(x,x′)∈ΩCP :F(x),F(x ′)jointly violateMand no⊥c is emitted}
#Ω CP
,
IR = #{x∈ΩUT :F(x)emits⊥}
#Ω UT
.
CRis thecontradiction rate;IRis theindecidability recall.
Epistemically aligned ECNNs aim for lowCR and high IR, in addition to good classical
metrics (accuracy, calibration, robustness) [Goodfellow et al., 2016].
6

## Page 7

3.3 Reticular diagnostics for ECNNs
WenowspecialisethegenericdiagnosticsofAnnexA[ Shalizi & Crutchfield, 2001,Wolfram, 2002]
to ECNNs.
Definition 3.3(Coefficient of CollapseCC in ECNNs).Let τi→jbe a layer–to–layer transmission
andS⊆D(Li)a finite sample of activations. Thecoefficient of collapseonSis
CC (ECNN)
i→j = 1−
⏐⏐τi→j(S)
⏐⏐
|S|∈[0,1],
whereτi→j(S)is counted up to a chosen numerical tolerance.
Definition 3.4(Index of EmergenceIE in ECNNs).Let Q be a family of candidate macro–
properties onD(Lj)(e.g. linear decision boundaries, clustering structure, simple symbolic de-
scriptors). Theindex of emergencefromL i toL j is
IE (ECNN)
i→j = #{Q∈Q:Qis computable atLj and not definable onD(Li)}
|Q| .
In practice, non–definability is tested with approximations (linear probes, symbolic regression,
restricted hypothesis classes). A non–zeroIE (ECNN)
i→j indicates that, within the chosen probe
family, some macro–properties atLj cannot be reduced to predicates onD(Li).
Definition 3.5(Reticularirreducibilityindex RIR inECNNs).Let Gt be the causal graph induced
by layer activations and transmissions up to timet (for recurrent or iterative networks), with
vertex setV (Gt). Let MinCut(Gt)be the smallest number of vertices whose removal disconnects
inputs from outputs over that horizon. For a finite horizonT, thereticular irreducibility indexis
RIR (ECNN) = 1−1
T
T∑
t=1
MinCut(Gt)
|V(Gt)|.
LowRIR (ECNN) indicates that small cuts capture most causal structure (high compressibility);
high RIR (ECNN) indicates that no small cut suffices, serving as a proxy for computational
irreducibility [Shalizi & Crutchfield, 2001, Wolfram, 2002]).
4 Cellular Automata and the RLA–CA Bridge
4.1 One–dimensional cellular automata
A one–dimensional cellular automaton (CA) is defined by [Wolfram, 1984, Li & Packard, 1990]:
•a finite alphabetA,
•a configuration spaceA Z orA{1,...,N},
•a local update rulef:A 2r+1→Aof finite radiusr,
•a global mapF:A Z→AZ defined by(F(c))i =f(c i−r,...,ci+r).
7

## Page 8

Wolfram’s empirical classification distinguishes four qualitative classes: (I) fixed point, (II)
periodic, (III) chaotic, (IV) complex [Wolfram, 1984, Wolfram, 2002]. Certain elementary CA
(e.g. rule 110) are known to be Turing–complete [Cook, 2004].
4.2 Dictionary between reticula and CA
Weoutlinethestructuraldictionarythatunderpinsthebridge[ Li & Packard, 1990,Wolfram, 2002]:
• Levels and tapes: RLA levels correspond to abstractions over CA configurations; con-
versely, CA tapes can be seen as special cases of level states with discrete dynamics.
• Transmissions and local rules: transmissionsτi→jcorrespond to local update rules and
coarse–grainings; injective vs non–injective behaviour maps to information–preserving vs
collapsing CA morphisms.
• Universality and Turing–like levels: Turing–complete CA rules correspond to Turing–
like levels; reticula with Turing–like levels can, under suitable encodings, be implemented
by CA with additional bookkeeping [Cook, 2004].
• Irreducibility: highRIR in reticula corresponds to CA regimes where long–range cor-
relations and complex structures resist coarse–grained summarisation, as in class IV/V
[Wolfram, 1984, Shalizi & Crutchfield, 2001].
4.3 Constructive encodingΦ: RLA→CA
Definition 4.1(EncodingΦ : R→CA).Let R be a compact reticulum. An encodingΦ(R)is a
one–dimensional CA constructed as follows (abstractly):
1. Choose finite alphabets that encode states of each level and internal registers.
2. Encode joint reticular states at a discrete timet as a CA configurationct∈AZ via a
computable codingγthat respects the product structure ofD(Li).
3. Design a local CA rulef such that one global CA stepF(ct)simulates one synchronous
update of all levels and transmissions underΣand{τi→j}.
The resulting CAΦ(R)is such that Ft(c0)encodes the reticular evolution up to timet, up to
computable decoding [Wolfram, 2002, Shalizi & Crutchfield, 2001].
This construction is standard in spirit: finite collections of Turing–computable maps can be
simulated by CA with appropriate bookkeeping. What matters here is that quasi–injective and
non–injective structure in the reticulum is mirrored by information–preserving and collapsing
patterns in the CA dynamics.
4.4 Reverse encodingΨ: CA→RLA
Definition 4.2(EncodingΨ : CA→R).Given a one–dimensional CA with rulef, we define a
two–level reticulum:
8

## Page 9

•L micro with states given by CA configurations and rules implementingF;
•L macro with states given by coarse–grained descriptions of configurations (e.g. block averages,
domain decompositions) and rules describing their evolution.
Transmissionsτmicro→macroare chosen as coarse–grainings or observables of interest (e.g. ma-
jority voting on blocks, feature maps). The resulting reticulumΨ( CA)is compact when-
ever F, the coarse–grainings and the observables are Turing–computable [Li & Packard, 1990,
Shalizi & Crutchfield, 2001].
This reverse mapping shows that CA can be treated as special cases of reticula, and that
CA–based complexity can be rephrased in RLA/CRC terms.
5 Conceptual Results and Conjectures
5.1 Propagation versus blocking in ECNN reticula
We first restate, in ECNN form, the structural tension between quasi–injective propagation and
non–injective blocking [Rice, 1953, Anderson, 1972].
Proposition 5.1(Propagation vs blocking of undecidability).Let RECNN be the reticulum
induced by an ECNN and assume it is compact and contains a Turing–like levelLi.
1. If τi→i+1is effectively computable and quasi–injective on a critical subsetCi⊆D(Li), then
any non–trivial extensional propertyU⊆Ci that is undecidable atLi remains undecidable
atL i+1.
2. If τi→i+1is non–injective on relevant states, then (i) propagation of some undecidable
properties may be blocked, and (ii) by Axiom 2.3 at least one emergent macro–property
arises atLi+1.
Sketch. (1) is a Rice–style argument: ifU became decidable atLi+1, quasi–injectivity would
allow one to decideU at Li by composingτi→i+1with the hypothetical decider, contradicting
Axiom 2.1 and [Rice, 1953]. (2) follows from Axiom 2.3 and the observation that non–injective
maps can identify states whose distinct computational behaviour carried the undecidability,
thereby potentially blocking it [Anderson, 1972, Noble, 2012].
In ECNNs, pooling and bottleneck layers are primary candidates for the second case, whereas
carefully designed residual paths can preserve quasi–injective channels for Turing–critical traces.
5.2 Design regimes for ECNN reticula
We distinguish four qualitative design regimes, according to memory capacity and collapse aggres-
siveness, inspired by both RLA/CRC and CA classifications [Wolfram, 1984, Li & Packard, 1990,
Wolfram, 2002].
9

## Page 10

Regime Memory Collapse Diagnostics (qualitative) CA analogue
R1 Bounded Aggressive LowRIR, highCC,IE≈0Class I–II (fixed/periodic)
R2 Bounded Conservative ModerateRIR, midCC, modestIEClass II–III (simple/chaotic)
R3 Unbounded Aggressive Internal undecidability, but strongly reduced visibility at the interface;IE >0locally Mixed; depends on encoding
R4 Unbounded Conservative HighRIR, non–trivialIE, sustained macro–structure Class IV/V (complex)
Regime R1 serves as a non–proto baseline: collapse overwhelms potential complexity. R2
captures architectures where some richness survives but no systematic attempt is made to surface
logical limits. R3 corresponds to systems with powerful internal computation whose limits are
mostly hidden by downstream collapse. R4 is the regime of interest forepistemicarchitectures:
internal limits become observable through the epistemic head and are mirrored by complex CA
behaviour underΦ.
5.3 Reticular–CA correspondence and PCE
We can now formulate the central conjecture that links CRC reticula, ECNN diagnostics and CA
dynamics, in the spirit of PCE [Wolfram, 1984, Wolfram, 2002].
Conjecture 5.1(Reticular–CA correspondence under CRC).LetR be a compact reticulum
with at least one Turing–like level, and letΦ(R)be a one–dimensional CA encoding constructed
as in Section 4.3. Then:
1. If R exhibits high reticular irreducibilityRIR≈1on a representative family of traces
and admits at least one linkLi →Lj with CCi→j< 1and IEi→j> 0, then the CA
Φ(R)displays complex (class IV/V–like) dynamics in the sense of Wolfram’s empirical
classification [Wolfram, 1984, Li & Packard, 1990].
2. Conversely, if a CA rulef yields sustained complex dynamics (class IV/V) on a non–
negligible set of initial conditions, then the associated reticulumΨ(CA)contains a Turing–
like level and exhibits high RIR and non–trivialIE for at least one coarse–graining
[Cook, 2004, Shalizi & Crutchfield, 2001].
This is a deliberatelyepistemicversion of PCE: it does not state that “most systems in nature
are computation–universal”, but that, conditional on CRC and the diagnostics(CC,IE,RIR ),
reticula and CAs occupy correspondingly complex regimes. Any counterexample—for instance, a
reticulum with highRIRand non–trivialIEwhoseΦ(R)is provably class I—would refute the
conjecture.
5.4 Illustrative scenario (conceptual)
Consider an ECNN whose internal architecture includes:
• a differentiable stack or tape that can emulate a universal Turing machine (activated
memory);
10

## Page 11

• a sequence of convolutional and pooling layers with residual paths that preserve quasi–
injective channels from the Turing–like core to the epistemic head;
•an epistemic head trained on Popper–χsuites to minimiseCRand maximiseIR.
If collapse is conservative along at least one path (CC (ECNN)
i→j moderate, not maximal) and
RIR (ECNN) is empirically high on relevant tasks, we expect this architecture to fall in regime R4.
Under a faithful encodingΦ, its CA image should exhibit complex spatio–temporal structures
(gliders, long–lived domains) rather than quick convergence to fixed or purely chaotic behaviour
[Wolfram, 1984, Wolfram, 2002].
If the same Turing–like core is followed by aggressive pooling and narrow bottlenecks with
no residual bypass, collapse becomes strong (CC (ECNN)→1on critical traces), undecidability
is largely blocked, and the architecture migrates toward regime R1 or R2. The corresponding
CA may then appear class I/II or III despite the latent universality of the underlying core
[Li & Packard, 1990]. This illustrates why, in the RLA/CRC view, topology and transmission
types, not sheer parameter count, are the primary levers for proto–epistemic behaviour.
6 Roadmap, Threats to Validity and Ethical Note
6.1 Roadmap for empirical and mathematical work
The conceptual bridge proposed here suggests several concrete steps, in line with existing work
on deep learning, CA and computational mechanics [Goodfellow et al., 2016, Wolfram, 2002,
Shalizi & Crutchfield, 2001]:
1.Canonical ECNN benchmarks: define standard Popper–χsuites (contradictory pairs,
undecidability triggers, semantic adversaries) for vision and language tasks, and report
(CR,IR)alongside accuracy and calibration.
2. Reticular diagnostics: implement practical estimators forCC (ECNN), IE (ECNN) and
RIR (ECNN) on trained networks, and correlate them with architectural choices (depth,
pooling strategy, residual topology, memory).
3.CA embeddings: construct explicit encodingsΦandΨfor small reticula and CA rules,
and empirically verify or falsify parts of Conjecture 5.1.
4. Proto–epistemic design patterns: systematise architectural motifs (e.g. weak collapse
on Turing–critical channels, explicit epistemic heads) that consistently yield lowCR, high
IRand highRIR, and study their CA images.
6.2 Threats to validity
Several limitations and risks should be emphasised [Popper, 1959, Shalizi & Crutchfield, 2001,
Wolfram, 2002]:
• Approximate diagnostics: in practice,CC,IE andRIR are estimated on finite samples
and restricted probe families. A low estimatedIE does not prove absence of emergence; a
highRIRmay depend on the chosen horizonT.
11

## Page 12

• Encoding dependence: the behaviour ofΦ(R)andΨ( CA)depends on encoding choices.
Poorly chosen encodings can artificially inflate or suppress apparent complexity.
• Heuristic CA classes: Wolfram’s four classes are empirically useful but coarse. More
refined tools (entropy rates, causal states, computational mechanics) should be used in
parallel [Shalizi & Crutchfield, 2001].
• Epistemic horizon choice: compactness, CRC and the meaning of “emergent” are all
relative to the chosen horizonH. Different communities may adopt different horizons for
the same underlying system [Kuhn, 1970].
6.3 Ethical note
Epistemic heads and challenge suites are attractive for high–stakes applications (law, medicine,
finance) because they can, in principle, make ignorance and contradiction explicit. This also
creates new failure modes: over–trust in the epistemic channel, adversarial manipulation of
challenge sets, and opaque epistemic matrices. Any practical deployment of ECNNs as decision
aids should:
• adopt conservative thresholds for accepting predictions, favouring abstention (⊥) when in
doubt;
• subject epistemic matrices, reticular designs and Popper–χsuites to independent audit
[Popper, 1959];
• clearly separate epistemic outputs (what the model can justifiably claim) from ontological
statements about the world.
7 Conclusion
This annex has tightened the structural and conceptual links between:
• the RLA/CRC framework of Annex A [Church, 1936, Turing, 1936/1937, Rice, 1953,
Anderson, 1972, Noble, 2012];
•the ECNN architectures and epistemic heads of Annex C [Goodfellow et al., 2016];
• and the CA–based explorations of complexity and universality associated with PCE
[Wolfram, 1984, Wolfram, 2002, Cook, 2004].
By resolving the main structural gaps—terminological alignment, explicit reticular diagnostics,
and a constructive (if high–level) mapping to CA—the annex turns what could have remained a
loose analogy into a falsifiable research programme. The programme is modest in its metaphysical
commitments: it does not assert that “everything computes the same way”, but it does claim
that, under CRC and measurable diagnostics, there is a robust correspondence between: (i)
how multi–level models distribute injective and non–injective transmissions, and (ii) the kind of
dynamical regimes they inhabit when represented as canonical discrete systems.
12

## Page 13

Whether Conjecture 5.1 ultimately stands or falls is a matter for mathematical proof and
empirical exploration. Either outcome would be informative: a confirmation would sharpen the
relevance of PCE for engineered epistemic architectures; a refutation would reveal new ways
in which layered computation can escape CA–style universality. In both cases, the reticular
perspective provides a disciplined lens for thinking about computation, emergence and the limits
of knowledge in complex systems.
References
[Anderson, 1972] Anderson, P. W. (1972). More is different.Science, 177(4047), 393–396.https:
//doi.org/10.1126/science.177.4047.393
[Chaitin, 2005] Chaitin, G. (2005).Meta Math!: The Quest for Omega. Pantheon.
[Church, 1936] Church, A. (1936). An unsolvable problem of elementary number theory.American
Journal of Mathematics, 58(2), 345–363.https://doi.org/10.2307/2371045
[Cook, 2004] Cook, M. (2004). Universality in elementary cellular automata.Complex Systems,
15(1), 1–40.https://www.complex-systems.com/abstracts/v15_i01_a01/
[Goodfellow et al., 2016]Goodfellow, I., Bengio, Y., & Courville, A. (2016).Deep Learning. MIT
Press.
[Kuhn, 1970] Kuhn, T. S. (1970).The Structure of Scientific Revolutions(2nd ed.). University
of Chicago Press.
[Li & Packard, 1990]Li, W., & Packard, N. H. (1990). The structure of the elementary cellular
automata rule space.Complex Systems, 4, 281–297.
[Noble, 2012] Noble, D. (2012). A theory of biological relativity: No privileged level of causation.
Interface Focus, 2(1), 55–64.https://doi.org/10.1098/rsfs.2011.0067
[Popper, 1959] Popper, K. R. (1959).The Logic of Scientific Discovery. Hutchinson.
[Rice, 1953] Rice, H. G. (1953). Classes of recursively enumerable sets and their decision problems.
Transactions of the American Mathematical Society, 74(2), 358–366.https://doi.org/10.
1090/S0002-9947-1953-0053041-6
[Shalizi & Crutchfield, 2001]Shalizi, C. R., & Crutchfield, J. P. (2001). Computational mechan-
ics: Pattern and prediction, structure and simplicity.Journal of Statistical Physics, 104(3–4),
817–879.https://doi.org/10.1023/A:1010388907793
[Turing, 1936/1937]Turing, A. M. (1936/1937). On computable numbers, with an application
to the Entscheidungsproblem.Proceedings of the London Mathematical Society, s2-42(1),
230–265.https://doi.org/10.1112/plms/s2-42.1.230
[Wolfram, 1984]Wolfram, S. (1984). Universality and complexity in cellular automata.Physica D:
Nonlinear Phenomena, 10(1–2), 1–35.https://doi.org/10.1016/0167-2789(84)90245-8
13

## Page 14

[Wolfram, 2002] Wolfram, S. (2002).A New Kind of Science. Wolfram Media.
14
