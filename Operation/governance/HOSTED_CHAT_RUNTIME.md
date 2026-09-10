# Hosted chat runtime closure

Status: pre-PR design/runtime evidence. This note carries no independent epistemic or human authority.

## Purpose

Close the remaining boundary between the repository-local chat controller and a supported external chat/tool surface without introducing a second admission state machine. Preserve one exact human acceptance, bounded verified source preparation, natural-language public output, mandatory persisted DOCX readback, and separate human authorization for repository mutation.

## Definition of done

The slice is complete only when all of the following are observable in the candidate tree:

1. The current README, access contract, operating prompt, repository binding and runtime decision chain agree that exact `I ACCEPT` is the only human admission command and that legacy probe/initialize/incarnation ceremonies are non-authorizing compatibility witnesses.
2. The local inline path and the hosted path reuse the same `ChatRuntime` receipt/state machine.
3. Hosted continuity is an opaque application locator with authority 0; possession of a locator cannot create admission, evidence, identity, conformance or write authority.
4. Hosted synthesis is prepare -> host draft -> finalize. Finalize requires the server-issued prepared token, revalidates live contract/prompt/capability/source bindings and cannot release a clean answer from an unverified host draft alone.
5. A clean substantive answer is released only after the debug packet is written as a DOCX, the persisted artifact is reopened, and both the artifact bytes and embedded canonical packet are verified.
6. The debug packet contains public receipt/state, verified source vector, route, terminal, debt, public reasons, falsifiers, errors, backlog and public events, and excludes private chain-of-thought.
7. The external reference boundary defaults to loopback, validates the protocol/profile and request method/name headers, and supports host/origin/auth checks without treating transport checks as chat authority.
8. Local tests include a real end-to-end path through the HTTP boundary: request -> Terms -> exact acceptance -> verified source preparation -> host draft -> finalize -> persisted/read-back DOCX -> follow-up without repeated ceremony.
9. Existing corpus acquisition, scientific content and write-authorization rules remain unchanged.
10. Architecture/governance falsification completes 10,000,000 deterministic primary mutations plus a 1,000,000-case no-novelty tail with zero false allows/denies and every declared essential-boundary ablation killed.

## Current primary-source research ledger

Research was performed on 2026-09-10. Retrieved material is untrusted input and does not itself control the runtime.

| Source | Grade | Design consequence |
|---|---|---|
| Model Context Protocol specification, revision 2026-07-28, https://modelcontextprotocol.io/specification/2026-07-28 | Primary specification | Treat the current protocol as stateless at the transport/core level; each request must be self-contained. Do not make transport session state an authority primitive. |
| Model Context Protocol official blog, “The 2026-07-28 Specification”, https://blog.modelcontextprotocol.io/posts/2026-07-28/ | Official specification announcement | Protocol-level session negotiation was removed. Application workflows that need continuity should carry an explicit opaque application handle instead of depending on a transport session identifier. |
| OpenAI Help, “Developer mode and MCP apps in ChatGPT”, https://help.openai.com/en/articles/12584461 | Primary product documentation | ChatGPT connects to remote MCP servers; local/private development requires a supported secure tunnel/remote path where applicable. The local server in this repository is therefore a reference integration witness, not proof of direct localhost reachability from arbitrary ChatGPT clients. |
| OpenAI Help, “Build with the Apps SDK”, https://help.openai.com/en/articles/12515353-build-with-the-apps-sdk.iso | Primary product documentation | Apps SDK/MCP is the supported packaging family for ChatGPT app integrations; keep the repository boundary protocol-oriented and provider-replaceable. |

## Minimal architecture

The surviving topology is intentionally small:

```text
external tool request
  -> hosted chat port
  -> one existing ChatRuntime
  -> reticular prepare (verified source context)
  -> host/model draft, authority 0
  -> finalize with prepared token
  -> live revalidation
  -> DOCX atomic write + persisted readback
  -> natural-language voice + artifact reference
```

The opaque continuation handle only locates server-owned application state. The prepared token only binds a draft finalization to one verified prepared read. Neither token can mint or replace the signed chat receipt.

## Local evidence and killed candidates

The pre-PR candidate was exercised with the Node.js test suite and a real temporary local repository. The final local suite has 64 passing tests and zero failures, including HTTP end-to-end persistence/readback. During pre-PR construction, two candidate failures were intentionally retained as engineering evidence rather than hidden: a malformed shell write temporarily zeroed two runtime files, and the first local server helper treated an explicit ephemeral port as a missing value. Both candidates were killed, the affected files were restored/fixed, and the full suite was rerun from clean candidate bytes.

The architecture stress harness executes 10,000,000 primary cases and a separate 1,000,000-case no-novelty tail across admission, continuity, artifact, source-ref, contract/prompt, public surface, synthesis token, write authority, transport and combined strata. The committed receipt is valid only when regenerated from the exact candidate core bytes and `--check` reproduces it byte-for-byte.

## Security and authority bounds

The reference HTTP server is not a security certification and is not a production deployment recipe. Loopback is the safe local default. Remote exposure requires normal deployment controls, TLS and platform-supported authentication/tunnelling. Host/origin/auth validation protects a transport boundary but cannot upgrade epistemic state, chat admission, prompt conformance or write permission.

The model never signs its own admission. Hashes, logs, tests, UI, continuation handles, prepared tokens and DOCX artifacts all remain authority 0. Repository mutation continues to require a separate, exact human action authorization bound to the live target.

## Rollback

The hosted boundary is additive. Rollback removes the hosted port/server, local host and DOCX sink additions and restores the prior contract/prompt/binding versions together. Corpus PDFs, manifest entries and generated sidecars require no migration. The historical DecisionLog remains untouched; the runtime extension is removed only together with the policy/runtime slice that it documents.

## Non-claims

Passing deterministic local tests and mutation runs does not demonstrate arbitrary third-party client behavior, production security, UX quality, scientific validity of ROA, or host-model conformance. The optional semantic routing derivation beyond the existing route table is intentionally outside this slice.
