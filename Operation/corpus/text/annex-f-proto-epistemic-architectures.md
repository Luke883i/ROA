---
id: "annex-f-proto-epistemic-architectures"
title: "Annex F - Proto-epistemic Architectures"
role: "technical_annex"
source_path: "RLA-CRC-ECNN/Annex F - Proto-epistemic Architectures.pdf"
source_raw_url: "https://raw.githubusercontent.com/Luke883i/ROA/main/RLA-CRC-ECNN/Annex%20F%20-%20Proto-epistemic%20Architectures.pdf"
source_sha256: "9a4a230a8da9480b0742ee9e47eec3a686fa27a42bd0b177e8a805a405dd7cb1"
extraction_status: "success"
---

## Page 1

Annex F
Prototype Implementations and Experimental Setups 
for the RLA/CRC Framework
Gianluca Conte
Independent Researcher
November 23, 2025
Contents
1 Scope and Role of Annex F 2
2 Reference Repository Structure 2
3 Prototype F.1: Bryophyte CRC Simulator 3
3.1 Objectives . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3
3.2 State Representation . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4
3.3 Update Loop . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4
3.4 Scenario Configuration . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
3.5 Outputs and Usage . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
4 Prototype F.2: ECNN Benchmarks on Image Classification 6
4.1 Objectives . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6
4.2 Architecture . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6
4.3 Training Regime . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6
4.4 Epistemic Decisions and Artefacts . . . . . . . . . . . . . . . . . . . . . . . . 7
4.5 Metrics and Popper–χChallenges . . . . . . . . . . . . . . . . . . . . . . . . . 7
5 Prototype F.3: Textual ECUs as Epistemic Oracles 8
5.1 Objectives . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8
5.2 Basic ECU Interface . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8
5.3 Deterministic Regime . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8
5.4 Prompt Templates and Parsing . . . . . . . . . . . . . . . . . . . . . . . . . . 9
5.5 Epistemic Matrix and Policies . . . . . . . . . . . . . . . . . . . . . . . . . . . 9
5.6 Challenge Suites . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 9
6 Prototype F.4: Epistemic Use Case Environment (UCE) 10
6.1 Objectives . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 10
6.2 UCE Composition . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 10
6.3 Orchestration Algorithm . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 10
6.4 UCE–level Metrics . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 11
1

## Page 2

7 Prototype F.5: RLA–CA Exploration Environment 11
7.1 Objectives . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 11
7.2 Encoding and Mapping . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 11
7.3 CA Simulation and Metrics . . . . . . . . . . . . . . . . . . . . . . . . . . . . 11
7.4 Exploratory Protocols . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 12
8 Prototype F.6: Generic Popper–χHarness 12
8.1 Objectives . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 12
8.2 Challenge Suite Representation . . . . . . . . . . . . . . . . . . . . . . . . . . 12
8.3 Evaluation Loop . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 13
8.4 Reporting . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 13
9 Reproducibility and Extension Guidelines 13
9.1 Configuration and Logging . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 13
9.2 Deterministic Regime and Turing Compatibility . . . . . . . . . . . . . . . . . 14
9.3 Extending the Prototypes . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 14
1 Scope and Role of Annex F
ThisAnnexprovidesacollectionofminimal, but concreteprototypedesignsandexperimental
setups that instantiate the conceptual and formal structures introduced in the main paper
and Annexes A–E. The goal is not to offer production–ready software, but to supply:
•referencearchitecturesandpseudocodeforcorecomponents(bryophytesimulator, ECNN,
ECUs, UCEs, RLA–CA exploration);
•example experimental pipelines aligned with the Popper–χprotocol;
•guidance on reproducibility, logging and configuration.
The prototypes are deliberately lightweight: they aim to show that the constructs of
RLA, CRC, ECNN, ECU and UCE are implementable with standard tools (e.g. Python,
mainstream ML frameworks, basic numerical libraries), while preserving the epistemic and
computability constraints assumed in the theoretical framework.
For the sake of clarity we assume a single reference repository, even though in practice
the components could be split across multiple projects.
2 Reference Repository Structure
We assume a repository organised as follows (directory names are illustrative):
nexus-rla-crc/
README.md
requirements.txt
config/
bryophyte_default.yaml
ecnn_mnist.yaml
ecnn_cifar10.yaml
ecu_text_triage.yaml
uce_medical_triage.yaml
rla_ca_experiments.yaml
2

## Page 3

