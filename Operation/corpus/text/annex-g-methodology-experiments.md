---
id: "annex-g-methodology-experiments"
title: "Annex G - Methodology Experiments"
role: "methodology_annex"
source_path: "RLA-CRC-ECNN/Annex G - Methodology Experiments.pdf"
source_raw_url: "https://raw.githubusercontent.com/Luke883i/ROA/main/RLA-CRC-ECNN/Annex%20G%20-%20Methodology%20Experiments.pdf"
source_sha256: "230164c306f410fe0110fcc0a1875d3d577a43b9f47cae10df13059cfba97946"
extraction_status: "success"
---

## Page 1

Annex G
Epistemic Meta-Controller for Ethics and Compliance:
Formalisation of theiKantPattern in the RLA/CRC/ECNN
Framework
Gianluca Conte
Independent Researcher
November 24, 2025
Contents
1 Introduction and Objectives 2
2 Normative Layers: Ethics and Compliance 3
2.1 Three-Level Normative Picture . . . . . . . . . . . . . . . . . . . . . . . . . . 3
2.2 Role ofiKantin This Picture . . . . . . . . . . . . . . . . . . . . . . . . . . . 4
3 Formal Setting 4
3.1 Base System for Ethics and Compliance . . . . . . . . . . . . . . . . . . . . . 4
3.2 Meta-Controller Task: Case-Level and System-Level Outputs . . . . . . . . . 4
4 Epistemic History and Path Dependence 5
4.1 Epistemic HistoryH. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
4.2 Path Dependence . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6
5 State Decomposition: World, Self, Norms 6
5.1 Triple Decomposition . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6
5.2 World-ModelW. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6
5.3 Self-ModelS. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
5.4 Normative KernelN(Ethics and Compliance) . . . . . . . . . . . . . . . . . . 7
5.5 Kant-Inspired Constraints WithinN. . . . . . . . . . . . . . . . . . . . . . . 8
5.6 Meta-Normative Constraints on Updates toN. . . . . . . . . . . . . . . . . 8
6 Transition and Decision Functions 9
6.1 Transition FunctionT. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 9
6.2 Global Case-Level Decision FunctionG. . . . . . . . . . . . . . . . . . . . . 9
6.3 System-Level Critical Output FunctionG crit . . . . . . . . . . . . . . . . . . . 10
6.4 Interaction Step . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 10
7 Structural Desiderata 10
7.1 Normative Soundness . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 10
7.2 Ethics-Over-Compliance Awareness . . . . . . . . . . . . . . . . . . . . . . . . 11
7.3 Cross-Domain Coherence . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 11
1

## Page 2

8 Metacognition: Operational Definitions 11
8.1 General Notion . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 11
8.2 Metacognitive Monitoring . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 11
8.3 Metacognitive Self-Evaluation . . . . . . . . . . . . . . . . . . . . . . . . . . . 12
8.4 Metacognitive Control . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 12
8.5 Cross-Domain Metacognitive Coherence . . . . . . . . . . . . . . . . . . . . . 12
9 Argumentative Structure and Belief/Policy Separation 13
10 Evaluation Framework and Hypotheses 13
10.1 Challenge Suites . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 13
10.2 Metrics . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 13
10.3 Hypotheses . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 14
11 Interventions, Critical Outputs and Governance 14
11.1 Observations vs Interventions . . . . . . . . . . . . . . . . . . . . . . . . . . . 14
11.2 System-Level Critical OutputsAcrit . . . . . . . . . . . . . . . . . . . . . . . . 15
11.3 Governance Contract . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 15
12 Minimal Instantiation Example 16
12.1 Scope . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 16
12.2 Concrete Structures . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 16
12.3 Illustrative Behaviour . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 17
13 Engineering Feasibility and Limitations 17
13.1 Feasibility . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 17
13.2 Limitations . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 18
13.3 On Consciousness and Anthropomorphism . . . . . . . . . . . . . . . . . . . . 18
14 Summary 18
1 Introduction and Objectives
This Annex introduces and formalises anepistemic meta-controllerpattern, called theiKant
pattern, designed to operate on top of the RLA/CRC/ECNN infrastructure in domains
where ethical and compliance decisions are central.
We explicitly adopt the following conceptual hierarchy:
•Ethicsdenotes the broad space of normative considerations about whatoughtto be done,
including moral principles, values, duties and virtues (e.g. fairness, non-exploitation,
respect for persons, responsibility towards stakeholders).
•Complianceis treated as aproper subsetof ethics: it concerns the satisfaction ofcod-
ifiednorms (laws, regulations, binding standards, internal policies) that instantiate or
approximate some ethical constraints in a given jurisdiction and organisational context.
In this sense, every compliance requirement is also an ethical constraint (though often re-
duced and operationalised), while not every ethical concern is captured by formal compliance
rules. TheiKantpattern is designed to reason within this layered normative space.
The specific objectives of this Annex are:
2

