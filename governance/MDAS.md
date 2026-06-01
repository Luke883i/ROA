# MDAS — Minimum Deterministic Agentification Set

> **Horizon.** This document formalises the **minimum, deterministic, robust,
> scalable, persistent** set of artifacts that make the RLA-ECNN / ROA repository
> *iKant-agentified* repo-wide. Binding entrypoint: [`../AGENTS.md`](../AGENTS.md).
> `MDAS_VERSION: 2.0.0`.

The corpus argues that an answer is not a proof and an output is not a witness
(README §3.6, §8). The same discipline is applied here to **agent identity**:
any call/response, inbound or outbound, must provably incarnate iKant, and that
incarnation must be **auditable, versioned, and rollbackable**.

---

## 1. The fixed MDAS artifact list

These artifacts are the *minimum* fixed set. Removing any one is a regression
(`DUE-TEST`). Each maps to a ROA epistemic/governance function.

| ID | Artifact | Path | ROA function |
|---|---|---|---|
| MDAS-1 | iKant binding / bootstrap | `AGENTS.md` | iKant: decision, format, anti-injection |
| MDAS-2 | This set + architectures + DoD + metrics | `governance/MDAS.md` | A-OSP: artifact/export discipline |
| MDAS-3 | Append-only decision / truth source | `governance/DecisionLog.md` | CRC: horizon/bounds, feasibility |
| MDAS-4 | Agentified API-call example | `governance/examples/agentified_api_call.md` | A-OSP: witness/readback |
| MDAS-5 | Rollback / fallback scenario | `governance/examples/rollback_scenario.md` | ROA: rollback, debt propagation |
| MDAS-6 | Deterministic incarnation test | `governance/incarnation_test.py` | ECNN: state classification (pass/DEBT) |
| MDAS-7 | Incarnation CI pipeline | `.github/workflows/ikant-incarnation.yml` | iKant: enforced incarnation gate |
| MDAS-8 | Corpus claim discipline & map | `README.md` §1,§4,§5,§8 | RLA: bounded observation grammar |

**Binding precedence:** `DecisionLog.md` (truth) → `AGENTS.md` (rules) →
`MDAS.md` (set) → examples/tests. Lower layers may never override higher ones.

---

## 2. Two agentification architectures

Both pipelines route every call/response through the iKant identity. They are
complementary, not exclusive: A is the always-on default, B is the enforcement
gate.

### Architecture A — File-bound agent bootstrapping (default, local)

```text
agent opens repo
   -> reads AGENTS.md  (MDAS-1)         [trigger]
   -> loads 4-layer façade               [identity]
   -> registers ART-0001, ART-0002       [bootstrap]
   -> every answer emits SPEAK + DEBUG    [contract]
   -> trace/xref preserved across turns   [continuity]
```

- **Binding mechanism:** convention `AGENTS.md` + bootstrap section (§24 of the
  meta-prompt). Zero infrastructure; works for any assistant that honours
  `AGENTS.md`.
- **Strength:** deterministic, persistent, no runtime dependency.
- **Limit:** relies on the agent honouring the file; cannot *force* a hostile or
  unaware caller. That gap is covered by Architecture B.

### Architecture B — Agentic middleware / decorator (enforcement, local + remote)

```text
inbound call ──> [iKant middleware] ──> handler ──> [iKant middleware] ──> outbound response
                      │                                   │
                      ├─ inject AGENTS.md persona          ├─ assert SPEAK/DEBUG contract
                      ├─ run anti-injection gate           ├─ assert trace metadata
                      └─ stamp DEBUG.TRACE                  └─ else: emit DEBT + block/fallback
```

- **Binding mechanism:** a wrapper/decorator/middleware (or env var
  `IKANT_AGENT=1`) that (1) prepends the `AGENTS.md` persona to the prompt and
  (2) validates the response against the contract before it leaves the boundary.
- The validation logic is exactly what `governance/incarnation_test.py` encodes,
  so middleware and CI share one source of truth.
- **Strength:** enforces incarnation even for API/CI/bot/plugin callers.
- **Limit:** only governs calls that pass through the boundary (see Scope-out).

```text
ENV CONTRACT
  IKANT_AGENT=1                 # enable enforcement
  IKANT_MODE=audit|clean|micro  # default density (corpus default: audit)
  IKANT_AGENTS_FILE=AGENTS.md   # persona source of truth
```

---

## 3. Versioning, rollback, legacy absorption

- **Versioning.** `AGENTS_VERSION` / `MDAS_VERSION` use semver. A change to the
  output contract or non-negotiable rules is a **major** bump and requires the
  concept-coverage checklist (§7) to pass.
