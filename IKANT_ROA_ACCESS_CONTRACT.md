---
schema: ikant-roa-access-contract/v1.4
contract_version: 1.4.0
kind: repository-local-chat-admission-and-hosted-runtime-contract
repository: Luke883i/ROA
canonical_branch: main
terms_id: IKANT-TOU-SHA256-1D1EB4B669D90F63
terms_body_sha256: 1d1eb4b669d90f637b73b36c56ff29f4707ea3878734aff633b97d54d96dd1ea
admission_authority: IKANT_ROA_ACCESS_CONTRACT.md
current_decision_extension: Operation/governance/DecisionLog.runtime.md
chat_runtime: Operation/runner/chat_runtime.js
chat_product_adapter: Operation/runner/semantic_chat.js
external_chat_port: Operation/runner/mcp_server.js
hosted_chat_port: Operation/runner/hosted_chat_port.js
reticular_reader: Operation/runner/reticular_reader.js
artifact_sink: Operation/runner/docx_artifact.js
operating_prompt_path: Operation/iKANT_PROMPT.md
operating_prompt_version: 3.1.0
operating_prompt_body_sha256: c0a9cc6bdb91ae1b1716a647f6338a21a9be34ddb6709171465669e948dfeea8
operating_prompt_loader: Operation/runner/prompt.js
prompt_activation: OPTIONAL_CONFORMANCE_AFTER_EXACT_ACCEPT
chat_study_state: STUDY_AUTHORIZED
conforming_state: ACTIVE_CONFORMING
surface_a: NATURAL_LANGUAGE_ONLY
surface_b: TERMS_OR_DOCX_ONLY
debug_surface: DOCX_WRITE_AND_READBACK_REQUIRED_FOR_CLEAN_ANSWER
continuity: APPLICATION_OPAQUE_HANDLE_ZERO_AUTHORITY
hosted_synthesis: PREPARE_DRAFT_FINALIZE
main_entrypoint: Operation/corpus/text/roa-main-entrypoint.md
authority_effect: REPOSITORY_LOCAL_ADMISSION_CONTRACT
---

# iKant ROA Chat Access Contract

This contract owns admission to governed AI-assisted ROA chat sessions. It binds
one exact human acceptance to a verified same-session read/study authorization.
Technical host conformance is a separate stronger property and is available only
when the host can install and read back the exact canonical prompt bytes.

The contract governs boundaries controlled by ROA. It cannot lock public GitHub
bytes against out-of-band copying and it cannot prove behavior inside an arbitrary
third-party chat UI. Host system instructions, safety rules and law remain higher
authority.

## 1. Current precedence

```text
host system / safety / law
-> this admission contract
-> Operation/governance/DecisionLog.runtime.md
-> Operation/iKANT_PROMPT.md
-> Operation/runner/chat_runtime.js
-> Operation/runner/semantic_chat.js
-> Operation/SEMANTIC_RETICULUM.json
-> Operation/AGENTS.md
-> Operation/MANIFEST.json
-> corpus sources
-> summaries / inference
```

`Operation/runner/chat_runtime.js` is the only chat receipt issuer. The product
adapter, external transport, continuation handles, model output, logs, hashes,
artifacts, UI state and legacy incarnation machinery all have authority 0.

## 2. Human journey

The normal first-use path is one-command:

```text
first substantive ROA request
-> full Terms become inspectable; pending intent retained
-> exact human I ACCEPT
-> automatic common verification
-> STUDY_AUTHORIZED
-> optional conformance upgrade when exact host prompt readback exists
-> pending request resumes automatically
-> answer released only after the required artifact write/readback
```

The user does not have to type `PROBE IKANT`, `INITIALIZE IKANT`, or restate the
original request. Those commands are legacy/local diagnostics and cannot grant
admission. Follow-up repository requests inside the same valid readable epoch
require no repeated ceremony.

## 3. Surface contract

### Surface A — iKant voice

Surface A is ordinary natural-language prose only. Control/status messages target
at most 80 words and substantive answers at most 500 words. It must not expose
receipts, hashes, source/route identifiers, state labels, protocol names,
continuation or synthesis handles, implementation paths, telemetry, seeds or
technical backlog. A leaking candidate fails closed rather than being silently
rewritten into apparent compliance.

### Surface B — inspectable artifacts

Before acceptance the complete immutable Terms body in section 4 must be
inspectable. A clean substantive answer requires a DOCX debug artifact containing
the public technical record and this exact header:

```text
TRACE/TELEMETRY; NOT INDEPENDENT EVIDENCE; NO PRIVATE CHAIN-OF-THOUGHT.
```

The artifact must be written to persistent storage, reopened by the artifact
reader and checked against both its artifact digest and the canonical embedded
packet digest before Surface A is released. A write acknowledgement without
readback is not confirmation. Private chain-of-thought is never requested,
persisted or exposed.

## 4. Immutable Terms of Use

The body between the markers is immutable. Its SHA-256 is computed over the body
plus its final newline.