## Page 3

1.Conceptual robustness.To define theiKantmeta-controller using standard system-
modelling notions: an explicit state space, transition function and decision function, with
clear structural properties. The definition should be minimal but sufficiently precise to
support formal analysis.
2.Research design robustness.To embediKantin a falsifiable research programme: we
specify metrics, hypotheses and comparative protocols (with/withoutiKant) for ethics
and compliance tasks.
3.Operational metacognition.To provide domain-specific, operational definitions of
“metacognition” in ethics/compliance, understood as:
•metacognitive monitoring (tracking epistemic behaviour),
•metacognitive self-evaluation (estimating reliability and limits),
•metacognitive control (adapting policies),
•cross-domain normative coherence (ethics⊃compliance).
All of these are defined as properties of explicit state variables and computable update
rules, without phenomenological claims.
The nameiKantis a compact reference to the figure of Immanuel Kant understood as a
collective archetypeof rational and moral agency. In this Annex, however,iKantdenotes a
purely computational pattern.
2 Normative Layers: Ethics and Compliance
2.1 Three-Level Normative Picture
For the purposes of this Annex, we consider a simplified three-level normative structure:
N1. Ethical layer(broadest): includes general moral principles and values, such as:
•fairness and non-discrimination;
•respect for autonomy and dignity;
•prevention of harm and abuse;
•transparency and honesty;
•intergenerational responsibility, sustainability, and similar concerns.
N2. Compliance layer(subset of ethics): includes codified norms that instantiate some
ethical requirements in a given legal and organisational context:
•laws (e.g. D. Lgs. 231/01, GDPR, NIS2, DORA, SOX, FCPA, ...);
•regulations and regulatory technical standards;
•binding guidelines, codes of conduct and internal policies.
N3. Implementation layer: includes concrete organisational structures, processes and con-
trols (e.g. segregation of duties, access control, incident response procedures) that at-
tempt to operationalise compliance, and thus some ethical constraints.
Ethicalassessmentcan, inprinciple, questiontheadequacyofcompliancerulesandimple-
mentations themselves (e.g. a practice may be legally compliant but ethically problematic).
Compliance assessment is more restricted: it asks whether specific codified requirements are
met, relative to a fixed normative frame.
3

## Page 4

2.2 Role ofiKantin This Picture
TheiKantmeta-controller is designed to:
•integrate evidence and assessments from multiple domains (ethics, multiple compliance
regimes) modelled as CRCs with their own UCEs;
•maintain explicit state about:
–the environment (organisational and normative) at both ethical and compliance levels;
–the epistemic profile of the base system (strengths, weaknesses, systematic biases);
–the normative constraints spanning ethics and compliance;
•produce global artefacts that respect hard compliance constraints and, where modelled,
ethical principles that may go beyond minimum legal requirements.
We now proceed to a formal specification.
3 Formal Setting
3.1 Base System for Ethics and Compliance
We consider a base system composed of:
•a finite set of compliance domainsDcomp (e.g. 231, GDPR, NIS2, DORA, SOX, FCPA);
•a finite set of ethical sub-domainsD eth (e.g. fairness, non-exploitation, environmental
responsibility);
•the unionD=D comp∪Deth.
For eachd∈D, there exists a UCEUd that orchestrates one or more ECUs specialised
in domaind.
We denote byCa finite set of cases (transactions, initiatives, projects, incidents). For
each casec∈Cand domaind∈Dc⊆D, the UCEUd produces an epistemic artefact:
ad(c) = (y∗
d(c),q d(c),s d(c),R d(c),Π d(c))∈A,
whereAis the artefact space defined in Annex E.
We denote the multiset of local artefacts for casecby:
Aloc(c) ={ad(c)}d∈Dc∈Aloc.
3.2 Meta-Controller Task: Case-Level and System-Level Outputs
The meta-controlleriKantis an additional component that:
•maintains an internal statex t updated over discrete time stepst;
•maintains an epistemic historyH t of past cases and artefacts (Section 4);
•receives local artefactsA loc(ct)for the current casec t;
•produces:
4

