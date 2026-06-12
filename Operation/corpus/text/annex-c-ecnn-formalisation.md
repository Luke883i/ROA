---
id: "annex-c-ecnn-formalisation"
title: "Annex C - ECNN Formalisation"
role: "technical_annex"
source_path: "RLA-CRC-ECNN/Annex C - ECNN Formalisation.pdf"
source_raw_url: "https://raw.githubusercontent.com/Luke883i/ROA/main/RLA-CRC-ECNN/Annex%20C%20-%20ECNN%20Formalisation.pdf"
source_sha256: "48338baf4413b5d3bafcad7d00a2f317d3d8ca4ffcd60d4b6c035fc9bcc6ea06"
extraction_status: "success"
---

## Page 1

Annex C
Epistemic Convolutional Neural Networks (ECNN)
Formalisation in a Reticular Local Abstraction Perspective
Gianluca Conte
September 2025
Abstract
This annex presents a formal specification ofEpistemic Convolutional Neural Networks
(ECNN). The aim is to extend classical convolutional networks with an explicit epistemic
channel that can represent explanation, undecidability and contradiction, while remaining
fully Turing–computable and compatible with theCompact Reticular Computability(CRC)
framework introduced in Annex A. The construction is grounded in a multi–level lattice view:
convolutional and pooling layers are interpreted as levels of aReticular Local Abstraction
(RLA), and their non–injective maps are treated as controlled coarse–grainings. On top of
the representation channel, anEpistemic Computational Unit(ECU) and an epistemic head
implement rule–based reasoning: they can accept or reject the network’s own predictions and
explicitly say “unknown” when the evidence is insufficient. In more advanced configurations,
ECUs are realised as orchestrated assemblies of Large Language Models (LLMs) acting as high–
level “epistemic neurons”, each specialised on a deterministic epistemic matrix. The annex
includes: (i) definitions and axioms; (ii) bridging theorems linking CNNs and ECNNs; (iii) an
architectural template with ECU and epistemic head; (iv) training protocols; (v) metrics for
performance, emergence and falsifiability, including layer–wise collapse and emergence indices
compatible with those of Annex A; (vi) a roadmap for minimal case studies. Throughout,
ECNNs are understood asepistemic theories: their internal structures discretise scientific
knowledge about a domain, without claiming to describe its ultimate ontology.
Contents
1 Introduction and Motivation 3
2 Background: CNNs and Reticular Local Abstraction 3
2.1 Classical CNN notation . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3
2.2 Reticular Local Abstraction: minimal recall . . . . . . . . . . . . . . . . . . . . . 4
3 Definition of Epistemic CNN (ECNN) 4
3.1 Layered structure . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4
3.2 ECNNs as CRC instances . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
3.3 Convolution and pooling as lattice maps . . . . . . . . . . . . . . . . . . . . . . . 5
1

## Page 2

3.4 Epistemic layer . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6
3.5 Coherence and coverage . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6
4 Minimal Formalism: Axioms and Bridging Theorems 6
4.1 Axioms . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6
4.2 Bridging theorems . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
5 Architecture of ECNNs in Practice 7
5.1 Representation channel . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
5.2 Epistemic matrix . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
5.3 Epistemic Computational Unit (ECU) . . . . . . . . . . . . . . . . . . . . . . . . 8
5.4 Epistemic head . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8
5.5 LLM–based epistemic neurons . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8
5.6 Practical deterministic regime for LLM-based ECUs . . . . . . . . . . . . . . . . 9
6 Training Protocols 9
6.1 Datasets and labels . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 9
6.2 Loss functions . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 10
7 Metrics of Performance, Emergence and Falsifiability 11
7.1 Standard performance metrics . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 11
7.2 Emergence metrics . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 11
7.3 Layer–wise collapse and emergence indices . . . . . . . . . . . . . . . . . . . . . . 11
7.4 Falsifiability metrics . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 12
7.5 Relation to uncertainty and abstention methods . . . . . . . . . . . . . . . . . . . 12
8 Minimal Case Studies and Roadmap 13
8.1 Minimal application domains . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 13
8.2 Roadmap . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 13
9 Philosophical Conclusions 14
2

