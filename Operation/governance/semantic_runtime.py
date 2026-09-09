#!/usr/bin/env python3
"""ROA semantic-plane compatibility helpers.

Admission and SessionReceipt authority moved to Operation/runner/runtime.js in
access-contract v1.2. This Python module is intentionally non-authorizing: it
validates the semantic reticulum, curation overlay, routes and use-gate logic.
"""
from __future__ import annotations
import json
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parents[2]
OP = ROOT / "Operation"
MANIFEST = OP / "MANIFEST.json"
RETICULUM = OP / "SEMANTIC_RETICULUM.json"
CURATION = OP / "SEMANTIC_CURATION.json"
TERMINALS = {"Answer", "Unknown", "Contradiction", "OutOfHorizon", "Review", "Timeout", "Failure"}


def _load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


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
    c = g.get("control", {})
    expected = {
        "single_gate_owner": "Operation/runner/runtime.js",
        "orchestrator": "Operation/runner/orchestrator.js",
        "reticular_reader": "Operation/runner/reticular.js",
        "operating_prompt_path": "Operation/iKANT_PROMPT.md",
        "operating_prompt_loader": "Operation/runner/prompt.js",
        "legacy_access_gate": "NON_AUTHORIZING_COMPATIBILITY",
    }
    for key, value in expected.items():
        if c.get(key) != value:
            errors.append(f"control:{key}")
    if c.get("epistemic_authority") != 0.0:
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
    return {"ok": not errors, "errors": errors, "manifest_entries": len(midx), "curation_entries": len(cidx), "access_authority": 0.0}


if __name__ == "__main__":
    result = self_check()
    print(json.dumps(result, indent=2, sort_keys=True))
    raise SystemExit(0 if result["ok"] else 1)