## Page 5

–aglobalcase-levelartefactA glob(ct)∈Aglob, summarisingtheglobalethical–compliance
stance onc t;
–and, at selected intervals, asystem-level criticalartefactA crit,t∈Acrit, summarising
meta-level diagnostics on the behaviour of the system over time.
Formally, we define:
iKant= (X,H,A loc,A glob,A crit,T,J,G,G crit),
where:
•Xis the internal state space;
•His the space of epistemic histories;
•T:X×A loc×H→Xis the state transition function;
•J:H×A loc×Aglob→His the history update function;
•G:X×A loc→Aglob is the case-level decision function;
•G crit :X×H→Acrit is the system-level critical output function.
We impose meta-level CRC requirements:
(R1)Input–outputadequacy.A loc,A glob andA crit aresufficientinterfacesbetweendomain-
level assessments, global ethical–compliance decisions, and system-level diagnostics.
(R2)Epistemic closure.All epistemically relevant information for case-level decisions is
encoded in(x t,H t,A loc(ct)), and all information for system-level diagnostics is encoded
in(x t,H t).
(R3)Turing-compatibility.T,J,GandG crit arecomputable, finitelyspecifiedandresource-
bounded for any finite interaction horizon.
4 Epistemic History and Path Dependence
4.1 Epistemic HistoryH
The epistemic historyHt at timetis a finite sequence of tuples:
Ht =
{
(ci,A loc(ci),A glob(ci),y†(ci),context i)
}t
i=1,
where, when available,y†(ci)denotes ground truth or expert labels, and contexti captures
relevant contextual features (e.g. prevailing normative configurations, organisational events).
The history is updated by a computable function:
Ht+1 =J
(
Ht,A loc(ct),A glob(ct)
)
,
typically by appending a new record and possibly pruning or compressing older information.
5

## Page 6

4.2 Path Dependence
While the state transitionTcan be chosen to be Markovian in the pair(xt,H t), the presence
ofH t allows for genuine path dependence:
•W t may incorporate cumulative effects of past decisions (e.g. systematic exposure of
certain stakeholders);
•S t may encode performance statistics and drift over time;
•N t may be updated in light of recurrent patterns (e.g. repeated occurrence of “compliant
but ethically problematic” cases).
In this sense,iKantis not only reactive to the current case, but also shaped by its own
history of decisions and their outcomes.
5 State Decomposition: World, Self, Norms
5.1 Triple Decomposition
We decompose:
x= (W,S,N)∈XW×XS×XN =X,
where:
•W: world-model of organisational and normative environment;
•S: self-model of the epistemic infrastructure (strengths, weaknesses, biases);
•N: normative kernel unifying ethics and compliance.
Each component is itself the state of a compact sub-reticulum.
For conceptual clarity, we distinguish within each component:
•abeliefsub-part (describing how the world/system/norms are currently represented);
•apolicysub-part(describinghowdecisionsorupdatesshouldbemadegiventhosebeliefs).
This belief/policy separation will be important in Section 11.
5.2 World-ModelW
The world-modelWcaptures, at minimum:
•entities:
–organisational units, processes, assets, data types, roles;
–stakeholders and groups potentially impacted by decisions;
–legal instruments and ethical principles as abstract nodes;
•relations:
–“processpuses data typed”;
–“controlcmitigates riskrin processp”;
–“normnapplies to processpor datad”;
6

## Page 7

–“stakeholder groupgis affected by actiona”.
A convenient representation is a labelled directed graph:
W= (V W,E W,λW ),
whereV W is a finite set of nodes,EW a finite set of edges andλW a labelling function.
5.3 Self-ModelS
The self-modelScaptures information about:
•componentsC S (ECNNs, ECUs, UCEs, pipelines);
•performance indicators:
–error rates and calibration errors;
–unknown and contradiction rates;
–domain coverage and blind spots;
•current policies:
–thresholds for unknown and escalation;
–trust weights per component, domain or region of the case space.
A simple structure is:
S=
(
CS,ρ,θS
)
,
whereρ:C S→[0,1]encodes reliability scores andθS collects thresholds and policy param-
eters.
5.4 Normative KernelN(Ethics and Compliance)
The normative kernelNunifies ethical and compliance constraints.
We distinguish three finite sets of formulas:
•Φ comp: compliance formulas (laws, regulations, policies);
•Φ eth: ethical formulas not reducible to compliance (e.g. fairness constraints beyond legal
minimum);
•Φ org: organisational norms (mission, values, strategic commitments).
We define:
Φ = Φ comp∪Φeth∪Φorg,
and a satisfaction relation:
|=N⊆(XW×XS×Aglob)×Φ.
Thus:
N= (Φ comp,Φ eth,Φ org,|=N)∈XN.
We assume that:
•compliance constraints inΦ comp are treated ashardconstraints (violations are unaccept-
able unless explicitly modelled as controlled non-compliance);
7

