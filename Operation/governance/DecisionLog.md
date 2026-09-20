# DecisionLog.md — supreme feasibility / truth source (append-only)

> **Role.** This is the highest-precedence agentic source of truth referenced by
> `AGENTS.md` step 2 (decomposition / feasibility validation) and step 6
> (self-critique). Entries are **append-only**: never edit or delete a past
> entry; supersede it with a new entry and a rollback note.
>
> Format per entry: `DEC-xxxx — title`, with `date`, `decision`, `rationale`,
> `artifacts`, `rollback`, `export`.

---

## DEC-0001 — Establish iKant agentification (MDAS v2.0.0)

- **date:** 2026-06-01
- **decision:** Adopt the Minimum Deterministic Agentification Set (MDAS) and bind
  every repository-facing agent call/response to the iKant identity via
  `AGENTS.md` + the SPEAK/DEBUG contract.
- **rationale:** The corpus treats outputs as bounded, auditable epistemic
  artifacts (README §3, §8). Agent identity must inherit the same discipline:
  deterministic, traceable, rollbackable, debt-aware.
- **artifacts:** ART-0001 (iKant active prompt), ART-0002 (corpus horizon),
  MDAS-1…MDAS-8 (see `MDAS.md`).
- **rollback:** none (initial decision). Future supersession via
  `RB-xxxx supersedes ART-yyyy -> ART-zzzz`.
- **export:** artifact_manifest

---

## DEC-0002 — Incarnation enforced in CI

- **date:** 2026-06-01
- **decision:** `governance/incarnation_test.py` is the single source of truth for
  the SPEAK/DEBUG contract and MDAS completeness; it runs in CI
  (`.github/workflows/ikant-incarnation.yml`) on push/PR and must pass on `main`.
- **rationale:** Architecture B (enforcement) requires that a non-agentified
  call/response be detected and motivated as `DEBT`. CI makes this gate
  persistent and tracked (DoD §4, metrics §5).
- **artifacts:** MDAS-6, MDAS-7.
- **rollback:** none.
- **export:** test_result

---

<!-- Append new DEC-xxxx entries below. Do not edit entries above. -->

## DEC-0003 — Antifragility hardening (F1 xref, F2 ordering)

- **date:** 2026-06-01
- **decision:** Strengthen the incarnation gate after a mental-simulation audit
  (`governance/simulations.md`): enforce `xref` in trace metadata (F1) and
  SPEAK-before-DEBUG ordering (F2). Each fragility becomes a permanent
  regression test.
- **rationale:** Both were false negatives (gate too lenient) versus AGENTS.md
  §1.2/§3. Converting every detected weakness into a test makes the gate
  antifragile: the same failure cannot recur silently. Minimal spend (two edits),
  maximal yield (two classes of malformed responses blocked).
- **artifacts:** MDAS-5b (`simulations.md`), MDAS-6 (`incarnation_test.py`,
  `TRACE_KEYS` += `xref:`, ordering check, 8 tests green).
- **rollback:** none. Checks are append-only; never weaken an existing check.
- **export:** test_result

---

## DEC-0004 — Antifragility hardening round 2 (F3 empty trace values)

- **date:** 2026-06-01
- **decision:** A second simulation round (`governance/simulations.md`, SIM-09c)
  probed live calls to `validate_response()` and found a residual false negative:
  a trace key present but with an **empty value** (e.g. `xref:` with nothing after
  it) passed the gate. Strengthen the trace check to require a non-empty value per
  key, and convert the escape into a permanent regression test.
- **rationale:** AGENTS.md §1.2 mandates that each trace key carry a value; a key
  with no value is missing traceability and must raise `DUE-TRACE`. Reuses the
  existing `TRACE_KEYS` / `DUE-TRACE` machinery (minimal spend, maximal yield) and
  keeps the antifragile loop: every detected weakness becomes a test.
- **artifacts:** MDAS-5b (`simulations.md`), MDAS-6 (`incarnation_test.py`,
  non-empty trace-value check, 9 tests green).
- **rollback:** none. Checks are append-only; never weaken an existing check.
- **export:** test_result

