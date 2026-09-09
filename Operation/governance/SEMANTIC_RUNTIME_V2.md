# ROA Semantic Runtime v2 — single gate + reticular read

Status: PR candidate. Runtime/control evidence only; no scientific-authority upgrade.

## Product contract

The host exposes one repository-facing operation: `handleRepoRequest()` from
`Operation/runner/orchestrator.js`.

Happy path:

```text
user asks to read ROA
-> orchestrator calls runtime.js
-> no valid session: present Terms + exact I ACCEPT gate
-> user: I ACCEPT
-> automatic real probe
-> exact Universal Meta-Prompt load + host readback SHA
-> freeze current repository ref
-> atomic local SessionReceipt readback
-> automatically resume original request
-> reticular.js selects a minimal semantic route
-> app.js reads text_url first, verifies SHA, raw_url fallback
-> natural-language host answer
```

The user never has to type `PROBE IKANT` or `INITIALIZE IKANT`. Those remain
operator diagnostics only.

## Single authority boundary

Only `Operation/runner/runtime.js` may return a governed read permission.

- `prompt.js`: byte loader/verifier, authority=0, non-authorizing.
- `orchestrator.js`: product adapter; delegates permission to runtime.js.
- `reticular.js`: routing/reading consumer; requires a valid runtime receipt.
- `app.js`: corpus fetch/verify witness; never admits a session.
- `semantic_runtime.py`: semantic-plane compatibility helpers; access authority=0.
- `incarnation_test.py`: legacy format compatibility; its old ALLOW-READ path is disabled.

## Host adapter

A clean ACTIVE host must implement both:

```text
installPrompt(exactBody, {path, version, sha256, authority:0})
readbackPromptHash() -> exact installed sha256
```

A self-declared boolean is not enough. Missing/mismatched host readback yields
`DEGRADED_READ_ONLY`, never clean ACTIVE.

## Local state

`.ikant/session.json` is local/session control state and is Git-ignored. Writes are
`temp -> fsync -> rename -> readback`. The receipt binds exact contract bytes,
Terms digest, prompt digest, host readback, current repository ref and gate owner.
Its SHA detects accidental/tampered local mutation but is not a secret signature.

## Reticular reading

`reticular.js` turns the request into semantic seed nodes, walks the existing
weighted reticulum with a strict document budget, maps nodes to manifest IDs and
asks `app.js` to verify the selected sources. The route is an acquisition plan,
not truth confidence.

Examples:

- “spiegami ROA” -> ROA entrypoint first.
- “Epistemic Debt” -> debt candidate source first, then only adjacent sources if needed.
- “RLA / CRC / ECNN” -> main scientific paper first.
- “A-OSP” -> implementation witness, never maturity upgrade.

## Falsification receipt

`Operation/governance/runtime_gate_simulation_receipt.json` records 10,000,000
deterministic multi-seed access scenarios: 5M ordinary, 3M edge, 2M stress. It
also records exact clean-active invariant enumeration and forbidden Markov edges.
This is design evidence, not an empirical attack probability or formal saturation.

## Rollback

Revert the semantic-runtime commit. `.ikant/` contains no repository authority and
may be deleted locally. The corpus PDFs, manifest contents and Universal
Meta-Prompt body are not changed by this slice.