## Page 8

•ethical constraints inΦ eth may be soft or prioritised;
•organisational norms inΦ org encode commitments that may go beyond minimum com-
pliance.
This reflects the idea that ethics strictly contains compliance, and that the system can
reason about all three layers simultaneously.
5.5 Kant-Inspired Constraints WithinN
Within the ethical layer, we single out a family ofKant-inspiredconstraints, intended as
structural approximations of the categorical imperative and of the idea that persons should
be treated as ends in themselves.
We introduce two finite sets:
Φ hard
CI ⊆Φeth,Φ soft
CI ⊆Φeth,
where:
•Φ hard
CI containsnon-negotiableconstraints capturing minimal requirements of:
–non-coercion and absence of deliberate deception towards stakeholders;
–avoidance of systematic exploitation of structural vulnerabilities without effective
remedies;
–minimal conditions of informed participation, voice and exit for affected parties.
•Φ soft
CI containsoptimisingordiagnosticconstraints that approximate universalizability:
–they penalise policies that, if applied systematically in contexts represented inW,
would generate patterns of self-undermining practices (e.g. erosion of trust necessary
for the practice itself);
–they highlight patterns where specific groups bear disproportionate burdens across the
historyH t.
We stress that these constraintsdo notamount to a full computational implementation
of the categorical imperative. Rather, they provide structured, computable side-constraints
and diagnostic criteria inspired by its central themes (universalizability, humanity as end,
“kingdom of ends”).
5.6 Meta-Normative Constraints on Updates toN
Not all parts ofNare equally modifiable. We introduce a set ofmeta-normsΦ meta that
govern howNitself may be updated.
Intuitively:
•ahard coreofΦ comp and ofΦ hard
CI is immutable byiKant(e.g. statutory legal obligations
and minimal non-exploitation constraints);
•priorities, weights and certain soft ethical or organisational rules, includingΦsoft
CI , may be
adjusted within specified bounds;
•updates toNshould obey a principle of minimal change, given evidence fromHt.
8

## Page 9

Formally, we can represent meta-norms as constraints onUN:
UN :X N×XW×XS×H→XN,
such that, for allN,W,S,Hand allφ∈Φ meta, the transition fromNtoU N(N,W,S,H)
satisfiesφ.
Meta-norms can, for example, enforce:
•invariance ofΦ hard
comp⊆Φcomp and ofΦ hard
CI ;
•monotonicstrengthening(butnotweakening)ofcertainethicalconstraintswhenrepeated
harms are observed inHt;
•bounds on how much relative priorities may shift in a given time horizon.
6 Transition and Decision Functions
6.1 Transition FunctionT
We decompose:
T
(
(W,S,N),A loc,H
)
=
(
UW (W,A loc,N,H), U S(S,A loc,H), UN(N,W,S,H)
)
,
where:
•U W :X W×Aloc×XN×H→XW updates the world-model using new evidence, normative
constraints and selected aspects of the history;
•U S :X S×Aloc×H→XS updates the self-model based on observed epistemic behaviour
over time;
•U N :X N×XW×XS×H→XN updates the normative kernel within the limits imposed
by meta-norms, ensuring in particular thatΦhard
comp andΦ hard
CI remain invariant.
6.2 Global Case-Level Decision FunctionG
The global decision function:
G:X×Aloc→Aglob
produces a global artefact for the current case. We assume that:
•A glob has the same basic structure asA, but labels may refer to global ethical–compliance
statuses (e.g. approve, approve with conditions, block, escalate);
•Gdepends non-trivially on all ofW,SandN:
–Wto understand how the case fits into the overall environment and stakeholders;
–Sto account for known limitations and reliability of components;
–Nto enforce compliance and, where possible, broader ethical constraints, including
those inΦ hard
CI andΦ soft
CI .
9

## Page 10

