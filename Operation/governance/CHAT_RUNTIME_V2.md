# ROA Chat Runtime v2 - historical design record

Status: **superseded for current chat admission semantics by `IKANT_ROA_ACCESS_CONTRACT.md` v1.3 and `Operation/SEMANTIC_RUNTIME.md`**. This file remains as the design record for merged PR #36 / contract v1.2.

The v1.2 design deliberately required a real host prompt-install/readback adapter before the single readable state `ACTIVE` could exist. That preserved a strong anti-false-green boundary, but the repository supplied only the host interface and test mocks, not a production/ChatGPT host adapter. Consequently an accepted same-session chat could be denied all substantive study merely because technical conformance was not attestable.

## Superseding v1.3 rule

The invariant is now decomposed rather than weakened:

```text
exact I ACCEPT + common integrity/capability/ref checks
-> STUDY_AUTHORIZED
-> bounded read-only chat study may resume

STUDY_AUTHORIZED + real host prompt install/readback equality
-> ACTIVE_CONFORMING
```

`STUDY_AUTHORIZED` is not `DEGRADED_READ_ONLY` and never claims technical iKant conformance. `ACTIVE_CONFORMING` retains the v1.2 strong prompt-readback requirement. Neither state grants repository-write authority. Contract/ref drift still resets before the next governed read, the reticular reader remains SHA-verified and bounded, and the DOCX debug artifact remains required for a clean answer.

## Historical v1.2 evidence

PR #36's 100,000-session receipt remains historical state-machine/design evidence for the old single-state gate. It is no longer the current conformance oracle. Current split semantics are tested by `semantic_split_stress.js` and `semantic_split_11m_receipt.json`.

## Open debt

`Operation/iKANT_PROMPT.md` v3.0 still contains legacy PROBE/INITIALIZE lifecycle prose. The admission contract has higher repository-policy precedence and the chat runtime owns the actual state machine, so that prose cannot mint or deny receipts. It remains explicit documentation/prompt debt for a later prompt-body revision; this PR does not silently change the hash-bound universal prompt while fixing the runtime authorization/conformance coupling.
