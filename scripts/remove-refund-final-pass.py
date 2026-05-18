#!/usr/bin/env python
"""Final pass: remove remaining refund mentions in pt-BR, de-DE, pl-PL,
ru-RU, ar-SA inside docs/manual.html embedded strings."""
import re
from pathlib import Path

p = Path(__file__).parent.parent / "docs" / "manual.html"
text = p.read_text(encoding="utf-8")
original = text

# Bullets en líneas de Support → Response times (lo que faltó del pass anterior)
extra_bullet_patterns = [
    "Solicitações de reembolso",   # pt-BR
    "Запросы на возврат",          # ru-RU
    "Żądania zwrotu",              # pl-PL
    "طلبات استرداد",                # ar-SA (variante)
]
for needle in extra_bullet_patterns:
    rx = re.compile(r'\\n\s*[-•]\s*' + re.escape(needle) + r'[^\\]*?(?=\\n)')
    new, n = rx.subn('', text)
    if n > 0:
        print(f"  bullet [-] {n} of '{needle[:30]}'")
        text = new

# Headings + párrafos de Refund Policy en idiomas con sección completa.
# Para cada idioma, eliminar la sección entera empezando en el h3/h2 y
# terminando ANTES del siguiente h2/h3 o final del documento.
#
# El contenido está en strings JS escapados (\\n = newline literal).
# Pattern: "\\n## <heading>\\n... hasta \\n## o \\n---\\n"

# Headings de Refund Policy por idioma:
refund_h_phrases = [
    "Política de no reembolso",  # span tras nuestro fix
    "Política de reembolso",
    "Política de devolução",      # pt-BR
    "Política de devoluciones",   # es alternativo
    "Rückerstattung",             # de-DE
    "Rückerstattungsrichtlinie",
    "Zwroty środków",             # pl-PL
    "Polityka zwrotów",           # pl-PL alternativo
    "Возврат средств",            # ru-RU
    "Политика возврата",          # ru-RU alternativo
    "استرداد المبالغ",             # ar-SA
    "سياسة الاسترداد",            # ar-SA alternativo
    "返金ポリシー",                # ja-JP
    "환불 정책",                   # ko-KR
    "退款政策",                    # zh-CN
    "Politique de remboursement", # fr-FR
    "Rimborsi",                   # it-IT
    "Politika pengembalian",      # id-ID (banner)
]

# H3 patterns: \\n### <phrase>\\n...content...\\n(### or ## or ---)
h3_pattern = re.compile(
    r'\\n###?\s+(' + '|'.join(re.escape(p) for p in refund_h_phrases) +
    r')[^\\]*?\\n.*?(?=\\n##|\\n---|\*Last\sUpdated)',
    re.DOTALL | re.IGNORECASE,
)
new, n = h3_pattern.subn('', text)
if n > 0:
    print(f"  refund-section [-] {n} block(s) removed")
    text = new

# Párrafos sueltos que mencionan refund/reembolso fuera de una sección formal
# Patrón: "If EsperantAI doesn't meet... 14 days... contact..." en varios idiomas
para_patterns = [
    # de-DE
    r'Wenn EsperantAI nicht Ihren Erwartungen entspricht[^\\]*?Lizenzschlüssel\.',
    # ru-RU
    r'Если EsperantAI не оправдал ваших ожиданий[^\\]*?ключа\.',
    # pl-PL
    r'Jeśli EsperantAI nie spełnia[^\\]*?licencyjny\.',
    # ar-SA
    r'إذا لم يلبِّ EsperantAI[^\\]*?الترخيص\.',
    # generic if a refund-related paragraph slips through
    r'If EsperantAI doesn.t meet your expectations[^\\]*?refund[^\\]*?\.',
    r'Si EsperantAI no cumple tus expectativas[^\\]*?reembolso[^\\]*?\.',
]
for pp in para_patterns:
    try:
        rx = re.compile(pp, re.IGNORECASE | re.DOTALL)
        new, n = rx.subn('', text)
        if n > 0:
            print(f"  paragraph [-] {n} block(s) matching: {pp[:50]}...")
            text = new
    except re.error as e:
        print(f"  [!] regex error: {e} for {pp[:30]}")

if text != original:
    p.write_text(text, encoding="utf-8")
    print(f"\nFile updated. Bytes diff: {len(text) - len(original)}")
else:
    print("No changes")