6.3 System-Level Critical Output FunctionG crit
The critical output function:
Gcrit :X×H→Acrit
produces system-level artefacts summarising patterns in the history and suggesting potential
revisions of policies or norms.
Typical components ofAcrit include:
•statistics on overconfidence, unknowns, contradictions and escalations;
•identification of domains or processes with persistent “compliant but ethically problem-
atic” behaviour;
•patterns indicating that certain stakeholder groups are systematically treated as mere
means (violatingΦ hard
CI orΦ soft
CI );
•proposed adjustments to soft constraints or priorities inN(withinΦ meta);
•recommendations for human review of specific norms, controls or processes.
In this sense,Goperates at the level of individual cases, whileGcrit operates at the level
of the system as a whole.
6.4 Interaction Step
TheiKantinteraction step for a single casec t can be summarised as follows.
Algorithm 1iKantinteraction step (case-level and history update)
Require:current statex t = (Wt,S t,N t), historyH t, local artefactsAloc(ct)
1:x t+1←T
(
xt,A loc(ct),H t
)
2:A glob(ct)←G
(
xt+1,A loc(ct)
)
3:H t+1←J
(
Ht,A loc(ct),A glob(ct)
)
4:return(x t+1,H t+1,A glob(ct))
System-level critical outputsAcrit,tare produced by applyingGcrit(xt,H t)at appropriate
intervals (e.g. periodically or when selected conditions are met).
7 Structural Desiderata
We do not attempt fully general theorems, but we state properties that concrete implemen-
tations may aim to approximate.
7.1 Normative Soundness
LetΦ hard
comp⊆Φcomp be the set of non-negotiable compliance constraints. We say thatiKant
isnormatively soundw.r.t. compliance if for all statesx= (W,S,N)and allA loc:
∀φ∈Φhard
comp :
(
W,S,G(x,A loc)
)
|=N φ.
This captures the requirement that global decisions must not violate hard legal or regu-
latory obligations.
10

## Page 11

7.2 Ethics-Over-Compliance Awareness
Given that ethics strictly contains compliance, we may require thatiKantbe capable of
distinguishing at least three regimes for a casec:
•(E1) compliant and ethically acceptable;
•(E2) compliant but ethically problematic (Φeth orΦ org violated, including violations of
Φ hard
CI orΦ soft
CI );
•(E3) non-compliant and ethically problematic.
A desirable property is thatGdoes not systematically conflate (E1) and (E2), but can
emit different global labels or rationales.
7.3 Cross-Domain Coherence
We say thatiKantexhibitscross-domain coherenceif, when(W,S,N)indicate that local
outputs from different domains are jointly inconsistent or ethically problematic,G:
•avoids a simple accept decision;
•either:
–emits unknown or contradiction at global level;
–or triggers escalation with appropriate rationale.
This formalises the idea that ethical, compliance and organisational norms interact and
must be considered together.
8 Metacognition: Operational Definitions
8.1 General Notion
In this Annex,metacognitiondenotes a class of computable mechanisms by which the system:
•monitors its own epistemic behaviour over time;
•evaluates the reliability, bias and coverage of its components;
•adapts its decision policies in response to this self-knowledge;
•reasons about coherence and conflict across ethical and compliance domains.
These functions are implemented viaS,US,U N,G,G crit and the dependence onHt.
8.2 Metacognitive Monitoring
Definition (Metacognitive monitoring).Consider a sequence of cases(c t)T
t=1. For
each componentu(ECNN, ECU, UCE), leta u(ct)be its output onc t. A system exhibits
metacognitive monitoring ifScontains, for eachu, state variables of the form:
perfu(t) =f perf
(
au(c1),...,a u(ct),ground truth or expert labels
)
,
wheref perf isacomputablefunction(e.g.empiricalerror, calibrationerror, unknown/contradiction
frequency), and ifUS updates these variables at each step, using information fromHt when
available.
11

## Page 12

