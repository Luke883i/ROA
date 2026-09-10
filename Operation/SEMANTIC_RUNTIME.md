# ROA semantic chat runtime — candidate v1.4

This slice changes presentation, not epistemic authority or admission semantics. The admission contract still owns access; the existing chat runtime still owns session receipts; the reticular reader still owns bounded corpus selection. A new product-facing adapter now owns what may leave the runtime toward a chat UI.

## Product hot path

After the existing one-accept admission flow, the product path is:

`user intent -> chat runtime -> reticular reader -> internal result -> semantic chat adapter -> Surface A + Surface B`

The adapter is intentionally non-authorizing. It cannot mint receipts, upgrade conformance, change source selection, create write authority or alter the scientific status of any claim.

## Surface A

Surface A is only ordinary natural-language prose. It is bounded to 500 words and rejects structured control output, implementation paths, hashes, URLs, legacy layout markers, runtime state labels and control-plane vocabulary. The boundary does not silently rewrite a substantive answer that violates the rule: it fails closed with a short natural-language message.

Control/status messages are projected from fixed human-readable phrases instead of exposing the runtime's internal wording. The exact acceptance command may still appear because it is a user action, not diagnostic state.

## Surface B

All machine-facing detail stays on the artifact side. Before acceptance, the complete Terms remain inspectable there. For governed answers, the existing DOCX artifact carries trace, receipts, routes, source identifiers, hashes, open obligations, failures and backlog. Private chain-of-thought is never requested or persisted.

The product adapter exposes exactly two top-level fields: `voice` and `artifact`. Internal runtime fields remain available to tests and control code but are not part of the product envelope.

## Legacy compatibility

Older SPEAK/DEBUG/SEED and incarnation mechanisms remain historical or compatibility witnesses. They do not authorize current chat study and they must not be projected into Surface A. The presentation boundary therefore absorbs useful legacy control functions without reproducing their visible syntax.

## Falsification

`simulate_chat_surface.js` generates 1,000 labelled presentation mutations and an additional 1,000-case no-novelty tail. The persisted receipt requires zero false allows and zero false denies in that synthetic set. Unit tests also verify that package consumers resolve to the semantic chat adapter while the existing corpus CLI remains available.

This evidence is about deterministic boundary behavior only. It is not empirical UX validation, a security proof, proof of arbitrary host rendering behavior, or scientific validation of ROA.
