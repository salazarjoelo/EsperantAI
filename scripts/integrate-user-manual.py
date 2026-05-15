#!/usr/bin/env python
"""
Integra el User Manual zip (2026-05-15) en el repo EsperantAI.

Acciones (basadas en decisiones de Joel):
  1. Mover markdown/USER_MANUAL_<locale>.md -> docs/USER_MANUAL_<locale>.md
  2. Normalizar email: support@ -> soporte@ en todos los manuales (13 archivos)
  3. Actualizar claim "323 keys" -> "342 keys" en todos los manuales (los 15)
  4. Mover index.html -> docs/manual.html con:
       - marked.min.js local en docs/libs/ (ya descargado)
       - SRI integrity hash
       - meta CSP default-src 'self'
  5. Eliminar docs/USER_MANUAL.md (V2.0 obsoleto) — V3.0 es-MX lo reemplaza
  6. Crear locales/hi-IN.json y locales/id-ID.json como fallback inglés
     (claves de en-US copiadas, _meta marca el código + RTL + translator pending)

Pre-condiciones:
  - zip extraído en /tmp/esperantai-manual-review/ (15 .md + 1 index.html)
  - docs/libs/marked.min.js descargado (39903 bytes, sha384-948ahk...)
  - LOCAL_REPO apunta al checkout local de EsperantAI
"""
import json
import os
import re
import shutil
from pathlib import Path

# Bash extrajo el zip a $TMPDIR/esperantai-manual-review/ — en Windows el TEMP
# real está en C:\Users\<user>\AppData\Local\Temp\.
_tmp = os.environ.get("TEMP") or os.environ.get("TMP") or r"C:\Users\joel-\AppData\Local\Temp"
ZIP_DIR = Path(_tmp) / "esperantai-manual-review"
LOCAL_REPO = Path(r"D:\joel-salazar\OBS\EsperantAI")
DOCS = LOCAL_REPO / "docs"
LOCALES = LOCAL_REPO / "locales"

# SRI hash computado de docs/libs/marked.min.js (39903 bytes)
MARKED_SRI = "sha384-948ahk4ZmxYVYOc+rxN1H2gM1EJ2Duhp7uHtZ4WSLkV4Vtx5MUqnV+l7u9B+jFv+"

# Locales en zip que NO tienen contrapartida JSON — generamos fallback inglés
EXTRA_LOCALES = {
    "hi-IN": {"language": "हिन्दी (India)", "rtl": False, "translator": "fallback to English — translator pending"},
    "id-ID": {"language": "Bahasa Indonesia", "rtl": False, "translator": "fallback to English — translator pending"},
}


def normalize_md_file(src_path: Path, dst_path: Path):
    """Lee .md de zip, normaliza email + key count, escribe a docs/."""
    text = src_path.read_text(encoding="utf-8")

    # 1) support@ -> soporte@ (decision Joel: canonical es soporte@edugame.digital)
    text = text.replace("support@edugame.digital", "soporte@edugame.digital")

    # 2) "323 keys"/"323 claves"/"323 chaves"/"323 clés"/"323 Schlüssel"/"323 chiavi"/
    #    "323 kluczy"/"323 ключа"/"323 키"/"323 キー"/"323 个键" -> 342
    # Reemplazo agnóstico al idioma: buscar la cifra 323 cuando va precedida o
    # seguida de palabras relacionadas con "key/clave/键". Hacemos un find/replace
    # más laxo: cualquier "323" que aparezca cerca de un patrón i18n-keys-like.
    # Para simplificar: replace literal "323" -> "342" SOLO en líneas que
    # contienen una palabra ligada a traducción.
    keyword_re = re.compile(
        r"(key|clave|chave|cl[ée]|schl[üu]ssel|chiav|klucz|ключ|키|キー|个键|个键|มาตรฐาน|مفت|कुं|kunci)",
        re.IGNORECASE,
    )
    new_lines = []
    for line in text.splitlines():
        if "323" in line and keyword_re.search(line):
            line = line.replace("323", "342")
        new_lines.append(line)
    text = "\n".join(new_lines) + "\n"

    dst_path.write_text(text, encoding="utf-8")
    return src_path.name