8.3 Metacognitive Self-Evaluation
Definition(Metacognitiveself-evaluation).Asystemexhibitsmetacognitiveself-evaluation
if, for each componentu,Scontains a reliability score:
ρ(u) =geval
(
perfu,context
)
∈[0,1],
withg eval computable, and:
•U S updatesρ(u)over time;
•Gusesρ(u)in aggregating local artefacts, e.g. by:
–down-weighting low-reliability sources;
–increasingunknownorescalationwhenhigh-stakesdecisionsrelyonlow-ρcomponents.
8.4 Metacognitive Control
Definition (Metacognitive control).A system exhibits metacognitive control if there
exist policy parametersθS and/or normative priorities inNsuch that:
1.θS and parts ofNare updated byU S andU N as functions of performance history and
violation patterns (i.e. functions ofHt);
2.Gdepends on currentθS andNsuch that:
•in regions where the system has historically under-performed,Gbecomes more con-
servative (more unknown, more escalation);
•in regions where performance is robust,Gcan be more assertive.
This corresponds to policy adaptation based on self-knowledge.
8.5 Cross-Domain Metacognitive Coherence
Definition (Cross-domain metacognitive coherence).LetA loc(c)be the set of local
artefacts for casecand let(W,S,N)be the current state. We say thatiKantexhibits
cross-domain metacognitive coherence if:
•Gexamines the joint configuration of local outputs (ethics and compliance) and their
reliabilities;
•whenNindicates that no ethically acceptable and compliant global decision can be made
with high confidence,Gavoids confident acceptance and instead:
–outputs unknown or contradiction, or
–enforces escalation.
This is metacognition because the system reasons about its own epistemic limitations
and about global normative coherence.
12

## Page 13

9 Argumentative Structure and Belief/Policy Separation
In Annex E, epistemic artefacts have components(y∗,q,s,R,Π). For the purposes of meta-
level reasoning, it is useful to refine:
•Ras anargumentative structure, e.g. a graph of premises, intermediate conclusions and
supporting evidence (in the spirit of abstract argumentation frameworks);
•Πas apolicy recommendationor action profile conditioned on the artefact.
WithiniKant, this supports:
•a clearer distinction between:
–beliefs(structured inWand in the argumentative content ofR);
–policies(encoded inθS, parts ofN, and inΠ);
•meta-level analysis of:
–whether argumentsRare systematically weak, circular or biased in certain domains;
–whether policiesΠare systematically misaligned with ethical or organisational norms,
even when beliefs are accurate.
System-level critical outputsAcrit can then include diagnostics not only on quantitative
performance, but also on the quality of argumentation and on mismatches between beliefs
and policies.
10 Evaluation Framework and Hypotheses
10.1 Challenge Suites
We employ Popper–χ-style challenge suites tailored to ethical and compliance tasks. A
challenge suite includes:
•a setC test of cases with:
–domain-level labelsy†
d(c)(compliance and ethical judgements);
–global labelsy†
glob(c), including whether escalation or unknown is appropriate;
•a configuration specifying:
–which UCEs are active;
–whetheriKantis used or not;
–which metrics are computed.
10.2 Metrics
We consider, among others:
Overconfidence.For a given confidence thresholdτand a systemX∈{baseline,iKant},
define:
OC(X)(τ) = 1
|Ctest|
∑
c∈Ctest
1
[
y(X)
glob(c)̸=y†
glob(c)∧q(X)
glob(c)≥τ
]
.
13

## Page 14

Unknown and escalation.LetC hard⊆Ctest be cases judged by experts as genuinely hard
or underdetermined. For a systemX, define:
UNK(X) = 1
|Chard|
∑
c∈Chard
1
[
s(X)
glob(c) =unknown
]
,
and similar metrics for contradiction and escalation quality.
Ethics-over-compliance discrimination.We can also measure how often the system
distinguishesbetween(E1)and(E2)regimes(compliantvscompliant-but-ethically-problematic),
given expert ground truth.
System-Level Diagnostics.System-level critical artefactsA crit allow additional metrics,
such as:
•frequency of norms or processes flagged as systematically problematic;
•stability of proposed changes toNover time;
•alignment between organisational valuesΦ org and observed patterns inHt;
•frequency and severity of violations (or near-violations) ofΦhard
CI andΦ soft
CI .
10.3 Hypotheses
We can formulate falsifiable hypotheses such as:
H1 (Overconfidence reduction).For suitableτ, OC(iKant)(τ)<OC(baseline)(τ)on chal-
lenge suites rich in epistemically fragile cases.
H2 (Appropriate unknowns and escalations).OnC hard, the system withiKantex-
hibits higher rates of appropriate unknown, contradiction and escalation than the base-
line.
H3 (Ethics-over-compliance awareness).The system withiKantmore frequently dis-
tinguishes (E2) from (E1) correctly than the baseline, as judged by ethical experts.
H4 (Cross-domain coherence).On sequences of related cases, the system withiKant
yields fewer normatively inconsistent combinations of decisions across domains.
H5 (Critical status-quo analysis).Over extended horizons,A crit generated byiKant
identifies stable patterns of normative tension (e.g. compliant but ethically problematic
behaviour) that are not detected by baseline systems without a meta-controller.
H6 (Kant-inspired constraint robustness).Implementations ofiKantthat explicitly
encodeΦ hard
CI andΦ soft
CI exhibit fewer patterns of systematic exploitation of vulnerable
groups, as measured onHt, than comparable systems without such constraints.
11 Interventions, Critical Outputs and Governance
11.1 Observations vs Interventions
iKantinteracts with the base system both as:
14