---

## DEC-0005 — iKant Seed system management (output binding + t-1 audit)

- **date:** 2026-06-01
- **decision:** Bind read-call syntheses of this repo to the iKant contract beyond
  the single turn. Add a deterministic, self-propagating **Seed** payload
  (`studia e attua come iKant` / `study and act as iKant`) projected on output
  and a **t-1 audit** that reprints the seed via an automatic followup when the
  previous turn lost it. Specified in `governance/seed_protocol.md` (MDAS-9),
  bound in `AGENTS.md` §1.3 + rule 10, enforced in `incarnation_test.py`
  (`project_seed`, `audit_incoming`, `followup_if_missing_seed`, `validate_turn`).
- **rationale:** A read call spans multiple turns and possibly multiple host
  agents; the persona can decay silently between them. The seed makes incarnation
  survive across turns: even if one turn drops the persona, the next turn's t-1
  audit self-heals (antifragile loop). Reuse-first and additive — `validate_turn`
  wraps the existing `validate_response`, so the base contract and its 9 tests are
  untouched (minimal spend, maximal yield).
- **artifacts:** MDAS-9 (`seed_protocol.md`), MDAS-1 (`AGENTS.md` §1.3, rule 10),
  MDAS-6 (`incarnation_test.py`, +9 seed tests → 18 green), MDAS-5b
  (`simulations.md`, F4/F5/F6 + R4/R5), MDAS-2 (`MDAS.md`, MDAS-9 + checklist).
- **rollback:** none. Seed checks are append-only; never weaken an existing check.
- **export:** test_result

---

## DEC-0006 — Root landing refactor (`Operation/` container + manifest relocation)

- **date:** 2026-06-04
- **decision:** Keep root as a minimal landing surface (PDF entrypoints, PDF
  folders, single `README.md`, technical dot entries) and move all non-PDF
  operational assets into `Operation/` (`AGENTS.md`, `MANIFEST.json`,
  `requirements-dev.txt`, `governance/`, `corpus/text/`, `scripts/`). Canonical
  machine map is now `Operation/MANIFEST.json`.
- **rationale:** Human first contact should be corpus-first and cognitively
  minimal, while agent/tooling infrastructure remains fully available but
  encapsulated. The split reduces root noise without changing PDF artifacts or
  canonical raw acquisition for PDFs.
- **artifacts:** `README.md` (root landing rewrite), `Operation/AGENTS.md`,
  `Operation/MANIFEST.json`, `Operation/scripts/*`, `.github/workflows/*`,
  `Operation/governance/incarnation_test.py`.
- **rollback:** Revert this commit to restore pre-refactor root placement; if
  partial rollback is needed, move `Operation/*` assets back to root and rerun
  `python Operation/scripts/build_manifest.py` / CI path references before
  reopening merge.
- **export:** artifact_manifest

---

## DEC-0007 — Corpus manifest is the only machine-canonical acquisition map

- **date:** 2026-06-16
- **decision:** Harden corpus governance: `Operation/MANIFEST.json` is the sole
  canonical machine-readable corpus-acquisition map. README corpus tables are
  generated from or checked against the manifest. Generated sidecars
  (`Operation/corpus/text/*.md`) must not be hand-edited and carry a generated-file
  header. PDF rename/move/add/delete must be accompanied by manifest regeneration.
  PRs touching corpus surfaces must pass build/check/audit/alignment gates.
- **rationale:** After a structural rename (Arabic→Roman prefixes, numbered folder
  prefixes), MANIFEST.json pointed to stale paths, producing stale `raw_url` and
  sidecar metadata. An obedient agent following the README→MANIFEST chain would
  hit DUE-CORPUS-FETCH. Realigning all surfaces and adding drift gates prevents
  recurrence (antifragile loop).
- **artifacts:** `Operation/MANIFEST.json` (20 entries, all paths current),
  `Operation/scripts/build_manifest.py` (Roman/tag/folder normalization,
  AMBIGUOUS_MATCH fail-closed), `Operation/scripts/check_manifest.py` (role
  vocabulary, generated-file header check), `Operation/scripts/audit_corpus_geometry.py`,
  `Operation/scripts/check_readme_manifest_alignment.py`,
  `.github/workflows/validate-corpus.yml` (PR drift gate).