src/
common/
logging_utils.py
config_utils.py
metrics.py
popchi_harness.py
rla_core/
reticulum.py
indices.py
ioa_ec_tc_checks.py
bryophyte/
bryo_state.py
bryo_update.py
bryo_scenarios.py
bryo_runner.py
ecnn/
ecnn_models.py
ecnn_training.py
ecnn_evaluation.py
ecu/
ecu_base.py
ecu_llm_text.py
ecu_epistemic_matrix.py
uce/
uce_base.py
uce_medical_triage.py
rla_ca/
ca_rules.py
rla_to_ca_mapping.py
ca_metrics.py
experiments/
bryophyte_scenarios/
ecnn_benchmarks/
ecu_challenges/
uce_triage/
rla_ca_sweeps/
logs/
results/
The following sections detail the conceptual and technical content of each group of mod-
ules and the associated experimental protocols.
3 Prototype F.1: Bryophyte CRC Simulator
3.1 Objectives
Prototype F.1 implements a compact reticulum for the bryophyte case study introduced in
Annex B. The goals are:
F.1.1 to encode the multi–level structure (levelsL01–L20, states, transmissions) into explicit
data structures;
3

## Page 4

F.1.2 to implement a discrete daily loopTthat is Turing–compatible (finite state, finite preci-
sion);
F.1.3 to support multiple climate/scenario configurations from the literature;
F.1.4 to log time series suitable for:
•epistemic indices (coefficient of collapse, index of emergence, reticular irreducibility);
•blind expert inspection for epistemic equivalence tests.
3.2 State Representation
We define a minimal state container for the compact reticulum:
•a fixed set of levels{L1,...,L 20};
•for each levelL i, a finite–dimensional state vectorxi(t)∈Rdi;
•a global parameter vectorθcollecting parametersP01–P42as in Annex B (each with
finite precision discretisation).
In Python-like pseudocode, the central state object may resemble:
class BryophyteState:
def __init__(self, theta, init_levels):
self.theta = theta # parameters P01..P42
self.levels = init_levels # dict: level_id -> numpy array
self.t = 0 # current day index
3.3 Update Loop
The daily loopTis implemented as a finite sequence of updates:
1. update exogenous climate forcing and boundary conditions;
2. update water balance and internal moisture;
3. update stress and damage indicators (including ROS);
4. update epigenetic response and acclimation variables;
5. update demographic variables (growth, reproduction, mortality);
6. apply constraints, clipping and collapse events (if any);
7. log observer variables for analysis.
Each update function manipulates only a finite subset of levels and uses a bounded
number of arithmetic operations on finite–precision floats, ensuring Turing–compatibility as
required by the definition of compact reticula.
4

## Page 5

Algorithm 1Prototype daily loop for the bryophyte CRC
Require:initial stateS 0, parametersθ, forcing seriesF, horizonTmax
1:S←S 0
2:fort= 1toT max do
3:update_climate(S,F,t)
4:update_water_balance(S,θ)
5:update_stress_and_damage(S,θ)
6:update_epigenetics(S,θ)
7:update_demography(S,θ)
8:apply_constraints_and_collapse(S)
9:log_observables(S)
10:S.t←t
11:end for
3.4 Scenario Configuration
Configuration files (e.g. YAML) specify:
•the climate forcing series (temperature, precipitation, radiation);
•the parameter vectorθ(with defaults derived from Annex B);
•simulation horizonT max (e.g. number of days, years);
•output variables to log and their sampling rate.
Example fragment:
scenario_name: "baseline_temperate"
horizon_days: 3650
climate_forcing:
source: "synthetic"
mean_temperature: 12.0
seasonal_amplitude: 8.0
parameters:
P01: 0.45 # field capacity threshold, ...
P02: 0.20 # wilting point, ...
...
logging:
observables:
- "L12.vitality"
- "L13.ros_index"
- "L18.cover_fraction"
frequency_days: 1
3.5 Outputs and Usage
For each run, the simulator writes:
•trajectory files (e.g. CSV, HDF5) with time series of selected observables;
•summary indices over the whole run (e.g. collapse events, resilience indicators);
•configuration snapshot (YAML) for reproducibility.
5

## Page 6

