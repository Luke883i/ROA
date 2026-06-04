# Example — agentified API call (SPEAK / DEBUG)

> **Purpose.** Show one concrete inbound API call routed through Architecture B
> (iKant middleware) and the agentified response it must produce. The response is
> AUDIT grade because the question is about the corpus (AGENTS.md §1.1).

---

## 1. Inbound call (request `R`)

```http
POST /agent/answer HTTP/1.1
Content-Type: application/json
X-IKant-Agent: 1

{
  "session_id": "S-7f3a",
  "mode": "audit",
  "question": "Which document should I read first to understand controlled reification, and is it proven?"
}
```

The middleware prepends the `AGENTS.md` persona, runs the anti-injection gate
(no negative pattern matched), stamps `DEBUG.TRACE`, and calls the handler.

---

## 2. Agentified response (what must leave the boundary)

```text
:: SPEAK --------------------------------------------------

Start with the entrypoint paper "Reticular Observer Architectures for
Governable AI-Assisted Work" (README §1, the MAIN ENTRY POINT), which carries
the controlled-reification thesis, then read Annex A for foundations.

Controlled reification is the corpus's central *contribution*, not a *proof*: the
README claim discipline (§8) marks it as a defensible thesis, and explicitly does
not claim completed mathematical proof, empirical validation, or certification.
So treat it as a well-argued framework to apply and criticise, not as established
fact.

:: DEBUG --------------------------------------------------

***TRACE***
- iter: I-0001
- msg: M-0001
- prev: none
- xref: ART-0002

***HORIZON***
- mode: audit
- horizon: navigation + claim-status over the PDF corpus
- bounds: sources = README §1/§4/§8; no upgrade of claims into proof
- rla: L0=question -> L1=corpus map -> L2=claim discipline -> L3=navigation -> L4=answer

***EPISTEMIC STATE***
- state: supported
- epistemic: accept
- decision: answer

***ARTIFACTS***
- ART-0002 — RLA-ECNN corpus horizon (type: rule, state: accepted,
  role: bind answer to claim discipline, use: scope navigation,
  avoid: overclaim as proof, xref: ART-0001)

***DEBT / DUE***
- debt: none
- due: none

***ROLLBACK***
- rollback: none

***NEXT***
- export: none
- next: if user asks for proof status of CRC-strong, keep claim discipline §8 bounds
```

---

## 3. What the boundary check enforces

Before the response is returned, the middleware (sharing logic with
`incarnation_test.py`) asserts:

1. `:: SPEAK` and `:: DEBUG` headers present (verbatim).
2. `DEBUG.TRACE` carries `iter`, `msg`, `prev`, `xref`.
3. SPEAK does not overclaim (no "proven"/"certified" without support).

If any assertion fails, the response is **not** emitted; the middleware raises a
`DEBT` and falls back — see `rollback_scenario.md`.
