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
   ``raw_url`` (the required contract fields), with unique ids and paths.
3. **Files** — every ``path`` exists in the repository.
4. **raw_url shape** — each ``raw_url`` is the canonical
   ``raw.githubusercontent.com`` URL for ``repository`` + ``default_branch`` +
   percent-encoded ``path`` (no GitHub HTML ``blob`` pages).
5. **Integrity** — when present, ``size_bytes`` and ``sha256`` match the file.
6. **No third-party cloud links** — agent-facing docs (README.md, AGENTS.md,
   MANIFEST.json) must not carry Proton Drive / cloud-preview links as canonical
   download sources.

With ``--online`` it additionally issues an HTTP HEAD to each ``raw_url`` and
requires HTTP 200. Network access is not assumed in CI, so it is opt-in.

Run directly (``python scripts/check_manifest.py``). Exit code 0 = pass,
non-zero = regression.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
from urllib.parse import quote

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST_PATH = os.path.join(REPO_ROOT, "MANIFEST.json")

REQUIRED_TOP_KEYS = ["schema_version", "repository", "default_branch", "pdfs"]
REQUIRED_ENTRY_KEYS = ["id", "title", "role", "path", "raw_url"]

# Agent-facing documents that must not advertise third-party cloud-share links
# as canonical download sources (the manifest's raw_url is the only canonical
# acquisition map). Tokens are matched only when they look like a live link.
AGENT_FACING_DOCS = ["README.md", "AGENTS.md", "MANIFEST.json"]
FORBIDDEN_LINK_PATTERNS = [
    r"https?://[^\s\"')]*proton\.(me|drive)[^\s\"')]*",
    r"https?://drive\.proton\.me[^\s\"')]*",
]

RAW_HOST = "https://raw.githubusercontent.com/"


def _owner_repo(repository: str) -> str:
    """Extract ``owner/repo`` from a GitHub repository URL."""
    return repository.rstrip("/").removeprefix("https://github.com/")


def expected_raw_url(repository: str, branch: str, path: str) -> str:
    """Canonical raw URL for a repo path (percent-encoded, no HTML blob page)."""
    owner_repo = _owner_repo(repository)
    return f"{RAW_HOST}{owner_repo}/{branch}/{quote(path)}"


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

        if eid in seen_ids:
            errors.append(f"[{tag}] duplicate id")
        seen_ids.add(eid)
        if path in seen_paths:
            errors.append(f"[{tag}] duplicate path: {path}")
        seen_paths.add(path)

        abspath = os.path.join(REPO_ROOT, path)
        if not os.path.exists(abspath):
            errors.append(f"[{tag}] path does not exist: {path}")
            continue

        expected = expected_raw_url(repository, branch, path)
        if raw_url != expected:
            errors.append(
                f"[{tag}] raw_url mismatch\n    have: {raw_url}\n    want: {expected}"
            )
        if "/blob/" in raw_url:
            errors.append(f"[{tag}] raw_url points to a GitHub HTML blob page: {raw_url}")

        data = None
        if "size_bytes" in entry or "sha256" in entry:
            with open(abspath, "rb") as fh:
                data = fh.read()
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
        path = os.path.join(REPO_ROOT, rel)
        if not os.path.exists(path):
            continue
        with open(path, encoding="utf-8") as fh:
            text = fh.read()
        for pat in FORBIDDEN_LINK_PATTERNS:
            for m in re.finditer(pat, text, re.IGNORECASE):
                errors.append(f"{rel}: forbidden third-party cloud link: {m.group(0)}")
    return errors


def check_online(manifest: dict) -> list[str]:
    """Optional: each raw_url must return HTTP 200 (opt-in, needs network)."""
    import urllib.error
    import urllib.request

    errors: list[str] = []
    for entry in manifest["pdfs"]:
        url = entry["raw_url"]
        req = urllib.request.Request(url, method="HEAD")
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                if resp.status != 200:
                    errors.append(f"[{entry['id']}] HTTP {resp.status} for {url}")
        except (urllib.error.URLError, TimeoutError, OSError, ValueError) as exc:
            errors.append(f"[{entry['id']}] DUE-CORPUS-FETCH {url}: {exc}")
    return errors


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate MANIFEST.json")
    parser.add_argument(
        "--online",
        action="store_true",
        help="also verify each raw_url returns HTTP 200 (requires network)",
    )
    args = parser.parse_args(argv)

    if not os.path.exists(MANIFEST_PATH):
        print("FAIL: MANIFEST.json not found at repository root", file=sys.stderr)
        return 1
    with open(MANIFEST_PATH, encoding="utf-8") as fh:
        manifest = json.load(fh)

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
        print("All raw_url endpoints returned HTTP 200.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
