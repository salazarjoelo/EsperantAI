#!/usr/bin/env python
"""
Rellena los placeholders legales en docs/*.html y LICENSE.txt con los datos
fiscales reales de EdugameDigital (Joel Salazar Ramírez).

Datos provistos por Joel el 2026-05-15:
  - Nombre legal:  Joel Salazar Ramírez
  - RFC:           SARJ690821BC3
  - Régimen:       RESICO
  - Domicilio:     Antonio Arias Bernal #316, Barrio de Guadalupe,
                   CP 20059, Aguascalientes, Aguascalientes, México
  - Email único:   soporte@edugame.digital (mismo para soporte + privacidad)
  - Dominio:       edugame.digital
  - Procesador:    Lemon Squeezy
  - Refund window: 14 días
  - Analytics:     Ninguno (privacy-first)
  - Versión:       1.0
  - Fecha public:  2026-05-15

Operaciones:
  1. Para cada archivo HTML/TXT:
     a. Reemplazar <span class="placeholder">[X]</span> con valor real (sin span).
     b. Reemplazar [X] plano (sin span) con valor real.
  2. Verificar al final que NO queden placeholders sin rellenar.

Si quedan placeholders → exit 1 (falla).
"""
import re
import sys
from pathlib import Path

REPO = Path(r"D:\joel-salazar\OBS\EsperantAI")
DOCS = REPO / "docs"
LICENSE_TXT = REPO / "LICENSE.txt"

# Orden CRÍTICO: patrones más largos / más específicos primero, para que
# no se "coma" un placeholder corto que es substring de uno largo
# (ej. [CORREO PRIVACIDAD] vs [CORREO]).
REPLACEMENTS = [
    # — Placeholders compuestos (contienen otros placeholders como substring) —
    ("[NOMBRE LEGAL / RAZÓN SOCIAL]",                        "Joel Salazar Ramírez"),
    ("[CORREO PRIVACIDAD]",                                   "soporte@edugame.digital"),
    ("[DOMINIO/URL PRIVACIDAD]",                              "https://edugame.digital/docs/PRIVACY.html"),
    ("[MECANISMO DE BAJA]",
        "Envío de solicitud por correo a soporte@edugame.digital con asunto "
        "'BAJA DE DATOS', indicando nombre completo y dirección de correo "
        "asociada a la cuenta"),
    ("[CIUDAD/ESTADO]",                                       "Aguascalientes, Aguascalientes, México"),
    ("[LEMON SQUEEZY / PADDLE / FASTSPRING / OTRO]",          "Lemon Squeezy"),
    ("[INDICAR SI USAS GA4, PLAUSIBLE, FATHOM, META PIXEL, ETC.]",
        "Ninguno. EsperantAI no utiliza herramientas de análisis web ni "
        "cookies de seguimiento de terceros."),
    ("[CORREO LEGAL]",                                        "soporte@edugame.digital"),
    ("[NOMBRE LEGAL]",                                        "Joel Salazar Ramírez"),

    # — Placeholders simples —
    ("[RFC]",                "SARJ690821BC3"),
    ("[DOMICILIO]",          "Antonio Arias Bernal #316, Barrio de Guadalupe, CP 20059, Aguascalientes, Ags., México"),
    ("[FECHA]",              "2026-05-15"),
    ("[VERSIÓN]",            "1.0"),
    ("[NÚMERO]",             "1.0"),
    ("[CORREO]",             "soporte@edugame.digital"),
    ("[DOMINIO]",            "edugame.digital"),
    ("[14]",                 "14"),
]


def replace_in_file(path: Path) -> bool:
    """Return True if file was modified."""
    text = path.read_text(encoding="utf-8")
    original = text
    for pattern, value in REPLACEMENTS:
        # 1. Variante con span (HTMLs)
        wrapped = f'<span class="placeholder">{pattern}</span>'
        text = text.replace(wrapped, value)
        # 2. Variante plana (LICENSE.txt o casos sin span)
        text = text.replace(pattern, value)
    if text != original:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main():
    files = [
        DOCS / "EULA.html",
        DOCS / "TERMS_OF_SERVICE.html",
        DOCS / "PRIVACY.html",
        DOCS / "COOKIE_POLICY.html",
        DOCS / "PURCHASE_AND_LICENSE_TERMS.html",
        DOCS / "REFUND_POLICY.html",
        DOCS / "THIRD_PARTY_LICENSES.html",
        LICENSE_TXT,
    ]

    print("[1] Aplicando reemplazos...")
    modified = 0
    for f in files:
        if not f.exists():
            print(f"  [!] No existe: {f}")
            continue
        if replace_in_file(f):
            print(f"  [+] Modificado: {f.relative_to(REPO)}")
            modified += 1
        else:
            print(f"  [-] Sin cambios: {f.relative_to(REPO)}")

    print(f"\n  {modified}/{len(files)} archivos modificados")

    # Verificación: ningún placeholder debe quedar
    print("\n[2] Verificación: ¿quedaron placeholders sin rellenar?")
    placeholder_re = re.compile(r"\[[A-ZÁÉÍÓÚÑ/ 0-9.,]+\]")
    any_remaining = False
    for f in files:
        if not f.exists():
            continue
        text = f.read_text(encoding="utf-8")
        # Filtrar matches que sean realmente placeholders
        # (no fechas tipo [2026], aunque [14] sí lo fue antes)
        candidates = placeholder_re.findall(text)
        # Algunos pueden ser cosas que NO son placeholders (ej. citas, etc.)
        # Reportamos todos para revisión manual
        real_placeholders = [
            c for c in candidates
            # heurística: si el contenido es MAYÚSCULA o tiene comas o /,
            # probablemente es placeholder
            if any(k in c for k in ["NOMBRE", "RFC", "DOMICILIO", "FECHA",
                                     "CORREO", "DOMINIO", "VERSIÓN", "NÚMERO",
                                     "CIUDAD", "MECANISMO", "LEMON", "PADDLE",
                                     "GA4", "PLAUSIBLE", "META", "INDICAR"])
        ]
        if real_placeholders:
            print(f"  [!] {f.relative_to(REPO)}: {len(real_placeholders)} sin rellenar:")
            for p in set(real_placeholders):
                print(f"        {p}")
            any_remaining = True
        else:
            print(f"  [✓] {f.relative_to(REPO)}: limpio")

    if any_remaining:
        print("\n[!] ATENCIÓN: aún quedan placeholders. Revisar.")
        sys.exit(1)

    print("\n[3] Validar HTMLs (smoke test)")
    # Quick check: no roto tags
    for f in files:
        if f.suffix != ".html":
            continue
        text = f.read_text(encoding="utf-8")
        opens = text.count("<span")
        closes = text.count("</span>")
        if opens != closes:
            print(f"  [!] {f.name}: <span> abiertos={opens}, cerrados={closes}")
        else:
            print(f"  [✓] {f.name}: <span> balanceados ({opens})")

    print("\n[OK] Reemplazo completado. Revisar los archivos antes del commit.")


if __name__ == "__main__":
    main()
