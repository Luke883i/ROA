#!/usr/bin/env python3
"""Minimal ROA semantic chat runtime.

Pure control/navigation code. It creates no epistemic authority and performs no
repository mutation. The root IKANT_ROA_ACCESS_CONTRACT.md remains admission
owner. Since contract v1.3, chat-study authorization and technical iKant
conformance are deliberately separate properties.
"""
from __future__ import annotations
import hashlib
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parents[2]
OP = ROOT / "Operation"
MANIFEST = OP / "MANIFEST.json"
RETICULUM = OP / "SEMANTIC_RETICULUM.json"
CURATION = OP / "SEMANTIC_CURATION.json"
PROMPT = OP / "iKANT_PROMPT.md"
PROMPT_VERSION = "3.0.0"
PROMPT_BEGIN = "<!-- PROMPT:BEGIN -->"
PROMPT_END = "<!-- PROMPT:END -->"
READ_STATES = {"STUDY_AUTHORIZED", "ACTIVE_CONFORMING"}
CONFORMING_STATES = {"ACTIVE_CONFORMING"}
TERMINALS = {"Answer", "Unknown", "Contradiction", "OutOfHorizon", "Review", "Timeout", "Failure"}

@dataclass(frozen=True)
class AccessVerdict:
    allowed: bool
    state: str
    reason: str

@dataclass(frozen=True)
class PromptBinding:
    ok: bool
    version: str
    sha256: str
    body: str
    reason: str

def _load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))

