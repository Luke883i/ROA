#!/usr/bin/env python3
"""Focused regression tests for deterministic MANIFEST generation."""

from __future__ import annotations

import json
import sys
import tempfile
import unittest
from contextlib import contextmanager
from pathlib import Path

from pypdf import PdfWriter

SCRIPTS_DIR = Path(__file__).resolve().parent
if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))

import build_manifest  # noqa: E402
import manifest_common  # noqa: E402


def write_pdf(path: Path) -> None:
    """Write a tiny valid PDF fixture."""
    path.parent.mkdir(parents=True, exist_ok=True)
    writer = PdfWriter()
    writer.add_blank_page(width=72, height=72)
    with path.open("wb") as fh:
        writer.write(fh)


def manifest_template(pdfs: list[dict]) -> dict:
    """Return a minimal valid manifest seed for test fixtures."""
    return {
        "schema_version": "1.0",
        "repository": "https://github.com/Luke883i/RLA-ECNN",
        "default_branch": "main",
        "agent_access_policy": {
            "canonical_download_method": "raw_url",
            "do_not_use_as_primary": [
                "github_html_blob_pages",
                "third_party_cloud_preview_links",
                "proton_drive_links",
                "readme_filename_inference",
                "ui_dependent_download_buttons",
            ],
            "fallback": "github_release_asset_if_file_exceeds_regular_git_limits",
            "size_policy": {
                "in_repo_max_mib": 50,
                "prefer_release_asset_mib": "50-100",
                "release_or_external_above_mib": 100,
            },
            "on_fetch_failure": "report DUE-CORPUS-FETCH with id, path and raw_url",
            "preferred_read_order": [
                "text_url",
                "raw_url",
                "github_release_asset_if_file_exceeds_regular_git_limits",
            ],
        },
        "pdfs": pdfs,
    }


