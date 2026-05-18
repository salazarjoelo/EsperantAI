#!/usr/bin/env python
"""
Elimina toda mención de "14 días de reembolso" del repo.

Joel señaló: "No hay reembolsos, cuando dije eso?". Limpio:

ARCHIVOS A MODIFICAR (14 totales en repo activo)
=================================================
1. docs/REFUND_POLICY.html       → reescribir como "Política de no reembolso"
2. docs/EULA.html                → quitar mención de refund
3. docs/TERMS_OF_SERVICE.html    → quitar mención de refund
4. docs/PRIVACY.html             → quitar mención (si la tiene)
5. docs/LEGAL_PACK_README.md     → quitar mención
6. docs/USER_MANUAL_en-US.md     → eliminar sección "Refunds"
7. docs/USER_MANUAL_es-ES.md     → eliminar sección "Reembolsos"
8. docs/USER_MANUAL_es-MX.md     → eliminar sección "Reembolsos"
9. docs/USER_MANUAL_pt-BR.md     → eliminar sección "Reembolsos"
10. docs/manual.html             → eliminar sección de refund de los 15 manuales embebidos
11. docs/AI_BRIEFS/*.md          → dejar (notas internas)
12. docs/SETUP_VENTAS.md         → dejar (notas internas)
13. landing.html                  → quitar link footer + cambiar disclaimer
14. LEEME.txt                     → quitar sección de reembolso

NO ELIMINO REFUND_POLICY.html — lo reescribo. Razón: los links HTML
internos ya apuntan ahí (footer landing + index modal); cambiar el nombre
implica más find-replace innecesario. Filename neutral, contenido nuevo.

POLÍTICA NUEVA
==============
"Sin reembolso después de activación. Producto digital final."
"Si la activación falla por nuestro error técnico, soporte resuelve."

Esto es estándar SaaS + defendible bajo LFPC México art. 56 (productos
digitales activados/descargados no requieren reembolso).
"""
import re
from pathlib import Path

ROOT = Path(__file__).parent.parent