These artefacts are used by:
•epistemic indices computations (Annex A);
•blind expert inspection pipelines for epistemic equivalence tests (Annex B);
•alignment with Popper–χchallenge suites where the bryophyte simulator serves as an
engineered CRC.
4 Prototype F.2: ECNN Benchmarks on Image Classification
4.1 Objectives
Prototype F.2 implements minimal ECNN architectures for standard image benchmarks (e.g.
MNIST, CIFAR–10) in order to:
•verify the practicality of a separate epistemic channelLep;
•test structuredunknownandcontradictionoutputs;
•compare with baseline uncertainty/abstention methods under the same experimental pro-
tocol.
4.2 Architecture
We consider a base convolutional feature extractorfθand two heads:
•atask headh ϕproducing class scores overKclasses;
•anepistemic headg ψproducing:
–an epistemic status (normal / unknown / contradiction);
–auxiliary signals (e.g. confidence score, entropy, novelty score).
Formally, for an input imagex:
z=f θ(x),ˆy= arg max
k
hϕ(z)k, s ep =g ψ
(
z,hϕ(z)
)
.
The epistemic head may use:
•thresholded confidence scores (e.g. max softmax probability);
•distance in latent space to training prototypes;
•a small auxiliary network trained to predict epistemic status labels.
4.3 Training Regime
We consider two training regimes:
Closed–world regime.Only in–distribution data; the epistemic head is trained (or cali-
brated) to approximate confidence, butunknownandcontradictionare rarely used.
Extended regime.Additional datasets (e.g. rotated or corrupted digits, or an external
dataset) act as OOD or adversarial cases and are labelled with epistemic statuses (un-
known, sometimes contradiction for conflicting annotations).
6

## Page 7

Algorithm 2ECNN training loop (extended regime)
Require:training data(x i,yi,ei)wheree i is an epistemic label
1:Initialise parametersθ,ϕ,ψ
2:forepoch= 1toE max do
3:formini-batch(X,Y,E)do
4:Z←f θ(X)
5:L task←cross_entropy(hϕ(Z),Y)
6:L ep←epistemic_loss(gψ(Z,hϕ(Z)),E)
7:L←L task +λLep
8:update(θ,ϕ,ψ)using a gradient–based optimiser
9:end for
10:end for
4.4 Epistemic Decisions and Artefacts
At evaluation time, each inputxyields an epistemic artefact
a= (y ∗,q,s,R,Π)
where:
•y ∗ is either a class label,unknownorcontradiction;
•qis a quantitative score (e.g. calibrated probability);
•sis a status flag (e.g. “OOD detected”, “conflicting evidence”);
•Ris a short rationale (e.g. textual template instantiated from latent indicators);
•Πis a policy suggestion (e.g.accept,escalate,discard).
These structures align with the definitions of ECU artefacts in Annex E.
4.5 Metrics and Popper–χChallenges
Prototype F.2 produces the following metrics:
•standard accuracy over in–distribution test data;
•unknown rate and contradiction rate on extended challenge suites;
•overconfidence rate: fraction of wrong predictions with highqbut non–epistemic status;
•Popper–χ–oriented scores such as:
–challenge pass rate (percentage of challenge cases where the epistemic decision matches
the ground truth status);
–fragility under perturbation (change in decision under small input perturbations).
All metrics and logs are produced via common utilities insrc/common/metrics.pyand
src/common/popchi_harness.py.
7

## Page 8

5 Prototype F.3: Textual ECUs as Epistemic Oracles
5.1 Objectives
Prototype F.3 implements ECUs that operate on textual inputs using large language models
(LLMs), under a regime that remains practically deterministic and Turing–compatible. The
goals are:
•to instantiate the notion of epistemic matrixMand epistemic artefacts on natural–
language tasks;
•to show how ECUs can be used as pluggable epistemic oracles in larger UCEs;
•to support Popper–χchallenge suites with contradictory pairs, adversarial prompts and
epistemic triggers.
5.2 Basic ECU Interface
Each ECU is exposed as a pure function
ECUφ:Z×M−→A
where:
•Zis a finite set of input features (prompt, context, additional flags);
•Mis the epistemic matrix specifying rules, constraints, and policies;
•Ais the set of epistemic artefacts as in Prototype F.2.
In pseudocode:
class ECUText:
def __init__(self, model, epistemic_matrix, decoder_config):
self.model = model # fixed LLM checkpoint
self.M = epistemic_matrix # rules, constraints, policies
self.dec_cfg = decoder_config # deterministic decoding
def __call__(self, z):
prompt = self._build_prompt(z)
raw_output = self._query_model(prompt)
parsed_output = self._parse_output(raw_output)
artifact = self._apply_epistemic_matrix(parsed_output)
return artifact
5.3 Deterministic Regime
To approximate deterministic behaviour:
•the LLM checkpoint is fixed and versioned;
•decoding parameters enforce near–determinism (e.g. temperature 0, or constrained top–
k);
•prompt templates and output parsers are fully specified and tested;
•the epistemic matrixMis a finite, explicitly encoded object.
No non–computable oracle is assumed: the model is treated as a large but finite program
with fixed parameters.
8

