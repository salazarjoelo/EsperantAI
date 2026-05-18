#!/usr/bin/env python
"""Remove the 'Refund requests: 1-2 business days' bullet from the Support
section in all 15 languages embedded in docs/manual.html."""
import re
from pathlib import Path

p = Path(__file__).parent.parent / "docs" / "manual.html"
text = p.read_text(encoding="utf-8")
original = text

# Patrones: línea "  - Refund/Reembolso/etc: ...\\n" dentro de strings JS
# El \n en JS es literal '\\n' (backslash + n) en el contenido del HTML.
patterns_strings = [
    "Refund requests:",
    "Solicitudes de reembolso:",
    "Solicitudes de devolución:",
    "Pedidos de reembolso:",
    "退款申請",
    "退款请求",
    "返金リクエスト",
    "환불 요청",
    "Возврат средств:",
    "Zwroty:",
    "Rückerstattungs",
    "Demandes de remboursement",
    "Richieste di rimborso",
    "طلبات الاسترداد",
    "रिफंड अनुरोध",
    "Permintaan pengembalian",
]

removed = 0
for needle in patterns_strings:
    # Find each occurrence and remove the line (between two \n inside JS string)
    # Pattern: \\n... (anything up to needle and ending) ...\\n → \\n
    # Buscar más bien la línea entera que contiene "needle".
    # En el HTML está como  "...something\\n  - <needle> X\\nnext line..."
    # Necesito: encontrar el patrón "\\n  - <needle>...\\n" y reemplazar por "\\n"
    rx = re.compile(r'\\n\s*[-•]\s*' + re.escape(needle) + r'[^\\]*?(?=\\n)')
    new_text, n = rx.subn('', text)
    if n > 0:
        print(f"  [-] {n} occurrence(s) of '{needle[:40]}'")
        removed += n
        text = new_text

if text != original:
    p.write_text(text, encoding="utf-8")
    print(f"\nTotal removed: {removed} lines from docs/manual.html")
else:
    print("No matches removed")
