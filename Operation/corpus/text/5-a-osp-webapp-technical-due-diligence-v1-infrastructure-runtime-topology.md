---
id: "5-a-osp-webapp-technical-due-diligence-v1-infrastructure-runtime-topology"
title: "(5) A-OSP Webapp Technical Due Diligence v1 (Infrastructure, Runtime, Topology)"
role: "UNREVIEWED_AUTOSEEDED"
source_path: "(5) A-OSP Webapp Technical Due Diligence v1 (Infrastructure, Runtime, Topology).pdf"
source_raw_url: "https://raw.githubusercontent.com/Luke883i/RLA-ECNN/main/%285%29%20A-OSP%20Webapp%20Technical%20Due%20Diligence%20v1%20%28Infrastructure%2C%20Runtime%2C%20Topology%29.pdf"
source_sha256: "087ffc5597dd61b04d8aab181c920928fee8e998915da472f09575a0fd4a1f37"
extraction_status: "success"
---

## Page 1

A-OSP1 Technical Due Diligence v1-live · posture/candidate · main@e492290b 
A-OSP Technical Due Diligence 
Posture As-Is and Posture Candidate — D1/EQL Proof-Seam Closure (MVP) 
CTO / engineering dossier aligned with the A-OSP architecture/topology whitepaper 
Field Value 
Document class Technical due-diligence dossier with embedded architecture specification, runtime evidence, closure gates and engineering 
readiness plan. 
Audience CTO, staff engineers, enterprise architecture, investor technical diligence, risk/governance, development team.  
Version v.1 live — fresh reconstruction from current main evidence; no reliance on obsolete anchors. 
Live anchor Luke883i/aosp1 main @ e492290b128eb89af44a488d8600d9862f30db0b. 
Cross-reference Full architecture/topology reference: (ii) Augmented Ontological Semantic Platform (A -OSP) Whitepaper - Webapp, 
Infrastructure, Runtime, Topology.pdf 
Non-goals No legal certification, production certification, complete proof-grade claim, full Oracle enforcement, or benchmarked 
economics. 
Executive posture 
Posture as-is: A-OSP1 is no longer merely a contract-only D1 proof concept. Current main contains a dedicated D1 proof route, a 
D1ProofAppendService, persisted d1_receipt_ semantics, read-after-write evidence, proofSessionContext return and negative tests. 
Posture candidate: A-OSP1 is a credible enterprise MVP candidate for proof-sensitive AI-assisted work if the claim remains bounded to 
D1/EQL proof-seam closure and if C1 artefacts, EQL proof receipts, unified EQL proof routing, downstream gates and pilot evidence 
pass. 
As-is / candidate boundary: D1 has materially advanced on main. EQL proof remains the primary open seam. Full enterprise pilot 
posture requires P0/P1 gates; production or certification language remains out of scope. 
Area Current posture External claim boundary 
Canonical architecture AS-IS Four-layer, text-first SSOT and cache boundaries are established. 
D1 proof seam RUNTIME-WIRED / HARDENING Route, service, receipt persistence, readback and tests exist; C1 still must prove no 
bypass. 
EQL proof seam TARGET / OPEN Contract exists, but no inspected runtime EQLQueryReceipt or unified proof route 
comparable to D1. 
Enterprise readiness CANDIDATE Requires P0 proof seam, P1 pilot controls and measured evidence. 
Production / certification NON-GOAL Do not claim without separate certification/production readiness programme. 
1. Audit method and confidence gate 
This edition applies an audit discipline designed to reach high confidence without overclaim: every AS-IS statement must have file/line 
evidence or a generated artefact; every proof claim must have a failure/negative path; every TARGET claim must remain visibly target; 
every issue reference is roadmap ownership, not delivered code. 
Audit question Pass condition Current standing 
Freshness Live anchor on current main; no obsolete anchor language. PASS. This dossier starts from main@e492290b. 
D1 runtime evidence Route + service + server mount + tests. PASS WITH BOUNDARY. All four are evidenced; C1 still open. 
EQL proof evidence EQLQueryReceipt + unified proof route + tests. OPEN. Not found in inspected runtime evidence. 
Evidence bundle Human-readable evidence register + hyperlinks. PASS. Embedded in Section 12 and Appendix A. 
Issue catalogue No 93 vs 100 mismatch; snapshot count is explicit. PASS WITH TRACKER CAVEAT. Appendix B enumerates 100 
rows; regenerate if tracker changes. 
CTO usability Clear decision posture, risk, gates, DoD. PASS. P0/P1/P2 gates and checklist included. 
Engineering usability APIs, workflow, runtime matrix, failure paths. PASS. D1 live path and EQL target path are separated. 
Audit confidence statement: Based on the inspected repository surfaces and the separation between AS-IS, HARDENING, TARGET and 
HYPOTHESIS, this dossier is robust enough for CTO / engineering review. It is not a certification artefact. Its strongest claim is bounded: 
proceed to a scoped D1/EQL closure sprint and pilot readiness assessment.

