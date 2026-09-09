#!/usr/bin/env python3
from __future__ import annotations
import json
import sys
import tempfile
import unittest
from pathlib import Path
HERE = Path(__file__).resolve().parent
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))
import semantic_runtime as rt

TERMS = "1d1eb4b669d90f637b73b36c56ff29f4707ea3878734aff633b97d54d96dd1ea"
PROMPT_SHA = "41cc336852a94d9ee69e00192d937ebceeab4bbccba9c4a15e1409f633285c9e"
REF = "ea2bef21859eab78cdedc4296720c18c5c977db7"

def receipt(**kw):
    base = {"session_id":"TEST-SESSION","epoch":1,"contract_version":"1.1.0","terms_sha256":TERMS,"accepted_command":"I ACCEPT","repository_ref":REF,"prompt_path":"Operation/iKANT_PROMPT.md","prompt_version":"3.0.0","prompt_sha256":PROMPT_SHA,"prompt_loaded_at":"2026-09-09T18:00:00+02:00","runtime_mode":"FILE","status":"ACTIVE_FILE","initialized_at":"2026-09-09T18:00:01+02:00"}
    base.update(kw)
    return base

class PromptBindingTests(unittest.TestCase):
    def test_prompt_body_hash_matches_contract(self):
        b = rt.bind_operating_prompt(expected_sha256=PROMPT_SHA, expected_version="3.0.0")
        self.assertTrue(b.ok, b.reason); self.assertEqual(b.sha256, PROMPT_SHA); self.assertIn("IKANT UNIVERSAL META-PROMPT v3.0", b.body)
    def test_prompt_drift_fails_closed(self):
        with tempfile.TemporaryDirectory() as td:
            p = Path(td) / "prompt.md"; p.write_text(rt.PROMPT.read_text(encoding="utf-8").replace("A1 representation!=reality", "A1 representation==reality", 1), encoding="utf-8")
            b = rt.bind_operating_prompt(expected_sha256=PROMPT_SHA, expected_version="3.0.0", path=p)
            self.assertFalse(b.ok); self.assertIn(b.reason, {"prompt-self-digest-mismatch", "prompt-contract-digest-mismatch"})
    def test_prompt_marker_damage_fails_closed(self):
        with tempfile.TemporaryDirectory() as td:
            p = Path(td) / "prompt.md"; p.write_text("IKANT_PROMPT_VERSION: 3.0.0\n", encoding="utf-8")
            self.assertFalse(rt.bind_operating_prompt(expected_sha256=PROMPT_SHA, expected_version="3.0.0", path=p).ok)

class AccessContinuityTests(unittest.TestCase):
    def validate(self, r): return rt.validate_session_receipt(r, terms_sha256=TERMS, contract_version="1.1.0", prompt_sha256=PROMPT_SHA, prompt_version="3.0.0")
    def test_active_receipt_binds_acceptance_and_prompt(self): self.assertTrue(self.validate(receipt()).allowed)
    def test_non_exact_acceptance_is_invalid(self): self.assertEqual(self.validate(receipt(accepted_command="I accept")).state, "RECEIPT_INVALID")
    def test_terms_drift_resets(self): self.assertEqual(self.validate(receipt(terms_sha256="x")).state, "RESET_REQUIRED")
    def test_contract_drift_resets(self): self.assertEqual(self.validate(receipt(contract_version="0")).state, "RESET_REQUIRED")
    def test_prompt_digest_drift_resets(self): self.assertEqual(self.validate(receipt(prompt_sha256="x")).state, "RESET_REQUIRED")
    def test_prompt_version_drift_resets(self): self.assertEqual(self.validate(receipt(prompt_version="2.0.0")).state, "RESET_REQUIRED")
    def test_prompt_path_drift_resets(self): self.assertEqual(self.validate(receipt(prompt_path="tmp/prompt.md")).state, "RESET_REQUIRED")
    def test_missing_prompt_binding_invalidates_receipt(self):
        r=receipt(); r.pop("prompt_loaded_at"); self.assertEqual(self.validate(r).state, "RECEIPT_INVALID")
    def test_source_drift_never_silent(self):
        self.assertEqual(rt.source_ref_state(receipt(), "different"), "SOURCE_DRIFT"); self.assertEqual(rt.source_ref_state(receipt(), REF), "PINNED")

class SemanticPlaneTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.manifest=json.loads(rt.MANIFEST.read_text(encoding="utf-8")); cls.curation=json.loads(rt.CURATION.read_text(encoding="utf-8")); cls.midx=rt.manifest_index(cls.manifest); cls.cidx=rt.curation_index(cls.curation)
    def test_reticulum_is_well_formed(self): self.assertEqual(rt.validate_reticulum(), [])
    def test_control_plane_binds_prompt_without_authority(self):
        control=json.loads(rt.RETICULUM.read_text(encoding="utf-8"))["control"]
        self.assertEqual(control["operating_prompt_path"], "Operation/iKANT_PROMPT.md"); self.assertEqual(control["operating_prompt_loader"], "Operation/runner/prompt.js"); self.assertEqual(control["operating_prompt_binding"], "prompt_body_sha256_in_session_receipt"); self.assertEqual(control["epistemic_authority"], 0.0)
    def test_curation_overlay_does_not_rewrite_acquisition_role(self):
        for mid,cur in self.cidx.items():
            self.assertEqual(self.midx[mid]["role"], "UNREVIEWED_AUTOSEEDED"); status=rt.semantic_status(self.midx[mid],cur); self.assertEqual(status["authority"],0.0); self.assertTrue(status["readable"])
    def test_iv_v_have_explicit_candidate_roles(self):
        self.assertEqual(self.cidx["iv-computational-semantics-of-claim-admissibility"]["semantic_role"], "claim_admissibility"); self.assertEqual(self.cidx["v-epistemi-debt-the-accounting-layer-of-computational-semantics"]["semantic_role"], "epistemic_debt_accounting")
    def test_pce_is_not_on_core_route(self): self.assertNotIn("PCE", json.loads(rt.RETICULUM.read_text(encoding="utf-8"))["core_route"])
    def test_witnesses_never_upgrade_authority(self):
        nodes={n["id"]:n for n in json.loads(rt.RETICULUM.read_text(encoding="utf-8"))["nodes"]}; self.assertEqual(nodes["AOSP"]["authority_class"],"witness_only"); self.assertEqual(nodes["BRYOPHYTE"]["authority_class"],"witness_only")
    def test_edges_have_vector_weights_debt_and_falsifiers(self):
        for edge in json.loads(rt.RETICULUM.read_text(encoding="utf-8"))["edges"]:
            self.assertEqual(set(edge["weight"]), {"routing","preservation","authority","falsifiability","debt_cost"}); self.assertIsInstance(edge["debt"], list); self.assertTrue(edge["falsifier"])
    def test_route_is_small_and_deterministic(self): self.assertEqual(rt.route(["RLA"], max_nodes=8), rt.route(["RLA"], max_nodes=8)); self.assertLessEqual(len(rt.route(["RLA"], max_nodes=8)),8)

class InferenceTests(unittest.TestCase):
    def test_hash_validity_cannot_fill_permission(self): self.assertIsNone(rt.claim_envelope(evidence_status="HashVerifiedOnly", debt=["validation"], terminal="Answer", receipt={"sha256":"x"})["permission"])
    def test_nonanswer_terminal_blocks_use(self): self.assertEqual(rt.named_use_gate(rt.claim_envelope(evidence_status="Unknown", debt=["source"], terminal="Unknown", receipt={}), adequate_horizon=True, blocking_debt=False, human_authority=True), "Blocked")
    def test_blocking_debt_requires_review(self): self.assertEqual(rt.named_use_gate(rt.claim_envelope(evidence_status="Supported", debt=["validation"], terminal="Answer", receipt={}), adequate_horizon=True, blocking_debt=True, human_authority=True), "ReviewRequired")
    def test_horizon_inadequate_precedes_permission(self): self.assertEqual(rt.named_use_gate(rt.claim_envelope(evidence_status="Supported", debt=[], terminal="Answer", receipt={}), adequate_horizon=False, blocking_debt=False, human_authority=True), "HorizonInadequate")
    def test_human_authority_is_required_for_warranted_use(self):
        e=rt.claim_envelope(evidence_status="Supported", debt=[], terminal="Answer", receipt={}); self.assertEqual(rt.named_use_gate(e, adequate_horizon=True, blocking_debt=False, human_authority=False), "ReviewRequired"); self.assertEqual(rt.named_use_gate(e, adequate_horizon=True, blocking_debt=False, human_authority=True), "Warranted")

if __name__ == "__main__": unittest.main()
