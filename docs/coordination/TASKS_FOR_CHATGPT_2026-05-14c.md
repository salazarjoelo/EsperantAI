# Tarea para ChatGPT — TASK-109 (cerrar zh-CN y ja-JP)

## Estado al 2026-05-14 17:30

Tus entregas TASK-107 + TASK-108 cerraron 9 locales a 307 leaves cada uno. Solo quedan **2 locales en 265 leaves**:
- `zh-CN` (中文简体)
- `ja-JP` (日本語)

Les faltan **42 keys** cada uno que se agregaron en PR #18 (Calibration Wizard de Z-SEC TASK-102): el bloque `calibration.*` (39 keys) + `advanced.calibration` + `advanced.calibration_desc` + `advanced.recalibrate`.

---

## TASK-109 — Completar zh-CN + ja-JP a 307 leaves

### Estado actual (medido con `node scripts/validate-locales-parity.mjs`)

| Locale | Leaves | Missing | Notas |
|---|---|---|---|
| zh-CN | 265 | 42 | Faltan `calibration.*` + 3 keys `advanced.*` |
| ja-JP | 265 | 42 | Mismo gap |

### Las 42 keys exactas que debes traducir

**Top-level `calibration` (39 leaves):**
Las claves exactas están en `locales/en-US.json` (descarga desde GitHub la rama main). Copia la estructura y traduce solo los valores. Es 1 objeto top-level `calibration` con sub-claves anidadas (kicker, steps.welcome_title, steps.baseline_title, etc., capturing, baseline_desc, hand_desc, etc.).

**Top-level `advanced` (3 claves nuevas):**
- `advanced.calibration` (label del details panel)
- `advanced.calibration_desc` (descripción muted)
- `advanced.recalibrate` (label del botón)

### Entregable

**Mismo formato que TASK-107/108: zip con:**
```
locales/zh-CN.json    ← versión completa 307 leaves
locales/ja-JP.json    ← versión completa 307 leaves
TASK109_VALIDATION_REPORT.md
PR_DESCRIPTION_i18n_zh_ja_calibration.md
```

**Reglas obligatorias:**
1. Tomar el JSON existente de zh-CN/ja-JP de main, agregar SOLO las 42 keys nuevas (no tocar las 265 existentes).
2. Preservar `_meta` existente pero actualizar:
   - `completion: 307`
   - `note: "v3.0 — TASK-109 calibration keys added by ChatGPT 2026-05-14"`
3. NO traducir términos técnicos universales:
   - "Yaw", "Pitch", "Roll" → mantener en inglés (igual que metrics.*)
   - Placeholders `{count}`, `{target}`, etc. → intactos
4. NO traducir nombres propios:
   - "Ekman 1972" en cualquier reference científica → mantener
   - "EsperantAI" → mantener

### Matices culturales

**Coreano y japonés:**
- **chino**: usa simplificado (estás haciendo zh-CN, no zh-TW). Mantén consistencia con las 265 keys ya traducidas.
- **japonés**: usa keigo / teineigo (forma educada `です/ます`) consistente con las keys existentes.
- **calibration kicker** ("Personalized setup") — traducir como concepto, no literal.
- **safety factor** — concepto técnico, "余裕係数" en japonés, "安全系数" en chino, o paráfrasis si suena mejor.

### Validación que debe pasar

Yo voy a correr:
```bash
LOCALE_STRICT=1 node scripts/validate-locales-parity.mjs
```

Tu entrega debe dar:
```
✓ zh-CN: 307 leaves, 0 missing, 0 extra, 0 bad placeholders
✓ ja-JP: 307 leaves, 0 missing, 0 extra, 0 bad placeholders
```

Untranslated > 0 puede ser falso positivo (términos técnicos universales) — no es bloqueante.

### Anti-patterns prohibidos

1. NO sobreescribir las 265 keys existentes. Solo agregar las 42 nuevas.
2. NO incluir code, package.json, html — solo `locales/zh-CN.json` y `locales/ja-JP.json`.
3. NO inventar claves que no estén en en-US.
4. NO usar Google Translate sin revisar — el _meta.translator ya advierte "AI-generated, needs native review". Pero ese disclaimer no excusa errores básicos: "calibration" en chino NO es 校准 si las otras keys de la misma sección usan otro término.

### Branch + PR (no necesitas hacerlo, lo hago yo)

- Branch sugerido: `i18n/zh-ja-calibration-task109`
- Título PR: `i18n(zh-ja): TASK-109 — 42 keys calibration agregadas`

### Plazo estimado: 30 minutos

Ya conoces el formato (lo hiciste impecable en TASK-107 y TASK-108).