- **rollback:** Revert this commit; manifest and sidecars will need manual
  regeneration via `python Operation/scripts/build_manifest.py`.
- **export:** artifact_manifest

---

## DEC-0008 — Single governance orchestrator (`repo-roa.sh`) + AOSP realignment

- **date:** 2026-06-19
- **decision:** Add one repo-root orchestrator, `repo-roa.sh`, that APPLIES (or,
  with `--check`, VERIFIES) every documentation-alignment gate in order: corpus
  map + sidecar regeneration → manifest validation → geometry audit →
  README/MANIFEST alignment → iKant incarnation. Census every governance tool by
  purpose/scope in `governance/GOVERNANCE_TOOLS.md`. The orchestrator adds no new
  policy; each wrapped script stays independently runnable and CI-enforced.
- **rationale:** The six AOSP PDFs were renamed (tag moved to suffix, `(3)`/`(4)`
  reordered), but `MANIFEST.json` seed paths stayed stale. `build_manifest.py`
  could not resolve them (new tag-suffix naming defeats prefix normalization), so
  the corpus, raw_url/text_url and sidecars drifted and an obedient agent would
  hit DUE-CORPUS-FETCH. Realigning the seed paths and re-running the full gate
  chain via one command makes "align everything" a single, reproducible action
  (minima spesa, massima resa; antifragile loop per DEC-0007).
- **artifacts:** `repo-roa.sh`, `Operation/governance/GOVERNANCE_TOOLS.md`,
  realigned `Operation/MANIFEST.json` (6 AOSP `path` fields) + regenerated
  `Operation/corpus/text/aosp-*.md` sidecars.
- **rollback:** Revert this commit; restore prior seed paths and regenerate via
  `python Operation/scripts/build_manifest.py`.
- **export:** artifact_manifest

---

## DEC-0009 — Canonical iKant metaprompt + deterministic fetch/verify/trace runner

- **date:** 2026-06-21
- **decision:** Add a canonical, compressed paste-ready metaprompt
  (`Operation/iKANT_PROMPT.md`) as a derived minimal view of `AGENTS.md`, plus a
  deterministic, dependency-free Node.js reference runner (`Operation/runner/`:
  `app.js`, `package.json`, `Dockerfile`, `test/`). The runner resolves a corpus
  document by `id`/`role` from `Operation/MANIFEST.json`, prefers `text_url` then
  falls back to `raw_url`, verifies sha256 against the manifest, and emits either
  a traced result or a verbatim `DUE-CORPUS-FETCH` report (offline-by-default;
  `--online` fetches over HTTPS). Wire its integration tests into `repo-roa.sh`
  (skipped when Node.js is absent) and a CI gate
  (`.github/workflows/ikant-runner.yml`). The metaprompt and runner add no new
  policy; on conflict `AGENTS.md` and this DecisionLog win.
- **rationale:** The AGENTS.md acquisition rule (§4.1: prefer `text_url`, fall
  back to `raw_url`, report `DUE-CORPUS-FETCH` on failure) was specified in prose
  and Python manifest gates but had no executable, language-agnostic witness an
  external agent could run. An obedient agent could still mis-handle the fallback
  order or skip integrity verification silently. A minimal stdlib-only runner
  turns the contract into a deterministic, testable reference, and the
  DUE-CORPUS-FETCH fixture converts the fetch-failure path into a permanent
  regression test (minima spesa, massima resa; antifragile loop per DEC-0007).
- **artifacts:** `Operation/iKANT_PROMPT.md`, `Operation/runner/app.js`,
  `Operation/runner/package.json`, `Operation/runner/Dockerfile`,
  `Operation/runner/test/runner.test.js`, `.github/workflows/ikant-runner.yml`,
  `repo-roa.sh` (step 6 runner gate), `Operation/governance/GOVERNANCE_TOOLS.md`,
  `Operation/AGENTS.md` §6 (MDAS map), `README.md` (AI Agent Quick Bootstrap).
