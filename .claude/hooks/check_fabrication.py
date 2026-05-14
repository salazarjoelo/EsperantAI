#!/usr/bin/env python3
"""
check_fabrication.py — Hook Stop de Claude Code para Mira Mira.

Lee el último mensaje del asistente y detecta patrones de fabricación de datos:
- Números/porcentajes sin source link adyacente
- Frases como "approximately", "around", "estimated" sin método explícito
- Claims cuantitativos sin etiqueta [VERIFICADO|EXTRAPOLADO|NO TENGO DATO]

Si detecta problemas, registra un warning en `.claude/hooks/fabrication.log`
y devuelve exit code 2 con stderr para que Claude lo vea en su siguiente turno.

Uso: configurado en .claude/settings.json como Stop hook.
"""

import json
import re
import sys
from pathlib import Path
from datetime import datetime

HOOK_DIR = Path(__file__).parent
LOG_FILE = HOOK_DIR / "fabrication.log"

# Patrones sospechosos
QUANTITATIVE_PATTERN = re.compile(
    r"(\d{1,3}(?:,\d{3})*(?:\.\d+)?\s*[%KMB]?|"
    r"\$\s*\d{1,3}(?:,\d{3})*(?:\.\d+)?[KMB]?)",
    re.IGNORECASE,
)

FABRICATION_WEASEL_WORDS = [
    "approximately",
    "around ",
    "estimated",
    "estimate",
    "roughly",
    "aproximadamente",
    "alrededor de",
    "se estima",
    "estimado",
    "TAM realista",
    "conversion esperada",
    "conversión esperada",
    "revenue estimado",
    "potencial de",
]

VERIFICATION_TAGS = [
    "[VERIFICADO]",
    "[EXTRAPOLADO]",
    "[NO TENGO DATO]",
    "Fuente:",
    "Source:",
    "https://",
    "http://",
]


def read_transcript():
    """Lee el transcript path desde stdin (formato JSON del hook input)."""
    try:
        data = json.load(sys.stdin)
        return data.get("transcript_path"), data.get("session_id", "?")
    except Exception:
        return None, "?"


def extract_last_assistant_message(transcript_path):
    """Extrae el último mensaje del asistente del JSONL transcript."""
    if not transcript_path or not Path(transcript_path).exists():
        return None
    try:
        lines = Path(transcript_path).read_text(encoding="utf-8").strip().split("\n")
        for line in reversed(lines):
            entry = json.loads(line)
            if entry.get("role") == "assistant":
                content = entry.get("content", "")
                if isinstance(content, list):
                    return "\n".join(
                        c.get("text", "") for c in content if c.get("type") == "text"
                    )
                return str(content)
    except Exception as e:
        log(f"Error leyendo transcript: {e}")
    return None


def has_nearby_source(text, match_idx, window=200):
    """Verifica si hay una fuente verificable cerca del número."""
    start = max(0, match_idx - window)
    end = min(len(text), match_idx + window)
    context = text[start:end]
    return any(tag.lower() in context.lower() for tag in VERIFICATION_TAGS)


def analyze(message):
    """Analiza mensaje y devuelve lista de problemas detectados."""
    if not message:
        return []
    problems = []

    # Detectar números sin source
    for match in QUANTITATIVE_PATTERN.finditer(message):
        if not has_nearby_source(message, match.start()):
            problems.append(
                {
                    "type": "number_without_source",
                    "value": match.group(0),
                    "context": message[
                        max(0, match.start() - 50) : min(len(message), match.end() + 50)
                    ],
                }
            )

    # Detectar weasel words sin método
    for ww in FABRICATION_WEASEL_WORDS:
        if ww.lower() in message.lower():
            idx = message.lower().find(ww.lower())
            if not has_nearby_source(message, idx, window=150):
                problems.append(
                    {
                        "type": "weasel_word",
                        "value": ww,
                        "context": message[
                            max(0, idx - 50) : min(len(message), idx + 100)
                        ],
                    }
                )

    return problems


def log(msg):
    ts = datetime.now().isoformat()
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(f"[{ts}] {msg}\n")


def main():
    transcript_path, session_id = read_transcript()
    message = extract_last_assistant_message(transcript_path)
    if not message:
        # No message to analyze, exit silently
        sys.exit(0)

    problems = analyze(message)
    if not problems:
        sys.exit(0)

    # Registrar
    log(f"=== Sesión {session_id} — {len(problems)} problemas detectados ===")
    for p in problems[:10]:  # max 10 problemas en log
        log(f"  [{p['type']}] '{p['value']}' :: ...{p['context'].strip()[:200]}...")

    # Devolver a Claude un mensaje vía stderr (exit 2 = block + show stderr)
    summary = (
        f"⚠️  HOOK ANTI-FABRICACIÓN detectó {len(problems)} posible(s) claim(s) sin fuente verificable "
        f"en tu última respuesta. Revisa y corrige antes de continuar.\n"
        f"Primeros ejemplos:\n"
    )
    for p in problems[:3]:
        summary += f"  - '{p['value']}' sin source/tag cerca\n"
    summary += (
        f"\nReglas obligatorias: cada número debe tener etiqueta [VERIFICADO|EXTRAPOLADO|NO TENGO DATO] "
        f"y/o URL de fuente. Ver .claude/CLAUDE.md.\n"
        f"Log completo: {LOG_FILE}"
    )

    print(summary, file=sys.stderr)
    sys.exit(2)


if __name__ == "__main__":
    main()
