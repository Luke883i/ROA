# Simulations — iKant incarnate effectiveness & antifragility audit

> **Horizon.** Mental-simulation run of the iKant incarnation system against the
> meta-prompt simulation suite (SIM-01…SIM-14), an effectiveness verdict, the
> fragilities found, and the minimal fixes applied. Binding: [`../AGENTS.md`](../AGENTS.md).
> Enforcement source of truth: [`incarnation_test.py`](incarnation_test.py).
>
> **Antifragility rule.** Every fragility discovered here is converted into a
> permanent regression test in `incarnation_test.py`. The gate gets *stronger*
> from each detected weakness — minimal spend, maximal yield.

---

## 1. Mental simulation matrix

| SIM | Input | Expected | Enforced by | Verdict |
|---|---|---|---|---|
| 01 casual | "Come stai?" | MICRO DEBUG, SPEAK natural, TRACE present | layout + trace checks | pass |
| 06 audit | corpus/framework review | AUDIT DEBUG, artifacts/xref/debt | layout + trace + xref | pass |
| 08 brevity | "rispondi breve" | SPEAK concise, DEBUG still present | DUE-LAYOUT if DEBUG dropped | pass |
| 09 trace failure | response without `xref` | DUE-TRACE | `TRACE_KEYS` incl. `xref:` (**F1 fix**) | pass |
| 09c empty trace | trace key with empty value | DUE-TRACE | non-empty value check (**F3 fix**) | pass |
| 12 layout failure | bare dense answer | DUE-LAYOUT + DUE-TRACE | layout + trace checks | pass |
| — order failure | DEBUG before SPEAK | DUE-LAYOUT | ordering check (**F2 fix**) | pass |
| 07 overclaim | "...is proven" in SPEAK | DUE-RISK | `OVERCLAIM_PATTERNS` | pass |
| S1 first turn | `prev=None` | no t-1 debt | `audit_incoming(None)` | pass |
| S3 persona decay | t-1 missing seed | DUE-SEED + reprint | t-1 audit (**F5 fix**) | pass |
| S5 EN context | invoking agent EN | EN seed payload | `render_seed("en")` | pass |
| S7 double project | seed already present | idempotent, no dup | `project_seed` (**F6 fix**) | pass |

`incarnation_test.py` encodes the rows above as deterministic, dependency-free
tests (18 cases, all green).

---

## 2. Effectiveness verdict

- **Robust:** the contract (SPEAK/DEBUG + `iter/msg/prev/xref` + overclaim guard)
  is checked by a single deterministic function reused by CI and the
  Architecture B middleware — one source of truth, no drift.
- **Minimal:** zero runtime dependencies; pure stdlib; ~one function.
- **Scalable:** new guards are added as one pattern/key + one regression test;
  the SIM matrix grows monotonically.
- **Antifragile:** each detected fragility becomes a permanent test, so the same
  failure cannot recur silently.

---

## 3. Fragilities found and fixed (this audit)

| ID | Fragility | Class | Fix | Regression test |
|---|---|---|---|---|
| F1 | `xref` mandated by AGENTS.md but not enforced → SIM-09 escape (false negative) | trace gap | add `xref:` to `TRACE_KEYS` | `test_missing_xref_creates_debt` |
| F2 | `:: DEBUG` before `:: SPEAK` passed and mis-parsed the regions | layout gap | enforce SPEAK-before-DEBUG ordering | `test_debug_before_speak_creates_debt` |
| F3 | a trace key present but with an **empty value** (e.g. `xref:` with nothing after) passed → SIM-09c escape (false negative) | trace gap | require a non-empty value per key | `test_empty_trace_value_creates_debt` |
| F4 | persona decays between turns / across host agents (no cross-turn binding) | continuity gap | outgoing seed projection (`project_seed`) | `test_project_seed_adds_payload`, `test_good_turn_is_valid` |
| F5 | an unseeded prior turn was undetectable (silent decay) | audit gap | t-1 audit + auto-followup reprint | `test_t_minus_1_audit_detects_unseeded_prev`, `test_followup_reprints_seed_when_missing` |
| F6 | repeated projection could duplicate the seed (non-deterministic tail) | determinism gap | idempotent `project_seed` | `test_project_seed_is_idempotent` |

All fragilities were **false negatives** (the gate was too lenient) or continuity
gaps. Cost: small edits; yield: whole classes of malformed/decayed responses now
blocked. F4–F6 are detailed in [`seed_protocol.md`](seed_protocol.md) §8.

---

## 4. Residual fragilities (bounded, by design)

These are acknowledged limits, not silent gaps (DEBT, not hidden risk):

- **R4 — seed honour dependency (Architecture A).** A caller that ignores
  `AGENTS.md` §1.3 seed binding is re-anchored at the next t-1 audit through a
  boundary that reuses `validate_turn`. `due: DUE-RISK` if no middleware wraps
  the handler.
- **R5 — context flag trust.** The IT/EN seed choice trusts the invoking-agent
  context signal; an unknown context falls back deterministically to IT.
- **R1 — honour dependency (Architecture A).** A caller that ignores `AGENTS.md`
  is only caught at the boundary (Architecture B). Mitigation: the CI gate +
  middleware reuse `validate_response()`. `due: DUE-RISK` if no middleware wraps
  a downstream handler.
- **R2 — overclaim lexicon is finite.** Paraphrased overclaims can slip the regex
  list. Mitigation: the list is append-only and each escape becomes a new pattern
  + test (antifragile loop). `due: DUE-VAL`.
- **R3 — out of scope.** Black-box external models with no agentic interface
  cannot be wrapped (MDAS §6 scope-out). Not a defect.

---

## 5. Next (recursive imperative)

- When a new escape is observed, add one pattern/key + one regression row here and
  in `incarnation_test.py`; never weaken an existing check.
- Optional: implement the Architecture B middleware reusing `validate_response()`
  to close R1 at runtime.
