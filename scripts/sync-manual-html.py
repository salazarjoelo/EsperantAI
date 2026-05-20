#!/usr/bin/env python3
"""Synchronize manual viewer strings from markdown files."""

from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
MANUAL_HTML = DOCS / "manual.html"
MANUAL_JS = DOCS / "manual-viewer.js"


def main() -> None:
    target = MANUAL_JS if MANUAL_JS.exists() else MANUAL_HTML
    text = target.read_text(encoding="utf-8")
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

    new_text = pattern.sub(repl, text)
    if not replaced:
        raise RuntimeError(f"No embedded manuals found in {target}")

    missing = sorted(
        p.stem.removeprefix("USER_MANUAL_")
        for p in DOCS.glob("USER_MANUAL_*.md")
        if p.stem.removeprefix("USER_MANUAL_") not in replaced
    )
    if missing:
        raise RuntimeError(f"{target.name} has no embedded entry for: {', '.join(missing)}")

    target.write_text(new_text, encoding="utf-8")
    print(f"Synced {len(replaced)} manuals into {target.relative_to(ROOT)}: {', '.join(replaced)}")


if __name__ == "__main__":
    main()