def _sha256_text(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

def operating_prompt_body(path: Path = PROMPT) -> str:
    text = path.read_text(encoding="utf-8")
    if text.count(PROMPT_BEGIN) != 1 or text.count(PROMPT_END) != 1:
        raise ValueError("prompt-marker-cardinality")
    segment = text.split(PROMPT_BEGIN, 1)[1].split(PROMPT_END, 1)[0]
    match = re.fullmatch(r"\n```text\n(.*)```\n", segment, flags=re.S)
    if not match:
        raise ValueError("prompt-body-envelope-invalid")
    body = match.group(1)
    if not body.endswith("\n"):
        raise ValueError("prompt-body-final-newline-missing")
    return body

def operating_prompt_version(path: Path = PROMPT) -> str:
    text = path.read_text(encoding="utf-8")
    m = re.search(r"`IKANT_PROMPT_VERSION:\s*([^`]+)`", text)
    if not m:
        raise ValueError("prompt-version-missing")
    return m.group(1).strip()

def operating_prompt_declared_sha256(path: Path = PROMPT) -> str:
    text = path.read_text(encoding="utf-8")
    m = re.search(r"`IKANT_PROMPT_BODY_SHA256:\s*([0-9a-f]{64})`", text)
    if not m:
        raise ValueError("prompt-declared-sha256-missing")
    return m.group(1)

def bind_operating_prompt(*, expected_sha256: str, expected_version: str = PROMPT_VERSION, path: Path = PROMPT) -> PromptBinding:
    try:
        body = operating_prompt_body(path)
        version = operating_prompt_version(path)
        got = _sha256_text(body)
        declared = operating_prompt_declared_sha256(path)
    except (OSError, ValueError) as exc:
        return PromptBinding(False, "UNVERIFIED", "", "", str(exc))
    if version != expected_version:
        return PromptBinding(False, version, got, body, "prompt-version-drift")
    if declared != got:
        return PromptBinding(False, version, got, body, "prompt-self-digest-mismatch")
    if got != expected_sha256:
        return PromptBinding(False, version, got, body, "prompt-contract-digest-mismatch")
    return PromptBinding(True, version, got, body, "prompt-digest-verified")

def validate_session_receipt(receipt: dict, *, terms_sha256: str, contract_version: str, prompt_sha256: str, prompt_version: str = PROMPT_VERSION) -> AccessVerdict:
    required = {
        "schema", "session_id", "epoch", "contract_version", "terms_sha256",
        "repository_ref", "runtime_mode", "status", "initialized_at",
        "accepted_command", "prompt_sha256", "prompt_readback_sha256",
        "conformance_status",
    }
    missing = sorted(required - set(receipt))
    if missing:
        return AccessVerdict(False, "RECEIPT_INVALID", "missing:" + ",".join(missing))
    if receipt["schema"] != "roa-chat-session/v3":
        return AccessVerdict(False, "RECEIPT_INVALID", "schema-mismatch")
    if receipt["accepted_command"] != "I ACCEPT":
        return AccessVerdict(False, "RECEIPT_INVALID", "acceptance-not-exact")
    if receipt["contract_version"] != contract_version:
        return AccessVerdict(False, "RESET_REQUIRED", "contract-version-drift")
    if receipt["terms_sha256"] != terms_sha256:
        return AccessVerdict(False, "RESET_REQUIRED", "terms-digest-drift")
    if receipt["prompt_sha256"] != prompt_sha256:
        return AccessVerdict(False, "RESET_REQUIRED", "prompt-digest-drift")
    if receipt["runtime_mode"] != receipt["status"]:
        return AccessVerdict(False, "RECEIPT_INVALID", "runtime-status-mismatch")
    if receipt["status"] not in READ_STATES:
        return AccessVerdict(False, "NOT_AUTHORIZED", "chat-study-not-authorized")

    if receipt["status"] == "ACTIVE_CONFORMING":
        if receipt["conformance_status"] != "CONFORMING":
            return AccessVerdict(False, "RECEIPT_INVALID", "conformance-status-mismatch")
        if receipt["prompt_readback_sha256"] != prompt_sha256:
            return AccessVerdict(False, "RESET_REQUIRED", "prompt-readback-drift")
        return AccessVerdict(True, "ACTIVE_CONFORMING", "chat-study-authorized-and-host-conforming")

    if receipt["conformance_status"] == "CONFORMING":
        return AccessVerdict(False, "RECEIPT_INVALID", "study-state-cannot-claim-conformance")
    if receipt["prompt_readback_sha256"] is not None:
        return AccessVerdict(False, "RECEIPT_INVALID", "study-state-readback-must-be-null")
    return AccessVerdict(True, "STUDY_AUTHORIZED", "chat-study-authorized-without-host-conformance")

def source_ref_state(receipt: dict, current_ref: str) -> str:
    frozen = receipt.get("repository_ref")
    if not frozen:
        return "UNVERIFIED"
    return "PINNED" if frozen == current_ref else "SOURCE_DRIFT"

def manifest_index(manifest: dict | None = None) -> dict[str, dict]:
    m = manifest or _load(MANIFEST)
    return {entry["id"]: entry for entry in m.get("pdfs", [])}

def curation_index(curation: dict | None = None) -> dict[str, dict]:
    c = curation or _load(CURATION)
    return {entry["manifest_id"]: entry for entry in c.get("entries", [])}

def semantic_status(manifest_entry: dict, curation: dict | None) -> dict:
    if curation:
        return {"state": curation["curation_state"], "role": curation["semantic_role"], "authority": float(curation.get("authority", 0.0)), "readable": True, "debt": list(curation.get("debt", []))}
    if manifest_entry.get("role") == "UNREVIEWED_AUTOSEEDED":
        return {"state": "PENDING_CURATION", "role": None, "authority": 0.0, "readable": True, "debt": ["semantic-role-unreviewed"]}
    return {"state": "CURATED", "role": manifest_entry.get("role"), "authority": 1.0, "readable": True, "debt": []}

def validate_reticulum(graph: dict | None = None) -> list[str]:
    g = graph or _load(RETICULUM)
    errors: list[str] = []
    nodes = {n["id"]: n for n in g.get("nodes", [])}
    core = g.get("core_route", [])
    for node in core:
        if node not in nodes:
            errors.append(f"core-node-missing:{node}")
    edge_pairs = {(e["from"], e["to"]): e for e in g.get("edges", [])}
    for a, b in zip(core, core[1:]):
        if (a, b) not in edge_pairs:
            errors.append(f"core-edge-missing:{a}->{b}")
    for e in g.get("edges", []):
        if e["from"] not in nodes or e["to"] not in nodes:
            errors.append(f"dangling-edge:{e['from']}->{e['to']}")
        w = e.get("weight", {})
        if set(w) != {"routing", "preservation", "authority", "falsifiability", "debt_cost"}:
            errors.append(f"weight-shape:{e['from']}->{e['to']}")
        if not e.get("falsifier"):
            errors.append(f"falsifier-missing:{e['from']}->{e['to']}")
    if nodes.get("PCE", {}).get("authority_class") != "bounded_bridge_only":
        errors.append("pce-authority-boundary")
    for wid in ("BRYOPHYTE", "AOSP"):
        if nodes.get(wid, {}).get("authority_class") != "witness_only":
            errors.append(f"witness-boundary:{wid}")
    for cid in ("CLAIM_ADMISSIBILITY", "EPISTEMIC_DEBT"):
        if nodes.get(cid, {}).get("authority_class") != "candidate_zero_authority":
            errors.append(f"candidate-authority:{cid}")
    if set(g.get("typed_terminals", [])) != TERMINALS:
        errors.append("typed-terminal-set")
    control = g.get("control", {})
    if control.get("operating_prompt_path") != "Operation/iKANT_PROMPT.md":
        errors.append("operating-prompt-path")
    if control.get("operating_prompt_loader") != "Operation/runner/prompt.js":
        errors.append("operating-prompt-loader")
    if control.get("operating_prompt_binding") != "prompt_digest_for_study_live_readback_for_conformance":
        errors.append("operating-prompt-binding")
    if control.get("chat_study_state") != "STUDY_AUTHORIZED":
        errors.append("chat-study-state")
    if control.get("conforming_state") != "ACTIVE_CONFORMING":
        errors.append("conforming-state")
    if control.get("epistemic_authority") != 0.0:
        errors.append("control-authority-nonzero")
    return errors

def route(seed_nodes: Iterable[str], *, graph: dict | None = None, max_nodes: int = 8) -> list[str]:
    g = graph or _load(RETICULUM)
    nodes = {n["id"] for n in g["nodes"]}
    frontier = [n for n in seed_nodes if n in nodes]
    seen: list[str] = []
    outgoing: dict[str, list[dict]] = {}
    for e in g["edges"]:
        outgoing.setdefault(e["from"], []).append(e)
    while frontier and len(seen) < max_nodes:
        cur = frontier.pop(0)
        if cur in seen:
            continue
        seen.append(cur)
        edges = sorted(outgoing.get(cur, []), key=lambda e: (-e["weight"]["routing"], e["to"]))
        for e in edges:
            if e["to"] not in seen and e["to"] not in frontier:
                frontier.append(e["to"])
    return seen

def claim_envelope(*, evidence_status: str, debt: list[str], terminal: str, receipt: dict) -> dict:
    if terminal not in TERMINALS:
        raise ValueError(f"invalid terminal: {terminal}")
    return {"evidence_status": evidence_status, "debt_vector": list(debt), "terminal": terminal, "receipt": dict(receipt), "permission": None}

def named_use_gate(envelope: dict, *, adequate_horizon: bool, blocking_debt: bool, human_authority: bool) -> str:
    if not adequate_horizon:
        return "HorizonInadequate"
    if blocking_debt:
        return "ReviewRequired"
    if not human_authority:
        return "ReviewRequired"
    if envelope.get("terminal") != "Answer":
        return "Blocked"
    return "Warranted"

def self_check() -> dict:
    manifest = _load(MANIFEST)
    curation = _load(CURATION)
    midx = manifest_index(manifest)
    cidx = curation_index(curation)
    errors = validate_reticulum()
    for cid in cidx:
        if cid not in midx:
            errors.append(f"curation-id-not-in-manifest:{cid}")
        elif cidx[cid].get("authority") != 0.0:
            errors.append(f"candidate-curation-nonzero-authority:{cid}")
    return {"ok": not errors, "errors": errors, "manifest_entries": len(midx), "curation_entries": len(cidx), "prompt_sha256": _sha256_text(operating_prompt_body())}

if __name__ == "__main__":
    result = self_check()
    print(json.dumps(result, indent=2, sort_keys=True))
    raise SystemExit(0 if result["ok"] else 1)