## Page 3

1 Introduction and Motivation
Convolutional neural networks (CNNs) have become a standard tool in machine learning, particu-
larly for vision and sequential data (LeCun, Bottou, Bengio, & Haffner, 1998; Goodfellow, Bengio,
& Courville, 2016). In their textbook form, CNNs form a linear chain of layers: convolutions,
pooling, fully connected blocks and an output head. This pipeline emphasises predictive accuracy
and feature compression, but it does not explicitly represent logical contradiction, undecidability,
or explanations in a falsifiable way.
At the same time, multi–level descriptions of complex systems in physics, biology and cognitive
science suggest that emergent properties may depend crucially on non–injective mappings between
levels (Anderson, 1972; Noble, 2012; Godfrey–Smith, 2007). Pooling operations in CNNs, when
viewed through this lens, are not merely engineering tricks: they are coarse–grainings that may
create macro–features not transparently reducible to single microstates.
Epistemic Convolutional Neural Networks (ECNNs) are proposed as a way to integrate these
insights within the RLA/CRC framework of Annex A. Starting from a classical CNN, an ECNN:
• reinterprets convolution and pooling layers as levels of a Reticular Local Abstraction (RLA);
• introduces anepistemic layerthat can encode explanation, contradiction and “I do not
know”;
• in advanced forms, realises high–level neurons as LLM sessions constrained by deterministic
epistemic matrices;
• remains fully Turing–computable and internally falsifiable, yielding a compact reticulum in
the sense of Compact Reticular Computability (CRC).
The purpose of this annex is to provide a compact and self–contained formalisation of ECNNs
suitable as a technical reference and as a bridge between classical deep learning and the reticular
viewpoint.
2 Background: CNNs and Reticular Local Abstraction
2.1 Classical CNN notation
LetX be the input space (e.g. images or token sequences) andY ={1,...,K}a finite set of
labels. A dataset is a finite multiset
D={(xi,yi)}N
i=1⊂X×Y.
A classical CNN defines a functionfθ:X→RK with parametersθ, built as a composition of
layers
fθ=h L◦hL−1◦···◦h1,
wherehℓare convolutions, pooling layers, or fully connected maps. The final softmax layer yields
a categorical distributionpθ(y|x), trained via cross–entropy.
3

## Page 4

2.2 Reticular Local Abstraction: minimal recall
For ECNNs we adopt a minimal lattice formalism that is consistent with Annex A.
Definition 2.1(Reticular Local Abstraction).AReticular Local Abstraction(RLA) is a finite
family of levelsL ={L0,...,Ln}with associated state spacesD(Li), together withtransmission
functions
fi→j:D(L i)−→P
(
D(Lj)
)
,
whereP is the powerset. We writeLi⪯Lj if there exists a finite pathLi→···→Lj formed by
such transmissions.
A mapfi→jmay be injective, quasi–injective, or non–injective over relevant states. Non–
injectivity is interpreted as a controlled loss of micro–level information, enabling emergent
macro–properties.
Definition 2.2(Compact lattice).An RLA iscompact(in the sense of CRC) if:
1. all explanatory and predictive work is internal to its levels (Internal Ontological Autonomy,
IOA);
2. any observational statement about the model’s domain can be expressed as a predicate over
someD(L i)(Epistemic Closure, EC);
3. all transmissions and update rules are Turing–computable (Turing–Computability, TC).
This annex assumes RLA only at this minimal level; no additional machinery from Annex A
is required beyond IOA, EC and TC.
3 Definition of Epistemic CNN (ECNN)
3.1 Layered structure
Definition 3.1(Epistemic CNN).AnEpistemic Convolutional Neural Network(ECNN) is a
tuple
E=
(
L0,...,Ln,L ep,Σ
)
where:
1.L 0,...,Ln are levels corresponding to standard CNN layers: input, convolution, pooling,
dense blocks, etc.;
2.L ep is at least one additional level for the epistemic channel;
3.Σis a finite set of Turing–computable update rules and transmissions.
For eachi<n there is a transmissionfi→i+1:D (Li)→P(D(Li+1))representing the action of
layerL i+1 on states ofLi. There is also an epistemic mapε:D(Ln)→D(Lep).
Intuitively,L0 encodesrawdata, intermediatelevels L1,...,Ln−1implementfeatureextraction
and compression,Ln provides high–level logits or representations, andLep carries epistemic
states (explanations, contradictions, “unknown”).
4