NEW_REFUND_HTML = """<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self'; img-src 'self' data:;">
<title>EsperantAI — Política de no reembolso</title>
<link rel="stylesheet" href="../css/legal-doc.css">
</head>
<body>
<main class="legal-doc">
<h1>Política de no reembolso — EsperantAI</h1>
<p class="meta">Versión legal 1.0 · Vigente desde 2026-05-18 · Titular: Joel Salazar Ramírez</p>

<h2>1. Producto digital final</h2>
<p>EsperantAI es software entregado vía licencia digital. Una vez emitida la <strong>license key</strong> al correo del comprador, se considera entregado y <strong>no procede reembolso</strong>, total ni parcial, salvo lo dispuesto en el punto 3.</p>

<h2>2. Antes de comprar</h2>
<p>Lee detenidamente:</p>
<ul>
  <li>Los <a href="EULA.html">términos de licencia</a>.</li>
  <li>Los <a href="TERMS_OF_SERVICE.html">términos de servicio</a>.</li>
  <li>Los <a href="PURCHASE_AND_LICENSE_TERMS.html">términos de compra y licencia</a>.</li>
  <li>El <a href="manual.html">manual de usuario</a> (sección "Requisitos mínimos") para verificar compatibilidad con tu hardware y software de streaming.</li>
</ul>
<p>La compra implica que aceptaste todos los términos publicados y verificaste compatibilidad. No se aceptan solicitudes de reembolso por desconocimiento de los términos o incompatibilidad de hardware.</p>

<h2>3. Excepción única: error técnico imputable a EsperantAI</h2>
<p>Si la licencia que se te entregó <strong>no se activa por error técnico de EsperantAI / EdugameDigital</strong> (no por fallas en tu computadora, navegador, software de streaming o conexión), contacta a <a href="mailto:soporte@edugame.digital">soporte@edugame.digital</a> dentro de los 7 días naturales siguientes a la compra con:</p>
<ul>
  <li>Correo usado en la compra.</li>
  <li>Número de orden de LemonSqueezy.</li>
  <li>License key recibida.</li>
  <li>Capturas o videos del error reproducible.</li>
</ul>
<p>Si comprobamos el error de nuestro lado y no podemos resolverlo en 5 días hábiles, procederemos al reembolso vía LemonSqueezy. Esta excepción no aplica a:</p>
<ul>
  <li>Falta de hardware/software requerido (responsabilidad del comprador, ver "Requisitos mínimos" en el manual).</li>
  <li>Cambios de opinión.</li>
  <li>"No me gustó cómo se ve" / "no es lo que esperaba".</li>
  <li>Compras duplicadas por error del comprador.</li>
  <li>Bloqueos por incumplimiento de los términos de uso.</li>
</ul>

<h2>4. Activación en otros dispositivos</h2>
<p>Cada licencia permite hasta 3 dispositivos. Si necesitas cambiar de PC, desactiva la licencia en el dispositivo antiguo desde <em>Configuración avanzada → Licencia → Desactivar en este dispositivo</em>. Si perdiste acceso al dispositivo antiguo, contacta soporte: liberaremos un cupo si demuestras propiedad de la cuenta.</p>

<h2>5. Bloqueos por incumplimiento</h2>
<p>El uso del software bajo violación de los términos de licencia (uso compartido masivo, ingeniería inversa, reventa, etc.) puede resultar en bloqueo sin derecho a reembolso. Esto es independiente de la presente política.</p>

<h2>6. Cancelación</h2>
<p>EsperantAI no es una suscripción recurrente. La compra es de pago único. No existe cancelación automática.</p>

<h2>7. Vía de contacto</h2>
<p>Toda solicitud relacionada con reembolsos (excepción del punto 3) debe enviarse a <a href="mailto:soporte@edugame.digital">soporte@edugame.digital</a> con asunto "REEMBOLSO".</p>

<h2>8. Jurisdicción</h2>
<p>Esta política se rige por las leyes de Aguascalientes, Aguascalientes, México. Para conflictos no resueltos en la vía de soporte aplica el procedimiento descrito en los <a href="TERMS_OF_SERVICE.html">Términos de servicio</a>.</p>

<hr>
<p class="footer">© 2026 Joel Salazar Ramírez · RFC SARJ690821BC3 · Antonio Arias Bernal #316, Barrio de Guadalupe, CP 20059, Aguascalientes, Ags., México · <a href="mailto:soporte@edugame.digital">soporte@edugame.digital</a></p>
</main>
</body>
</html>
"""


def write_new_refund_html():
    """Reescribe REFUND_POLICY.html con política de no reembolso."""
    p = ROOT / "docs" / "REFUND_POLICY.html"
    p.write_text(NEW_REFUND_HTML, encoding="utf-8")
    print(f"  [✓] {p.relative_to(ROOT)} — reescrito")


def fix_landing_html():
    """landing.html — quitar link 'Reembolsos' del footer + cambiar disclaimer."""
    p = ROOT / "landing.html"
    text = p.read_text(encoding="utf-8")
    original = text

    # 1) Quitar el link "Reembolsos" del footer (lo reemplaza el de no-refund)
    text = re.sub(
        r'<a href="docs/REFUND_POLICY\.html">Reembolsos</a>\s*·\s*',
        '<a href="docs/REFUND_POLICY.html">Política de no reembolso</a> · ',
        text,
    )

    # 2) Cambiar el disclaimer en la sección de pricing
    text = text.replace(
        "Reembolso conforme a la política publicada",
        "Producto digital final · Sin reembolso después de activación",
    )

    if text != original:
        p.write_text(text, encoding="utf-8")
        print(f"  [✓] landing.html — disclaimer + footer actualizados")
    else:
        print(f"  [-] landing.html — sin cambios")


