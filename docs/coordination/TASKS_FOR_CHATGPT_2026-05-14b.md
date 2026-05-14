# Tarea para ChatGPT — TASK-108 (continuación de TASK-107)

## Estado al 2026-05-14 16:30

**Tu entrega anterior (TASK-107):** los 7 JSONs EU/LatAm (pt-BR, fr-FR, de-DE, it-IT, ru-RU, pl-PL, ar-SA) pasaron la validación STRICT al 100%. Mergeo limpio. **Excelente trabajo.**

**Lo que falta:** 2 locales más siguen como stubs incompletos en `main`. Una vez que entregues estos 2, todos los locales de EsperantAI quedan al 307 leaves de paridad (excepto zh-CN y ja-JP que requieren una ronda menor para sumar las 42 keys de `calibration.*` — eso es separado).

---

## TASK-108 — Completar ko-KR + es-MX a 307 leaves

### Estado actual de cada locale (medido con `node scripts/validate-locales-parity.mjs`)

| Locale | Leaves actuales | Missing | Extra | Notas |
|---|---|---|---|---|
| ko-KR | 145 | 162 | 0 | Stub original — traducir 162 keys |
| es-MX | 146 | 162 | 1 (`_NOTE`) | Stub viejo + key obsoleta a eliminar |

### Entregable

**Igual que en TASK-107: zip con 2 archivos JSON.**

- `locales/ko-KR.json` — 307 leaves, paridad total con `en-US.json` post-#17/#18/#19/#20/TASK-107
- `locales/es-MX.json` — 307 leaves, paridad total, **sin la key `_NOTE` del top-level** (eliminarla)

Cada archivo debe:
1. Tener **EXACTAMENTE las 307 keys** que `en-US.json` tras todos los merges actuales.
2. Conservar el bloque `_meta` con:
   - `language`: `"한국어"` para ko-KR, `"Español (México)"` para es-MX
   - `code`: `"ko-KR"` / `"es-MX"`
   - `rtl`: `false` para ambos
   - `completion`: `307` (entero)
   - `note`: `"v2.0 — TASK-108 by ChatGPT 2026-05-14"`
   - `translator`: `"AI-generated — needs native [Korean|Mexican Spanish] speaker review"`
3. **Preservar placeholders** `{tier}`, `{count}`, `{max}`, `{attempt}`, `{ms}`, `{message}`, `{width}`, `{height}`, `{frames}`, `{backend}` — sin traducirlos.
4. **No tocar `app.title`** — siempre `"EsperantAI"`.
5. **Mantener emojis** que ya están en strings de `en-US`.

### Matices culturales importantes

**Coreano (ko-KR):**
- **Nivel de cortesía**: usa **존댓말 (jondaetmal)** — forma formal/respetuosa con terminación `-습니다` / `-ㅂ니다`. EsperantAI se dirige al streamer con respeto profesional, no `반말` (banmal) casual.
- **scenes.gassho**: traducir como `합장 (감사)` — el saludo budista usando los caracteres Hanja apropiados. Si tienes duda, deja `합장` solo.
- **Términos técnicos aeronáuticos**: `metrics.yaw_label = "Yaw (←/→)"` se mantiene tal cual (palabra inglesa aceptada en coreano técnico).
- **triggers.universal_desc** menciona "Ekman 1972" — mantener la cita académica intacta.
- **Vocabulario streamer**: en Corea los streamers usan plataformas como Twitch + 아프리카TV (AfreecaTV) + YouTube. Para `hints.platform_hint` puedes usar terminología coreana de streaming (별풍선 = star balloons en AfreecaTV, pero quizás mejor mantener neutral con "구독, 후원, 레이드" = subscriptions, donations, raids).

**Español de México (es-MX):**
- **Diferencias clave vs es-ES (que ya está completo en main):**
  - "computadora" (no "ordenador")
  - "tú" (no "vosotros") — México usa tú/ustedes, nunca vosotros
  - "saludar/¡hola!" más casual; menos formal que peninsular
  - "video" sin acento (no "vídeo")
  - "checa", "checar" (no "comprobar/comprobar")
  - "tarjeta de video" (no "tarjeta gráfica") — opcional
- **No copiar es-ES literal.** Adapta tono mexicano: amistoso, directo, sin formalismo peninsular.
- **scenes.gassho**: en México "saludo con palmas juntas" o simplemente "gassho" si se prefiere el término japonés (audiencia VTuber/anime mexicana lo conoce).
- **Mantener placeholders** y términos técnicos igual que en es-ES.
- **Importante**: el archivo actual de es-MX tiene una key obsoleta `_NOTE` al top-level (fuera de `_meta`). **ELIMÍNALA** en la versión nueva.

### Validación que debe pasar

Yo voy a correr:
```bash
LOCALE_STRICT=1 node scripts/validate-locales-parity.mjs
```

El script `scripts/validate-locales-parity.mjs` ya está en `main` (PR #20). Tu entrega debe dar:
```
✓ ko-KR: 307 leaves, 0 missing, 0 extra, 0 bad placeholders, 0 untranslated
✓ es-MX: 307 leaves, 0 missing, 0 extra, 0 bad placeholders, 0 untranslated
```

Si reporta `extra > 0` para es-MX → no eliminaste `_NOTE` (revísalo).
Si reporta `untranslated > 0` y la string es legítimamente igual al inglés (ej. una palabra latina compartida) → no hay problema, es falso positivo del validador.

### Anti-patterns prohibidos

1. **NO incluyas `package.json`, `index.html` ni código fuente** — solo `locales/*.json`.
2. **NO reordenes las keys** (preserva orden de `en-US`).
3. **NO inventes keys** que no estén en `en-US`.
4. **NO traduzcas `_meta.code`**.
5. **NO copies es-ES literal para hacer es-MX** — adapta dialecto mexicano. Si tienes duda en una key, leer la versión en-US (no la es-ES).
6. **NO uses honoríficos casuales en ko-KR** (반말). Mantén 존댓말.

### Cómo entregar

Mismo formato que TASK-107: **zip** con:
```
locales/ko-KR.json
locales/es-MX.json
TASK108_VALIDATION_REPORT.md   ← tu auto-report
PR_DESCRIPTION_i18n_ko_kr_es_mx.md   ← descripción para el PR
```

Joel me lo pasa, yo corro la validación STRICT, abro PR, mergeo.

### Cuando termines

Si te quedan créditos, pásale el siguiente brief a Joel — te puede pedir uno de estos por orden de prioridad:

1. **TASK-109**: traducir las 42 keys de `calibration.*` + `advanced.calibration*` a los 9 locales no-inglés que ya están al 307 (cuando se decida sumar calibration support). Pero **esto ya está mergeado en en-US/es-ES + tus 7 EU/LatAm con keys vacías** — re-verificar si realmente faltan.
2. **TASK-110**: doc `docs/TROUBLESHOOTING.md` bilingüe en/es (problema → causa → solución).
3. **TASK-111**: copy de landing.html con A/B variants para marketing.

Espera mi siguiente brief — no arranques estos sin que Joel confirme.

---

## Referencias rápidas

- `en-US.json` actual en `main`: https://github.com/salazarjoelo/EsperantAI/blob/main/locales/en-US.json
- `es-ES.json` (referencia para tono peninsular vs mexicano): https://github.com/salazarjoelo/EsperantAI/blob/main/locales/es-ES.json
- Validador estructural: `scripts/validate-locales-parity.mjs`

**Plazo estimado:** 20-30 minutos para 2 archivos. Mismo workflow que tu TASK-107 exitoso.