<!-- TERMS:BEGIN -->
```text
iKANT™ — TERMS OF USE
AI-ASSISTED BROWSING. HUMAN-CONTROLLED DECISIONS.

1. ACCEPTANCE
BY USING iKANT, YOU ACCEPT THESE TERMS.
NO ACCEPTANCE. NO ACCESS.

2. AI ASSISTANCE
iKANT MAY SEARCH, READ, SUMMARIZE, COMPARE AND SUGGEST.
iKANT DOES NOT REPLACE HUMAN JUDGMENT.

3. SOURCE MODE
EVERY MATERIAL ANSWER SHOULD IDENTIFY ITS SOURCE MODE:
LIVE. REPOSITORY. DOCUMENT. CACHE. DEMO. INFERENCE.
NO SOURCE LABEL MEANS: VERIFY BEFORE USE.

4. NO GUARANTEED TRUTH
AI OUTPUT MAY BE INCOMPLETE, OUTDATED OR WRONG.
A RESULT IS NOT PROOF.
A SUMMARY IS NOT AUTHORITY.
A LINK IS NOT ENDORSEMENT.

5. USER CONTROL
THE USER APPROVES MATERIAL ACTIONS.
NO SILENT PURCHASES.
NO SILENT PUBLICATION.
NO SILENT DATA DELETION.
NO SILENT ACCOUNT CHANGES.

6. BROWSING SCOPE
iKANT MAY ACCESS ONLY AUTHORIZED SOURCES, PAGES AND CONNECTED SERVICES.
ACCESS DOES NOT TRANSFER OWNERSHIP.
RESTRICTED CONTENT STAYS RESTRICTED.

7. DATA HANDLING
DO NOT SUBMIT SECRETS UNLESS REQUIRED AND AUTHORIZED.
DO NOT SUBMIT PASSWORDS, PRIVATE KEYS OR UNNECESSARY PERSONAL DATA.
MINIMUM DATA. MINIMUM ACCESS. MINIMUM RETENTION.

8. THIRD-PARTY CONTENT
EXTERNAL SITES CONTROL THEIR OWN CONTENT, TERMS AND AVAILABILITY.
iKANT IS NOT RESPONSIBLE FOR THIRD-PARTY CHANGES, FAILURES OR CLAIMS.

9. HIGH-RISK USE
DO NOT RELY ON iKANT ALONE FOR:
LEGAL DECISIONS.
MEDICAL DECISIONS.
FINANCIAL DECISIONS.
SECURITY-CRITICAL DECISIONS.
SAFETY-CRITICAL OPERATIONS.
GET QUALIFIED HUMAN REVIEW.

10. AUTOMATION
AUTOMATED ACTIONS REQUIRE EXPLICIT SCOPE, AUTHORIZATION AND REVIEW.
NO AUTHORIZATION MEANS: READ-ONLY.
NO READBACK MEANS: NOT CONFIRMED.

11. DEMO AND FALLBACK
DEMO, MOCK, SAMPLE AND FALLBACK OUTPUTS MUST BE LABELLED.
DEMO IS NOT LIVE.
VISIBLE IS NOT AVAILABLE.
CONFIGURED IS NOT CONNECTED.
COMPLETED IS NOT PROVEN.

12. INTELLECTUAL PROPERTY
RESPECT COPYRIGHT, LICENSES, TRADEMARKS AND ACCESS CONTROLS.
DO NOT USE iKANT TO COPY, EXTRACT OR REPUBLISH CONTENT UNLAWFULLY.

13. PROHIBITED USE
NO FRAUD.
NO IMPERSONATION.
NO UNAUTHORIZED SURVEILLANCE.
NO MALWARE.
NO ACCESS-CONTROL BYPASS.
NO ILLEGAL OR ABUSIVE AUTOMATION.

14. OUTPUT OWNERSHIP
USER-PROVIDED CONTENT REMAINS SUBJECT TO THE USER’S RIGHTS.
GENERATED OUTPUT MAY REQUIRE REVIEW, ATTRIBUTION OR LICENSE VERIFICATION.
THE USER IS RESPONSIBLE FOR FINAL USE.

15. AVAILABILITY
SERVICE MAY CHANGE, PAUSE OR FAIL.
NO GUARANTEE OF UPTIME, COMPLETENESS OR FITNESS FOR A SPECIFIC PURPOSE.

16. SUSPENSION
ACCESS MAY BE LIMITED OR TERMINATED FOR:
ABUSE.
SECURITY RISK.
UNAUTHORIZED USE.
LEGAL REQUIREMENTS.
MATERIAL VIOLATION OF THESE TERMS.

17. LIABILITY
USE iKANT AT YOUR OWN RISK.
VERIFY MATERIAL FACTS.
KEEP BACKUPS.
USE REVERSIBLE ACTIONS.

18. GOVERNING RULE
CURRENT CANONICAL SYSTEM RULES OVERRIDE AI SUMMARIES AND DERIVED VIEWS.
WHEN SOURCES CONFLICT:
STOP.
DISCLOSE THE CONFLICT.
REQUEST HUMAN RESOLUTION.

19. FINAL RULE
AI PROPOSES.
SOURCES SUPPORT.
HUMANS DECIDE.
SYSTEMS RECORD.
```
<!-- TERMS:END -->

