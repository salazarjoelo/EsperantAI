#!/usr/bin/env python3
"""Extract docs/manual.html inline CSS and viewer JS to local static files."""

from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
MANUAL_HTML = DOCS / "manual.html"
MANUAL_CSS = DOCS / "manual.css"
MANUAL_JS = DOCS / "manual-viewer.js"

STRICT_CSP = (
    '<meta http-equiv="Content-Security-Policy" '
    'content="default-src \'self\'; script-src \'self\'; style-src \'self\'; '
    'img-src \'self\' data:; connect-src \'self\'; font-src \'self\';">'
)


def main() -> None:
    html = MANUAL_HTML.read_text(encoding="utf-8")

    style_match = re.search(r"<style>\s*(?P<css>.*?)\s*</style>", html, flags=re.DOTALL)
    if not style_match:
        raise RuntimeError("docs/manual.html has no inline <style> block to extract")

    script_matches = list(re.finditer(r"<script>\s*(?P<js>.*?)\s*</script>", html, flags=re.DOTALL))
    if not script_matches:
        raise RuntimeError("docs/manual.html has no inline viewer <script> block to extract")
    script_match = script_matches[-1]

    MANUAL_CSS.write_text(style_match.group("css").rstrip() + "\n", encoding="utf-8")
    MANUAL_JS.write_text(script_match.group("js").rstrip() + "\n", encoding="utf-8")

    html = html[: style_match.start()] + '<link rel="stylesheet" href="manual.css">' + html[style_match.end() :]

    script_matches = list(re.finditer(r"<script>\s*(?P<js>.*?)\s*</script>", html, flags=re.DOTALL))
    script_match = script_matches[-1]
    html = html[: script_match.start()] + '<script src="manual-viewer.js"></script>' + html[script_match.end() :]

    html = re.sub(
        r'<meta http-equiv="Content-Security-Policy"[^>]+>',
        STRICT_CSP,
        html,
        count=1,
    )
    html = re.sub(
        r"\n<!-- 2026-05-18:[\s\S]*?libs/manuals-data\.js\. -->",
        "",
        html,
        count=1,
    )

    MANUAL_HTML.write_text(html, encoding="utf-8")
    print("Extracted docs/manual.css and docs/manual-viewer.js")


if __name__ == "__main__":
    main()