## Page 5

3.2 ECNNs as CRC instances
Proposition 3.1(ECNNs as compact reticula).Let E = (L0,...,Ln,L ep, Σ)be an ECNN with:
•a fixed epistemic matrixMencoded in a finite representation;
• a representation channelBθimplemented by finitely many convolutional, pooling and dense
layers;
• an ECU and epistemic head defined by deterministic algorithms (including any LLM calls
with fixed prompts, temperature, and parsing rules).
If the resulting system satisfies IOA and EC with respect to a chosen epistemic horizon (set of
observables and questions), thenE is a compact RLA reticulum and hence an engineered instance
of Compact Reticular Computability (CRC) in the sense of Annex A.
Sketch. Turing–computability (TC) follows because each component of the ECNN representation
channel and epistemic head is implemented by a finite algorithm operating on finitely representable
reals or finite strings. Internal Ontological Autonomy (IOA) holds if all explanatory entities
and laws for the domain are represented by levelsLi and transmissions inΣ, including the
epistemic matrixM. Epistemic Closure (EC) holds if every observable and epistemic query is
encoded as a predicate over states inD(Li)or D(Lep). Under these conditions, the tuple of
levels and transmissions satisfies the definition of a compact reticulum given in Annex A, and
CRC applies.
When( L0,...,Ln,L ep, Σ)is used under such IOA/EC assumptions, we speak of acompact
ECNN reticulum.
3.3 Convolution and pooling as lattice maps
Definition 3.2(Convolutional level).A convolutional level Lc has a state spaceD(Lc) =
RH×W×Cand a set of kernels{K1,...,KM}. The associated transmissionfc→c+1is defined by
fc→c+1(x) ={Conv(x)},Conv(x)(p) =
∑
δ
K(δ)x(p+δ),
where the map is quasi–injective up to a symmetry groupG (e.g. translations, reflections) on a
discriminative subset of states.
Definition 3.3(Pooling level).A pooling level Lp has state spaceD(Lp)identical in shape to
its input. The transmissionfp→p+1is
fp→p+1(x) ={Pool(x)},Pool(x)(p) = agg{x(q):q∈N(p)},
where agg is max or average over a neighbourhoodN (p). Over relevant states, fp→p+1is
non–injective.
Non–injectivity induced by pooling is the main mechanism through which micro–configurations
can collapse into macro–features.
5

## Page 6