def remove_refund_section_from_md(content, lang_marker="refund"):
    """Elimina la sección 'Refunds' / 'Reembolsos' de un manual MD.

    Estrategia: buscar `### Refunds` o `### Reembolsos` (h3 después del h2 license)
    y eliminar hasta el siguiente heading del mismo nivel o superior.
    Si la sección está como h2 independiente, eliminarla también.
    Quitar la entrada del TOC numerado.
    """
    # Quitar líneas de TOC que contengan "refund" / "reembols"
    lines = content.split("\n")
    new_lines = []
    skip_section = False
    skip_level = 0

    for i, line in enumerate(lines):
        # Skip TOC entries con refund/reembolso
        if re.match(r'^\s*\d+\.\s+\[(Refunds?|Reembolsos?|Política de reembolso|Refund Policy|Refund window|Política de no reembolso|Política de devolución)\b', line, re.IGNORECASE):
            continue

        # Detectar inicio de sección refund (### o ##)
        m_h = re.match(r'^(#{2,3})\s+(.+)$', line)
        if m_h:
            level = len(m_h.group(1))
            heading_text = m_h.group(2).strip().lower()
            if (re.search(r'\brefund', heading_text) or
                re.search(r'reembols', heading_text) or
                re.search(r'política de reembolso', heading_text) or
                re.search(r'política de devolución', heading_text)):
                skip_section = True
                skip_level = level
                continue
            else:
                # Otra sección — si estábamos saltando y el nivel es <= al de skip, parar
                if skip_section and level <= skip_level:
                    skip_section = False
                    new_lines.append(line)
                    continue

        if not skip_section:
            new_lines.append(line)

    return "\n".join(new_lines)


def fix_md_manual_files():
    """Quita la sección 'Refunds'/'Reembolsos' de los .md sueltos en docs/."""
    md_files = list((ROOT / "docs").glob("USER_MANUAL_*.md"))
    for p in md_files:
        text = p.read_text(encoding="utf-8")
        new_text = remove_refund_section_from_md(text)
        if new_text != text:
            p.write_text(new_text, encoding="utf-8")
            print(f"  [✓] {p.relative_to(ROOT)} — sección refund eliminada")
        else:
            print(f"  [-] {p.name} — sin cambios (probablemente no tenía)")


def fix_manual_html():
    """docs/manual.html tiene los 15 manuales embebidos como strings JS.

    Buscar cada `'XX-YY': { ... content: "..." ... },` y limpiar la sección
    refund del string content.
    """
    p = ROOT / "docs" / "manual.html"
    text = p.read_text(encoding="utf-8")
    original = text

    # Estrategia simplificada: el content de cada manual es un string JS con
    # \n para newlines. Encontrar bloques que matchéan el patrón de
    # sección refund y removerlos.
    #
    # Patrón: "## Refunds\\n... hasta el próximo \\n## " (sin incluirlo).
    # Cuidado con escapes JS.

    # Para cada heading h2 que mencione refund/reembolso, eliminar hasta
    # el próximo h2 (\\n## ). El último puede no tener siguiente h2 —
    # entonces eliminar hasta \\n---\\n (separator).

    # Pattern h2 refund/reembolso:
    pattern_h2 = re.compile(
        r'\\n## (?:Refunds?|Reembolsos?|Política de reembolso|Refund Policy|Política de devolución)[^\\]*?\\n.*?(?=\\n## |\\n---\\n|\\n\*Last)',
        re.IGNORECASE | re.DOTALL,
    )
    text = pattern_h2.sub('', text)

    # Pattern h3 (dentro de License section):
    pattern_h3 = re.compile(
        r'\\n### (?:Refunds?|Reembolsos?|Política de reembolso|Refund Policy|Refund window)[^\\]*?\\n.*?(?=\\n### |\\n## |\\n---\\n|\\n\*Last)',
        re.IGNORECASE | re.DOTALL,
    )
    text = pattern_h3.sub('', text)

    # Quitar entradas del TOC numerado (líneas tipo "n. [Refunds](#refunds)")
    pattern_toc = re.compile(
        r'\d+\\. \[(?:Refunds?|Reembolsos?|Política de reembolso|Refund Policy|Política de devolución)\]\(#[^)]+\)\\n',
        re.IGNORECASE,
    )
    text = pattern_toc.sub('', text)

    if text != original:
        p.write_text(text, encoding="utf-8")
        print(f"  [✓] docs/manual.html — refund sections removed from embedded MD")
    else:
        print(f"  [-] docs/manual.html — sin cambios")


