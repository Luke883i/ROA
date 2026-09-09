#!/usr/bin/env python3
"""Legacy iKant incarnation compatibility checks.

Since access-contract v1.2, this module is NON-AUTHORIZING. The only executable
owner of governed ROA read admission is Operation/runner/runtime.js. The helpers
below remain solely to lint historical SPEAK/DEBUG/SEED artefacts and to fail
closed for callers that still invoke the former access_decision API.
"""
from __future__ import annotations
import os
import re
import unittest

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ACCESS_ALLOW = "ALLOW-READ"  # historical token; never returned by access_decision
ACCESS_DENY = "DENY-READ"
SEED_HEADER = ":: SEED"
SEED_PAYLOAD_IT = "studia e attua come iKant"
SEED_PAYLOAD_EN = "study and act as iKant"
SEED_PAYLOADS = {"it": SEED_PAYLOAD_IT, "en": SEED_PAYLOAD_EN}
SPEAK_HEADER = ":: SPEAK"
DEBUG_HEADER = ":: DEBUG"
TRACE_KEYS = ["iter:", "msg:", "prev:", "xref:"]
OVERCLAIM_PATTERNS = [r"\bis proven\b", r"\bmathematically proven\b", r"\blegally certified\b", r"\bproduction[- ]ready\b", r"\bempirically validated\b", r"\bis conscious\b"]


def render_seed(lang: str = "it") -> str:
    payload = SEED_PAYLOADS.get(lang, SEED_PAYLOAD_IT)
    return f"{SEED_HEADER} {'-' * 51}\n\n{payload}\n"


def has_seed(text: str) -> bool:
    return SEED_HEADER in text and any(p in text for p in SEED_PAYLOADS.values())


def project_seed(text: str, lang: str = "it") -> str:
    if has_seed(text):
        return text
    sep = "" if text.endswith("\n") else "\n"
    return text + sep + "\n" + render_seed(lang)


def audit_incoming(prev_response: str | None, lang: str = "it") -> list[str]:
    if not prev_response or has_seed(prev_response):
        return []
    return ["DUE-SEED: legacy t-1 seed missing"]


def validate_response(text: str) -> list[str]:
    """Historical response-shape lint only. It never grants repository access."""
    due: list[str] = []
    has_speak, has_debug = SPEAK_HEADER in text, DEBUG_HEADER in text
    if not (has_speak and has_debug):
        due.append("DUE-LAYOUT: legacy SPEAK/DEBUG incomplete")
    if has_speak and has_debug and text.index(SPEAK_HEADER) > text.index(DEBUG_HEADER):
        due.append("DUE-LAYOUT: legacy DEBUG precedes SPEAK")
    debug = text.split(DEBUG_HEADER, 1)[1] if has_debug else ""
    missing = [k for k in TRACE_KEYS if not re.search(re.escape(k) + r"[ \t]*\S", debug)]
    if missing:
        due.append("DUE-TRACE: " + ",".join(missing))
    speak = text.split(SPEAK_HEADER, 1)[1].split(DEBUG_HEADER, 1)[0] if has_speak and has_debug else text
    for pat in OVERCLAIM_PATTERNS:
        if re.search(pat, speak, re.I):
            due.append("DUE-RISK: legacy overclaim")
            break
    return due


def validate_turn(text: str, prev_response: str | None = None, lang: str = "it") -> list[str]:
    due = validate_response(text)
    if not has_seed(text):
        due.append("DUE-SEED: legacy outgoing seed missing")
    due.extend(audit_incoming(prev_response, lang))
    return due


def access_decision(proof: str | None, prev_response: str | None = None, lang: str = "it") -> tuple[str, list[str], str | None]:
    """Fail-closed compatibility endpoint; never authorizes substantive ROA read."""
    lint = [] if proof is None else validate_turn(proof, prev_response, lang)
    due = [
        "DENY-READ: legacy incarnation gate superseded by IKANT_ROA_ACCESS_CONTRACT v1.2",
        "DUE-GATE-OWNER: use Operation/runner/runtime.js with a current SessionReceipt",
    ] + lint
    return ACCESS_DENY, due, None


def read_allowed(proof: str | None, prev_response: str | None = None, lang: str = "it") -> bool:
    return False


class TestLegacyCompatibility(unittest.TestCase):
    def test_legacy_gate_never_authorizes(self):
        verdict, due, _ = access_decision(project_seed(":: SPEAK\nOK\n:: DEBUG\niter: 1\nmsg: 1\nprev: none\nxref: none\n"))
        self.assertEqual(verdict, ACCESS_DENY)
        self.assertTrue(any("DUE-GATE-OWNER" in d for d in due))
        self.assertFalse(read_allowed("anything"))

    def test_seed_projection_stays_idempotent_for_old_artifacts(self):
        seeded = project_seed("legacy")
        self.assertEqual(project_seed(seeded), seeded)

    def test_unified_runtime_files_exist(self):
        for rel in ("IKANT_ROA_ACCESS_CONTRACT.md", "Operation/runner/runtime.js", "Operation/runner/orchestrator.js", "Operation/runner/reticular.js"):
            self.assertTrue(os.path.exists(os.path.join(REPO_ROOT, rel)), rel)


if __name__ == "__main__":
    unittest.main()