3.4 Epistemic layer
Definition 3.4(Epistemic layer).An ECNN possesses at least one epistemic levelLep with state
spaceD(Lep)and a map ε:D(Ln)→D(Lep). WithinD(Lep)there is a distinguished subset of
statesΞ⊆D(Lep)corresponding to:
•epistemic labels (e.g.accept,reject,unknown);
•structured explanations or rationales;
•explicit contradiction markers.
The epistemic layer is the minimal locus where the network can express its own ignorance or
detect conflict between internal states.
3.5 Coherence and coverage
Theorem 3.1(Classical CNN as a special case).If the levelsL0,...,Ln form a linear chain
without an epistemic layer and all transmissions are single–valued, then the ECNN reduces to a
classical CNN. In this case, non–injectivity is restricted to pooling and there is no meta–epistemic
channel.
Sketch. WithoutLep and with deterministicfi→i+1, the tuple(L0,...,Ln, Σ)induces a standard
function fθ:X→RK by composing all layers. This coincides with a conventional CNN in the
sense of LeCun et al. (1998) and Goodfellow et al. (2016).
4 Minimal Formalism: Axioms and Bridging Theorems
4.1 Axioms
We state four axioms capturing the intended behaviour of ECNNs as multi–level computational
systems. They specialise the general axioms of Annex A to the case of neural architectures.
Axiom 4.1(Computable levels).For each level Li there exists a Turing machine that computes
fi→i+1on any finite representation of states inD(Li). This ensures the absence of non–computable
oracles in the network and implements TC.
Axiom4.2(Propagationofundecidability).If some subset of D(Li)encodes a Turing–undecidable
problem, and iffi→i+1is quasi–injective over that subset, then undecidability is preserved at
Li+1. A downstream level cannot solve an undecidable problem without violating computability.
Axiom 4.3(Non–injectivity and emergence).Iffi→i+1is non–injective over a set of relevant
microstates, then there exists at least one macro–property atLi+1 that does not correspond to a
single microstate atLi. Such a property is calledemergentrelative toLi.
Axiom 4.4(Epistemic closure).In a compact ECNN, every observable phenomenon and every
interaction with the external world is mediated by some level in the lattice or by the epistemic
channel. No explanation or contradiction requires appeal to extra–lattice entities.
Philosophically, these axioms connect computability theory (Church, 1936; Turing, 1936),
emergentism (Anderson, 1972; Godfrey–Smith, 2007) and a Popperian view of falsifiability
(Popper, 1959).
6

## Page 7

4.2 Bridging theorems
Theorem 4.1(Convolution and pooling as lattice maps).In any ECNN satisfying Axioms 1
and 3:
• each convolutional level realises a quasi–injective transmission that preserves undecidability
where present;
• each pooling level realises a non–injective quotient map, implementing the conditions of
Axiom 3 and enabling emergent macro–features.
Sketch. Convolutions are local linear operators; when restricted to relevant patches and up to
symmetries, they do not identify distinct inputs, so they are quasi–injective. Typical pooling
operators, by contrast, map many micro–configurations to the same macrostate, thus satisfying
the non–injectivity condition.
Theorem 4.2(Epistemic layer and falsifiability).Assume Epistemic Closure. If an ECNN
includes a non–trivial epistemic layerLep and a mapε:D(Ln)→D(Lep), then the network can
internally:
1. flag contradictions induced by external challenge sets;
2. represent undecidable situations via explicit “unknown” states.
Sketch. Given any inputx, the state atLn is mapped byεto a state inD(Lep). Epistemic
Closure ensures that every relevant conflict can be expressed at that level. Thus, whenever a
challenge set triggers incompatible requirements (e.g. a pair of images that should not share a
label), the epistemic layer can encode a contradiction or an undecidable state instead of a forced
label.
5 Architecture of ECNNs in Practice
5.1 Representation channel
Let therepresentation channelbe a standard CNN
Bθ:X−→Rd,
obtained by stacking convolutions, pooling operations and possibly dense layers. The vector
z=B θ(x)represents a high–level embedding of the input.
5.2 Epistemic matrix
The epistemic behaviour is governed by anepistemic matrixMcapturing the domain theory.
Definition 5.1(Epistemic matrix).An epistemic matrix is a tuple
M= (E,R,C,P),
where:
7

## Page 8