class BuildManifestTestCase(unittest.TestCase):
    @contextmanager
    def temporary_repo(self, manifest: dict):
        with tempfile.TemporaryDirectory() as tmpdir:
            root = Path(tmpdir)
            operation = root / build_manifest.OPERATION_DIR_NAME
            operation.mkdir(parents=True, exist_ok=True)
            (operation / "MANIFEST.json").write_text(
                json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
                encoding="utf-8",
            )

            original_paths: dict[object, dict[str, Path]] = {}
            for module in (build_manifest, manifest_common):
                original_paths[module] = {}
                if hasattr(module, "REPO_ROOT"):
                    original_paths[module]["REPO_ROOT"] = module.REPO_ROOT
                    module.REPO_ROOT = root
                if hasattr(module, "OPERATION_ROOT"):
                    original_paths[module]["OPERATION_ROOT"] = module.OPERATION_ROOT
                    module.OPERATION_ROOT = operation
                if hasattr(module, "MANIFEST_PATH"):
                    original_paths[module]["MANIFEST_PATH"] = module.MANIFEST_PATH
                    module.MANIFEST_PATH = operation / "MANIFEST.json"
                if hasattr(module, "TEXT_ROOT"):
                    original_paths[module]["TEXT_ROOT"] = module.TEXT_ROOT
                    module.TEXT_ROOT = operation / "corpus" / "text"

            try:
                yield root
            finally:
                for module, values in original_paths.items():
                    for name, value in values.items():
                        setattr(module, name, value)

    def test_autoseeds_unseeded_pdf_and_sidecar(self):
        manifest = manifest_template(
            [
                {
                    "id": "seeded-doc",
                    "title": "Seeded Doc",
                    "role": "core_paper",
                    "path": "seeded.pdf",
                }
            ]
        )
        with self.temporary_repo(manifest) as root:
            write_pdf(root / "seeded.pdf")
            write_pdf(root / "new_doc.pdf")

            manifest_text, sidecars = build_manifest.build_outputs()
            output = json.loads(manifest_text)

            self.assertEqual(2, len(output["pdfs"]))
            autoseeded = next(entry for entry in output["pdfs"] if entry["id"] != "seeded-doc")
            self.assertEqual("new-doc", autoseeded["id"])
            self.assertEqual("New Doc", autoseeded["title"])
            self.assertEqual(build_manifest.AUTOSEEDED_ROLE, autoseeded["role"])
            self.assertEqual("new_doc.pdf", autoseeded["path"])
            self.assertIn("text_url", autoseeded)
            self.assertIn("text_sha256", autoseeded)
            self.assertIn("Operation/corpus/text/new-doc.md", sidecars)

    def test_seeded_pdf_is_not_duplicated_after_path_resolution(self):
        manifest = manifest_template(
            [
                {
                    "id": "seeded-doc",
                    "title": "Seeded Doc",
                    "role": "core_paper",
                    "path": "existing.pdf",
                }
            ]
        )
        with self.temporary_repo(manifest) as root:
            write_pdf(root / "_existing.pdf")

            manifest_text, sidecars = build_manifest.build_outputs()
            output = json.loads(manifest_text)

            self.assertEqual(1, len(output["pdfs"]))
            self.assertEqual("_existing.pdf", output["pdfs"][0]["path"])
            self.assertEqual({"Operation/corpus/text/seeded-doc.md"}, set(sidecars))

    def test_seeded_pdf_resolves_numbered_entrypoint_prefix(self):
        manifest = manifest_template(
            [
                {
                    "id": "entrypoint",
                    "title": "Entrypoint",
                    "role": "main_entrypoint",
                    "path": "_ROA - Reticular Observer Architectures for Governable AI-Assisted Work (main Entrypoint).pdf",
                }
            ]
        )
        with self.temporary_repo(manifest) as root:
            write_pdf(
                root
                / "(2) 🗎 ROA - Reticular Observer Architectures for Governable AI-Assisted Work (main Entrypoint).pdf"
            )

            manifest_text, _ = build_manifest.build_outputs()
            output = json.loads(manifest_text)

            self.assertEqual(1, len(output["pdfs"]))
            self.assertEqual(
                "(2) 🗎 ROA - Reticular Observer Architectures for Governable AI-Assisted Work (main Entrypoint).pdf",
                output["pdfs"][0]["path"],
            )

    def test_generation_is_idempotent(self):
        manifest = manifest_template(
            [
                {
                    "id": "seeded-doc",
                    "title": "Seeded Doc",
                    "role": "core_paper",
                    "path": "seeded.pdf",
                }
            ]
        )
        with self.temporary_repo(manifest) as root:
            write_pdf(root / "seeded.pdf")
            write_pdf(root / "new_doc.pdf")

            first_manifest, first_sidecars = build_manifest.build_outputs()
            self.assertEqual(0, build_manifest.write_outputs(first_manifest, first_sidecars))
            snapshot_one = {
                "manifest": (root / "Operation" / "MANIFEST.json").read_text(encoding="utf-8"),
                "sidecars": {
                    path.relative_to(root).as_posix(): path.read_text(encoding="utf-8")
                    for path in sorted((root / "Operation" / "corpus" / "text").glob("*.md"))
                },
            }

            second_manifest, second_sidecars = build_manifest.build_outputs()
            self.assertEqual(0, build_manifest.check_outputs(second_manifest, second_sidecars))
            self.assertEqual(0, build_manifest.write_outputs(second_manifest, second_sidecars))
            snapshot_two = {
                "manifest": (root / "Operation" / "MANIFEST.json").read_text(encoding="utf-8"),
                "sidecars": {
                    path.relative_to(root).as_posix(): path.read_text(encoding="utf-8")
                    for path in sorted((root / "Operation" / "corpus" / "text").glob("*.md"))
                },
            }

            self.assertEqual(snapshot_one, snapshot_two)

    def test_autoseeded_ids_are_unique_and_deterministic(self):
        manifest = manifest_template([])
        with self.temporary_repo(manifest) as root:
            write_pdf(root / "A" / "Test Doc.pdf")
            write_pdf(root / "B" / "_Test_Doc.pdf")

            manifest_text, _ = build_manifest.build_outputs()
            output = json.loads(manifest_text)

            self.assertEqual(
                ["test-doc", "test-doc-2"],
                [entry["id"] for entry in output["pdfs"]],
            )
            self.assertEqual(
                ["A/Test Doc.pdf", "B/_Test_Doc.pdf"],
                [entry["path"] for entry in output["pdfs"]],
            )

    def test_discovery_excludes_operation_folder(self):
        manifest = manifest_template([])
        with self.temporary_repo(manifest) as root:
            write_pdf(root / "visible.pdf")
            write_pdf(root / build_manifest.OPERATION_DIR_NAME / "hidden.pdf")

            paths = build_manifest.discover_pdfs()

            self.assertIn("visible.pdf", paths)
            self.assertFalse(
                any(path.startswith(f"{build_manifest.OPERATION_DIR_NAME}/") for path in paths)
            )


if __name__ == "__main__":
    unittest.main(verbosity=2)