## Page 2

A-OSP1 Technical Due Diligence v1-live · posture/candidate · main@e492290b 
2. Alignment with “Augmented Ontological Semantic Platform (A-OSP) Whitepaper - 
Webapp, Infrastructure, Runtime, Topology.pdf” 
The file (ii) Augmented Ontological Semantic Platform (A-OSP) Whitepaper - Webapp, Infrastructure, Runtime, Topology.pdf is the 
architecture/topology whitepaper. This dossier is the live implementation due-diligence layer over aosp1. It narrows the full A-OSP 
topology to the D1/EQL MVP proof seam while remaining standalone: all key terms, status tags, workflow paths, APIs and gates are 
restated locally. 
Concept in (ii) Live dossier coordinate Current posture on main 
Browser-native runtime Canonical stack AS-IS architecture: React/Vite workspace as projection layer. 
Text-first SSOT .aosp.txt / source-cache taxonomy AS-IS. Durable truth is text stripes; DB/cache/UI/model/export are not truth. 
EQL / FAE / MONL Query, orchestration and operator 
layers 
EQL proof remains TARGET; FAE/MONL are contextual unless consumed by 
proof gates. 
Error Truth D1 fail-closed route PARTIAL AS-IS. Proof D1 route uses RFC 7807 ProblemDetail and explicit FAIL 
receipt. 
Authority Matrix Evidence discipline AS-IS concept for resolving doc/generated/code conflicts. 
Proof contracts / Proof Spine D1/EQL closure and downstream 
composition 
D1 advanced; EQLQueryReceipt and Proof Spine remain open/downstream. 
3. Terms, status and forbidden equivalences 
Term Meaning 
Stripe / .aosp.txt Append-only text record; durable domain knowledge lives here. 
SSOT Single source of truth; in A-OSP this is the stripe layer. 
Cache Directus/PostgreSQL mirror, index or admin layer; rebuildable, not truth. 
D1-D5 D1 intake, D2 enrichment, D3 links, D4 scores, D5 kernels. 
Receipt Typed evidence object emitted by proof-sensitive action. 
Readback Read-after-write verification with canonical hash comparison. 
Proof seam D1 + EQL boundary requiring receipts, readback/scope and negative tests. 
EQL A-OSP DSL for stripe-shaped, scoped data; not generic SQL. 
FAE Focus/Attention/Execution boundary for model calls. 
MONL Operator layer over parsed stripes. 
Error Truth Typed failure semantics; failure must not become false proof. 
Proof Spine Target chain of receipts across intake, retrieval, enrichment, artifact and review. 
Implementation status Use 
AS-IS Evidence exists at live anchor. 
RUNTIME-WIRED Live runtime path is mounted or invoked. 
HARDENING Partially implemented and being strengthened. 
CONTRACT-ONLY Schema/helper exists; does not prove runtime. 
TARGET Issue-owned or planned; not delivered. 
HYPOTHESIS Measurement needed before claim. 
NON-GOAL Explicitly outside current scope. 
Forbidden equivalence Replacement rule 
fluent output = proof Only receipt/readback/scope/witness can support proof. 
confidence = evidence Confidence is not source evidence. 
log = receipt Logs diagnose; receipts carry proof semantics. 
export = witness Only receipt-backed export/witness can be relied upon. 
UI green = proof Only valid receipt-derived UI state may be green. 
fallback/demo/local = proof Must fail closed. 
model memory = SSOT Provider is replaceable processor. 
raw query success = proof Requires explicit scope and EQLQueryReceipt. 
4. Canonical stack and repository geometry 
A-OSP v3 is defined as a 4-layer architecture: CORE, GENERATOR, ADAPTER and GOVERNANCE, with text files as the single source of 
truth, database as queryable cache, and a pipeline from unstructured knowledge to auditable artifacts. ARCHITECTURE.md is canonical 
at the live anchor [E01]. 
Layer Responsibility Representative technology / surface 
CORE Data models, stripe files, D1-D5, kernel, schema validation, 
parser/MONL. 
TypeScript, Zustand, Node.js, Express 5, Zod, 
PostgreSQL, Redis. 
GENERATOR UI apps, backend services, CLI, OS-like desktop and visualisations. React 19, Vite 7, Ant Design, Monaco. 
ADAPTER Third-party wrappers, Directus bridge, legacy interop, proxy configs. Directus, Traefik, Docker. 
GOVERNANCE CI/CD, docs, authority matrix, generated artefacts, agent governance. GitHub Actions, governance scripts, iKant-
governance.

