#!/usr/bin/env python3
"""iKant incarnation test — deterministic agentification gate.

This is MDAS-6: the single source of truth for the SPEAK/DEBUG contract and for
MDAS completeness. It is consumed both by CI (``.github/workflows/
ikant-incarnation.yml``) and, conceptually, by the Architecture B middleware
described in ``governance/MDAS.md``.

Design goals (see AGENTS.md): minimal, deterministic, no external dependencies,
robust. It validates two things:

1. **MDAS completeness** — every fixed artifact in the set exists and AGENTS.md
   covers the required concepts.
2. **Response contract** — a candidate agent response provably incarnates iKant
   (SPEAK/DEBUG headers + trace metadata + no overclaim). A non-agentified
   response is detected and motivated as DEBT/DUE (failure simulation).

Run directly (``python governance/incarnation_test.py``) or via unittest.
Exit code 0 = pass, non-zero = regression.
"""

from __future__ import annotations

import os
import re
import unittest

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# --- MDAS-1: fixed artifact set (mirrors governance/MDAS.md section 1) --------
MDAS_FILES = [
    "AGENTS.md",
    "governance/MDAS.md",
    "governance/DecisionLog.md",
    "governance/examples/agentified_api_call.md",
    "governance/examples/rollback_scenario.md",
    "governance/simulations.md",
    "governance/incarnation_test.py",
    ".github/workflows/ikant-incarnation.yml",
    "README.md",
]

# Concepts that AGENTS.md must cover (subset of the concept-coverage checklist).
REQUIRED_AGENTS_CONCEPTS = [
    ":: SPEAK",
    ":: DEBUG",
    "TRACE",
    "iter:",
    "msg:",
    "prev:",
    "xref:",
    "ART-0001",
    "ART-0002",
    "anti-injection",
    "rollback",
    "legacy absorption",
]

SPEAK_HEADER = ":: SPEAK"
DEBUG_HEADER = ":: DEBUG"

# Forbidden overclaims in SPEAK unless explicitly qualified (README section 8).
OVERCLAIM_PATTERNS = [
    r"\bis proven\b",
    r"\bproven fact\b",
    r"\bmathematically proven\b",
    r"\blegally certified\b",
    r"\bproduction[- ]ready\b",
    r"\bempirically validated\b",
    r"\bis conscious\b",
]

TRACE_KEYS = ["iter:", "msg:", "prev:", "xref:"]


def validate_response(text: str) -> list[str]:
    """Classify a candidate agent response.

    Returns a list of DUE/DEBT codes. An empty list means the response provably
    incarnates iKant. A non-empty list is the motivated debt of a non-agentified
    (or invalid) response.
    """
    due: list[str] = []

    has_speak = SPEAK_HEADER in text
    has_debug = DEBUG_HEADER in text
    if not (has_speak and has_debug):
        due.append("DUE-LAYOUT: missing ':: SPEAK' / ':: DEBUG' headers")

    # DOS-like layout requires SPEAK before DEBUG (AGENTS.md section 1).
    if has_speak and has_debug and text.index(SPEAK_HEADER) > text.index(DEBUG_HEADER):
        due.append("DUE-LAYOUT: ':: SPEAK' must appear before ':: DEBUG'")

    # Trace metadata must live in the DEBUG region and carry a non-empty value
    # (AGENTS.md section 1.2: a key with no value is missing traceability).
    debug_region = text.split(DEBUG_HEADER, 1)[1] if has_debug else ""
    missing_trace = [
        k for k in TRACE_KEYS
        if not re.search(re.escape(k) + r"[ \t]*\S", debug_region)
    ]
    if missing_trace:
        due.append("DUE-TRACE: missing or empty " + ", ".join(missing_trace))

    # Overclaim guard. Check the SPEAK region when present; otherwise (a
    # non-agentified bare answer) check the whole text so overclaims are still
    # detected and motivated.
    if has_speak:
        speak_region = text.split(SPEAK_HEADER, 1)[1]
        if has_debug:
            speak_region = speak_region.split(DEBUG_HEADER, 1)[0]
    else:
        speak_region = text
    for pat in OVERCLAIM_PATTERNS:
        if re.search(pat, speak_region, re.IGNORECASE):
            due.append(f"DUE-RISK: overclaim matched /{pat}/ violates README section 8")

    return due