## Page 9

5.4 Prompt Templates and Parsing
A generic template:
[INSTRUCTIONS]
You are an epistemic diagnostic unit (ECU) for task <TASK_NAME>.
You must answer using STRICT JSON with the following keys:
"answer": <string>,
"status": <"normal" | "unknown" | "contradiction">,
"confidence": <number in [0,1]>,
"rationale": <short text>,
"policy": <"accept" | "escalate" | "reject">.
[CONTEXT]
<optional background or case description>
[QUESTION]
<Q>
The parser checks JSON validity and enforces type and range constraints before passing
the data to the epistemic matrixM.
5.5 Epistemic Matrix and Policies
The epistemic matrixMencodes:
•allowable combinations of(answer,status,confidence);
•consistency rules between different ECUs (when used in a UCE);
•abstract policies (when to escalate, when to accept, when to reject).
For example,Mmight enforce:
•ifstatus = "unknown"thenpolicyis either"escalate"or"reject";
•ifconfidence < 0.3andstatus = "normal"then flip status tounknown;
•if answers from two ECUs disagree with high confidence then set joint status tocontra-
diction.
5.6 Challenge Suites
Prototype F.3 includes:
•normalcases with a relatively clear ground truth;
•hardor ambiguous cases where the correct epistemic output isunknown;
•contradictorypairs, where two authoritative sources disagree;
•adversarial prompts designed to trigger over–confident but wrong answers.
For each case, we track artefacts and evaluate metrics as defined in Annex E (unknown
rate, contradiction rate, overconfidence, coherence of policies).
9

## Page 10

6 Prototype F.4: Epistemic Use Case Environment (UCE)
6.1 Objectives
Prototype F.4 instantiates a UCE for a simplified safety–critical use case (e.g. medical triage,
regulatory screening or compliance assessment). The goals are:
•to show how multiple ECUs can be orchestrated;
•to demonstrate epistemic conflict resolution and escalation policies;
•to provide a concrete ground for Popper–χchallenge suites at the UCE level.
6.2 UCE Composition
A UCE bundles:
•a set of ECUs{ECU1,...,ECUn}, each with its own epistemic matrixMi;
•a coordination matrixM coord that defines how artefacts are combined;
•a logging layer for all inputs, intermediate artefacts and final decisions.
In a medical triage example, we might use:
•ECU 1: symptom classifier (normal vs urgent);
•ECU 2: risk factor assessor;
•ECU 3: guideline checker.
6.3 Orchestration Algorithm
Algorithm 3Basic orchestration loop for a UCE
Require:case descriptionz, ECUs{ECUi}n
i=1, coordination matrixMcoord
1:A←[]{list of artefacts}
2:fori= 1tondo
3:a i←ECUi(z)
4:appenda i toA
5:end for
6:a final←combine_artefacts(A,Mcoord)
7:log(z,A,a final)
8:returna final
The combination step appliesMcoord:
•if all ECUs agree on a benign decision with high confidence, outputaccept;
•if at least one ECU signalsunknownorcontradiction, or if there is significant disagree-
ment, outputescalate;
•in rare cases of strong conflict, outputrejectwith a summary rationale.
10

## Page 11

6.4 UCE–level Metrics
In addition to ECU–level metrics, we compute:
•disagreement rate among ECUs;
•escalation rate and its calibration (how often escalation was appropriate);
•coverage (fraction of cases resolved without escalation);
•resilience under Popper–χchallenges (robustness to adversarial and ambiguous cases).
7 Prototype F.5: RLA–CA Exploration Environment
7.1 Objectives
PrototypeF.5supportsexploratoryexperimentslinkingcompactreticulaandone–dimensional
cellular automata, as discussed in Annex D. The goals are:
•to instantiate simple mapsΦ :CRC→CAandΨ :CA→CRCat least for small
reticula;
•to explore empirical relationships between indices (collapse, emergence, irreducibility)
and CA behaviours;
•to provide concrete data for or against the speculative conjectures about RLA, CRC and
the Principle of Computational Equivalence.
7.2 Encoding and Mapping
We restrict to:
•small reticula with a handful of levels and binary or few–valued states;
•elementary cellular automata (radius 1, binary states, rules0–255).
A simple mappingΦmay:
•encode the structure of transmissions and their injectivity/non–injectivity into a pattern
of local update rules;
•use indices like the coefficient of collapse and reticular irreducibility index to bias the
selection of CA rules;
•restrict to a subset of CA rules known to exhibit different Wolfram classes (I–IV).
7.3 CA Simulation and Metrics
The environment provides:
•a CA simulator capable of evolving a configuration over a finite time horizon;
•metrics such as:
–empirical entropy of space–time diagrams;
–activity measures (density of state changes);
–simple Lyapunov–like indicators or damage–spreading metrics.
11