•Eis a finite set of epistemic entities (concepts, predicates, labels);
•Ris a finite set of inference rules between entities;
•Cis a finite set of coherence constraints (incompatibilities, subsumptions, etc.);
•Pis a set of policies for rejection, abstention and default behaviour.
All elements ofMare given in a representation that can be processed by a Turing machine.
M determines which predictions are allowed, which are contradictory, and when “unknown”
is the appropriate answer.
5.3 Epistemic Computational Unit (ECU)
Definition 5.2(Epistemic Computational Unit).Given a representation z = Bθ(x)and an
epistemic matrixM, anEpistemic Computational Unit(ECU) is a deterministic function
ECUϕ:R d×M−→A,
whereAis a finite space ofepistemic artifacts. Each artifacta∈Aconsists of:
• a primary decisiony⋆∈Y∪{⊥,⊥c}, where⊥denotes “unknown” and⊥c “contradiction”;
•an optional confidence scoreq∈[0,1];
•a structured explanation or rationale, encoded in a finite symbolic format.
The ECU interpretsz as a set of evidential claims, checks them againstM, and decides
whether the evidence suffices for a label, suggests ignorance, or detects a contradiction.
5.4 Epistemic head
The finalepistemic headH ψmaps artifacts into output distributions:
Hψ:A→∆(Y∪{⊥,⊥c}),
where∆(S)denotes the set of probability distributions onS. The overall ECNN is then
Fθ,ϕ,ψ(x) =H ψ
(
ECUϕ(Bθ(x),M)
)
.
5.5 LLM–based epistemic neurons
In advanced configurations, the ECU is implemented as a network of LLM–based “epistemic
neurons”.
Definition 5.3(Epistemic neuron).An epistemic neuron is an LLM instance with parameters
ω, called with:
1. a standardised prompt template,
8

## Page 9

2. a fixed temperature (typicallyT= 0),
3. a request to emit a JSON object with fields constrained byM.
The raw text output is parsed by a deterministic validator that enforces syntactic and semantic
coherence with the matrixM. The resulting structured object is a contribution to the artifacta.
A finite set of such neurons, each specialised on a subdomain ofM, can be orchestrated
by a deterministic controller (itself an ECU component) to produce global artifacts. Although
individual LLMs are powerful black boxes, the overall ECU remains Turing–computable when
the inference protocol (prompts, temperature, parsing) is fixed.
Conceptually, this implements the intuition that “neurons” at high levels of an ECNN can
themselves be epistemic agents, not just scalar units. The emergent behaviour depends on the
topologyof the epistemic network, not on the sheer number of low–level parameters.
5.6 Practical deterministic regime for LLM-based ECUs
In principle, large language models are often deployed in stochastic modes (e.g. with nonzero
temperature or sampling variability). For the purposes of Compact Reticular Computability,
however, ECNNs assume apractical deterministic regimefor any LLM–based ECU:
•the underlying LLM checkpoint (architecture and parameters) is fixed and versioned;
• decoding parameters such as temperature, top-k and top-p are set to values that make the
model effectively deterministic (e.g.T = 0, fixedk and p), and any random seed is held
constant for a given configuration;
• prompt templates, system instructions and few–shot examples used by epistemic neurons
are specified, versioned and treated as part of the epistemic matrixM;
• parsing and validation of LLM outputs (e.g. JSON schemas, type checkers, consistency
checks againstM) are implemented by deterministic procedures.
Under these assumptions, each LLM–based epistemic neuron behaves as a deterministic
transducer from finite input strings (features, prompts, matrixM) to finite structured artifacts.
Real–world deployments may deviate from this idealisation (for instance because of hardware
nondeterminism or changing model checkpoints), but the conceptual model of ECNNs treats
ECUs as Turing–compatible components. Stochasticity or drift in practice is then regarded as
part of the external environment, not as an intrinsic violation of the CRC assumptions.
6 Training Protocols
6.1 Datasets and labels
Training data are extended to include epistemic supervision. Each datum has the form
(xi,yi,ei),
9

## Page 10