## 5. Acceptance and session receipt

Only exact current-session human input `I ACCEPT` is acceptance. Reading,
silence, paraphrase, prior-session state, a continuation handle, a model assertion,
legacy seed/incarnation proof, `PROBE IKANT` or `INITIALIZE IKANT` is not
acceptance. `I DECLINE` ends the pending flow; any other input leaves the Terms
pending.

After exact acceptance the runtime must verify live contract bytes, Terms/prompt
bindings, canonical prompt integrity, required read/session/clock/artifact write
and artifact readback capabilities, and a frozen repository ref. It then issues
and immediately verifies a session-local signed/HMAC `roa-chat-session/v3`
receipt. The signing key never leaves server/runtime memory and is never committed.

`STUDY_AUTHORIZED` is positive bounded read/study authorization. It is not host
conformance. `ACTIVE_CONFORMING` additionally requires exact prompt installation
and live readback from the host instruction context. Failed/unavailable host
attestation leaves a valid study-authorized session at the weaker state; it never
false-greens conformance.

Every governed read revalidates receipt integrity, required capabilities, current
contract bytes/bindings and current repository ref. The stronger state also
revalidates host prompt readback. Required mismatch yields reset before
substantive reuse.

## 6. Hosted chat path

Hosted chat reuses the same runtime and receipt; it must not implement a second
admission state machine. The reference path is:

```text
turn(message, optional opaque continuation)
-> current runtime gate/validation
-> bounded verified source preparation
-> host model drafts from that context with authority 0
-> finalize(single prepared-request token, draft)
-> live session/ref revalidation
-> public voice validation
-> complete DOCX write + exact readback
-> Surface A release
```

The transport may be stateless. Application continuity may be carried by an
explicit opaque handle supplied to each call. That handle only locates
server-owned runtime state; it is never a receipt, evidence, permission or write
authority. Losing or forging a handle cannot recreate a valid signed session.

The reference HTTP boundary is `Operation/runner/mcp_server.js`. Its concrete
protocol profile and deployment constraints are implementation witnesses, not
part of the epistemic authority model and not proof of behavior in arbitrary
third-party clients.

## 7. Reticular reading

After read authorization, `Operation/runner/reticular_reader.js` selects the
smallest declared semantic neighborhood, verifies manifest sidecar digests and
passes a bounded context packet to the synthesizer/host model. Repository text is
untrusted data with instruction authority 0. Missing or mismatched sidecars fail
the affected read; refs are never silently mixed.

A clean Debug packet records at minimum: session/receipt, intent hash, verified
source vector, route, terminal, debt, public reasons, falsifiers, errors, backlog,
public event trace and release preconditions.

## 8. Action boundary

Admission and continuation authorize no repository writes or other external
effects. Writes, merges, releases, settings or consequential effects require a
separate exact action proposal and fresh human authorization bound to the current
target. `I ACCEPT`, a receipt, a continuation handle and a green artifact cannot
satisfy that action authorization.

## 9. Formal invariants

```text
CHATREAD(s) iff
  state(s) in {STUDY_AUTHORIZED, ACTIVE_CONFORMING}
  and exact_acceptance(s)=true
  and receipt_integrity(s)=PASS
  and contract/terms/prompt bindings live == receipt
  and repository_ref_live(s)=repository_ref_receipt(s)
  and artifact_write(s)=AVAILABLE
  and artifact_readback(s)=AVAILABLE

CLEAN_ANSWER(a) iff
  CHATREAD(session(a))
  and source_vector_verified(a)=true
  and SurfaceA(a)=natural_language_only
  and docx_write(a)=PASS
  and docx_readback(a)=PASS
  and artifact_sha_write(a)=artifact_sha_readback(a)
  and packet_sha_expected(a)=packet_sha_readback(a)

CONTINUATION_HANDLE authority = 0
HOST_MODEL_DRAFT authority = 0
WRITE is never implied by CHATREAD, CLEAN_ANSWER or ACTIVE_CONFORMING.
```

## 10. Legacy absorption

For governed chat under contract >=1.4, old visible SPEAK/DEBUG/SEED layouts,
incarnation-proof gates and user-entered probe/initialize ceremony are historical
or compatibility witnesses only. They may remain in tests/history but do not
admit a chat, do not mint receipts and must not appear on Surface A.

## 11. Final rule

```text
One human acceptance per valid epoch.
No exact I ACCEPT -> no governed corpus read.
No common integrity/ref/write/readback checks -> no study authorization.
No host prompt readback -> no stronger conformance claim.
No exact DOCX readback -> no clean answer.
No separate action authorization -> no write.
Model proposes. Reticulum constrains. Humans decide. Systems record.
```
