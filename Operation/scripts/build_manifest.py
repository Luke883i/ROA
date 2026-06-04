#!/usr/bin/env python3
"""Deterministically generate Operation/MANIFEST.json and text sidecars."""

from __future__ import annotations

import argparse
import difflib
import json
import re
import sys
from pathlib import Path

from manifest_common import (
    MANIFEST_PATH,
    REPO_ROOT,
    TEXT_ROOT,
    expected_raw_url,
    load_manifest,
    sha256_bytes,
    sidecar_relpath,
)

try:
    from pypdf import PdfReader
except ImportError as exc:  # pragma: no cover - exercised in real usage
    raise SystemExit(
        "pypdf is required to build MANIFEST.json sidecars. "
        "Install requirements-dev.txt first."
    ) from exc

AUTOSEEDED_ROLE = "UNREVIEWED_AUTOSEEDED"


def discover_pdfs() -> list[str]:
    """Return all repository-relative PDF paths in deterministic order."""
    pdfs: list[str] = []
    for path in sorted(REPO_ROOT.rglob("*.pdf")):
        if any(part == ".git" for part in path.parts):
            continue
        rel = path.relative_to(REPO_ROOT)
        if rel.parts and rel.parts[0] == "Operation":
            continue
        pdfs.append(rel.as_posix())
    return pdfs


def normalize_filename(name: str) -> str:
    """Normalize a filename for resilient seed-to-file matching."""
    value = name.lstrip("_").strip()
    value = re.sub(r"^\(\d+\)\s*(?:🗎\s*)?", "", value)
    return value


def resolve_pdf_path(seed_path: str, available_paths: list[str]) -> str:
    """Resolve the actual repository path for a seeded manifest entry."""
    if seed_path in available_paths:
        return seed_path

    seed_name = Path(seed_path).name
    exact_name_matches = [path for path in available_paths if Path(path).name == seed_name]
    if len(exact_name_matches) == 1:
        return exact_name_matches[0]

    normalized = normalize_filename(seed_name)
    normalized_matches = [
        path for path in available_paths if normalize_filename(Path(path).name) == normalized
    ]
    if len(normalized_matches) == 1:
        return normalized_matches[0]

    raise SystemExit(
        f"Could not uniquely resolve PDF for seeded path {seed_path!r}; "
        f"matches={normalized_matches or exact_name_matches or 'none'}"
    )


def human_title_from_path(path: str) -> str:
    """Derive a human-review placeholder title from a PDF filename."""
    stem = Path(path).stem.lstrip("_").replace("_", " ")
    title = re.sub(r"\s+", " ", stem).strip()
    if title and title == title.lower():
        title = title.title()
    return title or "Untitled PDF"


def derive_entry_id(path: str, used_ids: set[str]) -> str:
    """Derive a deterministic, unique manifest id and reserve it in ``used_ids``."""
    stem = Path(path).stem.lower().lstrip("_")
    slug = re.sub(r"[^a-z0-9]+", "-", stem)
    slug = re.sub(r"-+", "-", slug).strip("-") or "pdf"

    candidate = slug
    suffix = 2
    while candidate in used_ids:
        candidate = f"{slug}-{suffix}"
        suffix += 1
    used_ids.add(candidate)
    return candidate


def iter_seed_entries(seed_manifest: dict, available_pdfs: list[str]) -> list[dict]:
    """Return seeded entries with repository paths resolved to on-disk PDFs."""
    resolved_entries: list[dict] = []
    for seed_entry in seed_manifest["pdfs"]:
        actual_path = resolve_pdf_path(seed_entry["path"], available_pdfs)
        resolved_entry = dict(seed_entry)
        resolved_entry["path"] = actual_path
        resolved_entries.append(resolved_entry)
    return resolved_entries


def autoseed_entries(seed_entries: list[dict], available_pdfs: list[str]) -> list[dict]:
    """Return deterministic placeholder entries for PDFs missing from the manifest."""
    seeded_paths = {entry["path"] for entry in seed_entries}
    used_ids = {entry["id"] for entry in seed_entries}
    auto_entries: list[dict] = []

    for pdf_path in available_pdfs:
        if pdf_path in seeded_paths:
            continue
        auto_entries.append(
            {
                "id": derive_entry_id(pdf_path, used_ids),
                "title": human_title_from_path(pdf_path),
                "role": AUTOSEEDED_ROLE,
                "path": pdf_path,
            }
        )
    return auto_entries


def json_line(key: str, value: str) -> str:
    """Render a deterministic JSON-string front-matter line."""
    return f"{key}: {json.dumps(value, ensure_ascii=False)}"


def extract_pdf_body(pdf_path: Path, raw_url: str) -> tuple[str, str]:
    """Return (status, body) for a PDF extraction attempt."""
    try:
        reader = PdfReader(str(pdf_path))
        pages: list[str] = []
        for index, page in enumerate(reader.pages, start=1):
            text = (page.extract_text() or "").strip()
            pages.append(f"## Page {index}\n\n{text}".rstrip())
        body = "\n\n".join(pages).strip()
        if not body:
            raise ValueError("no extractable text")
        return "success", body
    except Exception as exc:  # pragma: no cover - depends on PDF/parser edge cases
        body = "\n".join(
            [
                "status: EXTRACTION_FAILED",
                f"reason: {exc.__class__.__name__}",
                f"fallback_raw_url: {raw_url}",
            ]
        )
        return "failed", body


def render_sidecar(entry: dict, path: str, raw_url: str, pdf_sha256: str) -> str:
    """Render a deterministic text sidecar for a manifest entry."""
    status, body = extract_pdf_body(REPO_ROOT / path, raw_url)
    lines = [
        "---",
        json_line("id", entry["id"]),
        json_line("title", entry["title"]),
        json_line("role", entry["role"]),
        json_line("source_path", path),
        json_line("source_raw_url", raw_url),
        json_line("source_sha256", pdf_sha256),
        json_line("extraction_status", status),
        "---",
        "",
        body,
    ]
    return "\n".join(lines).rstrip() + "\n"