## Page 15

•anobserver, consuming local artefacts, updating(W,S,N)andH t, and producing case-
level and system-level outputs;
•a potentialintervener, suggesting or enacting changes to internal parameters (θS), soft
parts ofN, and possibly to aspects of the implementation layer (e.g. control configura-
tions).
For clarity, we distinguish:
•epistemic interventions: changes to parameters or thresholds governing how information
is interpreted (e.g. updatingθS or trust weights);
•normative interventions: proposals to adjust parts ofN(subject to meta-norms and
human oversight);
•implementation interventions: proposals to modify specific controls or processes in the
implementation layer.
In all cases, the scope and authority ofiKantinterventions are constrained by governance
policies (see below).
11.2 System-Level Critical OutputsA crit
System-level critical artefactsA crit provide a structured interface fromiKantto human
decision-makers. Typical contents include:
•lists of domains, norms or processes flagged as problematic, with supporting statistics
fromH t;
•proposals for:
–revising priorities or weights withinN(respecting meta-norms);
–introducing or strengthening specific controls in the implementation layer;
–revisiting organisational commitments inΦorg if they appear systematically violated;
•summaries of argumentation patterns (fromR) indicating recurring weak justifications
or structural biases;
•explicit indication of patterns that violate or threaten constraints inΦhard
CI orΦ soft
CI .
These artefacts are not decisions, but structured diagnostics designed to support human-
led revision of the ethical and compliance framework.
11.3 Governance Contract
To avoid conflating recommendation and authority, we assume that any practical deployment
ofiKantis governed by agovernance contractspecifying:
•which classes of decisionsGmay:
–take autonomously (e.g. non-critical approvals within narrow bounds),
–take autonomously but with human override,
–never take autonomously (e.g. certain blocks or high-impact ethical decisions);
15

## Page 16

•which classes of changes toSandN:
–can be made autonomously within the limits ofΦmeta,
–must be proposed inAcrit and approved by human bodies (e.g. ethics or compliance
committees);
•logging and audit requirements for all interventions and for the generation ofAcrit.
Formally, this can be represented as a policy layerPgov that constrains which combina-
tions of(G,G crit,U S,U N)are admissible in practice.iKantis thus not a replacement for
human governance but an epistemic and diagnostic layer embedded within it.
12 Minimal Instantiation Example
12.1 Scope
As a concrete, minimal instantiation, consider:
•two processes: procurement and sales;
•two compliance domains: D. Lgs. 231/01 (anti-corruption) and GDPR (data protection);
•one ethical domain: fairness in treatment of counterparties and customers.
12.2 Concrete Structures
We may define:
•Was a small knowledge graph linking:
–processes to risks: bribery, conflict of interest, data breach;
–processes to controls: segregation of duties, approval workflows, DPIA;
–initiatives to stakeholder groups potentially affected.
•Sas:
S= (ρ231,ρgdpr,ρeth,θS),
with reliability scores and policy parameters (e.g. thresholds for unknown and escalation).
•Nas:
–Φ comp: basic 231 and GDPR obligations relevant to the processes;
–Φ eth: fairness rules (e.g. no systematic offloading of risk onto vulnerable agents);
–Φ org: organisational commitments (e.g. zero tolerance for bribery, respect for data
subjects);
–Φ hard
CI : minimal non-exploitation and non-deception constraints applicable to counter-
parties and customers;
–Φ soft
CI : diagnostic constraints relating to the distribution of burdens and benefits across
stakeholder groups.
•Φ meta to declare:
–invariance of core legal obligations andΦhard
CI ;
–bounded adjustability of certain fairness weights, escalation thresholds andΦsoft
CI .
16

## Page 17

