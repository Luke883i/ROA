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