def build_outputs() -> tuple[str, dict[str, str]]:
    """Build the expected manifest text and sidecar contents."""
    seed_manifest = load_manifest()
    available_pdfs = discover_pdfs()
    repository = seed_manifest["repository"]
    branch = seed_manifest["default_branch"]
    seed_entries = iter_seed_entries(seed_manifest, available_pdfs)
    all_entries = seed_entries + autoseed_entries(seed_entries, available_pdfs)

    sidecars: dict[str, str] = {}
    pdf_entries: list[dict] = []

    for entry_seed in all_entries:
        actual_path = entry_seed["path"]
        pdf_path = REPO_ROOT / actual_path
        pdf_bytes = pdf_path.read_bytes()
        pdf_sha256 = sha256_bytes(pdf_bytes)
        raw_url = expected_raw_url(repository, branch, actual_path)
        sidecar_text = render_sidecar(entry_seed, actual_path, raw_url, pdf_sha256)
        sidecar_bytes = sidecar_text.encode("utf-8")
        sidecar_path = sidecar_relpath(entry_seed["id"])
        sidecars[sidecar_path] = sidecar_text

        entry = {
            "id": entry_seed["id"],
            "title": entry_seed["title"],
            "role": entry_seed["role"],
            "path": actual_path,
            "raw_url": raw_url,
            "canonical": entry_seed.get("canonical", True),
            "size_bytes": len(pdf_bytes),
            "sha256": pdf_sha256,
            "text_url": expected_raw_url(repository, branch, sidecar_path),
            "text_sha256": sha256_bytes(sidecar_bytes),
        }
        pdf_entries.append(entry)

    agent_access_policy = dict(seed_manifest["agent_access_policy"])
    agent_access_policy["preferred_read_order"] = [
        "text_url",
        "raw_url",
        "github_release_asset_if_file_exceeds_regular_git_limits",
    ]

    manifest = {
        "schema_version": seed_manifest["schema_version"],
        "repository": repository,
        "default_branch": branch,
        "agent_access_policy": agent_access_policy,
        "pdfs": pdf_entries,
    }
    manifest_text = json.dumps(manifest, indent=2, ensure_ascii=False) + "\n"
    return manifest_text, sidecars


def diff_hint(path: str, current: str, expected: str) -> str:
    """Return a small unified diff hint for a stale text file."""
    diff = difflib.unified_diff(
        current.splitlines(),
        expected.splitlines(),
        fromfile=f"{path} (current)",
        tofile=f"{path} (expected)",
        lineterm="",
    )
    lines = list(diff)
    if not lines:
        return f"{path} is stale"
    return "\n".join(lines[:40])


def check_outputs(manifest_text: str, sidecars: dict[str, str]) -> int:
    """Return a non-zero exit code if generated outputs differ from disk."""
    errors: list[str] = []

    current_manifest = MANIFEST_PATH.read_text(encoding="utf-8")
    if current_manifest != manifest_text:
        errors.append(diff_hint("Operation/MANIFEST.json", current_manifest, manifest_text))

    expected_paths = set(sidecars)
    actual_paths = set()
    if TEXT_ROOT.exists():
        actual_paths = {
            path.relative_to(REPO_ROOT).as_posix()
            for path in sorted(TEXT_ROOT.glob("*.md"))
            if path.is_file()
        }

    for relpath in sorted(expected_paths | actual_paths):
        expected_text = sidecars.get(relpath)
        abs_path = REPO_ROOT / relpath
        if expected_text is None:
            errors.append(
                f"Unexpected generated sidecar on disk: {relpath}\n"
                "Run `python Operation/scripts/build_manifest.py` to remove stale files."
            )
            continue
        if not abs_path.exists():
            errors.append(
                f"Missing generated sidecar: {relpath}\n"
                "Run `python Operation/scripts/build_manifest.py` to regenerate it."
            )
            continue
        current_text = abs_path.read_text(encoding="utf-8")
        if current_text != expected_text:
            errors.append(diff_hint(relpath, current_text, expected_text))

    if errors:
        print("Generated corpus artifacts are stale.", file=sys.stderr)
        for error in errors:
            print(error, file=sys.stderr)
            print(file=sys.stderr)
        return 1
    print("Operation/MANIFEST.json and text sidecars are up to date.")
    return 0


def write_outputs(manifest_text: str, sidecars: dict[str, str]) -> int:
    """Write generated outputs to disk."""
    TEXT_ROOT.mkdir(parents=True, exist_ok=True)

    expected_paths = {REPO_ROOT / relpath for relpath in sidecars}
    for path in sorted(TEXT_ROOT.glob("*.md")):
        if path not in expected_paths:
            path.unlink()

    MANIFEST_PATH.write_text(manifest_text, encoding="utf-8")
    for relpath, content in sidecars.items():
        (REPO_ROOT / relpath).write_text(content, encoding="utf-8")

    print(f"Wrote {MANIFEST_PATH.relative_to(REPO_ROOT)} and {len(sidecars)} text sidecars.")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Generate Operation/MANIFEST.json and Operation/corpus text sidecars deterministically."
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="fail if Operation/MANIFEST.json or generated sidecars differ from the expected output",
    )
    args = parser.parse_args(argv)

    manifest_text, sidecars = build_outputs()
    if args.check:
        return check_outputs(manifest_text, sidecars)
    return write_outputs(manifest_text, sidecars)


if __name__ == "__main__":
    raise SystemExit(main())
