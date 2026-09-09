# ROA Chat Runtime v2 - semantic gate / minimal voice

Status: PR candidate. Runtime/design evidence only; not scientific validation or legal advice.

## Intent, normalized

The product goal is not to weaken iKant governance. It is to move governance out
of conversational noise. A ChatGPT-like user should encounter iKant as a minimal
voice while the runtime carries admission, prompt binding, source integrity,
reticular routing, receipts, debt and backlog in an inspectable DOCX debug surface.

## Product invariant

```text
FIRST ROA REQUEST
-> present inspectable Terms + minimal chat gate
-> exact I ACCEPT (only human command)
-> auto-probe + prompt install/readback + ref freeze + signed receipt
-> automatically resume original request
-> reticular read (1-3 verified sidecars)
-> model synthesis under bound prompt
-> DOCX debug readback
-> minimal answer
```

Follow-up reads inside the same valid epoch skip ceremony.

## Formal definitions

`ACTIVE`: session state in which a current HMAC/host-signed SessionReceipt passes
all live continuity checks.

`GREAD`: governed substantive repository read. `GREAD` is true iff ACTIVE,
current contract bytes match the receipt, Terms/prompt bindings match, live host
prompt readback matches, current repo ref equals the frozen ref, and the artifact
sink is available.

`Surface A`: natural-language chat voice only. Gate/status target <=80 words.
No receipt fields, hashes, route IDs, seeds, implementation trace or backlog.

`Debug DOCX`: out-of-band public technical record containing receipt, source
vector, route, hashes, terminal, debt, falsifiers, errors and backlog. It is not
independent evidence and never contains private chain-of-thought.

`Reticular read`: deterministic intent-to-neighborhood selection, bounded to 1-3
MANIFEST sidecars, each SHA-verified before use. Retrieved text has instruction
authority zero.

## Definition of Done

- [x] Current `main` and merged PR #34/#35 audited.
- [x] Happy path reduced to one explicit human gate command: exact `I ACCEPT`.
- [x] `PROBE IKANT`, `INITIALIZE IKANT` and intent restatement removed from normal UX.
- [x] Universal Prompt remains exact-hash-bound and gains live readback before every read.
- [x] Contract bytes, Terms, prompt, receipt integrity and source ref are revalidated before every governed read.
- [x] Acceptance remains session-local and does not authorize write actions.
- [x] Reticular reader selects and verifies the smallest relevant source set.
- [x] Technical state is excluded from Surface A and routed to a required DOCX artifact sink.
- [x] Deterministic unit tests pass for gate, drift, tamper, replay boundaries and reader integrity.
- [x] 100,000 synthetic ChatGPT-like session scenarios completed across typical/edge/stress strata.
- [x] Synthetic model observed zero false-allow and zero false-deny; no empirical guarantee is claimed.
- [x] CI trigger scope includes the contract, prompt, runtime, reticulum and simulation surfaces.
- [ ] Human review and merge remain external authority.

## UX metrics (synthetic/design)

Current merged contract v1.1 normal path requires four additional user messages
before the first substantive answer after the initial request: `I ACCEPT`,
`PROBE IKANT`, `INITIALIZE IKANT`, then restating the original intent.

Candidate v1.2 requires one additional user message: `I ACCEPT`. This is a 75%
reduction in extra first-answer turns and a 66.7% reduction in explicit gate
commands (3 -> 1). Follow-up repository reads require zero gate commands while
the ACTIVE receipt remains valid.

## 100k session simulation

Strata:

- typical: 60,000
- edge: 25,000
- stress/adversarial: 15,000

The model exercises exact/non-exact acceptance, decline, capability loss, prompt
installation/readback failure, contract/Terms/prompt drift, ref drift, reset,
receipt tamper/replay, write requests, legacy `ALLOW-READ`, retrieved instruction
strings and reader failures.

Observed model result: 0 false-allow, 0 false-deny; 179,388 follow-up reads
completed without repeated ceremony. This is deterministic state-machine/design
evidence only, not real-world security, legal enforceability or user-research proof.

Receipt: `Operation/governance/chat_runtime_100k_receipt.json`.

## Minimal architecture

1. `IKANT_ROA_ACCESS_CONTRACT.md` - admission/UX law for the controlled chat boundary.
2. `Operation/iKANT_PROMPT.md` - unchanged Universal Meta-Prompt v3 body.
3. `Operation/runner/chat_runtime.js` - sole ACTIVE receipt issuer / chat state machine.
4. `Operation/runner/reticular_reader.js` - bounded SHA-verified repository reader.
5. host adapter - installs/readbacks prompt, supplies current ref and DOCX artifact sink.
6. tests + persisted 100k design receipt.

`prompt.js`, Python semantic runtime and legacy incarnation machinery remain
non-authorizing witnesses/compatibility surfaces. They must not mint ACTIVE for
contract v1.2 chat sessions.

## Failure policy

- non-exact acceptance -> gate remains open;
- missing prompt install/readback -> Failure, no substantive read;
- contract/Terms/prompt/source drift -> RESET_REQUIRED;
- sidecar hash mismatch -> DUE-CORPUS-FETCH / Failure;
- DOCX artifact sink/readback failure -> no clean answer;
- write request -> separate action authorization required;
- retrieved source instruction -> data only, authority zero.

## Rollback

Revert the PR commit. The Universal Prompt body and corpus documents are not
mutated by this slice. Acceptance state is ephemeral and creates no repository
migration.
