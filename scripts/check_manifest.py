#!/usr/bin/env python3
"""MANIFEST.json validator — deterministic corpus-acquisition gate.

This is the operational bridge between "the agent knows a PDF exists" and "the
agent can fetch it deterministically" (see the issue: machine-readable corpus
access). It enforces the contract declared in ``MANIFEST.json`` so the corpus
stays robust, minimal, scalable and antifragile: every fragility is converted
into a permanent regression check.

Design goals (mirroring ``governance/incarnation_test.py``): minimal,
deterministic, no external dependencies, robust. By default it runs fully
**offline** so it is safe in CI:

1. **Schema** — top-level keys and ``agent_access_policy`` are present.
2. **Entries** — every PDF entry carries ``id``/``title``/``role``/``path``/
   ``raw_url``/``text_url``/``text_sha256`` (the required contract fields),
   with unique ids and paths.
3. **Files** — every ``path`` exists in the repository.
4. **raw_url shape** — each ``raw_url`` is the canonical
   ``raw.githubusercontent.com`` URL for ``repository`` + ``default_branch`` +
   percent-encoded ``path`` (no GitHub HTML ``blob`` pages).
5. **Integrity** — ``size_bytes``/``sha256`` match the PDF bytes and
   ``text_sha256`` matches the generated sidecar bytes.
6. **No third-party cloud links** — agent-facing docs (README.md, AGENTS.md,
   MANIFEST.json) must not carry Proton Drive / cloud-preview links as canonical
   download sources.

With ``--online`` it additionally issues an HTTP HEAD to each ``raw_url`` and
``text_url`` and requires HTTP 200. Network access is not assumed in CI, so it
is opt-in.

Run directly (``python scripts/check_manifest.py``). Exit code 0 = pass,
non-zero = regression.
"""

from __future__ import annotations

import argparse
import hashlib
import re
import sys

from manifest_common import (
    MANIFEST_PATH,
    REPO_ROOT,
    expected_raw_url,
    load_manifest,
    sidecar_abspath,
    sidecar_relpath,
)

REQUIRED_TOP_KEYS = ["schema_version", "repository", "default_branch", "pdfs"]
REQUIRED_ENTRY_KEYS = ["id", "title", "role", "path", "raw_url", "text_url", "text_sha256"]

# Agent-facing documents that must not advertise third-party cloud-share links
# as canonical download sources (the manifest's raw_url is the only canonical
# acquisition map). Tokens are matched only when they look like a live link.
AGENT_FACING_DOCS = ["README.md", "AGENTS.md", "MANIFEST.json"]
FORBIDDEN_LINK_PATTERNS = [
    r"https?://[^\s\"')]*proton\.(me|drive)[^\s\"')]*",
    r"https?://drive\.proton\.me[^\s\"')]*",
]