where yi∈Yis a standard label andei∈{certain,uncertain,contradictory}is a meta–label.
Optionally, a structured target explanation can be provided for a subset of points.
Additionalchallenge setsΩare defined to test falsifiability. We write:
• Ω CP for the set ofcontradictory pairs: pairs(x,x′)such that assigning the same label
would violate constraints inM;
• Ω UT for the set ofundecidability triggers: inputs engineered so that no consistent label in
Yis justifiable fromM;
• Ω SA forsemantic adversaries: perturbations that preserve low–level statistics but invert or
scramble semantic content.
6.2 Loss functions
A generic training objective combines standard classification, epistemic penalties and explanation
regularisation:
L=L cls +λunkLunk +λconLcon +λexpLexp.
Classification loss.On examples marked as “certain”,Lcls is standard cross–entropy:
Lcls =−
∑
i∈Icert
logFθ,ϕ,ψ(xi)yi,
whereI cert is the set of indices withei =certain.
Unknown penalty.On “uncertain” examples, the network is rewarded for abstaining:
Lunk =−
∑
i∈Iunc
logFθ,ϕ,ψ(xi)⊥,
whereI unc is the set of indices withei =uncertain.
Contradiction penalty.On contradictory pairs( x,x′)inΩ CP the loss penalises unflagged
contradictions:
Lcon =
∑
(x,x′)∈ΩCP
1
[
ECNN does not output⊥c
]
·α,
for some constantα>0. Flagging a contradiction (via⊥c) is treated as correct behaviour.
Explanation regularisation.Where ground–truth explanationsEi are available, a penalty
encourages artifactsai to match them (e.g. via token–level cross–entropy or symbolic distance).
Otherwise, a complexity term discourages gratuitous verbosity.
10

## Page 11

7 Metrics of Performance, Emergence and Falsifiability
7.1 Standard performance metrics
Besides accuracy, precision and recall, calibration measures such as expected calibration error
(ECE) assess the reliability of probabilities fromFθ,ϕ,ψ.
7.2 Emergence metrics
To track emergent behaviour we introduce:
• Feature compression ratio: the ratio of input dimension to the dimension ofz =Bθ(x),
combined with information–theoretic measures when available.
• Representation collapse index: the average pairwise cosine similarity between embed-
dings of distinct classes; high values may indicate loss of discriminative microstructure.
• Gradient collapse instability: the mean norm of gradients at critical convolution and
pooling layers across training; persistent growth resembles the amplification of self–organised
macroscopic patterns (Carpenter et al., 2011).
These indicators mirror early–warning signals for regime shifts in complex systems (Scheffer
et al., 2009).
7.3 Layer–wise collapse and emergence indices
To connect ECNNs quantitatively with the collapse and emergence diagnostics of Annex A, we
define layer–wise adaptations of thecoefficient of collapseand theindex of emergence.
Let Li and Lj be two consecutive levels in the representation channel (e.g. a pooling layer
followed by a convolutional or dense layer), with transmissionfi→j. LetS⊂D(Li)be a finite
reference set of states, sampled from activations of a validation set.
Coefficient of collapse.The empirical coefficient of collapse fromLi toL j is
CC (ECNN)
i→j (S) := 1−
⏐⏐fi→j(S)
⏐⏐
|S|∈[0,1],
where fi→j(S)is the set of distinct outputs observed inD(Lj)for inputs inS (up to a chosen
numerical tolerance). A value near zero indicates near–injective behaviour onS, while a value
close to one indicates strong activation collapse. This is a layer–wise analogue of the coefficient
defined in Annex A.
Index of emergence.Let Q be a finite family of candidate macro–properties (e.g. cluster
assignments, linear probe classifications, or logical predicates over embeddings) defined onD(Lj).
Each propertyQ∈Qcan be tested for definability as a predicate onD(Li), using the expressive
resources of the models available atLi. The empirical index of emergence is
IE (ECNN)
i→j := #{Q∈Q:Qis computable atLj and not definable onD(Li)}
|Q| ∈[0,1].
11

## Page 12

