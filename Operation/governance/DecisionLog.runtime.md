# DecisionLog.runtime.md — append-only runtime decision extension

> **Chain anchor.** This file extends the historical
> `Operation/governance/DecisionLog.md` without rewriting it. The anchored base
> Git blob is `36d2d4fe0a5b0bee02f36c1c42b986a8e11ce21d` at repository base
> `f1096feb1f2fea7a17fa659cba23a1dced19c01e`. Contract >=1.4 treats the ordered
> pair `(DecisionLog.md, DecisionLog.runtime.md)` as the current decision chain.
> Past decisions remain historical evidence; later entries below explicitly
> supersede their runtime effect where stated.

## DEC-0012 — Separate governed chat admission from legacy incarnation proof

- **date:** 2026-09-10
- **decision:** The exact Terms acceptance + signed chat-runtime receipt defined
  by the access contract is the sole governed-chat admission path. The old
  SPEAK/DEBUG/SEED incarnation proof, `DENY-READ`/`ALLOW-READ` gate and
  user-entered probe/initialize ceremony remain historical regression witnesses
  only. They cannot admit a current chat or create authority.
- **supersedes:** Runtime/admission effect of DEC-0001, DEC-0002, DEC-0005 and
  DEC-0010 for chat sessions governed by contract >=1.4. Their historical tests
  and rationale remain preserved.
- **rationale:** A repository can preserve earlier experiments without forcing a
  current user through multiple conflicting admission systems. One authoritative
  state machine is smaller, easier to falsify and less prone to false denial or
  false-green self-incarnation.
- **artifacts:** `IKANT_ROA_ACCESS_CONTRACT.md`, `Operation/AGENTS.md`,
  `Operation/iKANT_PROMPT.md`, `README.md`.
- **rollback:** Revert the contract/prompt/binding slice and remove this extension
  entry only together; never reinterpret the historical base log silently.
- **export:** runtime_policy

## DEC-0013 — Make artifact readback a release precondition

- **date:** 2026-09-10
- **decision:** A substantive chat answer is not clean/releasable after a DOCX
  write acknowledgement alone. The runtime builds a complete public packet,
  writes it atomically, reopens the persisted DOCX, verifies artifact and embedded
  packet digests, and only then releases Surface A. The packet records receipt,
  source vector, route, terminal, debt, public reasons, falsifiers, errors,
  backlog and public events; private chain-of-thought is excluded.
- **rationale:** “Written” and “read back” are different claims. Binding answer
  release to an exact persisted readback closes the prior observability gap and
  prevents a green response from relying on an uninspected or mismatched artifact.
- **artifacts:** `Operation/runner/docx_artifact.js`,
  `Operation/runner/chat_runtime.js`, runtime tests.
- **rollback:** Restore the previous artifact interface only if the contract is
  simultaneously rolled back; otherwise the runtime must fail closed.
- **export:** runtime_policy

## DEC-0014 — Add a stateless external chat boundary without duplicating authority

- **date:** 2026-09-10
- **decision:** The reference hosted boundary uses one application-level opaque
  continuation handle to locate server-owned `ChatRuntime` state. It reuses the
  same acceptance/receipt state machine. Hosted synthesis is two-phase:
  prepare verified reticular context -> host model draft (authority 0) -> finalize
  with a single prepared-request token -> live revalidation -> artifact
  write/readback -> public release. The reference HTTP integration follows the
  MCP 2026-07-28 stateless transport profile; transport session identifiers are
  not used as authority.
- **rationale:** The host model can synthesize without giving an external transport
  or handle the power to manufacture admission. Two-phase finalization also avoids
  a second model dependency and makes the exact release boundary testable locally.
- **artifacts:** `Operation/runner/hosted_chat_port.js`,
  `Operation/runner/mcp_server.js`, `Operation/runner/local_host.js`,
  `Operation/runner/reticular_reader.js`, hosted/e2e tests and stress receipt.
- **non-claim:** Local protocol conformance and deterministic E2E tests do not
  prove behavior in arbitrary third-party clients or production deployments.
- **rollback:** Remove the hosted boundary and retain the inline runtime; admission
  and corpus state require no migration.
- **export:** runtime_policy
