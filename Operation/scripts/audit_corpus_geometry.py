#!/usr/bin/env python3
"""Audit repository corpus geometry — deterministic inventory of corpus files.

Compares the actual filesystem, Operation/MANIFEST.json, and text sidecars.
Semantic review state is deliberately not a geometry failure: the manifest and
semantic curation layer may lawfully contain UNREVIEWED_AUTOSEEDED entries.

Exit codes:
  0  all geometry/integrity entries OK (or --report mode)
  1  at least one blocking geometry/integrity classification detected (--check)
"""

from __future__ import annotations

import argparse
import sys

from manifest_common import (
    MANIFEST_PATH,
    REPO_ROOT,
    expected_raw_url,
    load_manifest,
    sha256_file,
    sidecar_relpath,
)

OPERATION_DIR_NAME = "Operation"

OK = "OK"
STALE_MANIFEST_PATH = "STALE_MANIFEST_PATH"
STALE_RAW_URL = "STALE_RAW_URL"
STALE_TEXT_URL = "STALE_TEXT_URL"
MISSING_SIDECAR = "MISSING_SIDECAR"
STALE_SIDECAR_METADATA = "STALE_SIDECAR_METADATA"
UNMANIFESTED_PDF = "UNMANIFESTED_PDF"
MANIFEST_ENTRY_MISSING_FILE = "MANIFEST_ENTRY_MISSING_FILE"
ROLE_UNREVIEWED_AUTOSEEDED = "ROLE_UNREVIEWED_AUTOSEEDED"  # informational semantic state, not geometry failure


def discover_pdfs() -> list[str]:
    """Return all repository-relative PDF paths (excluding .git and Operation/)."""
    pdfs: list[str] = []
    for path in sorted(REPO_ROOT.rglob("*.pdf")):
        if any(part == ".git" for part in path.parts):
            continue
        rel = path.relative_to(REPO_ROOT)
        if rel.parts and rel.parts[0] == OPERATION_DIR_NAME:
            continue
        pdfs.append(rel.as_posix())
    return pdfs


def audit(manifest: dict) -> list[dict]:
    """Return one geometry/integrity audit entry per PDF or manifest entry."""
    repository = manifest["repository"]
    branch = manifest["default_branch"]
    pdfs_on_disk = set(discover_pdfs())
    manifest_entries = {entry["path"]: entry for entry in manifest["pdfs"]}
    results: list[dict] = []

    for entry in manifest["pdfs"]:
        eid = entry["id"]
        path = entry["path"]
        issues: list[str] = []

        abs_path = REPO_ROOT / path
        if not abs_path.exists():
            results.append({
                "id": eid,
                "path": path,
                "role": entry.get("role", ""),
                "status": [MANIFEST_ENTRY_MISSING_FILE],
            })
            continue

        expected = expected_raw_url(repository, branch, path)
        if entry.get("raw_url") != expected:
            issues.append(STALE_RAW_URL)

        sidecar_rel = sidecar_relpath(eid)
        expected_text = expected_raw_url(repository, branch, sidecar_rel)
        if entry.get("text_url") != expected_text:
            issues.append(STALE_TEXT_URL)

        sidecar_path = REPO_ROOT / sidecar_rel
        if not sidecar_path.exists():
            issues.append(MISSING_SIDECAR)

        # Role/curation is semantic metadata, not repository geometry. In
        # particular UNREVIEWED_AUTOSEEDED is an allowed manifest role and is
        # handled by the curation overlay and semantic gates. Do not false-red
        # an otherwise aligned corpus merely because human curation is pending.

        if entry.get("sha256"):
            actual_sha = sha256_file(abs_path)
            if entry["sha256"] != actual_sha:
                issues.append("STALE_SHA256")

        status = issues if issues else [OK]
        results.append({
            "id": eid,
            "path": path,
            "role": entry.get("role", ""),
            "status": status,
        })

    manifested_paths = set(manifest_entries.keys())
    for pdf_path in sorted(pdfs_on_disk - manifested_paths):
        results.append({
            "id": None,
            "path": pdf_path,
            "status": [UNMANIFESTED_PDF],
        })

    return results


def format_report(results: list[dict]) -> str:
    """Format an audit report as human-readable text."""
    lines = ["# Corpus Geometry Audit Report", ""]
    ok_count = sum(1 for r in results if r["status"] == [OK])
    issue_count = len(results) - ok_count
    lines.append(f"**Total entries:** {len(results)}")
    lines.append(f"**OK:** {ok_count}")
    lines.append(f"**Issues:** {issue_count}")
    lines.append("")

    if issue_count > 0:
        lines.append("## Issues")
        lines.append("")
        for r in results:
            if r["status"] != [OK]:
                lines.append(f"- **{', '.join(r['status'])}** — `{r['path']}`"
                             + (f" (id: `{r['id']}`)" if r.get("id") else ""))
        lines.append("")

    lines.append("## All entries")
    lines.append("")
    for r in results:
        status_str = ", ".join(r["status"])
        lines.append(f"- [{status_str}] `{r['path']}`"
                     + (f" (id: `{r['id']}`)" if r.get("id") else ""))

    return "\n".join(lines) + "\n"


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Audit corpus geometry.")
    parser.add_argument(
        "--check",
        action="store_true",
        help="fail (exit 1) if any blocking geometry/integrity issue exists",
    )
    args = parser.parse_args(argv)

    if not MANIFEST_PATH.exists():
        print("FAIL: Operation/MANIFEST.json not found", file=sys.stderr)
        return 1

    manifest = load_manifest()
    results = audit(manifest)
    report = format_report(results)

    ok_count = sum(1 for r in results if r["status"] == [OK])
    issue_count = len(results) - ok_count

    if args.check:
        if issue_count > 0:
            print(report, file=sys.stderr)
            print(
                f"Corpus geometry FAILED: {issue_count} issue(s) detected.",
                file=sys.stderr,
            )
            return 1
        print(
            f"Corpus geometry OK: no stale paths, no stale raw URLs, "
            f"no missing sidecars. {ok_count} entries checked."
        )
        return 0

    print(report)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
