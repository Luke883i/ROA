#!/usr/bin/env python3
from __future__ import annotations
import json
import sys
import unittest
from pathlib import Path
HERE = Path(__file__).resolve().parent
if str(HERE) not in sys.path: sys.path.insert(0, str(HERE))
import semantic_runtime as rt

class SemanticPlaneTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.manifest=json.loads(rt.MANIFEST.read_text(encoding="utf-8")); cls.curation=json.loads(rt.CURATION.read_text(encoding="utf-8")); cls.midx=rt.manifest_index(cls.manifest); cls.cidx=rt.curation_index(cls.curation)
    def test_reticulum_is_well_formed(self): self.assertEqual(rt.validate_reticulum(), [])
    def test_control_plane_has_one_gate_owner_and_zero_authority(self):
        c=json.loads(rt.RETICULUM.read_text(encoding="utf-8"))["control"]
        self.assertEqual(c["single_gate_owner"],"Operation/runner/runtime.js"); self.assertEqual(c["orchestrator"],"Operation/runner/orchestrator.js"); self.assertEqual(c["reticular_reader"],"Operation/runner/reticular.js"); self.assertEqual(c["legacy_access_gate"],"NON_AUTHORIZING_COMPATIBILITY"); self.assertEqual(c["epistemic_authority"],0.0)
    def test_curation_overlay_does_not_rewrite_acquisition_role(self):
        for mid,cur in self.cidx.items():
            self.assertEqual(self.midx[mid]["role"],"UNREVIEWED_AUTOSEEDED"); st=rt.semantic_status(self.midx[mid],cur); self.assertEqual(st["authority"],0.0); self.assertTrue(st["readable"])
    def test_pce_is_not_on_core_route(self): self.assertNotIn("PCE",json.loads(rt.RETICULUM.read_text(encoding="utf-8"))["core_route"])
    def test_witnesses_never_upgrade_authority(self):
        nodes={n["id"]:n for n in json.loads(rt.RETICULUM.read_text(encoding="utf-8"))["nodes"]}; self.assertEqual(nodes["AOSP"]["authority_class"],"witness_only"); self.assertEqual(nodes["BRYOPHYTE"]["authority_class"],"witness_only")
    def test_edges_have_vector_weights_debt_and_falsifiers(self):
        for e in json.loads(rt.RETICULUM.read_text(encoding="utf-8"))["edges"]:
            self.assertEqual(set(e["weight"]),{"routing","preservation","authority","falsifiability","debt_cost"}); self.assertIsInstance(e["debt"],list); self.assertTrue(e["falsifier"])
    def test_route_is_small_and_deterministic(self): self.assertEqual(rt.route(["RLA"],max_nodes=8),rt.route(["RLA"],max_nodes=8)); self.assertLessEqual(len(rt.route(["RLA"],max_nodes=8)),8)

class InferenceTests(unittest.TestCase):
    def test_hash_validity_cannot_fill_permission(self): self.assertIsNone(rt.claim_envelope(evidence_status="HashVerifiedOnly",debt=["validation"],terminal="Answer",receipt={"sha256":"x"})["permission"])
    def test_nonanswer_terminal_blocks_use(self): self.assertEqual(rt.named_use_gate(rt.claim_envelope(evidence_status="Unknown",debt=["source"],terminal="Unknown",receipt={}),adequate_horizon=True,blocking_debt=False,human_authority=True),"Blocked")
    def test_blocking_debt_requires_review(self): self.assertEqual(rt.named_use_gate(rt.claim_envelope(evidence_status="Supported",debt=["validation"],terminal="Answer",receipt={}),adequate_horizon=True,blocking_debt=True,human_authority=True),"ReviewRequired")
    def test_horizon_inadequate_precedes_permission(self): self.assertEqual(rt.named_use_gate(rt.claim_envelope(evidence_status="Supported",debt=[],terminal="Answer",receipt={}),adequate_horizon=False,blocking_debt=False,human_authority=True),"HorizonInadequate")
    def test_human_authority_required(self):
        e=rt.claim_envelope(evidence_status="Supported",debt=[],terminal="Answer",receipt={}); self.assertEqual(rt.named_use_gate(e,adequate_horizon=True,blocking_debt=False,human_authority=False),"ReviewRequired"); self.assertEqual(rt.named_use_gate(e,adequate_horizon=True,blocking_debt=False,human_authority=True),"Warranted")

if __name__ == "__main__": unittest.main()