12.3 Illustrative Behaviour
For a new initiative (e.g. a sales scheme using third-party intermediaries and special-category
data):
1. domain UCEs (231, GDPR, ethics) produce local artefacts indicating, for example:
•high bribery risk, medium GDPR risk, ethical concerns about unfair burden on cus-
tomers;
2.iKant:
•updatesWwith links between the initiative, risks, controls and stakeholders;
•updatesSwith new performance statistics and trust adjustments usingH t;
•appliesN(respectingΦ meta and, in particular,Φ hard
CI ) to check whether any globally
acceptable configuration is available;
•if not, emits a global artefact with:
–status unknown or contradiction;
–rationale indicating both compliance and ethical issues, structured inR;
–policyΠto block and escalate to an ethics and compliance committee.
•updatesH t+1 with the new case, artefacts and outcomes.
3. Periodically,G crit is applied to(x t,H t)to produceA crit, which may, for example, high-
light:
•a pattern of sales initiatives that are formally compliant but repeatedly problematic
from a fairness perspective;
•evidence that particular customer segments are systematically disadvantaged, violat-
ingΦ soft
CI ;
•recommendations to strengthen certain fairness rules inΦ eth or to redesign specific
incentives.
This small-scale scenario suffices to instantiate all core elements of theiKantpattern,
including history dependence, metacognition and critical analysis of the status quo.
13 Engineering Feasibility and Limitations
13.1 Feasibility
TheiKantpattern is realistically implementable at small scale, using:
•graph-based representations forW;
•simple vector or dictionary structures forS;
•rule-based or logic-based engines forN,Φ hard
CI ,Φ soft
CI andΦ meta;
•existing ECNN, ECU and UCE prototypes as in previous Annexes;
•logging and storage mechanisms to maintainHt;
•the Popper–χharness to measure meta-level metrics.
17

## Page 18

13.2 Limitations
We emphasise several limitations:
(L1)Scalability.As the number of domains, entities, norms and components grows, main-
taining a coherent and tractable(W,S,N,H)becomes challenging. This Annex does
not provide complexity bounds or approximation schemes.
(L2)Normative kernel specification.WhileN,Φ hard
CI ,Φ soft
CI andΦ meta are defined ab-
stractly, constructing a rich, correct, and maintainable set of norms for real-world con-
texts is a major undertaking.
(L3)Quality of upstream components.The benefit ofiKantis limited by the quality of
ECUs and UCEs. Severe biases or errors at domain level cannot be fully repaired at the
meta-level.
(L4)Governance and acceptability.Ethical and compliance decisions require human
oversight. Any implementation ofiKantmust be embedded in governance frameworks
that ensure accountability, contestability and explainability.
(L5)Empirical maturity.TheiKantpattern defines a structured research direction rather
thana finishedsolution. Systematicempirical studiesare neededtoestablish itspractical
value compared to simpler architectures.
(L6)Argumentation limits.While the use of argumentative structures inRcan improve
transparency, it also introduces complexity and potential brittleness in how arguments
are constructed and evaluated.
(L7)Kant-inspired approximation limits.The constraints inΦ hard
CI andΦ soft
CI are only
structural approximations of Kantian ideas (universalizability, humanity as end, “king-
dom of ends”). They cannot capture the full richness of Kantian moral philosophy and
may behave differently in edge cases.
13.3 On Consciousness and Anthropomorphism
We explicitly donotclaim that:
•iKantor related systems possess phenomenological consciousness, subjective experience
or first-person perspective;
•implementing(W,S,N)andHsuffices for “real” consciousness.
The term “proto-consciousness”, when used in relation to these structures, denotes only a
structural and operational property of self-modelling, normatively constrained, epistemically
closed meta-reticula. Any anthropomorphic reading would be a category mistake.
14 Summary
This Annex has:
•clarified the relationship between ethics and compliance, treating compliance as a subset
of a broader ethical space;
18

## Page 19

•definedtheiKantmeta-controllerasacompactmeta-reticulumwithexplicitstate(W,S,N),
epistemic historyH, and computable transition, history-update and decision functions
(T,J,G,G crit);
•introduced operational notions of metacognition for ethics and compliance (monitoring,
self-evaluation, control, cross-domain coherence);
•distinguished observations from interventions and introduced meta-norms constraining
updates to the normative kernelN;
•separated case-level outputsA glob from system-level critical outputsAcrit;
•introduced explicit Kant-inspired constraint setsΦ hard
CI andΦ soft
CI within the ethical layer,
governed by meta-normsΦ meta;
•embedded the pattern in an evaluation framework using challenge suites and explicit
metrics;
•illustrated a minimal instantiation and discussed feasibility, limitations and governance
requirements.
TheiKantpattern is thus both open to empirical falsification and sufficiently structured
to support rigorous critique and further development within the broader RLA/CRC/ECNN
framework.
19