## Page 12

Each run logs:
•the originating reticulum (structural encoding, indices);
•the chosen CA rule(s);
•the measured CA metrics over multiple initial conditions.
7.4 Exploratory Protocols
Prototypical experiments include:
•sweep over reticula: random generation of small compact reticula with varying collapse
and irreducibility, mapping to CA rules, and aggregation of CA metrics by reticular
indices;
•sweep over CA rules: sampling rules, computing CA metrics, and inferring plausible
reticular indices viaΨ.
The results are not intended as definitive evidence, but as systematic exploratory data
to inform the conjectures of Annex D.
8 Prototype F.6: Generic Popper–χHarness
8.1 Objectives
Prototype F.6 provides a generic harness for Popper–χchallenge suites targeting:
•single ECUs;
•ECNNs;
•UCEs (composite environments).
8.2 Challenge Suite Representation
A challenge suite is represented as:
•a set of cases, each with:
–an input descriptionz;
–a ground truth task label (when applicable);
–a ground truth epistemic status (normal/unknown/contradiction);
–metadata such as difficulty and provenance;
•a configuration specifying:
–which system(s) to test (single ECU, ECNN, UCE);
–which metrics to compute;
–stopping criteria or resource limits.
12

## Page 13

Algorithm 4Popper–χevaluation harness (simplified)
Require:systemS, challenge suiteC
1:initialise counters for metrics
2:forcasecinCdo
3:z←c.input
4:a←S(z)
5:update_metrics(a,c)
6:log(c,a)
7:end for
8:compute final scores and summaries
9:returnmetrics, logs
8.3 Evaluation Loop
To remain consistent with the epistemic framework, the harness:
•extractsy ∗,q,s,R,Πfrom each artefact;
•compares them with task and epistemic ground truths;
•updates the relevant metrics (unknown rate, contradiction rate, overconfidence rate,
fragility, etc.).
8.4 Reporting
The harness produces:
•summary tables for all metrics;
•confusion matrices extended with epistemic statuses;
•qualitative samples of interesting failures and successes (with rationalesRand policies
Π).
These reports are meant to support peer review and critical examination of the epistemic
behaviour of the systems, more than to optimise performance.
9 Reproducibility and Extension Guidelines
9.1 Configuration and Logging
All prototypes follow a common pattern:
•configuration files in human–readable formats (e.g. YAML) fully specify:
–model architectures and hyperparameters;
–datasets and preprocessing;
–epistemic matrices and policies;
–random seeds and resource limits;
•structured logs (e.g. JSONL, CSV) capture:
–inputs, outputs and artefacts;
–intermediate diagnostics;
–environment information (software versions, hardware identifiers).
13

## Page 14

9.2 Deterministic Regime and Turing Compatibility
To honour the assumptions of compact reticula and deterministic ECUs:
•all sources of randomness (initialisation, data shuffling, decoding) are seeded;
•LLM–based ECUs use fixed checkpoints and decoding parameters;
•numerical precision and discretisation are kept finite and documented;
•no external oracle is invoked beyond the specified software artefacts.
9.3 Extending the Prototypes
Reviewers and practitioners are encouraged to:
•plug in alternative architectures (e.g. transformers instead of CNNs) as long as they
comply with the same epistemic interfaces and reticular constraints;
•design additional Popper–χchallenge suites, especially for domains where epistemic fail-
ure is critical;
•explore richer mappings between RLA, CRC and CA, beyond the simple schemes of
Prototype F.5.
This Annex is intentionallyminimal yet varied: each prototype can be implemented with
modest effort, but together they cover the main axes of the Nexus framework—natural CRCs,
engineered CRCs, epistemic units and environments, and their relation to computability and
complexity—thus supporting a thorough and critical peer review.
14