def build_manual_html(src_index_html: Path, dst_html: Path):
    """Genera docs/manual.html con marked.min.js local + SRI + CSP."""
    text = src_index_html.read_text(encoding="utf-8")

    # 1) Reemplazar el CDN de marked.min.js por path local
    cdn_re = re.compile(
        r'<script\s+src="https://cdn\.jsdelivr\.net/npm/marked/marked\.min\.js"\s*></script>',
        re.IGNORECASE,
    )
    new_script = (
        f'<script src="libs/marked.min.js" '
        f'integrity="{MARKED_SRI}" crossorigin="anonymous"></script>'
    )
    replaced = cdn_re.sub(new_script, text)
    if replaced == text:
        raise RuntimeError("No se encontró el <script> de marked.min.js para reemplazar")
    text = replaced

    # 2) Insertar meta CSP justo después del charset
    csp_meta = (
        '<meta http-equiv="Content-Security-Policy" '
        'content="default-src \'self\'; script-src \'self\'; '
        'style-src \'self\' \'unsafe-inline\'; img-src \'self\' data:; '
        'connect-src \'self\'; font-src \'self\';">\n'
    )
    text = text.replace(
        '<meta charset="UTF-8">\n',
        '<meta charset="UTF-8">\n' + csp_meta,
        1,
    )

    # 3) Ajustar rutas internas: el visor carga ./markdown/USER_MANUAL_*.md.
    #    En nuestro layout final estarán en el MISMO directorio que manual.html.
    #    Reemplazamos 'markdown/USER_MANUAL_' -> 'USER_MANUAL_' (relativo).
    text = text.replace("markdown/USER_MANUAL_", "USER_MANUAL_")

    # 4) Banner discreto al final del header
    # (opcional — saltable, mantenemos simple)

    dst_html.write_text(text, encoding="utf-8")


def create_fallback_locale(code: str, meta: dict):
    """Crea locales/{code}.json copiando claves de en-US.json (fallback inglés).

    El validador de paridad cuenta esto como 'untranslated' pero NO bloquea CI.
    Translator humano puede rellenar después.
    """
    en_path = LOCALES / "en-US.json"
    out_path = LOCALES / f"{code}.json"

    en_data = json.loads(en_path.read_text(encoding="utf-8"))
    # Replace _meta with locale-specific block
    en_data["_meta"] = {
        "language": meta["language"],
        "code": code,
        "rtl": meta["rtl"],
        "completion": en_data["_meta"]["completion"],  # mismo conteo (es fallback)
        "translator": meta["translator"],
    }
    out_path.write_text(
        json.dumps(en_data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def main():
    # Pre-condiciones
    if not ZIP_DIR.exists():
        raise SystemExit(f"[!] {ZIP_DIR} no existe — extrae el zip primero")
    marked_local = DOCS / "libs" / "marked.min.js"
    if not marked_local.exists():
        raise SystemExit(f"[!] {marked_local} no existe — corre el download primero")

    # ─── 1. Procesar markdown files ─────────────────────────────────────────
    md_files = sorted((ZIP_DIR / "markdown").glob("USER_MANUAL_*.md"))
    print(f"[1] Procesando {len(md_files)} archivos markdown...")
    for src in md_files:
        dst = DOCS / src.name
        normalize_md_file(src, dst)
        print(f"    + docs/{src.name}")

    # ─── 2. Construir visor docs/manual.html ────────────────────────────────
    print(f"\n[2] Construyendo docs/manual.html (CDN local + SRI + CSP)")
    src_index = ZIP_DIR / "index.html"
    dst_manual = DOCS / "manual.html"
    build_manual_html(src_index, dst_manual)
    print(f"    + docs/manual.html ({dst_manual.stat().st_size} bytes)")

    # ─── 3. Eliminar USER_MANUAL.md V2.0 obsoleto ──────────────────────────
    old_manual = DOCS / "USER_MANUAL.md"
    if old_manual.exists():
        old_manual.unlink()
        print(f"\n[3] Eliminado docs/USER_MANUAL.md (V2.0 obsoleto)")
    else:
        print(f"\n[3] docs/USER_MANUAL.md ya no existe (skip)")

    # ─── 4. Crear hi-IN.json + id-ID.json (fallback inglés) ────────────
    print(f"\n[4] Creando locales fallback hi-IN + id-ID")
    for code, meta in EXTRA_LOCALES.items():
        create_fallback_locale(code, meta)
        print(f"    + locales/{code}.json (fallback de en-US)")

    # ─── 5. Resumen ─────────────────────────────────────────────────────────
    print(f"\n{'=' * 70}")
    print(f"INTEGRADO. Archivos modificados:")
    print(f"  - 15 docs/USER_MANUAL_*.md (normalized email + key count)")
    print(f"  - docs/manual.html (viewer self-hosted + SRI + CSP)")
    print(f"  - docs/libs/marked.min.js (39903 bytes, sha384-...)")
    print(f"  - 2 locales/{'{hi-IN,id-ID}'}.json (English fallback)")
    print(f"  - DELETED docs/USER_MANUAL.md (V2.0)")


if __name__ == "__main__":
    main()