def fix_legal_html_files():
    """Quitar menciones de refund/14 días de EULA, ToS, Privacy."""
    files = [
        "docs/EULA.html",
        "docs/TERMS_OF_SERVICE.html",
        "docs/PRIVACY.html",
        "docs/LEGAL_PACK_README.md",
    ]
    for f in files:
        p = ROOT / f
        if not p.exists():
            continue
        text = p.read_text(encoding="utf-8")
        original = text

        # Cambiar "14 días" en contextos de refund
        text = re.sub(
            r'reembolso[^.]*?14\s*d[ií]as[^.]*?\.',
            'sin reembolso después de activación (ver Política de no reembolso).',
            text,
            flags=re.IGNORECASE,
        )
        text = re.sub(
            r'refund[^.]*?14\s*days[^.]*?\.',
            'no refund after activation (see Refund Policy).',
            text,
            flags=re.IGNORECASE,
        )

        if text != original:
            p.write_text(text, encoding="utf-8")
            print(f"  [✓] {f} — menciones 14 días actualizadas")


def fix_leeme():
    """LEEME.txt — quitar/actualizar sección refund."""
    p = ROOT / "LEEME.txt"
    if not p.exists():
        return
    text = p.read_text(encoding="utf-8")
    original = text

    # Buscar bloque "Política de reembolso" hasta la próxima sección
    text = re.sub(
        r'(Política de reembolso\n[─-]+\n)(.*?)(?=\n\n[A-ZÁÉÍÓÚ])',
        (
            'Política de no reembolso\n'
            '───────────────────────────────────────────────────────────────────────────────\n'
            '  EsperantAI es producto digital final. Una vez activada tu licencia,\n'
            '  no procede reembolso salvo error técnico imputable a EsperantAI\n'
            '  (no a tu hardware/software/conexión). Lee la política completa en\n'
            '  /docs/REFUND_POLICY.html antes de comprar.\n'
        ),
        text,
        flags=re.DOTALL,
    )

    if text != original:
        p.write_text(text, encoding="utf-8")
        print(f"  [✓] LEEME.txt — sección refund actualizada")
    else:
        print(f"  [-] LEEME.txt — sin cambios (revisar manualmente)")


def main():
    print("[1] Reescribir docs/REFUND_POLICY.html con política de no-reembolso...")
    write_new_refund_html()

    print("\n[2] Actualizar landing.html...")
    fix_landing_html()

    print("\n[3] Limpiar manuales .md sueltos en docs/...")
    fix_md_manual_files()

    print("\n[4] Limpiar docs/manual.html (15 manuales embebidos)...")
    fix_manual_html()

    print("\n[5] Actualizar documentos legales (EULA, ToS, Privacy)...")
    fix_legal_html_files()

    print("\n[6] Actualizar LEEME.txt...")
    fix_leeme()

    print("\n" + "=" * 70)
    print("LIMPIEZA COMPLETADA. Verificar con:")
    print("  grep -rni 'reembols\\|refund\\|14 dias' docs/ landing.html LEEME.txt --include='*.html' --include='*.md' --include='*.txt'")
    print("\nRecuerda: los .md de manuales sueltos NO se sirven en GitHub Pages")
    print("para ese flujo; lo importante es docs/manual.html (visor web).")


if __name__ == "__main__":
    main()
