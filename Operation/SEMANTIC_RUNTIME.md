# ROA semantic chat runtime — candidate v1.3

This runtime is a zero-authority navigation/control layer. `IKANT_ROA_ACCESS_CONTRACT.md` remains the admission owner; `Operation/runner/chat_runtime.js` is the sole issuer of chat session receipts. The v1.3 change separates **permission to perform bounded same-session chat study** from **technical conformance of the host/runtime**.

## Hot path

After the complete Terms are inspectable, exact current-session `I ACCEPT` triggers the automatic common bootstrap:

`contract/Terms/prompt-digest checks -> capability probe -> repository-ref freeze -> signed STUDY_AUTHORIZED receipt -> resume pending request`

A host that also exposes real prompt installation and prompt readback may then upgrade the same epoch:

`STUDY_AUTHORIZED -> install exact prompt -> readback exact digest -> ACTIVE_CONFORMING`

No prompt adapter or a failed readback means **remain `STUDY_AUTHORIZED`**, not false-green `ACTIVE_CONFORMING` and not a false denial of already-authorized read-only study. `DEGRADED_READ_ONLY` is retired; study authorization is a different property, not a weaker conformance claim.

## Continuity

Both readable states require a valid signed receipt, stable contract bytes, stable Terms/prompt digest bindings, a pinned repository ref and an available artifact sink. `ACTIVE_CONFORMING` adds a live prompt-readback equality check on every governed read. Contract/ref/readback drift yields `RESET_REQUIRED`; source refs are never silently mixed.

## Plane separation

- **Admission plane:** exact acceptance creates human authorization for the bounded chat-study channel only.
- **Conformance plane:** host adapter evidence may upgrade that channel to `ACTIVE_CONFORMING`; hashes and model assertions cannot do so.
- **Acquisition plane:** `Operation/MANIFEST.json` owns paths, URLs and integrity metadata.
- **Curation plane:** `Operation/SEMANTIC_CURATION.json` proposes semantic roles without rewriting acquisition metadata. Candidate curation has authority `0.0` until human review.
- **Navigation plane:** `Operation/SEMANTIC_RETICULUM.json` is the AI-navigable graph. Edge weights are routing/design weights, never truth probabilities.
- **Inference plane:** claim state, evidence, componentwise Epistemic Debt, typed terminal and receipt remain separate from named-use permission.
- **Action plane:** neither `STUDY_AUTHORIZED` nor `ACTIVE_CONFORMING` authorizes repository writes, merges, releases or settings changes.

## Evidence and falsification

The split is checked by deterministic unit tests plus `semantic_split_stress.js`: exact enumeration of the compact control-state space, 10,000,000 deterministic semantic mutations and a 1,000,000-case no-novelty tail. The receipt is design/state-machine evidence only. It is not empirical security validation, legal adjudication, model-behavior proof or production-host attestation.

## Defeat conditions

Reject this design if a state can read without exact acceptance/common integrity, if host conformance can appear without study authorization plus prompt readback, if `STUDY_AUTHORIZED` can claim conformance, if write authority leaks from acceptance, if source drift continues silently, or if a simpler state representation preserves all negative behavior and reconstructability at lower burden.