A high value indicates that many behaviourally relevant properties only appear clearly at the
higher layer, in line with the notion of emergent macro–features in Annex A.
Reticular irreducibility.At the network scale, one can construct a causal graphGt over
layers and units (or feature groups) and estimate a reticular irreducibility indexRIR over a
training horizonT in analogy with Annex A, by computing normalised minimum vertex cuts
that separate input and output units across time. While detailed definitions are left to Annex D,
the key idea is that largeRIR signals a structurally irreducible lattice of computations across
layers, compatible with Wolfram–style computational irreducibility.
These indices make it possible to compare ECNNs with other CRC reticula using a common
diagnostic language.
7.4 Falsifiability metrics
Falsifiability requires that the ECNN can fail in observable ways when confronted with challenge
sets.
•Contradiction rate(CR). On a set of contradictory pairsΩCP,
CR = #{unflagged contradictions}
#Ω CP
.
Lower values indicate better detection of contradictions.
• Undecidability miss rate. On undecidability triggersΩUT, the fraction of cases where
the network returns a definite label instead of⊥.
• Epistemic coverage. The proportion of real–world inputs for which the ECNN emits a
determinate label (not⊥) while remaining within the bounds ofM.
• Explanation coherence. Using logical or statistical checks, the fraction of explanations
that satisfy the coherence constraintsCinM.
Together, these metrics quantify how well the ECNN operationalises Popperian falsifiability
internally.
7.5 Relation to uncertainty and abstention methods
ECNNs do not replace existing approaches to uncertainty quantification and abstention; rather,
they provide a reticular architecture and an explicit epistemic channel in which such methods
can be embedded. Table 1 summarises the relation.
In this sense, ECNNs are best understood as a structural generalisation of existing uncertainty–
aware classifiers: the representation channel behaves like a conventional CNN (possibly Bayesian
or ensemble–based), while the epistemic channelLep hosts explicit rules, policies and challenge–
set responses that turn uncertainty summaries into falsifiable epistemic states (y,⊥,⊥c) with
explanations.
12

## Page 13

Method family Integration in ECNN epistemic channelL ep
Bayesian / deep ensembles Posterior variances, ensemble disagreement scores or predic-
tive entropy are computed fromBθ(or from an ensemble of
representation channels) and passed as inputs to the ECU.
The epistemic matrixM can include rules such as “abstain if
ensemble disagreement> threshold”, and the epistemic head
Hψmaps these signals to⊥or to down–weighted label distri-
butions.
Selective classification / re-
ject option
Classical reject–option schemes (e.g. Chow’s rule) provide
thresholds on confidence or risk. In an ECNN, these thresholds
become policiesP insideM and are implemented explicitly in
Lep: the ECU checks whether the current evidence satisfies
the accept region; if not, it outputs⊥(unknown) or⊥c (con-
tradiction) instead of forcing a label.
Conformal prediction Conformal p–values or prediction sets are computed from the
base representation channel and treated as epistemic signals.
The ECU incorporates them into its artifact (e.g. by anno-
tating labels with calibrated coverage guarantees), and the
epistemic head enforces that only labels supported by valid
conformal sets are asserted, while the others trigger abstention
or contradiction markers.
Table 1: Schematic relation between standard uncertainty / abstention methods and the ECNN
epistemic channelL ep. ECNNs provide a reticular structure and an explicit locus for epistemic
decisions, rather than a new “miraculous” uncertainty algorithm.
8 Minimal Case Studies and Roadmap
8.1 Minimal application domains
The formalism is intended to be domain–agnostic. Minimal testbeds include:
• Image classification with abstention: an ECNN trained on a restricted class set with
challenge images outside its domain;
• Textual entailment with contradictions: inputs are sentence pairs; labels areentails,
contradicts,unknown; LLM–based neurons specialise in linguistic phenomena;
• Toy scientific theories: small symbolic models (e.g. cellular automata or toy ecology)
where rules inM are exactly known, allowing precise tests of emergence and undecidability.
8.2 Roadmap
Future directions suggested by the formalism include:
1. Multi–agent lattices: several ECNN modules exchange epistemic artifacts and negotiate
contradictions, forming higher–order lattices.
2. Meta–learning of contradictions: training ECNNs not only to avoid inconsistencies
but to learn typical “shapes” of paradoxical inputs and recognise them.
13

