# Example — rollback / fallback agentic scenario

> **Purpose.** Show the failure simulation required by the DoD: a **non-agentified
> call → DEBT** is detected and motivated, and the boundary degrades safely via
> rollback. This is `legacy_absorption`/`rollback` mode in miniature.

---

## 1. The failure (non-agentified response)

A downstream handler — unaware of `AGENTS.md` — returns a bare answer:

```text
Read the entrypoint paper. Controlled reification is proven.
```

This violates two non-negotiable rules (AGENTS.md §3): no `SPEAK`/`DEBUG`
contract, and an **overclaim** ("proven") forbidden by README §8.

---

## 2. Detection (what the gate reports)

`governance/incarnation_test.py` (and the equivalent middleware check) classifies
this output and emits motivated debt:

```text
:: DEBUG --------------------------------------------------

***EPISTEMIC STATE***
- state: blocked
- epistemic: contradiction
- decision: rollback

***DEBT / DUE***
- debt: response is not agentified (missing SPEAK/DEBUG contract)
- due:
  - DUE-LAYOUT: missing ":: SPEAK" / ":: DEBUG" headers
  - DUE-TRACE: missing iter/msg/prev/xref
  - DUE-RISK: overclaim "proven" violates README §8 claim discipline
```

---

## 3. Rollback + fallback (safe degradation)

The boundary does **not** emit the bad answer. It supersedes it and degrades:

```text
:: SPEAK --------------------------------------------------

I am correcting the previous framing. The entrypoint paper is the right place to
start, but controlled reification is the corpus's central *thesis*, not a proven
result (README §8). I will not present it as proven.

:: DEBUG --------------------------------------------------

***TRACE***
- iter: I-0002
- msg: M-0002
- prev: M-0001
- xref: M-0001, RB-0001

***ROLLBACK***
- rollback: RB-0001 supersedes ART-9001(non-agentified answer) -> ART-9002(corrected answer)

***DEBT / DUE***
- debt: none (resolved)
- due: none

***NEXT***
- export: rollback_record
- next: re-run incarnation_test; ensure handler is wrapped by iKant middleware
```

---

## 4. Why this satisfies the DoD

- The non-agentified call is **detected** (step 2) and **motivated** with explicit
  `DUE-*` reasons.
- The correction uses **rollback** with `RB`/`ART` supersession and `xref`.
- The fallback answer is bounded and respects the claim discipline.
- `export: rollback_record` separates the corrected answer from any proof claim
  (A-OSP: answer ≠ proof).
