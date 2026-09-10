# Chat surface boundary v1

This is the minimal presentation layer for current ROA chat sessions. It implements the Surface A / Surface B separation already required by the admission contract without adding a second admission or inference system.

`Operation/runner/semantic_chat.js` is the product-facing adapter. `Operation/runner/chat_runtime.js` remains the internal state machine and sole chat receipt issuer. `Operation/runner/surface_boundary.js` validates only presentation shape; it has zero epistemic and authorization authority.

A product integration SHOULD import the runner package default or instantiate `SemanticChat`. Direct rendering of raw `ChatRuntime` return objects is an internal/testing path and is non-conforming for the product surface because those objects intentionally contain machine-facing state.

Surface A is natural prose only. It must not expose implementation names, repository paths, hashes, URLs, legacy SPEAK/DEBUG/SEED blocks, runtime state labels, trace vocabulary or internal open-obligation labels. It must not use headings, lists, tables or code blocks. Substantive model text that violates this boundary is rejected rather than silently rewritten.

Surface B is the artifact channel. Terms remain inspectable before acceptance. After a governed read, technical state and the public control trace stay in the existing DOCX artifact. The public adapter exposes exactly `{voice, artifact}`; every other runtime field is intentionally dropped at projection time.

The synthetic falsification receipt covers 1,000 labelled cases plus a 1,000-case no-novelty tail. It is regression evidence for this boundary, not a claim about model psychology, production security or scientific truth.