- **Update logic.** Edit `AGENTS.md`/`MDAS.md` → create/modify an `ART`/`RB` →
  record the decision in `DecisionLog.md` → re-run `incarnation_test.py`.
- **Rollback.** A wrong/over-broad rule is superseded via
  `rollback: RB-xxxx supersedes ART-yyyy -> ART-zzzz`, logged in `DecisionLog.md`,
  with the prior version recoverable from git history.
- **Legacy absorption.** Old prompts/rules are absorbed by **function, not
  wording**: `PATTERN -> FUNCTION -> RISK -> CLASS(KEEP|COMPRESS|UPGRADE|DISCARD)
  -> FRAMEWORK MAP(RLA|CRC|ECNN|ROA|A-OSP|iKant) -> ABSORPTION RULE -> TEST`. Each
  absorbed pattern gets a `LEG-xxxx` pointing to a target `ART`. Missing legacy
  text ⇒ `DUE-SRC`; missing mapping ⇒ `DUE-LEGACY`; missing test ⇒ `DUE-ABSORB`.

---

## 4. Definition of Done (DoD)

- [ ] Agentification is repo-wide, **tracked**, **testable**, and README-documented.
- [ ] Every agentified call/response is annotated and traceable via DEBUG
      (`iter`/`msg`/`prev`/`xref`).
- [ ] Agentic artifacts are versioned and rollbackable (semver + `DecisionLog.md`
      + git history).
- [ ] Failure simulations (a non-agentified call → `DEBT`/`DUE`) are **detected
      and motivated** by `incarnation_test.py` and the CI gate.
- [ ] The concept-coverage checklist (§7) passes before any binding change is
      declared complete.

---

## 5. Success metrics

| Metric | Definition | Target |
|---|---|---|
| **Agentification coverage** | agentified calls / total observable calls | ≥ 95% of boundary calls |
| **Incarnation tests run/passed** | green runs of `incarnation_test.py` | 100% on `main` |
| **Pipeline failure rate** | failed CI incarnation runs / total | trend → 0 (real regressions only) |
| **DEBUG/SPEAK clarity** | responses with valid headers + hierarchical DEBUG | 100% of agentified responses |
| **DEBT detection latency** | a non-agentified response flagged at first check | immediate (single test run) |

---

## 6. Scope-out (explicitly NOT covered)

- Agentification of external black-box models that cannot be wrapped or observed.
- Orchestration beyond the repository boundary with no agentic interface.
- Any claim that incarnation equals proof, certification, or production readiness
  (forbidden by README §8 and AGENTS.md rule 8).

---

## 7. Concept-coverage checklist (run before any binding change)

```text
[ ] SPEAK and DEBUG mandatory
[ ] DOS-like headers verbatim
[ ] DEBUG bullet-pointed and hierarchical
[ ] titles uppercase/bold/italic
[ ] short separators only / readable layout
[ ] clean SPEAK / DEBUG = safe state, not chain-of-thought
[ ] iter / msg / prev mandatory
[ ] horizon, bounds, rla, epistemic, decision fields available
[ ] ART IDs with type/state/role/use/avoid/xref
[ ] LEG IDs + legacy absorption pipeline
[ ] xref mandatory; message/artifact/legacy traceability
[ ] modes micro/clean/standard/audit/rollback/legacy_absorption
[ ] DEBT + DUE rules (incl. DUE-TRACE/SIM/ART/EXPORT/LEGACY/ABSORB)
[ ] rollback / supersession rule
[ ] export discipline (answer != proof)
[ ] overclaim / reification / continuity guards
[ ] simple conversation stays usable; audit mode stays expressive
[ ] DEBUG never becomes a second answer
```

If any box fails, the binding is **not** complete.

---

## 8. Audit / debug checklist (final validation)

Run a full-audit DEBUG before merging an agentification change:

1. `TRACE` present and consistent (`iter`/`msg`/`prev`/`xref`).
2. `HORIZON`/`bounds` declared; no overclaim.
3. `ARTIFACTS` updated (`ART`/`RB`/`LEG` as needed).
4. `DEBT / DUE` empty or justified; no **blocking** debt left open.
5. `ROLLBACK` path recorded for any superseded rule.
6. `SIMULATION` (SIM-01…SIM-14) pass — encoded in `incarnation_test.py`.
7. `EXPORT` declared (`prompt_patch` / `rollback_record` / `artifact_manifest`).
8. `NEXT` defines the following task (recursive imperative).
