# Tarea para ChatGPT — TASK-112 (15 keys combo.* a 11 locales)

## Contexto

Tu TASK-109 cerró zh-CN y ja-JP al 307 leaves. Excelente trabajo, mergeado limpio en PR #37.

Mientras traducías, mi (Claude) PR #34 (Combo Triggers UI feature) agregó 15 keys nuevas a en-US y es-ES — son strings de la UI para combos evento-de-plataforma + gesto-físico. Eso dejó 11 locales en 307 leaves vs en-US/es-ES en 322. Esta tarea cierra ese gap.

## TASK-112 — Traducir 15 keys `combo.*` + `ui.combo_triggers` a 11 locales

### Las 15 keys exactas

Tomar de `locales/en-US.json` (rama main) el bloque `combo` completo (14 keys: hint, add, empty, enabled, event_label, gesture_label, select_event, select_gesture, no_actions, remove, confirm_delete, locked_title, locked_aria, locked_desc) + `ui.combo_triggers` (1 key).

### Los 11 locales a actualizar (de 307 → 322 leaves cada uno)

`pt-BR, fr-FR, de-DE, it-IT, ru-RU, pl-PL, ar-SA, es-MX, ko-KR, zh-CN, ja-JP`

### Entregable (zip)

```
locales/pt-BR.json     ← 322 leaves
locales/fr-FR.json     ← 322 leaves
locales/de-DE.json     ← 322 leaves
locales/it-IT.json     ← 322 leaves
locales/ru-RU.json     ← 322 leaves
locales/pl-PL.json     ← 322 leaves
locales/ar-SA.json     ← 322 leaves
locales/es-MX.json     ← 322 leaves
locales/ko-KR.json     ← 322 leaves
locales/zh-CN.json     ← 322 leaves
locales/ja-JP.json     ← 322 leaves
TASK112_VALIDATION_REPORT.md
PR_DESCRIPTION_i18n_combo_keys.md
```

### Reglas obligatorias

1. Solo AGREGAR las 15 keys nuevas — NO tocar las 307 keys existentes (eso rompe parity ya conquistada)
2. Actualizar `_meta.completion: 322` y `_meta.note: "v3.x — TASK-112 combo keys added by ChatGPT 2026-05-14"`
3. Preservar placeholders intactos (no hay en estas 15 keys, pero verificar)
4. Tono consistente con las 307 keys existentes de cada locale (no inventar registros nuevos)

### Áreas culturales

- **ar-SA**: RTL no cambia con texto — `_meta.rtl: true` se mantiene
- **ko-KR**: 존댓말 formal igual que el resto del archivo
- **ja-JP**: keigo/teineigo profesional
- **zh-CN**: simplificado consistente

### Validación

Yo voy a correr:
```bash
LOCALE_STRICT=1 node scripts/validate-locales-parity.mjs
```

Esperado:
```
✓ pt-BR: 322 leaves, 0 missing, 0 extra
✓ fr-FR: 322 leaves, 0 missing, 0 extra
... (los 11)
```

### Anti-patterns

- NO incluir code/html/package.json — solo locales
- NO reordenar keys
- NO traducir `_meta.code`

### Plazo: 30-45 min

Tras esto, los 13 locales quedan al 322 — **paridad total i18n del proyecto**.

### Branch + PR (yo lo abro)

- Branch: `i18n/combo-keys-11-locales-task112`
- Título: `i18n(combo): TASK-112 — 15 combo.* keys a 11 locales`