## Page 14

3. Neuromorphic optimisation: mapping ECNN components to hardware that supports
explicit abstention and contradiction states, reducing latency and power.
9 Philosophical Conclusions
ECNNs treat undecidability, emergence and ignorance as first–class computational citizens.
Rather than hiding paradoxes in opaque numerical failures, the epistemic channel forces the
network toadmitwhen its knowledge is inadequate or internally inconsistent. In this sense:
• they realise Anderson’s insight that “more is different” (Anderson, 1972) within a precise
computational framework;
• they resonate with Noble’s idea of “no privileged level of causation” (Noble, 2012), since
emergent properties arise from non–injective mappings across levels;
• they embed Popperian falsifiability in the network’s own structure, rather than treating it
as an external philosophical requirement.
When ECUs are built from LLM–based epistemic neurons, the resulting systems acquire a
layered form of meta–reasoning: each neuron is itself a bounded reasoner obeying the matrix
M, and the overall topology determines what kinds of epistemic states can emerge. This points
toward a view of artificial cognition in whichtopology, rather than raw scale, becomes the key
variable for understanding complex behaviour.
References
[1] Anderson, P. W. (1972). More is different.Science, 177(4047), 393–396.
[2] Carpenter, S. R., Cole, J. J., Pace, M. L., Batt, R. D., Brock, W. A., Cline, T. J., ...,
& Weidel, B. C. (2011). Early warnings of regime shifts: A whole–ecosystem experiment.
Science, 332(6033), 1079–1082.
[3] Church, A. (1936). An unsolvable problem of elementary number theory.American Journal
of Mathematics, 58(2), 345–363.
[4] Godfrey–Smith, P. (2007). Information in biology and the philosophy of emergence.Biology
and Philosophy, 22(1), 51–61.
[5] Goodfellow, I., Bengio, Y., & Courville, A. (2016).Deep Learning. MIT Press.
[6] Kuhn, T. S. (1970).The Structure of Scientific Revolutions(2nd ed.). University of Chicago
Press.
[7] LeCun, Y., Bottou, L., Bengio, Y., & Haffner, P. (1998). Gradient–based learning applied
to document recognition.Proceedings of the IEEE, 86(11), 2278–2324.
14

## Page 15

[8] Miller, T., Howe, P., & Sonenberg, L. (2019). Explainable AI: Beware of inmates running
the asylum.Proceedings of the AAAI Conference on Artificial Intelligence, 33, 4824–4831.
[9] Morin, E. (2008).On Complexity. Hampton Press.
[10] Noble, D. (2012). A theory of biological relativity: No privileged level of causation.Interface
Focus, 2(1), 55–64.
[11] Popper, K. R. (1959).The Logic of Scientific Discovery. Hutchinson.
[12] Richards, C. L., Alonso, C., Becker, C., Bossdorf, O., Bucher, E., Colomé–Tatché, M., ...,
& Pigliucci, M. (2016). Ecological plant epigenetics: Evidence from model and non–model
species.Ecology Letters, 19(7), 775–792.
[13] Scheffer, M., Bascompte, J., Brock, W., Brovkin, V., Carpenter, S. R., Dakos, V., ..., &
Sugihara, G. (2009). Early–warning signals for critical transitions.Nature, 461(7260), 53–59.
[14] Turing, A. M. (1936). On computable numbers, with an application to the Entscheidungsprob-
lem.Proceedings of the London Mathematical Society, 2(42), 230–265.
[15] von Bertalanffy, L. (1968).General System Theory: Foundations, Development, Applications.
George Braziller.
15