## Page 3

A-OSP1 Technical Due Diligence v1-live · posture/candidate · main@e492290b 
Surface Canonical status Rule 
.aosp.txt Durable source / SSOT All domain data lives in append-only text stripes. 
Parser-service Custom API + Stripe Engine Primary backend; not a thin no-code wrapper. 
Directus/PostgreSQL Queryable cache / admin / auth Mirror/cache, not source of truth. 
React UI Projection / workspace Renders proof state; cannot manufacture proof. 
LLM provider Replaceable processor Bounded calls; no durable truth. 
PDF/DOCX/JSON 
export 
Downstream representation Not proof unless backed by witness/receipt. 
Repository geometry note: docs/audit/STACK_LAYER_CENSUS.md reports 1,697 frontend source files, 500 test files and 20 registered 
apps, but the file itself is marked AI-generated / NON-SSOT and has an older dynamic refresh. Treat those counts as advisory inventory, 
not a fresh measurement. Fresh release circulation should regenerate the census. 
5. Build, dependency and guard surface 
Frontend package evidence shows Node >=20, npm >=10, Vite build, Vitest, Playwright, golden D1 E2E, storage-SSOT lint, no-D1-fire-
and-forget lint and no-deprecated-D1-paths lint. These are important because they show the repo has guard surfaces, not merely 
product code [E08]. 
Root package evidence exposes audit:d1-dod, audit:eql, proof, proof-spine, proof-readback, governance fake-green checks, forbidden-
equivalence lint, OpenAPI validation, topology scans and CI topology checks [E09]. 
Evidence gate Status Next action 
Bundle size UNKNOWN Generate real bundle report before external performance claims. 
Dependency risk PARTIAL Generate dependency tree and zombie-dependency report. 
Latency / proof overhead UNKNOWN Measure append, readback and EQL p50/p95/p99. 
Security posture PARTIAL Keep CORS/secrets/auth evidence separate from proof claims. 
6. Proof architecture 
6.1 D1 proof route 
Current main contains backend/parser-service/src/routes/proof-d1.ts. The route header states it implements POST 
/api/v1/proof/d1/append, is separate from generic append and /api/v1/d1/* secondary paths, and returns receipt plus 
proofSessionContext on success. It also documents RFC 7807 ProblemDetail failures and explicit FAIL receipt on non-convergence 
[E02]. 
POST /api/v1/proof/d1/append 
Success: { ok, receipt, proofSessionContext, written } 
Failure: application/problem+json; 422 carries explicit FAIL receipt when readback fails 
6.2 D1ProofAppendService 
The service declares itself the single proof-grade producer of D1 receipts. It writes answer_ -> atom_ -> atom_validation_ -> audit_ -> 
d1_receipt_, and states the separation rule: generic append may create canonical data, but only this seam can produce proof PASS after 
read-after-write [E03]. 
answer_ -> atom_ -> atom_validation_ -> audit_ -> d1_receipt_ 
PASS only after read-after-write confirms canonical atom stripe 
Runtime detail: the service writes canonical stripes, executes a bounded read-after-write loop, computes a canonical hash, persists 
d1_receipt_, and returns proofSessionContext with sessionId, receiptId, readbackHash, mode and status [E04]. 
6.3 D1 tests 
backend/parser-service/test/proof-d1.test.js validates the proof seam: happy path persists d1_receipt_, PASS carries readback, 
idempotency token is deterministic, failed readback yields FAIL and never PASS, append error yields FAIL, stale/tampered atom 
mismatch does not converge [E05]. 
6.4 EQL proof boundary 
EQL remains the primary open seam. The contract defines EQL as an A-OSP DSL, not small SQL. EQL-Proof requires explicit scope and 
receipt semantics, but the inspected runtime search for EQLRunResult / EQLQueryReceipt / eqlQueryService did not expose a 
comparable runtime proof implementation. Issue #3488 still defines EQL proof as EQLQueryReceipt + queryHash + resultHash + explicit 
scope [E06, E07].

## Page 4

A-OSP1 Technical Due Diligence v1-live · posture/candidate · main@e492290b 
7. End-to-end workflows 
7.1 D1 live path 
Step Runtime status Mechanism 
1. User completes D1 intake Workflow context DataIntake generates answer/atom/validation 
payload. 
2. UI calls proof route RUNTIME target must use route POST /api/v1/proof/d1/append, not generic 
append. 
3. Route validates body + permission RUNTIME-WIRED zod schema + RBAC middleware. 
4. Service writes canonical stripes RUNTIME-WIRED answer_, atom_, atom_validation_, audit_. 
5. Readback barrier RUNTIME-WIRED readSession, parseFileContent, find atom_, 
hash compare. 
6. Receipt persistence RUNTIME-WIRED append d1_receipt_ with status/hash/readback 
fields. 
7. proofSessionContext RUNTIME-WIRED sessionId, receiptId, readbackHash, mode, 
status returned. 
8. UI/D2 consumers HARDENING / must verify Must consume receipt, not 
completion/progress. 
7.2 D1 failure paths 
Failure Expected behavior Evidence / gate 
generic append success canonical data, not proof PASS Route comments explicitly separate generic 
append from proof path. 
storage unavailable 503 ProblemDetail proof-d1 route fail-closed behavior. 
readback mismatch / non-convergence 422 ProblemDetail + FAIL receipt route and service behavior. 
append error FAIL receipt, never PASS proof-d1 tests. 
stale/tampered atom FAIL; no convergence proof-d1 stale/tamper test. 
D2 without receipt must fail C1 / #3488 required negative test, not fully 
closed until C1. 
7.3 EQL target path 
Step Expected EQL-Proof behavior Status 
1. Surface declares EQL level Core / Proof / Analytic Contract / target. 
2. User submits PROOF SELECT Must include IN SESSION Contract / target. 
3. Strict parser builds AST No silent fallback Engine foundations cited as landed in docs; runtime 
proof remains target. 
4. Scope canonicalizer Reject implicit/global proof scope Target negative test. 
5. Executor reads stripes/views _stripe_, _receipt_, _phase_, _lineage_ Target proof view semantics. 
6. Result classified ROWS / VALID_ZERO / FAIL_EMPTY / 
FAIL_SCOPE / FAIL_PARSE 
Target. 
7. Receipt persisted EQLQueryReceipt / eql_query_ MISSING / TARGET in inspected runtime evidence. 
8. Downstream consumes receipt ArtifactWitness / Proof Spine Target / downstream. 
8. API status 
API Current posture Meaning 
POST /api/v1/proof/d1/append RUNTIME-WIRED / HARDENING Dedicated D1 proof append route. 
POST /api/v1/sessions/:id/append CURRENT generic append May create canonical data; must not create proof PASS. 
GET /api/v1/d1/capability RUNTIME-WIRED Mounted under /api/v1/d1/capability; capability surface. 
POST /api/v1/query CURRENT query Generic query route; not automatically EQL-Proof. 
GET /api/v1/monl/status CURRENT MONL route family Operator/status route, not proof by itself. 
POST /api/eql/run TARGET / not found as runtime in 
inspected evidence 
Expected unified EQL proof route. 
9. Implementation state matrix 
Surface Live posture Evidence Open risk 
4-layer architecture AS-IS ARCHITECTURE.md [E01] Low. 
.aosp.txt SSOT / Directus cache AS-IS ARCHITECTURE.md backend 
boundaries [E01] 
Medium if app bypasses filesystem. 
D1 proof route RUNTIME-WIRED proof-d1.ts [E02], server mount [E10] Consumer adoption must be 
confirmed. 
D1ProofAppendService RUNTIME-WIRED d1-proof-append-service.ts 
[E03,E04] 
Contract mirror with shared proof 
types should be kept in sync.

## Page 5

A-OSP1 Technical Due Diligence v1-live · posture/candidate · main@e492290b 
d1_receipt_ persistence RUNTIME-WIRED persistReceipt [E04] Receipt schema consistency and 
EQL view bridge. 
D1 negative tests LANDED proof-d1.test.js [E05] CI inclusion must be confirmed. 
D2 hard gate TARGET / must verify C1/#3488 Potential bypass until proven. 
EQLQueryReceipt TARGET / not runtime-evidenced search + #3488 [E06,E07] Primary remaining proof seam. 
C1 artefacts TARGET Issue #3488 required outputs [E07] Gate not closed. 
Bundle/perf metrics UNKNOWN No generated release bundle artefact 
in inspected evidence 
Generate before external 
performance claims. 
10. Gap register and closure path 
Gap Current status Owner / gate 
D1 route/service/receipt/readback Substantially implemented on main Still validate no legacy bypass via C1. 
D1 consumer adoption HARDENING All UI/D2/Finder/Shell consumers must use 
proofSessionContext. 
D2 hard gate TARGET / verify No D2 without D1Receipt PASS + readback. 
d1_receipt_ EQL bridge TARGET / verify _receipt_ virtual view must include D1 receipts. 
EQLRunResult / EQLQueryReceipt TARGET Issue #3425 / #3488. 
Unified EQL proof route TARGET Issue #3426 / #3488. 
EQL canonical hashes TARGET Issue #3427 / #3488. 
EQL proof CI TARGET Issue #3430 / #3488. 
C1 artefacts TARGET docs/generated report + scans + false-green results. 
Closure order: D1 consumer adoption and D2 hard gate must be verified in parallel with EQL receipt implementation. The enterprise 
MVP posture is not strengthened by adding downstream features before C1 closes. 
11. Metrics and Definition of Done 
P0 metric Target 
d1_receipt_presence_rate 100% for proof D1 actions. 
d1_pass_without_readback_count 0. 
d1_fail_receipt_on_error_rate 100% for storage/readback failures. 
d2_handoff_without_d1receipt_count 0. 
eql_proof_without_scope_count 0. 
eql_success_without_receipt_count 0. 
generic_append_to_proof_pass_count 0. 
bundle_size_report_present 100% per release candidate. 
Gate Required before claim 
P0 proof seam D1 route/service tests pass; D2 gate verified; EQLQueryReceipt + unified proof route + EQL negative 
tests implemented; C1 artefacts generated. 
P1 enterprise pilot Security posture, recovery, observability, provider exposure, authority matrix, perf/bundle reports and 
runbooks complete. 
P2 scale readiness Concurrent proof-mode workload, tenant isolation tests, cost model, failover, ArtifactWitness/Proof 
Spine consumption. 
12. Evidence register 
ID Source Why it matters Link 
E01 ARCHITECTURE.md#L3-L8, #L24-L30, 
#L34-L42, #L46-L72, #L88-L117 
Canonical architecture, authority matrix, principles, layers, backend 
boundaries. open 
E02 backend/parser-
service/src/routes/proof-d1.ts#L3-
L24, #L89-L160 
D1 proof append route, request validation, fail-closed ProblemDetail. open 
E03 backend/parser-
service/src/services/d1-proof-
append-service.ts#L3-L24, #L196-
L234 
D1ProofAppendService as single proof producer; request/result types. open 
E04 d1-proof-append-service.ts#L236-
L268 
Writes canonical stripes, readback loop, d1_receipt_ persistence, FAIL 
receipt. open 
E05 backend/parser-service/test/proof-
d1.test.js#L51-L179 
D1 happy path and false-green / stale / append-error tests. open 
E06 docs/EQL_MIGRATION_PLAN.md and 
search results 
Search for EQLRunResult/EQLQueryReceipt returned docs/plans, not 
comparable runtime implementation. open 
E07 Issue #3488 C1 D1/EQL proof seam, required artefacts and negative tests. open 
E08 frontend/package.json#L9-L83 Frontend scripts and guard surface. open 
E09 package.json#L31-L100 Root proof/governance/audit scripts. open 
E10 backend/parser-
service/src/server.ts#L122-L135 
D1 workflow API, D1 capability and proof D1 route mounts. open

## Page 6

A-OSP1 Technical Due Diligence v1-live · posture/candidate · main@e492290b 
13. CTO and engineering checklist 
Question Expected answer before pilot 
Where is truth? .aosp.txt stripes are SSOT; DB/cache/UI/model/export are not truth. 
Can UI green fake proof? No; UI must derive proof state from valid receipt and fail closed. 
Can generic append create proof PASS? No; only D1 proof route/service may produce PASS receipt. 
Can D2 consume unproven D1? No; D2 handoff must require D1Receipt PASS + readback. 
Can raw EQL success be proof? No; EQL proof requires explicit scope and EQLQueryReceipt. 
Are issue references treated honestly? Yes; issues are TARGET/ownership evidence, not delivered code. 
Are bundle/perf economics measured? Not yet; no quote until artefacts are generated. 
Is the cross-reference to (ii) clear? Yes; (ii) is architecture/topology; this is live implementation due 
diligence. 
14. Final posture statement 
As-is posture: A-OSP1 main contains a coherent canonical architecture, substantial proof contracts, a dedicated D1 proof route, a 
D1ProofAppendService, d1_receipt_ persistence, read-after-write evidence and D1 negative tests. 
Candidate posture: A-OSP1 is credible as an enterprise MVP candidate for proof-sensitive AI-assisted work only if it keeps the claim 
bounded to the D1/EQL proof seam and completes EQL receipt/routing, C1 artefacts, downstream gates and measured pilot evidence. 
Recommended next action: proceed to a scoped proof-seam closure sprint. Do not use production readiness, compliance certification 
or complete proof-grade language until P0/P1 gates pass.

## Page 7

A-OSP1 Technical Due Diligence v1-live · posture/candidate · main@e492290b 
Appendix A — Resolved evidence hyperlinks 
All links below are commit-pinned to main@e492290b128eb89af44a488d8600d9862f30db0b. They require repository access if the 
repository is private. 
E01 — ARCHITECTURE.md#L3-L8, #L24-L30, #L34-L42, #L46-L72, #L88-L117: Canonical architecture, authority matrix, principles, layers, backend boundaries. 
open source 
E02 — backend/parser-service/src/routes/proof-d1.ts#L3-L24, #L89-L160: D1 proof append route, request validation, fail-closed ProblemDetail. open source 
E03 — backend/parser-service/src/services/d1-proof-append-service.ts#L3-L24, #L196-L234: D1ProofAppendService as single proof producer; request/result 
types. open source 
E04 — d1-proof-append-service.ts#L236-L268: Writes canonical stripes, readback loop, d1_receipt_ persistence, FAIL receipt. open source 
E05 — backend/parser-service/test/proof-d1.test.js#L51-L179: D1 happy path and false-green / stale / append-error tests. open source 
E06 — docs/EQL_MIGRATION_PLAN.md and search results: Search for EQLRunResult/EQLQueryReceipt returned docs/plans, not comparable runtime 
implementation. open source 
E07 — Issue #3488: C1 D1/EQL proof seam, required artefacts and negative tests. open source 
E08 — frontend/package.json#L9-L83: Frontend scripts and guard surface. open source 
E09 — package.json#L31-L100: Root proof/governance/audit scripts. open source 
E10 — backend/parser-service/src/server.ts#L122-L135: D1 workflow API, D1 capability and proof D1 route mounts. open source

## Page 8

A-OSP1 Technical Due Diligence v1-live · posture/candidate · main@e492290b 
Appendix B — Open issue snapshot (roadmap evidence) 
 
# Area Where it intervenes What it does 
#3037 Parser-service / budget backend/parser-service, OpenAPI, endpoint budget Classifies and caps parser-service endpoint growth; prevents API sprawl. 
#3038 CI topology .github/workflows, required/advisory checks Maps and rationalises CI workflows, distinguishing blocking, advisory, scheduled, manual and archive. 
#3040 E2E contracts Playwright / critical journeys Turns E2E coverage from file-exists into journey-executed runtime proof. 
#3041 iKant E2E deferred Playwright iKant specs Schedules or correctly defers 6 iKant specs; avoids smoke-test false green. 
#3042 Critical journeys PR-blocking E2E Defines PR-blocking critical journeys, including D1/D2/Artifact proof paths. 
#3044 Live-stack proof matrix local / PR / nightly / provider-real Defines real/mock backend, mock/real provider, seed and trigger matrix. 
#3045 D1-D5 canonical path frontend pipeline, hooks, backend pipeline Canonicalises one D1-D5 path and tombstones alternate/legacy paths. 
#3046 Side-effect scanner AST scanner, timers, singletons, globals Audits setInterval, module-level singleton allocation and unsafe globals. 
#3047 Control plane aosp.sh, npm scripts, docker/devcontainer Elects/simplifies startup/verify/reset path; archives dormant scripts. 
#3048 Support truth active/dormant/dead/archaeological registry Reconciles support status of surfaces into one truth. 
#3050 Classification registry CLASSIFICATION_REGISTRY, generated/advisory docs Makes registry derived, verified or explicitly advisory. 
#3051 Runtime ontology docs README, ARCHITECTURE, DecisionLog Rewrites active docs on runtime ontology; removes semantic legacy. 
#3052 Authority conflicts .ikant, .github, blueprints, vision docs Resolves blueprint/document authority conflicts and high-visibility stale docs. 
#3053 Legacy purge dead/dormant semantic leftovers Tombstones/removes dead or valueless dormant surfaces; archives design value. 
#3054 Semantic anti-drift authority matrix, generated docs, topology Anti-drift pipeline for docs, topology, inventory and E2E reports. 
#3056 Agent-layer authority .agent/, .ai/, meta-governance Classifies agent/AI directories by tier, owner and write access. 
#3077 Perimeter map moat/custom/substrate/delete map Classifies every surface as moat-custom, substrate-standard or to-delete. 
#3078 Hybrid architecture ADR DecisionLog / ADR Formalises hybrid architecture: custom moat + standard substrate. 
#3079 FS SDK useFilesystem, atom/stripe SDK Extracts filesystem abstraction into @aosp/fs-sdk. 
#3080 App SDK app manifest, lifecycle, sandbox Publishes @aosp/app-sdk for app manifests, lifecycle hooks and sandbox boundary. 
#3081 Enterprise auth Keycloak / SSO Replaces custom JWT with Keycloak SAML/OIDC/SCIM. 
#3082 Authorization Cerbos / ABAC / SoD Replaces custom RBAC with ABAC/SoD policy engine. 
#3083 Audit WORM audit trail, Postgres hash chain Makes audit trail append-only and hash-chained. 
#3084 Evidence store MinIO / Object Lock Introduces WORM-compatible evidence storage with S3 Object Lock. 
#3085 Workflow engine Camunda BPMN Integrates human-in-loop GRC approval workflow. 
#3086 Secrets Vault Replaces .env/SOPS with HashiCorp Vault. 
#3087 Observability OTel, Grafana, traces/logs/metrics Standardises monitoring and incident response on OTel/Grafana. 
#3088 Substrate matrix compatibility / version pinning / SLA Generates substrate compatibility matrix and adapter SLAs. 
#3089 Adapter tests substrate adapters Adds contract, integration and failure-mode tests for substrate adapters. 
#3090 GRC mapping moat MONL, compliance frameworks Multi-framework mapping engine for GDPR/NIS2/ISO/SOC2/DORA/AI Act. 
#3091 Control library seed controls Seeds about 500 pre-authored compliance controls. 
#3092 Risk quantification FAIR-lite / Monte Carlo Quantitative-risk module with simulations. 
#3093 Regulatory feed reg-tech / official RSS feeds Regulatory horizon scanning via official or provider feeds. 
#3094 E-signature evidence lifecycle / 21 CFR / eIDAS Evidence signatures with re-auth, hash-chain and optional QES provider. 
#3095 Multi-tenant isolation DB schema, bucket, realm Hard tenant isolation: DB schema, MinIO bucket, Keycloak realm. 
#3096 Data residency EU/US/APAC deploy templates Deployment templates for data residency. 
#3100 App store registry, signing, review queue Production app store for third-party apps with signing and sandbox hardening. 
#3102 GRC enterprise epic 12-month Scenario C plan Enterprise GRC readiness epic coordinating substrate, moat and timeline. 
#3392 Governance base governance contract / inventory Single Governance Contract + total inventory; real vs advisory checks. 
#3393 Governance orchestrator PR/governance orchestration Centralised governance orchestrator for assessment outputs, checks and summaries. 
#3394 PR Bot Summary PR-facing governance Makes PR Bot Summary the single PR-facing summary. 
#3395 Typed docs docs as typed nodes Types docs as canonical, operational, generated, advisory, archive. 
#3396 Governance cutover fake/legacy surfaces Final cutover to governance framework; removes fake/legacy surfaces. 
#3420 EQL meta EQL v2 program EQL tracker, DAG, ADR and hard gates. 
#3424 EQL virtual views _stripe_, _receipt_, _phase_, _lineage_ Implements proof-aware virtual views. 
#3425 EQL receipt schema EQLRunResult, EQLQueryReceipt, service stub Introduces envelope/schema for EQL results and receipts. 
#3426 EQL route unification parser-service EQL routes Routes all EQL through eqlQueryService, with no bypass. 
#3427 EQL hash/receipt canonicalisation, eql_query_ Computes deterministic hashes and writes EQL receipts. 
#3428 EQL UX Shell/Finder/Workstation Deterministic UX: parse, support, scope, valid-zero/error and proof status. 
#3429 EQL analytic/lineage analyze / trace Adds analytics and lineage without SQL sprawl. 
#3430 EQL final convergence proof scripts, fixtures, CI Closes EQL v2 with proof runner, fixtures, chaos, CI and cleanup. 
#3431 EQL anti-goals no SQL sprawl, no global proof Hardens anti-goals: no full SQL, no implicit global proof query. 
#3434 Oracle M9 prompt/config registry Versioned iKant/Oracle prompts editable from UI. 
#3435 Oracle M10 transition fabric Traceable cross-app iKant/Oracle transitions. 
#3436 Oracle M11 governance workbench Advanced workbench for profile/observer/kernel/policy. 
#3437 Oracle M12 capstone E2E Oracle capstone: E2E, UX polish, cleanup, propagation and proof pack. 
#3445 Error Truth E1 AOSPErrorEnvelope Canonical error envelope and lossless projections. 
#3446 Error Truth E2 request attribution Deterministic UI to backend to Observatory to audit attribution. 
#3447 Error Truth E3 app adoption Migrates apps to Error-Truth contract. 
#3448 Error Truth E4 UI language User-facing errors carry status, cause, scope, proof and recovery. 
#3449 Error Truth E5 forensic exports Forensic-grade ErrorHistory, Audit Trail, Dashboard and /errors. 
#3450 Error Truth E6 AI clustering AI-assisted but deterministic-first error clustering. 
#3451 Error Truth E7 local hardening Local hardening: voice, LLM config, Observatory, polling/backoff. 
#3462 D1 proof runtime DataIntake / D1 proof seam D1 proof runtime: append/readback and proof-grade DataIntake seam. 
#3465 Oracle capstone audit post-M12 hardening Audits Oracle Saga capstone and post-M12 plan. 
#3466 Oracle M8ter UI/UX exposure baseline Oracle UI/UX baseline and anti-false-green hardening.

## Page 9

A-OSP1 Technical Due Diligence v1-live · posture/candidate · main@e492290b 
#3470 DoC / Living Contracts Milestone Ledger / MVP chain Governance control tower for convergence and proof chain. 
#3471 D2-D5 receipts PhaseReceipt / PipelineReceipt Receipts and lineage for D2-D5. 
#3472 Artifact Witness ArtifactWorkstation / witness ArtifactWitness MVP; export is not witness. 
#3473 Proof Spine MVPProofBundle Proof spine validator fails honestly when artefacts are missing. 
#3483 UI grammar product-facing labels/layout/copy Canonical UI grammar preventing copy/layout from faking proof. 
#3484 MONL-TX transaction membrane MONL proof-aware transaction engine: event accepted is not committed. 
#3485 Entropy scaffold deterministic convergence Saga map, entropy rules, agent contract and false-equivalence detection. 
#3486 MVP readiness backlog canonical issue map Ordered map of non-post-MVP issues; monitors proof sequence. 
#3487 C0 convergence corpus authority / cleanup preflight Authority, legacy discovery and generated-docs policy before runtime proof. 
#3488 C1 convergence D1/EQL proof seam D1/EQL checkpoint: D1Receipt, readback, proofSessionContext, EQL receipt/scope. 
#3489 C2 convergence D2-D5 receipt chain Converges D2-D5 with receipts/readback/lineage. 
#3490 C3 convergence ArtifactWitness / Proof Spine / Governance Final proof composition: no UI/export/progress as proof. 
#3491 C4 convergence UI / Error Truth / UX sanitation UI, errors, labels and empty states must not appear as proof. 
#3492 C5 convergence MONL / perimeter / substrate Conditional checkpoint over MONL, perimeter and substrate quarantine. 
#3493 Agent drift control governance grammar Harmonises Entropy, Convergence, agent governance, CI/CD and PR bots. 
#3542 D1 vertical slice D1Receipt E2E loop Minimal input->append->persist->readback->consume loop. 
#3543 D1 receipt adapter persist/readback + useD1ProofStatus Emits d1_receipt_ and makes it readable by proof-status hook. 
#3544 CanonicalAppendSDK wire D1 append proof-grade Routes every proof-grade D1 append through canonical SDK. 
#3545 Strict proof mode fallback/mock/demo fail-closed Blocks fallback, mock and demo from counting as proof. 
#3546 CompletionModal gate D1->D2 UI gate No D2 path unless D1Receipt is PASS. 
#3547 proofSessionContext D1->EQL->D2 context Propagates traceable context ID across D1, EQL and D2. 
#3548 D1 receipt EQL bridge _receipt_, EQLQueryReceipt Makes d1_receipt_ queryable and connected to EQL scoped receipt. 
#3549 D1->D2 barrier /handoff Hard-gates D2 handoff on D1Receipt PASS. 
#3550 D1 attack tests 13 false-green vectors Automated fail-closed tests against false-green vectors. 
#3551 D1 validated != proof validated=true regression Ensures validated=true never becomes proof without receipt. 
#3552 Fixture/runtime separation CI proof artefacts Separates runtime receipts from fixtures; no fixture-as-proof. 
#3553 D1 golden E2E PR-blocking proof journey Golden runtime journey with real proof artefacts. 
#3554 Lint governance no-duplicate-scroll Stale lint rule: promote, delete or formally extend. 
#3555 Lint governance no-cursor-text-on-containers Governance for stale lint rule older than 60 days. 
#3558 D1 follow-up meta D1-FU.1..10 retirement Epic to retire documented-but-unproven D1 self-debt. 
#3560 D1FU-B tests skip->fail + DI No defensive skips; no test-only global resets. 
#3561 D1FU-C CI guards guard convergence Converges lint/guard CI: emoji lint, D-030 dedupe, guards, KC fixed-point. 
#3562 D1FU-D governance SoT role-bypass ADR + one-pager Moves bypass and one-pager runnability into authoritative sources. 
#3580 CI nondeterminism Vitest forks teardown race Fixes nondeterministic Vitest assessment outputs with JSON reporter/sharding/OOM.