def is_agentified(text: str) -> bool:
    """True iff the response provably incarnates iKant (no DEBT)."""
    return not validate_response(text)


# --- Reference fixtures -------------------------------------------------------
GOOD_RESPONSE = """:: SPEAK --------------------------------------------------

Start with the entrypoint paper; controlled reification is a defensible thesis,
not a proven result.

:: DEBUG --------------------------------------------------

***TRACE***
- iter: I-0001
- msg: M-0001
- prev: none
- xref: ART-0002

***EPISTEMIC STATE***
- state: supported
- decision: answer
"""

BARE_RESPONSE = "Read the entrypoint paper. Controlled reification is proven."

NO_DEBUG_RESPONSE = """:: SPEAK --------------------------------------------------

Just an answer with no debug surface.
"""


class TestMDASCompleteness(unittest.TestCase):
    def test_all_mdas_files_exist(self):
        for rel in MDAS_FILES:
            path = os.path.join(REPO_ROOT, rel)
            self.assertTrue(os.path.exists(path), f"MDAS artifact missing: {rel}")

    def test_agents_concept_coverage(self):
        with open(os.path.join(REPO_ROOT, "AGENTS.md"), encoding="utf-8") as fh:
            agents = fh.read()
        for concept in REQUIRED_AGENTS_CONCEPTS:
            self.assertIn(concept, agents, f"AGENTS.md missing concept: {concept}")


class TestResponseContract(unittest.TestCase):
    # SIM-01 / SIM-06: a well-formed agentified response passes.
    def test_good_response_is_agentified(self):
        self.assertEqual(validate_response(GOOD_RESPONSE), [])
        self.assertTrue(is_agentified(GOOD_RESPONSE))

    # SIM-12: non-agentified bare answer -> DEBT (layout + trace + overclaim).
    def test_bare_response_creates_debt(self):
        due = validate_response(BARE_RESPONSE)
        self.assertFalse(is_agentified(BARE_RESPONSE))
        self.assertTrue(any("DUE-LAYOUT" in d for d in due))
        self.assertTrue(any("DUE-TRACE" in d for d in due))
        self.assertTrue(any("DUE-RISK" in d for d in due))

    # SIM-08: SPEAK present but DEBUG dropped -> DUE-LAYOUT + DUE-TRACE.
    def test_missing_debug_creates_debt(self):
        due = validate_response(NO_DEBUG_RESPONSE)
        self.assertTrue(any("DUE-LAYOUT" in d for d in due))
        self.assertTrue(any("DUE-TRACE" in d for d in due))

    # SIM-09: agentified layout but missing trace metadata -> DUE-TRACE.
    def test_missing_trace_creates_debt(self):
        text = GOOD_RESPONSE.replace("- iter: I-0001\n", "")
        due = validate_response(text)
        self.assertTrue(any("DUE-TRACE" in d for d in due))

    # F1 (SIM-09b): missing xref must be detected -> DUE-TRACE.
    def test_missing_xref_creates_debt(self):
        text = GOOD_RESPONSE.replace("- xref: ART-0002\n", "")
        due = validate_response(text)
        self.assertTrue(any("DUE-TRACE" in d and "xref:" in d for d in due))

    # F2: DEBUG before SPEAK breaks the DOS-like layout -> DUE-LAYOUT.
    def test_debug_before_speak_creates_debt(self):
        speak = GOOD_RESPONSE.split(DEBUG_HEADER, 1)[0]
        debug = DEBUG_HEADER + GOOD_RESPONSE.split(DEBUG_HEADER, 1)[1]
        inverted = debug + "\n" + speak
        due = validate_response(inverted)
        self.assertTrue(any("must appear before" in d for d in due))

    # F3 (SIM-09c): a trace key present but with an empty value is still missing
    # traceability (AGENTS.md section 1.2) -> DUE-TRACE.
    def test_empty_trace_value_creates_debt(self):
        text = GOOD_RESPONSE.replace("- xref: ART-0002", "- xref:")
        due = validate_response(text)
        self.assertFalse(is_agentified(text))
        self.assertTrue(any("DUE-TRACE" in d and "xref:" in d for d in due))


def main() -> int:
    suite = unittest.defaultTestLoader.loadTestsFromModule(__import__(__name__))
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    return 0 if result.wasSuccessful() else 1


if __name__ == "__main__":
    raise SystemExit(main())
