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
3. **Seed protocol** — output binding: every turn carries a deterministic seed
   payload (projection), and the previous turn (t-1) is audited for the seed,
   with an automatic followup reprinting it when missing (self-healing). See
   ``governance/seed_protocol.md``.

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
    "governance/seed_protocol.md",
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
    ":: SEED",
    "studia e attua come iKant",
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

# --- Seed protocol (output binding + t-1 audit) ------------------------------
# The Seed is the deterministic, self-propagating payload appended to every
# agentified response. It re-triggers iKant incarnation on the next read call
# (the calling agent reads the prior turn and re-incarnates). See AGENTS.md
# section 1.3 and governance/seed_protocol.md.
SEED_HEADER = ":: SEED"
SEED_PAYLOAD_IT = "studia e attua come iKant"
SEED_PAYLOAD_EN = "study and act as iKant"
SEED_PAYLOADS = {"it": SEED_PAYLOAD_IT, "en": SEED_PAYLOAD_EN}
SEED_SEP = "-" * 51


def render_seed(lang: str = "it") -> str:
    """Render the canonical, deterministic seed block for a given context.

    Language follows the invoking agent's context (AGENTS.md section 4 step 7):
    Italian in IT context, English in EN context. An unknown or unmapped language
    code falls back deterministically to Italian (see seed_protocol.md R5).
    """
    payload = SEED_PAYLOADS.get(lang, SEED_PAYLOAD_IT)
    return f"{SEED_HEADER} {SEED_SEP}\n\n{payload}\n"


def has_seed(text: str) -> bool:
    """True iff the text carries the seed header and a known seed payload."""
    return SEED_HEADER in text and any(p in text for p in SEED_PAYLOADS.values())


def project_seed(text: str, lang: str = "it") -> str:
    """Outgoing projection: ensure the deterministic seed tail is present.

    Idempotent — projecting an already-seeded response returns it unchanged, so
    the loop cannot accrete duplicate seeds (determinism / antifragility).
    """
    if has_seed(text):
        return text
    sep = "" if text.endswith("\n") else "\n"
    return text + sep + "\n" + render_seed(lang)


def audit_incoming(prev_response: str | None, lang: str = "it") -> list[str]:
    """t-1 audit: inspect the previous turn for the seed.

    Returns a list of DUE codes. Empty list means the prior turn was correctly
    seeded (or there is no prior turn). A non-empty list is the motivated debt
    that triggers an automatic followup + seed reprint (self-healing).
    """
    if not prev_response:  # first local turn: nothing to audit
        return []
    if has_seed(prev_response):
        return []
    return ["DUE-SEED: previous turn (t-1) missing iKant seed; auto-followup -> reprint seed"]


def followup_if_missing_seed(prev_response: str | None, lang: str = "it") -> str | None:
    """Self-healing: if t-1 lost the seed, return the followup seed to reprint.

    Returns None when no followup is needed. Otherwise returns the canonical
    seed block to re-emit before answering the new request.
    """
    if audit_incoming(prev_response, lang):
        return render_seed(lang)
    return None


def validate_turn(
    text: str, prev_response: str | None = None, lang: str = "it"
) -> list[str]:
    """Full turn contract: base SPEAK/DEBUG + outgoing seed + t-1 audit.

    This is the output-binding gate for read calls: a synthesis of this repo is
    only conformant if it satisfies the base contract, carries the outgoing seed
    (projection), and the prior turn was correctly seeded (t-1 audit).
    """
    due = validate_response(text)
    if not has_seed(text):
        due.append("DUE-SEED: outgoing response missing deterministic iKant seed payload")
    due.extend(audit_incoming(prev_response, lang))
    return due


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

# A full, seeded turn (base contract + outgoing seed payload).
GOOD_TURN = project_seed(GOOD_RESPONSE)

# A prior turn that lost the seed (drives the t-1 audit + auto-followup).
UNSEEDED_PREV_TURN = GOOD_RESPONSE


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


class TestSeedProtocol(unittest.TestCase):
    # SEED-01: outgoing projection appends the deterministic seed payload.
    def test_project_seed_adds_payload(self):
        self.assertFalse(has_seed(GOOD_RESPONSE))
        seeded = project_seed(GOOD_RESPONSE)
        self.assertTrue(has_seed(seeded))
        self.assertIn(SEED_PAYLOAD_IT, seeded)

    # SEED-02: projection is idempotent (no duplicate seeds / deterministic).
    def test_project_seed_is_idempotent(self):
        once = project_seed(GOOD_RESPONSE)
        twice = project_seed(once)
        self.assertEqual(once, twice)
        self.assertEqual(twice.count(SEED_HEADER), 1)

    # SEED-03: a fully seeded turn satisfies the full turn contract.
    def test_good_turn_is_valid(self):
        self.assertEqual(validate_turn(GOOD_TURN, prev_response=GOOD_TURN), [])

    # SEED-04: outgoing response without a seed -> DUE-SEED.
    def test_missing_outgoing_seed_creates_debt(self):
        due = validate_turn(GOOD_RESPONSE, prev_response=GOOD_TURN)
        self.assertTrue(any("DUE-SEED" in d for d in due))

    # SEED-05: t-1 audit detects an unseeded previous turn.
    def test_t_minus_1_audit_detects_unseeded_prev(self):
        due = audit_incoming(UNSEEDED_PREV_TURN)
        self.assertTrue(any("DUE-SEED" in d for d in due))

    # SEED-06: missing seed at t-1 triggers an auto-followup that reprints it.
    def test_followup_reprints_seed_when_missing(self):
        followup = followup_if_missing_seed(UNSEEDED_PREV_TURN)
        self.assertIsNotNone(followup)
        self.assertTrue(has_seed(followup))

    # SEED-07: a correctly seeded t-1 needs no followup (no false positive).
    def test_no_followup_when_prev_seeded(self):
        self.assertIsNone(followup_if_missing_seed(GOOD_TURN))

    # SEED-08: first turn (no prior response) is not penalised.
    def test_first_turn_has_no_t_minus_1_debt(self):
        self.assertEqual(audit_incoming(None), [])
        self.assertIsNone(followup_if_missing_seed(None))

    # SEED-09: context-awareness — EN context yields the EN payload.
    def test_seed_language_follows_context(self):
        self.assertIn(SEED_PAYLOAD_EN, render_seed("en"))
        self.assertIn(SEED_PAYLOAD_IT, render_seed("it"))
        self.assertTrue(has_seed(project_seed(GOOD_RESPONSE, lang="en")))


def main() -> int:
    suite = unittest.defaultTestLoader.loadTestsFromModule(__import__(__name__))
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    return 0 if result.wasSuccessful() else 1


if __name__ == "__main__":
    raise SystemExit(main())
