# ROA semantic chat runtime — candidate v1.5

This slice closes the remaining runtime boundary after the natural-language
surface split. It changes admission/runtime integration and artifact verification;
it does not change the scientific corpus or grant new epistemic/write authority.

## One authority path

The access contract owns admission and `chat_runtime.js` remains the sole issuer
of chat receipts. Local inline use and hosted chat both reuse that same state
machine. Legacy incarnation/seed/probe surfaces are compatibility witnesses only.

## Hosted hot path

```text
human request
-> semantic chat port
-> existing chat runtime
-> exact Terms acceptance when required
-> verified reticular prepare
-> host model draft (authority 0)
-> finalize prepared request
-> live session/ref revalidation
-> Surface A guard
-> complete DOCX write
-> exact DOCX readback
-> public natural-language voice + artifact link
```

The hosted transport is allowed to be stateless. An opaque application
continuation locates server-owned runtime state but is never a receipt, identity,
evidence, permission or write authority. The server keeps the receipt signing key
private. Losing or fabricating a handle does not recreate authorized state.

The reference HTTP adapter is `runner/mcp_server.js` and targets the MCP
2026-07-28 stateless HTTP profile. It exposes two read-only tools: one prepares or
continues the conversation, the second finalizes a host-model draft. Terms and
DOCX are read-only resources. Local tests prove this implementation boundary only;
they do not prove arbitrary client or deployment behavior.

## Complete artifact release contract

Before a substantive answer can leave the runtime, `chat_runtime.js` builds a
canonical `roa-debug-packet/v2` containing public session/receipt data, verified
source vector, route, terminal, debt, public reasons, falsifiers, errors, backlog
and event trace. `docx_artifact.js` writes a minimal OOXML DOCX atomically, embeds
the canonical packet as a machine-readable custom XML part, reopens the file and
verifies both artifact and packet hashes. A write acknowledgement without exact
readback fails closed.

## Surface separation

Surface A remains ordinary natural-language prose only. The adapter rejects
structured control material, implementation paths, hashes, URLs, state labels,
protocol names and continuation/synthesis handles. Surface B owns the immutable
Terms or verified DOCX artifact. Private chain-of-thought is never requested or
persisted.

## Legacy absorption

`Operation/AGENTS.md` now describes the current chat contract. Historical
SPEAK/DEBUG/SEED and incarnation literals remain only in an explicitly
non-authorizing compatibility section so old regression tooling can continue to
exercise them. The historical DecisionLog is not rewritten; the chained
`governance/DecisionLog.runtime.md` extension records the explicit supersessions.

## Non-claims

This runtime is an implementation witness. Passing deterministic tests or stress
receipts does not validate ROA scientifically, certify security, establish
production readiness, or attest behavior inside third-party UIs. Hard-coded
semantic routing remains a bounded implementation witness and is not enlarged in
this slice.
