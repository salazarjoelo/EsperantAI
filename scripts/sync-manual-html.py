#!/usr/bin/env python3
"""Synchronize docs/manual.html embedded manual strings from markdown files."""

from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
MANUAL_HTML = DOCS / "manual.html"


def main() -> None:
    html = MANUAL_HTML.read_text(encoding="utf-8")
    pattern = re.compile(
        r"(?P<prefix>'(?P<locale>[a-z]{2}-[A-Z]{2})':\s*\{\s*name:\s*'[^']+',\s*flag:\s*'[^']+',\s*content:\s*)"
        r"(?P<content>\"(?:\\.|[^\"\\])*\")"
        r"(?P<suffix>\s*\})",
        re.DOTALL,
    )

    replaced = []

    def repl(match: re.Match[str]) -> str:
        locale = match.group("locale")
        md_path = DOCS / f"USER_MANUAL_{locale}.md"
        if not md_path.exists():
            raise FileNotFoundError(f"Missing markdown manual for {locale}: {md_path}")
        content = md_path.read_text(encoding="utf-8")
        replaced.append(locale)
        return f"{match.group('prefix')}{json.dumps(content, ensure_ascii=False)}{match.group('suffix')}"

    new_html = pattern.sub(repl, html)
    if not replaced:
        raise RuntimeError("No embedded manuals found in docs/manual.html")

    missing = sorted(
        p.stem.removeprefix("USER_MANUAL_")
        for p in DOCS.glob("USER_MANUAL_*.md")
        if p.stem.removeprefix("USER_MANUAL_") not in replaced
    )
    if missing:
        raise RuntimeError(f"manual.html has no embedded entry for: {', '.join(missing)}")

    MANUAL_HTML.write_text(new_html, encoding="utf-8")
    print(f"Synced {len(replaced)} manuals into docs/manual.html: {', '.join(replaced)}")


if __name__ == "__main__":
    main()