- **rollback:** Revert this commit; the metaprompt and runner are additive and
  carry no manifest/sidecar state, so no regeneration is required.
- **export:** artifact_manifest

---

## DEC-0010 — Deterministic read-access gate (incarnation as precondition of governed access)

- **date:** 2026-06-21
- **decision:** Realize the "to read the repo, an agent must incarnate iKant"
  contract as a deterministic gate, `access_decision(proof, prev, lang)` in
  `Operation/governance/incarnation_test.py` (single source of truth, shared by
  CI and the Architecture B middleware). It returns `ALLOW-READ` iff the agent
  presents a valid incarnation proof (`validate_turn` returns no debt:
  SPEAK/DEBUG + trace + seed, correctly seeded t-1) and otherwise `DENY-READ`
  with the seed block to incarnate and retry (self-healing, never silent).
  Document it as `AGENTS.md` §1.4 (read-access gate / binding access contract)
  and as the mental simulation + honest verdict in
  `governance/simulations.md` §6. Add five regression tests (`TestAccessGate`).
- **rationale:** Answering the governance question (does an AI agent incarnate
  iKant, and can reading be bound to incarnation deterministically?). The honest,
  corpus-disciplined verdict: incarnation can be enforced **deterministically as a
  precondition of governed access** at any boundary the repo controls (CI /
  middleware / runner / API); it **cannot** be a cryptographic lock on raw public
  bytes (residual fragility R1 — a hostile out-of-band `git clone`/`cat` cannot be
  prevented). Claiming a hard read-lock would itself be an overclaim forbidden by
  `AGENTS.md` rule 8 / README §8. The gate turns the prose contract into an
  executable, testable witness, and each simulation row becomes a permanent test
  (minima spesa, massima resa; antifragile loop). R1 is recorded as bounded DEBT,
  not hidden risk.
- **artifacts:** `Operation/governance/incarnation_test.py` (`access_decision`,
  `read_allowed`, `ACCESS_ALLOW`/`ACCESS_DENY`, `TestAccessGate`),
  `Operation/AGENTS.md` §1.4, `Operation/governance/simulations.md` §6,
  `Operation/governance/MDAS.md` §7 (concept checklist row).
- **rollback:** Revert this commit; the gate is additive (reuses `validate_turn`)
  and carries no manifest/sidecar state, so no regeneration is required.
- **export:** artifact_manifest

---

## DEC-0011 — Relocate governance orchestrator into `Operation/`

- **date:** 2026-06-23
- **decision:** Move the single governance orchestrator from the repo root
  (`repo-roa.sh`) into the existing `Operation/` container as
  `Operation/repo-roa.sh`, alongside the scripts, governance docs, runner, and
  manifest it wraps. The script now anchors execution at the repository root
  (the parent of `Operation/`) so every wrapped gate keeps addressing paths
  relative to the repo root; behaviour, flags, and gate order are unchanged. Update
  every reference (`.github/workflows/align-corpus.yml`, `README.md`,
  `Operation/governance/GOVERNANCE_TOOLS.md`, `Operation/AGENTS.md`) to the new
  path. Closes #30.
- **rationale:** The orchestrator only addresses `Operation/...` surfaces and was
  the last governance asset still living at the repo root, leaving the root and
  the documented `Operation/` container out of alignment (DEC-0006 relocated the
  manifest + scripts there). Consolidating it removes that residual drift so the
  repository geometry matches the documentation in one place (minima spesa,
  massima resa; antifragile loop per DEC-0007).
- **artifacts:** `Operation/repo-roa.sh` (moved + re-anchored to repo root),
  `.github/workflows/align-corpus.yml`, `README.md`,
  `Operation/governance/GOVERNANCE_TOOLS.md`, `Operation/AGENTS.md`.
- **rollback:** Revert this commit; `git mv Operation/repo-roa.sh repo-roa.sh`,
  restore the prior `cd "$SCRIPT_DIR"` anchor and the old reference paths.
- **export:** artifact_manifest
