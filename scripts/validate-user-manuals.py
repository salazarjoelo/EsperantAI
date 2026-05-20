#!/usr/bin/env python3
"""Validate localized user manuals and their embedded manual.html copies."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
MANUAL_HTML = DOCS / "manual.html"
IMAGE_REFS = [
    "assets/manual/01-esperantai-flow.svg",
    "assets/manual/02-software-setup.svg",
    "assets/manual/03-platform-events.svg",
    "assets/manual/04-event-gesture-combo.svg",
]
FORBIDDEN = [
    "esperantai.com",
    "support@edugame.digital",
    "free trial",
    "prueba gratuita",
    "14 days",
    "14 días",
    "refund policy",
    "full refund",
    "reembolso completo",
]


def extract_embedded_manuals(html: str) -> dict[str, str]:
    pattern = re.compile(
        r"'(?P<locale>[a-z]{2}-[A-Z]{2})':\s*\{\s*name:\s*'[^']+',\s*flag:\s*'[^']+',\s*content:\s*"
        r"(?P<content>\"(?:\\.|[^\"\\])*\")",
        re.DOTALL,
    )
    return {
        match.group("locale"): json.loads(match.group("content"))
        for match in pattern.finditer(html)
    }


def main() -> int:
    failures: list[str] = []
    manual_paths = sorted(DOCS.glob("USER_MANUAL_*.md"))
    if len(manual_paths) != 15:
        failures.append(f"Expected 15 manuals, found {len(manual_paths)}")

    for path in manual_paths:
        locale = path.stem.removeprefix("USER_MANUAL_")
        text = path.read_text(encoding="utf-8")
        low = text.lower()
        for ref in IMAGE_REFS:
            if ref not in text:
                failures.append(f"{locale}: missing image {ref}")
        if "2026-05-20" not in text:
            failures.append(f"{locale}: missing last-updated date 2026-05-20")
        if "soporte@edugame.digital" not in text:
            failures.append(f"{locale}: missing canonical support email")
        for token in FORBIDDEN:
            if token in low:
                failures.append(f"{locale}: forbidden token {token}")
        for required in ["Kick", "Trovo", "StreamElements", "YouTube", "XSplit"]:
            if required.lower() not in low:
                failures.append(f"{locale}: missing required platform term {required}")

    if MANUAL_HTML.exists():
        embedded = extract_embedded_manuals(MANUAL_HTML.read_text(encoding="utf-8"))
        for path in manual_paths:
            locale = path.stem.removeprefix("USER_MANUAL_")
            markdown = path.read_text(encoding="utf-8")
            if embedded.get(locale) != markdown:
                failures.append(f"{locale}: docs/manual.html embedded content is out of sync")
    else:
        failures.append("docs/manual.html is missing")

    if failures:
        print("Manual validation failed:")
        for item in failures:
            print(f"- {item}")
        return 1

    print(f"Manual validation passed for {len(manual_paths)} manuals.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