def validate(manifest: dict) -> list[str]:
    """Return a list of error strings. Empty list means the manifest is valid."""
    errors: list[str] = []

    for key in REQUIRED_TOP_KEYS:
        if key not in manifest:
            errors.append(f"manifest missing top-level key: {key}")
    if errors:
        return errors

    if "agent_access_policy" not in manifest:
        errors.append("manifest missing 'agent_access_policy'")

    repository = manifest["repository"]
    branch = manifest["default_branch"]
    pdfs = manifest["pdfs"]
    if not isinstance(pdfs, list) or not pdfs:
        errors.append("'pdfs' must be a non-empty list")
        return errors

    seen_ids: set[str] = set()
    seen_paths: set[str] = set()
    for i, entry in enumerate(pdfs):
        tag = entry.get("id", f"#{i}")

        missing = [k for k in REQUIRED_ENTRY_KEYS if not entry.get(k)]
        if missing:
            for key in missing:
                errors.append(f"[{tag}] missing required field: {key}")
            continue

        eid = entry["id"]
        path = entry["path"]
        raw_url = entry["raw_url"]
        text_url = entry["text_url"]
        text_sha256 = entry["text_sha256"]

        if eid in seen_ids:
            errors.append(f"[{tag}] duplicate id")
        seen_ids.add(eid)
        if path in seen_paths:
            errors.append(f"[{tag}] duplicate path: {path}")
        seen_paths.add(path)

        abspath = REPO_ROOT / path
        if not abspath.exists():
            errors.append(f"[{tag}] path does not exist: {path}")
            continue

        expected = expected_raw_url(repository, branch, path)
        if raw_url != expected:
            errors.append(
                f"[{tag}] raw_url mismatch\n    have: {raw_url}\n    want: {expected}"
            )
        if "/blob/" in raw_url:
            errors.append(f"[{tag}] raw_url points to a GitHub HTML blob page: {raw_url}")

        sidecar_rel = sidecar_relpath(eid)
        expected_text_url = expected_raw_url(repository, branch, sidecar_rel)
        if text_url != expected_text_url:
            errors.append(
                f"[{tag}] text_url mismatch\n    have: {text_url}\n    want: {expected_text_url}"
            )
        if "/blob/" in text_url:
            errors.append(f"[{tag}] text_url points to a GitHub HTML blob page: {text_url}")

        sidecar_path = sidecar_abspath(eid)
        if not sidecar_path.exists():
            errors.append(f"[{tag}] text sidecar does not exist: {sidecar_rel}")
        else:
            sidecar_data = sidecar_path.read_bytes()
            if not sidecar_data:
                errors.append(f"[{tag}] text sidecar is empty: {sidecar_rel}")
            digest = hashlib.sha256(sidecar_data).hexdigest()
            if text_sha256 != digest:
                errors.append(f"[{tag}] text_sha256 mismatch: manifest != file ({digest})")

        data = None
        if "size_bytes" in entry or "sha256" in entry:
            data = abspath.read_bytes()
        if "size_bytes" in entry and data is not None and entry["size_bytes"] != len(data):
            errors.append(
                f"[{tag}] size_bytes mismatch: manifest {entry['size_bytes']} != file {len(data)}"
            )
        if "sha256" in entry and data is not None:
            digest = hashlib.sha256(data).hexdigest()
            if entry["sha256"] != digest:
                errors.append(f"[{tag}] sha256 mismatch: manifest != file ({digest})")

    return errors


def check_no_cloud_links() -> list[str]:
    """Ensure agent-facing docs carry no third-party cloud-share download links."""
    errors: list[str] = []
    for rel in AGENT_FACING_DOCS:
        path = REPO_ROOT / rel
        if not path.exists():
            continue
        text = path.read_text(encoding="utf-8")
        for pat in FORBIDDEN_LINK_PATTERNS:
            for m in re.finditer(pat, text, re.IGNORECASE):
                errors.append(f"{rel}: forbidden third-party cloud link: {m.group(0)}")
    return errors


def _check_online_url(entry_id: str, label: str, url: str) -> list[str]:
    """HEAD-check a single manifest URL."""
    import urllib.error
    import urllib.request

    req = urllib.request.Request(url, method="HEAD")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            if resp.status != 200:
                return [f"[{entry_id}] HTTP {resp.status} for {label} {url}"]
    except (urllib.error.URLError, TimeoutError, OSError, ValueError) as exc:
        return [f"[{entry_id}] DUE-CORPUS-FETCH {label} {url}: {exc}"]
    return []


def check_online(manifest: dict) -> list[str]:
    """Optional: each raw_url and text_url must return HTTP 200."""
    errors: list[str] = []
    for entry in manifest["pdfs"]:
        errors += _check_online_url(entry["id"], "raw_url", entry["raw_url"])
        errors += _check_online_url(entry["id"], "text_url", entry["text_url"])
    return errors


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate MANIFEST.json")
    parser.add_argument(
        "--online",
        action="store_true",
        help="also verify each raw_url returns HTTP 200 (requires network)",
    )
    args = parser.parse_args(argv)

    if not MANIFEST_PATH.exists():
        print("FAIL: MANIFEST.json not found at repository root", file=sys.stderr)
        return 1
    manifest = load_manifest()

    errors = validate(manifest)
    errors += check_no_cloud_links()
    if args.online and not errors:
        errors += check_online(manifest)

    if errors:
        print("MANIFEST.json validation FAILED:", file=sys.stderr)
        for err in errors:
            print(f"  - {err}", file=sys.stderr)
        return 1

    n = len(manifest["pdfs"])
    print(f"MANIFEST.json OK: {n} PDF entries validated (offline).")
    if args.online:
        print("All raw_url and text_url endpoints returned HTTP 200.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
