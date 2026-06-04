#!/usr/bin/env python3
"""Shared helpers for MANIFEST.json generation and validation."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
from urllib.parse import quote

REPO_ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = REPO_ROOT / "MANIFEST.json"
TEXT_ROOT = REPO_ROOT / "corpus" / "text"
RAW_HOST = "https://raw.githubusercontent.com/"


def owner_repo(repository: str) -> str:
    """Extract ``owner/repo`` from a GitHub repository URL."""
    return repository.rstrip("/").removeprefix("https://github.com/")


def expected_raw_url(repository: str, branch: str, path: str) -> str:
    """Canonical raw URL for a repo path (percent-encoded, no HTML blob page)."""
    return f"{RAW_HOST}{owner_repo(repository)}/{branch}/{quote(path)}"


def sidecar_relpath(entry_id: str) -> str:
    """Repository-relative path for a generated text sidecar."""
    return f"corpus/text/{entry_id}.md"


def sidecar_abspath(entry_id: str) -> Path:
    """Absolute path for a generated text sidecar."""
    return REPO_ROOT / sidecar_relpath(entry_id)


def sha256_bytes(data: bytes) -> str:
    """Return the SHA-256 digest of ``data``."""
    return hashlib.sha256(data).hexdigest()


def sha256_file(path: Path) -> str:
    """Return the SHA-256 digest of a file."""
    return sha256_bytes(path.read_bytes())


def load_manifest() -> dict:
    """Load ``MANIFEST.json`` from the repository root."""
    return json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
