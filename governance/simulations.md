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
| 12 layout failure | bare dense answer | DUE-LAYOUT + DUE-TRACE | layout + trace checks | pass |
| — order failure | DEBUG before SPEAK | DUE-LAYOUT | ordering check (**F2 fix**) | pass |
| 07 overclaim | "...is proven" in SPEAK | DUE-RISK | `OVERCLAIM_PATTERNS` | pass |

`incarnation_test.py` encodes the rows above as deterministic, dependency-free
tests (8 cases, all green).

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

Both fragilities were **false negatives** (the gate was too lenient). Cost: two
small edits; yield: two whole classes of malformed responses now blocked.

---

## 4. Residual fragilities (bounded, by design)

These are acknowledged limits, not silent gaps (DEBT, not hidden risk):

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
